/**
 * Zod schemas shared between the frontend (src/types) and Cloud Functions
 * (functions/src), per 10 - Folder Structure.md §2 — "the mechanism behind the
 * Constitution's single-source-of-truth-for-a-data-shape rule."
 *
 * Intentionally empty in Sprint 1: schemas are added starting in M2, once
 * 08 - Firestore Schema.md's collections are implemented. This file exists so
 * the workspace package resolves correctly (@vestige/shared-schemas) from both
 * consumers ahead of that work.
 */
export {};
