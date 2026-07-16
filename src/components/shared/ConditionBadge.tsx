import { Badge } from '@/components/ui/Badge';

export type ConditionGrade = 'A' | 'B' | 'C';

/**
 * Maps the Firestore condition enum (08 - Firestore Schema.md §6.7 —
 * "A" | "B" | "C") to its display label. No document states this mapping as
 * an explicit table; it's inferred from the only ordering that makes sense —
 * three grades, best to worst, onto three labels, best to worst
 * (04 - Design System.md §8.1). Flagging this inference here so it's easy to
 * correct in one place if a future grading-rubric document states otherwise.
 */
const conditionLabels: Record<ConditionGrade, string> = {
  A: 'Like New',
  B: 'Gently Used',
  C: 'Visible Wear',
};

export interface ConditionBadgeProps {
  condition: ConditionGrade;
  className?: string;
}

/**
 * Thin wrapper around Badge with tone pre-selected (18 - Component Inventory.md
 * §4) — always neutral, never color-coded per grade (§8.1: avoiding
 * color-proliferation as a differentiation system).
 */
export function ConditionBadge({ condition, className }: ConditionBadgeProps) {
  return (
    <Badge tone="neutral" className={className}>
      {conditionLabels[condition]}
    </Badge>
  );
}
