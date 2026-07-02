# PR58 Summary

## Title

Add landing page pilot access CTA

## Motivation

The live pilot path should be directly reachable from the public landing page. Users should not need to manually type `/pilot` or be told about a hidden route.

## What changed

- Added a top navigation link to `/pilot` labeled `Pilot Access`.
- Changed the header primary button to open `/pilot`.
- Added a hero primary CTA labeled `Open Pilot Access`.
- Updated copy to distinguish secured live pilot access from public demo preview paths.
- Added a lower landing-page pilot access section with a direct `/pilot` button.

## Guardrails

- No Supabase schema changes.
- No auth logic changes.
- No requester intake changes.
- No frozen demo route changes.
- Public demo routes remain preview-only.
