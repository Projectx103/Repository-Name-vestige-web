/**
 * Non-secret, client-side application configuration constants.
 * Nothing sensitive belongs here — see 10 - Folder Structure.md §10 and
 * 00 - Project Constitution.md §9. Secrets never appear in the frontend at all.
 */
export const APP_NAME = 'VESTIGE';

export const DEFAULT_PAGE_SIZE = 24;

/** TanStack Query default staleTime, in milliseconds (5 minutes). */
export const DEFAULT_QUERY_STALE_TIME_MS = 5 * 60 * 1000;
