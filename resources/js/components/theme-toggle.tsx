import { useTheme } from '@/components/theme-provider';

import type { Theme } from '@/components/theme-provider';
import type { Dictionary } from '@/i18n';
import { useLanguage } from '@/i18n/language-provider';

import { cn } from '@/lib/utils';

const themeOrder: Theme[] = ['light', 'dark', 'system'];

const themeLabelKeys: Record<Theme, keyof Dictionary> = {
    light: 'theme.light',
    dark: 'theme.dark',
    system: 'theme.system',
};

export default function ThemeToggle({
    overlay = false,
}: {
    overlay?: boolean;
}) {
    const { theme, setTheme } = useTheme();
    const { t } = useLanguage();

    const nextTheme =
        themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length];

    return (
        <button
            type="button"
            onClick={() => setTheme(nextTheme)}
            title={t('theme.tooltip', {
                theme: t(themeLabelKeys[theme]),
            })}
            className={cn(
                'rounded-sm border border-black/15 p-2 text-[#1b1b18] transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 dark:border-white/15 dark:text-[#EDEDEC]',
                overlay &&
                    'border-white/15 text-white dark:border-white/15 dark:text-white',
            )}
        >
            {theme === 'dark' ? (
                <svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
            ) : theme === 'light' ? (
                <svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            ) : (
                <svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                </svg>
            )}
        </button>
    );
}
