# PR64 Summary

## Title

Add Pilot Workspace V1 shell

## Motivation

The pilot page has enough working pieces that it should stop feeling like a long stacked test page. The next step is a V1 product shell that keeps functionality first but starts moving toward the final ChurchWork look and workspace structure.

## What changed

Updated:

- `components/PilotWorkspaceShell.tsx`

## Behavior

The pilot page now has a workspace shell with top-level cards/tabs:

- Overview
- Owner/Admin
- Facility
- Requester

Each workspace renders the relevant existing functionality:

- Overview: seed check, pilot paths, sandbox reminder.
- Owner/Admin: existing owner/admin access center.
- Facility: facility signup and facility user management.
- Requester: structured spiritual-care request form.

## Design direction

This starts the final-look V1 direction:

- Dark ChurchWork hero panel.
- Clear workspace cards.
- Less stacked scrolling.
- User-facing labels formatted without raw underscores where touched.
- Sandbox reminder stays visible.

## Guardrails

- No new database migration.
- No service role key.
- No change to existing RLS behavior.
- Existing components keep their own permission checks.

## Next PRs

- True role-default landing behavior.
- Partner signup.
- Partner admin user management.
- Facility request review queue.
- Full label polish pass across owner/admin and timeline cards.
