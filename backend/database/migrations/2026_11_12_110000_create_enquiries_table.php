<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();

            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 30);
            $table->string('subject');
            $table->text('message');

            $table->string('status')->default('new'); // new | read | responded
            $table->text('notes')->nullable();        // internal staff notes

            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enquiries');
    }
};
