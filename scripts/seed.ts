/**
 * scripts/seed.ts
 *
 * Populates brands, categories, and the two config singleton documents in
 * the local Emulator Suite (14 - Development Roadmap.md M2's seed data
 * deliverable) — so later milestones (catalog pages, curation workbench)
 * aren't blocked on empty reference data.
 *
 * No folder location for seed scripts is specified anywhere in
 * 10 - Folder Structure.md's directory tree — `scripts/` is my own
 * reasonable placement (a conventional location for one-off dev tooling
 * that isn't part of the app bundle, the Cloud Functions bundle, or the
 * shared-schemas package), not something the docs pin down explicitly.
 *
 * Reuses the exact same factory functions the test suite uses
 * (25 - Testing Strategy.md §4 — "seed data ... is generated from the same
 * factory functions used in tests, so seed data and test data can never
 * disagree about what a valid document looks like"), rather than
 * hand-writing separate seed documents.
 *
 * Run with: npm run seed
 * Requires the Firestore Emulator to already be running (npm run emulators
 * in a separate terminal) — unlike the rules tests, this script does NOT
 * start/stop the emulator itself, since seeding is meant to populate data
 * for a session you're about to develop against, not a one-shot test run.
 */
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc } from 'firebase/firestore';
import {
  buildTestBrand,
  buildTestCategory,
  buildTestPricingRules,
  buildTestMarkdownSchedule,
} from '../test/fixtures/testFixtures';

const brands = [
  buildTestBrand({ name: 'Theory', slug: 'theory', tier: 'premium' }),
  buildTestBrand({ name: 'Everlane', slug: 'everlane', tier: 'value' }),
  buildTestBrand({ name: 'Hermès', slug: 'hermes', tier: 'luxury' }),
  buildTestBrand({ name: 'Uniqlo', slug: 'uniqlo', tier: 'value' }),
  buildTestBrand({ name: 'COS', slug: 'cos', tier: 'premium' }),
];

// A 2-level hierarchy (08 - Firestore Schema.md §6.4 — "supports a 2-level
// hierarchy only"): top-level categories first, then children referencing
// their parent's slug-derived id.
const topLevelCategories = [
  { key: 'outerwear', doc: buildTestCategory({ name: 'Outerwear', slug: 'outerwear', displayOrder: 1 }) },
  { key: 'tops', doc: buildTestCategory({ name: 'Tops', slug: 'tops', displayOrder: 2 }) },
  { key: 'bottoms', doc: buildTestCategory({ name: 'Bottoms', slug: 'bottoms', displayOrder: 3 }) },
  { key: 'accessories', doc: buildTestCategory({ name: 'Accessories', slug: 'accessories', displayOrder: 4 }) },
];

const childCategories = [
  buildTestCategory({ name: 'Coats', slug: 'coats', parentCategoryId: 'cat_outerwear', displayOrder: 1 }),
  buildTestCategory({ name: 'Jackets', slug: 'jackets', parentCategoryId: 'cat_outerwear', displayOrder: 2 }),
  buildTestCategory({ name: 'Sweaters', slug: 'sweaters', parentCategoryId: 'cat_tops', displayOrder: 1 }),
  buildTestCategory({ name: 'Shirts', slug: 'shirts', parentCategoryId: 'cat_tops', displayOrder: 2 }),
  buildTestCategory({ name: 'Scarves', slug: 'scarves', parentCategoryId: 'cat_accessories', displayOrder: 1 }),
];

async function main() {
  const testEnv = await initializeTestEnvironment({
    projectId: 'demo-vestige',
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      // No rules file loaded here — seeding intentionally bypasses rules
      // entirely via withSecurityRulesDisabled below, the same way
      // firestore.rules.test.ts seeds its own fixtures.
    },
  });

  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();

    for (const [i, brand] of brands.entries()) {
      await setDoc(doc(db, 'brands', `brand_${brand.slug}`), brand);
      console.log(`  brands/brand_${brand.slug} (${i + 1}/${brands.length})`);
    }

    for (const { key, doc: categoryDoc } of topLevelCategories) {
      await setDoc(doc(db, 'categories', `cat_${key}`), categoryDoc);
      console.log(`  categories/cat_${key}`);
    }
    for (const categoryDoc of childCategories) {
      await setDoc(doc(db, 'categories', `cat_${categoryDoc.slug}`), categoryDoc);
      console.log(`  categories/cat_${categoryDoc.slug}`);
    }

    await setDoc(doc(db, 'config', 'pricingRules'), buildTestPricingRules());
    console.log('  config/pricingRules');
    await setDoc(doc(db, 'config', 'markdownSchedule'), buildTestMarkdownSchedule());
    console.log('  config/markdownSchedule');
  });

  await testEnv.cleanup();
  console.log(
    `\nSeeded ${brands.length} brands, ${topLevelCategories.length + childCategories.length} categories, and 2 config documents.`,
  );
}

main().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
