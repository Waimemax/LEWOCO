<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

class PublicProjectController extends Controller
{
    /**
     * Published projects for the public website. No login required.
     */
    public function index(): JsonResponse
    {
        $projects = Project::query()
            ->where('status', Project::STATUS_PUBLISHED)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get(['id', 'title', 'category', 'description', 'icon']);

        return response()->json(['projects' => $projects]);
    }
}
