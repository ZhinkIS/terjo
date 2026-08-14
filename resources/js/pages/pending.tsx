import { Head, Link, usePage } from '@inertiajs/react';

import ThemeToggle from '@/components/theme-toggle';
import { useLanguage } from '@/i18n/language-provider';
import { home, logout } from '@/routes';

export default function Pending() {
    const { site } = usePage().props;
    const { t } = useLanguage();

    return (
        <>
            <Head title={`${t('pending.head')} · ${site.name}`} />

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
                    <Link
                        href={home.url()}
                        className="text-xl font-semibold tracking-tight"
                    >
                        {site.name}
                    </Link>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link
                            href={logout.url()}
                            method="post"
                            as="button"
                            className="rounded-sm border border-black/15 px-4 py-2 text-sm font-medium transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 dark:border-white/15"
                        >
                            {t('nav.signOut')}
                        </Link>
                    </div>
                </header>

                <main className="flex flex-1 items-center justify-center px-6 py-16">
                    <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-black/10 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-[#161615]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A227]/15">
                            <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                                className="text-[#C9A227]"
                            >
                                <rect
                                    width="18"
                                    height="11"
                                    x="3"
                                    y="11"
                                    rx="2"
                                    ry="2"
                                />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {t('pending.title')}
                            </h1>
                            <p className="mt-3 text-sm leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                                {t('pending.description')}
                            </p>
                        </div>

                        <span className="inline-flex rounded-full bg-[#C9A227]/15 px-3 py-1 text-xs font-medium text-[#C9A227]">
                            {t('pending.status')}
                        </span>
                    </div>
                </main>
            </div>
        </>
    );
}
