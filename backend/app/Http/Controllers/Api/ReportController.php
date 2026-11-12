<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Enquiry;
use App\Models\Member;
use App\Models\Programme;
use App\Models\Project;
use App\Models\Resource;
use App\Models\TrainingEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    /**
     * Summary figures for the Reports page (super administrators only).
     */
    public function index(): JsonResponse
    {
        $today = now()->toDateString();

        $published = fn (string $model) => [
            'published' => $model::where('status', 'published')->count(),
            'draft' => $model::where('status', 'draft')->count(),
        ];

        return response()->json([
            'generated_at' => now()->toIso8601String(),

            'members' => [
                'total' => Member::count(),
                'active' => Member::where('status', 'active')->count(),
                'inactive' => Member::where('status', 'inactive')->count(),
                'by_county' => $this->grouped('members', 'county'),
                'by_gender' => $this->grouped('members', 'gender'),
                'joined_per_month' => $this->perMonth('members', 'membership_date'),
            ],

            'content' => [
                'programmes' => $published(Programme::class),
                'projects' => $published(Project::class),
                'resources' => $published(Resource::class),
                'news' => $published(Announcement::class),
                'events' => [
                    'upcoming' => TrainingEvent::where('status', 'published')
                        ->whereRaw('coalesce(end_date, start_date) >= ?', [$today])->count(),
                    'past' => TrainingEvent::whereRaw('coalesce(end_date, start_date) < ?', [$today])->count(),
                    'draft' => TrainingEvent::where('status', 'draft')->count(),
                ],
            ],

            'enquiries' => [
                'total' => Enquiry::count(),
                'new' => Enquiry::where('status', 'new')->count(),
                'read' => Enquiry::where('status', 'read')->count(),
                'responded' => Enquiry::where('status', 'responded')->count(),
                'by_subject' => $this->grouped('enquiries', 'subject'),
                'received_per_month' => $this->perMonth('enquiries', 'created_at'),
            ],
        ]);
    }

    public function membersCsv(): StreamedResponse
    {
        $rows = Member::orderBy('membership_number')->cursor()->map(fn (Member $m) => [
            $m->membership_number,
            $m->first_name,
            $m->last_name,
            $m->gender,
            $m->date_of_birth?->format('Y-m-d'),
            $m->phone,
            $m->email,
            $m->physical_address,
            $m->county,
            $m->membership_date?->format('Y-m-d'),
            $m->status,
        ]);

        return $this->csv(
            'lewoco-members-'.now()->format('Y-m-d').'.csv',
            ['Membership number', 'First name', 'Last name', 'Gender', 'Date of birth', 'Phone', 'Email', 'Physical address', 'County', 'Membership date', 'Status'],
            $rows,
        );
    }

    public function enquiriesCsv(): StreamedResponse
    {
        $rows = Enquiry::orderByDesc('created_at')->cursor()->map(fn (Enquiry $e) => [
            $e->created_at?->format('Y-m-d H:i'),
            $e->full_name,
            $e->email,
            $e->phone,
            $e->subject,
            $e->status,
            $e->message,
            $e->notes,
        ]);

        return $this->csv(
            'lewoco-enquiries-'.now()->format('Y-m-d').'.csv',
            ['Received', 'Name', 'Email', 'Phone', 'Subject', 'Status', 'Message', 'Internal notes'],
            $rows,
        );
    }

    /**
     * Count rows by a text column. Blank values are grouped as "Not specified".
     * $table and $column are fixed strings from this class, never user input.
     */
    private function grouped(string $table, string $column): array
    {
        return DB::table($table)
            ->selectRaw("coalesce(nullif(trim({$column}), ''), 'Not specified') as label, count(*) as total")
            ->groupBy('label')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(fn ($row) => ['label' => $row->label, 'count' => (int) $row->total])
            ->all();
    }

    /**
     * Rows per month for the last 12 months, including months with none.
     */
    private function perMonth(string $table, string $column): array
    {
        $start = now()->startOfMonth()->subMonths(11);

        $counts = DB::table($table)
            ->selectRaw("to_char({$column}, 'YYYY-MM') as month, count(*) as total")
            ->where($column, '>=', $start->toDateString())
            ->groupBy('month')
            ->pluck('total', 'month');

        $months = [];

        for ($i = 0; $i < 12; $i++) {
            $month = now()->startOfMonth()->subMonths(11 - $i);

            $months[] = [
                'month' => $month->format('Y-m'),
                'label' => $month->format('M Y'),
                'count' => (int) ($counts[$month->format('Y-m')] ?? 0),
            ];
        }

        return $months;
    }

    private function csv(string $filename, array $headers, iterable $rows): StreamedResponse
    {
        return response()->streamDownload(function () use ($headers, $rows) {
            $out = fopen('php://output', 'w');

            fwrite($out, "\xEF\xBB\xBF"); // lets Excel read accents correctly
            fputcsv($out, $headers);

            foreach ($rows as $row) {
                fputcsv($out, array_map([$this, 'safeCell'], $row));
            }

            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    /**
     * Stop spreadsheet programs treating text as a formula (CSV injection).
     * Phone-style values such as +254 722 937900 are left as they are.
     */
    private function safeCell(mixed $value): string
    {
        $value = (string) ($value ?? '');

        if (preg_match('/^\+[0-9 ()\-]+$/', $value)) {
            return $value;
        }

        return preg_match('/^[=+\-@\t\r]/', $value) ? "'".$value : $value;
    }
}
