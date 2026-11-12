<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Programme;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProgrammeController extends Controller
{
    /**
     * List programmes (administrators) with search and status filter.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Programme::query();

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json(
            $query->orderBy('display_order')->orderBy('id')->paginate(15)
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'icon' => ['nullable', 'string', 'max:16'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', Rule::in([Programme::STATUS_DRAFT, Programme::STATUS_PUBLISHED])],
        ]);

        $programme = Programme::create([
            ...$validated,
            'display_order' => $validated['display_order'] ?? ((int) Programme::max('display_order') + 1),
            'status' => $validated['status'] ?? Programme::STATUS_DRAFT,
        ]);

        return response()->json([
            'message' => 'Programme created successfully.',
            'programme' => $programme,
        ], 201);
    }

    public function show(Programme $programme): JsonResponse
    {
        return response()->json(['programme' => $programme]);
    }

    public function update(Request $request, Programme $programme): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'icon' => ['sometimes', 'nullable', 'string', 'max:16'],
            'display_order' => ['sometimes', 'required', 'integer', 'min:0'],
            'status' => ['sometimes', 'required', Rule::in([Programme::STATUS_DRAFT, Programme::STATUS_PUBLISHED])],
        ]);

        $programme->update($validated);

        return response()->json([
            'message' => 'Programme updated successfully.',
            'programme' => $programme->fresh(),
        ]);
    }

    /**
     * Publish or unpublish a programme.
     */
    public function updateStatus(Request $request, Programme $programme): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([Programme::STATUS_DRAFT, Programme::STATUS_PUBLISHED])],
        ]);

        $programme->update(['status' => $validated['status']]);

        return response()->json([
            'message' => $validated['status'] === Programme::STATUS_PUBLISHED
                ? 'Programme published.'
                : 'Programme unpublished.',
            'programme' => $programme->fresh(),
        ]);
    }
}
