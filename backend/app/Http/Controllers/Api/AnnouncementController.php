<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AnnouncementController extends Controller
{
    /**
     * List news and announcements (administrators), newest first.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Announcement::query();

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('category', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json(
            $query->orderByRaw('published_at desc nulls last')->orderByDesc('id')->paginate(15)
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'published_at' => ['nullable', 'date'],
            'status' => ['nullable', Rule::in([Announcement::STATUS_DRAFT, Announcement::STATUS_PUBLISHED])],
        ]);

        $announcement = Announcement::create([
            ...$validated,
            'status' => $validated['status'] ?? Announcement::STATUS_DRAFT,
        ]);

        $this->stampPublishDate($announcement);

        return response()->json([
            'message' => 'Announcement created successfully.',
            'announcement' => $announcement->fresh(),
        ], 201);
    }

    public function show(Announcement $announcement): JsonResponse
    {
        return response()->json(['announcement' => $announcement]);
    }

    public function update(Request $request, Announcement $announcement): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'nullable', 'string', 'max:100'],
            'description' => ['sometimes', 'required', 'string'],
            'image_url' => ['sometimes', 'nullable', 'url', 'max:2048'],
            'published_at' => ['sometimes', 'nullable', 'date'],
            'status' => ['sometimes', 'required', Rule::in([Announcement::STATUS_DRAFT, Announcement::STATUS_PUBLISHED])],
        ]);

        $announcement->update($validated);

        $this->stampPublishDate($announcement);

        return response()->json([
            'message' => 'Announcement updated successfully.',
            'announcement' => $announcement->fresh(),
        ]);
    }

    /**
     * Publish or unpublish an announcement.
     */
    public function updateStatus(Request $request, Announcement $announcement): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([Announcement::STATUS_DRAFT, Announcement::STATUS_PUBLISHED])],
        ]);

        $announcement->update(['status' => $validated['status']]);

        $this->stampPublishDate($announcement);

        return response()->json([
            'message' => $validated['status'] === Announcement::STATUS_PUBLISHED
                ? 'Announcement published.'
                : 'Announcement unpublished.',
            'announcement' => $announcement->fresh(),
        ]);
    }

    /**
     * A published item with no date gets today's date.
     */
    private function stampPublishDate(Announcement $announcement): void
    {
        if ($announcement->status === Announcement::STATUS_PUBLISHED && ! $announcement->published_at) {
            $announcement->update(['published_at' => now()->toDateString()]);
        }
    }
}
