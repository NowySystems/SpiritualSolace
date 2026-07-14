# ChurchWork PWA and Play Store Readiness

## Current PR85 foundation

PR85 prepares ChurchWork as an installable PWA shell for Android, iOS, iPadOS, and tablet use.

Included now:

- Web app manifest at `/manifest.webmanifest`
- Standalone display mode
- `/pilot` as the install start URL
- App shortcuts for Pilot, Requester, Facility, and Partner
- Actual ChurchWork logo asset for icon references
- Apple web app metadata
- Safe-area CSS for iPhone/iPad notches and home indicators
- Touch-friendly global CSS
- Offline fallback page at `/offline`
- Non-blocking service worker registration
- Conservative shell service worker caching
- No private/API/Supabase data caching
- Android/Chrome install helper
- iOS Add-to-Home-Screen helper text

## Near-term PWA checklist

Before using this in a live pilot:

1. Confirm the site is served over HTTPS.
2. Confirm `/manifest.webmanifest` loads with the correct MIME type.
3. Confirm `/sw.js` registers in production.
4. Run Lighthouse PWA checks on Android Chrome.
5. Test Add to Home Screen on Android Chrome.
6. Test Add to Home Screen on iPhone Safari.
7. Test Add to Home Screen on iPad Safari.
8. Confirm installed app opens to `/pilot?source=pwa`.
9. Confirm portal shortcuts open the correct role surfaces.
10. Confirm offline mode shows `/offline` and does not expose private data.
11. Confirm all primary buttons remain large enough for older users on phones.
12. Confirm facility sidebar collapses/behaves acceptably on phone width before live staff use.

## Play Store runway

The future Android Play Store path should likely be a Trusted Web Activity style wrapper around the PWA, not a custom native rebuild.

To prepare for that later:

1. Keep ChurchWork PWA installable and Lighthouse-clean.
2. Use stable production domain and HTTPS.
3. Generate proper icon assets:
   - 192x192
   - 512x512
   - maskable 512x512
   - adaptive Android foreground/background if packaging later
4. Add Digital Asset Links later when the Android package name is known.
5. Decide the Android package name, likely something like `com.churchwork.app`.
6. Package with a Trusted Web Activity workflow later.
7. Test on real Android phone and Android tablet before store submission.
8. Prepare store listing assets:
   - app icon
   - screenshots
   - short description
   - full description
   - privacy policy URL
   - support contact
9. Do not enable push notifications until data/privacy rules are finalized.
10. Do not cache request data or Supabase API responses in the service worker.

## Current intentional limitations

- No push notifications yet.
- No background sync yet.
- No native Android wrapper yet.
- No dedicated generated app icon sizes yet.
- No Play Store package metadata yet.
- No Digital Asset Links yet.
- No app store listing assets yet.

## Product rule

ChurchWork PWA should feel like an app, but it must stay privacy-safe. Cache shell/assets only. Live care coordination data should require a current secure connection and valid Supabase access.
