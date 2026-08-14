import { Head, Link, useForm } from '@inertiajs/react';

import type { FormEvent } from 'react';

import AccountDropdown from '@/components/account-dropdown';
import Navbar from '@/components/navbar';
import { useLanguage } from '@/i18n/language-provider';
import { home, login } from '@/routes';

import { store } from '@/routes/register';

export default function Register() {
    const { t } = useLanguage();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(store.url(), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <>
            <Head title={t('auth.registerSubmit')} />

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <Navbar>
                    <AccountDropdown />
                </Navbar>

                <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pt-6 pb-8">
                    <Link
                        href={home.url()}
                        className="self-start text-sm text-[#706f6c] transition hover:text-[#C9A227] active:opacity-70 dark:text-[#A1A09A]"
                    >
                        {t('common.backHome')}
                    </Link>

                    <div className="flex flex-1 flex-col items-center justify-center py-10">
                        <div className="w-full max-w-sm rounded-lg border border-black/10 bg-white p-6 pb-8 shadow-sm dark:border-white/10 dark:bg-[#161615]">
                            <h1 className="mb-1 font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                {t('auth.registerTitle')}
                            </h1>
                            <p className="mb-6 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                {t('auth.registerSubtitle')}
                            </p>

                            <form
                                onSubmit={submit}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="name"
                                        className="text-sm text-[#1b1b18] dark:text-[#EDEDEC]"
                                    >
                                        {t('common.name')}
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="rounded-sm border border-black/15 px-3 py-2 text-sm text-[#1b1b18] transition outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] dark:border-white/15 dark:bg-[#0a0a0a] dark:text-[#EDEDEC]"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="email"
                                        className="text-sm text-[#1b1b18] dark:text-[#EDEDEC]"
                                    >
                                        {t('common.email')}
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="username"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="rounded-sm border border-black/15 px-3 py-2 text-sm text-[#1b1b18] transition outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] dark:border-white/15 dark:bg-[#0a0a0a] dark:text-[#EDEDEC]"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="password"
                                        className="text-sm text-[#1b1b18] dark:text-[#EDEDEC]"
                                    >
                                        {t('common.password')}
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="rounded-sm border border-black/15 px-3 py-2 text-sm text-[#1b1b18] transition outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] dark:border-white/15 dark:bg-[#0a0a0a] dark:text-[#EDEDEC]"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="password_confirmation"
                                        className="text-sm text-[#1b1b18] dark:text-[#EDEDEC]"
                                    >
                                        {t('common.passwordConfirm')}
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        className="rounded-sm border border-black/15 px-3 py-2 text-sm text-[#1b1b18] transition outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] dark:border-white/15 dark:bg-[#0a0a0a] dark:text-[#EDEDEC]"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-sm bg-[#C9A227] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b18f1f] active:scale-95 disabled:opacity-50"
                                >
                                    {processing
                                        ? t('common.processing')
                                        : t('auth.registerSubmit')}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                {t('auth.hasAccount')}{' '}
                                <Link
                                    href={login.url()}
                                    className="font-medium text-[#1b1b18] underline underline-offset-4 transition active:opacity-70 dark:text-[#EDEDEC]"
                                >
                                    {t('auth.loginSubmit')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
