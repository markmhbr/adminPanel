<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'last_message_at', 'is_active'];

    protected $casts = [
        'user_id' => 'integer',
        'is_active' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function unreadMessagesForAdmin()
    {
        return $this->hasMany(Message::class)->where('is_read', false)->where('sender_id', '!=', 1); // Asumsi 1 adalah admin
    }
}
