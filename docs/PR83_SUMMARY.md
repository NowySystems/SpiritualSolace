# PR83: Final facility section

## Motivation

Requester is good enough for now. This PR moves to the next pilot section: the Facility workspace.

The Facility experience should feel like a real review console, not a generic dashboard and not the old guided demo surface.

## Description

Adds:

- `components/pilot-final/FacilitySidebar.tsx`
- `components/pilot-final/FacilityPortalFinal.tsx`
- `docs/PR83_SUMMARY.md`

Updates:

- `app/facility-portal/page.tsx`

## Behavior

`/facility-portal` now renders the new final Facility section:

- actual ChurchWork logo through the shared final top bar,
- facility-specific dark green sidebar,
- Grandview Post Acute workspace identity,
- request review console,
- status path,
- request snapshot,
- consent and partner-sharing state,
- facility activity record,
- review action panel,
- sharing boundary panel,
- no demo auto-scroll wrapper,
- no legacy guided dashboard component.

## Guardrails

- Static/local pilot data only.
- Facility actions are visual/local for this slice; Supabase wiring comes later.
- No Supabase schema changes.
- No requester route changes beyond the stacked PR82 foundation.
- No partner route changes.
- No demo-flow changes.
- No owner/admin work.
- No functional workflow persistence yet.

## Testing

1. Open `/facility-portal`.
2. Confirm the old guided facility dashboard is replaced.
3. Confirm the actual ChurchWork logo appears in the top bar.
4. Confirm the facility view has a sidebar.
5. Confirm the sidebar clearly identifies Grandview Post Acute.
6. Confirm the review console shows request snapshot, consent, sharing, status path, activity record, and action panel.
7. Confirm the page follows the generated render direction: dark top bar, deep green sidebar, white work cards, mint/teal surfaces, and gold sharing guardrails.
8. Confirm the existing access gate still wraps the page.
