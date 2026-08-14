<?php

use App\Enums\ConversationType;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

test('the chat tables exist in the schema', function () {
    expect(Schema::hasTable('conversations'))->toBeTrue()
        ->and(Schema::hasTable('conversation_user'))->toBeTrue()
        ->and(Schema::hasTable('messages'))->toBeTrue();
});

test('the seeder creates a global chat with all members and welcome messages', function () {
    $this->seed();

    $conversation = Conversation::where('type', ConversationType::Global)->sole();

    expect($conversation->name)->toBe('Global Chat')
        ->and($conversation->users()->count())->toBe(34)
        ->and($conversation->messages()->count())->toBe(3);
});

test('messages are encrypted at rest', function () {
    $user = User::factory()->asMember()->create();
    $conversation = Conversation::factory()->global()->create();

    $message = Message::create([
        'conversation_id' => $conversation->id,
        'user_id' => $user->id,
        'body' => 'rahasia',
    ]);

    $raw = DB::table('messages')->where('id', $message->id)->value('body');

    expect($raw)->not->toBe('rahasia')
        ->and(str_contains($raw, 'rahasia'))->toBeFalse()
        ->and($message->refresh()->body)->toBe('rahasia');
});

test('direct conversations link their participants through the pivot', function () {
    $first = User::factory()->asMember()->create();
    $second = User::factory()->asMember()->create();

    $conversation = Conversation::create(['type' => ConversationType::Direct]);
    $conversation->users()->attach([$first->id, $second->id]);

    expect($conversation->users()->pluck('users.id')->all())
        ->toEqualCanonicalizing([$first->id, $second->id]);
});
