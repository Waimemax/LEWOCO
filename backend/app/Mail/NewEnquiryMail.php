<?php

namespace App\Mail;

use App\Models\Enquiry;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class NewEnquiryMail extends Mailable
{
    public function __construct(public Enquiry $enquiry)
    {
    }

    public function envelope(): Envelope
    {
        // Replying to this email goes straight to the visitor
        $name = trim(preg_replace('/[\r\n]+/', ' ', $this->enquiry->full_name));

        return new Envelope(
            subject: 'New website enquiry: '.$this->enquiry->subject,
            replyTo: [new Address($this->enquiry->email, $name)],
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.new-enquiry');
    }
}
