<?php

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;

test('a new user registers as a pending member and is redirected to the pending page', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test Member',
        'email' => 'member@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect(route('pending'));

    $this->assertAuthenticated();

    $user = User::where('email', 'member@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->role)->toBe(UserRole::Member)
        ->and($user->status)->toBe(UserStatus::Pending);
});

test('registration requires unique emails', function () {
    User::factory()->create(['email' => 'member@example.com']);

    $this->post(route('register.store'), [
        'name' => 'Test Member',
        'email' => 'member@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors('email');
});

test('a user can log in and is redirected to the home page', function () {
    $user = User::factory()->asMember()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('home'));

    $this->assertAuthenticatedAs($user);
});

test('login fails with incorrect credentials', function () {
    $user = User::factory()->asMember()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('an authenticated user can log out', function () {
    $user = User::factory()->asMember()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect(route('home'));

    $this->assertGuest();
});

test('guests are redirected to login when accessing the dashboard', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users are redirected away from the login page', function () {
    $user = User::factory()->asMember()->create();

    $this->actingAs($user)
        ->get(route('login'))
        ->assertRedirect(route('home'));
});
