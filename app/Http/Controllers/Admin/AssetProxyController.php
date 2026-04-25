<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Services\SchoolApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class AssetProxyController extends Controller
{
    /**
     * Proxy an asset from a school server
     */
    public function proxy(Request $request, School $school)
    {
        $path = $request->query('path');
        
        if (!$path) {
            abort(404);
        }

        // Validate the path to prevent arbitrary URL fetching
        // We only allow paths that look like student photos or common storage assets
        if (!preg_match('/^(siswa|foto|storage)\//', $path)) {
            // Some systems might not include 'storage' in the relative path
            // but we'll be flexible as long as it's not a full URL or dot-dot path
            if (str_contains($path, '..') || str_contains($path, '://')) {
                abort(403, 'Invalid asset path');
            }
        }

        $baseUrl = SchoolApiService::normalizeUrl($school->api);
        $schoolRoot = str_replace('/api/admin-panel', '', $baseUrl);
        
        // Construct the full target URL
        // If the path already includes 'storage/', use it directly
        // Otherwise, prepend '/storage/' as most Laravel apps use it
        $targetUrl = str_starts_with($path, 'storage/') 
            ? "{$schoolRoot}/{$path}" 
            : "{$schoolRoot}/storage/{$path}";

        // Cache the image for a while to save bandwidth
        $cacheKey = "proxy_asset_" . md5($targetUrl);
        
        $cached = Cache::remember($cacheKey, 86400, function() use ($targetUrl) {
            $response = Http::timeout(10)->connectTimeout(5)->get($targetUrl);

            if ($response->failed()) {
                return null;
            }

            return [
                'body' => base64_encode($response->body()), // Use base64 to ensure safe storage in all cache drivers
                'type' => $response->header('Content-Type'),
            ];
        });

        if (!$cached) {
            abort(404);
        }

        return response(base64_decode($cached['body']))
            ->header('Content-Type', $cached['type'])
            ->header('Cache-Control', 'public, max-age=31536000');
    }
}
