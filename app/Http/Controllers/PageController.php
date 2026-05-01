<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function caraBeli()
    {
        return Inertia::render('Pages/Static', ['page' => 'cara-beli']);
    }

    public function terms()
    {
        return Inertia::render('Pages/Static', ['page' => 'terms']);
    }

    public function privacy()
    {
        return Inertia::render('Pages/Static', ['page' => 'privacy']);
    }

    public function kontak()
    {
        return Inertia::render('Landing/Contact');
    }
}
