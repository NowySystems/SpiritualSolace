# SpiritualSolace demo

SpiritualSolace is a local, demo-only Care Binder prototype. It keeps workflows inside the browser and requires human review before any external action.

## Launch the Care Binder demo

- Open the standard Care Binder at `/care-binder`.
- Open the guided tour directly at `/care-binder?demo=true`.
- From the landing page, the **See How It Works** button opens `/care-binder?demo=true`.
- Inside the Care Binder, **Start Guided Demo** restarts the Driver.js tour at any time.

The `demo=true` query starts the guided tour once after page load. The tour waits briefly for all highlighted Care Binder elements before it starts, so normal client rendering delays do not restart or break the demo.

## Guided tour dependency

The guided demo uses the published `driver.js` package listed in `package.json` and locked in `package-lock.json`. Do not replace it with local Driver.js stubs; keep dependency metadata current when changing tour behavior.

## Narration files

Approved narration copy lives in `public/demo-audio/narration-scripts.md`. Future local narration assets should be generated outside the app, human-approved, and added as static MP3 files under `public/demo-audio/` using the filenames documented in `public/demo-audio/README.md`.

MP3 binaries are intentionally not committed yet. The guided demo is fully usable as a text-only tour when narration files are missing. In that state the popover shows a text-only status instead of broken or misleading voice controls.

## Deployment

This project remains a standard Next.js app for local development and Vercel-compatible builds: `npm run build` runs `next build` only.

Cloudflare adapter work is parked until the Vercel deployment is green. Do not add OpenNext, Wrangler deployment scripts, or Cloudflare Worker configuration in this recovery PR. Future Cloudflare Pages or Workers work should happen in a separate PR after Vercel install and build stability is confirmed.
