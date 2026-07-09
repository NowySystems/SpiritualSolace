# PR74: Grandview facility review queue

## Motivation

Grandview needs more than requester intake. Facility users need a safe review queue where they can see structured spiritual-care requests and move them forward with controlled button-only actions.

This must not introduce open chat, requester notes, medical fields, partner routing, or free-form care details.

## Description

Adds:

- `supabase/migrations/202607090002_grandview_facility_review_queue.sql`
- `components/GrandviewFacilityReviewQueue.tsx`
- `docs/PR74_SUMMARY.md`

Updates:

- `components/PilotWorkspaceShell.tsx`

## Backend behavior

Adds `public.get_grandview_facility_review_queue()`:

- Requires authentication.
- Resolves Grandview internally by slug.
- Allows owner/platform admin or Grandview facility admin/staff.
- Returns active queue requests with structured request fields only.
- Returns facility/shared timeline metadata only.
- Does not return requester notes because requester notes do not exist.
- Does not return medical fields because medical fields do not exist.

Adds `public.update_grandview_facility_review_status(uuid, text)`:

Allowed actions:

- `start_facility_review` → `facility_review`
- `mark_partner_ready` → `partner_ready`
- `pause_request` → `paused`
- `close_request` → `closed`

Each action:

- Requires Grandview facility access or owner/admin access.
- Updates request status.
- Inserts a timeline event with `non_medical_note = null`.
- Writes an audit log record.

## UI behavior

The Facility tab will include a Grandview review queue card showing:

- requester name/role,
- resident/person name,
- room/unit,
- request type,
- priority,
- status,
- source,
- created date,
- safe button-only status actions.

## Guardrails

- No medical fields.
- No requester notes.
- No free-text facility notes in this PR.
- No partner assignment.
- No partner notification.
- No open chat.
- No emergency workflow.
- No donation or Worship From Home work.

## Testing

After applying migrations and deploying:

1. Submit a requester intake item.
2. Sign in as Grandview facility admin/staff.
3. Confirm the queue loads.
4. Click Start review and confirm status becomes `facility_review`.
5. Click Mark ready and confirm status becomes `partner_ready`.
6. Click Pause and confirm status becomes `paused`.
7. Click Close and confirm status becomes `closed`.
8. Confirm no text note field appears in the facility queue.
9. Confirm non-Grandview users cannot load the queue.
