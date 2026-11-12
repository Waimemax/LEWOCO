<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TrainingEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TrainingEventController extends Controller
{
    /**
     * List training and events (administrators), newest date first.
     * Filters: search, status (draft|published), when (upcoming|past).
     */
    public function index(Request $request): JsonResponse
    {
        $query = TrainingEvent::query();

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('venue', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $today = now()->toDateString();

        if ($request->input('when') === 'upcoming') {
            $query->whereRaw('coalesce(end_date, start_date) >= ?', [$today]);
        } elseif ($request->input('when') === 'past') {
            $query->whereRaw('coalesce(end_date, start_date) < ?', [$today]);
        }

        return response()->json(
            $query->orderByDesc('start_date')->orderByDesc('id')->paginate(15)
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());

        $event = TrainingEvent::create([
            ...$validated,
            'type' => $validated['type'] ?? 'training',
            'status' => $validated['status'] ?? TrainingEvent::STATUS_DRAFT,
        ]);

        return response()->json([
            'message' => 'Event created successfully.',
            'event' => $event->fresh(),
        ], 201);
    }

    public function show(TrainingEvent $event): JsonResponse
    {
        return response()->json(['event' => $event]);
    }

    public function update(Request $request, TrainingEvent $event): JsonResponse
    {
        $event->update($request->validate($this->rules(partial: true)));

        return response()->json([
            'message' => 'Event updated successfully.',
            'event' => $event->fresh(),
        ]);
    }

    /**
     * Publish or unpublish an event.
     */
    public function updateStatus(Request $request, TrainingEvent $event): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([TrainingEvent::STATUS_DRAFT, TrainingEvent::STATUS_PUBLISHED])],
        ]);

        $event->update(['status' => $validated['status']]);

        return response()->json([
            'message' => $validated['status'] === TrainingEvent::STATUS_PUBLISHED
                ? 'Event published.'
                : 'Event unpublished.',
            'event' => $event->fresh(),
        ]);
    }

    private function rules(bool $partial = false): array
    {
        $sometimes = $partial ? ['sometimes'] : [];

        return [
            'title' => [...$sometimes, 'required', 'string', 'max:255'],
            'type' => [...$sometimes, $partial ? 'required' : 'nullable', Rule::in(TrainingEvent::TYPES)],
            'description' => [...$sometimes, 'nullable', 'string'],
            'venue' => [...$sometimes, 'nullable', 'string', 'max:255'],
            'start_date' => [...$sometimes, 'required', 'date'],
            'end_date' => [...$sometimes, 'nullable', 'date', 'after_or_equal:start_date'],
            'start_time' => [...$sometimes, 'nullable', 'date_format:H:i'],
            'end_time' => [...$sometimes, 'nullable', 'date_format:H:i'],
            'status' => [...$sometimes, $partial ? 'required' : 'nullable', Rule::in([TrainingEvent::STATUS_DRAFT, TrainingEvent::STATUS_PUBLISHED])],
        ];
    }
}
