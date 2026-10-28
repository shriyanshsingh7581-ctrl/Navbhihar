/**
 * Firestore Security Rules Test Suite — NaviBihar India (NBI News)
 * Verifies that all "Dirty Dozen" adversarial payloads defined in security_spec.md
 * return PERMISSION_DENIED and legitimate public/admin operations succeed.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_TEST_CASES: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated Article Creation',
    collection: 'articles/art-1',
    operation: 'create',
    auth: null,
    payload: { title: 'Test', status: 'published' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Draft Article Public Leak',
    collection: 'articles/draft-1',
    operation: 'get',
    auth: null,
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Spoofed Unverified Admin Email',
    collection: 'articles/art-2',
    operation: 'create',
    auth: { uid: 'admin-1', email: 'singhshriyansh51@gmail.com', email_verified: false },
    payload: { title: 'Test', status: 'published' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Shadow Field Injection on Article Create',
    collection: 'articles/art-3',
    operation: 'create',
    auth: { uid: 'admin-1', email: 'singhshriyansh51@gmail.com', email_verified: true },
    payload: { title: 'Test', isSuperFeatured: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Identity Spoofing (authorId mismatch)',
    collection: 'articles/art-4',
    operation: 'create',
    auth: { uid: 'admin-1', email: 'singhshriyansh51@gmail.com', email_verified: true },
    payload: { authorId: 'spoofed-uid' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Denial-of-Wallet Oversized String',
    collection: 'articles/art-5',
    operation: 'create',
    auth: { uid: 'admin-1', email: 'singhshriyansh51@gmail.com', email_verified: true },
    payload: { title: 'A'.repeat(500) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Timestamp Forgery on Create',
    collection: 'articles/art-6',
    operation: 'create',
    auth: { uid: 'admin-1', email: 'singhshriyansh51@gmail.com', email_verified: true },
    payload: { createdAt: '2020-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Immutable Field Mutation on Update',
    collection: 'articles/art-1',
    operation: 'update',
    auth: { uid: 'admin-1', email: 'singhshriyansh51@gmail.com', email_verified: true },
    payload: { authorId: 'new-owner-uid' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Value Poisoning on Update (Invalid Status Enum)',
    collection: 'articles/art-1',
    operation: 'update',
    auth: { uid: 'admin-1', email: 'singhshriyansh51@gmail.com', email_verified: true },
    payload: { status: 'archived' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Self-Assigned Admin Privilege Escalation',
    collection: 'admins/regular-user-1',
    operation: 'create',
    auth: { uid: 'regular-user-1', email: 'user@example.com', email_verified: true },
    payload: { email: 'user@example.com', role: 'admin' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'PII Blanket Read on /admins',
    collection: 'admins/admin-1',
    operation: 'get',
    auth: { uid: 'regular-user-1', email: 'user@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Inactive Category Public Read',
    collection: 'categories/inactive-cat',
    operation: 'get',
    auth: null,
    expectedResult: 'PERMISSION_DENIED',
  },
];
