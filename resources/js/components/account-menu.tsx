import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

import { languages } from '@/i18n';
import { useLanguage } from '@/i18n/language-provider';
import { cn } from '@/lib/utils';
import { dashboard, logout } from '@/routes';
import memberRoutes from '@/routes/members';
import type { User } from '@/types';

const menuItemClassName =
    'flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-[#1b1b18] transition hover:bg-black/5 hover:text-[#C9A227] active:scale-[0.98] dark:text-[#EDEDEC] dark:hover:bg-white/10';

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

export default function AccountMenu({
    user,
    overlay = false,
}: {
    user: User;
    overlay?: boolean;
}) {
    const { t, language, setLanguage } = useLanguage();

    const [open, setOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () =>
            document.removeEventListener('pointerdown', handlePointerDown);
    }, [open]);

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-haspopup="menu"
                aria-expanded={open}
                className={cn(
                    'flex items-center gap-2 rounded-sm border border-black/15 py-1 pr-3 pl-1 text-sm text-[#1b1b18] transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-[0.98] dark:border-white/15 dark:text-[#EDEDEC]',
                    overlay &&
                        'border-white/15 text-white dark:border-white/15 dark:text-white',
                )}
            >
                {user.profile_picture_url ? (
                    <img
                        src={user.profile_picture_url}
                        alt={user.name}
                        className="h-7 w-7 rounded-full object-cover"
                    />
                ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C9A227]/15 text-xs font-semibold text-[#C9A227]">
                        {initials(user.name)}
                    </span>
                )}

                <span className="hidden max-w-32 truncate lg:inline">
                    {user.name}
                </span>

                <svg
                    width={12}
                    height={12}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {open ? (
                <div
                    role="menu"
                    className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-black/10 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-[#161615]"
                >
                    <div className="flex flex-col gap-1">
                        <Link
                            href={dashboard.url()}
                            onClick={() => setOpen(false)}
                            role="menuitem"
                            className="rounded-lg bg-neutral-800 px-4 py-3 text-sm font-semibold text-[#C9A227] transition hover:bg-neutral-700 active:scale-[0.98] dark:bg-neutral-800 dark:hover:bg-neutral-700"
                        >
                            {t('nav.dashboard')}
                        </Link>

                        <Link
                            href={memberRoutes.show.url({ user: user.id })}
                            onClick={() => setOpen(false)}
                            role="menuitem"
                            className={menuItemClassName}
                        >
                            {t('nav.profile')}
                        </Link>
                    </div>

                    <div className="my-2 border-t border-black/10 dark:border-white/10" />

                    <div className="flex flex-col gap-1">
                        <p className="px-3 pt-1 pb-0.5 text-xs font-medium text-[#706f6c] dark:text-[#A1A09A]">
                            {t('nav.language')}
                        </p>

                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                type="button"
                                role="menuitemradio"
                                aria-checked={language === lang.code}
                                onClick={() => setLanguage(lang.code)}
                                className={cn(
                                    menuItemClassName,
                                    language === lang.code
                                        ? 'text-[#C9A227]'
                                        : undefined,
                                )}
                            >
                                <span>{lang.label}</span>

                                {language === lang.code ? (
                                    <svg
                                        width={14}
                                        height={14}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                ) : null}
                            </button>
                        ))}
                    </div>

                    <div className="my-2 border-t border-black/10 dark:border-white/10" />

                    <Link
                        href={logout.url()}
                        method="post"
                        as="button"
                        role="menuitem"
                        className={cn(
                            menuItemClassName,
                            'text-red-600 dark:text-red-400',
                        )}
                    >
                        {t('nav.signOut')}
                    </Link>
                </div>
            ) : null}
        </div>
    );
}
