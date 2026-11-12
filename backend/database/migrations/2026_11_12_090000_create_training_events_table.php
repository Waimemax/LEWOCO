<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_events', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->string('type')->default('training'); // training | workshop | meeting | event | other
            $table->text('description')->nullable();
            $table->string('venue')->nullable();

            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();

            $table->string('status')->default('draft'); // draft | published

            $table->timestamps();

            $table->index(['status', 'start_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_events');
    }
};
