<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\HeroBanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;
use Iodev\Whois\Factory;

class LandingPageController extends Controller
{
    public function index()
    {
        $products = Product::where('status', 'published')
            ->with(['items' => function($query) {
                $query->where('status', 'active')->take(5);
            }])
            ->latest()
            ->take(6)
            ->get();
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
        $product->load(['items' => function($query) {
            $query->where('status', 'active')->with('tiers');
        }]);

        // Decode JSON pivot data
        $product->items->each(function($item) {
            if ($item->pivot->allowed_tiers) {
                $item->pivot->allowed_tiers = json_decode($item->pivot->allowed_tiers);
            }
        });

        return Inertia::render('Product/Detail', [
            'product' => $product
        ]);
    }

    public function checkout(Request $request, Product $product)
    {
        if (!Auth::check()) {
            session(['buying_product_id' => $product->id]);
            
            // Persist selection in session for guest users
            if ($request->has('selected_items')) {
                session(['selected_items' => $request->input('selected_items')]);
            }
            if ($request->has('student_count')) {
                session(['student_count' => $request->input('student_count')]);
            }
        }

        $product->load(['items' => function($query) {
            $query->where('status', 'active')->with('tiers');
        }]);

        // Decode JSON pivot data
        $product->items->each(function($item) {
            if ($item->pivot->allowed_tiers) {
                $item->pivot->allowed_tiers = json_decode($item->pivot->allowed_tiers);
            }
        });

        // Get selected items from request or session
        $selectedItems = $request->input('selected_items', session('selected_items', []));
        $studentCount = (int) $request->input('student_count', session('student_count', 250));

        // Ensure selectedItems is an array of integers
        $selectedItemIds = array_map('intval', (array) $selectedItems);

        return Inertia::render('Checkout/Index', [
            'product' => $product,
            'selectedItemIds' => $selectedItemIds,
            'studentCount' => $studentCount
        ]);
    }

    public function processCheckout(Request $request, Product $product)
    {
        $user = Auth::user();
        $selectedItemIds = $request->input('selected_items', []);
        $studentCount = (int) $request->input('student_count', 250);
        
        // Fetch all items associated with the product to verify and get prices
        $productItems = $product->items()->where('status', 'active')->with('tiers')->get();
        
        $totalPrice = 0;
        $orderItemsData = [];

        foreach ($productItems as $item) {
            $isMandatory = (int)$item->pivot->is_optional === 0;
            $isSelected = in_array($item->id, $selectedItemIds);

            if ($isMandatory || $isSelected) {
                $itemPrice = $item->price; // Default price
                
                // Jika ada level yang di-fix oleh admin
                $fixedTiers = $item->pivot->allowed_tiers;
                if (!empty($fixedTiers)) {
                    $fixedTierIds = is_string($fixedTiers) ? json_decode($fixedTiers, true) : $fixedTiers;
                    if (!empty($fixedTierIds)) {
                        $tier = $item->tiers->firstWhere('id', $fixedTierIds[0]);
                        if ($tier) {
                            $itemPrice = $tier->price;
                        }
                    }
                } else {
                    // Jika tidak fix, hitung berdasarkan jumlah siswa
                    $itemPrice = $item->getPriceForStudents($studentCount);
                }

                $totalPrice += $itemPrice;
                $orderItemsData[] = [
                    'item_id' => $item->id,
                    'item_name' => $item->name,
                    'item_price' => $itemPrice,
                    'billing_type' => $item->billing_type ?? 'one_time',
                ];
            }
        }

        $taxPercentage = (float) config('services.tax.percentage', 12);
        $taxAmount = $totalPrice * ($taxPercentage / 100);
        $finalTotal = $totalPrice + $taxAmount;

        $order = Order::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'order_number' => 'INV-' . strtoupper(Str::random(10)),
            'subtotal' => $totalPrice,
            'tax_amount' => $taxAmount,
            'tax_percentage' => $taxPercentage,
            'total_price' => $finalTotal,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'notes' => $request->notes ?? 'Tidak ada catatan tambahan.',
            'student_count' => $studentCount,
            'domain' => Str::endsWith(strtolower($request->domain), '.sch.id') ? strtolower($request->domain) : strtolower($request->domain) . '.sch.id',
        ]);

        // Clear session selection after successful order creation
        session()->forget(['selected_items', 'student_count', 'buying_product_id']);

        // Create Order Items
        foreach ($orderItemsData as $itemData) {
            $order->items()->create($itemData);
        }

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

    public function checkDomain(Request $request)
    {
        $domainName = $request->input('domain');
        
        if (!$domainName) {
            return response()->json([
                'available' => false,
                'message' => 'Nama domain harus diisi'
            ], 422);
        }

        // Clean input and ensure it ends with .sch.id
        $domainName = strtolower(trim($domainName));
        $domain = Str::endsWith($domainName, '.sch.id') ? $domainName : $domainName . '.sch.id';

        // Check if domain is already in our database
        $existsInDb = Order::where('domain', $domain)->exists();
        if ($existsInDb) {
            return response()->json([
                'available' => false,
                'message' => 'Domain sudah terdaftar di sistem kami.'
            ]);
        }

        try {
            $whois = Factory::get()->createWhois();
            $available = $whois->isDomainAvailable($domain);

            return response()->json([
                'available' => $available,
                'message' => $available ? 'Domain tersedia!' : 'Domain sudah digunakan.'
            ]);
        } catch (\Throwable $e) {
            Log::error("Domain Check Error for $domain: " . $e->getMessage());
            // Fallback to DNS check if WHOIS fails
            try {
                $available = !checkdnsrr($domain, 'ANY');
                return response()->json([
                    'available' => $available,
                    'message' => $available ? 'Domain tersedia!' : 'Domain sudah digunakan.'
                ]);
            } catch (\Throwable $dnsError) {
                Log::error("DNS Check Error for $domain: " . $dnsError->getMessage());
                return response()->json([
                    'available' => false,
                    'message' => 'Gagal mengecek ketersediaan domain.'
                ], 500);
            }
        }
    }
}
