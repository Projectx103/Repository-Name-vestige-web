import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface DropdownOption {
  value: string;
  label: string;
  /** ActionMenu only — item renders in color.error text (04 - Design System.md §10.2). */
  destructive?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  /** Currently selected value — shown on the closed trigger. Omit for ActionMenu (§10.2: a value-selector must show its value; an action menu has none). */
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Overrides the trigger's visible content — used by ActionMenu (e.g. "Actions"), where there's no "current value" to show. */
  triggerLabel?: ReactNode;
  className?: string;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={cn(
        'h-4 w-4 shrink-0 text-ink-muted transition-transform duration-DEFAULT ease-standard dark:text-paper-dark-muted',
        open && 'rotate-180',
      )}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Single Dropdown primitive covering SelectDropdown/FilterDropdown/SortDropdown/
 * ActionMenu (04 - Design System.md §10.1) — they share identical open/close
 * mechanics and only differ in what `value`/`triggerLabel`/`destructive` are
 * used for, same reasoning as Badge's `tone` and Chip's lack of a `variant` prop.
 */
export function Dropdown({
  options,
  value,
  onSelect,
  placeholder = 'Select...',
  disabled = false,
  triggerLabel,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const selectedOption = options.find((o) => o.value === value);

  // Click-outside to close (§10.3 — dismissible via click-outside, Escape, or re-clicking the trigger)
  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  // Escape to close, returning focus to the trigger
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          'flex w-full items-center justify-between gap-xs rounded border border-stone bg-paper px-sm py-xs font-body text-body-md text-ink',
          'transition-colors duration-DEFAULT ease-standard',
          'focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay',
          'disabled:cursor-not-allowed disabled:opacity-disabled',
          'dark:border-stone-dark dark:bg-ink-dark dark:text-paper-dark',
        )}
      >
        {/* §10.2: the current/selected value is always visible on the closed
           trigger — triggerLabel only overrides this for ActionMenu, which has
           no value to show in the first place. */}
        <span
          className={cn(
            !selectedOption && !triggerLabel && 'text-ink-muted dark:text-paper-dark-muted',
          )}
        >
          {triggerLabel || selectedOption?.label || placeholder}
        </span>
        <ChevronIcon open={isOpen} />
      </button>

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          className={cn(
            'absolute z-dropdown mt-px1 min-w-full overflow-hidden rounded border border-stone bg-paper shadow-dropdown',
            'dark:border-stone-dark dark:bg-ink-dark dark:shadow-dropdown-dark',
          )}
        >
          {options.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className={cn(
                  'block w-full whitespace-nowrap px-sm py-sm text-left font-body text-body-md',
                  option.destructive
                    ? 'text-error hover:opacity-hover dark:text-error-dark'
                    : 'text-ink hover:opacity-hover dark:text-paper-dark',
                  option.value === value && 'bg-stone dark:bg-stone-dark',
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
