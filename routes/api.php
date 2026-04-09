<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ExternalApiController;
use App\Http\Middleware\ApiKeyMiddleware;

Route::middleware(ApiKeyMiddleware::class)->prefix('external')->group(function () {
    Route::get('/data', [ExternalApiController::class, 'getData']);
    Route::get('/products', [ExternalApiController::class, 'products']);
    Route::get('/orders', [ExternalApiController::class, 'orders']);
    Route::get('/schools', [ExternalApiController::class, 'schools']);
});
