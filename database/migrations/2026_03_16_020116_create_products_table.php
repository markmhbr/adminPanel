<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('name');
            $blueprint->string('slug')->unique();
            $blueprint->text('description')->nullable();
            $blueprint->decimal('price', 15, 2);
            $blueprint->string('demo_url')->nullable();
            $blueprint->string('image')->nullable();
            $blueprint->boolean('is_featured')->default(false);
            $blueprint->enum('status', ['published', 'draft'])->default('published');
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};