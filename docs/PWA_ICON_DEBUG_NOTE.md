# PWA icon debugging note

The Android install flow is working again. The remaining launcher icon issue was caused by Android using PNG fallback assets rather than the SVG metadata icon. Keep launcher icons as versioned PNG manifest assets and verify them with `/pwa-check` before reinstalling.
