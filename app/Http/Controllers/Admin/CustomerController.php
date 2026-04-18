<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'user');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('school_name', 'like', '%' . $request->search . '%')
                  ->orWhere('npsn', 'like', '%' . $request->search . '%');
            });
        }

        $customers = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search'])
        ]);
    }
}
