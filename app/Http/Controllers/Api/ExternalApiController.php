<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Order;
use App\Models\School;
use Illuminate\Http\Request;

class ExternalApiController extends Controller
{
    public function getData(Request $request)
    {
        $products = Product::where('status', 'active')->latest()->get();
        $orders = Order::latest()->take(50)->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'products' => $products,
                'orders' => $orders
            ]
        ]);
    }

    public function products(Request $request)
    {
        $products = Product::latest()->get();
        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }

    public function orders(Request $request)
    {
        $orders = Order::latest()->get();
        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    public function schools(Request $request)
    {
        $schools = School::latest()->get();
        return response()->json([
            'status' => 'success',
            'data' => $schools
        ]);
    }
}
