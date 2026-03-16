<?php

namespace App\Services;

use App\Models\School;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class SwitchSchoolDatabase
{
    public static function connect($schoolId)
    {
        $school = School::findOrFail($schoolId);

        Config::set('database.connections.school.host', $school->db_host);
        Config::set('database.connections.school.database', $school->db_database);
        Config::set('database.connections.school.username', $school->db_username);
        Config::set('database.connections.school.password', $school->db_password);

        DB::purge('school');
        DB::reconnect('school');
    }
}