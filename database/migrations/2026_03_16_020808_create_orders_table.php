<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('user_id')->constrained()->onDelete('cascade');
            $blueprint->foreignId('product_id')->constrained()->onDelete('cascade');
            $blueprint->string('order_number')->unique();
            $blueprint->decimal('total_price', 15, 2);
            $blueprint->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
            $blueprint->enum('payment_status', ['unpaid', 'paid'])->default('unpaid');
            $blueprint->text('notes')->nullable();
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};