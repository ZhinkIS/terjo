import { Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

import { languages } from '@/i18n';
import { useLanguage } from '@/i18n/language-provider';
import { cn } from '@/lib/utils';
import { dashboard, login, logout, register } from '@/routes';
import memberRoutes from '@/routes/members';

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

const menuItemClassName =
    'flex w-full items-center justify-between gap-2 rounded-md px-4 py-2.5 text-sm text-[#1b1b18] transition-colors hover:bg-black/5 hover:text-[#C9A227] dark:text-[#EDEDEC] dark:hover:bg-white/10';

const neumorphicMenuItemClassName =
    'flex w-full items-center justify-between gap-2 rounded-full px-4 py-2.5 text-sm text-[var(--neu-ink)] transition hover:text-[var(--neu-accent)] active:scale-[0.98]';

type MobileMenuProps = {
    open: boolean;
    onClose: () => void;
    neumorphic?: boolean;
};

export default function MobileMenu({
    open,
    onClose,
    neumorphic = true,
}: MobileMenuProps) {
    const { auth } = usePage().props;
    const { t, language, setLanguage } = useLanguage();

    const user = auth.user;

    const itemClassName = neumorphic
        ? neumorphicMenuItemClassName
        : menuItemClassName;

    useEffect(() => {
        if (!open) {
            return;
        }

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, open]);

    return (
        <>
            <div
                aria-hidden="true"
                onClick={onClose}
                className={cn(
                    'fixed inset-0 z-40 bg-black/60 transition-opacity duration-200 md:hidden',
                    open ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
            />

            <div
                className={cn(
                    'absolute inset-x-0 top-full z-50 overflow-hidden rounded-b-2xl border-x border-b border-black/10 bg-[#FDFDFC] text-[#1b1b18] transition-all duration-200 ease-out md:hidden dark:border-white/10 dark:bg-[#111111] dark:text-white',
                    neumorphic
                        ? 'rounded-b-[2rem] border-0 bg-[var(--neu-bg)] text-[var(--neu-ink)] neu-raised-lg dark:bg-[var(--neu-bg)] dark:text-[var(--neu-ink)]'
                        : 'shadow-2xl',
                    open
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-3 opacity-0',
                )}
                aria-hidden={!open}
            >
                {open ? (
                    <div className="max-h-[calc(100svh-4.5rem)] overflow-y-auto">
                        <header className="flex items-center justify-end px-6 pt-5">
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label={t('nav.closeMenu')}
                                className={cn(
                                    'flex items-center gap-1 rounded-sm border border-black/15 px-3 py-1.5 text-sm font-medium transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 dark:border-white/15 dark:text-white',
                                    neumorphic &&
                                        'rounded-full border-0 bg-[var(--neu-bg)] px-4 py-2 text-[var(--neu-muted)] neu-raised-sm hover:text-[var(--neu-accent)] active:neu-inset-sm dark:border-0 dark:text-[var(--neu-muted)]',
                                )}
                            >
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
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                                {t('nav.menu')}
                            </button>
                        </header>

                        <div className="px-6 pt-4 pb-8">
                            <section
                                className={cn(
                                    'rounded-2xl border border-black/10 bg-black/5 p-5 dark:border-white/10 dark:bg-white/5',
                                    neumorphic &&
                                        'rounded-[1.5rem] border-0 bg-[var(--neu-bg)] neu-inset dark:bg-[var(--neu-bg)]',
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {user ? (
                                        user.profile_picture_url ? (
                                            <img
                                                src={user.profile_picture_url}
                                                alt={user.name}
                                                className="h-11 w-11 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/15 text-sm font-semibold text-[#C9A227]">
                                                {initials(user.name)}
                                            </span>
                                        )
                                    ) : (
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/15 text-[#C9A227]">
                                            <svg
                                                width={20}
                                                height={20}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <circle cx="12" cy="8" r="4" />
                                                <path d="M4 21a8 8 0 0 1 16 0" />
                                            </svg>
                                        </span>
                                    )}

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold">
                                            {user
                                                ? user.name
                                                : t('nav.account')}
                                        </p>
                                        <p className="truncate text-sm text-[#706f6c] dark:text-white/60">
                                            {user
                                                ? user.email
                                                : t(
                                                      'nav.mobileAccountSubtitle',
                                                  )}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-col gap-2.5">
                                    {user ? (
                                        <>
                                            {user.status !== 'pending' ? (
                                                <>
                                                    <Link
                                                        href={dashboard.url()}
                                                        onClick={onClose}
                                                        className={
                                                            itemClassName
                                                        }
                                                    >
                                                        {t('nav.dashboard')}
                                                    </Link>

                                                    <Link
                                                        href={memberRoutes.show.url(
                                                            {
                                                                user: user.id,
                                                            },
                                                        )}
                                                        onClick={onClose}
                                                        className={
                                                            itemClassName
                                                        }
                                                    >
                                                        {t('nav.profile')}
                                                    </Link>
                                                </>
                                            ) : null}

                                            <Link
                                                href={logout.url()}
                                                method="post"
                                                as="button"
                                                onClick={onClose}
                                                className={cn(
                                                    itemClassName,
                                                    'cursor-pointer text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:bg-zinc-800/60 dark:hover:text-red-300',
                                                )}
                                            >
                                                {t('nav.signOut')}
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href={login.url()}
                                                onClick={onClose}
                                                className={cn(
                                                    'w-full rounded-lg bg-[#C9A227] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#b18f1f] active:scale-[0.98]',
                                                    neumorphic &&
                                                        'rounded-full bg-[var(--neu-bg)] text-[var(--neu-accent)] neu-raised hover:bg-[var(--neu-bg)] active:neu-inset-sm',
                                                )}
                                            >
                                                {t('nav.signIn')}
                                            </Link>

                                            <Link
                                                href={register.url()}
                                                onClick={onClose}
                                                className={cn(
                                                    'w-full rounded-lg border border-black/15 px-4 py-3 text-center text-sm font-semibold transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-[0.98] dark:border-white/15 dark:text-white',
                                                    neumorphic &&
                                                        'rounded-full border-0 bg-[var(--neu-bg)] text-[var(--neu-ink)] neu-raised-sm hover:text-[var(--neu-accent)] active:neu-inset-sm dark:border-0 dark:text-[var(--neu-ink)]',
                                                )}
                                            >
                                                {t('nav.signUp')}
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </section>

                            <section
                                className={cn(
                                    'mt-4 rounded-2xl border border-black/10 bg-black/5 p-5 dark:border-white/10 dark:bg-white/5',
                                    neumorphic &&
                                        'rounded-[1.5rem] border-0 bg-[var(--neu-bg)] neu-inset dark:bg-[var(--neu-bg)]',
                                )}
                            >
                                <p
                                    className={cn(
                                        'text-xs font-semibold tracking-widest text-[#706f6c] uppercase dark:text-white/50',
                                        neumorphic &&
                                            'text-[var(--neu-muted)] dark:text-[var(--neu-muted)]',
                                    )}
                                >
                                    {t('nav.language')}
                                </p>

                                <div className="mt-3 flex flex-col gap-1">
                                    {languages.map((lang) => {
                                        const active = language === lang.code;

                                        return (
                                            <button
                                                key={lang.code}
                                                type="button"
                                                role="menuitemradio"
                                                aria-checked={active}
                                                onClick={() =>
                                                    setLanguage(lang.code)
                                                }
                                                className={cn(
                                                    'flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition active:scale-[0.98]',
                                                    active
                                                        ? 'bg-black/10 text-[#1b1b18] dark:bg-white/10 dark:text-white'
                                                        : 'text-[#706f6c] hover:bg-black/5 hover:text-[#1b1b18] dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white',
                                                    neumorphic &&
                                                        (active
                                                            ? 'rounded-full bg-[var(--neu-bg)] text-[var(--neu-accent)] neu-inset-sm dark:bg-[var(--neu-bg)] dark:text-[var(--neu-accent)]'
                                                            : 'rounded-full text-[var(--neu-muted)] hover:text-[var(--neu-ink)] dark:text-[var(--neu-muted)] dark:hover:text-[var(--neu-ink)]'),
                                                )}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <span aria-hidden="true">
                                                        {lang.flag}
                                                    </span>
                                                    {lang.label}
                                                </span>

                                                {active ? (
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
                                                        className="text-[#C9A227]"
                                                    >
                                                        <path d="M20 6 9 17l-5-5" />
                                                    </svg>
                                                ) : null}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}
