<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\HeroBanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;

class LandingPageController extends Controller
{
    public function index()
    {
        $products = Product::where('status', 'published')->latest()->take(6)->get();
        $heroBanners = HeroBanner::where('status', 'active')->orderBy('order_index')->get();
        return Inertia::render('Welcome', [
            'products' => $products,
            'heroBanners' => $heroBanners,
            'canLogin' => \Illuminate\Support\Facades\Route::has('login'),
            'canRegister' => \Illuminate\Support\Facades\Route::has('register'),
        ]);
    }

    public function show(Product $product)
    {
        return Inertia::render('Product/Detail', [
            'product' => $product
        ]);
    }

    public function checkout(Product $product)
    {
        if (!Auth::check()) {
            session(['buying_product_id' => $product->id]);
        }

        return Inertia::render('Checkout/Index', [
            'product' => $product
        ]);
    }

    public function processCheckout(Request $request, Product $product)
    {
        $user = Auth::user();

        $order = Order::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'order_number' => 'INV-' . strtoupper(Str::random(10)),
            'total_price' => $product->price,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'notes' => $request->notes ?? 'Tidak ada catatan tambahan.',
        ]);

        $serverKey = config('services.midtrans.server_key');

        if (!empty($serverKey)) {
            Config::$serverKey = $serverKey;
            Config::$isProduction = config('services.midtrans.is_production');
            Config::$isSanitized = true;
            Config::$is3ds = true;

            $params = [
                'transaction_details' => [
                    'order_id' => $order->order_number,
                    'gross_amount' => (int)$order->total_price,
                ],
                'customer_details' => [
                    'first_name' => $user->school_name,
                    'email' => $user->email,
                    'phone' => $user->phone_number,
                ],
            ];

            try {
                $snapToken = Snap::getSnapToken($params);
                $order->update(['snap_token' => $snapToken]);
            }
            catch (\Exception $e) {
                // Ignore or log error
            }
        }

        return redirect()->route('user.order.show', $order)->with('success', 'Pesanan berhasil dikonfirmasi!');
    }
}
