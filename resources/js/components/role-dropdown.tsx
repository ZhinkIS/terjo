import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useLanguage } from '@/i18n/language-provider';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

import { ROLE_BADGE_CLASSES, ROLE_I18N_KEYS } from './role-badge';

const ALL_ROLES: Role[] = ['admin', 'member', 'slave'];

type RoleDropdownProps = {
    value: Role;
    onChange: (role: Role) => void;
    className?: string;
};

export default function RoleDropdown({
    value,
    onChange,
    className,
}: RoleDropdownProps) {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

    const options = ALL_ROLES.filter((r) => r !== value);

    useEffect(() => {
        if (!open) {
            return;
        }

        function positionMenu() {
            const anchor = anchorRef.current;
            if (!anchor) {
                return;
            }

            const rect = anchor.getBoundingClientRect();
            const menuWidth = 144;
            const menuHeight = options.length * 36 + 8;
            const gap = 6;
            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            let top = rect.bottom + gap;
            let left = rect.left;

            if (left + menuWidth > viewportW - 8) {
                left = viewportW - menuWidth - 8;
            }
            if (left < 8) {
                left = 8;
            }

            if (top + menuHeight > viewportH - 8) {
                top = rect.top - menuHeight - gap;
            }
            if (top < 8) {
                top = 8;
            }

            setMenuStyle({
                position: 'fixed',
                top,
                left,
                width: menuWidth,
            });
        }

        positionMenu();

        document.addEventListener('scroll', positionMenu, true);
        window.addEventListener('resize', positionMenu);

        return () => {
            document.removeEventListener('scroll', positionMenu, true);
            window.removeEventListener('resize', positionMenu);
        };
    }, [open, options.length]);

    useEffect(() => {
        if (!open) {
            return;
        }

        function handleClickOutside(e: MouseEvent) {
            const target = e.target as Node;
            if (
                anchorRef.current?.contains(target) ||
                menuRef.current?.contains(target)
            ) {
                return;
            }
            setOpen(false);
        }

        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    return (
        <>
            <button
                ref={anchorRef}
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={cn(
                    'inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition hover:opacity-80',
                    className,
                    ROLE_BADGE_CLASSES[value],
                )}
            >
                {t(ROLE_I18N_KEYS[value] as 'role.owner')}
                <svg
                    width={10}
                    height={10}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={cn(
                        'transition-transform',
                        open && 'rotate-180',
                    )}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {open
                ? createPortal(
                      <div
                          ref={menuRef}
                          style={menuStyle}
                          className="z-50 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl"
                      >
                          {options.map((role) => (
                              <button
                                  key={role}
                                  type="button"
                                  onClick={() => {
                                      onChange(role);
                                      setOpen(false);
                                  }}
                                  className="flex w-full items-center px-3 py-2 text-xs transition hover:bg-zinc-800 active:bg-zinc-700"
                              >
                                  <span
                                      className={cn(
                                          'inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                                          ROLE_BADGE_CLASSES[role],
                                      )}
                                  >
                                      {t(
                                          ROLE_I18N_KEYS[role] as 'role.owner',
                                      )}
                                  </span>
                              </button>
                          ))}
                      </div>,
                      document.body,
                  )
                : null}
        </>
    );
}
