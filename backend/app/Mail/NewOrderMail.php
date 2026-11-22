<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class NewOrderMail extends Mailable
{
    public function __construct(public Order $order)
    {
    }

    public function envelope(): Envelope
    {
        $name = trim(preg_replace('/[\r\n]+/', ' ', $this->order->customer_name));

        return new Envelope(
            subject: 'New shop order '.$this->order->reference.' ('.Order::money($this->order->total).')',
            replyTo: [new Address($this->order->email, $name)],
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.new-order');
    }
}
