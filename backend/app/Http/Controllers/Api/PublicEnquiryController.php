<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewEnquiryMail;
use App\Models\Enquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
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
        if ($request->filled('hp_ref')) {
            return response()->json($thanks, 201);
        }

        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'subject' => ['required', Rule::in(Enquiry::SUBJECTS)],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $enquiry = Enquiry::create([
            ...$validated,
            'status' => Enquiry::STATUS_NEW,
        ]);

        $this->notifyStaff($enquiry);

        return response()->json($thanks, 201);
    }

    /**
     * Email LEWOCO about the new enquiry. The enquiry is already saved, so a mail
     * problem never affects the visitor: the error is logged and the request carries on.
     */
    private function notifyStaff(Enquiry $enquiry): void
    {
        $recipient = config('lewoco.enquiry_notify_email');

        if (! $recipient) {
            return;
        }

        try {
            Mail::to($recipient)->send(new NewEnquiryMail($enquiry));
        } catch (\Throwable $exception) {
            Log::error('Enquiry notification email failed: '.$exception->getMessage());
        }
    }
}
