import { createInertiaApp } from '@inertiajs/react';

import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/i18n/language-provider';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        delay: 250,
        color: '#eab308',
        showSpinner: false,
    },
    withApp(app) {
        return (
            <LanguageProvider>
                <ThemeProvider>{app}</ThemeProvider>
            </LanguageProvider>
        );
    },
});
