import { Head, Link, useForm } from '@inertiajs/react';

import type { FormEvent } from 'react';
import { useState } from 'react';

import Navbar from '@/components/navbar';
import { useLanguage } from '@/i18n/language-provider';
import { cn } from '@/lib/utils';
import { home, login } from '@/routes';
import { store } from '@/routes/register';

const fieldClassName =
    'w-full rounded-2xl border-0 bg-[var(--neu-bg)] px-4 py-3 text-sm text-[var(--neu-ink)] neu-inset-sm transition outline-none placeholder:text-[var(--neu-muted)] focus:ring-2 focus:ring-[var(--neu-accent)]/50';

const labelClassName =
    'text-xs font-bold tracking-[0.2em] text-[var(--neu-muted)] uppercase';

const errorClassName = 'text-sm text-red-600 dark:text-red-400';

const submitClassName =
    'mt-2 w-full rounded-full bg-[var(--neu-bg)] px-6 py-3.5 text-sm font-black tracking-[0.2em] text-[var(--neu-accent)] uppercase neu-raised transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:neu-inset disabled:cursor-not-allowed disabled:opacity-50';

export default function Register() {
    const { t } = useLanguage();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

            <div className="flex min-h-svh flex-col bg-[var(--neu-bg)] text-[var(--neu-ink)] transition-colors duration-300">
                <Navbar pill />

                <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pt-6 pb-8">
                    <Link
                        href={home.url()}
                        className="self-start rounded-full px-2 py-1 text-sm text-[var(--neu-muted)] transition hover:text-[var(--neu-accent)] active:scale-95"
                    >
                        {t('common.backHome')}
                    </Link>

                    <div className="flex flex-1 flex-col items-center justify-center py-10">
                        <div className="w-full max-w-md rounded-[2rem] bg-[var(--neu-bg)] p-6 pb-8 neu-raised sm:p-8">
                            <div className="mb-6">
                                <p className="inline-flex items-center gap-2 rounded-full bg-[var(--neu-bg)] px-3 py-1 text-[10px] font-bold tracking-[0.25em] text-[var(--neu-accent)] uppercase neu-inset-sm">
                                    <span
                                        aria-hidden="true"
                                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--neu-accent)]"
                                    />
                                    {t('auth.overlayKicker')}
                                </p>

                                <h1 className="mt-4 text-2xl font-black tracking-[0.08em] text-balance text-[var(--neu-ink)] uppercase neu-text">
                                    {t('auth.registerTitle')}
                                </h1>
                                <p className="mt-2 text-sm text-[var(--neu-muted)]">
                                    {t('auth.registerSubtitle')}
                                </p>
                            </div>

                            <form
                                onSubmit={submit}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="name"
                                        className={labelClassName}
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
                                        className={fieldClassName}
                                    />
                                    {errors.name && (
                                        <p className={errorClassName}>
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="email"
                                        className={labelClassName}
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
                                        className={fieldClassName}
                                    />
                                    {errors.email && (
                                        <p className={errorClassName}>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="password"
                                        className={labelClassName}
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
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            className={cn(
                                                fieldClassName,
                                                'pr-12',
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-[var(--neu-muted)] transition hover:text-[var(--neu-accent)] active:scale-95 active:neu-inset-sm"
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
                                        <p className={errorClassName}>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="password_confirmation"
                                        className={labelClassName}
                                    >
                                        {t('common.passwordConfirm')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password_confirmation"
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            name="password_confirmation"
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            className={cn(
                                                fieldClassName,
                                                'pr-12',
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
                                            }
                                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-[var(--neu-muted)] transition hover:text-[var(--neu-accent)] active:scale-95 active:neu-inset-sm"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? (
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
                                    {errors.password_confirmation && (
                                        <p className={errorClassName}>
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={submitClassName}
                                >
                                    {processing
                                        ? t('common.processing')
                                        : t('auth.registerSubmit')}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-[var(--neu-muted)]">
                                {t('auth.hasAccount')}{' '}
                                <Link
                                    href={login.url()}
                                    className="rounded font-bold text-[var(--neu-accent)] underline-offset-4 transition hover:underline active:scale-95"
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
