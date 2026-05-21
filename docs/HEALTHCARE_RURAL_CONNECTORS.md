# CRCF 2.7 — Healthcare / Rural Federal Source Connectors

## Covered sources

- HRSA / FORHP (rural healthcare, workforce, access, facilities)
- SAMHSA (mental health, substance use, prevention, crisis)
- CDC (public health/prevention opportunities and evidence source distinction)
- ACL (aging, disability, caregiver, independent living)
- USDA Rural Development / Community Facilities (facilities/equipment, infrastructure, loan-grant context)

## Posture

- Read-only readiness and normalization infrastructure only.
- Human review required before any persistence or external action.
- No automatic persistence to Firestore or Review Queue.
- No external actions, no outreach, no submissions, no portal logins.
- No fake grants/opportunities and no invented statistics.

## Implementation

- Shared healthcare/rural normalization models and readiness records: `lib/healthcare-rural-connectors.ts`
- Connector health/status surfaced through shared federal status feed: `lib/federal-status.ts`
- Source registry entries expanded in `lib/source-database.ts`
- Source Database UI includes healthcare/rural readiness labels/status and governance language: `/source-database`

## Notes

- Connector records in this phase are readiness mappings, not live crawlers.
- CDC source handling explicitly separates opportunity tracking from evidence/data usage context.
- USDA Community Facilities is treated as loan/grant/program context unless an active source-backed application window is confirmed.
