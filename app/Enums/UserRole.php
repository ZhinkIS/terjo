<?php

namespace App\Enums;

enum UserRole: string
{
    case Owner = 'owner';

    case Admin = 'admin';

    case Member = 'member';

    case Slave = 'slave';

    public function label(): string
    {
        return match ($this) {
            self::Owner => 'Owner',
            self::Admin => 'Admin',
            self::Member => 'Member',
            self::Slave => 'Slave',
        };
    }

    public function canManageSettings(): bool
    {
        return $this === self::Owner || $this === self::Admin;
    }

    /**
     * The authority level used to compare roles (Owner > Admin > Member > Slave).
     */
    public function rank(): int
    {
        return match ($this) {
            self::Owner => 4,
            self::Admin => 3,
            self::Member => 2,
            self::Slave => 1,
        };
    }
}
