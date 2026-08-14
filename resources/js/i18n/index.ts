import { en } from '@/i18n/locales/en';
import { id } from '@/i18n/locales/id';

import type { Dictionary } from '@/i18n/locales/id';

export type { Dictionary } from '@/i18n/locales/id';

export type LanguageCode = 'id' | 'en';

export const languages = [
    { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
] as const;

export type LanguageOption = (typeof languages)[number];

export const translations: Record<LanguageCode, Dictionary> = { id, en };

export const STORAGE_KEY = 'preferred-language';
