<!doctype html>
<html lang="en">
<body style="font-family: Arial, Helvetica, sans-serif; color: #202B27; line-height: 1.6;">
    <h2 style="color: #174C3C; margin-bottom: 4px;">Your order is approved</h2>
    <p>Dear {{ $order->customer_name }},</p>
    <p>
        Thank you for supporting LEWOCO. We have confirmed your M-Pesa payment and approved
        your order <strong>{{ $order->reference }}</strong>.
    </p>

    @include('emails._order-items')

    <p style="margin-top: 16px;"><strong>Delivery details we have</strong><br>{!! nl2br(e($order->delivery_details)) !!}</p>

    <p>We will contact you on {{ $order->phone }} to arrange delivery or collection.
       You can check your order any time on our website using your reference and phone number.</p>

    <p>Lower Eastern Women Cooperative Society Ltd</p>
</body>
</html>
