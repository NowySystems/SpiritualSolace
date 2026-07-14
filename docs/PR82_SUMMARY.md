# PR82: Final requester portal surface

## Motivation

The generated three-portal render is now the visual target for the pilot. To avoid another CSS override spiral, this PR starts the rebuild as clean React components instead of trying to keep polishing the old guided demo surface.

Step 1 focuses only on the requester portal because it has the simplest role rule: no sidebar, calm status page, approved updates only.

## Description

Adds:

- `components/pilot-final/types.ts`
- `components/pilot-final/data.ts`
- `components/pilot-final/PilotTopBar.tsx`
- `components/pilot-final/StatusPath.tsx`
- `components/pilot-final/RequesterPortalFinal.tsx`
- `docs/PR82_SUMMARY.md`

Updates:

- `app/requester-portal/page.tsx`

## Behavior

`/requester-portal` now renders the new final requester surface:

- dark ChurchWork top bar,
- requester-specific calm hero,
- current status card/path,
- request summary,
- approved updates only,
- access boundary card,
- contact facility action,
- no sidebar,
- no demo auto-scroll wrapper,
- no legacy guided dashboard component.

## Guardrails

- Static pilot data only.
- No Supabase schema changes.
- No facility/partner route changes.
- No demo-flow changes.
- No owner/admin work.
- No functional workflow wiring yet.

## Testing

1. Open `/requester-portal`.
2. Confirm the old guided requester dashboard is replaced.
3. Confirm the requester view has no sidebar.
4. Confirm the requester sees only approved/requester-safe information.
5. Confirm the page follows the generated render direction: dark top bar, calm cream/gold requester lane, white work cards, and clear status path.
6. Confirm the existing access gate still wraps the page.
