# PR85: PWA readiness

## Motivation

ChurchWork is being shaped as a mobile/tablet-friendly pilot surface, not just a desktop web app. The requester, facility, partner, and internal pilot launchpad need to be ready for Android phones, Android tablets, iPhone, and iPad usage.

## Description

Adds:

- `public/manifest.webmanifest`
- `public/sw.js`
- `components/ChurchWorkPwaRegister.tsx`
- `app/pwa.css`
- `docs/PR85_SUMMARY.md`

Updates:

- `app/layout.tsx`

## Behavior

This pass adds the PWA shell foundation:

- ChurchWork web app manifest,
- standalone display mode,
- `/pilot` as the install start URL,
- shortcuts for Pilot, Requester, Facility, and Partner,
- app theme/background colors matching the final pilot direction,
- actual ChurchWork logo asset used for PWA icon references,
- Apple web app metadata,
- viewport safe-area support for iOS notch/home-indicator devices,
- non-blocking service worker registration,
- conservative service worker shell caching.

## Guardrails

- No Supabase schema changes.
- No portal workflow changes.
- No private/API data caching.
- No forced mobile zoom lockout.
- No push notifications yet.
- No background sync yet.
- No native app wrapper yet.

## Testing

1. Deploy PR preview.
2. Open Chrome DevTools Lighthouse/PWA check.
3. Confirm manifest is detected.
4. Confirm service worker registers in production build.
5. Confirm Android Chrome can show install prompt or Add to Home Screen.
6. Confirm iOS Safari can Add to Home Screen and opens with ChurchWork title/icon.
7. Confirm `/pilot` opens as the PWA start URL.
8. Confirm `/requester-portal`, `/facility-portal`, and `/partner-portal` still render normally.
9. Confirm offline behavior does not expose private/API data and only falls back to cached app shell.
