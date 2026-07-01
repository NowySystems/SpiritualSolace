# PR51 Test Notes

Date: 2026-07-01

## Scope

PR51 wires the repository to an existing Supabase project at the app foundation level.

Included:

- `@supabase/supabase-js` added to `package.json`.
- `.env.example` added.
- Supabase browser/server client helpers added.
- Pilot health helper added.
- Supabase setup documentation added.

Excluded:

- No auth UI.
- No policy acceptance UI.
- No requester intake UI.
- No facility queue UI.
- No partner workspace UI.
- No service-role/admin client.
- No frozen demo changes.

## Source-level checks

- Browser helper imports only public Supabase env values.
- Server helper uses anon key only.
- Service role use is documented as deferred.
- Pilot health helper reads expected seed organizations from the PR50 migration.

## Not executed in this environment

- `npm install`.
- `npm run typecheck`.
- `npm run build`.
- Supabase connection test.

Package installation is required after merge to refresh `package-lock.json`.
