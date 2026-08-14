<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\RedirectIfAuthenticated as BaseRedirectIfAuthenticated;
use Illuminate\Http\Request;

class RedirectIfAuthenticated extends BaseRedirectIfAuthenticated
{
    /**
     * Send authenticated users back to the home page instead of the dashboard.
     */
    protected function redirectTo(Request $request): ?string
    {
        return route('home');
    }
}
