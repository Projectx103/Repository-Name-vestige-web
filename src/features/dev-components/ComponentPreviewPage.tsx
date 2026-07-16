import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Chip } from '@/components/ui/Chip';
import { useTheme } from '@/contexts';

/**
 * Internal-only component preview — deliberately living in `features/` despite
 * not being a real feature, so it's obvious this is a Sprint 2 exception, not
 * a precedent for putting infrastructure inside `features/`. Never linked from
 * real navigation; reachable only by visiting /dev/components directly.
 *
 * Every variant/state from 04 - Design System.md §21 for the components built
 * so far (Button, Card, Badge) is rendered here, in both light and dark mode
 * (toggle below), so M1's acceptance criteria (§22) can be checked visually
 * without needing a real screen built yet.
 */
export function ComponentPreviewPage() {
  const { theme, toggleTheme } = useTheme();
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [chipSelected, setChipSelected] = useState(false);
  const [chips, setChips] = useState(['Size: M', 'Under ₱1,000']);

  return (
    <div className="min-h-screen bg-paper px-md py-lg dark:bg-ink-dark">
      <div className="mx-auto max-w-container-full space-y-xl">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-heading text-ink dark:text-paper-dark">
            Component Preview — Sprint 2
          </h1>
          <Button variant="secondary" onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'dark' : 'light'} mode
          </Button>
        </header>

        {/* Button */}
        <section className="space-y-sm">
          <h2 className="font-display text-body-lg text-ink dark:text-paper-dark">Button</h2>
          <div className="flex flex-wrap items-center gap-sm">
            <Button variant="primary">Primary default</Button>
            <Button variant="secondary">Secondary default</Button>
            <Button variant="primary" size="compact">
              Primary compact
            </Button>
            <Button variant="secondary" size="compact">
              Secondary compact
            </Button>
            <Button variant="primary" disabled>
              Primary disabled
            </Button>
            <Button variant="secondary" disabled>
              Secondary disabled
            </Button>
            <Button
              variant="primary"
              isLoading={isLoadingDemo}
              onClick={() => setIsLoadingDemo((v) => !v)}
            >
              {isLoadingDemo ? 'Loading' : 'Toggle loading'}
            </Button>
          </div>
        </section>

        {/* Card */}
        <section className="space-y-sm">
          <h2 className="font-display text-body-lg text-ink dark:text-paper-dark">Card</h2>
          <div className="flex flex-wrap gap-sm">
            <Card>
              <p className="text-body-md text-ink dark:text-paper-dark">Default card</p>
            </Card>
            <Card interactive>
              <p className="text-body-md text-ink dark:text-paper-dark">
                Interactive card (hover me)
              </p>
            </Card>
            <Card padding="sm">
              <p className="text-body-md text-ink dark:text-paper-dark">Small padding</p>
            </Card>
            <Card padding="none">
              <p className="p-xs text-body-md text-ink dark:text-paper-dark">No padding</p>
            </Card>
          </div>
        </section>

        {/* Badge */}
        <section className="space-y-sm">
          <h2 className="font-display text-body-lg text-ink dark:text-paper-dark">Badge</h2>
          <div className="flex flex-wrap items-center gap-sm">
            <Badge tone="neutral">Like New</Badge>
            <Badge tone="neutral">Gently Used</Badge>
            <Badge tone="neutral">Visible Wear</Badge>
            <Badge tone="neutral">In Review</Badge>
            <Badge tone="success">Ready to Publish</Badge>
            <Badge tone="error">Rejected</Badge>
            <Badge tone="success">Available</Badge>
            <Badge tone="neutral">Sold</Badge>
          </div>
        </section>

        {/* Input */}
        <section className="max-w-container-form space-y-sm">
          <h2 className="font-display text-body-lg text-ink dark:text-paper-dark">Input</h2>
          <Input variant="text" label="Full name" placeholder="Jane Dela Cruz" />
          <Input variant="search" placeholder="Search the shop" />
          <Input variant="number" label="Price" placeholder="0.00" />
          <Input
            variant="textarea"
            label="Condition notes"
            placeholder="Describe visible wear..."
          />
          <Input variant="checkbox" label="I agree to the terms" />
          <Input variant="radio" label="Ship to my address" name="shipping-demo" />
          <Input
            variant="text"
            label="Email"
            error="Enter a valid email address"
            defaultValue="not-an-email"
          />
          <Input variant="text" label="Disabled field" disabled defaultValue="Can't edit this" />
        </section>

        {/* Chip */}
        <section className="space-y-sm">
          <h2 className="font-display text-body-lg text-ink dark:text-paper-dark">Chip</h2>
          <div className="flex flex-wrap items-center gap-sm">
            {chips.map((label) => (
              <Chip key={label} onRemove={() => setChips((c) => c.filter((x) => x !== label))}>
                {label}
              </Chip>
            ))}
            <Chip selected={chipSelected} onClick={() => setChipSelected((s) => !s)}>
              Toggle selected
            </Chip>
          </div>
        </section>
      </div>
    </div>
  );
}
