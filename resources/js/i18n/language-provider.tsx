import {
    createContext,
    useCallback,
    useContext,
    useSyncExternalStore,
} from 'react';

import type { ReactNode } from 'react';

import { STORAGE_KEY, translations } from '@/i18n';

import type { Dictionary, LanguageCode } from '@/i18n';

type LanguageProviderProps = {
    children: ReactNode;
};

type LanguageProviderState = {
    language: LanguageCode;
    setLanguage: (language: LanguageCode) => void;
    t: (
        key: keyof Dictionary,
        params?: Record<string, string | number>,
    ) => string;
};

const LanguageProviderContext = createContext<
    LanguageProviderState | undefined
>(undefined);

const serverLanguage: LanguageCode = 'id';

let cachedLanguage: LanguageCode | null = null;

const listeners = new Set<() => void>();

function getStoredLanguage(): LanguageCode {
    if (cachedLanguage === null) {
        const stored = window.localStorage.getItem(STORAGE_KEY);

        cachedLanguage = stored === 'id' || stored === 'en' ? stored : 'id';
    }

    return cachedLanguage;
}

function subscribe(listener: () => void): () => void {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

function getSnapshot(): LanguageCode {
    return getStoredLanguage();
}

function getServerSnapshot(): LanguageCode {
    return serverLanguage;
}

function setLanguage(language: LanguageCode): void {
    window.localStorage.setItem(STORAGE_KEY, language);
    cachedLanguage = language;
    listeners.forEach((listener) => listener());
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const language = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
    );

    const t = useCallback(
        (key: keyof Dictionary, params?: Record<string, string | number>) => {
            let text = translations[language][key];

            if (params) {
                for (const [name, value] of Object.entries(params)) {
                    text = text.replaceAll(`{${name}}`, String(value));
                }
            }

            return text;
        },
        [language],
    );

    return (
        <LanguageProviderContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageProviderContext.Provider>
    );
}

export function useLanguage(): LanguageProviderState {
    const context = useContext(LanguageProviderContext);

    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }

    return context;
}
