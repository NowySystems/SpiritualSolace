# PR50 Summary

## Title

Pilot Safe v1 foundation for Grandview + Hope Church

## Motivation

ChurchWork has moved from demo validation into Pilot #001 preparation with Grandview Post Acute and Hope Church.

This PR creates the first pilot-safe foundation before live signup, QR distribution, or real request submission.

## What changed

Added docs:

- `docs/CHURCHWORK_PILOT_SAFE_V1.md`
- `docs/PILOT_POLICIES.md`
- `docs/PILOT_LAUNCH_CHECKLIST.md`
- `docs/PILOT_THEMING_DIRECTION.md`
- `docs/PR50_TEST_NOTES.md`

Added backend migration:

- `supabase/migrations/202607010001_pilot_safe_foundation.sql`

## Backend foundation

The migration adds:

- `organizations`
- `facilities`
- `partner_organizations`
- `profiles`
- `role_memberships`
- `care_requests`
- `request_partner_assignments`
- `timeline_events`
- `template_actions`
- `policy_documents`
- `policy_acceptances`
- `audit_logs`

It also adds:

- RLS helper functions.
- RLS policies.
- Seed records for ChurchWork, Grandview Post Acute, and Hope Church.
- Pilot policy document keys.

## Core guardrails

- Requester path is structured only.
- Requester cannot enter notes.
- No medical fields exist on `care_requests`.
- `no_medical_information_acknowledged` is required for request creation.
- Facility and partner notes are limited to non-medical coordination notes on timeline events.
- Partner access is limited to assigned partner-safe request context.
- Requester access is limited to their own request and requester/shared timeline visibility.

## Not included

- No frozen demo changes.
- No frontend auth wiring yet.
- No Supabase dependency added to `package.json` yet.
- No Stripe or donations work.
- No live nearby-church lookup.
- No two-way messaging.
- No public QR launch.

## Testing notes

Source-level checks only.

Not executed in this environment:

- Supabase CLI migration run.
- Postgres syntax execution.
- RLS integration tests.
- Next.js build or lint.

Before live pilot deployment, apply and test the migration in a Supabase project and verify RLS behavior with owner, facility, partner, and requester accounts.
