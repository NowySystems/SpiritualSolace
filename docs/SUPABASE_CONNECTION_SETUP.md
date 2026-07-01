# Supabase Connection Setup

Date: 2026-07-01

## Purpose

This document connects the ChurchWork app repo to the existing Supabase project.

PR50 created the Pilot Safe v1 schema/RLS migration. PR51 adds the app-side environment variables and client helpers needed before auth and workflow screens are built.

## Required environment variables

Set these in local `.env.local` and in Vercel Project Settings > Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Where to find them:

- Supabase Dashboard.
- Project Settings.
- API.
- Project URL.
- anon public key.

## Deferred environment variable

```bash
SUPABASE_SERVICE_ROLE_KEY=
```

Do not add or use the service role key in browser code.

Service-role/admin operations are intentionally deferred until admin/server action patterns are reviewed.

## Client helpers added

- `lib/supabase/env.ts`
- `lib/supabase/browser.ts`
- `lib/supabase/server.ts`
- `lib/supabase/pilotHealth.ts`

## Dependency

PR51 adds:

```json
"@supabase/supabase-js": "^2.52.0"
```

Because package installation was not available in this environment, run this locally or in the build environment after merge:

```bash
npm install
```

This should refresh `package-lock.json`.

## Next steps after PR51

1. Add Supabase env values to Vercel.
2. Run `npm install` so the lockfile refreshes.
3. Apply the PR50 migration to the Supabase project.
4. Create PR52 for auth/session/policy acceptance routing.
5. Create PR53 for structured requester intake.

## Guardrails

- Do not use service-role keys in client components.
- Do not add requester notes.
- Do not add medical fields.
- Do not launch public QR flow until RLS and role tests pass.
