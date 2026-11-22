<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class OrderApprovedMail extends Mailable
{
    public function __construct(public Order $order)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your LEWOCO order '.$this->order->reference.' is approved');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.order-approved');
    }
}
