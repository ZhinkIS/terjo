<?php

use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\RegistrationController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\SlideshowController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MemberController as PublicMemberController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/members/{user}', [PublicMemberController::class, 'show'])
    ->middleware('auth')
    ->name('members.show');

Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->middleware('guest')
    ->name('login');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware(['guest', 'throttle:login'])
    ->name('login.store');

Route::get('/register', [RegisteredUserController::class, 'create'])
    ->middleware('guest')
    ->name('register');

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register.store');

Route::post('/logout', [LogoutController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::patch('/profile', [ProfileController::class, 'update'])
    ->middleware('auth')
    ->name('profile.update');

Route::get('/dashboard', DashboardController::class)
    ->middleware('auth')
    ->name('dashboard');

Route::inertia('/pending', 'pending')
    ->middleware('auth')
    ->name('pending');

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::put('slideshows/reorder', [SlideshowController::class, 'reorder'])
            ->name('slideshows.reorder');

        Route::resource('slideshows', SlideshowController::class)->except(['show']);

        Route::patch('members/{user}', [MemberController::class, 'update'])
            ->name('members.update');

        Route::delete('members/{user}', [MemberController::class, 'destroy'])
            ->name('members.destroy');

        Route::patch('registrations/{user}/approve', [RegistrationController::class, 'approve'])
            ->name('registrations.approve');

        Route::delete('registrations/{user}', [RegistrationController::class, 'reject'])
            ->name('registrations.reject');

        Route::put('settings', [SettingsController::class, 'update'])
            ->name('settings.update');
    });
