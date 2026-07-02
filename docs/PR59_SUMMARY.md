# PR59 Summary

## Title

Add Owner/Admin Access Center

## Motivation

Pilot access needs a true owner/admin layer before Grandview facility review and Hope Church partner workflows are expanded. The founding operators need the ability to view pilot activity, track new users, and place users into the correct role bucket.

## What changed

Added a Supabase migration:

- `supabase/migrations/202607020001_owner_admin_access_center.sql`

The migration adds:

- `sync_current_pilot_profile()` to keep the signed-in user's profile row current.
- `handle_new_auth_user()` plus an auth trigger to create profile rows for new Supabase signups.
- `claim_churchwork_bootstrap_admin()` so approved bootstrap accounts can claim owner/platform admin roles.
- `set_pilot_user_role(...)` so owner/admin users can assign signed-up users to ChurchWork, Grandview Post Acute, or Hope Church roles.
- `get_owner_admin_snapshot()` so owner/admin users can view pilot users, role buckets, request counts, recent requests, and recent timeline activity.

Added UI:

- `components/OwnerAdminAccessCenter.tsx`
- Owner/admin section inside `components/PilotWorkspaceShell.tsx`

## Guardrails

- No requester notes.
- No medical fields.
- No partner workspace yet.
- No facility queue yet.
- No service-role key in the browser.
- Owner/admin functions are enforced server-side through Supabase RPCs and role checks.

## Next PRs

- PR60: Role-based Pilot Router.
- PR61: Grandview Facility Queue.
- PR62: Hope Church Partner Workspace.
- PR63: Timeline lenses and visibility testing.
