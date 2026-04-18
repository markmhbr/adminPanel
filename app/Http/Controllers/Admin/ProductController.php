<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::latest()->paginate(10);
        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            'items' => \App\Models\Item::where('status', 'active')->with('tiers')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'demo_url' => 'nullable|url',
            'status' => 'required|in:published,draft',
            'items' => 'nullable|array',
            'items.*.id' => 'required|exists:items,id',
            'items.*.is_optional' => 'required|boolean',
        ]);

        $product = Product::create($request->only(['name', 'price', 'description', 'demo_url', 'status']));

        if ($request->has('items')) {
            $syncData = [];
            $additionalPrice = 0;
            
            // Get prices for all items being synced with their tiers
            $allAvailableItems = \App\Models\Item::whereIn('id', collect($request->items)->pluck('id'))->with('tiers')->get();

            foreach ($request->items as $item) {
                $itemModel = $allAvailableItems->find($item['id']);
                
                $syncData[$item['id']] = [
                    'is_optional' => $item['is_optional'],
                ];

                // Add to price if mandatory
                if (!$item['is_optional'] && $itemModel) {
                    $additionalPrice += $itemModel->price;
                }
            }
            $product->items()->sync($syncData);

            // Update product with total price (Base + Mandatory)
            $product->update(['price' => $product->price + $additionalPrice]);
        }

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil ditambahkan!');
    }

    public function edit(Product $product)
    {
        // Calculate what was added previously to strip it out for the form
        $product->items->each(function($item) use (&$itemContribution) {
            // If it's mandatory, subtract its base price from the total
            if (!$item->pivot->is_optional) {
                $itemContribution += $item->price;
            }
        });

        // Set the price back to its "Base" value for the form
        $product->price = $product->price - $itemContribution;

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'items' => \App\Models\Item::where('status', 'active')->with('tiers')->get()
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'demo_url' => 'nullable|url',
            'status' => 'required|in:published,draft',
            'items' => 'nullable|array',
            'items.*.id' => 'required|exists:items,id',
            'items.*.is_optional' => 'required|boolean',
        ]);

        $product->update($request->only(['name', 'price', 'description', 'demo_url', 'status']));

        if ($request->has('items')) {
            $syncData = [];
            $additionalPrice = 0;

            // Get prices for all items being synced with tiers
            $allAvailableItems = \App\Models\Item::whereIn('id', collect($request->items)->pluck('id'))->with('tiers')->get();

            foreach ($request->items as $item) {
                $itemModel = $allAvailableItems->find($item['id']);

                $syncData[$item['id']] = [
                    'is_optional' => $item['is_optional'],
                ];

                // Add to price if mandatory
                if (!$item['is_optional'] && $itemModel) {
                    $additionalPrice += $itemModel->price;
                }
            }
            $product->items()->sync($syncData);

            // Update product with total price (Base + Mandatory)
            $product->update(['price' => $product->price + $additionalPrice]);
        } else {
            $product->items()->detach();
        }

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil diperbarui!');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil dihapus!');
    }
}
