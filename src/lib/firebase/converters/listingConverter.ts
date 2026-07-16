import type { ListingDocument } from '@vestige/shared-schemas';
import { createConverter, type WithId } from './createConverter';

/**
 * One converter for the whole document even though writes are field-scoped
 * two ways (listingCurationInputSchema vs listingPhotosUpdateSchema,
 * 11 - Security.md §5) — that split is enforced by which Cloud Function a
 * write goes through, not by having two different converters for the same
 * underlying document shape.
 */
export const listingConverter = createConverter<WithId<ListingDocument>>();
