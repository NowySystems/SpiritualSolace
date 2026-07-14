# PR81: Internal operator launchpad

## Motivation

Owner/Admin analytics can wait. For pilot readiness, Cole/Sam need a simple signed-in internal workspace that lets them access the three role portals and support the live pilot flow.

The immediate need is not KPIs. The immediate need is a clean launchpad:

- Requester Portal,
- Facility Portal,
- Partner Portal.

## Description

Updates:

- `components/PilotWorkspaceShell.tsx`
- `components/ChurchWorkAccessGate.tsx`

Adds:

- `docs/PR81_SUMMARY.md`

## Behavior

`/pilot` now acts as an internal operator workspace:

- keeps Supabase sign-in through `PilotAuthGate`,
- removes the unfinished owner/admin command-center emphasis,
- presents three portal cards:
  - Requester Portal,
  - Facility Portal,
  - Partner Portal,
- lets Cole/Sam quickly jump into any role experience,
- keeps a simple connected-org check for ChurchWork, Grandview, and Hope,
- keeps operational guardrails focused on pilot data safety.

Portal access gate update:

- the legacy access-code flow still works,
- signed-in Supabase pilot users can also access the portal pages,
- this allows a signed-in pilot operator to open all three portals from `/pilot` without hitting the old access-code gate.

## Guardrails

- No full Owner/Admin KPI dashboard yet.
- No analytics or reporting work.
- No Supabase schema changes.
- No care workflow changes.
- No role/RLS changes.
- No demo-flow changes.

## Testing

1. Sign into `/pilot` with a Supabase pilot account.
2. Confirm `/pilot` shows the internal operator launchpad.
3. Confirm the three cards appear:
   - Requester Portal,
   - Facility Portal,
   - Partner Portal.
4. Click each portal card and confirm the portal opens.
5. Confirm the old access-code screen does not block a signed-in Supabase pilot user.
6. Confirm the old access-code gate still appears for visitors without a Supabase session.
7. Confirm sign-out still works from the pilot header.
