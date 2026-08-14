import { Head, Link, usePage } from '@inertiajs/react';

import Navbar from '@/components/navbar';
import { useLanguage } from '@/i18n/language-provider';
import type { Dictionary } from '@/i18n/locales/id';
import { dashboard, home } from '@/routes';
import type { Role } from '@/types';

type MemberDetail = {
    id: number;
    name: string;
    email: string;
    role: Role;
    bio: string | null;
    age: number | null;
    location: string | null;
    profile_picture_url: string | null;
    created_at: string | null;
};

const roleLabelKeys: Record<Role, keyof Dictionary> = {
    owner: 'role.owner',
    admin: 'role.admin',
    member: 'role.member',
};

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

export default function MemberShow({ member }: { member: MemberDetail }) {
    const { site } = usePage().props;
    const { t } = useLanguage();

    return (
        <>
            <Head title={`${member.name} - ${site.name}`} />

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <Navbar>
                    <Link
                        href={dashboard.url()}
                        className="rounded-sm bg-[#C9A227] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b18f1f] active:scale-95"
                    >
                        {t('nav.dashboard')}
                    </Link>
                </Navbar>

                <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
                    <Link
                        href={home.url()}
                        className="inline-flex items-center gap-1.5 text-sm text-[#706f6c] transition hover:text-[#C9A227] active:opacity-70 dark:text-[#A1A09A]"
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
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        {t('member.backToCommunity')}
                    </Link>

                    <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
                        <article className="min-w-0">
                            <h1 className="border-b border-black/15 pb-3 text-3xl font-semibold tracking-tight md:text-4xl dark:border-white/15">
                                {member.name}
                            </h1>

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                <span className="inline-flex rounded-full bg-[#C9A227]/15 px-2.5 py-0.5 text-xs font-medium text-[#C9A227]">
                                    {t(roleLabelKeys[member.role])}
                                </span>
                                {member.created_at ? (
                                    <span>
                                        {t('member.joined', {
                                            date: member.created_at,
                                        })}
                                    </span>
                                ) : null}
                            </div>

                            <section className="mt-8">
                                <h2 className="border-b border-black/10 pb-1 text-xl font-medium tracking-tight dark:border-white/10">
                                    {t('member.profile')}
                                </h2>
                                {member.bio ? (
                                    <p className="mt-4 leading-8 whitespace-pre-line text-[#1b1b18] dark:text-[#EDEDEC]">
                                        {member.bio}
                                    </p>
                                ) : (
                                    <p className="mt-4 text-[#706f6c] dark:text-[#A1A09A]">
                                        {t('member.noStory', {
                                            name: member.name,
                                        })}
                                    </p>
                                )}
                            </section>
                        </article>

                        <aside className="h-fit w-full">
                            <div className="overflow-hidden rounded-lg border border-black/15 bg-white shadow-sm dark:border-white/15 dark:bg-[#161615]">
                                <div className="border-b border-black/15 px-4 py-2 text-center text-sm font-medium text-[#1b1b18] dark:border-white/15 dark:text-[#EDEDEC]">
                                    {t('member.info')}
                                </div>

                                <div className="aspect-square w-full overflow-hidden bg-[#C9A227]/10">
                                    {member.profile_picture_url ? (
                                        <img
                                            src={member.profile_picture_url}
                                            alt={member.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/5 text-5xl font-semibold text-[#C9A227]">
                                            {initials(member.name)}
                                        </div>
                                    )}
                                </div>

                                <dl className="divide-y divide-black/10 text-sm dark:divide-white/10">
                                    <div className="flex gap-4 px-4 py-2.5">
                                        <dt className="w-1/3 shrink-0 text-[#706f6c] dark:text-[#A1A09A]">
                                            {t('common.name')}
                                        </dt>
                                        <dd className="min-w-0 text-right font-medium">
                                            {member.name}
                                        </dd>
                                    </div>
                                    <div className="flex gap-4 px-4 py-2.5">
                                        <dt className="w-1/3 shrink-0 text-[#706f6c] dark:text-[#A1A09A]">
                                            {t('member.role')}
                                        </dt>
                                        <dd className="min-w-0 text-right">
                                            {t(roleLabelKeys[member.role])}
                                        </dd>
                                    </div>
                                    <div className="flex gap-4 px-4 py-2.5">
                                        <dt className="w-1/3 shrink-0 text-[#706f6c] dark:text-[#A1A09A]">
                                            {t('member.age')}
                                        </dt>
                                        <dd className="min-w-0 text-right">
                                            {member.age
                                                ? t('member.ageValue', {
                                                      age: member.age,
                                                  })
                                                : '-'}
                                        </dd>
                                    </div>
                                    <div className="flex gap-4 px-4 py-2.5">
                                        <dt className="w-1/3 shrink-0 text-[#706f6c] dark:text-[#A1A09A]">
                                            {t('member.location')}
                                        </dt>
                                        <dd className="min-w-0 text-right">
                                            {member.location ?? '-'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </aside>
                    </div>
                </main>

                <footer className="border-t border-black/10 px-6 py-6 text-center text-sm text-[#706f6c] dark:border-white/10 dark:text-[#A1A09A]">
                    {t('common.copyright', {
                        year: new Date().getFullYear(),
                        site: site.name,
                    })}
                </footer>
            </div>
        </>
    );
}
