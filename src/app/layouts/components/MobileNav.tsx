import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Full-screen slide-in menu, mobile only (18 - Component Inventory.md §7) —
 * never a Mega Menu. Same navigation items as Navbar's desktop-only <nav>,
 * just presented full-screen below the `tablet` breakpoint.
 */
export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-modal flex flex-col bg-paper tablet:hidden dark:bg-ink-dark">
      <div className="flex items-center justify-between border-b border-stone px-md py-sm dark:border-stone-dark">
        <span className="font-display text-heading text-ink dark:text-paper-dark">VESTIGE</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="text-ink dark:text-paper-dark"
        >
          <CloseIcon />
        </button>
      </div>
      <nav className={cn('flex flex-col gap-sm px-md py-md')} aria-label="Primary">
        <Link
          to={ROUTES.shop}
          onClick={onClose}
          className="py-sm text-body-lg text-ink dark:text-paper-dark"
        >
          Shop
        </Link>
      </nav>
    </div>,
    document.body,
  );
}
