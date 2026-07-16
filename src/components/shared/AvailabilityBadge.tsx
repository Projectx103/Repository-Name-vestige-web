import { Badge } from '@/components/ui/Badge';

export type AvailabilityStatus = 'available' | 'sold';

export interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
  className?: string;
}

/**
 * Thin wrapper around Badge (18 - Component Inventory.md §4). "Sold" is
 * deliberately neutral/quiet, not alarming (04 - Design System.md §8.1) — it
 * uses `tone="neutral"`, not `tone="error"`.
 *
 * Live-updating via onSnapshot (§4 — "live-updating via onSnapshot") is the
 * consuming feature's responsibility (wiring a Firestore listener and passing
 * the resulting status down) — this component only renders whatever status
 * it's given, same reasoning as Tabs' URL-reflection note. It should also be
 * announced via an appropriate live region when it changes in place (04 -
 * Design System.md §20); that live-region wrapping happens where this
 * component is used in a real-time context, not inside this presentational component.
 */
export function AvailabilityBadge({ status, className }: AvailabilityBadgeProps) {
  return (
    <Badge tone={status === 'available' ? 'success' : 'neutral'} className={className}>
      {status === 'available' ? 'Available' : 'Sold'}
    </Badge>
  );
}
