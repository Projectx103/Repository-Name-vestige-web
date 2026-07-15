/**
 * Cloud Functions entry point. No functions are exported yet — the auth,
 * checkout, curation, procurement, orders, media, roles, and scheduled
 * function groups (per 10 - Folder Structure.md §2's functions/src tree) are
 * each built alongside the milestone that needs them (M3+), never ahead of
 * schedule with placeholder business logic.
 *
 * functions/ never imports from src/ (the frontend) — the only shared code
 * is @vestige/shared-schemas, per 10 - Folder Structure.md §19.1.
 */
export {};
