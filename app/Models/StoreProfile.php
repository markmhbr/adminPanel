<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_name',
        'landing_title',
        'landing_subtitle',
        'address',
        'google_maps_url',
        'phone_number',
        'email',
        'whatsapp',
        'facebook',
        'instagram',
        'social_links',
        'logo_url',
        'description',
    ];

    protected $casts = [
        'social_links' => 'array',
    ];
}
