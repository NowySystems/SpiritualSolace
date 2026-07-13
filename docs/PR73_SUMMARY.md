# PR73: Pilot role-aware workspace routing

## Motivation

Pilot users should not have to know which tab to open. Owner/admin, facility, partner, and requester users should be recognized by their active role membership and routed toward the correct pilot workspace.

This builds directly on PR72's pilot-status alignment.

## Description

Adds:

- `supabase/migrations/202607090001_pilot_workspace_access.sql`
- `docs/PR73_SUMMARY.md`

Updates:

- `components/PilotWorkspaceShell.tsx`

## Backend behavior

Adds `public.get_pilot_workspace_access()`:

- Requires an authenticated user.
- Syncs the current pilot profile.
- Reads the signed-in user's active role memberships.
- Returns active roles and a recommended workspace:
  - `owner` for owner/platform admin,
  - `facility` for facility admin/staff,
  - `partner` for partner admin/user,
  - `requester` for requester,
  - `overview` if no active role is assigned.

## UI behavior

The `/pilot` shell now:

- Loads the pilot access snapshot.
- Applies the recommended workspace once on page load.
- Shows a "Your pilot access" panel with active role chips.
- Adds a "Go to my workspace" button.
- Marks the recommended tab.
- Adds a Partner tab placeholder for Hope Church routing.

## Guardrails

- No requester intake behavior changes.
- No care request routing changes.
- No partner assignment logic yet.
- No open chat.
- No medical fields.
- No RLS policy changes.
- Partner tab is intentionally a placeholder until partner assignment and visibility rules are ready.

## Testing

After applying the migration and deploying:

1. Sign in as Cole/Sam and confirm `/pilot` recommends Owner/Admin.
2. Assign a test user `facility_admin` for Grandview and confirm `/pilot` recommends Facility.
3. Assign a test user `partner_admin` or `partner_user` for Hope Church and confirm `/pilot` recommends Partner.
4. Assign a test user `requester` and confirm `/pilot` recommends Requester.
5. Confirm unassigned users remain on Overview.
6. Confirm manual tab switching still works.
