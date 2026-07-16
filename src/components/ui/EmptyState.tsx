import type { ReactNode } from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Small, restrained line illustration slot (04 - Design System.md §17.1) — never a large decorative illustration or mascot. Omit entirely in staff console contexts (§17.2 — "no illustration needed... more utilitarian tone"). */
  icon?: ReactNode;
}

/**
 * Single EmptyState primitive (18 - Component Inventory.md §3 — no named
 * sub-variants; every instance in §17.2's table is just a different message +
 * optional action passed into this one component).
 */
export function EmptyState({ message, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-sm px-md py-lg text-center">
      {icon && <div className="text-ink-muted dark:text-paper-dark-muted">{icon}</div>}
      {/* Plain language only (§17.1) — never humor/apology-heavy copy ("Oops!"). */}
      <p className="max-w-container-narrow text-body-md text-ink-muted dark:text-paper-dark-muted">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
