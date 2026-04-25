<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\School;

class SchoolSeeder extends Seeder
{
    public function run(): void
    {
        School::create([
            'name' => 'SMAN 1 Kebangsaan',
            'api' => 'http://api.sman1.sch.id',
            'access' => 'public',
        ]);

        School::create([
            'name' => 'SMK Bina Karya',
            'api' => 'http://api.smkbk.sch.id',
            'access' => 'private',
        ]);
    }
}
