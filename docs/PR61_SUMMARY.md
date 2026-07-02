# PR61 Summary

## Title

Add Facility Admin User Management

## Motivation

After facility self-signup, the first Facility Admin needs to manage their own users without ChurchWork owners assigning every facility staff account. This moves ChurchWork toward a working SaaS onboarding model.

## What changed

Added Supabase migrations:

- `supabase/migrations/202607020003_facility_user_management.sql`
- `supabase/migrations/202607020004_facility_snapshot_fix.sql`

The migrations add:

- `facility_user_invites`
- `user_can_manage_facility(...)`
- `claim_facility_invites()`
- `set_facility_user_role(...)`
- `get_facility_admin_snapshot()`

Added UI:

- `components/FacilityUserManagementCard.tsx`

Updated:

- `components/PilotWorkspaceShell.tsx`

## Behavior

Facility Admins can manage users inside only their own facility workspace.

They can:

- Add a facility user by email.
- Assign `facility_staff` or `facility_admin`.
- Set role status to `active`, `invited`, or `disabled`.
- Save an invite if the user has not signed up yet.
- Automatically let a matching signed-in user claim a pending facility invite.

Owners/platform admins retain oversight across facilities.

## Guardrails

- No requester notes.
- No medical fields.
- No partner routing.
- No service-role key in the browser.
- Facility admin rights are enforced through Supabase RPCs, not trusted client state.
- Facility Admins can only manage their own facility organization unless they are platform owner/admin.

## Next PRs

- Role-based pilot router.
- Facility review queue.
- Partner self-signup.
- Partner user management.
