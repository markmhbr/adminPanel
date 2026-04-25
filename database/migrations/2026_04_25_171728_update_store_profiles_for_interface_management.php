<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('store_profiles', function (Blueprint $table) {
            $table->string('landing_title')->nullable()->after('store_name');
            $table->text('landing_subtitle')->nullable()->after('landing_title');
            $table->text('google_maps_url')->nullable()->after('address');
            $table->json('social_links')->nullable()->after('instagram');
        });

        // Migrate existing data
        $profile = \DB::table('store_profiles')->first();
        if ($profile) {
            $socialLinks = [
                ['platform' => 'whatsapp', 'url' => $profile->whatsapp],
                ['platform' => 'facebook', 'url' => $profile->facebook],
                ['platform' => 'instagram', 'url' => $profile->instagram],
            ];
            // Filter out empty values
            $socialLinks = array_filter($socialLinks, fn($link) => !empty($link['url']));
            
            \DB::table('store_profiles')->where('id', $profile->id)->update([
                'social_links' => json_encode(array_values($socialLinks))
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store_profiles', function (Blueprint $table) {
            $table->dropColumn(['landing_title', 'landing_subtitle', 'google_maps_url', 'social_links']);
        });
    }
};
