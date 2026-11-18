import { router } from '@inertiajs/react';

import { useState } from 'react';

import type { ChangeEvent, FormEvent } from 'react';

import { useLanguage } from '@/i18n/language-provider';
import { cn } from '@/lib/utils';
import { destroy, reorder, store, update } from '@/routes/admin/slideshows';

type SlideshowItem = {
    id: number;
    image_path: string;
    image_url: string;
    is_active: boolean;
    position: number;
    created_at: string | null;
};

type SlideshowManagerProps = {
    slideshows: SlideshowItem[];
};

export default function SlideshowManager({
    slideshows,
}: SlideshowManagerProps) {
    const { t } = useLanguage();

    const [prevSlideshows, setPrevSlideshows] =
        useState<SlideshowItem[]>(slideshows);
    const [orderedIds, setOrderedIds] = useState<number[]>(() =>
        slideshows.map((slideshow) => slideshow.id),
    );
    const [file, setFile] = useState<File | null>(null);
    const [active, setActive] = useState(true);
    const [uploading, setUploading] = useState(false);

    if (prevSlideshows !== slideshows) {
        setPrevSlideshows(slideshows);
        setOrderedIds(slideshows.map((slideshow) => slideshow.id));
    }

    const ordered = orderedIds
        .map((id) => slideshows.find((slideshow) => slideshow.id === id))
        .filter(
            (slideshow): slideshow is SlideshowItem => slideshow !== undefined,
        );

    function move(slideshow: SlideshowItem, direction: -1 | 1) {
        const from = orderedIds.indexOf(slideshow.id);
        const to = from + direction;

        if (from === -1 || to < 0 || to >= orderedIds.length) {
            return;
        }

        const next = [...orderedIds];

        [next[from], next[to]] = [next[to], next[from]];

        setOrderedIds(next);

        router.put(
            reorder.url(),
            { ids: next },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }

    function toggle(slideshow: SlideshowItem) {
        router.put(
            update.url(slideshow.id),
            {
                is_active: !slideshow.is_active,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }

    function remove(slideshow: SlideshowItem) {
        if (window.confirm(t('slideshow.confirmDelete'))) {
            router.delete(destroy.url(slideshow.id), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        setFile(event.target.files?.[0] ?? null);
    }

    function upload(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!file) {
            return;
        }

        router.post(
            store.url(),
            { image: file, is_active: active },
            {
                forceFormData: true,
                preserveState: true,
                preserveScroll: true,
                onStart: () => setUploading(true),
                onFinish: () => {
                    setUploading(false);
                    setFile(null);
                },
            },
        );
    }

    return (
        <div className="flex flex-col gap-6 rounded-[2.5rem] bg-[var(--neu-bg)] p-5 neu-raised sm:p-6">
            <div>
                <h2 className="text-lg font-semibold tracking-tight text-[var(--neu-ink)] neu-text">
                    {t('slideshow.manage')}
                </h2>
                <p className="mt-1 text-sm text-[var(--neu-muted)]">
                    {t('slideshow.manageHint')}
                </p>
            </div>

            <form
                onSubmit={upload}
                className="flex flex-col gap-4 rounded-[2rem] bg-[var(--neu-bg)] p-4 neu-inset sm:flex-row sm:items-end"
            >
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <label
                        htmlFor="slideshow-image"
                        className="text-sm font-medium text-[var(--neu-ink)]"
                    >
                        {t('slideshow.photo')}
                    </label>
                    <input
                        id="slideshow-image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="block w-full cursor-pointer rounded-2xl bg-[var(--neu-bg)] p-1 text-sm text-[var(--neu-muted)] neu-inset-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[var(--neu-bg)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--neu-accent)] file:neu-raised-sm file:transition file:active:scale-95 file:active:neu-inset-sm"
                    />
                </div>

                <label className="flex items-center gap-2 text-sm text-[var(--neu-muted)] sm:pb-2">
                    <input
                        type="checkbox"
                        checked={active}
                        onChange={(event) => setActive(event.target.checked)}
                        className="h-4 w-4 rounded-md accent-[var(--neu-accent)]"
                    />
                    {t('slideshow.showOnHome')}
                </label>

                <button
                    type="submit"
                    disabled={!file || uploading}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--neu-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--neu-accent)] neu-raised-sm transition hover:-translate-y-0.5 hover:neu-raised active:translate-y-0 active:scale-95 active:neu-inset-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    {uploading ? t('common.uploading') : t('slideshow.upload')}
                </button>
            </form>

            {ordered.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {ordered.map((slideshow, index) => (
                        <div
                            key={slideshow.id}
                            className="flex flex-col overflow-hidden rounded-[2rem] bg-[var(--neu-bg)] p-3 neu-raised transition hover:neu-raised-lg"
                        >
                            <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem] bg-[var(--neu-bg)] neu-inset">
                                <img
                                    src={slideshow.image_url}
                                    alt=""
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            '/images/slide1.jpg';
                                    }}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex flex-col gap-3 p-2 pt-4 sm:p-3 sm:pt-4">
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className={cn(
                                            'inline-flex rounded-full bg-[var(--neu-bg)] px-3 py-1 text-xs font-semibold neu-inset-sm',
                                            slideshow.is_active
                                                ? 'text-[var(--neu-accent)]'
                                                : 'text-[var(--neu-muted)]',
                                        )}
                                    >
                                        {slideshow.is_active
                                            ? t('common.active')
                                            : t('common.inactive')}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => move(slideshow, -1)}
                                            disabled={index === 0}
                                            aria-label={t('slideshow.moveUp')}
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--neu-bg)] text-[var(--neu-muted)] neu-raised-sm transition hover:text-[var(--neu-accent)] active:scale-95 active:neu-inset-sm disabled:opacity-30"
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
                                                <path d="m18 15-6-6-6 6" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => move(slideshow, 1)}
                                            disabled={
                                                index === ordered.length - 1
                                            }
                                            aria-label={t('slideshow.moveDown')}
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--neu-bg)] text-[var(--neu-muted)] neu-raised-sm transition hover:text-[var(--neu-accent)] active:scale-95 active:neu-inset-sm disabled:opacity-30"
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
                                                <path d="m6 9 6 6 6-6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggle(slideshow)}
                                        className="rounded-full bg-[var(--neu-bg)] px-4 py-2 text-sm font-medium text-[var(--neu-accent)] neu-raised-sm transition hover:neu-raised active:scale-95 active:neu-inset-sm"
                                    >
                                        {slideshow.is_active
                                            ? t('common.deactivate')
                                            : t('common.activate')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => remove(slideshow)}
                                        className="rounded-full bg-[var(--neu-bg)] px-4 py-2 text-sm font-medium text-red-600 neu-raised-sm transition hover:neu-raised active:scale-95 active:neu-inset-sm dark:text-red-400"
                                    >
                                        {t('common.delete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="rounded-[2rem] bg-[var(--neu-bg)] px-6 py-10 text-center text-sm text-[var(--neu-muted)] neu-inset">
                    {t('slideshow.empty')}
                </p>
            )}
        </div>
    );
}
