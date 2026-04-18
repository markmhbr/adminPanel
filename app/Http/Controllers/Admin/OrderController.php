<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'product'])->latest()->paginate(10);
        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'product', 'items']);
        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
            'payment_status' => 'required|in:unpaid,paid',
        ]);

        $order->update([
            'status' => $request->status,
            'payment_status' => $request->payment_status,
        ]);

        return back()->with('success', 'Status pesanan berhasil diperbarui!');
    }
}
