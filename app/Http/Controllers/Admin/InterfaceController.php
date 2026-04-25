<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StoreProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InterfaceController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Interface/Index', [
            'profile' => StoreProfile::first(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $profile = StoreProfile::firstOrCreate(['id' => 1]);
        $validated = $request->validate([
            'store_name' => 'required|string|max:255',
            'landing_title' => 'nullable|string|max:255',
            'landing_subtitle' => 'nullable|string',
            'address' => 'nullable|string',
            'google_maps_url' => 'nullable|string',
            'social_links' => 'nullable|array',
            'social_links.*.platform' => 'required|string',
            'social_links.*.url' => 'required|url',
        ]);

        $profile->update($validated);

        return back()->with('success', 'Pengaturan antarmuka berhasil diperbarui.');
    }

}
