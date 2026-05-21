# CRCF 2.6 — Federal Master Source Connectors

## Scope
Read-only connector infrastructure for federal master sources:
- Grants.gov (Opportunity Source)
- SAM.gov Assistance Listings (Program Catalog Source)
- USAspending.gov (Past Award / Payout and Advisor Intelligence Source)

## Posture
- Read-only only.
- No external actions.
- No outreach, applications, submissions, or portal login automation.
- Human review required before any persistence/use.
- No automatic persistence to Firestore/review queue.

## Connector behavior

### Grants.gov
- Live API fetch enabled via `/api/grants-gov/search`.
- Results normalized with key fields (title, opportunity number, agency, deadline, role/type/confidence, direct source link).
- No fake fallback opportunities.

### SAM.gov Assistance Listings
- Readiness helper/stub added in `lib/sam-assistance.ts`.
- Treated as program catalog/context source (not active application feed).
- Requires `SAM_GOV_API_KEY` for future live fetch wiring.
- Missing env fails closed by returning unavailable/`env_required` readiness status.

### USAspending.gov
- Live API fetch retained via `/api/usaspending/search`.
- Normalization expanded for award/advisor intelligence fields.
- Explicitly marked as non-application source.

## Human review and persistence controls
- Connectors return read-only intelligence.
- `canPersist` remains false in connector health model.
- No auto-save to `review_items`, Firestore, or any external source system.


## CRCF 2.7 Healthcare / Rural Connector Readiness

Added read-only readiness and normalization infrastructure for HRSA/FORHP, SAMHSA, CDC, ACL, and USDA Rural Development / Community Facilities. These are source-bound helper mappings only (no uncontrolled crawling, no external actions, no automatic persistence).
