<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Allow requests where the authenticated user's role is at least the
     * requested minimum (Owner > Admin > Member).
     */
    public function handle(Request $request, Closure $next, string $minimumRole): Response
    {
        $user = $request->user();

        $minimum = UserRole::from($minimumRole)->rank();

        if ($user === null || $user->role->rank() < $minimum) {
            abort(403);
        }

        return $next($request);
    }
}
