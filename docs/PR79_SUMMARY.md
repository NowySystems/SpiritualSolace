# PR79: ChurchWork PWA foundation

## Motivation

ChurchWork should be easy to access on phones during pilot testing without requiring an App Store or Play Store release. A lightweight PWA gives users an app-like launcher icon, standalone display mode, theme colors, and basic shell caching.

## Description

Adds:

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/pwa/icon.svg`
- `public/pwa/maskable-icon.svg`
- `components/ChurchWorkServiceWorkerRegistrar.tsx`
- `docs/PR79_SUMMARY.md`

Updates:

- `app/layout.tsx`

## Behavior

The app now includes:

- web app manifest metadata,
- standalone display mode,
- ChurchWork app name and short name,
- theme/background colors,
- SVG app icons,
- requester and pilot shortcuts,
- production-only service worker registration,
- conservative shell caching for app routes/icons/manifest.

## Service worker guardrails

The service worker intentionally avoids caching:

- non-GET requests,
- cross-origin requests,
- `/api/*`,
- `/auth/*`,
- Supabase-like paths,
- hot reload routes.

This keeps the first PWA layer focused on installability and shell resilience rather than offline care-data behavior.

## Guardrails

- No Supabase changes.
- No care workflow changes.
- No demo changes.
- No auth changes.
- No offline care-record storage.
- No push notifications yet.
- No background sync yet.
- PNG maskable icons can be added later if Lighthouse/Android install requirements demand them.

## Testing

After deployment to production/preview over HTTPS:

1. Open Chrome on Android.
2. Visit the ChurchWork URL.
3. Confirm browser offers install/add-to-home-screen.
4. Install the app.
5. Confirm ChurchWork opens in standalone display mode.
6. Confirm the app uses the ChurchWork icon/theme.
7. Confirm requester portal still loads normally.
8. Confirm demo still runs normally.
9. Confirm Supabase/auth/API activity is not being served from stale cache.
10. Run Lighthouse PWA checks and note whether PNG icons are required as a follow-up.
