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

        // Sample Products
        $products = [
            [
                'name' => 'Landing Page Startup Modern',
                'description' => "Landing page premium yang didesain khusus untuk startup teknologi. \n\nFitur Utama:\n- Desain Ultra Modern & Clean\n- Animasi On-Scroll yang Halus\n- Terintegrasi Form Kontak & Newsletter\n- SEO Optimized untuk Google\n- Kecepatan Loading di atas 90%\n- Support Dark & Light Mode",
                'price' => 750000,
                'demo_url' => 'https://demo.simakbuy.com/startup',
                'status' => 'published',
                'is_featured' => true
            ],
            [
                'name' => 'E-Commerce Toko Online Pro',
                'description' => "Solusi toko online lengkap untuk skala bisnis menengah ke atas.\n\nFitur Utama:\n- Manajemen Produk & Stok Tanpa Batas\n- Sistem Keranjang Belanja & Checkout\n- Integrasi Payment Gateway (Midtrans/Xendit)\n- Hitung Ongkos Kirim Otomatis (RajaOngkir)\n- Panel Admin untuk Laporan Penjualan\n- Notifikasi WhatsApp untuk Pembeli",
                'price' => 2500000,
                'demo_url' => 'https://demo.simakbuy.com/ecommerce',
                'status' => 'published',
                'is_featured' => true
            ],
            [
                'name' => 'Company Profile Perusahaan',
                'description' => "Website representatif untuk meningkatkan kepercayaan klien terhadap bisnis Anda.\n\nFitur Utama:\n- Halaman Tentang Kami & Visi Misi\n- Galeri Layanan & Proyek Terkini\n- Blog/Artikel Berita Perusahaan\n- Google Maps & Integrasi Media Sosial\n- Desain Responsif (Mobile, Tablet, Desktop)\n- Sertifikat SSL Gratis",
                'price' => 1500000,
                'demo_url' => 'https://demo.simakbuy.com/company',
                'status' => 'published',
                'is_featured' => false
            ],
            [
                'name' => 'Website Portofolio Kreatif',
                'description' => 'Tampilkan karya terbaik Anda dengan desain yang artistik dan minimalis. Cocok untuk desainer dan fotografer.',
                'price' => 500000,
                'demo_url' => 'https://demo.simakbuy.com/portfolio',
                'status' => 'published',
                'is_featured' => false
            ],
            [
                'name' => 'Sistem Informasi Sekolah (SIM)',
                'description' => 'Portal web untuk manajemen data siswa, nilai, dan absensi sekolah secara terpusat dan aman.',
                'price' => 4500000,
                'demo_url' => 'https://demo.simakbuy.com/school',
                'status' => 'published',
                'is_featured' => true
            ],
            [
                'name' => 'Website Berita / Portal Media',
                'description' => 'Website dengan tata letak majalah berita, mendukung banyak kategori dan optimasi iklan Adsense.',
                'price' => 3000000,
                'demo_url' => 'https://demo.simakbuy.com/news',
                'status' => 'published',
                'is_featured' => false
            ],
        ];

        // Sample Items
        $items = [
            [
                'name' => 'SIMAK (Sistem Informasi Sekolah)',
                'price' => 1500000,
                'description' => 'Sistem manajemen data sekolah terpadu.',
                'status' => 'active'
            ],
            [
                'name' => 'Web Profile Premium',
                'price' => 1000000,
                'description' => 'Desain website profile dengan fitur lengkap.',
                'status' => 'active'
            ],
            [
                'name' => 'Support Maintenance (6 Bulan)',
                'price' => 500000,
                'description' => 'Pendampingan dan perbaikan bug selama 6 bulan.',
                'status' => 'active'
            ],
            [
                'name' => 'Custom Domain .sch.id',
                'price' => 250000,
                'description' => 'Pendaftaran domain resmi sekolah.',
                'status' => 'active'
            ],
            [
                'name' => 'Hosting Super Cepat (1 Tahun)',
                'price' => 750000,
                'description' => 'Layanan hosting dengan performa tinggi.',
                'status' => 'active'
            ]
        ];

        $createdItems = [];
        foreach ($items as $itemData) {
            $createdItems[] = \App\Models\Item::create($itemData);
        }

        foreach ($products as $productData) {
            $productData['slug'] = \Illuminate\Support\Str::slug($productData['name']);
            $product = \App\Models\Product::create($productData);

            // Link items to product
            if ($product->name === 'Sistem Informasi Sekolah (SIM)') {
                // Mandatory items
                $product->items()->attach($createdItems[0]->id, ['is_optional' => false]);
                $product->items()->attach($createdItems[4]->id, ['is_optional' => false]);
                // Optional items
                $product->items()->attach($createdItems[2]->id, ['is_optional' => true]);
                $product->items()->attach($createdItems[3]->id, ['is_optional' => true]);
            } else {
                // For other products, just add some items
                $product->items()->attach($createdItems[1]->id, ['is_optional' => false]);
                $product->items()->attach($createdItems[2]->id, ['is_optional' => true]);
            }
        }

        $this->call([
            HeroBannerSeeder::class ,
            StoreProfileSeeder::class ,
        ]);
    }
}
