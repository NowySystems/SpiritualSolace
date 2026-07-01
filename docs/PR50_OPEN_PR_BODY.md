# PR50: Pilot Safe v1 foundation

## Motivation

ChurchWork has moved from demo validation into Pilot #001 preparation with Grandview Post Acute and Hope Church.

This PR creates the first pilot-safe backend, policy, launch, and theme foundation before live signup, QR distribution, or real request submission.

## Description

Adds Pilot Safe v1 documentation:

- `docs/CHURCHWORK_PILOT_SAFE_V1.md`
- `docs/PILOT_POLICIES.md`
- `docs/PILOT_LAUNCH_CHECKLIST.md`
- `docs/PILOT_THEMING_DIRECTION.md`
- `docs/PR50_ROLLOUT_SEQUENCE.md`
- `docs/PR50_SUMMARY.md`
- `docs/PR50_TEST_NOTES.md`

Adds Supabase migration:

- `supabase/migrations/202607010001_pilot_safe_foundation.sql`

The migration creates:

- Organizations
- Facilities
- Partner organizations
- Profiles
- Role memberships
- Structured care requests
- Partner assignments
- Timeline events
- Template actions
- Policy documents
- Policy acceptances
- Audit logs
- RLS helper functions and policies
- Seed records for ChurchWork, Grandview Post Acute, and Hope Church

## Guardrails

- No frozen demo UI changes.
- No requester free-text notes.
- No medical fields on care requests.
- Request creation requires `no_medical_information_acknowledged = true`.
- Facility and partner notes are limited to non-medical coordination notes on timeline events.
- Partner access is limited to assigned partner-safe request context.
- Requester access is limited to their own request and requester/shared timeline visibility.
- No Stripe or donation work.
- No live nearby-church lookup.
- No two-way messaging.
- No public QR launch.

## Testing

Source-level checks completed:

- Confirmed branch is ahead of `main` and does not modify frozen demo UI files.
- Confirmed changed files are limited to docs and one Supabase migration.
- Reviewed migration shape for requester no-notes/no-medical-fields guardrails.

Not executed in this environment:

- Supabase CLI migration run.
- Postgres syntax execution.
- RLS integration tests.
- Next.js build or lint.

Before live pilot deployment, apply and test the migration in a Supabase project and verify RLS behavior with owner, Grandview facility, Hope Church partner, and requester accounts.
