<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Any authenticated member may browse the community directory.
     */
    public function view(User $actor, User $user): bool
    {
        return true;
    }

    /**
     * The owner is absolute, admins may manage members, and members may
     * only edit their own profile.
     */
    public function update(User $actor, User $user): bool
    {
        return $actor->isOwner()
            || $actor->is($user)
            || ($actor->isAdmin() && $user->isMember());
    }

    /**
     * Only the owner may delete other staff members; admins may delete
     * members. Nobody may delete their own account.
     */
    public function delete(User $actor, User $user): bool
    {
        return ! $actor->is($user)
            && ($actor->isOwner() || ($actor->isAdmin() && $user->isMember()));
    }
}
