# PR86: Admin Portal access hub

## Motivation

After PWA setup, the installed app can restore a signed-in session and feel like it drops into a user/profile flow. Cole and Sam need a true Admin Portal / operator access hub that opens every pilot role surface quickly.

This is not the future KPI/admin analytics dashboard. It is the practical pilot control entry point.

## Description

Adds:

- `components/AdminPortalAccessHub.tsx`
- `app/admin/page.tsx`
- `docs/PR86_SUMMARY.md`

Updates:

- `app/pilot/page.tsx`
- `components/LandingPageV1.tsx`
- `public/manifest.webmanifest`
- `public/sw.js`

## Behavior

- `/admin` is now the Admin Portal / Operator Access Hub.
- `/pilot` now renders the same Admin Portal hub.
- PWA start URL now opens `/admin?source=pwa`.
- Public landing page primary CTA now points to `/admin`.
- Admin hub has direct cards for:
  - Requester Portal,
  - Facility Portal,
  - Partner Portal,
  - Landing Page.
- Admin hub preserves existing pilot tools behind local tabs:
  - Owner/Admin tools,
  - Facility setup,
  - Requester intake tool.
- Service worker shell cache now includes `/admin`.

## Guardrails

- No Supabase schema changes.
- No new role/RLS rules yet.
- No KPI dashboard yet.
- No private/API/Supabase data caching.
- No requester/facility/partner surface rewrites.
- Admin hub is for controlled pilot operation and testing.

## Testing

1. Open `/admin` while signed out and confirm auth gate appears.
2. Sign in and confirm Admin Portal opens.
3. Confirm direct cards open Requester, Facility, Partner, and Landing Page.
4. Open `/pilot` and confirm it shows the same Admin Portal hub.
5. Install/open PWA and confirm it starts at `/admin?source=pwa`.
6. Confirm public landing page top CTA and hero CTA say Admin Portal.
7. Confirm existing owner/admin, facility setup, and requester intake tools still exist inside Admin tools.
8. Confirm `/requester-portal`, `/facility-portal`, and `/partner-portal` still render normally.
