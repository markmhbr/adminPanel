<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\School;
use Illuminate\Support\Facades\DB;

class RolePermissionController extends Controller
{
    public function index()
    {
        $schools = School::all()->map(function ($school) {
            try {
                // Fetch info from school API instead of DB
                $info = \App\Services\SchoolApiService::getTableData($school, 'sekolahs');
                $schoolData = $info[0] ?? null;

                $school->nama_sekolah = $schoolData['nama'] ?? 'Nama tidak ditemukan';
                $school->kabupaten_kota = $schoolData['kabupaten_kota'] ?? 'Unknown';
                $school->kecamatan = $schoolData['kecamatan'] ?? 'Unknown';
            } catch (\Exception $e) {
                $school->nama_sekolah = 'Koneksi Gagal: ' . $e->getMessage();
                $school->kabupaten_kota = 'Unknown';
                $school->kecamatan = 'Unknown';
            }

            return $school;
        });

        $tokens = \App\Models\AccessToken::where('is_active', true)->get();

        return inertia('Admin/Permissions/Index', [
            'schools' => $schools,
            'tokens' => $tokens
        ]);
    }

    public function show($schoolId, $roleId = null)
    {
        try {
            $school = School::findOrFail($schoolId);
            
            // Get Roles and Permissions via API
            $roles = collect(\App\Services\SchoolApiService::getTableData($school, 'roles'))
                ->map(fn($r) => (object)$r)
                ->sortBy('name')
                ->values();

            $activeRole = $roleId 
                ? $roles->firstWhere('id', $roleId) 
                : $roles->first();

            if (!$activeRole && $roles->count() > 0) {
                $activeRole = $roles->first();
            }

            $permissions = collect(\App\Services\SchoolApiService::getTableData($school, 'permissions'))
                ->map(function ($p) {
                    $p = (object)$p;
                    $p->is_restricted = (bool) ($p->is_restricted ?? false);
                    return $p;
                });

            $groupedPermissions = $permissions->groupBy(function ($permission) {
                $parts = preg_split('/[.-]/', $permission->name);
                $groupName = $parts[0];

                $customNames = [
                    'ppdb' => 'Penerimaan Siswa Baru (SPMB)',
                ];

                if (array_key_exists(strtolower($groupName), $customNames)) {
                    return $customNames[strtolower($groupName)];
                }

                return strtoupper($groupName);
            });

            $activeRolePermissions = [];
            if ($activeRole) {
                // Fetch from role_has_permissions table via API
                $activeRolePermissions = collect(\App\Services\SchoolApiService::getTableData($school, 'role_has_permissions'))
                    ->where('role_id', $activeRole->id)
                    ->pluck('permission_id')
                    ->unique()
                    ->toArray();
            }

            // Fetch school basic info via API
            $schoolInfo = \App\Services\SchoolApiService::getTableData($school, 'sekolahs');
            $school->nama_sekolah = $schoolInfo[0]['nama'] ?? 'Nama tidak ditemukan';

            return inertia('Admin/Permissions/Manage', [
                'school' => $school,
                'roles' => $roles,
                'activeRole' => $activeRole,
                'groupedPermissions' => $groupedPermissions,
                'activeRolePermissions' => $activeRolePermissions
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.permissions.index')->withErrors(['connection' => 'Gagal menghubungkan ke API sekolah: ' . $e->getMessage()]);
        }
    }

    public function sync(Request $request, $schoolId)
    {
        // For now, sync might be complex because it involves multiple tables and logic.
        // We might need to implement a special sync endpoint on the school side 
        // OR implement it here using multiple API calls.
        // Given the request, we prioritize basic management first.
        return back()->withErrors(['connection' => 'Fitur Sinkronisasi API belum didukung penuh. Fokus pada pengelolaan hak akses terlebih dahulu.']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'api' => 'required|string',
            'access' => 'nullable|string',
            'skip_connection_test' => 'nullable|boolean',
        ]);

        $api = $validated['api'];
        $access = $validated['access'];

        // Jika access kosong, cari token global yang aktif
        if (empty($access)) {
            $globalToken = \App\Models\AccessToken::where('is_active', true)->first();
            if (!$globalToken) {
                return back()->withErrors(['api' => 'Tidak ada token aktif di sistem. Silakan buat token dulu di menu Access Tokens.']);
            }
            $access = $globalToken->token;
        }

        if (!($validated['skip_connection_test'] ?? false)) {
            try {
                $school = new School([
                    'api' => $api,
                    'access' => $access
                ]);
                
                \App\Services\SchoolApiService::getTableData($school, 'sekolahs');
            } catch (\Exception $e) {
                return back()->withErrors(['connection' => 'Gagal menghubungkan ke domain via API: ' . $e->getMessage()]);
            }
        }

        School::create([
            'api' => $api,
            'access' => $access,
        ]);

        return back()->with('success', 'Konfigurasi API sekolah baru berhasil ditambahkan.');
    }

    public function save(Request $request)
    {
        $roleId = $request->role_id;
        $schoolId = $request->school_id;
        try {
            $school = School::findOrFail($schoolId);

            // 1. Update Role Permissions
            // Delete existing via API (this assumes the API supports DELETE on a table with filters)
            // If API doesn't support bulk delete, it needs to be defined.
            // Assuming the school API has a specific logic for this or we do it one by one.
            
            // For simplicity in this dummy environment, we'll try to use the POST table data
            // But usually, updating many-to-many via API requires a dedicated endpoint.
            // We'll use the 'save' pattern requested.
            
            \App\Services\SchoolApiService::postTableData($school, 'role_has_permissions', [
                'action' => 'sync',
                'role_id' => $roleId,
                'permission_ids' => collect($request->data)->pluck('permission_id')->unique()->toArray()
            ]);

            // 2. Update Restricted Permissions
            if ($request->has('restricted_permissions')) {
                $restrictedIds = $request->input('restricted_permissions', []);
                
                \App\Services\SchoolApiService::postTableData($school, 'permissions', [
                    'action' => 'update_restricted',
                    'restricted_ids' => $restrictedIds
                ]);
            }

            return back()->with('success', 'Permission berhasil disimpan via API');
        } catch (\Exception $e) {
            return back()->withErrors(['connection' => 'Gagal menyimpan via API: ' . $e->getMessage()]);
        }
    }
}
