# PR88: Update PWA app icons

## Motivation

The installed ChurchWork phone icon looked cramped because the PWA manifest and app metadata still pointed at the regular corner logo asset. The installed app icon should use a roomier, phone-icon-safe version that visually matches the ChurchWork logo.

## Description

Adds app icon assets:

- `public/brand/churchwork-app-icon-192.png`
- `public/brand/churchwork-app-icon-512.png`
- `public/brand/churchwork-app-icon-maskable-512.png`
- `public/brand/apple-touch-icon.png`

Updates:

- `public/manifest.webmanifest`
- `app/layout.tsx`
- `public/sw.js`

## Behavior

- New installs use the roomier ChurchWork app icon.
- Android/Chrome PWA manifest points to the app icon assets instead of the corner logo.
- iOS metadata points to `apple-touch-icon.png`.
- Service worker cache version is bumped to refresh the shell/icon assets.

## Device behavior note

Existing installed PWAs may keep the old icon because Android/iOS can cache manifest and icon assets aggressively. The reliable refresh path is:

1. Remove the current ChurchWork app icon from the phone home screen.
2. Open the deployed site again in Chrome/Safari.
3. Add/install the app again.

## Guardrails

- No routing changes.
- No auth changes.
- No Supabase changes.
- No PWA prompt behavior changes.
