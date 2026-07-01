# PR52 Summary

## Title

Add pilot auth and policy acceptance gate

## Motivation

PR50 added Pilot Safe v1 schema/RLS. PR51 added Supabase client/env foundation. PR52 adds the first gated live-pilot shell so users must sign in and accept required policies before any future pilot workflow is shown.

## What changed

Added:

- `app/pilot/page.tsx`
- `components/PilotAuthGate.tsx`
- `components/PolicyAcceptanceGate.tsx`
- `components/PilotWorkspaceShell.tsx`
- `lib/pilotPolicies.ts`
- `docs/PR52_SUMMARY.md`
- `docs/PR52_TEST_NOTES.md`

## Behavior

`/pilot` now:

1. Requires Supabase email/password auth.
2. Shows pilot safety warnings before sign-in/sign-up.
3. Requires Pilot Safe v1 policy acknowledgments.
4. Inserts missing rows into `policy_acceptances`.
5. Shows a limited pilot shell after auth and policy acceptance.
6. Checks for the ChurchWork, Grandview Post Acute, and Hope Church seed organizations.

## Guardrails

- No requester intake yet.
- No facility queue yet.
- No partner workspace yet.
- No care request creation yet.
- No requester notes.
- No medical fields.
- No service-role/admin client.
- No changes to frozen demo routes.

## Next PR

PR53 should add structured requester intake for spiritual-care requests only.
