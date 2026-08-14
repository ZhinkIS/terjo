<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('an admin can update a member profile data', function () {
    $admin = User::factory()->asAdmin()->create();
    $member = User::factory()->asMember()->create();

    $this->actingAs($admin)
        ->patch(route('admin.members.update', $member), [
            'name' => 'Member Diedit',
            'bio' => 'Bio baru oleh admin',
            'location' => 'Surabaya',
            'age' => 31,
        ])
        ->assertRedirect();

    $member->refresh();

    expect($member->name)->toBe('Member Diedit')
        ->and($member->bio)->toBe('Bio baru oleh admin')
        ->and($member->location)->toBe('Surabaya')
        ->and($member->age)->toBe(31);
});

test('an admin can replace a member profile picture', function () {
    Storage::fake('public');

    $admin = User::factory()->asAdmin()->create();
    $member = User::factory()->asMember()->create([
        'profile_picture_url' => Storage::url('avatars/lama.jpg'),
    ]);

    Storage::disk('public')->put('avatars/lama.jpg', 'lama');

    $this->actingAs($admin)
        ->patch(route('admin.members.update', $member), [
            'name' => $member->name,
            'profile_picture' => UploadedFile::fake()->image('foto.jpg'),
        ])
        ->assertRedirect();

    $member->refresh();

    expect($member->profile_picture_url)->toStartWith('/storage/avatars/');

    Storage::disk('public')->assertMissing('avatars/lama.jpg');
});

test('an admin cannot update another admin', function () {
    $admin = User::factory()->asAdmin()->create();
    $otherAdmin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->patch(route('admin.members.update', $otherAdmin), [
            'name' => 'Perubahan',
        ])
        ->assertForbidden();
});

test('the owner can update an admin profile data', function () {
    $owner = User::factory()->asOwner()->create();
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($owner)
        ->patch(route('admin.members.update', $admin), [
            'name' => 'Admin Diedit',
        ])
        ->assertRedirect();

    expect($admin->fresh()->name)->toBe('Admin Diedit');
});

test('a member cannot access the member management endpoint', function () {
    $member = User::factory()->asMember()->create();
    $target = User::factory()->asMember()->create();

    $this->actingAs($member)
        ->patch(route('admin.members.update', $target), [
            'name' => 'Hack',
        ])
        ->assertForbidden();
});

test('the member name is required when updating', function () {
    $admin = User::factory()->asAdmin()->create();
    $member = User::factory()->asMember()->create();

    $this->actingAs($admin)
        ->patch(route('admin.members.update', $member), [
            'name' => '',
        ])
        ->assertSessionHasErrors('name');
});
