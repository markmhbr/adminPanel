<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SwitchSchoolDatabase;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function getRoles(Request $request)
    {
        $schoolId = $request->school_id;

        SwitchSchoolDatabase::connect($schoolId);

        $roles = DB::connection('school')
            ->table('roles')
            ->get();

        return response()->json($roles);
    }
}
