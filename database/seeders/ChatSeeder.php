<?php

namespace Database\Seeders;

use App\Enums\ConversationType;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the global chat with every community member and a few
     * welcoming encrypted messages.
     */
    public function run(): void
    {
        $global = Conversation::firstOrCreate(
            ['type' => ConversationType::Global->value],
            ['name' => 'Global Chat'],
        );

        $global->users()->sync(User::all()->pluck('id'));

        if ($global->messages()->doesntExist()) {
            foreach (range(1, 3) as $index) {
                $sender = User::inRandomOrder()->first();

                if ($sender === null) {
                    return;
                }

                $global->messages()->create([
                    'user_id' => $sender->id,
                    'body' => "Salam hangat untuk seluruh anggota Terjocore! Ini pesan sambutan ke-{$index}.",
                ]);
            }
        }
    }
}
