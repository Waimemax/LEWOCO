<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OrderApprovedMail;
use App\Mail\OrderRejectedMail;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * List orders (administrators), newest first.
     * Filters: search (reference, name, phone, email, M-Pesa code), status.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::query()->withCount('items');

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('reference', 'ilike', "%{$search}%")
                    ->orWhere('customer_name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('phone', 'ilike', "%{$search}%")
                    ->orWhere('mpesa_code', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json(
            $query->orderByDesc('created_at')->orderByDesc('id')->paginate(15)
        );
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json(['order' => $order->load('items')]);
    }

    /** Internal notes only; the customer's details and the order itself are never edited. */
    public function update(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'admin_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $order->update($validated);

        return response()->json([
            'message' => 'Order updated successfully.',
            'order' => $order->fresh()->load('items'),
        ]);
    }

    /** Staff have checked the M-Pesa payment and accept the order. */
    public function approve(Order $order): JsonResponse
    {
        if ($order->status !== Order::STATUS_PENDING) {
            return response()->json(['message' => 'Only pending orders can be approved.'], 422);
        }

        $order->update([
            'status' => Order::STATUS_APPROVED,
            'approved_at' => now(),
            'rejection_reason' => null,
        ]);

        $this->sendToCustomer($order, new OrderApprovedMail($order->load('items')), 'approval');

        return response()->json([
            'message' => 'Order approved. The customer has been emailed.',
            'order' => $order->fresh()->load('items'),
        ]);
    }

    /** The order cannot be accepted (payment not found, wrong amount, out of stock...). */
    public function reject(Request $request, Order $order): JsonResponse
    {
        if ($order->status !== Order::STATUS_PENDING) {
            return response()->json(['message' => 'Only pending orders can be rejected.'], 422);
        }

        $validated = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:1000'],
        ]);

        $order->update([
            'status' => Order::STATUS_REJECTED,
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        $this->sendToCustomer($order, new OrderRejectedMail($order->load('items')), 'rejection');

        return response()->json([
            'message' => 'Order rejected. The customer has been emailed.',
            'order' => $order->fresh()->load('items'),
        ]);
    }

    public function deliver(Order $order): JsonResponse
    {
        if ($order->status !== Order::STATUS_APPROVED) {
            return response()->json(['message' => 'Only approved orders can be marked as delivered.'], 422);
        }

        $order->update([
            'status' => Order::STATUS_DELIVERED,
            'delivered_at' => now(),
        ]);

        return response()->json([
            'message' => 'Order marked as delivered.',
            'order' => $order->fresh()->load('items'),
        ]);
    }

    private function sendToCustomer(Order $order, $mailable, string $what): void
    {
        try {
            Mail::to($order->email)->send($mailable);
        } catch (\Throwable $exception) {
            // The decision is already saved; staff can contact the customer by phone
            Log::error("Order {$what} email failed for {$order->reference}: ".$exception->getMessage());
        }
    }
}
