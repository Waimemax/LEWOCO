<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Programme;
use Illuminate\Http\JsonResponse;

class PublicProgrammeController extends Controller
{
    /**
     * Published programmes for the public website. No login required.
     */
    public function index(): JsonResponse
    {
        $programmes = Programme::query()
            ->where('status', Programme::STATUS_PUBLISHED)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get(['id', 'title', 'description', 'icon']);

        return response()->json(['programmes' => $programmes]);
    }
}
