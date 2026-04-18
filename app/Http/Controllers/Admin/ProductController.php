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
            'description' => 'nullable|string',
            'demo_url' => 'nullable|url',
            'status' => 'required|in:published,draft',
            'items' => 'nullable|array',
            'items.*.id' => 'required|exists:items,id',
            'items.*.is_optional' => 'required|boolean',
            'items.*.allowed_tiers' => 'nullable|array',
        ]);

        $product = Product::create($request->only(['name', 'description', 'demo_url', 'status']));

        if ($request->has('items')) {
            $syncData = [];
            foreach ($request->items as $item) {
                $syncData[$item['id']] = [
                    'is_optional' => $item['is_optional'],
                    'allowed_tiers' => isset($item['allowed_tiers']) ? json_encode($item['allowed_tiers']) : null,
                ];
            }
            $product->items()->sync($syncData);
        }

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil ditambahkan!');
    }

    public function edit(Product $product)
    {
        $product->load('items');
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'items' => \App\Models\Item::where('status', 'active')->with('tiers')->get()
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'demo_url' => 'nullable|url',
            'status' => 'required|in:published,draft',
            'items' => 'nullable|array',
            'items.*.id' => 'required|exists:items,id',
            'items.*.is_optional' => 'required|boolean',
            'items.*.allowed_tiers' => 'nullable|array',
        ]);

        $product->update($request->only(['name', 'description', 'demo_url', 'status']));

        if ($request->has('items')) {
            $syncData = [];
            foreach ($request->items as $item) {
                $syncData[$item['id']] = [
                    'is_optional' => $item['is_optional'],
                    'allowed_tiers' => isset($item['allowed_tiers']) ? json_encode($item['allowed_tiers']) : null,
                ];
            }
            $product->items()->sync($syncData);
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
