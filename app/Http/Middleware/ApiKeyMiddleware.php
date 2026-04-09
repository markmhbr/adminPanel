<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\AccessToken;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $key = $request->header('X-Admin-Hexanusa-Key') ?? $request->query('key');

        if (!$key) {
            return response()->json(['message' => 'API Key is missing.'], 401);
        }

        $token = AccessToken::where('token', $key)
            ->where('type', 'external-api')
            ->where('is_active', true)
            ->first();

        if (!$token) {
            return response()->json(['message' => 'Invalid or inactive API Key.'], 401);
        }

        return $next($request);
    }
}
