<?php

namespace App\Http\Controllers;

use App\Models\StoreProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreProfileController extends Controller
{
    public function edit()
    {
        $profile = StoreProfile::first();
        return Inertia::render('Admin/StoreProfile/Edit', [
            'profile' => $profile
        ]);
    }

    public function update(Request $request)
    {
        $profile = StoreProfile::first();
        
        $request->validate([
            'store_name' => 'required|string|max:255',
            'contact_email' => 'required|email',
            'contact_phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        if ($profile) {
            $profile->update($request->all());
        } else {
            StoreProfile::create($request->all());
        }

        return back()->with('success', 'Profil toko berhasil diperbarui!');
    }
}
