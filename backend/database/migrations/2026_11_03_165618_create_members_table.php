
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();

            $table->string('membership_number')->unique();

            $table->string('first_name');
            $table->string('last_name');

            $table->string('gender')->nullable();
            $table->date('date_of_birth')->nullable();

            $table->string('phone', 30);
            $table->string('email')->nullable()->unique();

            $table->text('physical_address')->nullable();
            $table->string('county')->nullable();

            $table->date('membership_date');

            $table->string('status')->default('active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
