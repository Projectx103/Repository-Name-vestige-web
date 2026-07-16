import { useState } from 'react';
import { cloudinaryConfig, getPresetTransform, type CloudinaryPreset } from '@/lib/cloudinary';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';
import { cn } from '@/utils/cn';

export interface CloudinaryImageProps {
  publicId: string;
  preset: CloudinaryPreset;
  alt: string;
  /**
   * Above-the-fold images (catalog first row, PDP primary image, hero) load
   * eagerly; everything else lazy-loads natively (09 - Cloudinary Strategy.md
   * §8). Defaults to lazy since that's the correct choice for most usages.
   */
  eager?: boolean;
  className?: string;
}

/**
 * Wraps f_auto,q_auto delivery, named transformation presets, lazy loading,
 * a loading skeleton, and a broken-image fallback (18 - Component Inventory.md
 * §4). This is the *only* way an image is ever rendered in this product —
 * no raw <img src="..."> against a Cloudinary URL anywhere else in the codebase.
 */
export function CloudinaryImage({
  publicId,
  preset,
  alt,
  eager = false,
  className,
}: CloudinaryImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  // Cloudinary isn't configured until M4 (14 - Development Roadmap.md) — this
  // is expected right now, not a bug, so it gets its own clear message rather
  // than being lumped in with a genuine broken-image error.
  if (!cloudinaryConfig.cloudName) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex items-center justify-center bg-stone text-body-sm text-ink-muted dark:bg-stone-dark dark:text-paper-dark-muted',
          className,
        )}
      >
        Cloudinary not configured yet
      </div>
    );
  }

  const src = `${cloudinaryConfig.baseDeliveryUrl}/image/upload/${getPresetTransform(preset)}/${publicId}`;

  if (status === 'error') {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex items-center justify-center bg-stone text-body-sm text-ink-muted dark:bg-stone-dark dark:text-paper-dark-muted',
          className,
        )}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {status === 'loading' && <SkeletonBlock className="absolute inset-0 h-full w-full" />}
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={cn('h-full w-full object-cover', status === 'loading' && 'opacity-0')}
      />
    </div>
  );
}
