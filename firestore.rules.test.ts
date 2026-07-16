/**
 * Security Rules unit tests — 14 - Development Roadmap.md M2's highest-
 * priority test suite alongside M8's checkout transaction test. Every
 * allow/deny boundary in firestore.rules gets both an allowed AND a denied
 * assertion, per 15 - Coding Standards & AI Development Rules.md §9.
 *
 * Run with: npm run test:rules
 * (wraps `firebase emulators:exec` so the emulator starts, runs this suite,
 * then tears down — you don't need a separately-running emulator instance.)
 */
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  buildTestUser,
  buildTestAddress,
  buildTestBrand,
  buildTestCategory,
  buildTestProcurementBatch,
  buildTestIntakeItem,
  buildTestListing,
  buildTestCart,
  buildTestWishlist,
  buildTestOrder,
  buildTestOrderItem,
  buildTestRoleGrant,
  buildTestPricingRules,
} from './test/fixtures/testFixtures';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-vestige',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

function buyer(uid: string) {
  return testEnv.authenticatedContext(uid, { roles: ['buyer'] });
}
function staff(uid: string, roles: string[]) {
  return testEnv.authenticatedContext(uid, { roles });
}
function guest() {
  return testEnv.unauthenticatedContext();
}

/** Writes a document bypassing rules entirely — used to set up test state, not to test the rules themselves. */
async function seed(path: string, data: Record<string, unknown>) {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), path), data);
  });
}

describe('users/{uid}', () => {
  it('owner can read own user doc', async () => {
    await seed('users/buyer-a', buildTestUser({ uid: 'buyer-a' }));
    await assertSucceeds(getDoc(doc(buyer('buyer-a').firestore(), 'users/buyer-a')));
  });
  it("another buyer cannot read someone else's user doc", async () => {
    await seed('users/buyer-a', buildTestUser({ uid: 'buyer-a' }));
    await assertFails(getDoc(doc(buyer('buyer-b').firestore(), 'users/buyer-a')));
  });
  it('ops_admin can read any user doc', async () => {
    await seed('users/buyer-a', buildTestUser({ uid: 'buyer-a' }));
    await assertSucceeds(getDoc(doc(staff('admin-a', ['ops_admin']).firestore(), 'users/buyer-a')));
  });
  it('owner can update allowed profile fields', async () => {
    await seed('users/buyer-a', buildTestUser({ uid: 'buyer-a' }));
    await assertSucceeds(
      updateDoc(doc(buyer('buyer-a').firestore(), 'users/buyer-a'), { displayName: 'New Name' }),
    );
  });
  it('owner cannot update the roles field directly', async () => {
    await seed('users/buyer-a', buildTestUser({ uid: 'buyer-a' }));
    await assertFails(
      updateDoc(doc(buyer('buyer-a').firestore(), 'users/buyer-a'), { roles: ['super_admin'] }),
    );
  });
  it('client cannot create a user doc directly', async () => {
    await assertFails(
      setDoc(
        doc(buyer('buyer-new').firestore(), 'users/buyer-new'),
        buildTestUser({ uid: 'buyer-new' }),
      ),
    );
  });
});

describe('addresses/{addressId}', () => {
  it('owner can read/write own address', async () => {
    await seed('addresses/addr-1', buildTestAddress({ ownerUid: 'buyer-a' }));
    await assertSucceeds(getDoc(doc(buyer('buyer-a').firestore(), 'addresses/addr-1')));
  });
  it("another buyer cannot read someone else's address", async () => {
    await seed('addresses/addr-1', buildTestAddress({ ownerUid: 'buyer-a' }));
    await assertFails(getDoc(doc(buyer('buyer-b').firestore(), 'addresses/addr-1')));
  });
  it('buyer can create an address with their own ownerUid', async () => {
    await assertSucceeds(
      setDoc(
        doc(buyer('buyer-a').firestore(), 'addresses/addr-new'),
        buildTestAddress({ ownerUid: 'buyer-a' }),
      ),
    );
  });
  it('buyer cannot create an address spoofing another ownerUid', async () => {
    await assertFails(
      setDoc(
        doc(buyer('buyer-a').firestore(), 'addresses/addr-new'),
        buildTestAddress({ ownerUid: 'buyer-b' }),
      ),
    );
  });
});

