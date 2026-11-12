<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;

class PublicResourceController extends Controller
{
    /**
     * Published resources for the public website. No login required.
     */
    public function index(): JsonResponse
    {
        $resources = Resource::query()
            ->where('status', Resource::STATUS_PUBLISHED)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get(['id', 'title', 'category', 'description', 'link_url', 'icon']);

        return response()->json(['resources' => $resources]);
    }
}
