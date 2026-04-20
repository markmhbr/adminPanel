<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CustomerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        Log::info('CustomerMiddleware diagnostic', [
            'user_id' => Auth::id(),
            'role' => Auth::user() ? Auth::user()->role : 'guest',
            'path' => $request->path(),
        ]);
        if (Auth::check() && in_array(strtolower(Auth::user()->role), ['admin', 'customer', 'user'])) {
            return $next($request);
        }

        abort(403, 'Unauthorized access.');
    }
}
