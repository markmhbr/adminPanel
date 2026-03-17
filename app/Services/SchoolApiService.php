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

        // Maximize results per request
        if (!isset($params['per_page'])) {
            $params['per_page'] = 100; // Use a known stable limit
        }

        $cacheKey = "school_{$school->id}_table_{$table}_" . md5(json_encode($params));

        return Cache::remember($cacheKey, 300, function () use ($url, $school, $params) {
            $allData = [];
            $page = 1;
            $previousPageHash = null;

            do {
                $params['page'] = $page;
                $response = Http::withHeaders([
                    'X-Admin-Access-Key' => $school->access,
                    'Accept' => 'application/json'
                ])->get($url, $params);

                if ($response->failed()) {
                    throw new \Exception("Gagal mengambil data dari API {$url} (Halaman {$page}): " . ($response->json('message') ?? $response->body()));
                }

                $json = $response->json() ?? [];
                
                // Handle cases where the data might be nested inside 'data' key (standard Laravel pagination)
                $responseData = $json['data'] ?? [];
                
                // If it's standard Laravel Paginator, the actual items are in $responseData['data']
                $currentPageData = isset($responseData['data']) && is_array($responseData['data'])
                    ? $responseData['data']
                    : $responseData;

                // Sometimes the API returns the raw array directly in 'data' or the root
                if (empty($currentPageData) && is_array($responseData) && !isset($responseData['data'])) {
                    $currentPageData = $responseData;
                }

                if (empty($currentPageData)) {
                    break;
                }

                // Detect infinite loops if the API keeps returning the same data
                $currentPageHash = md5(json_encode($currentPageData));
                if ($currentPageHash === $previousPageHash) {
                    break;
                }
                $previousPageHash = $currentPageHash;

                $allData = array_merge($allData, $currentPageData);
                
                // Determine if there are more pages
                $hasMore = false;
                if (isset($responseData['next_page_url']) && !empty($responseData['next_page_url'])) {
                    $hasMore = true;
                } elseif (count($currentPageData) >= ($params['per_page'] ?? 100)) {
                    // Fallback if Paginator info is missing but we got a full page
                    // We only continue if it's NOT the same data we just got (checked above)
                    $hasMore = true;
                }

                if (!$hasMore) {
                    break;
                }

                $page++;
            } while ($page <= $maxPages);

            return $allData;
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

    /**
     * Execute a raw SQL query via API
     */
    public static function executeRawQuery(School $school, string $sql)
    {
        $baseUrl = self::normalizeUrl($school->api);
        $url = "{$baseUrl}/query";

        $response = Http::withHeaders([
            'X-Admin-Access-Key' => $school->access,
            'Accept' => 'application/json'
        ])->post($url, ['sql' => $sql]);

        if ($response->failed()) {
            throw new \Exception("Gagal eksekusi query ke API {$url}: " . ($response->json('message') ?? $response->body()));
        }

        return $response->json();
    }
}
