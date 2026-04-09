<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    // Tambahkan $table di dalam kurung
    Schema::table('access_tokens', function (Blueprint $table) {
        // Ganti \-> dengan $table->
        $table->string('type')->default('admin-panel')->after('token');
    });
}

public function down(): void
{
    Schema::table('access_tokens', function (Blueprint $table) {
        // Jangan lupa di sini juga kalau ada
        $table->dropColumn('type');
    });
}
};
