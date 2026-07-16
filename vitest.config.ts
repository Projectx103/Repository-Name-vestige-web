import { defineConfig } from 'vitest/config';

/**
 * Root-level Vitest config, separate from the Vite app config, since these
 * tests (firestore.rules.test.ts, future functions/ integration tests) run
 * against Node/the Firebase Emulator Suite, not the browser app build.
 */
export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    testTimeout: 15000,
  },
});
