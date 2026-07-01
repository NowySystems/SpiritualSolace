# PR53 Summary

## Title

Add structured requester intake for Grandview pilot

## Motivation

PR50 added Pilot Safe v1 schema/RLS. PR51 wired Supabase client/env foundation. PR52 added the `/pilot` auth and policy acceptance gate. PR53 adds the first real requester-path action: submitting a structured spiritual-care request to Grandview facility review.

## What changed

Added:

- `components/StructuredRequesterIntake.tsx`
- `supabase/migrations/202607010002_grandview_requester_intake_rpc.sql`
- `docs/PR53_SUMMARY.md`
- `docs/PR53_TEST_NOTES.md`

Updated:

- `components/PilotWorkspaceShell.tsx`

## Behavior

`/pilot` now shows a structured requester intake form after auth and policy acceptance.

The form allows only:

- Requester name.
- Requester role.
- Relationship, optional.
- Resident/person name.
- Room or unit, optional.
- Spiritual-care request type.
- Priority.
- Required no-medical-information acknowledgment.

The form does not include:

- Requester notes.
- Free-text request details.
- Medical fields.
- Emergency fields.
- Diagnosis, symptoms, medications, treatment details, chart notes, clinical instructions, or insurance fields.

## Backend

Adds `public.submit_grandview_spiritual_request(...)` as a SECURITY DEFINER RPC.

The RPC:

- Requires `auth.uid()`.
- Resolves the Grandview facility internally by slug.
- Inserts into `care_requests` with `source = 'requester_path'`.
- Forces `no_medical_information_acknowledged = true`.
- Inserts an initial `request_submitted` timeline event with no note.
- Does not accept a note parameter.

## Guardrails

- Grandview only for Pilot #001.
- No public facility picker.
- No partner routing.
- No facility queue yet.
- No partner workspace yet.
- No requester notes.
- No medical fields.
- No service-role/admin client.
- No frozen demo changes.

## Next PR

PR54 should add the Grandview facility review queue.
