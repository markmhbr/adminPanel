<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = User::where('role', 'user')->latest()->paginate(10);
        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers
        ]);
    }
}
