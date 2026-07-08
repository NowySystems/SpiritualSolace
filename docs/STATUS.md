# SpiritualSolace / ChurchWork Status

_Last updated: 2026-07-08_

## Repo

- Repository: `LL-COLE-J/SpiritualSolace`
- Visibility: private
- Default branch: `main`
- Current working source of truth: `main`
- Open PRs checked: none found

## Current product state

SpiritualSolace is currently the ChurchWork pilot sandbox / Care Binder prototype. The app is still framed as a demo-only, human-reviewed spiritual-care coordination system, not an emergency, clinical, or automated outreach system.

The active pilot workspace is organized into four top-level areas:

1. **Overview** — seed check, pilot paths, sandbox reminders, and current role/path status.
2. **Owner/Admin** — owner/admin access center for users, requests, role buckets, and timeline oversight.
3. **Facility** — facility signup and facility user management.
4. **Requester** — structured spiritual-care request intake.

## Recently completed

- PR64 merged the Pilot Workspace V1 shell.
- PR65 updated the landing page brand hierarchy.
- PR66 fixed the landing visual section.
- PR67–PR71 focused on CW logo asset/rendering cleanup.
- Latest main commit: `Fix CW logo asset fit (#71)`.

## Current behavior / guardrails

- No new database migration was introduced by the Pilot Workspace shell.
- No service-role key was added.
- Existing RLS / permission checks remain inside the underlying components.
- Sandbox reminder remains visible.
- All sandbox data should remain fake until role membership, RLS testing, facility review, partner assignment, and timeline visibility are complete.

## Known mismatch to clean up

README currently says Cloudflare adapter work is parked and future Cloudflare work should happen after Vercel stability. However, `package.json` still includes OpenNext/Cloudflare scripts and dependencies:

- `build:cloudflare`
- `preview:cloudflare`
- `@opennextjs/cloudflare`
- `wrangler`

Decision needed: either remove/park those package entries to match README, or update README if Cloudflare support is intentionally back in scope.

## Next practical PRs

1. **Role-default landing behavior**
   - Send signed-in users to the correct workspace by role/path instead of making everyone manually choose.

2. **Partner path V1**
   - Add partner signup.
   - Add partner admin user management.
   - Create partner-safe workspace behavior.

3. **Facility request review queue**
   - Let facility users review spiritual-care requests routed to their organization.
   - Keep human approval explicit.

4. **Label polish pass**
   - Remove raw system labels / underscores wherever user-facing labels still leak through.
   - Tighten owner/admin and timeline language.

5. **Deployment alignment**
   - Confirm Vercel is green.
   - Decide whether Cloudflare is parked or active.
   - Bring README and `package.json` into agreement.

## Suggested immediate move

Make the next PR a small cleanup/continuity PR:

**PR72: Align deployment status and pilot next steps**

Scope:

- Resolve the README vs `package.json` Cloudflare mismatch.
- Add/update this status file as the project checkpoint.
- Do not change database schema.
- Do not change Supabase policies.
- Do not touch role logic yet.

After that, move into role-default landing behavior as the next product PR.
