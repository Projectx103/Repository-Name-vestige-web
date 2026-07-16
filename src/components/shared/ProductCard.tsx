import { Card } from '@/components/ui/Card';
import { CloudinaryImage } from './CloudinaryImage';
import { PriceTag } from './PriceTag';
import { cn } from '@/utils/cn';

export type ProductCardSize = 'compact' | 'default' | 'featured';

export interface ProductCardProps {
  title: string;
  brandName: string;
  priceCents: number;
  originalMsrpCents?: number | null;
  imagePublicId: string;
  isSold?: boolean;
  size?: ProductCardSize;
  /** Above-the-fold cards (first catalog row, Homepage featured) load their image eagerly (09 - Cloudinary Strategy.md §8). */
  eagerImage?: boolean;
  className?: string;
}

const sizeGapClasses: Record<ProductCardSize, string> = {
  compact: 'gap-px1',
  default: 'gap-xs',
  featured: 'gap-sm',
};

/**
 * Built from Card, CloudinaryImage, PriceTag (18 - Component Inventory.md §4).
 * Fixed 4:5 aspect ratio, no crop beyond what the `card_600` Cloudinary
 * preset itself performs — never re-cropped again at the component level
 * (04 - Design System.md §4, 09 - Cloudinary Strategy.md §10).
 *
 * Size variants are layout-density changes only (gap/text-size), never a
 * different aspect ratio or a cropping change (16 - UI Implementation
 * Roadmap.md §6).
 *
 * No routing/navigation is built in — a consuming feature wraps this in a
 * <Link> (react-router-dom), since the catalog/PDP route shapes aren't
 * finalized yet (that's M5/M6's scope, not M1's).
 */
export function ProductCard({
  title,
  brandName,
  priceCents,
  originalMsrpCents,
  imagePublicId,
  isSold = false,
  size = 'default',
  eagerImage = false,
  className,
}: ProductCardProps) {
  return (
    <Card padding="none" interactive={!isSold} className={cn('overflow-hidden', className)}>
      <div className="relative">
        <CloudinaryImage
          publicId={imagePublicId}
          preset="card_600"
          alt={`${brandName} — ${title}`}
          eager={eagerImage}
          className={cn('aspect-[4/5] w-full', isSold && 'grayscale')}
        />
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper/60 dark:bg-ink-dark/60">
            <span className="rounded bg-paper px-sm py-px1 text-body-sm text-ink dark:bg-ink-dark dark:text-paper-dark">
              Sold
            </span>
          </div>
        )}
      </div>
      <div className={cn('flex flex-col p-sm', sizeGapClasses[size])}>
        {/* Brand: plain small-caps letter-spaced text, never a "Brand Badge" (18 - Component Inventory.md §5). */}
        <span className="text-label uppercase text-ink-muted dark:text-paper-dark-muted">
          {brandName}
        </span>
        <span className="text-body-md text-ink dark:text-paper-dark">{title}</span>
        <PriceTag priceCents={priceCents} originalMsrpCents={originalMsrpCents} />
      </div>
    </Card>
  );
}
