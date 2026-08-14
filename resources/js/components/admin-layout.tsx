import { Head, Link } from '@inertiajs/react';

import type { ReactNode } from 'react';

import { useLanguage } from '@/i18n/language-provider';
import { home, logout } from '@/routes';

type AdminLayoutProps = {
    title: string;
    children: ReactNode;
};

export default function AdminLayout({ title, children }: AdminLayoutProps) {
    const { t } = useLanguage();

    return (
        <>
            <Head title={title} />

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
                    <Link
                        href={home.url()}
                        className="text-xl font-semibold tracking-tight"
                    >
                        {t('admin.brand')}
                    </Link>

                    <Link
                        href={logout.url()}
                        method="post"
                        as="button"
                        className="rounded-sm border border-black/15 px-4 py-2 text-sm font-medium transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 dark:border-white/15"
                    >
                        {t('nav.signOut')}
                    </Link>
                </header>

                <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
                    {children}
                </main>
            </div>
        </>
    );
}
