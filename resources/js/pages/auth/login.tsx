import { Head, Link, useForm } from '@inertiajs/react';

import type { FormEvent } from 'react';
import { useState } from 'react';

import Navbar from '@/components/navbar';
import { useLanguage } from '@/i18n/language-provider';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import { store as loginStore } from '@/routes/login';
import { store as registerStore } from '@/routes/register';

const fieldClassName =
    'w-full rounded-2xl border-0 bg-[var(--neu-bg)] px-4 py-3 text-sm text-[var(--neu-ink)] neu-inset-sm transition outline-none placeholder:text-[var(--neu-muted)] focus:ring-2 focus:ring-[var(--neu-accent)]/50';

const labelClassName =
    'text-xs font-bold tracking-[0.2em] text-[var(--neu-muted)] uppercase';

const errorClassName = 'text-sm text-red-600 dark:text-red-400';

const submitClassName =
    'mt-2 w-full rounded-full bg-[var(--neu-bg)] px-6 py-3.5 text-sm font-black tracking-[0.2em] text-[var(--neu-accent)] uppercase neu-raised transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:neu-inset disabled:cursor-not-allowed disabled:opacity-50';

const fieldWrapperClassName = 'flex flex-col gap-2';

type SwitchPanelProps = {
    isLogin: boolean;
    onSwitch: () => void;
};

type PasswordToggleProps = {
    visible: boolean;
    onToggle: () => void;
};

function PasswordToggle({ visible, onToggle }: PasswordToggleProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-[var(--neu-muted)] transition hover:text-[var(--neu-accent)] active:scale-95 active:neu-inset-sm"
            tabIndex={-1}
        >
            {visible ? (
                <svg
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
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
                    aria-hidden="true"
                >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            )}
        </button>
    );
}

function SwitchPanel({ isLogin, onSwitch }: SwitchPanelProps) {
    const { t } = useLanguage();

    return (
        <div className="relative flex h-full min-h-[22rem] flex-col items-center justify-center overflow-hidden p-8 text-center md:p-10">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--neu-bg)] opacity-60 neu-inset"
            />

            <p className="relative inline-flex items-center gap-2 text-[10px] font-black tracking-[0.35em] text-[var(--neu-accent)] uppercase">
                <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--neu-accent)]"
                />
                {t('auth.overlayKicker')}
            </p>

            <h2 className="relative mt-5 max-w-sm text-3xl leading-tight font-black tracking-[0.06em] text-balance text-[var(--neu-ink)] uppercase neu-text">
                {isLogin ? t('auth.welcomeBackTitle') : t('auth.joinTitle')}
            </h2>

            <p className="relative mt-4 max-w-xs text-sm leading-relaxed text-[var(--neu-muted)]">
                {isLogin ? t('auth.welcomeBackCopy') : t('auth.joinCopy')}
            </p>

            <span
                aria-hidden="true"
                className="relative mt-7 h-px w-12 bg-[var(--neu-accent)]/40"
            />

            <button
                type="button"
                onClick={onSwitch}
                className="relative mt-7 inline-flex items-center justify-center gap-3 rounded-full bg-[var(--neu-bg)] px-6 py-3 text-xs font-bold tracking-[0.18em] text-[var(--neu-accent)] uppercase neu-raised-sm transition hover:-translate-y-0.5 active:translate-y-0 active:scale-95 active:neu-inset-sm"
            >
                <span>
                    {isLogin
                        ? `${t('auth.noAccount')} ${t('auth.registerSubmit')}`
                        : `${t('auth.hasAccount')} ${t('auth.loginSubmit')}`}
                </span>
                <span aria-hidden="true">→</span>
            </button>
        </div>
    );
}

