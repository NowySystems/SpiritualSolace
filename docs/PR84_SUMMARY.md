# PR84: Final partner section

## Motivation

Requester and Facility have been moved to the final pilot surface direction. This PR completes the third role surface: Partner.

The Partner experience should feel like a focused assignment workspace, not a generic dashboard and not the old guided demo surface.

## Description

Adds:

- `components/pilot-final/PartnerPortalFinal.tsx`
- `docs/PR84_SUMMARY.md`

Updates:

- `app/partner-portal/page.tsx`

## Behavior

`/partner-portal` now renders the new final Partner section:

- actual ChurchWork logo through the shared final top bar,
- Hope Church partner workspace identity,
- lightweight partner navigation,
- assigned/scheduled/completed/follow-up lanes,
- current assignment surface,
- status path,
- approved partner-safe context,
- report-back actions,
- partner-safe rule panel,
- no demo auto-scroll wrapper,
- no legacy guided dashboard component.

## Guardrails

- Static/local pilot data only.
- Partner actions are visual/local for this slice; Supabase wiring comes later.
- No Supabase schema changes.
- No requester route changes.
- No facility route changes.
- No demo-flow changes.
- No owner/admin work.
- No functional workflow persistence yet.

## Testing

1. Open `/partner-portal`.
2. Confirm the old guided partner dashboard is replaced.
3. Confirm the actual ChurchWork logo appears in the top bar.
4. Confirm the partner view identifies Hope Church.
5. Confirm the workspace shows assignment lanes and approved context only.
6. Confirm report-back actions are visible but local/static.
7. Confirm the page follows the generated render direction: dark top bar, green partner rail, white work cards, mint surfaces, and gold sharing guardrails.
8. Confirm the existing access gate still wraps the page.
