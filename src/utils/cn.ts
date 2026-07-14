import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class lists, resolving conflicting utility classes
 * (e.g. `p-2` vs `p-4`) in favor of the later one, and dropping falsy values.
 * Used throughout components/ui and components/shared for conditional styling
 * (15 - Coding Standards & AI Development Rules.md §7 — Tailwind utility classes only).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