describe('brands/{brandId}', () => {
  it('anyone (including unauthenticated) can read', async () => {
    await seed('brands/brand-1', buildTestBrand());
    await assertSucceeds(getDoc(doc(guest().firestore(), 'brands/brand-1')));
  });
  it('curator can write', async () => {
    await assertSucceeds(
      setDoc(doc(staff('curator-a', ['curator']).firestore(), 'brands/brand-1'), buildTestBrand()),
    );
  });
  it('buyer cannot write', async () => {
    await assertFails(
      setDoc(doc(buyer('buyer-a').firestore(), 'brands/brand-1'), buildTestBrand()),
    );
  });
});

describe('categories/{categoryId}', () => {
  it('anyone can read', async () => {
    await seed('categories/cat-1', buildTestCategory());
    await assertSucceeds(getDoc(doc(guest().firestore(), 'categories/cat-1')));
  });
  it('ops_admin can write', async () => {
    await assertSucceeds(
      setDoc(
        doc(staff('admin-a', ['ops_admin']).firestore(), 'categories/cat-1'),
        buildTestCategory(),
      ),
    );
  });
  it('curator (not ops_admin/super_admin) cannot write categories', async () => {
    await assertFails(
      setDoc(
        doc(staff('curator-a', ['curator']).firestore(), 'categories/cat-1'),
        buildTestCategory(),
      ),
    );
  });
});

describe('procurementBatches/{batchId}', () => {
  it('procurement_staff can read/write', async () => {
    await assertSucceeds(
      setDoc(
        doc(staff('proc-a', ['procurement_staff']).firestore(), 'procurementBatches/batch-1'),
        buildTestProcurementBatch(),
      ),
    );
  });
  it('buyer cannot read/write', async () => {
    await assertFails(
      setDoc(
        doc(buyer('buyer-a').firestore(), 'procurementBatches/batch-1'),
        buildTestProcurementBatch(),
      ),
    );
  });
});

describe('intakeItems/{itemId}', () => {
  it('any staff role can read', async () => {
    await seed('intakeItems/item-1', buildTestIntakeItem());
    await assertSucceeds(
      getDoc(doc(staff('proc-a', ['procurement_staff']).firestore(), 'intakeItems/item-1')),
    );
  });
  it('buyer cannot read', async () => {
    await seed('intakeItems/item-1', buildTestIntakeItem());
    await assertFails(getDoc(doc(buyer('buyer-a').firestore(), 'intakeItems/item-1')));
  });
  it('curator can write', async () => {
    await assertSucceeds(
      setDoc(
        doc(staff('curator-a', ['curator']).firestore(), 'intakeItems/item-1'),
        buildTestIntakeItem(),
      ),
    );
  });
});

