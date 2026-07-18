/**
 * Factory functions for every document type used in test suites, per
 * 25 - Testing Strategy.md §4 — no test hand-writes a raw Firestore document
 * literal that could silently drift out of sync with the actual schema.
 * Each factory returns a valid, schema-conformant document with sensible
 * defaults, overridable via a partial argument.
 */

export function buildTestUser(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    uid: 'test-uid',
    email: 'buyer@example.com',
    displayName: 'Test Buyer',
    roles: ['buyer'],
    defaultShippingAddressId: null,
    emailVerified: true,
    notificationPrefs: { orderUpdates: true, wishlistAlerts: true, marketing: false },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function buildTestAddress(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    ownerUid: 'test-uid',
    label: 'Home',
    fullName: 'Test Buyer',
    line1: '123 Example Street',
    line2: null,
    city: 'Metro City',
    region: 'Region A',
    postalCode: '00000',
    country: 'PH',
    phone: '+639000000000',
    isDefault: true,
    ...overrides,
  };
}

export function buildTestBrand(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    name: 'Theory',
    slug: 'theory',
    tier: 'premium',
    logoUrl: null,
    ...overrides,
  };
}

export function buildTestCategory(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    name: 'Coats',
    slug: 'coats',
    parentCategoryId: null,
    displayOrder: 1,
    ...overrides,
  };
}

export function buildTestProcurementBatch(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    sourceType: 'wholesale_lot',
    sourceReference: 'LOT-001',
    loggedByUid: 'test-procurement-uid',
    itemCountLogged: 10,
    status: 'logged',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function buildTestIntakeItem(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    batchId: 'test-batch-id',
    status: 'received',
    rejectionReason: null,
    linkedListingId: null,
    gradedByUid: null,
    photographedByUid: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function buildTestListing(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    intakeItemId: 'test-intake-id',
    title: 'Wool Blend Overcoat',
    description: 'A tailored wool-blend overcoat in charcoal.',
    brandId: 'brand_theory',
    brandName: 'Theory',
    categoryId: 'cat_outerwear_coats',
    categoryPath: ['Outerwear', 'Coats'],
    size: 'M',
    condition: 'B',
    conditionNotes: 'Light pilling at the underarm.',
    measurements: [{ label: 'Chest', valueCm: 106 }],
    materials: ['Wool'],
    colorTags: ['charcoal'],
    priceCents: 18500,
    originalMsrpCents: 62000,
    status: 'available',
    reservedUntil: null,
    reservedByCartId: null,
    photos: [
      {
        url: 'https://res.cloudinary.com/vestige/catalog/x/1.jpg',
        publicId: 'catalog/x/1',
        order: 1,
      },
      {
        url: 'https://res.cloudinary.com/vestige/catalog/x/2.jpg',
        publicId: 'catalog/x/2',
        order: 2,
      },
      {
        url: 'https://res.cloudinary.com/vestige/catalog/x/3.jpg',
        publicId: 'catalog/x/3',
        order: 3,
      },
      {
        url: 'https://res.cloudinary.com/vestige/catalog/x/4.jpg',
        publicId: 'catalog/x/4',
        order: 4,
      },
    ],
    isFeatured: false,
    markdownScheduleApplied: false,
    searchKeywords: ['theory', 'overcoat', 'wool'],
    curatedByUid: 'test-curator-uid',
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function buildTestCart(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    items: [{ listingId: 'test-listing-id', priceCentsAtAdd: 18500, addedAt: new Date() }],
    updatedAt: new Date(),
    ...overrides,
  };
}

export function buildTestWishlist(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    listingIds: ['test-listing-id'],
    updatedAt: new Date(),
    ...overrides,
  };
}

export function buildTestOrder(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    buyerUid: 'test-uid',
    guestEmail: null,
    guestAccessToken: null,
    shippingAddress: {
      fullName: 'Test Buyer',
      line1: '123 Example Street',
      line2: null,
      city: 'Metro City',
      region: 'Region A',
      postalCode: '00000',
      country: 'PH',
      phone: '+639000000000',
    },
    status: 'pending_fulfillment',
    subtotalCents: 18500,
    shippingCents: 500,
    taxCents: 0,
    totalCents: 19000,
    paymentIntentId: 'pi_test123',
    paymentStatus: 'paid',
    carrier: null,
    trackingNumber: null,
    handledByUid: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function buildTestOrderItem(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    orderId: 'test-order-id',
    listingId: 'test-listing-id',
    listingSnapshot: {
      title: 'Wool Blend Overcoat',
      brandName: 'Theory',
      size: 'M',
      photoUrl: 'https://res.cloudinary.com/vestige/catalog/x/1.jpg',
    },
    priceCents: 18500,
    ...overrides,
  };
}

export function buildTestRoleGrant(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    subjectUid: 'test-staff-uid',
    grantedByUid: 'test-owner-uid',
    action: 'granted',
    role: 'curator',
    createdAt: new Date(),
    ...overrides,
  };
}

export function buildTestPricingRules(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    brandTierMultipliers: { value: 1.0, premium: 1.5, luxury: 2.5 },
    conditionMultipliers: { A: 1.0, B: 0.8, C: 0.6 },
    ...overrides,
  };
}

export function buildTestMarkdownSchedule(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    thresholds: [
      { days: 14, markdownPct: 10 },
      { days: 30, markdownPct: 25 },
      { days: 45, markdownPct: 40 },
    ],
    ...overrides,
  };
}
