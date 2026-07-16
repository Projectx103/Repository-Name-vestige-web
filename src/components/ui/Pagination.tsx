import { Button } from './Button';
import { cn } from '@/utils/cn';

export interface NumberedPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export interface LoadMoreProps {
  onLoadMore: () => void;
  isLoading?: boolean;
  /** Hide the button entirely once there's nothing left to load. */
  hasMore?: boolean;
}

/**
 * Builds the page-number sequence with ellipsis compression (04 - Design
 * System.md §13.2 — "no ellipsis-heavy compressed treatments unless the page
 * count is large enough to require it"). Shows every page when the total is
 * small; otherwise first, last, current ±1, and ellipsis for the gaps.
 */
function buildPageSequence(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | 'ellipsis')[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push('ellipsis');
    result.push(page);
  });
  return result;
}

/**
 * Staff console table pagination (04 - Design System.md §13.1) — predictable
 * page counts matter for operational review, unlike the buyer catalog's LoadMore.
 */
export function NumberedPagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: NumberedPaginationProps) {
  const sequence = buildPageSequence(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center gap-xs">
      <Button
        variant="secondary"
        size="compact"
        disabled={disabled || currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      {sequence.map((page, i) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${i}`}
            className="px-xs text-body-sm text-ink-muted dark:text-paper-dark-muted"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            disabled={disabled}
            aria-current={page === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(page)}
            className={cn(
              'rounded px-sm py-px1 text-body-sm transition-colors duration-DEFAULT ease-standard',
              page === currentPage
                ? 'bg-ink text-paper dark:bg-paper-dark dark:text-ink-dark'
                : 'text-ink hover:opacity-hover dark:text-paper-dark',
            )}
          >
            {page}
          </button>
        ),
      )}

      <Button
        variant="secondary"
        size="compact"
        disabled={disabled || currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </nav>
  );
}

/**
 * Buyer-facing catalog pagination (§13.1/§13.2) — a plain, single action, not
 * infinite auto-scroll, which is explicitly rejected anywhere in the buyer
 * storefront. Uses the shared secondary Button style and its loading state.
 */
export function LoadMore({ onLoadMore, isLoading = false, hasMore = true }: LoadMoreProps) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center">
      <Button variant="secondary" isLoading={isLoading} onClick={onLoadMore}>
        Load More
      </Button>
    </div>
  );
}
