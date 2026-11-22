<!doctype html>
<html lang="en">
<body style="font-family: Arial, Helvetica, sans-serif; color: #202B27; line-height: 1.6;">
    <h2 style="color: #174C3C; margin-bottom: 4px;">New shop order {{ $order->reference }}</h2>
    <p style="margin-top: 0; color: #66716A;">Received {{ $order->created_at->format('j M Y, H:i') }}</p>

    @include('emails._order-items')

    <table cellpadding="6" style="border-collapse: collapse; margin-top: 12px;">
        <tr><td><strong>M-Pesa code</strong></td><td>{{ $order->mpesa_code }}</td></tr>
        <tr><td><strong>Customer</strong></td><td>{{ $order->customer_name }}</td></tr>
        <tr><td><strong>Phone</strong></td><td>{{ $order->phone }}</td></tr>
        <tr><td><strong>Email</strong></td><td>{{ $order->email }}</td></tr>
        <tr><td valign="top"><strong>Delivery</strong></td><td>{!! nl2br(e($order->delivery_details)) !!}</td></tr>
        @if ($order->customer_notes)
            <tr><td valign="top"><strong>Notes</strong></td><td>{!! nl2br(e($order->customer_notes)) !!}</td></tr>
        @endif
    </table>

    <p style="margin-top: 20px;">
        Check the payment of {{ \App\Models\Order::money($order->total) }} with code <strong>{{ $order->mpesa_code }}</strong>
        in the M-Pesa statement, then approve or reject the order in the
        <a href="{{ rtrim(config('app.url'), '/') }}/admin/orders" style="color: #39845F;">administration portal</a>.
    </p>

    <p style="color: #929B94; font-size: 12px;">
        This message contains personal information. Please do not forward it.
    </p>
</body>
</html>
