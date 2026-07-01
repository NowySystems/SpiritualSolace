# PR52 Test Notes

Date: 2026-07-01

## Scope

PR52 adds a gated `/pilot` shell with Supabase auth and Pilot Safe v1 policy acceptance.

Included:

- Supabase email/password sign-in and sign-up gate.
- Required Pilot Safe v1 policy list.
- Policy acceptance lookup.
- Missing policy acceptance insertion.
- Signed-in shell showing requester/facility/partner next-step cards.
- Seed organization check for ChurchWork, Grandview Post Acute, and Hope Church.

Excluded:

- No requester intake.
- No facility queue.
- No partner workspace.
- No care request creation.
- No role-membership UI.
- No service-role/admin client.
- No frozen demo changes.

## Source-level checks

- Requester notes were not added.
- Medical fields were not added.
- `/pilot` uses Supabase browser client only.
- Policy acceptances insert only for `session.user.id`.
- Required policy keys match PR50 migration seed keys.

## Manual test plan after merge

1. Add Supabase env vars in Vercel/local `.env.local`.
2. Run `npm install` to refresh `package-lock.json` if not already done.
3. Apply PR50 migration to the Supabase project.
4. Visit `/pilot`.
5. Create or sign in with a named pilot account.
6. Accept required Pilot Safe v1 policies.
7. Confirm `policy_acceptances` rows are created for the user.
8. Confirm the pilot shell appears.
9. Confirm seed organization check returns ChurchWork, Grandview Post Acute, and Hope Church for an authorized user.

## Not executed in this environment

- `npm install`.
- `npm run typecheck`.
- `npm run build`.
- Browser sign-in test.
- Supabase RLS integration test.
