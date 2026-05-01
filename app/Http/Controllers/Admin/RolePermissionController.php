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
            
            // Fetch school info from API to populate name
            try {
                $info = \App\Services\SchoolApiService::getTableData($school, 'sekolahs');
                $schoolData = $info[0] ?? null;
                $school->nama = $schoolData['nama'] ?? 'Nama tidak ditemukan';
                $school->nama_sekolah = $school->nama; // For backward compatibility
                $school->kabupaten_kota = $schoolData['kabupaten_kota'] ?? 'Unknown';
                $school->kecamatan = $schoolData['kecamatan'] ?? 'Unknown';
            } catch (\Exception $e) {
                $school->nama = 'Koneksi Gagal';
                $school->nama_sekolah = 'Koneksi Gagal';
            }
            
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

            // Fetch permissions and school details from remote
            try {
                // Fetch School Details for Background/Logo
                $schoolDetailsRaw = \App\Services\SchoolApiService::executeRawQuery($school, "SELECT * FROM sekolahs LIMIT 1");
                $schoolDetails = collect($schoolDetailsRaw['data'] ?? [])->first();
                if ($schoolDetails) {
                    $school->remote_details = (object)$schoolDetails;
                }

                $permissionsRaw = \App\Services\SchoolApiService::executeRawQuery($school, "SELECT * FROM permissions ORDER BY name ASC");
                $permissions = collect($permissionsRaw['data'] ?? []);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning("Failed to fetch remote data for school {$school->id}: " . $e->getMessage());
                $permissions = collect([]);
            }

            $permissions = $permissions->map(function ($p) {
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
            $gtkType = $request->query('gtk_type', 'guru');
            $search = $request->query('search');
            $selectedRombelId = $request->query('rombel_id');
            
            // Get Rombels from API with error handling and caching
            $rombels = Cache::remember("school_{$school->id}_rombels", 3600, function() use ($school) {
                try {
                    // Method 1: Try fetch from 'rombels' table (standard in this system)
                    // The error log showed 'nama_rombel' is not a column in 'rombels', it's likely 'nama'
                    try {
                        $response = \App\Services\SchoolApiService::executeRawQuery($school, "SELECT id, nama as nama_rombel, tingkat FROM rombels ORDER BY tingkat ASC, nama ASC");
                        if (!empty($response['data'])) return $response['data'];
                    } catch (\Exception $e) { /* fall through */ }

                    // Method 2: Fallback to 'siswas' table which definitely has these columns based on Siswa model
                    $response = \App\Services\SchoolApiService::executeRawQuery($school, "SELECT DISTINCT rombongan_belajar_id as id, nama_rombel, tingkat_pendidikan_id as tingkat FROM siswas WHERE status = 'Aktif' AND rombongan_belajar_id IS NOT NULL ORDER BY tingkat ASC, nama_rombel ASC");
                    return $response['data'] ?? [];
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::warning("Failed to fetch rombels for school {$school->id}: " . $e->getMessage());
                    return [];
                }
            });
            $rombels = collect($rombels)->map(fn($r) => (object)$r);

            // Sync when props change or initial load
            $activeRolePermissions = [];
            if ($activeRole) {
                // Use raw query for role_has_permissions to ensure we get ALL of them (more than 100)
                try {
                    $rolePermsRaw = \App\Services\SchoolApiService::executeRawQuery($school, "SELECT permission_id FROM role_has_permissions WHERE role_id = {$activeRole->id}");
                    $activeRolePermissions = collect($rolePermsRaw['data'] ?? [])
                        ->pluck('permission_id')
                        ->unique()
                        ->toArray();
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::warning("Failed to fetch role permissions for role {$activeRole->id} in school {$school->id}: " . $e->getMessage());
                    $activeRolePermissions = [];
                }
            }

            // Pagination settings
            $isPrinting = $request->has('print_all');
            $studentPage = intval($request->query('student_page', 1));
            $perPage = $isPrinting ? 1000 : 12; // Fetch more for printing
            $offset = $isPrinting ? 0 : ($studentPage - 1) * $perPage;

            // Search condition
            $searchCondition = "";
            if ($search) {
                // Harden search by removing common SQL injection patterns and special characters
                $search = preg_replace('/[^\w\s@.]/', '', $search);
                $search = addslashes($search);
                $searchCondition = "AND (nama LIKE '%$search%' OR nisn LIKE '%$search%' OR peserta_didik_id LIKE '%$search%')";
            }

            // Decide which student/member data to fetch
            if (in_array($activeTab, ['students', 'id-card', 'gtks'])) {
                $tableName = ($activeTab === 'gtks') ? 'gtks' : 'siswas';
                
                // Filtering for id-card and students tab
                $additionalCondition = "";
                if (in_array($activeTab, ['id-card', 'students']) && $selectedRombelId) {
                    $additionalCondition = " AND rombongan_belajar_id = '{$selectedRombelId}'";
                }

                if ($activeTab === 'gtks') {
                    if ($gtkType === 'guru') {
                        $additionalCondition .= " AND (jenis_ptk_id_str = 'Guru')";
                    } else {
                        $additionalCondition .= " AND (jenis_ptk_id_str != 'Guru' OR jenis_ptk_id_str IS NULL)";
                    }
                }

                // Fetch members with optional filter and A-Z sorting
                $countQuery = "SELECT COUNT(*) as total FROM {$tableName} WHERE (1=1) " . ($search ? "AND (nama LIKE '%$search%' OR nip LIKE '%$search%' OR ptk_id LIKE '%$search%' OR nisn LIKE '%$search%')" : "") . $additionalCondition;

                $membersQuery = "SELECT 
                                    id, 
                                    nama as display_name, 
                                    foto,
                                    " . ($activeTab === 'gtks' ? "nip" : "nisn") . " as sub_detail,
                                    " . ($activeTab === 'gtks' ? "jenis_ptk_id_str" : "nama_rombel") . " as description,
                                    " . ($activeTab === 'gtks' ? "ptk_id" : "peserta_didik_id") . " as username,
                                    " . ($activeTab === 'gtks' ? "NULL" : "qr_token") . " as qr_token
                                FROM {$tableName} 
                                WHERE (1=1) 
                                " . ($search ? "AND (nama LIKE '%$search%' OR nip LIKE '%$search%' OR ptk_id LIKE '%$search%' OR nisn LIKE '%$search%')" : "") . "
                                " . $additionalCondition . "
                                ORDER BY nama ASC
                                LIMIT {$perPage} OFFSET {$offset}";

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
            } else {
                // Tab is permissions or default, no members needed anymore as the UI has been removed
                $totalCount = 0;
                $membersData = collect([]);
            }

            if ($request->has('print_view')) {
                return inertia('Admin/Permissions/PrintCards', [
                    'school' => $school,
                    'schoolBaseUrl' => route('admin.assets.proxy', [$school->id]),
                    'selectedRombel' => collect($rombels)->firstWhere('id', $selectedRombelId),
                    'members' => $membersData,
                ]);
            }

            return inertia('Admin/Permissions/Manage', [
                'school' => $school,
                'schoolBaseUrl' => route('admin.assets.proxy', [$school->id]), // Use local proxy for security and visibility
                'roles' => $roles,
                'rombels' => $rombels,
                'activeRole' => $activeRole,
                'groupedPermissions' => $groupedPermissions,
                'activeRolePermissions' => $activeRolePermissions,
                'activeTab' => $activeTab,
                'gtkType' => $gtkType,
                'selectedRombelId' => $selectedRombelId,
                'members' => [
                    'data' => $membersData,
                    'current_page' => $studentPage,
                    'per_page' => $perPage,
                    'total' => intval($totalCount),
                    'last_page' => ceil($totalCount / $perPage)
                ]
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Permission management error for school {$schoolId}: " . $e->getMessage(), [
                'exception' => $e,
                'school_id' => $schoolId
            ]);
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
