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
                $credentials = \App\Services\SwitchSchoolDatabase::getCredentials($school->id);
                
                DB::purge('tenant_temp');
                config([
                    'database.connections.tenant_temp' => [
                        'driver' => 'mysql',
                        'host' => $credentials['host'],
                        'database' => $credentials['database'],
                        'username' => $credentials['username'],
                        'password' => $credentials['password'],
                    ]
                ]);

                $schoolData = DB::connection('tenant_temp')->table('sekolahs')->first();
                $school->nama_sekolah = $schoolData->nama ?? 'Nama tidak ditemukan';
                $school->kabupaten_kota = $schoolData->kabupaten_kota ?? 'Unknown';
                $school->kecamatan = $schoolData->kecamatan ?? 'Unknown';
            } catch (\Exception $e) {
                $school->nama_sekolah = 'Koneksi Gagal: ' . $e->getMessage();
                $school->kabupaten_kota = 'Unknown';
                $school->kecamatan = 'Unknown';
            }

            return $school;
        });

        return inertia('Admin/Permissions/Index', [
            'schools' => $schools
        ]);
    }

    public function show($schoolId, $roleId = null)
    {
        try {
            $school = School::findOrFail($schoolId);
            $credentials = \App\Services\SwitchSchoolDatabase::getCredentials($schoolId);

            config([
                'database.connections.tenant' => [
                    'driver' => 'mysql',
                    'host' => $credentials['host'],
                    'database' => $credentials['database'],
                    'username' => $credentials['username'],
                    'password' => $credentials['password'],
                ]
            ]);
            $roles = DB::connection('tenant')
                ->table('roles')
                ->select('id', 'name')
                ->get();

            $activeRole = $roleId 
                ? $roles->firstWhere('id', $roleId) 
                : $roles->first();

            if (!$activeRole && $roles->count() > 0) {
                $activeRole = $roles->first();
            }

            $permissions = DB::connection('tenant')
                ->table('permissions')
                ->select('id', 'name', 'is_restricted')
                ->get()
                ->map(function ($p) {
                    $p->is_restricted = (bool) $p->is_restricted;
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
                $activeRolePermissions = DB::connection('tenant')
                    ->table('role_has_permissions')
                    ->where('role_id', $activeRole->id)
                    ->distinct()
                    ->pluck('permission_id')
                    ->toArray();
            }

            $schoolData = DB::connection('tenant')->table('sekolahs')->first();
            $school->nama_sekolah = $schoolData->nama ?? 'Nama tidak ditemukan';

            return inertia('Admin/Permissions/Manage', [
                'school' => $school,
                'roles' => $roles,
                'activeRole' => $activeRole,
                'groupedPermissions' => $groupedPermissions,
                'activeRolePermissions' => $activeRolePermissions
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.permissions.index')->withErrors(['connection' => 'Gagal menghubungkan ke database sekolah: ' . $e->getMessage()]);
        }
    }

    public function sync(Request $request, $schoolId)
    {
        try {
            $credentials = \App\Services\SwitchSchoolDatabase::getCredentials($schoolId);

            config([
                'database.connections.tenant' => [
                    'driver' => 'mysql',
                    'host' => $credentials['host'],
                    'database' => $credentials['database'],
                    'username' => $credentials['username'],
                    'password' => $credentials['password'],
                ]
            ]);
            DB::transaction(function () {
                $validRoles = collect();

                // From jabatans
                $validRoles = $validRoles->merge(
                    DB::connection('tenant')->table('jabatans')
                        ->pluck('nama_jabatan')
                        ->map(fn ($r) => trim($r))
                );

                // From gtks (PTK)
                $validRoles = $validRoles->merge(
                    DB::connection('tenant')->table('gtks')
                        ->whereNotNull('jenis_ptk_id_str')
                        ->pluck('jenis_ptk_id_str')
                        ->map(fn ($r) => trim($r))
                );

                // From gtks (PTK) roles for filtering users
                $ptkRoles = DB::connection('tenant')->table('gtks')
                    ->whereNotNull('jenis_ptk_id_str')
                    ->pluck('jenis_ptk_id_str')
                    ->map(fn ($r) => trim($r))
                    ->toArray();

                // From penggunas NON-PTK
                $validRoles = $validRoles->merge(
                    DB::connection('tenant')->table('penggunas')
                        ->whereNotNull('peran_id_str')
                        ->where('peran_id_str', 'NOT LIKE', '%PTK%')
                        ->pluck('peran_id_str')
                        ->map(fn ($r) => trim($r))
                        ->reject(fn ($r) => in_array($r, $ptkRoles))
                );

                // Clean up
                $validRoles = $validRoles
                    ->filter()
                    ->unique()
                    ->values();

                // Get existing roles in database
                $existingRoles = DB::connection('tenant')->table('roles')->pluck('name');

                // Delete roles that are NOT in valid roles
                $rolesToDelete = $existingRoles->diff($validRoles);

                foreach ($rolesToDelete as $roleName) {
                    $role = DB::connection('tenant')->table('roles')->where('name', $roleName)->first();
                    if ($role) {
                        // Detach relations
                        DB::connection('tenant')->table('model_has_roles')->where('role_id', $role->id)->delete();
                        DB::connection('tenant')->table('role_has_permissions')->where('role_id', $role->id)->delete();
                        DB::connection('tenant')->table('roles')->where('id', $role->id)->delete();
                    }
                }

                // CREATE / UPDATE valid roles
                foreach ($validRoles as $roleName) {
                    DB::connection('tenant')->table('roles')->updateOrInsert(
                        ['name' => $roleName, 'guard_name' => 'web'],
                        ['updated_at' => now()]
                    );
                }

                // Assign role to penggunas NON-PTK
                DB::connection('tenant')->table('penggunas')
                    ->whereNotNull('peran_id_str')
                    ->where('peran_id_str', 'NOT LIKE', '%PTK%')
                    ->get()
                    ->each(function ($user) use ($ptkRoles) {
                        $roleName = trim($user->peran_id_str);

                        if (in_array($roleName, $ptkRoles)) {
                            return;
                        }

                        $role = DB::connection('tenant')->table('roles')->where('name', $roleName)->first();
                        if ($role) {
                            $exists = DB::connection('tenant')->table('model_has_roles')
                                ->where('role_id', $role->id)
                                ->where('model_id', $user->id)
                                ->where('model_type', 'App\Models\Pengguna')
                                ->exists();

                            if (!$exists) {
                                DB::connection('tenant')->table('model_has_roles')->insert([
                                    'role_id' => $role->id,
                                    'model_id' => $user->id,
                                    'model_type' => 'App\Models\Pengguna'
                                ]);
                            }
                        }
                    });
            });

            return back()->with('success', 'Sinkronisasi Role selesai.');
        } catch (\Exception $e) {
            return back()->withErrors(['connection' => 'Gagal sinkronisasi: ' . $e->getMessage()]);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'api' => 'required|string',
            'access' => 'required|string',
            'skip_connection_test' => 'nullable|boolean',
        ]);

        if (!($validated['skip_connection_test'] ?? false)) {
            try {
                $response = \Illuminate\Support\Facades\Http::withHeaders([
                    'X-Admin-Access-Key' => $validated['access']
                ])->get($validated['api']);

                if ($response->failed()) {
                    throw new \Exception('Gagal mengambil kredensial dari API: ' . $response->body());
                }

                $credentials = $response->json();
                
                config([
                    'database.connections.tenant_test' => [
                        'driver' => 'mysql',
                        'host' => $credentials['host'] ?? $credentials['db_host'] ?? '',
                        'database' => $credentials['database'] ?? $credentials['db_database'] ?? '',
                        'username' => $credentials['username'] ?? $credentials['db_username'] ?? '',
                        'password' => $credentials['password'] ?? $credentials['db_password'] ?? '',
                    ]
                ]);

                DB::connection('tenant_test')->getPdo();
            } catch (\Exception $e) {
                return back()->withErrors(['connection' => 'Gagal menghubungkan ke database via API: ' . $e->getMessage()]);
            }
        }

        // Remove skip_connection_test before creating the model
        $schoolData = collect($validated)->except('skip_connection_test')->toArray();
        School::create($schoolData);

        return back()->with('success', 'Konfigurasi database sekolah baru berhasil ditambahkan.');
    }

    public function save(Request $request)
    {
        $roleId = $request->role_id;
        try {
            $credentials = \App\Services\SwitchSchoolDatabase::getCredentials($request->school_id);

            config([
                'database.connections.tenant' => [
                    'driver' => 'mysql',
                    'host' => $credentials['host'],
                    'database' => $credentials['database'],
                    'username' => $credentials['username'],
                    'password' => $credentials['password'],
                ]
            ]);
            // Update Role Permissions
            DB::connection('tenant')
                ->table('role_has_permissions')
                ->where('role_id', $roleId)
                ->delete();
                
            // Ensure unique permission IDs before saving
            $permissionData = collect($request->data)
                ->unique('permission_id')
                ->map(function ($item) use ($roleId) {
                    return [
                        'permission_id' => $item['permission_id'],
                        'role_id' => $roleId
                    ];
                })
                ->toArray();

            foreach ($permissionData as $item) {
                DB::connection('tenant')
                    ->table('role_has_permissions')
                    ->insert($item);
            }

            // Update Restricted Permissions (Global for Tenant)
            if ($request->has('restricted_permissions')) {
                $restrictedIds = $request->input('restricted_permissions', []);
                
                // Set all to false first then update to true for specified IDs 
                // OR we can just update all permissions' is_restricted status
                // We get all permissions for this tenant
                $allPermissionIds = DB::connection('tenant')->table('permissions')->pluck('id')->toArray();
                
                DB::connection('tenant')->table('permissions')->whereIn('id', $allPermissionIds)->update(['is_restricted' => false]);
                if (!empty($restrictedIds)) {
                    DB::connection('tenant')->table('permissions')->whereIn('id', $restrictedIds)->update(['is_restricted' => true]);
                }
            }

            return back()->with('success', 'Permission berhasil disimpan');
        } catch (\Exception $e) {
            return back()->withErrors(['connection' => 'Gagal menyimpan: ' . $e->getMessage()]);
        }
    }
}
