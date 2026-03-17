<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AccessToken;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AccessTokenController extends Controller
{
    public function index()
    {
        $tokens = AccessToken::latest()->get();
        return inertia('Admin/Tokens/Index', [
            'tokens' => $tokens
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string|max:255|unique:access_tokens,token',
        ]);

        AccessToken::create($validated);

        return back()->with('success', 'Access token berhasil disimpan.');
    }

    public function destroy($id)
    {
        AccessToken::findOrFail($id)->delete();
        return back()->with('success', 'Access token berhasil dihapus.');
    }

    public function generate()
    {
        return response()->json([
            'token' => Str::random(32)
        ]);
    }

    public function toggle($id)
    {
        $token = AccessToken::findOrFail($id);
        $token->update(['is_active' => !$token->is_active]);
        return back()->with('success', 'Status token berhasil diubah.');
    }
}
