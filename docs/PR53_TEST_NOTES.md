# PR53 Test Notes

Date: 2026-07-01

## Scope

PR53 adds the first real requester-path care request creation for the Grandview pilot.

Included:

- Structured requester intake form on `/pilot` after auth and policy acceptance.
- Grandview-specific requester intake RPC.
- Initial timeline event creation.

Excluded:

- No facility review queue.
- No partner workspace.
- No partner assignment.
- No public QR launch.
- No requester note field.
- No medical fields.
- No service-role/admin client.
- No frozen demo changes.

## Source-level checks

- No requester note input exists in `StructuredRequesterIntake`.
- No free-text request details box exists.
- Request types are fixed select options.
- Priority is fixed select options.
- Submission requires no-medical-information acknowledgment.
- RPC does not accept a note parameter.
- RPC forces `no_medical_information_acknowledged = true`.
- RPC inserts initial timeline event with `non_medical_note = null`.

## Manual test plan after merge

1. Confirm PR50 and PR53 migrations are applied in Supabase.
2. Confirm Supabase env vars are present.
3. Visit `/pilot`.
4. Sign in as a named user.
5. Accept required policies.
6. Submit a structured request with no note.
7. Confirm a row is created in `care_requests`.
8. Confirm `requester_user_id` equals the signed-in user.
9. Confirm `facility_id` belongs to Grandview Post Acute.
10. Confirm `no_medical_information_acknowledged = true`.
11. Confirm a `request_submitted` timeline event exists.
12. Confirm `timeline_events.non_medical_note` is null.

## Not executed in this environment

- Supabase migration run.
- Browser submit test.
- `npm install`.
- `npm run typecheck`.
- `npm run build`.
- RLS integration test.
