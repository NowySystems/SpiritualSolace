# PR59 Test Notes

## Source-level checks

- Owner/Admin Access Center is mounted inside the pilot shell after sign-in and policy acceptance.
- Non-admin users receive no visible owner/admin panel.
- Bootstrap owner/admin activation is handled through a Supabase RPC, not through client-side trust.
- Role assignment is handled through a Supabase RPC with server-side owner/admin checks.
- The owner/admin snapshot is returned through a Supabase RPC so browser RLS does not need direct access to auth user records.
- Requester intake remains structured only.
- No medical fields or requester notes were added.

## Manual test plan after migration

1. Apply `supabase/migrations/202607020001_owner_admin_access_center.sql` in Supabase SQL Editor.
2. Sign in to `/pilot` with a bootstrap owner/admin account.
3. Confirm the Owner/Admin panel appears.
4. Confirm user counts, request counts, role buckets, recent requests, and recent timeline activity load.
5. Create a test requester account.
6. Confirm the test account appears as unassigned.
7. Assign the test account to the requester role.
8. Submit a structured Grandview request.
9. Confirm the request and timeline event appear in the Owner/Admin panel.

## Not run in this environment

- Supabase migration execution.
- Browser sign-in test.
- Role assignment RPC test.
- `npm run build`.
