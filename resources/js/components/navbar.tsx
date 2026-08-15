import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

import AccountDropdown from '@/components/account-dropdown';
import AccountMenu from '@/components/account-menu';
import MobileMenu from '@/components/mobile-menu';
import SearchModal from '@/components/search-modal';
import type { SearchableMember } from '@/components/search-modal';
import ThemeToggle from '@/components/theme-toggle';
import { useLanguage } from '@/i18n/language-provider';
import { cn } from '@/lib/utils';
import { home } from '@/routes';

type NavbarProps = {
    members?: SearchableMember[];
    overlay?: boolean;
};

export default function Navbar({ members, overlay = false }: NavbarProps) {
    const { auth, site } = usePage().props;
    const { t } = useLanguage();

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            <div
                className={cn(
                    'relative sticky top-0 z-50 border-b border-black/10 bg-[#FDFDFC] dark:border-white/10 dark:bg-[#0a0a0a]',
                    overlay &&
                        'border-white/10 bg-transparent dark:border-white/10 dark:bg-transparent',
                )}
            >
                <header className="flex items-center justify-between gap-4 px-6 py-4">
                    <Link
                        href={home.url()}
                        className={cn(
                            '-ml-2 flex shrink-0 items-center gap-2 rounded-sm px-2 py-1 text-xl font-semibold tracking-tight transition hover:text-[#C9A227] active:scale-[0.98]',
                            overlay && 'text-white',
                        )}
                    >
                        {site.logo_url ? (
                            <img
                                src={site.logo_url}
                                alt={site.name}
                                className="h-7 w-auto object-contain"
                            />
                        ) : null}
                        {site.name}
                    </Link>

                    <div className="flex shrink-0 items-center gap-2">
                        {members ? (
                            <button
                                type="button"
                                onClick={() => setSearchOpen(true)}
                                aria-label={t('nav.openSearch')}
                                className={cn(
                                    'rounded-sm border border-black/15 p-2 text-[#1b1b18] transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 dark:border-white/15 dark:text-[#EDEDEC]',
                                    overlay &&
                                        'border-white/15 text-white dark:border-white/15 dark:text-white',
                                )}
                            >
                                <svg
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </button>
                        ) : null}

                        <ThemeToggle overlay={overlay} />

                        <div className="hidden items-center gap-2 md:flex">
                            {auth.user ? (
                                <AccountMenu
                                    user={auth.user}
                                    overlay={overlay}
                                />
                            ) : (
                                <AccountDropdown overlay={overlay} />
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setMenuOpen(true)}
                            aria-label={t('nav.openMenu')}
                            aria-expanded={menuOpen}
                            className={cn(
                                'rounded-sm border border-black/15 p-2 text-[#1b1b18] transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 md:hidden dark:border-white/15 dark:text-[#EDEDEC]',
                                overlay &&
                                    'border-white/15 text-white dark:border-white/15 dark:text-white',
                            )}
                        >
                            <svg
                                width={18}
                                height={18}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M3 6h18M3 12h18M3 18h18" />
                            </svg>
                        </button>
                    </div>
                </header>

                <MobileMenu
                    open={menuOpen}
                    onClose={() => setMenuOpen(false)}
                />
            </div>

            <SearchModal
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                members={members ?? []}
            />
        </>
    );
}
