import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

export type ToastTone = 'success' | 'error' | 'info';

interface ActiveToast {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  /** Shows a toast, replacing whatever's currently showing — only one is ever visible at a time (04 - Design System.md §12.2). */
  showToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const AUTO_DISMISS_MS = 4000;

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-moss dark:text-moss-dark"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8l3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-error dark:text-error-dark"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M8 5v4M8 11.2v.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-ink dark:text-paper-dark"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M8 7v4.2M8 4.8v.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const toneIcon: Record<ToastTone, () => ReactElement> = {
  success: CheckIcon,
  error: AlertIcon,
  info: InfoIcon,
};

/**
 * Global Toast provider. Wrapped once in AppProviders — nothing else creates
 * a second instance. Exposes `useToast().showToast(...)` for any component,
 * anywhere in the tree, to trigger a toast without prop-drilling.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ActiveToast | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const dismiss = useCallback(() => setToast(null), []);

  const showToast = useCallback((message: string, tone: ToastTone = 'info') => {
    window.clearTimeout(timeoutRef.current);
    const id = Math.random().toString(36).slice(2);
    setToast({ id, message, tone });

    // ErrorToast persists until manually dismissed (§12.2) — no auto-dismiss timer for it.
    if (tone !== 'error') {
      timeoutRef.current = window.setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, AUTO_DISMISS_MS);
    }
  }, []);

  const Icon = toast ? toneIcon[toast.tone] : null;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div
          // Bottom-center on mobile, bottom-right on tablet/desktop (§12.2) —
          // one consistent location, never stacking in multiple corners.
          className="pointer-events-none fixed inset-x-0 bottom-md z-toast flex justify-center px-md tablet:inset-x-auto tablet:right-md tablet:justify-end"
          aria-live="polite"
        >
          {toast && Icon && (
            <div
              role={toast.tone === 'error' ? 'alert' : 'status'}
              className={cn(
                'pointer-events-auto flex max-w-container-narrow items-start gap-xs rounded bg-paper px-sm py-sm shadow-modal',
                'dark:bg-ink-dark dark:shadow-modal-dark',
              )}
            >
              <Icon />
              <p className="flex-1 text-body-sm text-ink dark:text-paper-dark">{toast.message}</p>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss notification"
                className="text-ink-muted hover:opacity-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay dark:text-paper-dark-muted"
              >
                ✕
              </button>
            </div>
          )}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
