# PR60 Test Notes

## Source-level checks

- Facility signup is mounted inside the signed-in pilot shell after policy acceptance.
- Facility signup calls `create_facility_account(...)` through Supabase RPC.
- The browser does not directly insert into `organizations`, `facilities`, or `role_memberships`.
- The signed-in user becomes the first `facility_admin` for the created facility.
- No requester notes or medical fields were added.
- Existing requester intake remains unchanged.
- Existing owner/admin access center remains unchanged.

## Manual test plan after migration

1. Apply `supabase/migrations/202607020002_facility_self_signup.sql` in Supabase SQL Editor.
2. Sign in to `/pilot`.
3. Accept policies if needed.
4. Fill out the Facility Signup card with fake facility test data.
5. Submit the form.
6. Confirm success message shows the facility name, slug, and `facility_admin` role.
7. Refresh Owner/Admin Access Center.
8. Confirm Facility bucket count increases.
9. Confirm the new organization/facility rows exist in Supabase.
10. Confirm an audit log row exists with `facility_account_created`.

## Not run in this environment

- Supabase migration execution.
- Browser signup flow.
- `npm run build`.
