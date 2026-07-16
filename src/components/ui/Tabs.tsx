import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

/**
 * Single Tabs primitive covering PageTabs/ConsoleTabs (04 - Design System.md
 * §14.1) — identical mechanics, differing only in usage context, same
 * reasoning as Badge/Chip/Dropdown. Text-led only — no icon-only tabs (§14.2).
 *
 * URL-reflection of the active tab (§14.2, for buyer account pages) is the
 * *consuming* feature's responsibility (deriving `activeId` from a route
 * param) — this primitive only needs to know the current id, not how it got there.
 */
export function Tabs({ tabs, activeId, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn('flex gap-lg border-b border-stone dark:border-stone-dark', className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative -mb-px border-b-2 py-sm font-body text-body-md transition-colors duration-DEFAULT ease-standard',
              // Underline indicator in color.ink, never color.clay (§14.2 — clay is reserved for actions).
              isActive
                ? 'border-ink text-ink dark:border-paper-dark dark:text-paper-dark'
                : 'border-transparent text-ink-muted hover:text-ink dark:text-paper-dark-muted dark:hover:text-paper-dark',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
