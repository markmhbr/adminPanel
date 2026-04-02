<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $chat = Chat::firstOrCreate(
            ['user_id' => $userId, 'is_active' => true],
            ['last_message_at' => now()]
        );

        if ($chat->messages()->count() === 0) {
            Message::create([
                'chat_id' => $chat->id,
                'sender_id' => 1, // Admin
                'message' => 'Halo! Selamat datang di Support Simak Buy. Ada yang bisa kami bantu?',
                'type' => 'text'
            ]);
        }

        return Inertia::render('Chat/Index', [
            'chat' => $chat,
            'messages' => $chat->messages()->with('sender')->get()
        ]);
    }

    public function getMessages(Chat $chat)
    {
        if (Auth::user()->role !== 'admin' && Auth::id() !== $chat->user_id) {
            abort(403);
        }

        return $chat->messages()->with('sender')->get();
    }

    public function sendMessage(Request $request, Chat $chat)
    {
        if (Auth::user()->role !== 'admin' && Auth::id() !== $chat->user_id) {
            abort(403);
        }

        $message = Message::create([
            'chat_id' => $chat->id,
            'sender_id' => Auth::id(),
            'message' => $request->message,
            'type' => $request->type ?? 'text'
        ]);

        $chat->update(['last_message_at' => now()]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message->load('sender'));
    }

    public function initChat(Request $request)
    {
        $userId = $request->user_id ?? Auth::id();

        if ($userId != Auth::id() && Auth::user()->role !== 'admin') {
            abort(403);
        }

        $chat = Chat::firstOrCreate(
            ['user_id' => $userId, 'is_active' => true],
            ['last_message_at' => now()]
        );

        if ($chat->messages()->count() === 0) {
            Message::create([
                'chat_id' => $chat->id,
                'sender_id' => 1, // Default Admin/Bot ID
                'message' => 'Halo! Selamat datang di Support Simak Buy. Ada yang bisa kami bantu?',
                'type' => 'text'
            ]);
            $chat->update(['last_message_at' => now()]);
        }

        return response()->json($chat);
    }

    public function getAdminChats()
    {
        return Chat::with(['user'])->orderBy('last_message_at', 'desc')->get();
    }

    public function markAsRead(Chat $chat)
    {
        $chat->messages()->where('sender_id', '!=', Auth::id())->update(['is_read' => true]);
        return response()->json(['status' => 'success']);
    }
}
