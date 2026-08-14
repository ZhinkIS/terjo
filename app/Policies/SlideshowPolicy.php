<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Slideshow;
use App\Models\User;

class SlideshowPolicy
{
    /**
     * The owner and admins may manage the slideshow gallery.
     */
    public function before(User $user, string $ability): ?bool
    {
        return $user->role === UserRole::Owner || $user->role === UserRole::Admin
            ? true
            : null;
    }

    public function viewAny(User $user): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Slideshow $slideshow): bool
    {
        return false;
    }

    public function delete(User $user, Slideshow $slideshow): bool
    {
        return false;
    }
}
