import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

/**
 * `tone` is the generic mechanism behind all three named badge use cases
 * (04 - Design System.md §8.1):
 *  - `neutral` — `ConditionBadge` always; `StatusBadge`'s default pipeline
 *    stages; `AvailabilityBadge`'s "Sold" state (deliberately quiet, not alarming).
 *  - `success` — `StatusBadge`'s "Complete/Published" state; `AvailabilityBadge`'s "Available" state.
 *  - `error` — `StatusBadge`'s "Rejected"/blocked state only.
 *
 * `ConditionBadge` and `AvailabilityBadge` (Sprint 6, components/shared) are
 * thin named wrappers around this primitive with their tone pre-selected —
 * they don't reimplement this styling.
 */
export type BadgeTone = 'neutral' | 'success' | 'error';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

const toneTextClasses: Record<BadgeTone, string> = {
  neutral: 'text-ink dark:text-paper-dark',
  success: 'text-moss dark:text-moss-dark',
  error: 'text-error dark:text-error-dark',
};

/**
 * Generic Badge primitive. Text-led, never icon-led (§8.2) — this component
 * intentionally has no icon slot; a consumer needing a small secondary icon
 * places it in `children` alongside the label rather than the component
 * growing an `icon` prop that could encourage icon-only badges.
 *
 * Never uses `color.clay` (§8.2) — only `toneTextClasses` above are permitted
 * as text colors here; do not add a clay-toned option to this table.
 */
export function Badge({ tone = 'neutral', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        // radius.tight, never radius.full/pill (§8.2) — a slightly rounded
        // rectangle, not a capsule.
        'inline-flex items-center rounded-tight bg-stone px-xs py-px1 text-label uppercase dark:bg-stone-dark',
        toneTextClasses[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
