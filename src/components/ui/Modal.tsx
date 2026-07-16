import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

export type ModalVariant = 'confirmation' | 'detail' | 'form';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Action buttons row (typically a secondary Cancel + primary action) — §11.2: never just an unlabeled close icon with no textual escape. */
  footer?: ReactNode;
  /**
   * Controls mobile presentation (§11.2): 'confirmation'/'form' may present as
   * a bottom sheet on mobile; 'detail' always uses a full-screen treatment on
   * mobile regardless of this being a bottom-sheet-capable variant otherwise.
   */
  variant?: ModalVariant;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Single Modal primitive covering ConfirmationModal/DetailModal/FormModal and
 * the mobile Drawer presentation (18 - Component Inventory.md §3 — Drawer is
 * a presentation mode of this component, not a separate one).
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  variant = 'confirmation',
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Focus trap + restore focus to the triggering element on close (§11.2, §20).
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement;
    const dialog = dialogRef.current;
    const focusables = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    (focusables?.[0] ?? dialog)?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialog) return;

      const focusableEls = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusableEls.length === 0) return;
      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-modal flex items-center justify-center tablet:items-center">
      {/* Scrim: translucent color.ink, never blurred (§11.2) */}
      <div
        className="fixed inset-0 z-modalScrim bg-overlay dark:bg-overlay-dark"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative z-modal max-h-[90vh] overflow-y-auto rounded bg-paper shadow-modal dark:bg-ink-dark dark:shadow-modal-dark',
          'w-full max-w-container-form animate-none',
          // Mobile presentation: DetailModal always goes full-screen; the other
          // two variants use a bottom-sheet treatment (§11.2).
          variant === 'detail'
            ? 'inset-0 h-full max-h-full w-full max-w-full rounded-none tablet:relative tablet:h-auto tablet:max-h-[90vh] tablet:w-full tablet:max-w-container-form tablet:rounded'
            : 'fixed inset-x-0 bottom-0 rounded-b-none tablet:relative tablet:inset-auto tablet:rounded-b',
        )}
      >
        {title && (
          <div className="border-b border-stone px-md py-sm dark:border-stone-dark">
            <h2 className="font-display text-heading text-ink dark:text-paper-dark">{title}</h2>
          </div>
        )}
        <div className="px-md py-md">{children}</div>
        {footer && (
          <div className="flex justify-end gap-sm border-t border-stone px-md py-sm dark:border-stone-dark">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
