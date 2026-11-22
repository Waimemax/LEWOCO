<!doctype html>
<html lang="en">
<body style="font-family: Arial, Helvetica, sans-serif; color: #202B27; line-height: 1.6;">
    <h2 style="color: #174C3C; margin-bottom: 4px;">About your order {{ $order->reference }}</h2>
    <p>Dear {{ $order->customer_name }},</p>
    <p>
        Thank you for your order. Unfortunately we could not accept it for this reason:
    </p>
    <div style="padding: 12px 14px; background: #F7F8F5; border-radius: 6px;">
        {!! nl2br(e($order->rejection_reason)) !!}
    </div>

    <p style="margin-top: 16px;">
        If you have already paid, please contact us with your reference and M-Pesa code
        <strong>{{ $order->mpesa_code }}</strong> so we can put this right.
    </p>

    <p>Lower Eastern Women Cooperative Society Ltd</p>
</body>
</html>
