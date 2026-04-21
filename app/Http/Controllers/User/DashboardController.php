<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $orders = Order::with('product')->where('user_id', $user->id)->latest()->take(5)->get();
        $totalOrders = Order::where('user_id', $user->id)->count();
        $processingOrders = Order::where('user_id', $user->id)->where('status', 'processing')->count();
        $completedOrders = Order::where('user_id', $user->id)->where('status', 'completed')->count();
        
        $featuredProducts = Product::where('status', 'published')->latest()->take(3)->get();

        return Inertia::render('Dashboard', [
            'orders' => $orders,
            'totalOrders' => $totalOrders,
            'processingOrders' => $processingOrders,
            'completedOrders' => $completedOrders,
            'featuredProducts' => $featuredProducts
        ]);
    }

    public function orders()
    {
        $orders = Order::with('product')->where('user_id', Auth::id())->latest()->paginate(10);
        return Inertia::render('User/Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function showOrder(Order $order)
    {
        Log::info('showOrder ownership check', [
            'auth_id' => Auth::id(),
            'order_user_id' => $order->user_id,
            'user_role' => Auth::user()->role,
            'match' => (int)Auth::id() == (int)$order->user_id
        ]);

        if (Auth::user()->role !== 'admin' && $order->user_id != Auth::id()) {
            abort(403);
        }
        $order->load(['product', 'items']);
        return Inertia::render('User/Orders/Show', [
            'order' => $order,
            'midtransClientKey' => config('services.midtrans.client_key'),
            'midtransIsProduction' => config('services.midtrans.is_production')
        ]);
    }
}
