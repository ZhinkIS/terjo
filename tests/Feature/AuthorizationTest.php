<?php

use App\Models\Slideshow;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

test('only the owner may delete a staff member', function () {
    $owner = User::factory()->asOwner()->create();
    $admin = User::factory()->asAdmin()->create();
    $member = User::factory()->asMember()->create();

    expect(Gate::forUser($owner)->allows('delete', $admin))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('delete', $admin))->toBeFalse()
        ->and(Gate::forUser($owner)->allows('delete', $owner))->toBeFalse()
        ->and(Gate::forUser($member)->allows('delete', $member))->toBeFalse();
});

test('admins may delete members but not the owner', function () {
    $owner = User::factory()->asOwner()->create();
    $admin = User::factory()->asAdmin()->create();
    $member = User::factory()->asMember()->create();

    expect(Gate::forUser($admin)->allows('delete', $member))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('delete', $owner))->toBeFalse();
});

test('the owner and admins may manage slideshows but members may not', function () {
    $owner = User::factory()->asOwner()->create();
    $admin = User::factory()->asAdmin()->create();
    $member = User::factory()->asMember()->create();

    expect(Gate::forUser($owner)->allows('create', Slideshow::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('create', Slideshow::class))->toBeTrue()
        ->and(Gate::forUser($member)->allows('create', Slideshow::class))->toBeFalse()
        ->and(Gate::forUser($member)->allows('viewAny', Slideshow::class))->toBeFalse();
});

test('the admin slideshow routes require the admin role', function () {
    $member = User::factory()->asMember()->create();
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($member)
        ->get(route('admin.slideshows.index'))
        ->assertForbidden();

    $this->actingAs($admin)
        ->get(route('admin.slideshows.index'))
        ->assertOk();
});

test('guests are redirected to login when visiting admin routes', function () {
    $this->get(route('admin.slideshows.index'))
        ->assertRedirect(route('login'));
});
