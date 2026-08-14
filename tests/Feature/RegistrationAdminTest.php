<?php

use App\Enums\UserStatus;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('an admin can approve a pending registration', function () {
    $admin = User::factory()->asAdmin()->create();
    $pending = User::factory()->asMember()->asPending()->create();

    $this->actingAs($admin)
        ->patch(route('admin.registrations.approve', $pending))
        ->assertRedirect();

    expect($pending->fresh()->status)->toBe(UserStatus::Approved);
});

test('an admin can reject a pending registration by deleting the account', function () {
    $admin = User::factory()->asAdmin()->create();
    $pending = User::factory()->asMember()->asPending()->create();

    $this->actingAs($admin)
        ->delete(route('admin.registrations.reject', $pending))
        ->assertRedirect();

    expect(User::find($pending->id))->toBeNull();
});

test('a member cannot approve or reject registrations', function () {
    $member = User::factory()->asMember()->create();
    $pending = User::factory()->asMember()->asPending()->create();

    $this->actingAs($member)
        ->patch(route('admin.registrations.approve', $pending))
        ->assertForbidden();

    $this->actingAs($member)
        ->delete(route('admin.registrations.reject', $pending))
        ->assertForbidden();
});

test('an admin can kick a member from the community', function () {
    $admin = User::factory()->asAdmin()->create();
    $member = User::factory()->asMember()->create();

    $this->actingAs($admin)
        ->delete(route('admin.members.destroy', $member))
        ->assertRedirect();

    expect(User::find($member->id))->toBeNull();
});

test('an admin cannot kick an owner', function () {
    $admin = User::factory()->asAdmin()->create();
    $owner = User::factory()->asOwner()->create();

    $this->actingAs($admin)
        ->delete(route('admin.members.destroy', $owner))
        ->assertForbidden();
});

test('the owner can kick an admin', function () {
    $owner = User::factory()->asOwner()->create();
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($owner)
        ->delete(route('admin.members.destroy', $admin))
        ->assertRedirect();

    expect(User::find($admin->id))->toBeNull();
});

test('a member cannot kick anyone', function () {
    $member = User::factory()->asMember()->create();
    $target = User::factory()->asMember()->create();

    $this->actingAs($member)
        ->delete(route('admin.members.destroy', $target))
        ->assertForbidden();
});

test('the dashboard shows pending registrations to the owner', function () {
    $owner = User::factory()->asOwner()->create();
    $pending = User::factory()->asMember()->asPending()->create([
        'name' => 'Aam Pendaftar',
    ]);

    $this->actingAs($owner)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('pendingRegistrations', 1)
            ->where('pendingRegistrations.0.id', $pending->id));
});
