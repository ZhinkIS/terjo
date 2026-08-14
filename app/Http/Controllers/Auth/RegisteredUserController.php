<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        $user = User::create([
            ...$request->validated(),
            'role' => UserRole::Member,
            'status' => UserStatus::Pending,
        ]);

        Auth::login($user);

        $request->session()->regenerate();

        return redirect()->route('pending');
    }
}
