# PR75: Hope Church partner assignment prep

## Motivation

After Grandview marks a request `partner_ready`, ChurchWork needs a controlled, human-reviewed bridge into Hope Church without auto-routing, open chat, or free-text notes.

This PR creates that bridge while keeping partner workflow read-only for now.

## Description

Adds:

- `supabase/migrations/202607090003_hope_partner_assignment_prep.sql`
- `components/HopePartnerAssignmentQueue.tsx`
- `docs/PR75_SUMMARY.md`

Updates:

- `components/GrandviewFacilityReviewQueue.tsx`
- `components/PilotWorkspaceShell.tsx`

## Backend behavior

Adds `public.assign_grandview_request_to_hope(uuid)`:

- Requires authentication.
- Requires owner/platform admin access.
- Resolves Grandview internally by slug.
- Resolves Hope Church internally by slug.
- Requires the request status to be `partner_ready`.
- Creates or refreshes a Hope Church partner assignment.
- Updates the care request status to `partner_assigned`.
- Inserts a `partner_assigned` timeline event with:
  - `visibility = 'shared'`,
  - `sharing_level = 'partner_safe'`,
  - `non_medical_note = null`.
- Writes an audit log record.

Adds `public.get_hope_partner_assignment_queue()`:

- Requires authentication.
- Allows owner/platform admin or Hope Church partner admin/user.
- Returns assigned Hope Church requests with partner-safe fields only:
  - resident/person display name,
  - room/unit,
  - request type,
  - priority,
  - request status,
  - facility name,
  - assigned date,
  - partner-safe timeline metadata.

Replaces `public.get_grandview_facility_review_queue()` to also return:

- `can_assign_to_hope`, true only for owner/platform admin users.
- `partner_assigned` requests in the Grandview queue for visibility after assignment.

## UI behavior

Grandview Facility tab:

- Shows `Assign to Hope` only when:
  - the signed-in user can assign to Hope, and
  - the request is `partner_ready`.

Hope Partner tab:

- Shows a read-only Hope Church assignment queue.
- Shows partner-safe assigned request cards.
- Keeps partner next actions as a placeholder for the next PR.

## Guardrails

- No auto-routing.
- No facility-to-partner free-text notes.
- No partner free-text notes.
- No open chat.
- No medical fields.
- No requester notes.
- No partner acceptance/scheduling/completion actions yet.
- No notifications yet.
- No donation or Worship From Home work.

## Testing

After applying migrations and deploying:

1. Submit a requester intake item.
2. From Grandview queue, mark it partner ready.
3. Sign in as Cole/Sam owner/admin.
4. Confirm `Assign to Hope` appears only on `partner_ready` requests.
5. Click `Assign to Hope` and confirm the request becomes `partner_assigned`.
6. Confirm a Hope assignment exists.
7. Sign in as a Hope partner user and confirm the partner queue loads.
8. Confirm the Hope queue does not show requester notes, medical fields, or chat.
9. Confirm non-Hope partner users cannot load the Hope queue.
