import { collection, doc } from 'firebase/firestore';
import { db } from './app';
import { userConverter } from './converters/userConverter';
import { addressConverter } from './converters/addressConverter';
import { brandConverter } from './converters/brandConverter';
import { categoryConverter } from './converters/categoryConverter';
import { procurementBatchConverter } from './converters/procurementBatchConverter';
import { intakeItemConverter } from './converters/intakeItemConverter';
import { listingConverter } from './converters/listingConverter';
import { cartConverter } from './converters/cartConverter';
import { wishlistConverter } from './converters/wishlistConverter';
import { orderConverter } from './converters/orderConverter';
import { orderItemConverter } from './converters/orderItemConverter';
import { roleGrantConverter } from './converters/roleGrantConverter';
import { pricingRulesConverter, markdownScheduleConverter } from './converters/configConverter';
import { statusHistoryConverter } from './converters/statusHistoryConverter';

/**
 * Every Firestore access in the entire frontend goes through these typed
 * references — no component or feature ever calls `collection(db, "...")`
 * directly (10 - Folder Structure.md §5, restated as a lint-enforced rule in
 * 15 - Coding Standards & AI Development Rules.md §11).
 */
export const usersRef = collection(db, 'users').withConverter(userConverter);
export const addressesRef = collection(db, 'addresses').withConverter(addressConverter);
export const brandsRef = collection(db, 'brands').withConverter(brandConverter);
export const categoriesRef = collection(db, 'categories').withConverter(categoryConverter);
export const procurementBatchesRef = collection(db, 'procurementBatches').withConverter(
  procurementBatchConverter,
);
export const intakeItemsRef = collection(db, 'intakeItems').withConverter(intakeItemConverter);
export const listingsRef = collection(db, 'listings').withConverter(listingConverter);
export const cartsRef = collection(db, 'carts').withConverter(cartConverter);
export const wishlistsRef = collection(db, 'wishlists').withConverter(wishlistConverter);
export const ordersRef = collection(db, 'orders').withConverter(orderConverter);
export const orderItemsRef = collection(db, 'orderItems').withConverter(orderItemConverter);
export const roleGrantsRef = collection(db, 'roleGrants').withConverter(roleGrantConverter);

/**
 * config/{docId} — fixed singleton document IDs, not a general collection of
 * many documents (08 - Firestore Schema.md §6.13), so these are typed
 * DocumentReferences, not CollectionReferences like everything above.
 */
export const pricingRulesDocRef = doc(db, 'config', 'pricingRules').withConverter(
  pricingRulesConverter,
);
export const markdownScheduleDocRef = doc(db, 'config', 'markdownSchedule').withConverter(
  markdownScheduleConverter,
);

/**
 * carts/{uid} and wishlists/{uid} use the uid as a natural key
 * (08 - Firestore Schema.md §6.8-6.9) rather than an auto-ID — these helpers
 * return the specific document reference for a given user, built from the
 * collection references above so the converter stays in one place.
 */
export function cartDocRef(uid: string) {
  return doc(cartsRef, uid);
}
export function wishlistDocRef(uid: string) {
  return doc(wishlistsRef, uid);
}

/**
 * Append-only audit-trail subcollections (08 - Firestore Schema.md §7) — per
 * parent document, never queried across parents, so these are functions
 * taking the parent id rather than fixed top-level references.
 */
export function listingStatusHistoryRef(listingId: string) {
  return collection(db, 'listings', listingId, 'statusHistory').withConverter(
    statusHistoryConverter,
  );
}
export function orderStatusHistoryRef(orderId: string) {
  return collection(db, 'orders', orderId, 'statusHistory').withConverter(statusHistoryConverter);
}
