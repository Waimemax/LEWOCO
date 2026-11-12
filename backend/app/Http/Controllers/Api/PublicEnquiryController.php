<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PublicEnquiryController extends Controller
{
    /**
     * Save an enquiry submitted from the public contact form. No login required.
     */
    public function store(Request $request): JsonResponse
    {
        $thanks = ['message' => 'Thank you. Your enquiry has been received.'];

        // Honeypot: real visitors never see or fill this hidden field, bots usually do.
        // Pretend it worked so the bot learns nothing.
        if ($request->filled('website')) {
            return response()->json($thanks, 201);
        }

        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'subject' => ['required', Rule::in(Enquiry::SUBJECTS)],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        Enquiry::create([
            ...$validated,
            'status' => Enquiry::STATUS_NEW,
        ]);

        return response()->json($thanks, 201);
    }
}
