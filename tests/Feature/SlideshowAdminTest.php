<?php

use App\Models\Slideshow;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('an admin can create a slideshow from an uploaded image', function () {
    Storage::fake('public');
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->post(route('admin.slideshows.store'), [
            'image' => UploadedFile::fake()->image('slide.jpg', 1600, 600),
            'is_active' => '1',
        ])
        ->assertRedirect(route('admin.slideshows.index'));

    $slideshow = Slideshow::sole();

    expect($slideshow->is_active)->toBeTrue()
        ->and($slideshow->image_path)->toStartWith('slideshows/');

    Storage::disk('public')->assertExists($slideshow->image_path);
});

test('a slideshow requires an image on create', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->post(route('admin.slideshows.store'), [])
        ->assertSessionHasErrors('image');
});

test('a member cannot create a slideshow', function () {
    $member = User::factory()->asMember()->create();

    $this->actingAs($member)
        ->post(route('admin.slideshows.store'), [
            'image' => UploadedFile::fake()->image('slide.jpg'),
        ])
        ->assertForbidden();
});

test('an admin can update a slideshow and replace its image', function () {
    Storage::fake('public');
    $admin = User::factory()->asAdmin()->create();
    $slideshow = Slideshow::factory()->create(['image_path' => 'slideshows/old.jpg']);

    $this->actingAs($admin)
        ->put(route('admin.slideshows.update', $slideshow), [
            'image' => UploadedFile::fake()->image('new.jpg', 1600, 600),
            'is_active' => '0',
        ])
        ->assertRedirect(route('admin.slideshows.index'));

    $slideshow->refresh();

    expect($slideshow->is_active)->toBeFalse()
        ->and($slideshow->image_path)->toStartWith('slideshows/');

    Storage::disk('public')->assertExists($slideshow->image_path);
    Storage::disk('public')->assertMissing('slideshows/old.jpg');
});

test('an admin can delete a slideshow and its image', function () {
    Storage::fake('public');
    $admin = User::factory()->asAdmin()->create();
    $slideshow = Slideshow::factory()->create(['image_path' => 'slideshows/delete-me.jpg']);

    $this->actingAs($admin)
        ->delete(route('admin.slideshows.destroy', $slideshow))
        ->assertRedirect(route('admin.slideshows.index'));

    expect(Slideshow::find($slideshow->id))->toBeNull();

    Storage::disk('public')->assertMissing('slideshows/delete-me.jpg');
});

test('a new slideshow is appended after the existing ones', function () {
    Storage::fake('public');
    $admin = User::factory()->asAdmin()->create();
    Slideshow::factory()->create(['position' => 0]);
    Slideshow::factory()->create(['position' => 1]);

    $this->actingAs($admin)
        ->post(route('admin.slideshows.store'), [
            'image' => UploadedFile::fake()->image('slide.jpg', 1600, 600),
            'is_active' => '1',
        ])
        ->assertRedirect(route('admin.slideshows.index'));

    $slideshow = Slideshow::latest('id')->first();

    expect($slideshow?->position)->toBe(2);
});

test('an admin can reorder slideshows', function () {
    $admin = User::factory()->asAdmin()->create();
    $first = Slideshow::factory()->create(['position' => 0]);
    $second = Slideshow::factory()->create(['position' => 1]);
    $third = Slideshow::factory()->create(['position' => 2]);

    $this->actingAs($admin)
        ->put(route('admin.slideshows.reorder'), [
            'ids' => [$third->id, $first->id, $second->id],
        ])
        ->assertRedirect();

    expect($third->fresh()?->position)->toBe(0)
        ->and($first->fresh()?->position)->toBe(1)
        ->and($second->fresh()?->position)->toBe(2);
});

test('a member cannot reorder slideshows', function () {
    $member = User::factory()->asMember()->create();
    $slideshow = Slideshow::factory()->create();

    $this->actingAs($member)
        ->put(route('admin.slideshows.reorder'), [
            'ids' => [$slideshow->id],
        ])
        ->assertForbidden();
});
