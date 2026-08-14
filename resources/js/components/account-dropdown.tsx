import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

import { languages } from '@/i18n';
import { useLanguage } from '@/i18n/language-provider';
import { cn } from '@/lib/utils';
import { login, register } from '@/routes';

const menuItemClassName =
    'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-[#1b1b18] transition hover:bg-black/5 hover:text-[#C9A227] active:scale-[0.98] dark:text-[#EDEDEC] dark:hover:bg-white/10';

export default function AccountDropdown({
    overlay = false,
}: {
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
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C9A227]/15 text-[#C9A227]">
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
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                    </svg>
                </span>

                <span className="hidden lg:inline">{t('nav.account')}</span>

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
                    className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-black/10 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-[#161615]"
                >
                    <p className="px-3 pt-1 pb-1.5 text-xs font-semibold tracking-wide text-[#706f6c] dark:text-[#A1A09A]">
                        {t('nav.account')}
                    </p>

                    <div className="flex flex-col gap-1">
                        <Link
                            href={login.url()}
                            onClick={() => setOpen(false)}
                            role="menuitem"
                            className="rounded-md bg-[#C9A227] px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#b18f1f] active:scale-[0.98]"
                        >
                            {t('nav.signIn')}
                        </Link>

                        <Link
                            href={register.url()}
                            onClick={() => setOpen(false)}
                            role="menuitem"
                            className={cn(
                                menuItemClassName,
                                'justify-center border border-black/15 dark:border-white/15',
                            )}
                        >
                            {t('nav.signUp')}
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
                </div>
            ) : null}
        </div>
    );
}
