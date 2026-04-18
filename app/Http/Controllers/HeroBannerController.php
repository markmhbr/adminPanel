<?php

namespace App\Http\Controllers;

use App\Models\HeroBanner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HeroBannerController extends Controller
{
    public function index()
    {
        $banners = HeroBanner::orderBy('order_index')->paginate(10);
        return Inertia::render('Admin/Hero/Index', [
            'banners' => $banners
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Hero/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'image_url' => 'required|url',
            'button_text' => 'nullable|string',
            'button_link' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'order_index' => 'required|integer',
        ]);

        HeroBanner::create($request->all());

        return redirect()->route('admin.hero.index')->with('success', 'Banner berhasil ditambahkan!');
    }

    public function edit(HeroBanner $hero)
    {
        return Inertia::render('Admin/Hero/Edit', [
            'banner' => $hero
        ]);
    }

    public function update(Request $request, HeroBanner $hero)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'image_url' => 'required|url',
            'button_text' => 'nullable|string',
            'button_link' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'order_index' => 'required|integer',
        ]);

        $hero->update($request->all());

        return redirect()->route('admin.hero.index')->with('success', 'Banner berhasil diperbarui!');
    }

    public function destroy(HeroBanner $hero)
    {
        $hero->delete();
        return redirect()->route('admin.hero.index')->with('success', 'Banner berhasil dihapus!');
    }
}
