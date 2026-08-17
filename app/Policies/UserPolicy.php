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
     * Owner may update anyone except other Owners; admin may update any
     * non-Owner user; a user may always update their own profile.
     */
    public function update(User $actor, User $user): bool
    {
        if ($actor->isOwner() && ! $user->isOwner()) {
            return true;
        }

        if ($actor->isAdmin() && ($user->isMember() || $user->isSlave())) {
            return true;
        }

        return $actor->is($user);
    }

    /**
     * Owner may delete anyone except themselves; admin may delete any
     * non-Owner user. Nobody may delete their own account.
     */
    public function delete(User $actor, User $user): bool
    {
        return ! $actor->is($user)
            && ($actor->isOwner() || ($actor->isAdmin() && ($user->isMember() || $user->isSlave())));
    }

    /**
     * Only owner or admin may change another user's role.  Nobody may
     * promote anyone to Owner.
     */
    public function updateRole(User $actor, User $user): bool
    {
        if ($user->isOwner()) {
            return false;
        }

        return $actor->isOwner() || $actor->isAdmin();
    }
}
