<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a pending user is redirected to the pending page when accessing community features', function () {
    $pending = User::factory()->asMember()->asPending()->create();

    $this->actingAs($pending)
        ->get(route('dashboard'))
        ->assertRedirect(route('pending'));

    $this->actingAs($pending)
        ->get(route('home'))
        ->assertRedirect(route('pending'));
});

test('a pending user can view the pending page', function () {
    $pending = User::factory()->asMember()->asPending()->create();

    $this->actingAs($pending)
        ->get(route('pending'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('pending'));
});

test('a guest is redirected to login when visiting the pending page', function () {
    $this->get(route('pending'))->assertRedirect(route('login'));
});

test('pending users are hidden from the member directory', function () {
    $viewer = User::factory()->asMember()->create(['name' => 'Zee Viewer']);
    $approved = User::factory()->asMember()->create(['name' => 'Aam Approved']);
    User::factory()->asMember()->asPending()->create(['name' => 'Mid Pending']);

    $this->actingAs($viewer)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('members', 2)
            ->where('members.0.id', $approved->id));
});
