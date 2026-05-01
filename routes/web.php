<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;

use App\Http\Controllers\RoleController;
use App\Http\Controllers\Admin\RolePermissionController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;

Route::get('/', [LandingPageController::class, 'index'])->name('landing');
Route::get('/product/{product:slug}', [LandingPageController::class, 'show'])->name('product.detail');
Route::get('/checkout/{product:slug}', [LandingPageController::class, 'checkout'])->name('checkout');
Route::post('/checkout/{product}/process', [LandingPageController::class, 'processCheckout'])->name('buy');
Route::post('/check-domain', [LandingPageController::class, 'checkDomain'])->name('check-domain');

// Static Pages
Route::get('/cara-beli', [PageController::class, 'caraBeli'])->name('pages.cara-beli');
Route::get('/syarat-ketentuan', [PageController::class, 'terms'])->name('pages.terms');
Route::get('/kebijakan-privasi', [PageController::class, 'privacy'])->name('pages.privacy');
Route::get('/kontak', [PageController::class, 'kontak'])->name('pages.kontak');

// User Dashboard & Orders
Route::middleware(['auth', 'customer'])->group(function () {
    Route::get('/my-dashboard', [DashboardController::class, 'index'])->name('user.dashboard');
    Route::get('/my-orders', [DashboardController::class, 'orders'])->name('user.orders');
    Route::get('/my-orders/{order}', [DashboardController::class, 'showOrder'])->name('user.order.show');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Area
Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // Products Management
    Route::resource('products', AdminProductController::class);
    Route::resource('items', \App\Http\Controllers\Admin\ItemController::class);

    // Orders Management
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.updateStatus');

    // Interface Management
    Route::get('/interface', [\App\Http\Controllers\Admin\InterfaceController::class, 'index'])->name('interface.index');
    Route::post('/interface/profile', [\App\Http\Controllers\Admin\InterfaceController::class, 'updateProfile'])->name('interface.updateProfile');

    // Customers Management
    Route::get('/customers', [\App\Http\Controllers\Admin\CustomerController::class, 'index'])->name('customers.index');

    // Store Profile Management
    Route::get('/store-profile', [\App\Http\Controllers\StoreProfileController::class, 'edit'])->name('store-profile.edit');
    Route::post('/store-profile-update', [\App\Http\Controllers\StoreProfileController::class, 'update'])->name('store-profile.update');

    // Existing Admin Panel Routes

    Route::post('/roles', [RoleController::class, 'getRoles']);
    Route::get('/permissions', [RolePermissionController::class, 'index'])->name('permissions.index');
    Route::post('/permissions', [RolePermissionController::class, 'store'])->name('permissions.store');
    Route::get('/permissions/{school}/{role?}', [RolePermissionController::class, 'show'])->name('permissions.show');
    Route::patch('/permissions/{school}', [RolePermissionController::class, 'update'])->name('permissions.update');
    Route::delete('/permissions/{school}', [RolePermissionController::class, 'destroy'])->name('permissions.destroy');
    Route::post('/permissions/{school}/sync', [RolePermissionController::class, 'sync'])->name('permissions.sync');
    Route::post('/permissions/save', [RolePermissionController::class, 'save'])->name('permissions.save');
    Route::get('/assets/proxy/{school}', [\App\Http\Controllers\Admin\AssetProxyController::class, 'proxy'])->name('assets.proxy');
    Route::get('/tokens', [\App\Http\Controllers\Admin\AccessTokenController::class, 'index'])->name('tokens.index');
    Route::post('/tokens', [\App\Http\Controllers\Admin\AccessTokenController::class, 'store'])->name('tokens.store');
    Route::delete('/tokens/{id}', [\App\Http\Controllers\Admin\AccessTokenController::class, 'destroy'])->name('tokens.destroy');
    Route::get('/tokens/generate', [\App\Http\Controllers\Admin\AccessTokenController::class, 'generate'])->name('tokens.generate');
    Route::post('/tokens/{id}/toggle', [\App\Http\Controllers\Admin\AccessTokenController::class, 'toggle'])->name('tokens.toggle');
});

// Chat Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    Route::post('/chat/init', [ChatController::class, 'initChat'])->name('chat.init');
    Route::get('/chat/{chat}/messages', [ChatController::class, 'getMessages'])->name('chat.messages');
    Route::post('/chat/{chat}/send', [ChatController::class, 'sendMessage'])->name('chat.send');
    Route::get('/admin/chats', [ChatController::class, 'getAdminChats'])->name('admin.chats');
    Route::post('/chat/{chat}/read', [ChatController::class, 'markAsRead'])->name('chat.read');
});
Route::post('/midtrans/notification', [App\Http\Controllers\PaymentController::class, 'notification'])->name('midtrans.notification');
Route::post('/my-orders/{order}/sync', [App\Http\Controllers\PaymentController::class, 'syncStatus'])->name('user.order.sync')->middleware(['auth']);

require __DIR__.'/auth.php';
