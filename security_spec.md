# Security Specification — NaviBihar India (NBI News)

## 1. Data Invariants & Access Model

1. **Default Deny**: All unspecified paths in `/databases/{database}/documents/{document=**}` are strictly denied for both `read` and `write`.
2. **Verified Admin Identity (`isAdmin()`)**:
   - Administrator access is granted ONLY if `request.auth != null && request.auth.token.email_verified == true` AND either:
     - `request.auth.token.email == 'singhshriyansh51@gmail.com'` (bootstrapped owner admin), OR
     - `exists(/databases/$(database)/documents/admins/$(request.auth.uid))`
3. **Draft Isolation Invariant (`/articles/{articleId}` & `/videos/{videoId}`)**:
   - Public (unauthenticated or non-admin) users can ONLY `get` or `list` documents where `resource.data.status == 'published'`.
   - Draft (`status == 'draft'`) and scheduled (`status == 'scheduled'`) articles are strictly invisible to public queries and direct reads, accessible ONLY to `isAdmin()`.
4. **Strict Schema & Size Validation**:
   - Every write (`create`, `update`) must pass entity validation helpers (`isValidArticle`, `isValidCategory`, `isValidVideo`, `isValidSettings`, `isValidAdmin`) enforcing exact allowed keys (`hasAll` and `hasOnly`), string `.size()` bounds matching `firebase-blueprint.json`, regex validation on slugs/IDs, and server timestamp integrity (`request.time`).
5. **Immutability & Identity Integrity**:
   - On creation, `authorId` (or `updatedBy`) must equal `request.auth.uid`, and `createdAt == request.time` and `updatedAt == request.time`.
   - On update, `createdAt` and `authorId` are immutable (`incoming().createdAt == existing().createdAt && incoming().authorId == existing().authorId`), `updatedAt == request.time`, and `affectedKeys().hasOnly(...)` restricts mutable fields.
6. **PII Isolation (`/admins/{adminId}`)**:
   - Contains admin email addresses. Never publicly readable or listable by general users; `get` is restricted to `isOwner(adminId) || isAdmin()`, and `list` is restricted to `isAdmin()`.

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Unauthenticated Article Creation**: Anonymous client attempts `create` on `/articles/art-1`. -> `PERMISSION_DENIED`
2. **Draft Article Public Leak (`get` / `list`)**: Public reader attempts to read `/articles/draft-1` where `status == 'draft'`. -> `PERMISSION_DENIED`
3. **Spoofed Unverified Admin Email**: Authenticated user with `email == 'singhshriyansh51@gmail.com'` but `email_verified == false` attempts to create an article. -> `PERMISSION_DENIED`
4. **Shadow Field Injection on Article Create**: Admin sends valid article payload plus `isSuperFeatured: true` not in schema. -> `PERMISSION_DENIED`
5. **Identity Spoofing (`authorId` mismatch)**: Admin creates an article with `authorId: 'someone-else-uid'`. -> `PERMISSION_DENIED`
6. **Denial-of-Wallet Oversized String**: Admin attempts to write an article with `title` length > 300 characters or `articleId` > 128 chars. -> `PERMISSION_DENIED`
7. **Timestamp Forgery on Create**: Admin passes a past or future client timestamp for `createdAt` instead of `request.time`. -> `PERMISSION_DENIED`
8. **Immutable Field Mutation on Update**: Admin updates an article and modifies `createdAt` or `authorId`. -> `PERMISSION_DENIED`
9. **Value Poisoning on Update**: Admin updates `status` to `'archived'` (not in `['published', 'draft', 'scheduled']`). -> `PERMISSION_DENIED`
10. **Self-Assigned Admin Privilege Escalation**: Regular signed-in user attempts to create `/admins/{theirUid}` with `role: 'admin'`. -> `PERMISSION_DENIED`
11. **PII Blanket Read on `/admins`**: Authenticated non-admin user attempts to read `/admins/other-admin-uid`. -> `PERMISSION_DENIED`
12. **Inactive Category Public Read**: Public user attempts to list `/categories` without filtering `isActive == true`. -> `PERMISSION_DENIED`
