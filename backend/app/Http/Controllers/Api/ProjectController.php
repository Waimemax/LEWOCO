<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    /**
     * List projects (administrators) with search and status filter.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Project::query();

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
            $query->orderBy('display_order')->orderBy('id')->paginate(15)
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'icon' => ['nullable', 'string', 'max:16'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', Rule::in([Project::STATUS_DRAFT, Project::STATUS_PUBLISHED])],
        ]);

        $project = Project::create([
            ...$validated,
            'display_order' => $validated['display_order'] ?? ((int) Project::max('display_order') + 1),
            'status' => $validated['status'] ?? Project::STATUS_DRAFT,
        ]);

        return response()->json([
            'message' => 'Project created successfully.',
            'project' => $project,
        ], 201);
    }

    public function show(Project $project): JsonResponse
    {
        return response()->json(['project' => $project]);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'nullable', 'string', 'max:100'],
            'description' => ['sometimes', 'required', 'string'],
            'icon' => ['sometimes', 'nullable', 'string', 'max:16'],
            'display_order' => ['sometimes', 'required', 'integer', 'min:0'],
            'status' => ['sometimes', 'required', Rule::in([Project::STATUS_DRAFT, Project::STATUS_PUBLISHED])],
        ]);

        $project->update($validated);

        return response()->json([
            'message' => 'Project updated successfully.',
            'project' => $project->fresh(),
        ]);
    }

    /**
     * Publish or unpublish a project.
     */
    public function updateStatus(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([Project::STATUS_DRAFT, Project::STATUS_PUBLISHED])],
        ]);

        $project->update(['status' => $validated['status']]);

        return response()->json([
            'message' => $validated['status'] === Project::STATUS_PUBLISHED
                ? 'Project published.'
                : 'Project unpublished.',
            'project' => $project->fresh(),
        ]);
    }
}
