import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

export interface SummaryCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Built from Card (18 - Component Inventory.md §4) — account/dashboard
 * summaries (order summary line, wishlist item, address card). Deliberately
 * generic: title + arbitrary content + optional trailing action, since the
 * documented use cases vary in what they actually display.
 */
export function SummaryCard({ title, children, action, className }: SummaryCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between gap-sm">
        <div className="flex-1 space-y-px1">
          <h3 className="font-body text-body-sm font-medium text-ink dark:text-paper-dark">
            {title}
          </h3>
          <div className="text-body-sm text-ink-muted dark:text-paper-dark-muted">{children}</div>
        </div>
        {action}
      </div>
    </Card>
  );
}
