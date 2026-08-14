import { router } from '@inertiajs/react';

import { useState } from 'react';

import type { ChangeEvent, FormEvent } from 'react';

import { useLanguage } from '@/i18n/language-provider';
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
        <div className="flex flex-col gap-5 rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#161615]">
            <div>
                <h2 className="text-lg font-semibold tracking-tight">
                    {t('slideshow.manage')}
                </h2>
                <p className="mt-0.5 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                    {t('slideshow.manageHint')}
                </p>
            </div>

            <form
                onSubmit={upload}
                className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 sm:flex-row sm:items-end dark:border-white/10"
            >
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <label
                        htmlFor="slideshow-image"
                        className="text-sm font-medium"
                    >
                        {t('slideshow.photo')}
                    </label>
                    <input
                        id="slideshow-image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="block w-full text-sm file:mr-4 file:rounded-sm file:border-0 file:bg-[#C9A227]/15 file:px-3 file:py-2 file:font-medium file:text-[#C9A227]"
                    />
                </div>

                <label className="flex items-center gap-2 text-sm text-[#706f6c] sm:pb-2 dark:text-[#A1A09A]">
                    <input
                        type="checkbox"
                        checked={active}
                        onChange={(event) => setActive(event.target.checked)}
                        className="accent-[#C9A227]"
                    />
                    {t('slideshow.showOnHome')}
                </label>

                <button
                    type="submit"
                    disabled={!file || uploading}
                    className="rounded-sm bg-[#C9A227] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b18f1f] active:scale-95 disabled:opacity-50"
                >
                    {uploading ? t('common.uploading') : t('slideshow.upload')}
                </button>
            </form>

            {ordered.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {ordered.map((slideshow, index) => (
                        <div
                            key={slideshow.id}
                            className="flex flex-col overflow-hidden rounded-lg border border-black/10 dark:border-white/10"
                        >
                            <div className="relative aspect-video w-full bg-[#C9A227]/10">
                                <img
                                    src={slideshow.image_url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex flex-col gap-3 p-4">
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            slideshow.is_active
                                                ? 'bg-[#C9A227]/15 text-[#C9A227]'
                                                : 'bg-black/5 text-[#706f6c] dark:bg-white/10 dark:text-[#A1A09A]'
                                        }`}
                                    >
                                        {slideshow.is_active
                                            ? t('common.active')
                                            : t('common.inactive')}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => move(slideshow, -1)}
                                            disabled={index === 0}
                                            aria-label={t('slideshow.moveUp')}
                                            className="rounded-sm border border-black/15 p-1.5 transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 disabled:opacity-30 dark:border-white/15"
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
                                            className="rounded-sm border border-black/15 p-1.5 transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 disabled:opacity-30 dark:border-white/15"
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
                                        className="rounded-sm border border-black/15 px-3 py-1 text-sm transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 dark:border-white/15"
                                    >
                                        {slideshow.is_active
                                            ? t('common.deactivate')
                                            : t('common.activate')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => remove(slideshow)}
                                        className="rounded-sm border border-black/15 px-3 py-1 text-sm text-red-600 transition hover:border-red-600 active:scale-95 dark:border-white/15 dark:text-red-400"
                                    >
                                        {t('common.delete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="rounded-lg border border-black/10 px-4 py-10 text-center text-sm text-[#706f6c] dark:border-white/10 dark:text-[#A1A09A]">
                    {t('slideshow.empty')}
                </p>
            )}
        </div>
    );
}
