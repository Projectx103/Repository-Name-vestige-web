import { defineConfig } from 'vitest/config';

/**
 * Separate from the root vitest.config.ts — functions/ is its own npm
 * package with its own module system (commonjs) and dependency tree.
 */
export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
