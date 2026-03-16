<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    protected $fillable = [
        'name',
        'db_host',
        'db_database',
        'db_username',
        'db_password'
    ];
}
