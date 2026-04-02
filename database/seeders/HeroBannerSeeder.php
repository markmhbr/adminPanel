<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HeroBannerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\HeroBanner::create([
            'title' => 'Selamat Datang di Simak-Buy',
            'subtitle' => 'Pusat Belanja Pakaian Seragam Berkualitas',
            'image_url' => 'https://images.unsplash.com/photo-1576406240223-9993309a6064?q=80&w=1200', // Ganti dengan URL gambar relevan nantinya as needed
            'button_text' => 'Belanja Sekarang',
            'button_link' => '#produk',
            'status' => 'active',
            'order_index' => 1,
        ]);
    }
}
