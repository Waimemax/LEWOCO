<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    private const STATUSES = [Product::STATUS_DRAFT, Product::STATUS_PUBLISHED];

    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('category', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json(
            $query->orderBy('display_order')->orderBy('id')->paginate(15)
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'description' => ['required', 'string', 'max:2000'],
            'price' => ['required', 'integer', 'min:1', 'max:10000000'],
            'unit' => ['nullable', 'string', 'max:60'],
            'icon' => ['nullable', 'string', 'max:16'],
            'in_stock' => ['nullable', 'boolean'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', Rule::in(self::STATUSES)],
        ]);

        $product = Product::create([
            ...$validated,
            'in_stock' => $validated['in_stock'] ?? true,
            'display_order' => $validated['display_order'] ?? ((int) Product::max('display_order') + 1),
            'status' => $validated['status'] ?? Product::STATUS_DRAFT,
        ]);

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => $product,
        ], 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json(['product' => $product]);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'nullable', 'string', 'max:100'],
            'description' => ['sometimes', 'required', 'string', 'max:2000'],
            'price' => ['sometimes', 'required', 'integer', 'min:1', 'max:10000000'],
            'unit' => ['sometimes', 'nullable', 'string', 'max:60'],
            'icon' => ['sometimes', 'nullable', 'string', 'max:16'],
            'in_stock' => ['sometimes', 'required', 'boolean'],
            'display_order' => ['sometimes', 'required', 'integer', 'min:0'],
            'status' => ['sometimes', 'required', Rule::in(self::STATUSES)],
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully.',
            'product' => $product->fresh(),
        ]);
    }

    public function updateStatus(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(self::STATUSES)],
        ]);

        $product->update(['status' => $validated['status']]);

        return response()->json([
            'message' => $validated['status'] === Product::STATUS_PUBLISHED
                ? 'Product published.'
                : 'Product unpublished.',
            'product' => $product->fresh(),
        ]);
    }

    /**
     * Upload or replace the product photo (JPG, PNG or WebP, up to 2 MB).
     * The stored name is random, so nothing the uploader chooses ever reaches the file system.
     */
    public function uploadImage(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ], [
            'image.max' => 'The photo must be 2 MB or smaller.',
            'image.image' => 'Please choose a JPG, PNG or WebP photo.',
            'image.mimes' => 'Please choose a JPG, PNG or WebP photo.',
            'image.uploaded' => 'The photo could not be uploaded. Please use a file under 2 MB.',
        ]);

        $file = $request->file('image');
        $extension = $file->guessExtension() === 'jpeg' ? 'jpg' : $file->guessExtension();

        if (! in_array($extension, ['jpg', 'png', 'webp'], true)) {
            throw ValidationException::withMessages(['image' => ['Please choose a JPG, PNG or WebP photo.']]);
        }

        $name = Str::lower((string) Str::ulid()).'.'.$extension;
        $file->storeAs('products', $name, 'public');

        $this->deleteStoredImage($product);
        $product->update(['image_path' => 'products/'.$name]);

        return response()->json([
            'message' => 'Photo saved.',
            'product' => $product->fresh(),
        ]);
    }

    public function deleteImage(Product $product): JsonResponse
    {
        $this->deleteStoredImage($product);
        $product->update(['image_path' => null]);

        return response()->json([
            'message' => 'Photo removed.',
            'product' => $product->fresh(),
        ]);
    }

    private function deleteStoredImage(Product $product): void
    {
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }
    }
}
