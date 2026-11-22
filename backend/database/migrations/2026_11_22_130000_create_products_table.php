<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('category', 100)->nullable();
            $table->text('description');
            $table->unsignedInteger('price');          // whole Kenyan shillings (KES)
            $table->string('unit', 60)->nullable();    // e.g. "per basket", "per 500g jar"
            $table->string('icon', 16)->nullable();    // emoji until real pictures are added
            $table->boolean('in_stock')->default(true);

            $table->unsignedInteger('display_order')->default(0);
            $table->string('status')->default('draft'); // draft | published

            $table->timestamps();

            $table->index(['status', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
