/**
 * Zod schemas and document types shared between the frontend (src/types) and
 * Cloud Functions (functions/src), per 10 - Folder Structure.md §2 — the
 * mechanism behind the Constitution's single-source-of-truth-for-a-data-shape
 * rule. Every collection in 08 - Firestore Schema.md §6 has a corresponding
 * file here.
 */
export * from './common';
export * from './users';
export * from './addresses';
export * from './brands';
export * from './categories';
export * from './procurement';
export * from './listings';
export * from './carts';
export * from './wishlists';
export * from './orders';
export * from './roleGrants';
export * from './config';
export * from './statusHistory';
