# ChurchWork Pilot Demo Baseline

This document marks the current working ChurchWork pilot demo as the stable baseline before requester-side intake is added.

## Stable routes

The current pilot demo baseline includes these stable routes:

- `/` — Public landing page for ChurchWork.
- `/care-binder` — Gated Care Binder experience.
- `/care-binder?demo=true` — Guided Care Binder demo entry point.
- `/app` — App entry route.

## Current behavior

- The landing page is public and can be visited without an access code.
- The Care Binder route is gated.
- The guided demo works when opened with `demo=true`.
- Access-code validation uses the `CHURCHWORK_ACCESS_CODE` environment variable.
- Vercel hosts the app.
- Cloudflare handles DNS.

## Baseline guardrails

This baseline does not introduce application behavior changes, UI changes, Supabase code, or requester-side intake flow work.
