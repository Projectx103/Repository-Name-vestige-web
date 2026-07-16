import { z } from 'zod';
import { centsSchema } from './common';
import type { FirestoreTimestamp } from './common';

export const conditionGradeSchema = z.enum(['A', 'B', 'C']);
export type ConditionGrade = z.infer<typeof conditionGradeSchema>;

export const listingStatusSchema = z.enum([
  'draft',
  'available',
  'reserved',
  'sold',
  'returned_pending_inspection',
  'unpublished',
]);
export type ListingStatus = z.infer<typeof listingStatusSchema>;

/** Only these exact transitions are valid (08 - Firestore Schema.md §10) — enforced by the publishListing/status-change Cloud Functions, not just this list. */
export const VALID_LISTING_STATUS_TRANSITIONS: Record<ListingStatus, ListingStatus[]> = {
  draft: ['available'],
  available: ['reserved', 'unpublished'],
  reserved: ['sold', 'available'], // 'available' = TTL release
  sold: ['returned_pending_inspection'],
  returned_pending_inspection: ['available', 'unpublished'],
  unpublished: [],
};

const measurementSchema = z.object({
  label: z.string().min(1),
  valueCm: z.number().positive(),
});

const photoSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  order: z.number().int().min(1),
});

/**
 * searchKeywords validation (08 - Firestore Schema.md §10): lowercase only,
 * no duplicates, max 30 tokens — keeps array-contains-any queries efficient.
 */
const searchKeywordsSchema = z
  .array(z.string())
  .max(30)
  .refine((tokens) => tokens.every((t) => t === t.toLowerCase()), 'searchKeywords must be lowercase')
  .refine((tokens) => new Set(tokens).size === tokens.length, 'searchKeywords must not contain duplicates');

/**
 * Curation Workbench fields — everything EXCEPT `photos`, which is a
 * separate, Photographer-only field-scoped write (11 - Security.md §3, §5).
 * A single "edit listing" form submitting both would violate that boundary,
 * so they're deliberately two schemas, matching two separate Cloud Functions.
 */
export const listingCurationInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  size: z.string().min(1),
  condition: conditionGradeSchema,
  conditionNotes: z.string(),
  measurements: z.array(measurementSchema),
  materials: z.array(z.string()),
  colorTags: z.array(z.string()),
  priceCents: centsSchema,
  originalMsrpCents: centsSchema.nullable(),
  searchKeywords: searchKeywordsSchema,
});
export type ListingCurationInput = z.infer<typeof listingCurationInputSchema>;

/** Photographer-only write (11 - Security.md §5) — 4-8 photos required only at the publish transition, not for a draft (08 - Firestore Schema.md §10). */
export const listingPhotosUpdateSchema = z.object({
  photos: z.array(photoSchema).max(8),
});
export type ListingPhotosUpdate = z.infer<typeof listingPhotosUpdateSchema>;

/** The publish-time checklist (01 - PRD.md §1.7) — checked before the draft → available transition specifically. */
export const listingPublishChecklistSchema = listingCurationInputSchema.extend({
  photos: z.array(photoSchema).min(4).max(8),
});

export interface ListingDocument {
  intakeItemId: string | null;
  title: string;
  description: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryPath: string[];
  size: string;
  condition: ConditionGrade;
  conditionNotes: string;
  measurements: z.infer<typeof measurementSchema>[];
  materials: string[];
  colorTags: string[];
  priceCents: number;
  originalMsrpCents: number | null;
  status: ListingStatus;
  reservedUntil: FirestoreTimestamp | null;
  reservedByCartId: string | null;
  photos: z.infer<typeof photoSchema>[];
  isFeatured: boolean;
  markdownScheduleApplied: boolean;
  searchKeywords: string[];
  curatedByUid: string;
  publishedAt: FirestoreTimestamp | null;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}
