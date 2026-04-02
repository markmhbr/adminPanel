<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\OtpVerification;
use App\Mail\SendOtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class UserAuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            if ($productId = session('buying_product_id')) {
                session()->forget('buying_product_id');
                $product = \App\Models\Product::find($productId);
                if ($product) {
                    return redirect()->route('checkout', $product->slug);
                }
            }

            if (Auth::user()->role === 'admin') {
                return redirect()->route('admin.dashboard');
            }
            return redirect()->route('landing');
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ]);
    }

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'npsn' => 'required|string|max:20',
            'school_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone_number' => 'required|string|max:20',
            'password' => 'required|min:8|confirmed',
        ]);

        $otp = rand(100000, 999999);

        OtpVerification::create([
            'email' => $request->email,
            'code' => $otp,
            'expires_at' => Carbon::now()->addMinutes(10),
            'registration_data' => $request->all()
        ]);

        Mail::to($request->email)->send(new SendOtpMail($otp));

        return redirect()->route('user.verify.show', ['email' => $request->email])
            ->with('info', 'Kode OTP telah dikirim ke email Anda.');
    }

    public function showVerify(Request $request)
    {
        return Inertia::render('Auth/VerifyOtp', ['email' => $request->email]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $verification = OtpVerification::where('email', $request->email)
            ->where('code', $request->code)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$verification) {
            return back()->withErrors(['code' => 'Kode OTP tidak valid atau sudah kedaluwarsa.']);
        }

        $data = $verification->registration_data;

        $user = User::create([
            'name' => $data['school_name'],
            'school_name' => $data['school_name'],
            'npsn' => $data['npsn'],
            'email' => $data['email'],
            'phone_number' => $data['phone_number'],
            'password' => Hash::make($data['password']),
            'role' => 'user',
        ]);

        $verification->delete();

        Auth::login($user);

        if ($productId = session('buying_product_id')) {
            session()->forget('buying_product_id');
            $product = \App\Models\Product::find($productId);
            if ($product) {
                return redirect()->route('checkout', $product->slug)->with('success', 'Pendaftaran berhasil! Silakan lanjutkan konfirmasi pesanan Anda.');
            }
        }

        return redirect()->route('landing')->with('success', 'Pendaftaran berhasil! Selamat datang.');
    }

    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $verification = OtpVerification::where('email', $request->email)->first();

        if (!$verification) {
            return back()->withErrors(['email' => 'Data pendaftaran tidak ditemukan.']);
        }

        $otp = rand(100000, 999999);
        $verification->update([
            'code' => $otp,
            'expires_at' => Carbon::now()->addMinutes(10),
        ]);

        Mail::to($request->email)->send(new SendOtpMail($otp));

        return back()->with('info', 'Kode OTP baru telah dikirim ke email Anda.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('landing');
    }

    // Ajax methods for compatibility with Modal-based login/register if needed
    public function ajaxLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $redirect = Auth::user()->role === 'admin' ? route('admin.dashboard') : route('landing');

            if ($productId = session('buying_product_id')) {
                session()->forget('buying_product_id');
                $product = \App\Models\Product::find($productId);
                if ($product) {
                    $redirect = route('checkout', $product->slug);
                }
            }

            return response()->json(['success' => true, 'redirect' => $redirect]);
        }

        return response()->json(['success' => false, 'message' => 'Email atau password salah.'], 422);
    }
}
