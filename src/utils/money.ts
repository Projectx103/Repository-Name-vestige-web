/**
 * Formats integer cents (15 - Coding Standards & AI Development Rules.md —
 * money is always an integer cents field, never a float) as a display string.
 * Every price shown anywhere in the product goes through this — no ad hoc
 * `.toFixed(2)` calls scattered through components.
 */
export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
