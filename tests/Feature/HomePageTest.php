<?php

use App\Models\Setting;
use App\Models\Slideshow;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests get no slideshow or directory props', function () {
    Slideshow::factory()->create(['is_active' => false]);
    Slideshow::factory()->create(['is_active' => true]);
    User::factory()->asMember()->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->missing('slideshows')
            ->missing('members'));
});

test('the landing page hero text comes from the site settings', function () {
    Setting::factory()->create([
        'hero_title' => 'Komunitas Terjocore Racing',
        'hero_subtitle' => 'Ruang kumpul pecinta motor sport.',
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('heroTitle', 'Komunitas Terjocore Racing')
            ->where('heroSubtitle', 'Ruang kumpul pecinta motor sport.'));
});

test('the landing page falls back to the default hero text', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('heroTitle', 'Komunitas '.config('app.name'))
            ->where('heroSubtitle', 'Ruang bersama bagi para pecinta otomotif untuk berbagi cerita, kegiatan, dan pengalaman.'));
});

test('approved members see the hero slideshow and the member directory', function () {
    $member = User::factory()->asMember()->create(['name' => 'Zee Viewer']);
    $peer = User::factory()->asMember()->create(['name' => 'Aam Peer']);

    $this->actingAs($member)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('members', 2)
            ->where('members.0.id', $peer->id)
            ->where('members.0.name', $peer->name)
            ->where('members.0.role', 'member')
            ->where('members.0.bio', $peer->bio));
});

test('the hero slideshow respects the configured position order', function () {
    $member = User::factory()->asMember()->create();
    $middle = Slideshow::factory()->create(['position' => 1]);
    $first = Slideshow::factory()->create(['position' => 0]);
    $last = Slideshow::factory()->create(['position' => 2]);

    $this->actingAs($member)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('slideshows', 3)
            ->where('slideshows.0.id', $first->id)
            ->where('slideshows.1.id', $middle->id)
            ->where('slideshows.2.id', $last->id));
});
