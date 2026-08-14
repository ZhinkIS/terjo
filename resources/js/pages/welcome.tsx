import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import AccountDropdown from '@/components/account-dropdown';
import AccountMenu from '@/components/account-menu';
import Navbar from '@/components/navbar';
import RulesModal from '@/components/rules-modal';
import type { Dictionary } from '@/i18n';
import { useLanguage } from '@/i18n/language-provider';
import { cn } from '@/lib/utils';
import { login } from '@/routes';
import memberRoutes from '@/routes/members';
import type { Role } from '@/types';

type Slideshow = {
    id: number;
    image_url: string;
};

type Member = {
    id: number;
    name: string;
    role: Role;
    location: string | null;
    age: number | null;
    bio: string | null;
    profile_picture_url: string | null;
};

type WelcomeProps = {
    slideshows: Slideshow[];
    members: Member[];
    heroTitle: string;
    heroSubtitle: string;
};

const roleLabelKeys: Record<Role, keyof Dictionary> = {
    owner: 'role.owner',
    admin: 'role.admin',
    member: 'role.member',
};

const roleBadgeStyles: Record<Role, string> = {
    owner: 'bg-[#C9A227]/15 text-[#C9A227]',
    admin: 'bg-[#C9A227]/15 text-[#C9A227]',
    member: 'bg-black/5 text-[#706f6c] dark:bg-white/10 dark:text-[#A1A09A]',
};

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

