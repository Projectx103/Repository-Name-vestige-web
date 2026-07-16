import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes, Ref } from 'react';
import { cn } from '@/utils/cn';

export type InputVariant = 'text' | 'textarea' | 'number' | 'checkbox' | 'radio' | 'search';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  /** Visible label — always rendered above the field for text/number/search/
   * textarea (04 - Design System.md §5.1: "never relying on placeholder-only
   * labeling"), or beside the control for checkbox/radio (standard convention
   * for those two, not a documented exception — just how a checkbox/radio row reads). */
  label?: string;
  /** A short plain-language message. Presence alone drives the error visual
   * state — never color alone (§20 accessibility requirement). */
  error?: string;
  /** Only meaningful when variant="textarea". */
  rows?: number;
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 text-ink-muted dark:text-paper-dark-muted"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 18l-4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Shared field styling — every text-like variant (text/number/search/textarea)
// uses exactly this box treatment (04 - Design System.md §6.3: "consistent
// height and padding across every input type"). Checkbox/radio are visually
// distinct native controls and don't use this at all.
const fieldBaseClasses = cn(
  'w-full rounded border border-stone bg-paper px-sm py-xs font-body text-body-md text-ink',
  'placeholder:text-ink-muted transition-colors duration-DEFAULT ease-standard',
  'focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay',
  'disabled:cursor-not-allowed disabled:opacity-disabled',
  'dark:border-stone-dark dark:bg-ink-dark dark:text-paper-dark dark:placeholder:text-paper-dark-muted',
);

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(function Input(
  { variant = 'text', label, error, rows = 3, className, id, disabled, ...rest },
  ref,
) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const errorId = error ? `${fieldId}-error` : undefined;

  // Checkbox / Radio: label sits beside the control, not above it — a
  // fundamentally different layout from every other variant.
  if (variant === 'checkbox' || variant === 'radio') {
    return (
      <div className={className}>
        <label htmlFor={fieldId} className="flex cursor-pointer items-center gap-xs">
          <input
            ref={ref as Ref<HTMLInputElement>}
            id={fieldId}
            type={variant}
            disabled={disabled}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={errorId}
            className={cn(
              'h-4 w-4 border-stone text-ink accent-ink focus:outline-none focus:ring-1 focus:ring-clay',
              variant === 'checkbox' ? 'rounded-tight' : 'rounded-full',
              disabled && 'cursor-not-allowed opacity-disabled',
              error && 'border-error',
              'dark:border-stone-dark dark:accent-paper-dark',
            )}
            {...rest}
          />
          {label && <span className="text-body-md text-ink dark:text-paper-dark">{label}</span>}
        </label>
        {error && (
          <p id={errorId} className="mt-px1 text-body-sm text-error dark:text-error-dark">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={fieldId}
          className="mb-px1 block text-body-sm font-medium text-ink dark:text-paper-dark"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {variant === 'search' && (
          <span className="pointer-events-none absolute left-sm top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
        )}
        {variant === 'textarea' ? (
          <textarea
            ref={ref as Ref<HTMLTextAreaElement>}
            id={fieldId}
            rows={rows}
            disabled={disabled}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={errorId}
            className={cn(
              fieldBaseClasses,
              error && 'border-error focus:border-error focus:ring-error',
            )}
            // Textarea and input attribute sets overlap almost entirely (value,
            // onChange, placeholder, name, etc.) — the few that don't (type)
            // are simply ignored by the DOM, so sharing `rest` here is safe.
            {...(rest as unknown as ReactHTMLTextareaAttributes)}
          />
        ) : (
          <input
            ref={ref as Ref<HTMLInputElement>}
            id={fieldId}
            type={variant === 'search' ? 'search' : variant === 'number' ? 'number' : 'text'}
            disabled={disabled}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={errorId}
            className={cn(
              fieldBaseClasses,
              variant === 'search' && 'pl-xl',
              error && 'border-error focus:border-error focus:ring-error',
            )}
            {...rest}
          />
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-px1 text-body-sm text-error dark:text-error-dark">
          {error}
        </p>
      )}
    </div>
  );
});

// Narrow local type alias — avoids importing TextareaHTMLAttributes just for
// this one internal cast, since the public InputProps intentionally exposes
// only the InputHTMLAttributes surface (the overlap covers every prop this
// component actually needs to forward to a textarea).
type ReactHTMLTextareaAttributes = TextareaHTMLAttributes<HTMLTextAreaElement>;
