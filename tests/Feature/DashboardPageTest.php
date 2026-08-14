<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a guest is redirected from the dashboard to the login page', function () {
    $this->get(route('dashboard'))
        ->assertRedirect(route('login'));
});

test('a member sees the dashboard with their own profile data', function () {
    $member = User::factory()->asMember()->create();

    $this->actingAs($member)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('auth.user.name', $member->name)
            ->has('members', 0));
});

test('an admin sees the dashboard with the member list and settings', function () {
    $admin = User::factory()->asAdmin()->create();
    $member = User::factory()->asMember()->create();
    $otherAdmin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('members', 1)
            ->where('members.0.id', $member->id)
            ->where('members.0.role', 'member')
            ->where('settings.site_name', config('app.name')));
});

test('the owner sees admins in the dashboard member list', function () {
    $owner = User::factory()->asOwner()->create();
    User::factory()->asAdmin()->create(['name' => 'Zee Admin']);
    User::factory()->asMember()->create(['name' => 'Aam Member']);

    $this->actingAs($owner)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('members', 2)
            ->where('members.0.name', 'Aam Member')
            ->where('members.0.role', 'member')
            ->where('members.1.name', 'Zee Admin')
            ->where('members.1.role', 'admin'));
});
