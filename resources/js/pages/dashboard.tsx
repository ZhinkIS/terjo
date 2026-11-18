import { Head, router, useForm, usePage, usePoll } from '@inertiajs/react';

import type { ChangeEvent, FormEvent } from 'react';

import { useMemo, useState } from 'react';

import Navbar from '@/components/navbar';
import RoleBadge from '@/components/role-badge';
import RoleDropdown from '@/components/role-dropdown';
import SlideshowManager from '@/components/slideshow-manager';
import { useLanguage } from '@/i18n/language-provider';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';
import profile from '@/routes/profile';
import type { Role, User } from '@/types';

type MemberItem = {
    id: number;
    name: string;
    email: string;
    role: Role;
    bio: string | null;
    age: number | null;
    location: string | null;
    profile_picture_url: string | null;
};

type SlideshowItem = {
    id: number;
    image_path: string;
    image_url: string;
    is_active: boolean;
    position: number;
    created_at: string | null;
};

type SettingsData = {
    site_name: string;
    hero_title: string;
    hero_subtitle: string;
    logo_url: string | null;
};

type PendingRegistration = {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    age: number | null;
    location: string | null;
    profile_picture_url: string | null;
    created_at: string | null;
};

type DashboardProps = {
    members: MemberItem[];
    pendingRegistrations: PendingRegistration[];
    slideshows: SlideshowItem[];
    settings: SettingsData;
};

type TabId = 'profile' | 'members' | 'pending' | 'settings' | 'slideshows';

const adminTabs: TabId[] = ['pending', 'members', 'settings', 'slideshows'];

const inputClassName =
    'w-full rounded-2xl border-0 bg-[var(--neu-bg)] px-4 py-3 text-sm text-[var(--neu-ink)] placeholder:text-[var(--neu-muted)] neu-inset-sm transition focus:ring-2 focus:ring-[var(--neu-accent)] focus:outline-none';

const fileInputClassName =
    'block w-full rounded-2xl border-0 bg-[var(--neu-bg)] p-2 text-sm text-[var(--neu-muted)] neu-inset-sm file:mr-4 file:rounded-full file:border-0 file:bg-[var(--neu-bg)] file:px-4 file:py-2 file:font-semibold file:text-[var(--neu-accent)] file:neu-raised-sm file:transition';

const errorTextClassName = 'text-sm font-medium text-red-600 dark:text-red-400';

const primaryButtonClassName =
    'inline-flex w-fit items-center justify-center rounded-full bg-[var(--neu-bg)] px-6 py-3 text-sm font-semibold text-[var(--neu-accent)] neu-raised transition hover:-translate-y-0.5 hover:text-[var(--neu-ink)] active:translate-y-0 active:scale-95 active:neu-inset disabled:opacity-50 disabled:hover:translate-y-0';

const secondaryButtonClassName =
    'inline-flex items-center justify-center rounded-full bg-[var(--neu-bg)] px-4 py-2 text-sm font-medium text-[var(--neu-muted)] neu-raised-sm transition hover:text-[var(--neu-accent)] active:scale-95 active:neu-inset-sm';

const dangerButtonClassName =
    'inline-flex items-center justify-center rounded-full bg-[var(--neu-bg)] px-4 py-2 text-sm font-medium text-red-600 neu-raised-sm transition hover:text-red-700 active:scale-95 active:neu-inset-sm dark:text-red-400 dark:hover:text-red-300';

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

function Avatar({
    name,
    url,
    alt,
    size = 'sm',
}: {
    name: string;
    url: string | null | undefined;
    alt: string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizeClassName = {
        sm: 'h-10 w-10 text-xs',
        md: 'h-14 w-14 text-base',
        lg: 'h-16 w-16 text-lg',
    }[size];

    if (url) {
        return (
            <div
                className={cn(
                    'shrink-0 rounded-full bg-[var(--neu-bg)] p-1 neu-raised-sm',
                    sizeClassName,
                )}
            >
                <img
                    src={url}
                    alt={alt}
                    className="h-full w-full rounded-full object-cover"
                />
            </div>
        );
    }

    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-center rounded-full bg-[var(--neu-bg)] font-semibold text-[var(--neu-accent)] neu-inset-sm',
                sizeClassName,
            )}
        >
            {initials(name)}
        </div>
    );
}

function readInitialTab(pageUrl: string, canManage: boolean): TabId {
    const requested = new URL(pageUrl, 'http://localhost').searchParams.get(
        'tab',
    );

    if (
        canManage &&
        requested !== null &&
        adminTabs.includes(requested as TabId)
    ) {
        return requested as TabId;
    }

    return 'profile';
}

