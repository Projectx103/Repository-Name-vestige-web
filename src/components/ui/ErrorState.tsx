import type { ReactNode } from 'react';
import { Button } from './Button';

export type ErrorStateVariant = 'inline' | 'section' | 'page';

export interface ErrorStateProps {
  variant?: ErrorStateVariant;
  /** Plain, specific message — never a vague "Something went wrong" alone (04 - Design System.md §18.2). */
  message: string;
  /** 'section' only — a secondary "Retry" button, per §18.1. */
  onRetry?: () => void;
  /** 'page' only — the required way back into the product (§18.2: "never dead-ends the buyer"). */
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  /** Field id this error belongs to — 'inline' only, for aria-describedby wiring from the field itself. */
  id?: string;
  icon?: ReactNode;
}

/**
 * Single ErrorState primitive covering InlineFieldError/SectionError/PageError
 * (04 - Design System.md §18.1) — text is always present regardless of
 * variant (§18.2/§20: "never relies on color alone").
 */
export function ErrorState({
  variant = 'section',
  message,
  onRetry,
  primaryActionLabel,
  onPrimaryAction,
  id,
  icon,
}: ErrorStateProps) {
  if (variant === 'inline') {
    return (
      <p id={id} role="alert" className="mt-px1 text-body-sm text-error dark:text-error-dark">
        {message}
      </p>
    );
  }

  if (variant === 'page') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-sm px-md text-center">
        {icon}
        <p className="max-w-container-narrow text-body-md text-ink dark:text-paper-dark">
          {message}
        </p>
        {primaryActionLabel && onPrimaryAction && (
          <Button variant="primary" onClick={onPrimaryAction}>
            {primaryActionLabel}
          </Button>
        )}
      </div>
    );
  }

  // 'section' — doesn't break the rest of the page around it.
  return (
    <div className="flex flex-col items-center gap-xs rounded border border-stone px-md py-sm text-center dark:border-stone-dark">
      <p className="text-body-sm text-ink-muted dark:text-paper-dark-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="compact" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
