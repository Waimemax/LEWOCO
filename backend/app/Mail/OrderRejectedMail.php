<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class OrderRejectedMail extends Mailable
{
    public function __construct(public Order $order)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'About your LEWOCO order '.$this->order->reference);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.order-rejected');
    }
}
