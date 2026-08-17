import { Head, Link, useForm } from '@inertiajs/react';

import type { FormEvent } from 'react';
import { useState } from 'react';

import Navbar from '@/components/navbar';
import { useLanguage } from '@/i18n/language-provider';
import { home, register } from '@/routes';

import { store } from '@/routes/login';

export default function Login() {
    const { t } = useLanguage();
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(store.url(), {
            onFinish: () => reset('password'),
        });
    }

    return (
        <>
            <Head title={t('auth.loginSubmit')} />

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <Navbar />

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
                                {t('auth.loginTitle')}
                            </h1>
                            <p className="mb-6 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                {t('auth.loginSubtitle')}
                            </p>

                            <form
                                onSubmit={submit}
                                className="flex flex-col gap-4"
                            >
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
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            name="password"
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-sm border border-black/15 px-3 py-2 pr-10 text-sm text-[#1b1b18] transition outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] dark:border-white/15 dark:bg-[#0a0a0a] dark:text-[#EDEDEC]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute top-1/2 right-2 -translate-y-1/2 p-0.5 text-[#706f6c] transition hover:text-[#C9A227] dark:text-[#A1A09A]"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <svg
                                                    width={18}
                                                    height={18}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                                                    <line
                                                        x1="1"
                                                        y1="1"
                                                        x2="23"
                                                        y2="23"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    width={18}
                                                    height={18}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="3"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <label className="flex items-center gap-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                'remember',
                                                e.target.checked,
                                            )
                                        }
                                        className="accent-[#C9A227]"
                                    />
                                    {t('auth.remember')}
                                </label>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-sm bg-[#C9A227] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b18f1f] active:scale-95 disabled:opacity-50"
                                >
                                    {processing
                                        ? t('common.processing')
                                        : t('auth.loginSubmit')}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                {t('auth.noAccount')}{' '}
                                <Link
                                    href={register.url()}
                                    className="font-medium text-[#1b1b18] underline underline-offset-4 transition active:opacity-70 dark:text-[#EDEDEC]"
                                >
                                    {t('auth.registerSubmit')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
