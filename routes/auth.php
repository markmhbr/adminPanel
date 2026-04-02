<?php

use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [UserAuthController::class, 'showRegister'])
        ->name('register');

    Route::post('register', [UserAuthController::class, 'register']);

    Route::get('login', [UserAuthController::class, 'showLogin'])
        ->name('login');

    Route::post('login', [UserAuthController::class, 'login']);

    Route::get('verify-otp', [UserAuthController::class, 'showVerify'])
        ->name('user.verify.show');

    Route::post('verify-otp', [UserAuthController::class, 'verify'])
        ->name('user.verify');

    Route::post('resend-otp', [UserAuthController::class, 'resendOtp'])
        ->name('user.resend_otp');

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');

    // Ajax Auth
    Route::post('/ajax/login', [UserAuthController::class , 'ajaxLogin'])->name('ajax.login');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [UserAuthController::class, 'logout'])
        ->name('logout');
});
