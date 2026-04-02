<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StoreProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\StoreProfile::create([
            'store_name' => 'Simak-Buy Official',
            'address' => 'Jl. Pendidikan No. 1, Jakarta',
            'phone_number' => '+62 812 3456 7890',
            'email' => 'info@simakbuy.com',
            'whatsapp' => '6281234567890',
            'facebook' => 'https://facebook.com/simakbuy',
            'instagram' => 'https://instagram.com/simakbuy',
            'description' => 'Kami menyediakan berbagai macam kebutuhan pakaian dan seragam berkualitas terbaik untuk sekolah.',
        ]);
    }
}
