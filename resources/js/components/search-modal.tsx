import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

import RoleBadge from '@/components/role-badge';
import { useLanguage } from '@/i18n/language-provider';
import { cn } from '@/lib/utils';
import memberRoutes from '@/routes/members';
import type { Role } from '@/types';

export type SearchableMember = {
    id: number;
    name: string;
    role: Role;
    location: string | null;
    age: number | null;
    bio: string | null;
    profile_picture_url: string | null;
};

type SearchModalProps = {
    open: boolean;
    onClose: () => void;
    members: SearchableMember[];
};

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

export default function SearchModal({
    open,
    onClose,
    members,
}: SearchModalProps) {
    const { t } = useLanguage();

    const [prevOpen, setPrevOpen] = useState(open);
    const [query, setQuery] = useState('');

    if (prevOpen !== open) {
        setPrevOpen(open);

        if (open) {
            setQuery('');
        }
    }

    useEffect(() => {
        if (!open) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    const needle = query.trim().toLowerCase();

    const results = useMemo(() => {
        if (!needle) {
            return [];
        }

        return members.filter((member) =>
            [
                member.name,
                member.location,
                member.bio,
                member.age ? String(member.age) : null,
            ]
                .filter(Boolean)
                .some((value) => value!.toLowerCase().includes(needle)),
        );
    }, [members, needle]);

    return (
        <div
            className={cn(
                'fixed inset-0 z-[60] flex items-center justify-center p-4',
                !open && 'pointer-events-none',
            )}
            aria-hidden={!open}
        >
            <div
                aria-hidden="true"
                onClick={onClose}
                className={cn(
                    'absolute inset-0 bg-black/60 transition-opacity duration-200',
                    open ? 'opacity-100' : 'opacity-0',
                )}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="search-modal-title"
                className={cn(
                    'relative flex max-h-[80svh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl transition-all duration-200 dark:border-white/10 dark:bg-[#161615]',
                    open ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
                )}
            >
                {open ? (
                    <>
                        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-black/10 px-5 py-4 dark:border-white/10">
                            <h2
                                id="search-modal-title"
                                className="text-lg font-semibold tracking-tight"
                            >
                                {t('search.title')}
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label={t('search.close')}
                                className="rounded-sm border border-black/15 p-1.5 text-[#1b1b18] transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 dark:border-white/15 dark:text-[#EDEDEC]"
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
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="relative shrink-0 px-5 pt-4">
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
                                className="pointer-events-none absolute top-1/2 left-8 -translate-y-1/2 text-[#706f6c] dark:text-[#A1A09A]"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            <input
                                type="search"
                                autoFocus
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder={t('nav.searchPlaceholder')}
                                aria-label={t('nav.searchPlaceholder')}
                                className="w-full rounded-sm border border-black/15 bg-[#FDFDFC] py-2.5 pr-3 pl-9 text-sm text-[#1b1b18] placeholder:text-[#706f6c] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] focus:outline-none dark:border-white/15 dark:bg-[#0a0a0a] dark:text-[#EDEDEC] dark:placeholder:text-[#A1A09A]"
                            />
                        </div>

                        <div className="flex min-h-40 flex-1 flex-col overflow-y-auto px-5 pt-4 pb-5">
                            {results.length > 0 ? (
                                <ul className="flex flex-col gap-2">
                                    {results.map((member) => (
                                        <li key={member.id}>
                                            <Link
                                                href={memberRoutes.show.url({
                                                    user: member.id,
                                                })}
                                                onClick={onClose}
                                                className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition hover:border-black/10 hover:bg-black/5 active:scale-[0.98] dark:hover:border-white/10 dark:hover:bg-white/5"
                                            >
                                                {member.profile_picture_url ? (
                                                    <img
                                                        src={
                                                            member.profile_picture_url
                                                        }
                                                        alt={member.name}
                                                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/15 text-xs font-semibold text-[#C9A227]">
                                                        {initials(member.name)}
                                                    </span>
                                                )}

                                                <span className="min-w-0">
                                                    <span className="flex items-center gap-2">
                                                        <span className="truncate font-medium">
                                                            {member.name}
                                                        </span>
                                                        <RoleBadge
                                                            role={member.role}
                                                        />
                                                    </span>

                                                    <span className="mt-0.5 block truncate text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                                        {[
                                                            member.location,
                                                            member.age
                                                                ? t(
                                                                      'member.ageValue',
                                                                      {
                                                                          age: member.age,
                                                                      },
                                                                  )
                                                                : null,
                                                            member.bio,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(' · ')}
                                                    </span>
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="rounded-lg border border-dashed border-black/15 px-4 py-6 text-center text-sm text-[#706f6c] dark:border-white/15 dark:text-[#A1A09A]">
                                    {t('search.noResults', { query })}
                                </p>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
