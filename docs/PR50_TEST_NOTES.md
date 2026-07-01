# PR50 Test Notes

Date: 2026-07-01

## Source-level checks completed

- Confirmed branch is ahead of `main` by 3 commits.
- Confirmed this PR does not modify frozen demo UI files.
- Confirmed changed files are limited to:
  - `docs/CHURCHWORK_PILOT_SAFE_V1.md`
  - `docs/PILOT_POLICIES.md`
  - `supabase/migrations/202607010001_pilot_safe_foundation.sql`

## Migration review notes

The migration intentionally creates backend foundation only:

- Organizations.
- Facilities.
- Partner organizations.
- Profiles.
- Role memberships.
- Structured care requests.
- Partner assignments.
- Timeline events.
- Template actions.
- Policy documents.
- Policy acceptances.
- Audit logs.
- RLS helper functions and policies.
- Seed records for ChurchWork, Grandview Post Acute, and Hope Church.

## Guardrail checks

- No requester free-text note column exists on `care_requests`.
- No medical fields exist on `care_requests`.
- `care_requests.no_medical_information_acknowledged` is required to be `true`.
- Facility and partner notes are limited to `timeline_events.non_medical_note` and documented as non-medical coordination notes only.
- Partner timeline access is limited to partner/shared visibility and partner-safe/shared timeline levels.
- Requester timeline access is limited to requester/shared visibility for their own request.

## Not executed in this environment

- Supabase CLI migration run.
- Postgres syntax execution.
- RLS integration tests.
- Next.js build or lint.

These should be run in the target Supabase/local environment before live pilot deployment.
