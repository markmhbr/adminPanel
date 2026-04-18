<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemTier extends Model
{
    protected $fillable = [
        'item_id',
        'level_name',
        'max_students',
        'price',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
