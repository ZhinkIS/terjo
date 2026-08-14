import { createContext, useContext, useEffect, useState } from 'react';

import type { ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
    children: ReactNode;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = 'theme';

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
    undefined,
);

function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

function applyTheme(theme: Theme) {
    const isDark =
        theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark');

    document.documentElement.classList.toggle('dark', isDark);
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') {
            return 'system';
        }

        const stored = window.localStorage.getItem(STORAGE_KEY);

        return stored === 'light' || stored === 'dark' || stored === 'system'
            ? stored
            : 'system';
    });

    useEffect(() => {
        applyTheme(theme);

        window.localStorage.setItem(STORAGE_KEY, theme);

        if (theme !== 'system') {
            return;
        }

        const media = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => applyTheme('system');

        media.addEventListener('change', handleChange);

        return () => media.removeEventListener('change', handleChange);
    }, [theme]);

    return (
        <ThemeProviderContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export function useTheme(): ThemeProviderState {
    const context = useContext(ThemeProviderContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}
