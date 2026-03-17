<?php

namespace App\Services;

use App\Models\School;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class SchoolApiService
{
    /**
     * Normalize URL to ensure it has protocol and ends with /api/admin-panel/
     */
    public static function normalizeUrl($url)
    {
        // Add protocol if missing
        if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
            $url = "https://" . $url;
        }

        $url = rtrim($url, '/');

        // Append base API path if missing
        if (!str_contains($url, '/api/admin-panel')) {
            $url .= '/api/admin-panel';
        }

        return $url;
    }

    /**
     * Fetch data from a specific table via API
     */
    public static function getTableData(School $school, string $table, array $params = [])
    {
        $baseUrl = self::normalizeUrl($school->api);
        $url = "{$baseUrl}/table/{$table}";

        $cacheKey = "school_{$school->id}_table_{$table}_" . md5(json_encode($params));

        return Cache::remember($cacheKey, 300, function () use ($url, $school, $params) {
            $response = Http::withHeaders([
                'X-Admin-Access-Key' => $school->access,
                'Accept' => 'application/json'
            ])->get($url, $params);

            if ($response->failed()) {
                throw new \Exception("Gagal mengambil data dari API {$url}: " . ($response->json('message') ?? $response->body()));
            }

            return $response->json('data') ?? [];
        });
    }

    /**
     * Post data to a specific table via API
     */
    public static function postTableData(School $school, string $table, array $data)
    {
        $baseUrl = self::normalizeUrl($school->api);
        $url = "{$baseUrl}/table/{$table}";

        $response = Http::withHeaders([
            'X-Admin-Access-Key' => $school->access,
            'Accept' => 'application/json'
        ])->post($url, $data);

        if ($response->failed()) {
            throw new \Exception("Gagal mengirim data ke API {$url}: " . ($response->json('message') ?? $response->body()));
        }

        // Clear cache for this table
        Cache::forget("school_{$school->id}_table_{$table}_" . md5(json_encode([])));

        return $response->json();
    }

    /**
     * Delete data from a specific table via API
     */
    public static function deleteTableData(School $school, string $table, array $params = [])
    {
        $baseUrl = self::normalizeUrl($school->api);
        $url = "{$baseUrl}/table/{$table}";

        $response = Http::withHeaders([
            'X-Admin-Access-Key' => $school->access,
            'Accept' => 'application/json'
        ])->delete($url, $params);

        if ($response->failed()) {
            throw new \Exception("Gagal menghapus data di API {$url}: " . ($response->json('message') ?? $response->body()));
        }

        // Clear cache for this table
        Cache::forget("school_{$school->id}_table_{$table}_" . md5(json_encode([])));

        return $response->json();
    }
    
    /**
     * Get base info about the school server
     */
    public static function getInfo(School $school)
    {
        $baseUrl = self::normalizeUrl($school->api);
        
        return Cache::remember("school_info_{$school->id}", 3600, function () use ($baseUrl, $school) {
            $response = Http::withHeaders([
                'X-Admin-Access-Key' => $school->access,
                'Accept' => 'application/json'
            ])->get($baseUrl);

            if ($response->failed()) {
                throw new \Exception("Gagal mengambil info sekolah dari {$baseUrl}: " . ($response->json('message') ?? $response->body()));
            }

            return $response->json('data') ?? [];
        });
    }
}
