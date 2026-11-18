import { Head, Link, usePage, usePoll } from '@inertiajs/react';
import { useState } from 'react';

import type { SyntheticEvent } from 'react';

import Navbar from '@/components/navbar';
import RoleBadge from '@/components/role-badge';
import RulesModal from '@/components/rules-modal';
import ScratchReveal from '@/components/scratch-reveal';
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
    slideshows?: Slideshow[];
    members?: Member[];
    heroTitle: string;
    heroSubtitle: string;
};

const sparkles = [
    'top-2 left-0 h-8 w-8 [animation-delay:0ms]',
    'top-10 right-2 h-6 w-6 [animation-delay:300ms]',
    'bottom-24 left-6 h-5 w-5 [animation-delay:600ms]',
    'right-0 bottom-10 h-7 w-7 [animation-delay:900ms]',
];

const marqueeItems = Array.from({ length: 6 }, (_, index) => index);

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

function hideBrokenImage(event: SyntheticEvent<HTMLImageElement>): void {
    event.currentTarget.style.display = 'none';
}

function fallbackToLogo(event: SyntheticEvent<HTMLImageElement>): void {
    const image = event.currentTarget;

    if (image.dataset.fallback === 'true') {
        image.style.display = 'none';

        return;
    }

    image.dataset.fallback = 'true';
    image.src = '/images/logo.png';
}

