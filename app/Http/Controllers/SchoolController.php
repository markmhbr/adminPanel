<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\School;
use Inertia\Inertia;


class SchoolController extends Controller
{
    public function index()
    {
        $schools = School::latest()->paginate(10);

        return Inertia::render('Schools/Index', [
            'schools' => $schools
        ]);
    }
}
