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
            'email' => 'required|email',
            'phone_number' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $data = $request->only(['store_name', 'email', 'phone_number', 'address']);
        \Log::info('Store Profile Update Attempt:', $data);

        if ($profile) {
            $profile->update($data);
        } else {
            StoreProfile::create($data);
        }

        \Log::info('Store Profile Updated Successfully');
        return back()->with('success', 'Profil toko berhasil diperbarui!');
    }
}
