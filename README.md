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

## Cloudflare deployment

This project remains a standard Next.js app for local development and Vercel-compatible builds: `npm run build` still runs `next build` only.

Cloudflare deployment uses the currently supported Cloudflare OpenNext adapter for the Workers runtime. Do not deploy the raw `.next` directory as a Cloudflare Pages static asset directory; `.next/cache` contains Next.js build cache packs that can exceed the Cloudflare Pages per-file upload limit and are not required at runtime.

### Required Cloudflare build settings

Use these settings for the Cloudflare production deployment for `church-work.com`:

- Platform: Cloudflare Workers with the OpenNext adapter.
- Install command: `npm install`.
- Build command: `npm run deploy` for production deploys, or `npm run upload` when Cloudflare should build and upload a version without immediately promoting it.
- Worker configuration file: `wrangler.toml`.
- Worker entrypoint: `.open-next/worker.js`.
- Static assets directory: `.open-next/assets`.
- Node.js compatibility: enabled through `nodejs_compat` in `wrangler.toml`.
- Custom domain/route: point `church-work.com` at the deployed `spiritualsolace` Worker in Cloudflare.

For local Cloudflare-runtime verification, run `npm run preview`. That command runs the OpenNext build and serves the result with Wrangler instead of uploading raw `.next` files.

The `.cfignore` file intentionally excludes `.next` and `.next/cache` as a safety net for any legacy Pages project that still builds this repository. The Cloudflare OpenNext deployment should upload only the generated Worker bundle and `.open-next/assets`, preserving `/care-binder` and the rest of the app without changing application behavior.
