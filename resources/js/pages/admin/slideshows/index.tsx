import { Link, router, usePage } from '@inertiajs/react';

import AdminLayout from '@/components/admin-layout';
import { useLanguage } from '@/i18n/language-provider';
import { create, destroy, edit } from '@/routes/admin/slideshows';

type SlideshowItem = {
    id: number;
    image_path: string;
    image_url: string;
    is_active: boolean;
    created_at: string | null;
};

type SlideshowsIndexProps = {
    slideshows: SlideshowItem[];
};

export default function SlideshowsIndex({ slideshows }: SlideshowsIndexProps) {
    const { flash } = usePage().props;
    const { t } = useLanguage();

    function handleDelete(slideshow: SlideshowItem) {
        if (window.confirm(t('slideshow.confirmDelete'))) {
            router.delete(destroy.url(slideshow.id));
        }
    }

    return (
        <AdminLayout title={t('slideshow.title')}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t('slideshow.title')}
                    </h1>
                    <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        {t('slideshow.hint')}
                    </p>
                </div>

                <Link
                    href={create.url()}
                    className="rounded-sm bg-[#C9A227] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b18f1f] active:scale-95"
                >
                    {t('slideshow.add')}
                </Link>
            </div>

            {flash.success && (
                <div className="rounded-lg border border-[#C9A227]/40 bg-[#C9A227]/10 px-4 py-3 text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                    {flash.success}
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#161615]">
                {slideshows.length > 0 ? (
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-black/10 text-[#706f6c] dark:border-white/10 dark:text-[#A1A09A]">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    {t('slideshow.image')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('slideshow.status')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('slideshow.created')}
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    {t('slideshow.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10 dark:divide-white/10">
                            {slideshows.map((slideshow) => (
                                <tr key={slideshow.id}>
                                    <td className="px-4 py-3">
                                        <img
                                            src={slideshow.image_url}
                                            alt=""
                                            className="h-16 w-28 rounded-lg object-cover"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
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
                                    </td>
                                    <td className="px-4 py-3 text-[#706f6c] dark:text-[#A1A09A]">
                                        {slideshow.created_at?.slice(0, 10)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={edit.url(slideshow.id)}
                                                className="rounded-sm border border-black/15 px-3 py-1 text-sm transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 dark:border-white/15"
                                            >
                                                {t('common.edit')}
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(slideshow)
                                                }
                                                className="rounded-sm border border-black/15 px-3 py-1 text-sm text-red-600 transition hover:border-red-600 active:scale-95 dark:border-white/15 dark:text-red-400"
                                            >
                                                {t('common.delete')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="px-4 py-10 text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        {t('slideshow.emptyList')}
                    </p>
                )}
            </div>
        </AdminLayout>
    );
}
