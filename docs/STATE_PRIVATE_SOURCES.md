# State + Private Sources (CRCF 3.1)

CRCF 3.1 expands Tennessee, regional/local, private foundation, community foundation, and corporate giving source readiness while keeping a match-first user experience.

## What changed

- Expanded Tennessee/regional/private/corporate source readiness records in `lib/tennessee-regional-sources.ts`.
- Added service-area validation requirements on private/corporate sources.
- Kept read-only posture: no auto-save, no external actions, no submission behavior.

## Governance posture

- Human review required for every source-backed recommendation.
- No login-gated scraping or subscription bypass.
- No fabricated opportunities, claims, or outcomes.
- No automatic persistence from source discovery/readiness records.

## Connector posture

- Readiness modeling only in this phase (`canFetch: false`, `canPersist: false`).
- Future live parser/API work is limited to safe public pages/APIs and remains read-only.