export default function Welcome({
    slideshows,
    members,
    heroTitle,
    heroSubtitle,
}: WelcomeProps) {
    const { auth, site } = usePage().props;
    const { t } = useLanguage();

    const user = auth.user;

    const isGuest = user === null;

    const canViewDirectory = user !== null && user.status === 'approved';

    const [index, setIndex] = useState(0);
    const [rulesOpen, setRulesOpen] = useState(false);

    useEffect(() => {
        if (!user || slideshows.length <= 1) {
            return;
        }

        const timer = setInterval(() => {
            setIndex((current) => (current + 1) % slideshows.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slideshows.length, user]);

    const goTo = (nextIndex: number) => {
        setIndex((nextIndex + slideshows.length) % slideshows.length);
    };

    return (
        <>
            <Head title={site.name} />

            <div
                className={cn(
                    'flex bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]',
                    isGuest
                        ? 'h-svh flex-col overflow-hidden'
                        : 'min-h-screen flex-col',
                )}
            >
                <main className="flex flex-1 flex-col">
                    <section
                        className={cn(
                            'relative flex flex-col',
                            isGuest ? 'flex-1' : 'min-h-screen',
                        )}
                    >
                        <img
                            src="/images/slide1.jpg"
                            alt=""
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40" />

                        <Navbar
                            overlay
                            members={canViewDirectory ? members : undefined}
                        >
                            {user ? (
                                <AccountMenu user={user} overlay />
                            ) : (
                                <AccountDropdown overlay />
                            )}
                        </Navbar>

                        <div
                            className={cn(
                                'relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pt-8',
                                isGuest ? 'pb-24' : 'pb-16',
                            )}
                        >
                            {user ? (
                                <div className="flex flex-col items-start gap-8">
                                    <div className="max-w-3xl">
                                        <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
                                            {heroTitle}
                                        </h1>
                                        <p className="mt-5 max-w-2xl text-lg text-white/80">
                                            {heroSubtitle}
                                        </p>
                                    </div>

                                    {canViewDirectory ? (
                                        <div className="flex flex-wrap items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setRulesOpen(true)
                                                }
                                                className="inline-flex animate-pulse items-center rounded-sm border-2 border-[#C9A227] bg-[#C9A227] px-6 py-3 text-base font-bold tracking-wider text-white shadow-[0_0_18px_rgba(201,162,39,0.45)] transition hover:bg-transparent hover:text-[#C9A227] hover:shadow-[0_0_18px_rgba(201,162,39,0.6)] active:scale-95"
                                            >
                                                {t('hero.rules')}
                                            </button>

                                            <p className="text-sm text-white/70">
                                                {t('hero.memberCount', {
                                                    count: members.length,
                                                })}
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <div className="flex max-w-3xl flex-col items-start gap-6">
                                    <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
                                        {t('hero.title')}
                                    </h1>
                                    <p className="max-w-2xl text-lg text-white/80">
                                        {t('hero.subtitle')}
                                    </p>
                                    <Link
                                        href={login.url()}
                                        className="inline-flex items-center gap-2 rounded-sm bg-[#C9A227] px-8 py-4 text-lg font-bold tracking-wide text-white shadow-[0_0_30px_rgba(201,162,39,0.5)] transition hover:bg-[#b18f1f] active:scale-95"
                                    >
                                        {t('hero.loginButton')}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {isGuest ? (
                            <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 px-6 text-center text-sm text-white/60">
                                {t('common.copyright', {
                                    year: new Date().getFullYear(),
                                    site: site.name,
                                })}
                            </div>
                        ) : null}
                    </section>

                    {user ? (
                        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 py-10">
                            <section className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#161615]">
                                {slideshows.length > 0 ? (
                                    <>
                                        <div className="relative h-[360px] overflow-hidden md:h-[480px]">
                                            {slideshows.map(
                                                (slide, slideIndex) => (
                                                    <img
                                                        key={slide.id}
                                                        src={slide.image_url}
                                                        alt={t(
                                                            'hero.goToSlide',
                                                            {
                                                                number:
                                                                    slideIndex +
                                                                    1,
                                                            },
                                                        )}
                                                        aria-hidden={
                                                            slideIndex !== index
                                                        }
                                                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                                                            slideIndex === index
                                                                ? 'opacity-100'
                                                                : 'opacity-0'
                                                        }`}
                                                    />
                                                ),
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => goTo(index - 1)}
                                            aria-label={t('hero.prevSlide')}
                                            className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full border border-black/10 bg-white/80 p-2 text-[#1b1b18] backdrop-blur transition hover:bg-white active:scale-95 dark:border-white/10 dark:bg-[#161615]/80 dark:text-[#EDEDEC] dark:hover:bg-[#161615]"
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
                                                <path d="m15 18-6-6 6-6" />
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => goTo(index + 1)}
                                            aria-label={t('hero.nextSlide')}
                                            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full border border-black/10 bg-white/80 p-2 text-[#1b1b18] backdrop-blur transition hover:bg-white active:scale-95 dark:border-white/10 dark:bg-[#161615]/80 dark:text-[#EDEDEC] dark:hover:bg-[#161615]"
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
                                                <path d="m9 18 6-6-6-6" />
                                            </svg>
                                        </button>

                                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                                            {slideshows.map(
                                                (slide, dotIndex) => (
                                                    <button
                                                        key={slide.id}
                                                        type="button"
                                                        onClick={() =>
                                                            goTo(dotIndex)
                                                        }
                                                        aria-label={t(
                                                            'hero.goToSlide',
                                                            {
                                                                number:
                                                                    dotIndex +
                                                                    1,
                                                            },
                                                        )}
                                                        className={`h-2 rounded-full transition-all active:scale-95 ${
                                                            dotIndex === index
                                                                ? 'w-6 bg-[#C9A227]'
                                                                : 'w-2 bg-white/60 hover:bg-white'
                                                        }`}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex h-[360px] items-center justify-center bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/5 text-sm text-[#706f6c] md:h-[480px] dark:text-[#A1A09A]">
                                        {t('hero.slideshowEmpty')}
                                    </div>
                                )}
                            </section>

                            {canViewDirectory ? (
                                <section>
                                    <div className="mb-6 flex items-end justify-between">
                                        <h2 className="text-2xl font-semibold tracking-tight">
                                            {t('hero.section')}
                                        </h2>
                                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                            {t('hero.directory')}
                                        </p>
                                    </div>

                                    {members.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                            {members.map((member) => (
                                                <Link
                                                    key={member.id}
                                                    href={memberRoutes.show.url(
                                                        {
                                                            user: member.id,
                                                        },
                                                    )}
                                                    className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-5 shadow-sm transition group-hover:border-[#C9A227] hover:border-[#C9A227] active:scale-[0.99] dark:border-white/10 dark:bg-[#161615]"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {member.profile_picture_url ? (
                                                            <img
                                                                src={
                                                                    member.profile_picture_url
                                                                }
                                                                alt={
                                                                    member.name
                                                                }
                                                                className="h-12 w-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A227]/15 font-semibold text-[#C9A227]">
                                                                {initials(
                                                                    member.name,
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="min-w-0">
                                                            <h3 className="truncate font-medium">
                                                                {member.name}
                                                            </h3>
                                                            <span
                                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${roleBadgeStyles[member.role]}`}
                                                            >
                                                                {t(
                                                                    roleLabelKeys[
                                                                        member
                                                                            .role
                                                                    ],
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {member.location && (
                                                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                                            {member.location}
                                                            {member.age
                                                                ? ` · ${t(
                                                                      'member.ageValue',
                                                                      {
                                                                          age: member.age,
                                                                      },
                                                                  )}`
                                                                : ''}
                                                        </p>
                                                    )}

                                                    {member.bio && (
                                                        <p className="line-clamp-3 text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                                                            {member.bio}
                                                        </p>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="rounded-xl border border-black/10 bg-white px-6 py-10 text-center text-sm text-[#706f6c] dark:border-white/10 dark:bg-[#161615] dark:text-[#A1A09A]">
                                            {t('hero.noResults')}
                                        </p>
                                    )}
                                </section>
                            ) : null}
                        </div>
                    ) : null}
                </main>

                {user ? (
                    <footer className="border-t border-black/10 px-6 py-6 text-center text-sm text-[#706f6c] dark:border-white/10 dark:text-[#A1A09A]">
                        {t('common.copyright', {
                            year: new Date().getFullYear(),
                            site: site.name,
                        })}
                    </footer>
                ) : null}
            </div>

            <RulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
        </>
    );
}
