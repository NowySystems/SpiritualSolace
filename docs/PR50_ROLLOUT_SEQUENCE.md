# PR50 Rollout Sequence

Date: 2026-07-01

## Phase 0: Keep demo frozen

- Do not change the public landing demo unless something is broken.
- Do not merge overlapping requester-demo work from PR49 without inspection.
- Treat PR50 as the first Pilot Safe v1 foundation branch.

## Phase 1: Review and merge foundation

- Review pilot docs.
- Review migration schema and RLS direction.
- Confirm Grandview/Hope pilot names are correct.
- Merge PR50 after review.

## Phase 2: Supabase project setup

- Create or confirm Supabase project.
- Add required environment variables to Vercel.
- Apply migration to a test Supabase project.
- Fix any Postgres/RLS issues before production deploy.

## Phase 3: Auth and role wiring

- Add Supabase client dependency.
- Add sign-in/sign-up routes.
- Add profile creation.
- Add policy acceptance gate.
- Add role-based routing.

## Phase 4: Live pilot app surfaces

Build new live pilot surfaces without disrupting the frozen demo:

- Requester structured intake.
- Facility request queue.
- Partner request view.
- Shared timeline.
- Admin membership assignment.

## Phase 5: Security testing

Test named accounts for:

- Owner/platform admin.
- Grandview facility admin.
- Grandview facility staff.
- Hope Church partner admin.
- Hope Church partner user.
- Requester.

Verify:

- Requester cannot see other requests.
- Facility cannot see unrelated facilities.
- Partner cannot see facility-internal notes.
- Partner only sees assigned partner-safe requests.
- Timeline visibility matches role/lens.
- No requester notes exist.
- No medical fields exist.

## Phase 6: QR and packet launch

- Finalize QR destination.
- Draft and approve Grandview packet language.
- Draft flyer language.
- Test QR on mobile.
- Launch with limited monitoring.

## Phase 7: Feedback and next sprint

- Capture Grandview feedback.
- Capture Hope Church feedback.
- Capture requester friction.
- Review timeline data quality.
- Decide next build list after real pilot use.
