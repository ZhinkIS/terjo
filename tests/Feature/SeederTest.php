<?php

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Slideshow;
use App\Models\User;

test('the database seeder creates exactly 34 community members', function () {
    $this->seed();

    expect(User::count())->toBe(34)
        ->and(User::where('role', UserRole::Owner)->count())->toBe(1)
        ->and(User::where('role', UserRole::Admin)->count())->toBe(3)
        ->and(User::where('role', UserRole::Member)->count())->toBe(30)
        ->and(User::where('status', UserStatus::Approved)->count())->toBe(34);
});

test('the database seeder creates the two default slideshows', function () {
    $this->seed();

    expect(Slideshow::count())->toBe(2)
        ->and(Slideshow::where('image_path', '/images/slide1.jpg')->exists())->toBeTrue()
        ->and(Slideshow::where('image_path', '/images/slide2.jpg')->exists())->toBeTrue()
        ->and(Slideshow::where('is_active', true)->count())->toBe(2);
});

test('seeded users carry complete profile data', function () {
    $this->seed();

    User::query()->each(function (User $user): void {
        expect($user->name)->not->toBeNull()
            ->and($user->bio)->not->toBeNull()
            ->and($user->age)->not->toBeNull()
            ->and($user->location)->not->toBeNull()
            ->and($user->profile_picture_url)->toStartWith('/images/avatars/');
    });
});
