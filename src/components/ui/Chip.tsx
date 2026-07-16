import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface ChipProps {
  /**
   * `FilterChip` and `SelectionChip` (04 - Design System.md §9.1) share one
   * identical visual/behavioral spec (§9.2/§9.3) — they differ only in where
   * they're used (catalog filters vs. form multi-select), not in how this
   * component renders. So there's no `variant` prop here, same reasoning as Badge's `tone`.
   */
  selected?: boolean;
  /** Present → renders a keyboard-operable trailing "×". Absent → chip isn't removable. */
  onRemove?: () => void;
  /** Present → the chip label itself is a toggle button (selection use case). */
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

function RemoveIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Chip primitive. Uses `rounded` (borderRadius.DEFAULT, 8px) rather than a
 * full pill — §9 doesn't document a distinct chip radius, and the rest of
 * the system deliberately avoids capsule shapes outside the one reserved,
 * currently-unused `radius.full` case (see tailwind.config.ts), so a chip
 * stays visually consistent with Button/Card rather than introducing a new
 * silhouette.
 */
export function Chip({ selected = false, onRemove, onClick, children, className }: ChipProps) {
  const labelClasses = cn('text-body-sm', onClick && 'cursor-pointer');

  return (
    <span
      className={cn(
        'inline-flex items-center gap-xs rounded border px-sm py-px1',
        'transition-colors duration-DEFAULT ease-standard',
        selected
          ? 'border-ink bg-ink text-paper dark:border-paper-dark dark:bg-paper-dark dark:text-ink-dark'
          : 'border-stone bg-transparent text-ink hover:opacity-hover dark:border-stone-dark dark:text-paper-dark',
        className,
      )}
    >
      {onClick ? (
        <button type="button" onClick={onClick} className={labelClasses} aria-pressed={selected}>
          {children}
        </button>
      ) : (
        <span className={labelClasses}>{children}</span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${typeof children === 'string' ? children : 'filter'}`}
          className={cn(
            'rounded-tight p-px1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay',
            'hover:opacity-hover',
          )}
        >
          <RemoveIcon />
        </button>
      )}
    </span>
  );
}
