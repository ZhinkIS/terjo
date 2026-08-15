import { Head, router, useForm, usePage } from '@inertiajs/react';

import type { ChangeEvent, FormEvent } from 'react';

import { useMemo, useState } from 'react';

import Navbar from '@/components/navbar';
import SlideshowManager from '@/components/slideshow-manager';
import { useLanguage } from '@/i18n/language-provider';
import type { Dictionary } from '@/i18n/locales/id';
import admin from '@/routes/admin';
import profile from '@/routes/profile';
import type { Role } from '@/types';

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

const roleLabelKeys: Record<Role, keyof Dictionary> = {
    owner: 'role.owner',
    admin: 'role.admin',
    member: 'role.member',
};

export default function Dashboard({
    members,
    pendingRegistrations,
    slideshows,
    settings,
}: DashboardProps) {
    const { auth, flash } = usePage().props;
    const pageUrl = usePage().url;
    const { t } = useLanguage();

    const user = auth.user;

    const canManage =
        user !== null && (user.role === 'admin' || user.role === 'owner');

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

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <Navbar
                    members={
                        canManage && members.length > 0 ? members : undefined
                    }
                />

                <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {t('dashboard.hello', { name: user.name })}
                        </h1>
                        <p className="mt-1 text-[#706f6c] dark:text-[#A1A09A]">
                            {t('dashboard.welcome')}
                        </p>
                    </div>

                    {flash.success && (
                        <div className="rounded-lg border border-[#C9A227]/40 bg-[#C9A227]/10 px-4 py-3 text-sm">
                            {flash.success}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 border-b border-black/10 pb-4 dark:border-white/10">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => selectTab(tab.id)}
                                className={`rounded-sm px-4 py-2 text-sm font-medium transition active:scale-95 ${
                                    activeTab === tab.id
                                        ? 'bg-[#C9A227] text-white'
                                        : 'border border-black/15 hover:border-[#C9A227] hover:text-[#C9A227] dark:border-white/15'
                                }`}
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
                        <MembersTab members={members} />
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
        <label htmlFor={htmlFor} className="text-sm font-medium">
            {children}
        </label>
    );
}

const inputClassName =
    'rounded-sm border border-black/15 bg-white px-3 py-2 text-sm text-[#1b1b18] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] focus:outline-none dark:border-white/15 dark:bg-[#161615] dark:text-[#EDEDEC]';

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
            className="flex max-w-xl flex-col gap-5 rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#161615]"
        >
            <div className="flex items-center gap-4">
                {(preview ?? user.profile_picture_url) ? (
                    <img
                        src={preview ?? user.profile_picture_url ?? undefined}
                        alt={t('dashboard.photoAlt')}
                        className="h-16 w-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/15 text-lg font-semibold text-[#C9A227]">
                        {user.name
                            .split(' ')
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join('')
                            .toUpperCase()}
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="profile_picture">
                        {t('common.profilePhoto')}
                    </FieldLabel>
                    <input
                        id="profile_picture"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePictureChange}
                        className="block w-full text-sm file:mr-4 file:rounded-sm file:border-0 file:bg-[#C9A227]/15 file:px-3 file:py-2 file:font-medium file:text-[#C9A227]"
                    />
                    {errors.profile_picture && (
                        <p className="text-sm text-red-600 dark:text-red-400">
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
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.name}
                    </p>
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
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.age}
                        </p>
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
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.bio}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-fit rounded-sm bg-[#C9A227] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b18f1f] active:scale-95 disabled:opacity-50"
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
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#161615]">
            {registrations.length > 0 ? (
                <table className="w-full min-w-[480px] text-left text-sm">
                    <thead className="border-b border-black/10 text-[#706f6c] dark:border-white/10 dark:text-[#A1A09A]">
                        <tr>
                            <th className="px-4 py-3 font-medium">
                                {t('dashboard.applicant')}
                            </th>
                            <th className="hidden px-4 py-3 font-medium md:table-cell">
                                {t('dashboard.registered')}
                            </th>
                            <th className="px-4 py-3 text-right font-medium">
                                {t('dashboard.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 dark:divide-white/10">
                        {registrations.map((registration) => (
                            <tr key={registration.id}>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/15 text-xs font-semibold text-[#C9A227]">
                                            {registration.name
                                                .split(' ')
                                                .slice(0, 2)
                                                .map((part) => part[0])
                                                .join('')
                                                .toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">
                                                {registration.name}
                                            </p>
                                            <p className="truncate text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                                {registration.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden px-4 py-3 text-[#706f6c] md:table-cell dark:text-[#A1A09A]">
                                    {registration.created_at?.slice(0, 10)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleApprove(registration)
                                            }
                                            className="rounded-sm bg-[#C9A227] px-3 py-1 text-sm font-medium text-white transition hover:bg-[#b18f1f] active:scale-95"
                                        >
                                            {t('dashboard.approve')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleReject(registration)
                                            }
                                            className="rounded-sm border border-black/15 px-3 py-1 text-sm text-red-600 transition hover:border-red-600 active:scale-95 dark:border-white/15 dark:text-red-400"
                                        >
                                            {t('dashboard.reject')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="px-4 py-10 text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                    {t('dashboard.noPending')}
                </p>
            )}
        </div>
    );
}

function MembersTab({ members }: { members: MemberItem[] }) {
    const { t } = useLanguage();
    const [selected, setSelected] = useState<MemberItem | null>(null);

    function handleKick(member: MemberItem) {
        if (window.confirm(t('dashboard.confirmKick', { name: member.name }))) {
            router.delete(admin.members.destroy.url({ user: member.id }));
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="overflow-x-auto rounded-xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#161615]">
                {members.length > 0 ? (
                    <table className="w-full min-w-[480px] text-left text-sm">
                        <thead className="border-b border-black/10 text-[#706f6c] dark:border-white/10 dark:text-[#A1A09A]">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    {t('dashboard.member')}
                                </th>
                                <th className="hidden px-4 py-3 font-medium sm:table-cell">
                                    {t('common.location')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('dashboard.peran')}
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    {t('dashboard.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10 dark:divide-white/10">
                            {members.map((member) => (
                                <tr key={member.id}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/15 text-xs font-semibold text-[#C9A227]">
                                                {member.name
                                                    .split(' ')
                                                    .slice(0, 2)
                                                    .map((part) => part[0])
                                                    .join('')
                                                    .toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate font-medium">
                                                    {member.name}
                                                </p>
                                                <p className="truncate text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                                    {member.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden px-4 py-3 text-[#706f6c] sm:table-cell dark:text-[#A1A09A]">
                                        {member.location ?? '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex rounded-full bg-[#C9A227]/15 px-2.5 py-0.5 text-xs font-medium text-[#C9A227]">
                                            {t(roleLabelKeys[member.role])}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
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
                                                className="rounded-sm border border-black/15 px-3 py-1 text-sm transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 dark:border-white/15"
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
                                                className="rounded-sm border border-black/15 px-3 py-1 text-sm text-red-600 transition hover:border-red-600 active:scale-95 dark:border-white/15 dark:text-red-400"
                                            >
                                                {t('dashboard.kick')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="px-4 py-10 text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
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
            className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#161615]"
        >
            <div>
                <h2 className="text-lg font-semibold tracking-tight">
                    {t('dashboard.editMember', { name: member.name })}
                </h2>
                <p className="mt-0.5 text-sm text-[#706f6c] dark:text-[#A1A09A]">
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
                        className={`${inputClassName} leading-7`}
                    />
                    {errors.bio && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.bio}
                        </p>
                    )}
                </div>

                <aside className="h-fit w-full">
                    <div className="overflow-hidden rounded-lg border border-black/15 dark:border-white/15">
                        <div className="border-b border-black/15 px-4 py-2 text-center text-sm font-medium dark:border-white/15">
                            {t('member.info')}
                        </div>

                        <div className="aspect-square w-full overflow-hidden bg-[#C9A227]/10">
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
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/5 text-5xl font-semibold text-[#C9A227]">
                                    {member.name
                                        .split(' ')
                                        .slice(0, 2)
                                        .map((part) => part[0])
                                        .join('')
                                        .toUpperCase()}
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
                                    className="block w-full text-sm file:mr-4 file:rounded-sm file:border-0 file:bg-[#C9A227]/15 file:px-3 file:py-2 file:font-medium file:text-[#C9A227]"
                                />
                                {errors.profile_picture && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
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
                                    <p className="text-sm text-red-600 dark:text-red-400">
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
                                    <p className="text-sm text-red-600 dark:text-red-400">
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
                className="mt-6 w-fit rounded-sm bg-[#C9A227] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b18f1f] active:scale-95 disabled:opacity-50"
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
                className="flex flex-col gap-5 rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#161615]"
            >
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                        {t('dashboard.settingsTitle')}
                    </h2>
                    <p className="mt-0.5 text-sm text-[#706f6c] dark:text-[#A1A09A]">
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
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.site_name}
                        </p>
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
                        <p className="text-sm text-red-600 dark:text-red-400">
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
                        <p className="text-sm text-red-600 dark:text-red-400">
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
                        className="block w-full text-sm file:mr-4 file:rounded-sm file:border-0 file:bg-[#C9A227]/15 file:px-3 file:py-2 file:font-medium file:text-[#C9A227]"
                    />
                    {errors.logo && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.logo}
                        </p>
                    )}
                    {preview && (
                        <img
                            src={preview}
                            alt={t('dashboard.logoPreview')}
                            className="mt-1 h-12 w-auto self-start rounded-sm object-contain"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-fit rounded-sm bg-[#C9A227] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b18f1f] active:scale-95 disabled:opacity-50"
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
