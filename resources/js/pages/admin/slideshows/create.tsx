import { Link, useForm } from '@inertiajs/react';

import type { ChangeEvent, FormEvent } from 'react';

import { useState } from 'react';

import AdminLayout from '@/components/admin-layout';
import { useLanguage } from '@/i18n/language-provider';
import { index, store } from '@/routes/admin/slideshows';

export default function CreateSlideshow() {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        image: null as File | null,
        is_active: true,
    });

    const [preview, setPreview] = useState<string | null>(null);

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(store.url());
    }

    function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;

        setData('image', file);
        setPreview(file ? URL.createObjectURL(file) : null);
    }

    return (
        <AdminLayout title={t('slideshow.addTitle')}>
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t('slideshow.addTitle')}
                </h1>
                <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                    {t('slideshow.addHint')}
                </p>
            </div>

            <form
                onSubmit={submit}
                className="flex max-w-xl flex-col gap-5 rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#161615]"
            >
                <div className="flex flex-col gap-2">
                    <label htmlFor="image" className="text-sm font-medium">
                        {t('slideshow.photo')}
                    </label>
                    <input
                        id="image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="block w-full text-sm file:mr-4 file:rounded-sm file:border-0 file:bg-[#C9A227]/15 file:px-3 file:py-2 file:font-medium file:text-[#C9A227]"
                    />
                    {errors.image && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.image}
                        </p>
                    )}
                    {preview && (
                        <img
                            src={preview}
                            alt={t('slideshow.preview')}
                            className="mt-1 h-40 w-full rounded-lg object-cover"
                        />
                    )}
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="accent-[#C9A227]"
                    />
                    {t('slideshow.showOnHome')}
                </label>

                <div className="flex items-center gap-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-sm bg-[#C9A227] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b18f1f] active:scale-95 disabled:opacity-50"
                    >
                        {processing ? t('common.saving') : t('common.save')}
                    </button>
                    <Link
                        href={index.url()}
                        className="rounded-sm border border-black/15 px-4 py-2 text-sm font-medium transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 dark:border-white/15"
                    >
                        {t('common.cancel')}
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
