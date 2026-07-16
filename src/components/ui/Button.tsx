import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { InlineSpinner } from './InlineSpinner';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'default' | 'compact';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Exactly two variants exist — no `tertiary`/`ghost`/`danger` variant
   * (04 - Design System.md §3.1). A destructive action uses `secondary` with
   * `color.error`-toned text via `className`, not a third variant.
   */
  variant?: ButtonVariant;
  /** `compact` is reserved for dense staff-console contexts only (§3.2) — never used in the buyer storefront. */
  size?: ButtonSize;
  /**
   * Shows an inline spinner in place of the label and disables the button,
   * preventing duplicate submission, without changing the button's size
   * (§3.3 — "the button remains the same size, no layout shift").
   */
  isLoading?: boolean;
  children: ReactNode;
}

/**
 * The sole Button primitive for the entire product. Every button anywhere —
 * buyer storefront or staff console — renders through this component with
 * one of its two variants (04 - Design System.md §3, 00 - Project
 * Constitution.md's button-system discipline).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'default',
    isLoading = false,
    disabled,
    className,
    children,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={cn(
        // Base: shared across both variants — body typeface, radius.default,
        // understated 200ms transition (§19 — no bounce/spring easing anywhere).
        'inline-flex items-center justify-center gap-xs whitespace-nowrap rounded font-body font-medium',
        'transition-colors duration-DEFAULT ease-standard',
        // Visible clay focus ring, always present — never removed (§3.3 Focus).
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-ink-dark',

        size === 'default' && 'px-md py-xs text-body-md',
        size === 'compact' && 'px-sm py-px1 text-body-sm',

        variant === 'primary' && [
          'bg-ink text-paper hover:opacity-hover',
          'dark:bg-paper-dark dark:text-ink-dark',
        ],
        variant === 'secondary' && [
          'border border-ink bg-transparent text-ink hover:opacity-hover',
          'dark:border-paper-dark dark:text-paper-dark',
        ],

        // Disabled: reduced opacity, stone-toned, pointer-events off (§3.3) —
        // applies to genuine `disabled`, not the `isLoading` case, which keeps
        // full opacity so the spinner reads clearly.
        disabled && !isLoading && 'pointer-events-none opacity-disabled',
        isLoading && 'cursor-wait',

        className,
      )}
      {...rest}
    >
      {isLoading && <InlineSpinner className="h-4 w-4" />}
      {children}
    </button>
  );
});