export default function Dashboard({
    members = [],
    pendingRegistrations = [],
    slideshows = [],
    settings,
}: DashboardProps) {
    const { auth, flash } = usePage().props;
    const pageUrl = usePage().url;
    const { t } = useLanguage();

    const user = auth.user;

    const canManage =
        user !== null && (user.role === 'admin' || user.role === 'owner');

    usePoll(5000, {
        only: ['members', 'pendingRegistrations'],
    });

    const [activeTab, setActiveTab] = useState<TabId>(() =>
        readInitialTab(pageUrl, canManage),
    );

    const tabs = useMemo(() => {
        const base: { id: TabId; label: string }[] = [
            { id: 'profile', label: t('dashboard.tabProfile') },
        ];

        if (canManage) {
            base.push(
                { id: 'pending', label: t('dashboard.tabPending') },
                { id: 'members', label: t('dashboard.tabMembers') },
                { id: 'settings', label: t('dashboard.tabSettings') },
                { id: 'slideshows', label: t('dashboard.tabSlideshows') },
            );
        }

        return base;
    }, [canManage, t]);

    function selectTab(tab: TabId) {
        setActiveTab(tab);

        const baseUrl = pageUrl.split('?')[0];

        history.replaceState(
            null,
            '',
            tab === 'profile' ? baseUrl : `${baseUrl}?tab=${tab}`,
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <Head title={t('dashboard.title')} />

            <div className="flex min-h-svh flex-col overflow-x-clip bg-[var(--neu-bg)] text-[var(--neu-ink)] transition-colors duration-300">
                <Navbar
                    pill
                    members={
                        canManage && (members ?? []).length > 0
                            ? members
                            : undefined
                    }
                />

                <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
                    <div className="rounded-[2rem] bg-[var(--neu-bg)] p-6 neu-raised sm:p-8">
                        <h1 className="text-3xl font-semibold tracking-tight text-[var(--neu-ink)] neu-text sm:text-4xl">
                            {t('dashboard.hello', { name: user.name })}
                        </h1>
                        <p className="mt-2 text-sm text-[var(--neu-muted)] sm:text-base">
                            {t('dashboard.welcome')}
                        </p>
                    </div>

                    {flash.success && (
                        <div className="rounded-2xl bg-[var(--neu-bg)] px-5 py-3 text-sm font-medium text-[var(--neu-accent)] neu-inset-sm">
                            {flash.success}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 rounded-full bg-[var(--neu-bg)] p-2 neu-inset">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => selectTab(tab.id)}
                                className={cn(
                                    'rounded-full bg-[var(--neu-bg)] px-4 py-2 text-sm font-medium transition active:scale-95 active:neu-inset-sm',
                                    activeTab === tab.id
                                        ? 'text-[var(--neu-accent)] neu-inset-sm'
                                        : 'text-[var(--neu-muted)] neu-raised-sm hover:text-[var(--neu-accent)]',
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'profile' ? <ProfileTab /> : null}
                    {activeTab === 'pending' && canManage ? (
                        <PendingRegistrationsTab
                            registrations={pendingRegistrations}
                        />
                    ) : null}
                    {activeTab === 'members' && canManage ? (
                        <MembersTab members={members} user={user} />
                    ) : null}
                    {activeTab === 'settings' && canManage ? (
                        <SettingsTab
                            settings={settings}
                            slideshows={slideshows}
                        />
                    ) : null}
                    {activeTab === 'slideshows' && canManage ? (
                        <SlideshowManager slideshows={slideshows} />
                    ) : null}
                </main>
            </div>
        </>
    );
}

function FieldLabel({
    htmlFor,
    children,
}: {
    htmlFor: string;
    children: string;
}) {
    return (
        <label
            htmlFor={htmlFor}
            className="text-sm font-medium text-[var(--neu-muted)]"
        >
            {children}
        </label>
    );
}

function ProfileTab() {
    const { auth } = usePage().props;
    const { t } = useLanguage();

    const user = auth.user;

    const { data, setData, patch, processing, errors } = useForm({
        name: user?.name ?? '',
        bio: user?.bio ?? '',
        location: user?.location ?? '',
        age: user?.age ?? null,
        profile_picture: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        patch(profile.update.url());
    }

    function handlePictureChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;

        setData('profile_picture', file);
        setPreview(file ? URL.createObjectURL(file) : null);
    }

    if (!user) {
        return null;
    }

    return (
        <form
            onSubmit={submit}
            className="flex max-w-xl flex-col gap-6 rounded-[2rem] bg-[var(--neu-bg)] p-6 neu-raised sm:p-8"
        >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar
                    name={user.name}
                    url={preview ?? user.profile_picture_url}
                    alt={t('dashboard.photoAlt')}
                    size="lg"
                />

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <FieldLabel htmlFor="profile_picture">
                        {t('common.profilePhoto')}
                    </FieldLabel>
                    <input
                        id="profile_picture"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePictureChange}
                        className={fileInputClassName}
                    />
                    {errors.profile_picture && (
                        <p className={errorTextClassName}>
                            {errors.profile_picture}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="name">{t('common.name')}</FieldLabel>
                <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(event) => setData('name', event.target.value)}
                    className={inputClassName}
                />
                {errors.name && (
                    <p className={errorTextClassName}>{errors.name}</p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="location">
                        {t('common.location')}
                    </FieldLabel>
                    <input
                        id="location"
                        type="text"
                        value={data.location ?? ''}
                        onChange={(event) =>
                            setData('location', event.target.value)
                        }
                        className={inputClassName}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="age">{t('common.age')}</FieldLabel>
                    <input
                        id="age"
                        type="number"
                        min={17}
                        max={100}
                        value={data.age ?? ''}
                        onChange={(event) =>
                            setData(
                                'age',
                                event.target.value === ''
                                    ? null
                                    : Number(event.target.value),
                            )
                        }
                        className={inputClassName}
                    />
                    {errors.age && (
                        <p className={errorTextClassName}>{errors.age}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="bio">{t('common.bio')}</FieldLabel>
                <textarea
                    id="bio"
                    rows={4}
                    value={data.bio ?? ''}
                    onChange={(event) => setData('bio', event.target.value)}
                    className={inputClassName}
                />
                {errors.bio && (
                    <p className={errorTextClassName}>{errors.bio}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={processing}
                className={primaryButtonClassName}
            >
                {processing ? t('common.saving') : t('dashboard.saveProfile')}
            </button>
        </form>
    );
}

function PendingRegistrationsTab({
    registrations,
}: {
    registrations: PendingRegistration[];
}) {
    const { t } = useLanguage();

    function handleApprove(registration: PendingRegistration) {
        router.patch(
            admin.registrations.approve.url({ user: registration.id }),
        );
    }

    function handleReject(registration: PendingRegistration) {
        if (
            window.confirm(
                t('dashboard.confirmReject', { name: registration.name }),
            )
        ) {
            router.delete(
                admin.registrations.reject.url({ user: registration.id }),
            );
        }
    }

    return (
        <div className="overflow-hidden rounded-[2rem] bg-[var(--neu-bg)] neu-raised">
            {registrations.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-sm">
                        <thead>
                            <tr className="text-[var(--neu-muted)]">
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                                    {t('dashboard.applicant')}
                                </th>
                                <th className="hidden px-6 py-4 text-xs font-semibold tracking-wider uppercase md:table-cell">
                                    {t('dashboard.registered')}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider uppercase">
                                    {t('dashboard.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                            {registrations.map((registration) => (
                                <tr key={registration.id}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                name={registration.name}
                                                url={
                                                    registration.profile_picture_url
                                                }
                                                alt={registration.name}
                                            />
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-[var(--neu-ink)]">
                                                    {registration.name}
                                                </p>
                                                <p className="truncate text-xs text-[var(--neu-muted)]">
                                                    {registration.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden px-6 py-4 text-[var(--neu-muted)] md:table-cell">
                                        {registration.created_at?.slice(0, 10)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-wrap items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleApprove(registration)
                                                }
                                                className={
                                                    primaryButtonClassName
                                                }
                                            >
                                                {t('dashboard.approve')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleReject(registration)
                                                }
                                                className={
                                                    dangerButtonClassName
                                                }
                                            >
                                                {t('dashboard.reject')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="px-6 py-12 text-center text-sm text-[var(--neu-muted)]">
                    {t('dashboard.noPending')}
                </p>
            )}
        </div>
    );
}

function MembersTab({ members, user }: { members: MemberItem[]; user: User }) {
    const { t } = useLanguage();
    const [selected, setSelected] = useState<MemberItem | null>(null);

    function handleRoleChange(member: MemberItem, newRole: Role) {
        router.patch(
            admin.members.updateRole.url({ user: member.id }),
            { role: newRole },
            { preserveState: true },
        );
    }

    function handleKick(member: MemberItem) {
        if (window.confirm(t('dashboard.confirmKick', { name: member.name }))) {
            router.delete(admin.members.destroy.url({ user: member.id }));
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-[2rem] bg-[var(--neu-bg)] neu-raised">
                {members.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead>
                                <tr className="text-[var(--neu-muted)]">
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                                        {t('dashboard.member')}
                                    </th>
                                    <th className="hidden px-6 py-4 text-xs font-semibold tracking-wider uppercase sm:table-cell">
                                        {t('common.location')}
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                                        {t('dashboard.peran')}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider uppercase">
                                        {t('dashboard.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 dark:divide-white/5">
                                {members.map((member) => (
                                    <tr key={member.id}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    name={member.name}
                                                    url={
                                                        member.profile_picture_url
                                                    }
                                                    alt={member.name}
                                                />
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-[var(--neu-ink)]">
                                                        {member.name}
                                                    </p>
                                                    <p className="truncate text-xs text-[var(--neu-muted)]">
                                                        {member.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden px-6 py-4 text-[var(--neu-muted)] sm:table-cell">
                                            {member.location ?? '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {member.id === user.id ? (
                                                <RoleBadge
                                                    role={member.role}
                                                    variant="neumorphic"
                                                />
                                            ) : (
                                                <RoleDropdown
                                                    value={member.role}
                                                    onChange={(newRole) =>
                                                        handleRoleChange(
                                                            member,
                                                            newRole,
                                                        )
                                                    }
                                                    className="border-0! bg-[var(--neu-bg)]! text-[var(--neu-accent)]! neu-inset-sm"
                                                />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-wrap items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelected(
                                                            selected?.id ===
                                                                member.id
                                                                ? null
                                                                : member,
                                                        )
                                                    }
                                                    className={
                                                        secondaryButtonClassName
                                                    }
                                                >
                                                    {selected?.id === member.id
                                                        ? t('common.close')
                                                        : t('common.edit')}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleKick(member)
                                                    }
                                                    className={
                                                        dangerButtonClassName
                                                    }
                                                >
                                                    {t('dashboard.kick')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="px-6 py-12 text-center text-sm text-[var(--neu-muted)]">
                        {t('dashboard.noMembers')}
                    </p>
                )}
            </div>

            {selected ? (
                <MemberEditForm key={selected.id} member={selected} />
            ) : null}
        </div>
    );
}

function MemberEditForm({ member }: { member: MemberItem }) {
    const { t } = useLanguage();
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: member.name,
        bio: member.bio ?? '',
        location: member.location ?? '',
        age: member.age,
        profile_picture: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        patch(admin.members.update.url({ user: member.id }), {
            onSuccess: () => reset(),
        });
    }

    function handlePictureChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;

        setData('profile_picture', file);
        setPreview(file ? URL.createObjectURL(file) : null);
    }

    return (
        <form
            onSubmit={submit}
            className="rounded-[2rem] bg-[var(--neu-bg)] p-6 neu-raised sm:p-8"
        >
            <div>
                <h2 className="text-xl font-semibold tracking-tight text-[var(--neu-ink)] neu-text">
                    {t('dashboard.editMember', { name: member.name })}
                </h2>
                <p className="mt-1 text-sm text-[var(--neu-muted)]">
                    {t('dashboard.editMemberHint')}
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
                <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor={`bio-${member.id}`}>
                        {t('dashboard.memberBio')}
                    </FieldLabel>
                    <textarea
                        id={`bio-${member.id}`}
                        rows={20}
                        value={data.bio ?? ''}
                        onChange={(event) => setData('bio', event.target.value)}
                        className={cn(inputClassName, 'leading-7')}
                    />
                    {errors.bio && (
                        <p className={errorTextClassName}>{errors.bio}</p>
                    )}
                </div>

                <aside className="h-fit w-full rounded-[2rem] bg-[var(--neu-bg)] p-4 neu-inset sm:p-5">
                    <h3 className="mb-4 text-center text-sm font-semibold text-[var(--neu-muted)]">
                        {t('member.info')}
                    </h3>

                    <div className="overflow-hidden rounded-[1.6rem] bg-[var(--neu-bg)] neu-raised-sm">
                        <div className="aspect-square w-full overflow-hidden bg-[var(--neu-bg)] neu-inset">
                            {(preview ?? member.profile_picture_url) ? (
                                <img
                                    src={
                                        preview ??
                                        member.profile_picture_url ??
                                        undefined
                                    }
                                    alt={member.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-5xl font-semibold text-[var(--neu-accent)]">
                                    {initials(member.name)}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 p-4">
                            <div className="flex flex-col gap-2">
                                <FieldLabel htmlFor={`picture-${member.id}`}>
                                    {t('common.profilePhoto')}
                                </FieldLabel>
                                <input
                                    id={`picture-${member.id}`}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handlePictureChange}
                                    className={fileInputClassName}
                                />
                                {errors.profile_picture && (
                                    <p className={errorTextClassName}>
                                        {errors.profile_picture}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <FieldLabel htmlFor={`name-${member.id}`}>
                                    {t('common.name')}
                                </FieldLabel>
                                <input
                                    id={`name-${member.id}`}
                                    type="text"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    className={inputClassName}
                                />
                                {errors.name && (
                                    <p className={errorTextClassName}>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <FieldLabel htmlFor={`age-${member.id}`}>
                                    {t('common.age')}
                                </FieldLabel>
                                <input
                                    id={`age-${member.id}`}
                                    type="number"
                                    min={17}
                                    max={100}
                                    value={data.age ?? ''}
                                    onChange={(event) =>
                                        setData(
                                            'age',
                                            event.target.value === ''
                                                ? null
                                                : Number(event.target.value),
                                        )
                                    }
                                    className={inputClassName}
                                />
                                {errors.age && (
                                    <p className={errorTextClassName}>
                                        {errors.age}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <FieldLabel htmlFor={`location-${member.id}`}>
                                    {t('common.location')}
                                </FieldLabel>
                                <input
                                    id={`location-${member.id}`}
                                    type="text"
                                    value={data.location ?? ''}
                                    onChange={(event) =>
                                        setData('location', event.target.value)
                                    }
                                    className={inputClassName}
                                />
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <button
                type="submit"
                disabled={processing}
                className={cn(primaryButtonClassName, 'mt-6')}
            >
                {processing ? t('common.saving') : t('dashboard.saveChanges')}
            </button>
        </form>
    );
}

function SettingsTab({
    settings,
    slideshows,
}: {
    settings: SettingsData;
    slideshows: SlideshowItem[];
}) {
    const { t } = useLanguage();
    const { data, setData, put, processing, errors } = useForm({
        site_name: settings.site_name,
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        logo: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(settings.logo_url);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        put(admin.settings.update.url());
    }

    function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;

        setData('logo', file);
        setPreview(file ? URL.createObjectURL(file) : null);
    }

    return (
        <div className="flex max-w-3xl flex-col gap-6">
            <form
                onSubmit={submit}
                className="flex flex-col gap-5 rounded-[2rem] bg-[var(--neu-bg)] p-6 neu-raised sm:p-8"
            >
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-[var(--neu-ink)] neu-text">
                        {t('dashboard.settingsTitle')}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--neu-muted)]">
                        {t('dashboard.settingsHint')}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="site_name">
                        {t('dashboard.siteName')}
                    </FieldLabel>
                    <input
                        id="site_name"
                        type="text"
                        value={data.site_name}
                        onChange={(event) =>
                            setData('site_name', event.target.value)
                        }
                        className={inputClassName}
                    />
                    {errors.site_name && (
                        <p className={errorTextClassName}>{errors.site_name}</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="hero_title">
                        {t('dashboard.heroTitle')}
                    </FieldLabel>
                    <input
                        id="hero_title"
                        type="text"
                        value={data.hero_title}
                        onChange={(event) =>
                            setData('hero_title', event.target.value)
                        }
                        className={inputClassName}
                    />
                    {errors.hero_title && (
                        <p className={errorTextClassName}>
                            {errors.hero_title}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="hero_subtitle">
                        {t('dashboard.heroSubtitle')}
                    </FieldLabel>
                    <textarea
                        id="hero_subtitle"
                        rows={3}
                        value={data.hero_subtitle}
                        onChange={(event) =>
                            setData('hero_subtitle', event.target.value)
                        }
                        className={inputClassName}
                    />
                    {errors.hero_subtitle && (
                        <p className={errorTextClassName}>
                            {errors.hero_subtitle}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="logo">
                        {t('dashboard.logo')}
                    </FieldLabel>
                    <input
                        id="logo"
                        type="file"
                        accept="image/svg+xml,image/jpeg,image/png,image/webp"
                        onChange={handleLogoChange}
                        className={fileInputClassName}
                    />
                    {errors.logo && (
                        <p className={errorTextClassName}>{errors.logo}</p>
                    )}
                    {preview && (
                        <img
                            src={preview}
                            alt={t('dashboard.logoPreview')}
                            className="mt-2 h-14 w-auto self-start rounded-2xl bg-[var(--neu-bg)] object-contain p-2 neu-inset-sm"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className={primaryButtonClassName}
                >
                    {processing
                        ? t('common.saving')
                        : t('dashboard.saveSettings')}
                </button>
            </form>

            <SlideshowManager slideshows={slideshows} />
        </div>
    );
}
