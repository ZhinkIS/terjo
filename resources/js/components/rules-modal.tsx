import { useEffect } from 'react';

import { useLanguage } from '@/i18n/language-provider';

const RULES = [
    'Leader always on top 👑',
    'Listen to what Leader said 🗣️',
    'When Leader gave a question, Answer it. (Admins & Member) 🙋',
    'Leader Loves every Member 🩷 (except Slave)',
    'Slave sucks ⛓️‍💥',
    'Admins Asks, Member answers (MUST) 🙋',
    'No do not say 67 when reading this shit. 🤬',
    "Don't date other member if they're the same Gender 🤬",
    'Listen to Admins after Leader 💂',
    'Number 1 👑',
    'Have common senses 🧠',
    'Love yourself 🫂',
    "Don't make other members uncomfortable 😐 (unless you are just playing and they get along with it or fine)",
    'Any sensitive topic (jokes, stories, or news) should be checked by admins ‼️',
    'Any problems happening should be reported and handled with admins ⚖️',
    'Do not send disturbing image or something similar that include 18+ ,gore, or etc that can disturb many people 🚫 (pls handle your fetish)',
    'No bullying, harrasing and always try to avoid fight with others 🙌',
    'If you do something bad because its not on the list of rules, it will still count as one 📝 (Depends on the situation)',
];

type RulesModalProps = {
    open: boolean;
    onClose: () => void;
};

export default function RulesModal({ open, onClose }: RulesModalProps) {
    const { t } = useLanguage();

    useEffect(() => {
        if (!open) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label={t('rules.closeModal')}
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-black/60"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="rules-modal-title"
                className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border-2 border-[#C9A227] bg-white shadow-2xl dark:bg-[#161615]"
            >
                <div className="flex shrink-0 items-center justify-between gap-4 border-b border-black/10 px-5 py-4 dark:border-white/10">
                    <h2
                        id="rules-modal-title"
                        className="text-lg font-semibold tracking-tight"
                    >
                        📜Terjo Legalis Pactum
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t('rules.close')}
                        className="rounded-sm border border-black/15 p-1.5 text-[#1b1b18] transition hover:border-[#C9A227] hover:text-[#C9A227] active:scale-95 dark:border-white/15 dark:text-[#EDEDEC]"
                    >
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
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                    <ul className="divide-y divide-black/10 rounded-sm border border-black/10 bg-[#FDFDFC] dark:divide-white/10 dark:border-white/10 dark:bg-[#0a0a0a]">
                        {RULES.map((rule, index) => (
                            <li
                                key={rule}
                                className="flex items-start gap-3 px-3 py-3 text-sm leading-relaxed text-[#1b1b18] dark:text-[#EDEDEC]"
                            >
                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/15 text-xs font-semibold text-[#C9A227]">
                                    {index + 1}
                                </span>
                                <span>{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
