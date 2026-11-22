<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * The two LEWOCO products. They are created as DRAFTS with placeholder prices,
     * so nothing wrong appears on the public website. Set the real prices in the
     * administration portal (Products), then publish them.
     */
    public function run(): void
    {
        if (Product::count() > 0) {
            return;
        }

        $products = [
            [
                'name' => 'Hand-Woven Baskets',
                'category' => 'Handmade Crafts',
                'description' => 'Baskets hand-woven by LEWOCO women members. Each piece is made by hand, so designs and colours may vary slightly.',
                'price' => 1500,
                'unit' => 'per basket',
                'icon' => '🧺',
            ],
            [
                'name' => 'Honey',
                'category' => 'Food & Produce',
                'description' => 'Honey from LEWOCO members, sold in jars. Contact us for the jar sizes currently available.',
                'price' => 800,
                'unit' => 'per jar',
                'icon' => '🍯',
            ],
        ];

        foreach ($products as $index => $product) {
            Product::create([
                ...$product,
                'in_stock' => true,
                'display_order' => $index + 1,
                'status' => Product::STATUS_DRAFT,
            ]);
        }
    }
}
