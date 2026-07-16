import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface AccordionItemProps {
  title: string;
  children: ReactNode;
  /** Multiple sections may be open simultaneously by default (04 - Design
   * System.md §15.2) — each item manages its own open state independently;
   * there's no shared "only one open" behavior unless a consuming feature
   * chooses to enforce it itself (e.g. by conditionally unmounting siblings). */
  defaultOpen?: boolean;
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
 * Single collapsible section — covers both FAQAccordion and DetailAccordion
 * (04 - Design System.md §15.1); a consuming feature renders a list of these
 * for either use case. Clicking anywhere in the header row toggles it, not
 * just the chevron (§15.2).
 */
export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('border-b border-stone dark:border-stone-dark', className)}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-sm py-sm text-left font-body text-body-md text-ink dark:text-paper-dark"
      >
        <span>{title}</span>
        <ChevronIcon open={isOpen} />
      </button>
      {/* Height animates smoothly (§15.2/§19) via grid-template-rows trick —
         avoids needing a JS-measured height for a simple, understated transition. */}
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-DEFAULT ease-standard',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-sm text-body-md text-ink-muted dark:text-paper-dark-muted">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
