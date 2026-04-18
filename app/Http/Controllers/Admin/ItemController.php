<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index()
    {
        $items = Item::latest()->paginate(10);
        return Inertia::render('Admin/Items/Index', [
            'items' => $items
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Items/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'billing_type' => 'required|in:one_time,annual,free',
            'tiers' => 'nullable|array',
            'tiers.*.level_name' => 'required|string',
            'tiers.*.max_students' => 'required|integer|min:1',
            'tiers.*.price' => 'required|numeric|min:0',
        ]);

        $item = Item::create($request->only(['name', 'price', 'description', 'status', 'billing_type']));

        if ($request->has('tiers')) {
            foreach ($request->tiers as $tier) {
                $item->tiers()->create($tier);
            }
        }

        return redirect()->route('admin.items.index')->with('success', 'Item berhasil ditambahkan!');
    }

    public function edit(Item $item)
    {
        return Inertia::render('Admin/Items/Edit', [
            'item' => $item->load('tiers')
        ]);
    }

    public function update(Request $request, Item $item)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'billing_type' => 'required|in:one_time,annual,free',
            'tiers' => 'nullable|array',
            'tiers.*.level_name' => 'required|string',
            'tiers.*.max_students' => 'required|integer|min:1',
            'tiers.*.price' => 'required|numeric|min:0',
        ]);

        $item->update($request->only(['name', 'price', 'description', 'status', 'billing_type']));

        // Simple sync for tiers: delete old, create new
        $item->tiers()->delete();
        if ($request->has('tiers')) {
            foreach ($request->tiers as $tier) {
                $item->tiers()->create($tier);
            }
        }

        return redirect()->route('admin.items.index')->with('success', 'Item berhasil diperbarui!');
    }

    public function destroy(Item $item)
    {
        $item->delete();
        return redirect()->route('admin.items.index')->with('success', 'Item berhasil dihapus!');
    }
}
