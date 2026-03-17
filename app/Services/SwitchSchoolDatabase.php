<?php

namespace App\Services;

use App\Models\School;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class SwitchSchoolDatabase
{
    public static function connect($schoolId)
    {
        $credentials = self::getCredentials($schoolId);

        Config::set('database.connections.school.host', $credentials['host']);
        Config::set('database.connections.school.database', $credentials['database']);
        Config::set('database.connections.school.username', $credentials['username']);
        Config::set('database.connections.school.password', $credentials['password']);

        DB::purge('school');
        DB::reconnect('school');
    }

    public static function getCredentials($schoolId)
    {
        $school = \App\Models\School::findOrFail($schoolId);

        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'X-Admin-Access-Key' => $school->access
        ])->get($school->api);

        if ($response->failed()) {
            throw new \Exception('Gagal mengambil kredensial database dari API: ' . $response->body());
        }

        $data = $response->json();

        // Assuming the API returns database config directly or in a specific format
        // Based on the curl example: curl -H "X-Admin-Access-Key: ..." http://.../api/admin-panel/table/sekolahs
        // It might return an array of database configs or a single one if the URL is specific.
        // The user said: "ganti juga di table sekolash kolomnya hanya api dan access"
        
        return [
            'host' => $data['host'] ?? $data['db_host'] ?? '',
            'database' => $data['database'] ?? $data['db_database'] ?? '',
            'username' => $data['username'] ?? $data['db_username'] ?? '',
            'password' => $data['password'] ?? $data['db_password'] ?? '',
        ];
    }
}