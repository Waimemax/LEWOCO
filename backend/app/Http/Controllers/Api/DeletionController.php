<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use App\Models\Member;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * Permanent deletion, for removing test data and for answering a person's
 * request to erase their information.
 *
 * Every deletion is written to the application log with who did it and when,
 * but never with the personal details that were removed.
 */
class DeletionController extends Controller
{
    public function member(Request $request, Member $member): JsonResponse
    {
        $id = $member->id;
        $member->delete();

        $this->record($request, 'member', "#{$id}");

        return response()->json(['message' => 'Member deleted permanently.']);
    }

    public function enquiry(Request $request, Enquiry $enquiry): JsonResponse
    {
        $id = $enquiry->id;
        $enquiry->delete();

        $this->record($request, 'enquiry', "#{$id}");

        return response()->json(['message' => 'Enquiry deleted permanently.']);
    }

    /** The order lines go with it. The reference is kept in the log only. */
    public function order(Request $request, Order $order): JsonResponse
    {
        $reference = $order->reference;
        $order->delete();

        $this->record($request, 'order', $reference);

        return response()->json(['message' => 'Order deleted permanently.']);
    }

    /** Past orders keep the product name and price they were placed with. */
    public function product(Request $request, Product $product): JsonResponse
    {
        $id = $product->id;

        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        $this->record($request, 'product', "#{$id}");

        return response()->json(['message' => 'Product deleted.']);
    }

    private function record(Request $request, string $what, string $identifier): void
    {
        Log::info("Deleted {$what} {$identifier}", [
            'by_user_id' => $request->user()?->id,
            'by_role' => $request->user()?->role,
        ]);
    }
}
