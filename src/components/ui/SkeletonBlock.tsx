import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export type SkeletonBlockProps = HTMLAttributes<HTMLDivElement>;

/**
 * A subtle, softly-pulsing placeholder shape (04 - Design System.md §16.2) —
 * sized via `className` (e.g. `h-64 w-full` for an image block, `h-4 w-3/4`
 * for a text line) to match the eventual content's real dimensions and avoid
 * a layout shift when it arrives (§16.3).
 *
 * Uses Tailwind's built-in `animate-pulse` — a slow pulse, never a fast
 * shimmer that reads as urgent (§16.1, §19).
 */
export function SkeletonBlock({ className, ...rest }: SkeletonBlockProps) {
  return (
    <div className={cn('animate-pulse rounded bg-stone dark:bg-stone-dark', className)} {...rest} />
  );
}
