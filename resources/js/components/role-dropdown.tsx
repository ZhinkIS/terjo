import { useEffect, useRef, useState } from 'react';

import { useLanguage } from '@/i18n/language-provider';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

import { ROLE_BADGE_CLASSES, ROLE_I18N_KEYS } from './role-badge';

const ROLE_OPTIONS: Role[] = ['admin', 'member', 'slave'];

type RoleDropdownProps = {
    value: Role;
    onChange: (role: Role) => void;
    className?: string;
};

export default function RoleDropdown({
    value,
    onChange,
    className,
}: RoleDropdownProps) {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    return (
        <div ref={ref} className={cn('relative', className)}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={cn(
                    'inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition hover:opacity-80',
                    ROLE_BADGE_CLASSES[value],
                )}
            >
                {t(ROLE_I18N_KEYS[value] as 'role.owner')}
                <svg
                    width={10}
                    height={10}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={cn('transition-transform', open && 'rotate-180')}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {open ? (
                <div className="absolute left-0 z-50 mt-1.5 w-36 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl">
                    {ROLE_OPTIONS.map((role) => (
                        <button
                            key={role}
                            type="button"
                            onClick={() => {
                                onChange(role);
                                setOpen(false);
                            }}
                            className={cn(
                                'flex w-full items-center px-3 py-2 text-xs transition hover:bg-zinc-800',
                                role === value && 'bg-zinc-800',
                            )}
                        >
                            <span
                                className={cn(
                                    'inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                                    ROLE_BADGE_CLASSES[role],
                                )}
                            >
                                {t(ROLE_I18N_KEYS[role] as 'role.owner')}
                            </span>
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
