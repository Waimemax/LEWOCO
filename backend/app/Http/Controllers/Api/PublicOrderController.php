<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewOrderMail;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PublicOrderController extends Controller
{
    /**
     * Place an order. The customer has already paid by M-Pesa and enters the transaction code;
     * staff check it against the M-Pesa statement and approve or reject the order.
     * Prices always come from the database, never from the browser.
     */
    public function store(Request $request): JsonResponse
    {
        // Honeypot: real visitors never see or fill this hidden field, bots usually do.
        if ($request->filled('hp_ref')) {
            return response()->json(['message' => 'Thank you. Your order has been received.', 'reference' => 'LW-000000', 'total' => 0], 201);
        }

        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'delivery_details' => ['required', 'string', 'max:1000'],
            'customer_notes' => ['nullable', 'string', 'max:1000'],
            'mpesa_code' => [
                'required',
                'regex:/^[A-Za-z0-9]{10}$/',
                Rule::unique('orders', 'mpesa_code')->where(
                    fn ($query) => $query->where('status', '!=', Order::STATUS_REJECTED)
                ),
            ],
            'items' => ['required', 'array', 'min:1', 'max:20'],
            'items.*.product_id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:100'],
        ], [
            'mpesa_code.regex' => 'The M-Pesa code should be 10 letters and numbers, for example QGH7K2M9PX.',
            'mpesa_code.unique' => 'This M-Pesa code has already been used for an order.',
        ]);

        // Combine repeated products, then load only what is for sale
        $quantities = [];
        foreach ($validated['items'] as $item) {
            $id = (int) $item['product_id'];
            $quantities[$id] = ($quantities[$id] ?? 0) + (int) $item['quantity'];
        }

        $products = Product::query()
            ->whereIn('id', array_keys($quantities))
            ->where('status', Product::STATUS_PUBLISHED)
            ->where('in_stock', true)
            ->get()
            ->keyBy('id');

        if ($products->count() !== count($quantities)) {
            throw ValidationException::withMessages([
                'items' => ['One or more products are no longer available. Please refresh the page and try again.'],
            ]);
        }

        $order = DB::transaction(function () use ($validated, $quantities, $products) {
            $total = 0;
            $lines = [];

            foreach ($quantities as $productId => $quantity) {
                $product = $products[$productId];
                $lineTotal = $product->price * min($quantity, 100);
                $total += $lineTotal;

                $lines[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'quantity' => min($quantity, 100),
                    'line_total' => $lineTotal,
                ];
            }

            $order = Order::create([
                'reference' => Order::newReference(),
                'customer_name' => $validated['customer_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'delivery_details' => $validated['delivery_details'],
                'customer_notes' => $validated['customer_notes'] ?? null,
                'total' => $total,
                'mpesa_code' => strtoupper($validated['mpesa_code']),
                'status' => Order::STATUS_PENDING,
            ]);

            $order->items()->createMany($lines);

            return $order;
        });

        $this->notifyStaff($order);

        return response()->json([
            'message' => 'Thank you. Your order has been received.',
            'reference' => $order->reference,
            'total' => $order->total,
        ], 201);
    }

    /**
     * Let a customer check their order with the reference and the phone number they used.
     * A wrong combination always gives the same answer, so references cannot be probed.
     */
    public function track(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reference' => ['required', 'string', 'max:20'],
            'phone' => ['required', 'string', 'max:30'],
        ]);

        $order = Order::with('items')
            ->where('reference', strtoupper(trim($validated['reference'])))
            ->first();

        if (! $order || Order::phoneKey($order->phone) !== Order::phoneKey($validated['phone']) || Order::phoneKey($validated['phone']) === '') {
            return response()->json(['message' => 'We could not find an order with those details.'], 404);
        }

        return response()->json([
            'order' => [
                'reference' => $order->reference,
                'status' => $order->status,
                'status_label' => $order->statusLabel(),
                'total' => $order->total,
                'rejection_reason' => $order->status === Order::STATUS_REJECTED ? $order->rejection_reason : null,
                'placed_at' => $order->created_at,
                'items' => $order->items->map(fn ($item) => [
                    'name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'line_total' => $item->line_total,
                ]),
            ],
        ]);
    }

    private function notifyStaff(Order $order): void
    {
        $recipient = config('lewoco.order_notify_email');

        if (! $recipient) {
            return;
        }

        try {
            Mail::to($recipient)->send(new NewOrderMail($order->load('items')));
        } catch (\Throwable $exception) {
            Log::error('Order notification email failed: '.$exception->getMessage());
        }
    }
}
