<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\SchoolController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\Admin\RolePermissionController;    

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware(['verified'])->name('dashboard');

    Route::get('/schools', [SchoolController::class, 'index'])->name('schools');

    Route::post('/roles', [RoleController::class, 'getRoles']);



    Route::get('/permissions', [RolePermissionController::class, 'index'])->name('permissions.index');
    Route::post('/permissions', [RolePermissionController::class, 'store'])->name('permissions.store');
    Route::patch('/permissions/{school}', [RolePermissionController::class, 'update'])->name('permissions.update');
    Route::delete('/permissions/{school}', [RolePermissionController::class, 'destroy'])->name('permissions.destroy');

    Route::get('/permissions/{school}/{role?}', [RolePermissionController::class, 'show'])->name('permissions.show');
    Route::post('/permissions/{school}/sync', [RolePermissionController::class, 'sync'])->name('permissions.sync');
    Route::post('/permissions/save', [RolePermissionController::class, 'save']);

    // Access Tokens
    Route::get('/tokens', [\App\Http\Controllers\Admin\AccessTokenController::class, 'index'])->name('tokens.index');
    Route::post('/tokens', [\App\Http\Controllers\Admin\AccessTokenController::class, 'store'])->name('tokens.store');
    Route::delete('/tokens/{id}', [\App\Http\Controllers\Admin\AccessTokenController::class, 'destroy'])->name('tokens.destroy');
    Route::get('/tokens/generate', [\App\Http\Controllers\Admin\AccessTokenController::class, 'generate'])->name('tokens.generate');
    Route::post('/tokens/{id}/toggle', [\App\Http\Controllers\Admin\AccessTokenController::class, 'toggle'])->name('tokens.toggle');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
