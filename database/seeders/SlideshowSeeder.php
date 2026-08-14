<?php

namespace Database\Seeders;

use App\Models\Slideshow;
use Illuminate\Database\Seeder;

class SlideshowSeeder extends Seeder
{
    /**
     * The prepared default slideshow images (never regenerate or replace).
     *
     * @var array<int, array{path: string, position: int}>
     */
    private const SLIDES = [
        ['path' => '/images/slide1.jpg', 'position' => 0],
        ['path' => '/images/slide2.jpg', 'position' => 1],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::SLIDES as $slide) {
            Slideshow::create([
                'image_path' => $slide['path'],
                'is_active' => true,
                'position' => $slide['position'],
            ]);
        }
    }
}
