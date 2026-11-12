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
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Overview figures and recent records for the dashboard.
     * Member information is included for super administrators only.
     */
    public function index(Request $request): JsonResponse
    {
        $isSuper = $request->user()->role === User::ROLE_SUPER_ADMIN;
        $today = now()->toDateString();

        $upcoming = fn ($query) => $query->whereRaw('coalesce(end_date, start_date) >= ?', [$today]);

        $stats = [
            'programmes' => [
                'published' => Programme::where('status', 'published')->count(),
                'draft' => Programme::where('status', 'draft')->count(),
            ],
            'projects' => [
                'published' => Project::where('status', 'published')->count(),
                'draft' => Project::where('status', 'draft')->count(),
            ],
            'events' => [
                'upcoming' => TrainingEvent::where('status', 'published')->tap($upcoming)->count(),
                'draft' => TrainingEvent::where('status', 'draft')->count(),
            ],
            'enquiries' => [
                'new' => Enquiry::where('status', 'new')->count(),
                'total' => Enquiry::count(),
            ],
        ];

        if ($isSuper) {
            $stats['members'] = [
                'total' => Member::count(),
                'active' => Member::where('status', 'active')->count(),
            ];
        }

        // Latest records added, newest first
        $recent = collect();

        $add = function ($models, string $label, callable $text, string $link) use (&$recent) {
            foreach ($models as $model) {
                $recent->push([
                    'label' => $label,
                    'text' => $text($model),
                    'link' => $link,
                    'at' => $model->created_at?->toIso8601String(),
                ]);
            }
        };

        $add(Enquiry::latest()->limit(5)->get(), 'Enquiry', fn ($m) => "{$m->full_name}: {$m->subject}", '/admin/enquiries');
        $add(Programme::latest()->limit(3)->get(), 'Programme', fn ($m) => $m->title, '/admin/programmes');
        $add(Project::latest()->limit(3)->get(), 'Project', fn ($m) => $m->title, '/admin/projects');
        $add(TrainingEvent::latest()->limit(3)->get(), 'Event', fn ($m) => $m->title, '/admin/events');
        $add(Announcement::latest()->limit(3)->get(), 'News', fn ($m) => $m->title, '/admin/news');
        $add(Resource::latest()->limit(3)->get(), 'Resource', fn ($m) => $m->title, '/admin/resources');

        if ($isSuper) {
            $add(Member::latest()->limit(5)->get(), 'Member', fn ($m) => "{$m->first_name} {$m->last_name}", '/admin/members');
        }

        return response()->json([
            'stats' => $stats,
            'recent' => $recent->sortByDesc('at')->take(8)->values(),
        ]);
    }
}