export default function Login() {
    const { t } = useLanguage();
    const [isLogin, setIsLogin] = useState(true);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const loginForm = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submitLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        loginForm.post(loginStore.url(), {
            onFinish: () => loginForm.reset('password'),
        });
    }

    function submitRegister(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        registerForm.post(registerStore.url(), {
            onFinish: () =>
                registerForm.reset('password', 'password_confirmation'),
        });
    }

    function switchPanel() {
        setIsLogin((current) => !current);
    }

    return (
        <>
            <Head
                title={
                    isLogin ? t('auth.loginSubmit') : t('auth.registerSubmit')
                }
            />

            <div className="relative flex min-h-svh flex-col overflow-x-clip bg-[var(--neu-bg)] text-[var(--neu-ink)] transition-colors duration-300">
                <Navbar pill />

                <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-6 pb-8 sm:px-6">
                    <Link
                        href={home.url()}
                        className="self-start rounded-full px-2 py-1 text-sm text-[var(--neu-muted)] transition hover:text-[var(--neu-accent)] active:scale-95"
                    >
                        {t('common.backHome')}
                    </Link>

                    <div className="flex flex-1 items-center justify-center py-6 sm:py-10">
                        <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-[var(--neu-bg)] neu-raised md:min-h-[40rem]">
                            <div className="relative z-10 grid md:grid-cols-2">
                                <section
                                    aria-hidden={isLogin}
                                    inert={isLogin}
                                    className={cn(
                                        'col-start-1 row-start-1 flex-col justify-center p-6 sm:p-8 md:col-start-1 md:row-start-1 md:flex md:p-10',
                                        isLogin ? 'hidden md:flex' : 'flex',
                                    )}
                                >
                                    <div className="mb-6">
                                        <p className="inline-flex items-center gap-2 rounded-full bg-[var(--neu-bg)] px-3 py-1 text-[10px] font-bold tracking-[0.25em] text-[var(--neu-accent)] uppercase neu-inset-sm">
                                            <span
                                                aria-hidden="true"
                                                className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--neu-accent)]"
                                            />
                                            {t('auth.overlayKicker')}
                                        </p>

                                        <h2 className="mt-4 text-2xl font-black tracking-[0.08em] text-balance text-[var(--neu-ink)] uppercase neu-text">
                                            {t('auth.registerTitle')}
                                        </h2>

                                        <p className="mt-2 text-sm text-[var(--neu-muted)]">
                                            {t('auth.registerSubtitle')}
                                        </p>
                                    </div>

                                    <form
                                        onSubmit={submitRegister}
                                        className="flex flex-col gap-4"
                                    >
                                        <div className={fieldWrapperClassName}>
                                            <label
                                                htmlFor="register-name"
                                                className={labelClassName}
                                            >
                                                {t('common.name')}
                                            </label>
                                            <input
                                                id="register-name"
                                                type="text"
                                                name="name"
                                                autoComplete="name"
                                                value={registerForm.data.name}
                                                onChange={(e) =>
                                                    registerForm.setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                className={fieldClassName}
                                            />
                                            {registerForm.errors.name && (
                                                <p className={errorClassName}>
                                                    {registerForm.errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className={fieldWrapperClassName}>
                                            <label
                                                htmlFor="register-email"
                                                className={labelClassName}
                                            >
                                                {t('common.email')}
                                            </label>
                                            <input
                                                id="register-email"
                                                type="email"
                                                name="email"
                                                autoComplete="username"
                                                value={registerForm.data.email}
                                                onChange={(e) =>
                                                    registerForm.setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                className={fieldClassName}
                                            />
                                            {registerForm.errors.email && (
                                                <p className={errorClassName}>
                                                    {registerForm.errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className={fieldWrapperClassName}>
                                            <label
                                                htmlFor="register-password"
                                                className={labelClassName}
                                            >
                                                {t('common.password')}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="register-password"
                                                    type={
                                                        showRegisterPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    name="password"
                                                    autoComplete="new-password"
                                                    value={
                                                        registerForm.data
                                                            .password
                                                    }
                                                    onChange={(e) =>
                                                        registerForm.setData(
                                                            'password',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={cn(
                                                        fieldClassName,
                                                        'pr-12',
                                                    )}
                                                />
                                                <PasswordToggle
                                                    visible={
                                                        showRegisterPassword
                                                    }
                                                    onToggle={() =>
                                                        setShowRegisterPassword(
                                                            !showRegisterPassword,
                                                        )
                                                    }
                                                />
                                            </div>
                                            {registerForm.errors.password && (
                                                <p className={errorClassName}>
                                                    {
                                                        registerForm.errors
                                                            .password
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className={fieldWrapperClassName}>
                                            <label
                                                htmlFor="register-password-confirmation"
                                                className={labelClassName}
                                            >
                                                {t('common.passwordConfirm')}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="register-password-confirmation"
                                                    type={
                                                        showConfirmPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    name="password_confirmation"
                                                    autoComplete="new-password"
                                                    value={
                                                        registerForm.data
                                                            .password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        registerForm.setData(
                                                            'password_confirmation',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={cn(
                                                        fieldClassName,
                                                        'pr-12',
                                                    )}
                                                />
                                                <PasswordToggle
                                                    visible={
                                                        showConfirmPassword
                                                    }
                                                    onToggle={() =>
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword,
                                                        )
                                                    }
                                                />
                                            </div>
                                            {registerForm.errors
                                                .password_confirmation && (
                                                <p className={errorClassName}>
                                                    {
                                                        registerForm.errors
                                                            .password_confirmation
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={registerForm.processing}
                                            className={submitClassName}
                                        >
                                            {registerForm.processing
                                                ? t('common.processing')
                                                : t('auth.registerSubmit')}
                                        </button>
                                    </form>
                                </section>

                                <section
                                    aria-hidden={!isLogin}
                                    inert={!isLogin}
                                    className={cn(
                                        'col-start-1 row-start-1 flex-col justify-center p-6 sm:p-8 md:col-start-2 md:row-start-1 md:flex md:p-10',
                                        isLogin ? 'flex' : 'hidden md:flex',
                                    )}
                                >
                                    <div className="mb-6">
                                        <p className="inline-flex items-center gap-2 rounded-full bg-[var(--neu-bg)] px-3 py-1 text-[10px] font-bold tracking-[0.25em] text-[var(--neu-accent)] uppercase neu-inset-sm">
                                            <span
                                                aria-hidden="true"
                                                className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--neu-accent)]"
                                            />
                                            {t('auth.overlayKicker')}
                                        </p>

                                        <h2 className="mt-4 text-2xl font-black tracking-[0.08em] text-balance text-[var(--neu-ink)] uppercase neu-text">
                                            {t('auth.loginTitle')}
                                        </h2>

                                        <p className="mt-2 text-sm text-[var(--neu-muted)]">
                                            {t('auth.loginSubtitle')}
                                        </p>
                                    </div>

                                    <form
                                        onSubmit={submitLogin}
                                        className="flex flex-col gap-4"
                                    >
                                        <div className={fieldWrapperClassName}>
                                            <label
                                                htmlFor="login-email"
                                                className={labelClassName}
                                            >
                                                {t('common.email')}
                                            </label>
                                            <input
                                                id="login-email"
                                                type="email"
                                                name="email"
                                                autoComplete="username"
                                                value={loginForm.data.email}
                                                onChange={(e) =>
                                                    loginForm.setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                className={fieldClassName}
                                            />
                                            {loginForm.errors.email && (
                                                <p className={errorClassName}>
                                                    {loginForm.errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className={fieldWrapperClassName}>
                                            <label
                                                htmlFor="login-password"
                                                className={labelClassName}
                                            >
                                                {t('common.password')}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="login-password"
                                                    type={
                                                        showLoginPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    name="password"
                                                    autoComplete="current-password"
                                                    value={
                                                        loginForm.data.password
                                                    }
                                                    onChange={(e) =>
                                                        loginForm.setData(
                                                            'password',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={cn(
                                                        fieldClassName,
                                                        'pr-12',
                                                    )}
                                                />
                                                <PasswordToggle
                                                    visible={showLoginPassword}
                                                    onToggle={() =>
                                                        setShowLoginPassword(
                                                            !showLoginPassword,
                                                        )
                                                    }
                                                />
                                            </div>
                                            {loginForm.errors.password && (
                                                <p className={errorClassName}>
                                                    {loginForm.errors.password}
                                                </p>
                                            )}
                                        </div>

                                        <label className="flex items-center gap-3 text-sm text-[var(--neu-muted)]">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                checked={
                                                    loginForm.data.remember
                                                }
                                                onChange={(e) =>
                                                    loginForm.setData(
                                                        'remember',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="h-4 w-4 shrink-0 cursor-pointer rounded border-0 bg-[var(--neu-bg)] accent-[var(--neu-accent)] neu-inset-sm transition focus:ring-2 focus:ring-[var(--neu-accent)]/50"
                                            />
                                            {t('auth.remember')}
                                        </label>

                                        <button
                                            type="submit"
                                            disabled={loginForm.processing}
                                            className={submitClassName}
                                        >
                                            {loginForm.processing
                                                ? t('common.processing')
                                                : t('auth.loginSubmit')}
                                        </button>
                                    </form>
                                </section>
                            </div>

                            <div
                                className={cn(
                                    'absolute inset-y-0 left-0 z-20 hidden w-1/2 transition-transform duration-700 ease-in-out md:block',
                                    isLogin
                                        ? 'translate-x-0'
                                        : 'translate-x-full',
                                )}
                            >
                                <div className="relative h-full overflow-hidden rounded-[2rem] bg-[var(--neu-bg)] neu-raised-sm">
                                    <SwitchPanel
                                        isLogin={isLogin}
                                        onSwitch={switchPanel}
                                    />
                                </div>
                            </div>

                            <div className="relative bg-[var(--neu-bg)] neu-inset md:hidden">
                                <SwitchPanel
                                    isLogin={isLogin}
                                    onSwitch={switchPanel}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
