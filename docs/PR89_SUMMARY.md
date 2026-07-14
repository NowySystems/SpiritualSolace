# PR89: Admin install prompt reset

## Motivation

During Android PWA testing, uninstalling the home-screen app did not bring the custom install prompt back. The likely cause is Chrome keeping site localStorage after the home-screen app is removed. A previously signed-in dismissal can remain stored as `churchwork:pwa-install-dismissed = true`.

## Behavior

This update makes the install helper more resilient for testing:

- `/admin` and `/pilot` ignore the old persistent signed-in dismissal.
- Admin/Pilot can show install help again after uninstall/reinstall testing.
- The prompt can still be dismissed for the current page visit.
- Other signed-in user routes keep the persistent dismissal behavior.
- Installed/standalone PWA mode still suppresses the prompt.

## Notes

If Chrome does not fire the native `beforeinstallprompt` event, the browser menu may still show Install app/Add to Home screen. Clearing site data remains the most reliable hard reset during testing.
