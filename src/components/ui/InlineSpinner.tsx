import { cn } from '@/utils/cn';

export interface InlineSpinnerProps {
  className?: string;
}

/**
 * Small, contained loading indicator (04 - Design System.md §16.2) — never
 * full-page (that's PageLoader). This is the formalized version of the
 * private spinner Button.tsx originally implemented inline; Button now
 * imports this instead (planned refactor noted in that file since Sprint 2).
 */
export function InlineSpinner({ className }: InlineSpinnerProps) {
  return (
    <svg
      className={cn('animate-spin', className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path
        className="opacity-85"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V1.5A10.5 10.5 0 0 0 1.5 12H4Z"
      />
    </svg>
  );
}
