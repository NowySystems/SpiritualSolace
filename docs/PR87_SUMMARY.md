# PR87: Visitor install prompt behavior

## Motivation

For pilot proof-of-concept and future app store backup documentation, visitors who do not have an account should be encouraged to install ChurchWork whenever their device/browser supports it.

## Behavior

This PR changes the PWA install helper behavior:

- Signed-out visitors see the install prompt every new visit when install is available.
- Signed-out visitors can dismiss the prompt for the current page session only.
- Signed-out visitor dismissals are not stored permanently in local storage.
- Signed-in users keep the prior behavior: once dismissed, the prompt stays dismissed on that device/browser.
- Installed/standalone PWA mode still suppresses the prompt.
- iPhone/iPad Safari still receives Add-to-Home-Screen guidance instead of a native install button.

## Guardrails

- No Supabase schema changes.
- No analytics/event tracking yet.
- No forced install wall.
- No portal routing changes.
- No private data caching.

## Testing

1. Open the site in a fresh Chrome profile while signed out.
2. Confirm the install prompt appears when Chrome marks the app installable.
3. Click Not now, then refresh or reopen the site and confirm the prompt appears again.
4. Sign in, dismiss the prompt, refresh, and confirm it stays dismissed for that signed-in browser.
5. Open the installed PWA and confirm the prompt does not appear.
6. On iOS Safari, confirm the Add-to-Home-Screen guidance appears for signed-out visitors.