describe('listings/{listingId}', () => {
  it('anyone can read an available listing', async () => {
    await seed('listings/listing-1', buildTestListing({ status: 'available' }));
    await assertSucceeds(getDoc(doc(guest().firestore(), 'listings/listing-1')));
  });
  it('buyer cannot read a draft listing', async () => {
    await seed('listings/listing-1', buildTestListing({ status: 'draft' }));
    await assertFails(getDoc(doc(buyer('buyer-a').firestore(), 'listings/listing-1')));
  });
  it('staff can read a draft listing', async () => {
    await seed('listings/listing-1', buildTestListing({ status: 'draft' }));
    await assertSucceeds(
      getDoc(doc(staff('curator-a', ['curator']).firestore(), 'listings/listing-1')),
    );
  });
  it('curator can update a non-photo field alone', async () => {
    await seed('listings/listing-1', buildTestListing());
    await assertSucceeds(
      updateDoc(doc(staff('curator-a', ['curator']).firestore(), 'listings/listing-1'), {
        priceCents: 20000,
      }),
    );
  });
  it('curator (as Photographer) can update photos alone', async () => {
    await seed('listings/listing-1', buildTestListing());
    await assertSucceeds(
      updateDoc(doc(staff('curator-a', ['curator']).firestore(), 'listings/listing-1'), {
        // Genuinely different from the seeded value, same reasoning as the
        // test below — otherwise affectedKeys() is empty and the test
        // passes without actually exercising the photos-only rule.
        photos: [
          ...buildTestListing().photos,
          {
            url: 'https://res.cloudinary.com/vestige/catalog/x/5.jpg',
            publicId: 'catalog/x/5',
            order: 5,
          },
        ],
      }),
    );
  });
  it('cannot update a non-photo field and photos together in one write', async () => {
    await seed('listings/listing-1', buildTestListing());
    await assertFails(
      updateDoc(doc(staff('curator-a', ['curator']).firestore(), 'listings/listing-1'), {
        priceCents: 20000,
        // Must be genuinely different from the seeded value — Firestore's
        // diff().affectedKeys() only counts a field as changed if its value
        // actually differs, not merely because it's present in the update
        // payload. Reusing the exact same photos array here previously made
        // this test pass for the wrong reason (photos wasn't seen as
        // "affected" at all, so only priceCents mattered).
        photos: [
          ...buildTestListing().photos,
          {
            url: 'https://res.cloudinary.com/vestige/catalog/x/5.jpg',
            publicId: 'catalog/x/5',
            order: 5,
          },
        ],
      }),
    );
  });
  it('buyer cannot update a listing at all', async () => {
    await seed('listings/listing-1', buildTestListing());
    await assertFails(
      updateDoc(doc(buyer('buyer-a').firestore(), 'listings/listing-1'), { priceCents: 1 }),
    );
  });
  it('listings are never hard-deleted, even by super_admin', async () => {
    await seed('listings/listing-1', buildTestListing());
    await assertFails(
      deleteDoc(doc(staff('owner-a', ['super_admin']).firestore(), 'listings/listing-1')),
    );
  });
});

describe('listings/{listingId}/statusHistory/{eventId}', () => {
  it('staff can create an entry', async () => {
    await seed('listings/listing-1', buildTestListing());
    await assertSucceeds(
      setDoc(
        doc(
          staff('curator-a', ['curator']).firestore(),
          'listings/listing-1/statusHistory/event-1',
        ),
        {
          fromStatus: null,
          toStatus: 'available',
          actorUid: 'curator-a',
          reason: null,
          createdAt: new Date(),
        },
      ),
    );
  });
  it('append-only: even staff cannot update an entry', async () => {
    await seed('listings/listing-1', buildTestListing());
    await seed('listings/listing-1/statusHistory/event-1', {
      fromStatus: null,
      toStatus: 'available',
      actorUid: 'curator-a',
      reason: null,
      createdAt: new Date(),
    });
    await assertFails(
      updateDoc(
        doc(
          staff('curator-a', ['curator']).firestore(),
          'listings/listing-1/statusHistory/event-1',
        ),
        {
          reason: 'edited',
        },
      ),
    );
  });
});

describe('carts/{uid} — the acceptance-criteria example', () => {
  it('owner can read/write own cart', async () => {
    await seed('carts/buyer-a', buildTestCart());
    await assertSucceeds(getDoc(doc(buyer('buyer-a').firestore(), 'carts/buyer-a')));
  });
  it("a buyer cannot read another buyer's cart", async () => {
    await seed('carts/buyer-a', buildTestCart());
    await assertFails(getDoc(doc(buyer('buyer-b').firestore(), 'carts/buyer-a')));
  });
});

describe('wishlists/{uid}', () => {
  it('owner can read/write own wishlist', async () => {
    await seed('wishlists/buyer-a', buildTestWishlist());
    await assertSucceeds(getDoc(doc(buyer('buyer-a').firestore(), 'wishlists/buyer-a')));
  });
  it("a buyer cannot read another buyer's wishlist", async () => {
    await seed('wishlists/buyer-a', buildTestWishlist());
    await assertFails(getDoc(doc(buyer('buyer-b').firestore(), 'wishlists/buyer-a')));
  });
});

