import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

// Matches the feature inventory in 10 - Folder Structure.md §3.2 exactly.
const FEATURES = [
  'auth',
  'catalog',
  'product-detail',
  'cart-checkout',
  'wishlist',
  'account',
  'admin-procurement',
  'admin-curation',
  'admin-photography',
  'admin-orders',
  'admin-support',
  'admin-reports',
  'admin-roles',
];

// import/no-restricted-paths has no built-in "same directory" exception, so a
// single target: './src/features', from: './src/features' zone would also flag
// a feature importing its own internals. Generating one zone per feature (self
// excluded from `from`) is what actually expresses "no cross-feature imports,
// same-feature imports are fine."
const crossFeatureZones = FEATURES.map((feature) => ({
  target: `./src/features/${feature}`,
  from: FEATURES.filter((f) => f !== feature).map((f) => `./src/features/${f}`),
  message:
    "A feature may never import another feature's internals directly (Folder Structure §19.1). Promote shared logic to components/shared, hooks, lib, types, or constants.",
}));

/**
 * ESLint flat config.
 *
 * The `import/no-restricted-paths` block below is the mechanical enforcement of
 * 10 - Folder Structure.md §19's dependency graph: an incorrect cross-layer import
 * fails CI, per 15 - Coding Standards & AI Development Rules.md §11 ("a violation
 * of any rule above is a lint-enforced build failure, not a code-review-only
 * convention"). Zones are ordered target-first, matching the graph's arrows read
 * as "may NOT import from."
 */
export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'functions/lib'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strict, ...tseslint.configs.stylistic],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.app.json' },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // --- TypeScript strictness (15 - Coding Standards §5) ---
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // --- No default exports except pages/top-level app files (Folder Structure §18) ---
      'import/no-default-export': 'error',

      // --- Dependency graph enforcement (Folder Structure §19) ---
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/components/ui',
              from: ['./src/features', './src/lib/firebase', './src/contexts'],
              message:
                'components/ui is pure presentation (Folder Structure §19.1) — it may not import from features, lib/firebase, or contexts.',
            },
            ...crossFeatureZones,
            {
              target: './src/lib',
              from: ['./src/features', './src/components'],
              message: 'lib/ never imports from features/ or components/ (Folder Structure §19.1).',
            },
            {
              target: './src/contexts',
              from: './src/features',
              message:
                'contexts/ may depend on lib/ but never on features/ (Folder Structure §19.1).',
            },
          ],
        },
      ],
    },
  },
  {
    // Page-level route components and main.tsx/App.tsx are the sole permitted
    // default-export locations (Folder Structure §18).
    files: ['src/main.tsx', 'src/App.tsx', 'src/**/pages/**/*.tsx', 'src/app/routes/**/*.tsx'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  {
    // Context files (10 - Folder Structure.md §7) idiomatically export both the
    // provider component and its consumer hook (e.g. ThemeProvider + useTheme)
    // from the same file — that's the correct pattern, not a fast-refresh bug.
    files: ['src/contexts/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // Toast.tsx follows the identical Provider+hook colocation pattern, but
    // its documented folder is components/ui/ (18 - Component Inventory.md
    // §3), not contexts/ — same exception, different location.
    files: ['src/components/ui/Toast.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
