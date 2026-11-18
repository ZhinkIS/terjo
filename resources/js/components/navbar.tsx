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
    pill?: boolean;
};

export default function Navbar({ members, pill = false }: NavbarProps) {
    const { auth, site } = usePage().props;
    const { t } = useLanguage();

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            <div
                className={cn(
                    'sticky top-0 z-50 bg-[var(--neu-bg)]/90 backdrop-blur-md',
                    pill
                        ? 'px-3 pt-4 pb-2 sm:px-6'
                        : 'px-3 pt-2 pb-2 shadow-[inset_0_-2px_6px_var(--neu-shadow-dark)] sm:px-6',
                )}
            >
                <div
                    className={cn(
                        'mx-auto w-full max-w-6xl',
                        pill &&
                            'relative rounded-full bg-[var(--neu-bg)] px-1 neu-raised',
                    )}
                >
                    <header
                        className={cn(
                            'flex items-center justify-between gap-4',
                            pill ? 'px-4 py-2.5 sm:px-6' : 'px-6 py-4',
                        )}
                    >
                        <Link
                            href={home.url()}
                            className="-ml-2 flex shrink-0 items-center gap-2 rounded-sm px-2 py-1 text-xl font-semibold tracking-tight text-[var(--neu-ink)] transition hover:text-[var(--neu-accent)] active:scale-[0.98]"
                        >
                            <img
                                src="/images/logo.png"
                                alt={site.name}
                                className="h-9 w-9 rounded-lg object-contain"
                            />
                            <span className="hidden truncate sm:inline">
                                {site.name}
                            </span>
                        </Link>

                        <div className="flex shrink-0 items-center gap-2">
                            {members ? (
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(true)}
                                    aria-label={t('nav.openSearch')}
                                    className="rounded-full border-0 bg-[var(--neu-bg)] p-2.5 text-[var(--neu-muted)] neu-raised-sm transition hover:text-[var(--neu-accent)] active:scale-95 active:neu-inset-sm"
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

                            <ThemeToggle />

                            <div className="hidden items-center gap-2 md:flex">
                                {auth.user ? (
                                    <AccountMenu user={auth.user} />
                                ) : (
                                    <AccountDropdown />
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setMenuOpen(true)}
                                aria-label={t('nav.openMenu')}
                                aria-expanded={menuOpen}
                                className="rounded-full border-0 bg-[var(--neu-bg)] p-2.5 text-[var(--neu-muted)] neu-raised-sm transition hover:text-[var(--neu-accent)] active:scale-95 active:neu-inset-sm md:hidden"
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
            </div>

            <SearchModal
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                members={members ?? []}
            />
        </>
    );
}
