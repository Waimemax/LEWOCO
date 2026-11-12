<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ResourceController extends Controller
{
    /**
     * List resources (administrators) with search and status filter.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Resource::query();

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
            'link_url' => ['nullable', 'url:http,https', 'max:2048'],
            'icon' => ['nullable', 'string', 'max:16'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', Rule::in([Resource::STATUS_DRAFT, Resource::STATUS_PUBLISHED])],
        ]);

        $resource = Resource::create([
            ...$validated,
            'display_order' => $validated['display_order'] ?? ((int) Resource::max('display_order') + 1),
            'status' => $validated['status'] ?? Resource::STATUS_DRAFT,
        ]);

        return response()->json([
            'message' => 'Resource created successfully.',
            'resource' => $resource,
        ], 201);
    }

    public function show(Resource $resource): JsonResponse
    {
        return response()->json(['resource' => $resource]);
    }

    public function update(Request $request, Resource $resource): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'nullable', 'string', 'max:100'],
            'description' => ['sometimes', 'required', 'string'],
            'link_url' => ['sometimes', 'nullable', 'url:http,https', 'max:2048'],
            'icon' => ['sometimes', 'nullable', 'string', 'max:16'],
            'display_order' => ['sometimes', 'required', 'integer', 'min:0'],
            'status' => ['sometimes', 'required', Rule::in([Resource::STATUS_DRAFT, Resource::STATUS_PUBLISHED])],
        ]);

        $resource->update($validated);

        return response()->json([
            'message' => 'Resource updated successfully.',
            'resource' => $resource->fresh(),
        ]);
    }

    /**
     * Publish or unpublish a resource.
     */
    public function updateStatus(Request $request, Resource $resource): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([Resource::STATUS_DRAFT, Resource::STATUS_PUBLISHED])],
        ]);

        $resource->update(['status' => $validated['status']]);

        return response()->json([
            'message' => $validated['status'] === Resource::STATUS_PUBLISHED
                ? 'Resource published.'
                : 'Resource unpublished.',
            'resource' => $resource->fresh(),
        ]);
    }
}
