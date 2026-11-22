<table cellpadding="6" style="border-collapse: collapse; width: 100%; max-width: 520px;">
    @foreach ($order->items as $item)
        <tr style="border-bottom: 1px solid #E6EBE7;">
            <td>{{ $item->product_name }} &times; {{ $item->quantity }}</td>
            <td style="text-align: right;">{{ \App\Models\Order::money($item->line_total) }}</td>
        </tr>
    @endforeach
    <tr>
        <td><strong>Total</strong></td>
        <td style="text-align: right;"><strong>{{ \App\Models\Order::money($order->total) }}</strong></td>
    </tr>
</table>
