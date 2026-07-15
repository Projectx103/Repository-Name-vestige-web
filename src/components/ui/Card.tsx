import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type CardPadding = 'none' | 'sm' | 'md';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Defaults to `space.md` — the documented default internal padding (04 - Design System.md §4.2). */
  padding?: CardPadding;
  /**
   * Enables the hover state (subtle shadow shift) for cards that are
   * themselves clickable/interactive (§4.3). Leave false for a card that's
   * merely a static container — most `SummaryCard`/form-section usages.
   */
  interactive?: boolean;
  children: ReactNode;
}

const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-sm',
  md: 'p-md',
};

/**
 * Base Card primitive. Per 18 - Component Inventory.md §3, this is never used
 * directly on a screen — `ProductCard`, `SummaryCard`, and `WorkbenchCard`
 * (built in Sprint 6 as composites in components/shared and features/admin-*)
 * all render through this component rather than duplicating its container styles.
 *
 * Elevation choice: a soft shadow, never combined with a border (§4.2/§1.5 —
 * "never both together"). If a specific composite later needs a bordered
 * treatment instead of a shadow, that's a variant added to this component,
 * not a one-off style on the composite.
 */
export function Card({
  padding = 'md',
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded bg-paper shadow-card dark:bg-ink-dark dark:shadow-card-dark',
        paddingClasses[padding],
        interactive &&
          'transition-shadow duration-DEFAULT ease-standard hover:shadow-modal dark:hover:shadow-modal-dark',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
