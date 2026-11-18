import { useLanguage } from '@/i18n/language-provider';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

const ROLE_BADGE_CLASSES: Record<Role, string> = {
    owner: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    admin: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    member: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
    slave: 'bg-red-950/40 text-red-400 border border-red-900/50',
};

const NEUMORPHIC_ROLE_BADGE_CLASSES: Record<Role, string> = {
    owner: 'bg-[var(--neu-bg)] text-amber-600 dark:text-amber-400',
    admin: 'bg-[var(--neu-bg)] text-blue-600 dark:text-blue-400',
    member: 'bg-[var(--neu-bg)] text-[var(--neu-muted)]',
    slave: 'bg-[var(--neu-bg)] text-red-600 dark:text-red-400',
};

const ROLE_I18N_KEYS: Record<Role, string> = {
    owner: 'role.owner',
    admin: 'role.admin',
    member: 'role.member',
    slave: 'role.slave',
};

type RoleBadgeVariant = 'default' | 'neumorphic';

type RoleBadgeProps = {
    role: Role;
    className?: string;
    variant?: RoleBadgeVariant;
};

export default function RoleBadge({
    role,
    className,
    variant = 'neumorphic',
}: RoleBadgeProps) {
    const { t } = useLanguage();

    return (
        <span
            className={cn(
                'inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                variant === 'neumorphic'
                    ? cn(
                          NEUMORPHIC_ROLE_BADGE_CLASSES[role],
                          'font-semibold neu-inset-sm',
                      )
                    : ROLE_BADGE_CLASSES[role],
                className,
            )}
        >
            {t(ROLE_I18N_KEYS[role] as 'role.owner')}
        </span>
    );
}

export { ROLE_BADGE_CLASSES, ROLE_I18N_KEYS };
