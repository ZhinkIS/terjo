<?php

use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('an admin can update the site name', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'site_name' => 'Terjocore Racing',
        ])
        ->assertRedirect();

    expect(Setting::current()->site_name)->toBe('Terjocore Racing');
});

test('an admin can update the landing page hero text', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'site_name' => 'Terjocore',
            'hero_title' => 'Komunitas Terjocore Racing',
            'hero_subtitle' => 'Ruang kumpul pecinta motor sport.',
        ])
        ->assertRedirect();

    $settings = Setting::current();

    expect($settings->hero_title)->toBe('Komunitas Terjocore Racing')
        ->and($settings->hero_subtitle)->toBe('Ruang kumpul pecinta motor sport.');
});

test('an admin can upload a site logo', function () {
    Storage::fake('public');

    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'site_name' => 'Terjocore',
            'logo' => UploadedFile::fake()->image('logo.png'),
        ])
        ->assertRedirect();

    $settings = Setting::current();

    expect($settings->logo_path)->toStartWith('settings/');

    Storage::disk('public')->assertExists($settings->logo_path);
});

test('a member cannot update site settings', function () {
    $member = User::factory()->asMember()->create();

    $this->actingAs($member)
        ->put(route('admin.settings.update'), [
            'site_name' => 'Hack',
        ])
        ->assertForbidden();
});

test('the site name is required when updating settings', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'site_name' => '',
        ])
        ->assertSessionHasErrors('site_name');
});
