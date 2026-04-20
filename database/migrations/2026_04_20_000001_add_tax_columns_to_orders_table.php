<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('subtotal', 15, 2)->nullable()->after('order_number');
            $table->decimal('tax_amount', 15, 2)->nullable()->after('subtotal');
            $table->decimal('tax_percentage', 5, 2)->nullable()->after('tax_amount');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['subtotal', 'tax_amount', 'tax_percentage']);
        });
    }
};
