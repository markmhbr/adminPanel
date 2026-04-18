<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::factory()->create([
            'name' => 'Admin Simak Buy',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // School User
        User::factory()->create([
            'name' => 'Operator Sekolah Utama',
            'school_name' => 'SMAN 1 Kebangsaan',
            'email' => 'school@test.com',
            'password' => bcrypt('password'),
            'role' => 'user',
            'npsn' => '12345678',
            'email_verified_at' => now(),
        ]);

        $this->call([
            HeroBannerSeeder::class ,
            StoreProfileSeeder::class ,
        ]);
    }
}
