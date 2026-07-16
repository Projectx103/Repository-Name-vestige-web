import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';

/** Every document read through these converters gets `id` merged in (see fromFirestore below) — this reflects that in the type. */
export type WithId<T> = T & { id: string };

/**
 * Shared factory behind every file in this folder — reduces each individual
 * converter file to "which type does this collection use," rather than
 * reimplementing toFirestore/fromFirestore boilerplate twelve times.
 *
 * fromFirestore always merges the document id in as `id` — every document
 * type in src/types/ includes it for exactly this reason (a component
 * rendering a list needs the id for keys/links, even though 08 - Firestore
 * Schema.md's field tables don't list it explicitly, since it's implicit in
 * the document reference there).
 */
export function createConverter<T extends DocumentData>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T): DocumentData {
      return data;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): T {
      return { id: snapshot.id, ...snapshot.data(options) } as unknown as T;
    },
  };
}

/**
 * For collections that reject ALL direct client writes, in every case, for
 * every role (11 - Security.md §11 — orders, orderItems, roleGrants).
 * toFirestore throws immediately rather than silently permitting a write
 * attempt — a dev-time guardrail catching an accidental direct write before
 * Sprint 9's Security Rules would (correctly, but only at deploy/runtime)
 * reject it anyway.
 */
export function createReadOnlyConverter<T extends DocumentData>(
  collectionLabel: string,
): FirestoreDataConverter<T> {
  return {
    toFirestore(): DocumentData {
      throw new Error(
        `${collectionLabel} is Cloud-Function-only (11 - Security.md §11) — there is no direct client write path. Use the appropriate callable function instead.`,
      );
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): T {
      return { id: snapshot.id, ...snapshot.data(options) } as unknown as T;
    },
  };
}
