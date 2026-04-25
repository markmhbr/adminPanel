<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\School;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class RolePermissionController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('refresh')) {
            Cache::flush();
        }

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

    public function show(Request $request, $schoolId, $roleId = null)
    {
        try {
            if ($request->has('refresh')) {
                Cache::flush();
            }

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

            // Use raw query for permissions to ensure we get ALL of them (more than 100)
            $permissionsRaw = \App\Services\SchoolApiService::executeRawQuery($school, "SELECT * FROM permissions ORDER BY name ASC");
            $permissions = collect($permissionsRaw['data'] ?? [])
                ->map(function ($p) {
                    $p = (object)$p;
                    $p->is_restricted = (bool) ($p->is_restricted ?? false);
                    return $p;
                });

            $groupedPermissions = $permissions->groupBy(function ($permission) {
                // Split by common separators: dot, dash, colon, or underscore
                $name = strtolower($permission->name);
                $parts = preg_split('/[.\-:_]/', $name);
                $groupName = $parts[0] ?? 'LAINNYA';

                $customNames = [
                    'ppdb' => 'Penerimaan Siswa Baru (SPMB)',
                    'tagihan' => 'Keuangan / Tagihan',
                    'pembayaran' => 'Keuangan / Pembayaran',
                    'tabungan' => 'Keuangan / Tabungan',
                    'walas' => 'Wali Kelas',
                    'bk' => 'Bimbingan Konseling',
                    'rapor' => 'Penilaian / Rapor',
                    'kurikulum' => 'Akademik / Kurikulum',
                    'master' => 'Data Master',
                ];

                if (array_key_exists($groupName, $customNames)) {
                    return $customNames[$groupName];
                }

                return strtoupper($groupName);
            });

            $activeTab = $request->query('tab', 'permissions');
            $search = $request->query('search');
            
            // Sync when props change or initial load
            $activeRolePermissions = [];
            if ($activeRole) {
                // Use raw query for role_has_permissions to ensure we get ALL of them (more than 100)
                $rolePermsRaw = \App\Services\SchoolApiService::executeRawQuery($school, "SELECT permission_id FROM role_has_permissions WHERE role_id = {$activeRole->id}");
                $activeRolePermissions = collect($rolePermsRaw['data'] ?? [])
                    ->pluck('permission_id')
                    ->unique()
                    ->toArray();
            }

            // Pagination settings
            $studentPage = intval($request->query('student_page', 1));
            $perPage = 12;
            $offset = ($studentPage - 1) * $perPage;

            // Search condition
            $searchCondition = "";
            if ($search) {
                $search = addslashes($search);
                $searchCondition = "AND (nama LIKE '%$search%' OR nisn LIKE '%$search%' OR peserta_didik_id LIKE '%$search%')";
            }

            // Decide which student data to fetch
            if ($activeTab === 'students' || !$activeRole) {
                // Fetch ALL active students in the school
                $countQuery = "SELECT COUNT(*) as total FROM siswas WHERE status = 'Aktif' " . str_replace('AND', 'AND', $searchCondition);
                if ($search) {
                    $countQuery = "SELECT COUNT(*) as total FROM siswas WHERE status = 'Aktif' AND (nama LIKE '%$search%' OR nisn LIKE '%$search%' OR peserta_didik_id LIKE '%$search%')";
                }

                $membersQuery = "SELECT 
                                    id, 
                                    nama as display_name, 
                                    foto,
                                    nisn,
                                    nama_rombel,
                                    peserta_didik_id as username
                                FROM siswas 
                                WHERE status = 'Aktif' 
                                " . ($search ? "AND (nama LIKE '%$search%' OR nisn LIKE '%$search%' OR peserta_didik_id LIKE '%$search%')" : "") . "
                                LIMIT {$perPage} OFFSET {$offset}";
            } else {
                // Fetch members of the active role
                $countQuery = "SELECT COUNT(*) as total 
                              FROM model_has_roles mhr 
                              JOIN penggunas p ON mhr.model_id = p.id
                              JOIN siswas s ON p.peserta_didik_id = s.peserta_didik_id
                              WHERE mhr.role_id = {$activeRole->id} 
                              AND mhr.model_type = 'App\\\\Models\\\\Pengguna'
                              AND s.status = 'Aktif'
                              " . ($search ? "AND (s.nama LIKE '%$search%' OR s.nisn LIKE '%$search%' OR p.username LIKE '%$search%')" : "");
                
                $membersQuery = "SELECT 
                                    s.id, 
                                    s.nama as display_name, 
                                    s.foto,
                                    s.nisn,
                                    s.nama_rombel,
                                    p.username
                                FROM model_has_roles mhr
                                JOIN penggunas p ON mhr.model_id = p.id
                                JOIN siswas s ON p.peserta_didik_id = s.peserta_didik_id
                                WHERE mhr.role_id = {$activeRole->id} 
                                AND mhr.model_type = 'App\\\\Models\\\\Pengguna'
                                AND s.status = 'Aktif'
                                " . ($search ? "AND (s.nama LIKE '%$search%' OR s.nisn LIKE '%$search%' OR p.username LIKE '%$search%')" : "") . "
                                LIMIT {$perPage} OFFSET {$offset}";
            }

            // Optimization: Cache the query results for 60 seconds to reduce API load
            $cacheKey = "school_{$school->id}_" . md5($countQuery . $membersQuery);
            $cachedData = \Illuminate\Support\Facades\Cache::remember($cacheKey, 60, function() use ($school, $countQuery, $membersQuery) {
                $totalRaw = \App\Services\SchoolApiService::executeRawQuery($school, $countQuery);
                $membersRaw = \App\Services\SchoolApiService::executeRawQuery($school, $membersQuery);
                return [
                    'total' => $totalRaw['data'][0]['total'] ?? 0,
                    'members' => $membersRaw['data'] ?? []
                ];
            });

            $totalCount = $cachedData['total'];
            $membersData = collect($cachedData['members'])->map(fn($m) => (object)$m);

            return inertia('Admin/Permissions/Manage', [
                'school' => $school,
                'schoolBaseUrl' => rtrim(\App\Services\SchoolApiService::normalizeUrl($school->api), '/api/admin-panel'),
                'roles' => $roles,
                'activeRole' => $activeRole,
                'groupedPermissions' => $groupedPermissions,
                'activeRolePermissions' => $activeRolePermissions,
                'activeTab' => $activeTab,
                'members' => [
                    'data' => $membersData,
                    'current_page' => $studentPage,
                    'per_page' => $perPage,
                    'total' => intval($totalCount),
                    'last_page' => ceil($totalCount / $perPage)
                ]
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
            'api' => 'required|string|unique:schools,api',
            'access' => 'nullable|string',
            'skip_connection_test' => 'nullable|boolean',
        ], [
            'api.unique' => 'Domain/API ini sudah terdaftar dalam sistem.'
        ]);

        $api = $validated['api'];
        $access = $validated['access'] ?? '';

        if (!($validated['skip_connection_test'] ?? false)) {
            $error = $this->testConnection($api, $access);
            if ($error) {
                return back()->withErrors(['connection' => $error]);
            }
        }

        School::create([
            'api' => $api,
            'access' => $access,
        ]);

        return back()->with('success', 'Konfigurasi API sekolah baru berhasil ditambahkan.');
    }

    public function update(Request $request, School $school)
    {
        $validated = $request->validate([
            'api' => 'required|string|unique:schools,api,' . $school->id,
            'access' => 'nullable|string',
            'skip_connection_test' => 'nullable|boolean',
        ], [
            'api.unique' => 'Domain/API ini sudah digunakan oleh unit sekolah lain.'
        ]);

        $api = $validated['api'];
        $access = $validated['access'] ?? '';

        if (!($validated['skip_connection_test'] ?? false)) {
            $error = $this->testConnection($api, $access);
            if ($error) {
                return back()->withErrors(['connection' => $error]);
            }
        }

        $school->update([
            'api' => $api,
            'access' => $access,
        ]);

        return back()->with('success', 'Konfigurasi API sekolah berhasil diperbarui.');
    }

    public function destroy(School $school)
    {
        $school->delete();
        return back()->with('success', 'Konfigurasi sekolah berhasil dihapus.');
    }

    protected function testConnection($api, $access)
    {
        if (empty($access)) {
            $globalToken = \App\Models\AccessToken::where('is_active', true)->first();
            if (!$globalToken) {
                return 'Tidak ada token aktif di sistem. Silakan buat token dulu atau masukkan Access Key.';
            }
            $access = $globalToken->token;
        }

        try {
            $tempSchool = new School([
                'api' => $api,
                'access' => $access
            ]);
            
            \App\Services\SchoolApiService::getTableData($tempSchool, 'sekolahs');
            return null;
        } catch (\Exception $e) {
            return 'Gagal menghubungkan ke domain via API: ' . $e->getMessage();
        }
    }

    public function save(Request $request)
    {
        $roleId = $request->role_id;
        $schoolId = $request->school_id;
        
        try {
            $school = School::findOrFail($schoolId);

            // Fetch the "Pool" of visible permissions to ensure we don't touch hidden ones (Full list via Raw Query)
            $allPermissionsRaw = \App\Services\SchoolApiService::executeRawQuery($school, "SELECT id FROM permissions");
            $allPermissions = collect($allPermissionsRaw['data'] ?? []);
            $visiblePoolIds = $allPermissions->pluck('id')->toArray();

            // 1. Update Role Permissions (Non-Destructive Sync)
            // Use raw query for role_has_permissions to ensure we get ALL of them (bypass 100-item limit)
            $rolePermsRaw = \App\Services\SchoolApiService::executeRawQuery($school, "SELECT permission_id FROM role_has_permissions WHERE role_id = {$roleId}");
            $currentAssigned = collect($rolePermsRaw['data'] ?? [])
                ->pluck('permission_id')
                ->unique()
                ->toArray();

            $wantsAssigned = collect($request->data)->pluck('permission_id')->unique()->toArray();

            // Identify what to add: wants but not current
            $toAdd = array_diff($wantsAssigned, $currentAssigned);
            
            // Identify what to remove: current AND in pool (visible) but not wants
            $toRemove = array_diff(array_intersect($currentAssigned, $visiblePoolIds), $wantsAssigned);

            // Add new permissions
            if (!empty($toAdd)) {
                $values = [];
                foreach ($toAdd as $pId) {
                    $values[] = "({$roleId}, {$pId})";
                }
                $sqlInsert = "INSERT INTO role_has_permissions (role_id, permission_id) VALUES " . implode(', ', $values);
                \App\Services\SchoolApiService::executeRawQuery($school, $sqlInsert);
            }

            // Remove unchecked permissions (that were visible)
            if (!empty($toRemove)) {
                $idsToRemove = implode(',', $toRemove);
                \App\Services\SchoolApiService::executeRawQuery($school, "DELETE FROM role_has_permissions WHERE role_id = {$roleId} AND permission_id IN ({$idsToRemove})");
            }

            // 2. Update Restricted Permissions (Non-Destructive)
            if ($request->has('restricted_permissions')) {
                $wantsRestricted = $request->input('restricted_permissions', []);
                
                if (!empty($visiblePoolIds)) {
                    $poolStr = implode(',', $visiblePoolIds);
                    
                    // Reset is_restricted ONLY for items in the visible pool
                    \App\Services\SchoolApiService::executeRawQuery($school, "UPDATE permissions SET is_restricted = 0 WHERE id IN ({$poolStr})");
                    
                    // Set is_restricted = 1 for wants that are in the pool
                    $toRestrict = array_intersect($wantsRestricted, $visiblePoolIds);
                    if (!empty($toRestrict)) {
                        $restrictStr = implode(',', $toRestrict);
                        \App\Services\SchoolApiService::executeRawQuery($school, "UPDATE permissions SET is_restricted = 1 WHERE id IN ({$restrictStr})");
                    }
                }
            }

            return back()->with('success', 'Perubahan berhasil disimpan (Mode Non-Destruktif)');
        } catch (\Exception $e) {
            return back()->withErrors(['connection' => 'Gagal menyimpan: ' . $e->getMessage()]);
        }
    }
}
