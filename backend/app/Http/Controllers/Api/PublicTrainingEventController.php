<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TrainingEvent;
use Illuminate\Http\JsonResponse;

class PublicTrainingEventController extends Controller
{
    /**
     * Upcoming published events for the public website. No login required.
     * An event stays listed until its last day has passed.
     */
    public function index(): JsonResponse
    {
        $events = TrainingEvent::query()
            ->where('status', TrainingEvent::STATUS_PUBLISHED)
            ->whereRaw('coalesce(end_date, start_date) >= ?', [now()->toDateString()])
            ->orderBy('start_date')
            ->orderBy('start_time')
            ->limit(6)
            ->get(['id', 'title', 'type', 'description', 'venue', 'start_date', 'end_date', 'start_time', 'end_time']);

        return response()->json(['events' => $events]);
    }
}
