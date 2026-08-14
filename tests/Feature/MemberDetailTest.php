<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a guest is redirected to login when viewing a member detail page', function () {
    $member = User::factory()->asMember()->create();

    $this->get(route('members.show', $member))
        ->assertRedirect(route('login'));
});

test('an approved member can view another member detail page', function () {
    $viewer = User::factory()->asMember()->create();
    $member = User::factory()->asMember()->create([
        'name' => 'Rizal Dinasti',
        'bio' => 'Pecinta mobil klasik yang suka touring akhir pekan.',
        'age' => 34,
        'location' => 'Jakarta',
    ]);

    $this->actingAs($viewer)
        ->get(route('members.show', $member))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('members/show')
            ->where('member.name', $member->name)
            ->where('member.bio', $member->bio)
            ->where('member.age', 34)
            ->where('member.location', 'Jakarta'));
});

test('a pending member detail page is not exposed', function () {
    $viewer = User::factory()->asMember()->create();
    $pending = User::factory()->asMember()->asPending()->create();

    $this->actingAs($viewer)
        ->get(route('members.show', $pending))
        ->assertNotFound();
});

test('a pending user is redirected to the pending page when viewing a member detail', function () {
    $member = User::factory()->asMember()->create();
    $pending = User::factory()->asMember()->asPending()->create();

    $this->actingAs($pending)
        ->get(route('members.show', $member))
        ->assertRedirect(route('pending'));
});
