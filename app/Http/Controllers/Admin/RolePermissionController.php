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
            DB::purge('tenant_temp');
            config([
                'database.connections.tenant_temp' => [
                    'driver' => 'mysql',
                    'host' => $school->db_host,
                    'database' => $school->db_database,
                    'username' => $school->db_username,
                    'password' => $school->db_password,
                ]
            ]);

            try {
                $schoolData = DB::connection('tenant_temp')->table('sekolahs')->first();
                $school->nama_sekolah = $schoolData->nama ?? 'Nama tidak ditemukan';
                $school->kabupaten_kota = $schoolData->kabupaten_kota ?? 'Unknown';
                $school->kecamatan = $schoolData->kecamatan ?? 'Unknown';
            } catch (\Exception $e) {
                $school->nama_sekolah = 'Koneksi Gagal';
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
        $school = School::findOrFail($schoolId);

        config([
            'database.connections.tenant' => [
                'driver' => 'mysql',
                'host' => $school->db_host,
                'database' => $school->db_database,
                'username' => $school->db_username,
                'password' => $school->db_password,
            ]
        ]);

        $roles = DB::connection('tenant')
            ->table('roles')
            ->select('id', 'name')
            ->get();

        $activeRole = $roleId 
            ? $roles->firstWhere('id', $roleId) 
            : $roles->first();

        // If specific role ID wasn't found or provided, use the first one
        if (!$activeRole && $roles->count() > 0) {
            $activeRole = $roles->first();
        }

        $permissions = DB::connection('tenant')
            ->table('permissions')
            ->select('id', 'name')
            ->get();

        // Grouping logic: split by '.' or '-' and take first part as group name
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
    }

    public function sync(Request $request, $schoolId)
    {
        $school = School::findOrFail($schoolId);

        config([
            'database.connections.tenant' => [
                'driver' => 'mysql',
                'host' => $school->db_host,
                'database' => $school->db_database,
                'username' => $school->db_username,
                'password' => $school->db_password,
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
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'db_host' => 'required|string',
            'db_database' => 'required|string',
            'db_username' => 'required|string',
            'db_password' => 'nullable|string',
        ]);

        // Attempt a test connection before saving to ensure "premium" reliability
        config([
            'database.connections.tenant_test' => [
                'driver' => 'mysql',
                'host' => $validated['db_host'],
                'database' => $validated['db_database'],
                'username' => $validated['db_username'],
                'password' => $validated['db_password'] ?? '',
            ]
        ]);

        try {
            DB::connection('tenant_test')->getPdo();
        } catch (\Exception $e) {
            return back()->withErrors(['connection' => 'Gagal menghubungkan ke database: ' . $e->getMessage()]);
        }

        School::create($validated);

        return back()->with('success', 'Konfigurasi database sekolah baru berhasil ditambahkan.');
    }

    public function save(Request $request)
    {
        $school = School::findOrFail($request->school_id);
        $roleId = $request->role_id;

        config([
            'database.connections.tenant' => [
                'driver' => 'mysql',
                'host' => $school->db_host,
                'database' => $school->db_database,
                'username' => $school->db_username,
                'password' => $school->db_password,
            ]
        ]);

        // Only remove permissions for this specific role
        DB::connection('tenant')
            ->table('role_has_permissions')
            ->where('role_id', $roleId)
            ->delete();

        foreach ($request->data as $item) {
            DB::connection('tenant')
                ->table('role_has_permissions')
                ->insert([
                    'permission_id' => $item['permission_id'],
                    'role_id' => $roleId
                ]);
        }

        return back()->with('success', 'Permission berhasil disimpan');
    }
}
