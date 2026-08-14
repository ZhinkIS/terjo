<?php

namespace Database\Factories;

use App\Enums\ConversationType;
use App\Models\Conversation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Conversation>
 */
class ConversationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => ConversationType::Direct,
            'name' => null,
        ];
    }

    public function global(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => ConversationType::Global,
            'name' => 'Global Chat',
        ]);
    }

    public function direct(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => ConversationType::Direct,
        ]);
    }
}
