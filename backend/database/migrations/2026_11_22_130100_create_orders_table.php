<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->string('reference', 20)->unique();   // shown to the customer, e.g. LW-7K2M9Q

            $table->string('customer_name');
            $table->string('email');
            $table->string('phone', 30);
            $table->text('delivery_details');
            $table->text('customer_notes')->nullable();

            $table->unsignedInteger('total');            // KES
            $table->string('mpesa_code', 20)->index();   // M-Pesa transaction code entered by the customer

            $table->string('status')->default('pending'); // pending | approved | delivered | rejected
            $table->text('rejection_reason')->nullable();
            $table->text('admin_notes')->nullable();      // internal, never shown to the customer
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('delivered_at')->nullable();

            $table->timestamps();

            $table->index(['status', 'created_at']);
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();

            // Copied at the time of the order so later price or name changes do not alter it
            $table->string('product_name');
            $table->unsignedInteger('unit_price');
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('line_total');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
