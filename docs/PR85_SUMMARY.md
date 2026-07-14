# PR85: PWA readiness

## Motivation

ChurchWork is being shaped as a mobile/tablet-friendly pilot surface, not just a desktop web app. The requester, facility, partner, and internal pilot launchpad need to be ready for Android phones, Android tablets, iPhone, and iPad usage.

This also sets the foundation for a future Android Play Store path without forcing a native rebuild too early.

## Description

Adds:

- `public/manifest.webmanifest`
- `public/sw.js`
- `components/ChurchWorkPwaRegister.tsx`
- `components/ChurchWorkInstallPrompt.tsx`
- `app/offline/page.tsx`
- `app/pwa.css`
- `docs/PR85_SUMMARY.md`
- `docs/PWA_PLAY_STORE_READINESS.md`

Updates:

- `app/layout.tsx`

## Behavior

This pass adds the PWA shell foundation:

- ChurchWork web app manifest,
- stable app id and start URL,
- standalone display mode,
- `/pilot?source=pwa` as the install start URL,
- shortcuts for Pilot, Requester, Facility, and Partner,
- app theme/background colors matching the final pilot direction,
- actual ChurchWork logo asset used for PWA icon references,
- Apple web app metadata,
- viewport safe-area support for iOS notch/home-indicator devices,
- touch-friendly CSS,
- Android/Chrome install helper,
- iOS Add-to-Home-Screen guidance,
- offline fallback page,
- non-blocking service worker registration,
- conservative service worker shell caching.

## Guardrails

- No Supabase schema changes.
- No portal workflow changes.
- No private/API/Supabase data caching.
- No forced mobile zoom lockout.
- No push notifications yet.
- No background sync yet.
- No native app wrapper yet.
- No Play Store package metadata yet.

## Testing

1. Deploy PR preview.
2. Open Chrome DevTools Lighthouse/PWA check.
3. Confirm manifest is detected.
4. Confirm service worker registers in production build.
5. Confirm Android Chrome can show install prompt or Add to Home Screen.
6. Confirm iOS Safari can Add to Home Screen and opens with ChurchWork title/icon.
7. Confirm `/pilot?source=pwa` opens as the PWA start URL.
8. Confirm app shortcuts open Pilot, Requester, Facility, and Partner.
9. Confirm `/requester-portal`, `/facility-portal`, and `/partner-portal` still render normally.
10. Confirm offline behavior shows `/offline` and does not expose private/API data.
11. Confirm zoom remains available for accessibility.
12. Confirm the install helper can be dismissed and does not block core portal use.
