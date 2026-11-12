<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EnquiryController extends Controller
{
    /**
     * List enquiries (administrators), newest first.
     * Filters: search, status (new|read|responded).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Enquiry::query();

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('phone', 'ilike', "%{$search}%")
                    ->orWhere('subject', 'ilike', "%{$search}%")
                    ->orWhere('message', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json(
            $query->orderByDesc('created_at')->orderByDesc('id')->paginate(15)
        );
    }

    public function show(Enquiry $enquiry): JsonResponse
    {
        return response()->json(['enquiry' => $enquiry]);
    }

    /**
     * Staff can change the status and keep internal notes.
     * The visitor's own details and message are never edited.
     */
    public function update(Request $request, Enquiry $enquiry): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'required', Rule::in(Enquiry::STATUSES)],
            'notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ]);

        $enquiry->update($validated);

        return response()->json([
            'message' => 'Enquiry updated successfully.',
            'enquiry' => $enquiry->fresh(),
        ]);
    }
}
