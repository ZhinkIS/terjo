<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    /**
     * Render the Wikipedia-style detail page for an approved member.
     * Pending members are never exposed, not even to staff.
     */
    public function show(User $user): Response
    {
        abort_unless($user->isApproved(), 404);

        return Inertia::render('members/show', [
            'member' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'bio' => $user->bio,
                'age' => $user->age,
                'location' => $user->location,
                'profile_picture_url' => $user->profile_picture_url,
                'created_at' => $user->created_at?->toDateString(),
            ],
        ]);
    }
}
