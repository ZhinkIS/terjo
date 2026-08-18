import type { Auth } from '@/types/auth';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            site: {
                name: string;
                logo_url: string | null;
            };
            auth: Auth;
            flash: {
                success: string | null;
            };
            errors: Record<string, string>;
            [key: string]: unknown;
        };
    }
}
