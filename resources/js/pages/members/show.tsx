import { Head, Link, usePage } from '@inertiajs/react';

import Navbar from '@/components/navbar';
import RoleBadge from '@/components/role-badge';
import { useLanguage } from '@/i18n/language-provider';
import { home } from '@/routes';
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

            <div className="min-h-svh overflow-x-clip bg-[var(--neu-bg)] text-[var(--neu-ink)] transition-colors duration-300">
                <Navbar />

                <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5 py-6 sm:px-6 sm:py-10">
                    <Link
                        href={home.url()}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--neu-bg)] px-4 py-2 text-sm font-medium text-[var(--neu-muted)] neu-raised-sm transition hover:text-[var(--neu-accent)] active:scale-95 active:neu-inset-sm"
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

                    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
                        <article className="min-w-0 rounded-[2.5rem] bg-[var(--neu-bg)] p-5 neu-raised sm:p-8">
                            <h1 className="text-3xl leading-tight font-black tracking-tight text-[var(--neu-ink)] neu-text sm:text-4xl">
                                {member.name}
                            </h1>

                            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                                <RoleBadge
                                    role={member.role}
                                    variant="neumorphic"
                                />
                                {member.created_at ? (
                                    <span className="rounded-full bg-[var(--neu-bg)] px-3 py-1 text-[var(--neu-muted)] neu-inset-sm">
                                        {t('member.joined', {
                                            date: member.created_at,
                                        })}
                                    </span>
                                ) : null}
                            </div>

                            <section className="mt-8">
                                <h2 className="inline-flex rounded-full bg-[var(--neu-bg)] px-4 py-1.5 text-sm font-semibold text-[var(--neu-accent)] neu-inset-sm">
                                    {t('member.profile')}
                                </h2>
                                {member.bio ? (
                                    <p className="mt-5 leading-8 whitespace-pre-line text-[var(--neu-ink)]">
                                        {member.bio}
                                    </p>
                                ) : (
                                    <p className="mt-5 text-[var(--neu-muted)]">
                                        {t('member.noStory', {
                                            name: member.name,
                                        })}
                                    </p>
                                )}
                            </section>
                        </article>

                        <aside className="h-fit w-full">
                            <div className="overflow-hidden rounded-[2.5rem] bg-[var(--neu-bg)] p-3 neu-raised sm:p-4">
                                <div className="px-4 py-3 text-center text-sm font-semibold text-[var(--neu-ink)] neu-text">
                                    {t('member.info')}
                                </div>

                                <div className="aspect-square w-full overflow-hidden rounded-[2rem] bg-[var(--neu-bg)] neu-inset">
                                    {member.profile_picture_url ? (
                                        <img
                                            src={member.profile_picture_url}
                                            alt={member.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-[var(--neu-bg)] text-5xl font-semibold text-[var(--neu-accent)] neu-text">
                                            {initials(member.name)}
                                        </div>
                                    )}
                                </div>

                                <dl className="mt-3 flex flex-col gap-2 text-sm">
                                    <div className="flex gap-3 rounded-2xl bg-[var(--neu-bg)] px-4 py-3 neu-inset-sm">
                                        <dt className="w-1/3 shrink-0 text-[var(--neu-muted)]">
                                            {t('common.name')}
                                        </dt>
                                        <dd className="min-w-0 text-right font-medium text-[var(--neu-ink)]">
                                            {member.name}
                                        </dd>
                                    </div>
                                    <div className="flex gap-3 rounded-2xl bg-[var(--neu-bg)] px-4 py-3 neu-inset-sm">
                                        <dt className="w-1/3 shrink-0 text-[var(--neu-muted)]">
                                            {t('member.role')}
                                        </dt>
                                        <dd className="min-w-0 text-right">
                                            <RoleBadge
                                                role={member.role}
                                                variant="neumorphic"
                                            />
                                        </dd>
                                    </div>
                                    <div className="flex gap-3 rounded-2xl bg-[var(--neu-bg)] px-4 py-3 neu-inset-sm">
                                        <dt className="w-1/3 shrink-0 text-[var(--neu-muted)]">
                                            {t('member.age')}
                                        </dt>
                                        <dd className="min-w-0 text-right text-[var(--neu-ink)]">
                                            {member.age
                                                ? t('member.ageValue', {
                                                      age: member.age,
                                                  })
                                                : '-'}
                                        </dd>
                                    </div>
                                    <div className="flex gap-3 rounded-2xl bg-[var(--neu-bg)] px-4 py-3 neu-inset-sm">
                                        <dt className="w-1/3 shrink-0 text-[var(--neu-muted)]">
                                            {t('member.location')}
                                        </dt>
                                        <dd className="min-w-0 text-right text-[var(--neu-ink)]">
                                            {member.location ?? '-'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </aside>
                    </div>
                </main>

                <footer className="relative z-10 px-5 pb-8 sm:px-6">
                    <p className="mx-auto max-w-5xl rounded-2xl bg-[var(--neu-bg)] px-6 py-6 text-center text-sm text-[var(--neu-muted)] neu-inset-sm">
                        {t('common.copyright', {
                            year: new Date().getFullYear(),
                            site: site.name,
                            description: t('footer.description'),
                        })}
                    </p>
                </footer>
            </div>
        </>
    );
}