describe('orders/{orderId} — the "no client write, ever" example', () => {
  it('buyer can read own order', async () => {
    await seed('orders/order-1', buildTestOrder({ buyerUid: 'buyer-a' }));
    await assertSucceeds(getDoc(doc(buyer('buyer-a').firestore(), 'orders/order-1')));
  });
  it("another buyer cannot read someone else's order", async () => {
    await seed('orders/order-1', buildTestOrder({ buyerUid: 'buyer-a' }));
    await assertFails(getDoc(doc(buyer('buyer-b').firestore(), 'orders/order-1')));
  });
  it('ops_admin can read any order', async () => {
    await seed('orders/order-1', buildTestOrder({ buyerUid: 'buyer-a' }));
    await assertSucceeds(
      getDoc(doc(staff('admin-a', ['ops_admin']).firestore(), 'orders/order-1')),
    );
  });
  it('no one can write directly — not even super_admin', async () => {
    await assertFails(
      setDoc(
        doc(staff('owner-a', ['super_admin']).firestore(), 'orders/order-new'),
        buildTestOrder(),
      ),
    );
  });
  it('the buyer who owns the order cannot write it either', async () => {
    await seed('orders/order-1', buildTestOrder({ buyerUid: 'buyer-a' }));
    await assertFails(
      updateDoc(doc(buyer('buyer-a').firestore(), 'orders/order-1'), { status: 'cancelled' }),
    );
  });
});

describe('orderItems/{orderItemId}', () => {
  it('ops_admin can read', async () => {
    await seed('orderItems/item-1', buildTestOrderItem());
    await assertSucceeds(
      getDoc(doc(staff('admin-a', ['ops_admin']).firestore(), 'orderItems/item-1')),
    );
  });
  it('a buyer cannot read orderItems directly', async () => {
    await seed('orderItems/item-1', buildTestOrderItem());
    await assertFails(getDoc(doc(buyer('buyer-a').firestore(), 'orderItems/item-1')));
  });
  it('no direct write, ever', async () => {
    await assertFails(
      setDoc(
        doc(staff('admin-a', ['ops_admin']).firestore(), 'orderItems/item-new'),
        buildTestOrderItem(),
      ),
    );
  });
});

describe('roleGrants/{grantId}', () => {
  it('super_admin can read', async () => {
    await seed('roleGrants/grant-1', buildTestRoleGrant());
    await assertSucceeds(
      getDoc(doc(staff('owner-a', ['super_admin']).firestore(), 'roleGrants/grant-1')),
    );
  });
  it('a curator cannot read the role-grant audit log', async () => {
    await seed('roleGrants/grant-1', buildTestRoleGrant());
    await assertFails(
      getDoc(doc(staff('curator-a', ['curator']).firestore(), 'roleGrants/grant-1')),
    );
  });
  it('no direct write, ever', async () => {
    await assertFails(
      setDoc(
        doc(staff('owner-a', ['super_admin']).firestore(), 'roleGrants/grant-new'),
        buildTestRoleGrant(),
      ),
    );
  });
});

describe('config/{docId}', () => {
  it('anyone can read', async () => {
    await seed('config/pricingRules', buildTestPricingRules());
    await assertSucceeds(getDoc(doc(guest().firestore(), 'config/pricingRules')));
  });
  it('super_admin can write', async () => {
    await assertSucceeds(
      setDoc(
        doc(staff('owner-a', ['super_admin']).firestore(), 'config/pricingRules'),
        buildTestPricingRules(),
      ),
    );
  });
  it('ops_admin (not super_admin) cannot write config', async () => {
    await assertFails(
      setDoc(
        doc(staff('admin-a', ['ops_admin']).firestore(), 'config/pricingRules'),
        buildTestPricingRules(),
      ),
    );
  });
});
