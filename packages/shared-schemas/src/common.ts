import { z } from 'zod';

/**
 * Structural (duck-typed) Timestamp interface — deliberately NOT importing
 * `firebase/firestore`'s Timestamp or `firebase-admin`'s Timestamp, since
 * this package is shared between the frontend (client SDK) and Cloud
 * Functions (admin SDK), which have distinct Timestamp classes. Both satisfy
 * this shape structurally, so a document interface can reference this
 * without coupling shared-schemas to either SDK (08 - Firestore Schema.md §3
 * — "always the native Timestamp type," enforced by each side's own SDK, not
 * re-validated here).
 */
export interface FirestoreTimestamp {
  toDate(): Date;
  toMillis(): number;
  seconds: number;
  nanoseconds: number;
}

/**
 * Money is always integer cents, never a float (08 - Firestore Schema.md §10
 * validation rules — "never accepted as a float; a fractional value is
 * rejected outright, not rounded silently").
 */
export const centsSchema = z.number().int().min(0);

/** ISO 3166-1 alpha-2 country code (08 - Firestore Schema.md §10). */
export const countryCodeSchema = z.string().length(2).toUpperCase();
