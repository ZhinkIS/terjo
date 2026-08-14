<?php

namespace Database\Factories;

use App\Models\Slideshow;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Slideshow>
 */
class SlideshowFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'image_path' => '/images/slide1.jpg',
            'is_active' => true,
        ];
    }
}
