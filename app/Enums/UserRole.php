<?php

namespace App\Enums;

enum UserRole: string
{
    case Owner = 'owner';

    case Admin = 'admin';

    case Member = 'member';

    public function label(): string
    {
        return match ($this) {
            self::Owner => 'Owner',
            self::Admin => 'Admin',
            self::Member => 'Member',
        };
    }

    public function canManageSettings(): bool
    {
        return $this === self::Owner || $this === self::Admin;
    }

    /**
     * The authority level used to compare roles (Owner > Admin > Member).
     */
    public function rank(): int
    {
        return match ($this) {
            self::Owner => 3,
            self::Admin => 2,
            self::Member => 1,
        };
    }
}
