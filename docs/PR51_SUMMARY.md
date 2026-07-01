# PR51 Summary

## Title

Wire Supabase client and environment foundation

## Motivation

PR50 added the Pilot Safe v1 schema/RLS foundation. PR51 connects the app repo to the existing Supabase project at the environment and client-helper layer.

## What changed

Added:

- `.env.example`
- `lib/supabase/env.ts`
- `lib/supabase/browser.ts`
- `lib/supabase/server.ts`
- `lib/supabase/pilotHealth.ts`
- `docs/SUPABASE_CONNECTION_SETUP.md`
- `docs/PR51_TEST_NOTES.md`

Updated:

- `package.json` adds `@supabase/supabase-js`.

## Guardrails

- No auth UI yet.
- No policy acceptance UI yet.
- No requester intake UI yet.
- No facility queue UI yet.
- No partner workspace UI yet.
- No service-role/admin client in code.
- No frozen demo changes.

## Important follow-up

`package-lock.json` was not refreshed in this environment because package installation was not available.

After merge, run:

```bash
npm install
```

Then commit the refreshed lockfile before relying on `npm ci`.

## Next PR

PR52 should add the auth/session and policy acceptance gate.
