import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

/**
 * functions/ is a separate npm package (its own package.json, tsconfig.json,
 * node_modules) from the root src/ app — it was never covered by the root
 * eslint.config.js's `files` globs (src/**, test/**, scripts/**), so this is
 * its own config, run via `cd functions && npx eslint .`, matching how
 * typecheck/build already run scoped to this package.
 */
export default tseslint.config(
  { ignores: ['lib', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
