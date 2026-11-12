<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resources', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->string('category', 100)->nullable();
            $table->text('description');
            $table->string('link_url', 2048)->nullable();
            $table->string('icon', 16)->nullable();

            $table->unsignedInteger('display_order')->default(0);
            $table->string('status')->default('draft'); // draft | published

            $table->timestamps();

            $table->index(['status', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resources');
    }
};
