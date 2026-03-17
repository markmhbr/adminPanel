<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccessToken extends Model
{
    protected $fillable = [
        'name',
        'token',
        'is_active'
    ];
}
