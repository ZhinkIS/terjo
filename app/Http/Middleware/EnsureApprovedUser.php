<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApprovedUser
{
    /**
     * Quarantine pending accounts to the pending page until an admin or the
     * owner approves them.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user !== null && $user->isPending()) {
            $route = $request->route();

            if ($route === null || ! in_array($route->getName(), ['pending', 'pending.status', 'logout'], true)) {
                return redirect()->route('pending');
            }
        }

        return $next($request);
    }
}
