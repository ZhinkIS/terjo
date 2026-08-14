<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('a member can update their own profile', function () {
    $member = User::factory()->asMember()->create();

    $this->actingAs($member)
        ->patch(route('profile.update'), [
            'name' => 'Nama Baru',
            'bio' => 'Bio terbaru',
            'location' => 'Bandung',
            'age' => 28,
        ])
        ->assertRedirect();

    $member->refresh();

    expect($member->name)->toBe('Nama Baru')
        ->and($member->bio)->toBe('Bio terbaru')
        ->and($member->location)->toBe('Bandung')
        ->and($member->age)->toBe(28);
});

test('a member can upload a profile picture and replaces the previous one', function () {
    Storage::fake('public');

    $member = User::factory()->asMember()->create([
        'profile_picture_url' => Storage::url('avatars/lama.jpg'),
    ]);

    Storage::disk('public')->put('avatars/lama.jpg', 'lama');

    $this->actingAs($member)
        ->patch(route('profile.update'), [
            'name' => $member->name,
            'profile_picture' => UploadedFile::fake()->image('foto.jpg'),
        ])
        ->assertRedirect();

    $member->refresh();

    expect($member->profile_picture_url)->toStartWith('/storage/avatars/');

    Storage::disk('public')->assertMissing('avatars/lama.jpg');
});

test('the profile name is required', function () {
    $member = User::factory()->asMember()->create();

    $this->actingAs($member)
        ->patch(route('profile.update'), [
            'name' => '',
        ])
        ->assertSessionHasErrors('name');
});

test('a guest cannot update a profile', function () {
    $this->patch(route('profile.update'), [
        'name' => 'Tanpa Login',
    ])->assertRedirect(route('login'));
});
