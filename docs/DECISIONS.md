# Project Decisions Log

Tracks decisions made during development that add to, or clarify ambiguity in,
the Project Knowledge documents — so later sessions don't have to rediscover
the reasoning or accidentally contradict it.

## 2026 — Sprint 1

- **React 19** confirmed as the actual frontend version (overrides
  `00 - Project Constitution.md` §3's "React 18", which is now stale relative
  to this instruction).
- **Firebase Analytics approved as a stack addition.** Not in the Constitution's
  original fixed stack (Auth, Firestore, Cloudinary, Hosting) — added on
  explicit instruction. Initialized lazily and guarded (`initAnalytics()` in
  `src/lib/firebase/config.ts`): skipped against emulators, skipped when
  `VITE_FIREBASE_MEASUREMENT_ID` is unset, skipped in unsupported environments.
- **Only the production Firebase project (`vestige-production`) exists so far.**
  `00 - Project Constitution.md` §20 and `14 - Development Roadmap.md` M0 call
  for three distinct projects (dev/staging/production). Dev and staging
  projects are still to be created — until then, local development should set
  `VITE_USE_FIREBASE_EMULATORS=true` rather than pointing at production.
