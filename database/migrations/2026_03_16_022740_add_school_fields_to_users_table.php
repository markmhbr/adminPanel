<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('npsn')->nullable()->after('id');
            $table->string('school_name')->nullable()->after('name');
            $table->string('phone_number')->nullable()->after('email');
            $table->enum('role', ['admin', 'user'])->default('user')->after('password');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['npsn', 'school_name', 'phone_number', 'role']);
        });
    }
};