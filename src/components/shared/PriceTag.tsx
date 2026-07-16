import { formatCents } from '@/utils/money';
import { cn } from '@/utils/cn';

export interface PriceTagProps {
  priceCents: number;
  /** Present + greater than priceCents → shows a struck-through original price beside the current one. This is the ONLY sanctioned way a discount is shown anywhere (18 - Component Inventory.md §4 — no separate "Discount Badge" exists). */
  originalMsrpCents?: number | null;
  className?: string;
}

/**
 * Plain text elements only, no component dependency beyond typography tokens
 * (16 - UI Implementation Roadmap.md §6). The current price uses color.clay
 * per Design Tokens' "price highlight" role for that token.
 */
export function PriceTag({ priceCents, originalMsrpCents, className }: PriceTagProps) {
  const hasMarkdown = Boolean(originalMsrpCents && originalMsrpCents > priceCents);

  return (
    <span className={cn('inline-flex items-baseline gap-xs', className)}>
      <span className="font-body text-body-md font-medium text-clay-text dark:text-clay-dark-text">
        {formatCents(priceCents)}
      </span>
      {hasMarkdown && (
        <span className="text-body-sm text-ink-muted line-through dark:text-paper-dark-muted">
          {formatCents(originalMsrpCents as number)}
        </span>
      )}
    </span>
  );
}
