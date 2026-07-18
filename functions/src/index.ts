/**
 * Cloud Functions entry point. Only auth/role functions exist so far — the
 * checkout, curation, procurement, orders, media, and scheduled function
 * groups (per 10 - Folder Structure.md §2's functions/src tree) are each
 * built alongside the milestone that needs them, never ahead of schedule
 * with placeholder business logic.
 *
 * functions/ never imports from src/ (the frontend) — the only shared code
 * is @vestige/shared-schemas, per 10 - Folder Structure.md §19.1.
 */
export { onUserCreate } from './auth/onUserCreate';
export { setUserRole } from './roles/setUserRole';
