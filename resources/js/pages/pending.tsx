import { Head, router, usePage } from '@inertiajs/react';

import { useEffect } from 'react';

import Navbar from '@/components/navbar';
import { useLanguage } from '@/i18n/language-provider';
import { home, login } from '@/routes';
import { status as pendingStatus } from '@/routes/pending';

export default function Pending() {
    const { site } = usePage().props;
    const { t } = useLanguage();

    useEffect(() => {
        const check = () => {
            fetch(pendingStatus.url())
                .then((response) => {
                    if (response.redirected) {
                        window.location.assign(login.url());

                        return;
                    }

                    return response.json();
                })
                .then((data: { status?: string } | undefined) => {
                    if (
                        data?.status === 'approved' ||
                        data?.status === 'deleted'
                    ) {
                        router.visit(home.url());
                    }
                })
                .catch(() => undefined);
        };

        check();

        const timer = setInterval(check, 4000);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Head title={`${t('pending.head')} · ${site.name}`} />

            <div className="flex min-h-svh flex-col bg-[var(--neu-bg)] text-[var(--neu-ink)] transition-colors duration-300">
                <Navbar pill />

                <main className="flex flex-1 items-center justify-center px-6 py-16">
                    <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-[2rem] bg-[var(--neu-bg)] p-8 text-center neu-raised sm:p-10">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--neu-bg)] text-[var(--neu-accent)] neu-raised-sm">
                            <svg
                                width={26}
                                height={26}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
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
                            <h1 className="text-2xl font-black tracking-tight text-[var(--neu-ink)] uppercase neu-text">
                                {t('pending.title')}
                            </h1>
                            <p className="mt-3 text-sm leading-relaxed text-[var(--neu-muted)]">
                                {t('pending.description')}
                            </p>
                        </div>

                        <span className="inline-flex rounded-full bg-[var(--neu-bg)] px-4 py-1.5 text-xs font-bold tracking-wide text-[var(--neu-accent)] neu-inset">
                            {t('pending.status')}
                        </span>

                        <p className="inline-flex items-center gap-2 text-xs text-[var(--neu-muted)]">
                            <span
                                aria-hidden="true"
                                className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--neu-accent)]"
                            />
                            {t('pending.checking')}
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
