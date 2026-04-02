<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_name',
        'address',
        'phone_number',
        'email',
        'whatsapp',
        'facebook',
        'instagram',
        'logo_url',
        'description',
    ];
}
