<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class PublicProductController extends Controller
{
    /**
     * Published products plus the M-Pesa payment details, for the public shop. No login required.
     */
    public function index(): JsonResponse
    {
        $products = Product::query()
            ->where('status', Product::STATUS_PUBLISHED)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get(['id', 'name', 'category', 'description', 'price', 'unit', 'icon', 'in_stock']);

        $method = config('lewoco.mpesa.method') === 'paybill' ? 'paybill' : 'till';

        return response()->json([
            'products' => $products,
            'payment' => [
                'method' => $method,
                'number' => config('lewoco.mpesa.number'),
                'account_name' => config('lewoco.mpesa.account_name'),
            ],
        ]);
    }
}
