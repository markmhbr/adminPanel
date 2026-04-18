<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'description',
        'status',
        'billing_type',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class)
            ->withPivot('is_optional')
            ->withTimestamps();
    }

    public function tiers()
    {
        return $this->hasMany(ItemTier::class)->orderBy('max_students', 'asc');
    }

    public function getPriceForStudents($count)
    {
        if ($this->tiers()->count() === 0) {
            return $this->price;
        }

        $tier = $this->tiers()
            ->where('max_students', '>=', $count)
            ->first();

        // If count is beyond the last tier, use the highest tier's price
        if (!$tier) {
            $tier = $this->tiers()->orderBy('max_students', 'desc')->first();
        }

        return $tier->price;
    }
}
