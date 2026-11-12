<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;

class PublicAnnouncementController extends Controller
{
    /**
     * Latest published announcements for the public website. No login required.
     */
    public function index(): JsonResponse
    {
        $announcements = Announcement::query()
            ->where('status', Announcement::STATUS_PUBLISHED)
            ->orderByRaw('published_at desc nulls last')
            ->orderByDesc('id')
            ->limit(6)
            ->get(['id', 'title', 'category', 'description', 'image_url', 'published_at']);

        return response()->json(['announcements' => $announcements]);
    }
}
