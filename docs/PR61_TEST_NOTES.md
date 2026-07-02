# PR61 Test Notes

## Source-level checks

- Facility user management is mounted inside the signed-in pilot shell after policy acceptance.
- The component is hidden unless the signed-in user can manage at least one facility.
- Facility user management calls Supabase RPCs instead of direct browser writes.
- Existing pilot accounts receive a role membership.
- Unknown emails receive a saved facility invite.
- Matching accounts can claim pending facility invites when they sign in.
- No requester notes or medical fields were added.

## Manual test plan after migrations

1. Apply the PR60 facility self-signup migration if not already applied.
2. Apply the PR61 facility user management migrations.
3. Sign in to `/pilot`.
4. Create a test facility workspace if needed.
5. Confirm Facility User Management appears for the Facility Admin.
6. Add a staff email that has not signed in yet.
7. Confirm a saved invite appears.
8. Sign in with that same email.
9. Confirm the invite is claimed and the user receives facility staff access.
10. Add an existing account as Facility Admin.
11. Confirm the role appears immediately.
12. Disable a facility user and confirm the status changes.

## Not run in this environment

- Supabase migration execution.
- Browser sign-in test.
- `npm run build`.
