# PR60 Summary

## Title

Add facility self-signup

## Motivation

ChurchWork should move toward a working SaaS-style onboarding model. If a facility wants to use ChurchWork, the first signed-in person should be able to create the facility workspace and become the Facility Admin without Cole or Sam manually assigning every account.

## What changed

Added a Supabase migration:

- `supabase/migrations/202607020002_facility_self_signup.sql`

The migration adds:

- `slugify_facility_name(...)`
- `create_facility_account(...)`

`create_facility_account(...)` creates:

- a facility organization row,
- a facility row,
- a Facility Admin role membership for the signed-in user,
- an audit log entry.

Added UI:

- `components/FacilitySignupCard.tsx`

Updated:

- `components/PilotWorkspaceShell.tsx`

## Behavior

A signed-in, policy-accepted user can create a facility workspace. That user becomes the first `facility_admin` for the new facility organization.

## Guardrails

- No requester notes.
- No medical fields.
- No facility queue yet.
- No partner workspace yet.
- No partner routing yet.
- No service-role key in the browser.
- Facility signup goes through a Supabase RPC instead of direct browser inserts.

## Next PRs

- Facility Admin user management.
- Role-based pilot routing.
- Facility review queue.
- Partner signup and partner admin management.