export default function Welcome({
    slideshows = [],
    members = [],
    heroTitle,
    heroSubtitle,
}: WelcomeProps) {
    const { auth, site } = usePage().props;
    const { t } = useLanguage();

    const user = auth.user;

    const isGuest = user === null;

    const canViewDirectory = user !== null && user.status === 'approved';

    usePoll(5000, { only: ['members'] });

    const [index, setIndex] = useState(0);
    const [rulesOpen, setRulesOpen] = useState(false);

    const goTo = (nextIndex: number) => {
        setIndex((nextIndex + slideshows.length) % slideshows.length);
    };

    return (
        <>
            <Head title="HOME | Terjocores" />

            <div className="relative min-h-svh overflow-x-clip bg-[var(--neu-bg)] text-[var(--neu-ink)] transition-colors duration-300">
                <Navbar pill members={canViewDirectory ? members : undefined} />

                <main className="relative z-10 flex flex-1 flex-col">
                    <section className="relative flex min-h-[calc(100svh-5.5rem)] flex-col overflow-hidden">
                        <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-6 pt-6 pb-36 md:grid-cols-2 md:gap-8 lg:gap-14">
                            <div className="relative flex items-center justify-center">
                                <div
                                    aria-hidden="true"
                                    className="absolute h-72 w-72 rounded-full bg-[#C9A227]/10 blur-3xl md:h-96 md:w-96"
                                />

                                <div className="relative z-10 rounded-[3rem] bg-[var(--neu-bg)] p-5 neu-raised sm:p-8 lg:p-10">
                                    <ScratchReveal
                                        brushSize={40}
                                        canvasClassName="scale-110 animate-float motion-reduce:animate-none"
                                        className="relative z-10 max-w-[60vh] md:max-w-[34rem]"
                                    >
                                        <img
                                            src="/images/slide1 - Diedit.png"
                                            alt="Terjocore mascots"
                                            onError={hideBrokenImage}
                                            className="relative z-10 max-h-[60vh] w-auto max-w-full scale-110 animate-float object-contain drop-shadow-[0_18px_30px_rgba(64,73,88,0.2)] transition-transform duration-300 hover:scale-[1.15] motion-reduce:transition-none md:max-h-[78vh] dark:drop-shadow-[0_22px_35px_rgba(0,0,0,0.45)]"
                                        />
                                    </ScratchReveal>
                                </div>
                            </div>

                            <div className="relative text-center md:text-left">
                                {sparkles.map((position) => (
                                    <span
                                        key={position}
                                        aria-hidden="true"
                                        className={cn(
                                            'pointer-events-none absolute flex animate-pulse items-center justify-center text-lg text-[var(--neu-accent)]/40 select-none',
                                            position,
                                        )}
                                    >
                                        ✦
                                    </span>
                                ))}

                                <p className="mb-3 text-xs font-black tracking-[0.45em] text-[var(--neu-accent)] uppercase">
                                    Terjocore
                                </p>

                                <h1 className="text-5xl leading-[0.95] font-black tracking-tight text-[var(--neu-ink)] uppercase neu-text sm:text-6xl lg:text-7xl xl:text-8xl">
                                    {heroTitle}
                                </h1>

                                <p className="mx-auto mt-5 max-w-xl text-lg font-medium text-[var(--neu-muted)] md:mx-0 md:text-xl">
                                    {heroSubtitle}
                                </p>

                                <div className="mt-9 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                                    {user ? (
                                        canViewDirectory ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setRulesOpen(true)
                                                    }
                                                    className="inline-flex items-center rounded-full bg-[var(--neu-bg)] px-8 py-3 text-lg font-black tracking-wider text-[var(--neu-accent)] uppercase neu-raised transition hover:-translate-y-0.5 active:translate-y-0 active:scale-95 active:neu-inset"
                                                >
                                                    {t('hero.rules')}
                                                </button>

                                                <p className="inline-flex items-center gap-2 rounded-full bg-[var(--neu-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--neu-muted)] neu-inset">
                                                    <span
                                                        aria-hidden="true"
                                                        className="h-2 w-2 rounded-full bg-[#C9A227] shadow-[0_0_8px_rgba(201,162,39,0.65)]"
                                                    />
                                                    {t('hero.memberCount', {
                                                        count: members.length,
                                                    })}
                                                </p>
                                            </>
                                        ) : null
                                    ) : (
                                        <Link
                                            href={login.url()}
                                            className="group inline-flex items-center gap-3 rounded-full bg-[var(--neu-bg)] px-8 py-4 text-lg font-black tracking-[0.18em] text-[var(--neu-accent)] uppercase neu-raised transition hover:-translate-y-0.5 active:translate-y-0 active:scale-95 active:neu-inset sm:px-10 sm:text-xl"
                                        >
                                            {t('hero.loginButton')}
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--neu-bg)] text-[var(--neu-accent)] neu-raised-sm transition group-hover:translate-x-0.5">
                                                <svg
                                                    width={20}
                                                    height={20}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2.5}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M5 12h14M13 6l6 6-6 6" />
                                                </svg>
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isGuest ? (
                            <p className="pointer-events-none absolute inset-x-0 bottom-16 z-10 px-6 text-center text-xs font-medium tracking-wide text-[var(--neu-muted)]">
                                {t('common.copyright', {
                                    year: new Date().getFullYear(),
                                    site: site.name,
                                    description: t('footer.description'),
                                })}
                            </p>
                        ) : null}

                        <div className="absolute inset-x-0 bottom-0 z-20 bg-[var(--neu-bg)] py-3 neu-inset">
                            <div className="flex w-max animate-marquee items-center">
                                {[0, 1].map((copy) => (
                                    <div
                                        key={copy}
                                        aria-hidden={copy === 1}
                                        className="flex shrink-0 items-center gap-6 pr-6"
                                    >
                                        {marqueeItems.map((item) => (
                                            <div
                                                key={`${copy}-${item}`}
                                                className="flex items-center gap-6"
                                            >
                                                <span className="text-sm font-black tracking-[0.35em] whitespace-nowrap text-[var(--neu-muted)] uppercase">
                                                    TERJO TEAM
                                                </span>
                                                <img
                                                    src="/images/logo.png"
                                                    alt=""
                                                    aria-hidden="true"
                                                    onError={fallbackToLogo}
                                                    className="h-6 w-6 object-contain opacity-80"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {user ? (
                        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 py-12">
                            <section className="relative overflow-hidden rounded-[2.5rem] bg-[var(--neu-bg)] p-3 neu-raised sm:p-4">
                                {slideshows.length > 0 ? (
                                    <>
                                        <div className="rounded-[2rem] bg-[var(--neu-bg)] p-2 neu-inset">
                                            <div className="relative h-[360px] overflow-hidden rounded-[1.6rem] md:h-[480px]">
                                                {slideshows.map(
                                                    (slide, slideIndex) => (
                                                        <img
                                                            key={slide.id}
                                                            src={
                                                                slide.image_url
                                                            }
                                                            alt={t(
                                                                'hero.goToSlide',
                                                                {
                                                                    number:
                                                                        slideIndex +
                                                                        1,
                                                                },
                                                            )}
                                                            aria-hidden={
                                                                slideIndex !==
                                                                index
                                                            }
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    '/images/slide1.jpg';
                                                            }}
                                                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                                                                slideIndex ===
                                                                index
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0'
                                                            }`}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => goTo(index - 1)}
                                            aria-label={t('hero.prevSlide')}
                                            className="absolute top-1/2 left-5 -translate-y-1/2 rounded-full bg-[var(--neu-bg)] p-3 text-[var(--neu-muted)] neu-raised-sm transition hover:text-[var(--neu-accent)] active:scale-95 active:neu-inset-sm"
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
                                            className="absolute top-1/2 right-5 -translate-y-1/2 rounded-full bg-[var(--neu-bg)] p-3 text-[var(--neu-muted)] neu-raised-sm transition hover:text-[var(--neu-accent)] active:scale-95 active:neu-inset-sm"
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

                                        <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[var(--neu-bg)] px-3 py-2 neu-inset">
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
                                                                ? 'w-7 bg-[var(--neu-accent)]'
                                                                : 'w-2 bg-[var(--neu-muted)]/30 hover:bg-[var(--neu-muted)]/60'
                                                        }`}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex h-[240px] flex-col items-center justify-center gap-4 rounded-[2rem] bg-[var(--neu-bg)] text-sm text-[var(--neu-muted)] neu-inset md:h-[320px]">
                                        <span
                                            aria-hidden="true"
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--neu-bg)] text-[var(--neu-accent)] neu-raised-sm"
                                        >
                                            <svg
                                                width={22}
                                                height={22}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={1.8}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect
                                                    width={18}
                                                    height={18}
                                                    x={3}
                                                    y={3}
                                                    rx={3}
                                                />
                                                <circle cx={9} cy={9} r={2} />
                                                <path d="m21 15-4.8-4.8a2 2 0 0 0-2.8 0L5 19" />
                                            </svg>
                                        </span>
                                        <p>{t('hero.slideshowEmpty')}</p>
                                    </div>
                                )}
                            </section>

                            {canViewDirectory ? (
                                <section>
                                    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
                                        <h2 className="text-2xl font-semibold tracking-tight text-[var(--neu-ink)]">
                                            {t('hero.section')}
                                        </h2>
                                        <p className="text-sm text-[var(--neu-muted)]">
                                            {t('hero.directory')}
                                        </p>
                                    </div>

                                    {members.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                            {members.map((member) => (
                                                <Link
                                                    key={member.id}
                                                    href={memberRoutes.show.url(
                                                        {
                                                            user: member.id,
                                                        },
                                                    )}
                                                    className="flex flex-col gap-3 rounded-[2rem] bg-[var(--neu-bg)] p-5 neu-raised transition hover:-translate-y-1 hover:neu-raised-lg active:translate-y-0 active:scale-[0.98] active:neu-inset"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {member.profile_picture_url ? (
                                                            <div className="shrink-0 rounded-full bg-[var(--neu-bg)] p-1 neu-raised-sm">
                                                                <img
                                                                    src={
                                                                        member.profile_picture_url
                                                                    }
                                                                    alt={
                                                                        member.name
                                                                    }
                                                                    className="h-12 w-12 rounded-full object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--neu-bg)] font-semibold text-[var(--neu-accent)] neu-inset-sm">
                                                                {initials(
                                                                    member.name,
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="min-w-0">
                                                            <h3 className="truncate font-medium text-[var(--neu-ink)]">
                                                                {member.name}
                                                            </h3>
                                                            <RoleBadge
                                                                role={
                                                                    member.role
                                                                }
                                                                variant="neumorphic"
                                                            />
                                                        </div>
                                                    </div>

                                                    {member.location && (
                                                        <p className="text-sm text-[var(--neu-muted)]">
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
                                                        <p className="line-clamp-3 text-sm text-[var(--neu-ink)] opacity-80">
                                                            {member.bio}
                                                        </p>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="rounded-[2rem] bg-[var(--neu-bg)] px-6 py-10 text-center text-sm text-[var(--neu-muted)] neu-inset">
                                            {t('hero.noResults')}
                                        </p>
                                    )}
                                </section>
                            ) : null}
                        </div>
                    ) : null}
                </main>

                {user ? (
                    <footer className="relative z-10 border-t border-black/5 px-6 py-8 text-center text-sm text-[var(--neu-muted)] dark:border-white/5">
                        {t('common.copyright', {
                            year: new Date().getFullYear(),
                            site: site.name,
                            description: t('footer.description'),
                        })}
                    </footer>
                ) : null}
            </div>

            <RulesModal
                open={rulesOpen}
                onClose={() => setRulesOpen(false)}
                variant="neumorphic"
            />
        </>
    );
}
