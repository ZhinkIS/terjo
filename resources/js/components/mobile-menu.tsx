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

type MobileMenuProps = {
    open: boolean;
    onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
    const { auth } = usePage().props;
    const { t, language, setLanguage } = useLanguage();

    const user = auth.user;

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
                    'absolute inset-x-0 top-full z-50 overflow-hidden rounded-b-2xl border-x border-b border-white/10 bg-[#111111] text-white shadow-2xl transition-all duration-200 ease-out md:hidden',
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
                                className="flex items-center gap-1 rounded-sm border border-white/15 px-3 py-1.5 text-sm font-medium text-white transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95"
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
                            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
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
                                        <p className="truncate text-sm text-white/60">
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
                                            <Link
                                                href={dashboard.url()}
                                                onClick={onClose}
                                                className="w-full rounded-lg bg-[#C9A227] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#b18f1f] active:scale-[0.98]"
                                            >
                                                {t('nav.dashboard')}
                                            </Link>

                                            <Link
                                                href={memberRoutes.show.url({
                                                    user: user.id,
                                                })}
                                                onClick={onClose}
                                                className="w-full rounded-lg border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-[0.98]"
                                            >
                                                {t('nav.profile')}
                                            </Link>

                                            <Link
                                                href={logout.url()}
                                                method="post"
                                                as="button"
                                                onClick={onClose}
                                                className="w-full rounded-lg border border-red-400/30 px-4 py-3 text-center text-sm font-semibold text-red-400 transition hover:border-red-400 active:scale-[0.98]"
                                            >
                                                {t('nav.signOut')}
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href={login.url()}
                                                onClick={onClose}
                                                className="w-full rounded-lg bg-[#C9A227] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#b18f1f] active:scale-[0.98]"
                                            >
                                                {t('nav.signIn')}
                                            </Link>

                                            <Link
                                                href={register.url()}
                                                onClick={onClose}
                                                className="w-full rounded-lg border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-[0.98]"
                                            >
                                                {t('nav.signUp')}
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </section>

                            <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                                <p className="text-xs font-semibold tracking-widest text-white/50 uppercase">
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
                                                        ? 'bg-white/10 text-white'
                                                        : 'text-white/70 hover:bg-white/5 hover:text-white',
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
