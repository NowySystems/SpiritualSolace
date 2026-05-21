# Evidence Connectors (CRCF 2.8)

CRCF 2.8 adds read-only evidence/need-proof source readiness for:
- Census ACS
- CDC PLACES
- HRSA HPSA / MUA / MUP
- County Health Rankings
- CDC WONDER
- CMS Data
- AHRF
- Rural Health Information Hub
- USDA ERS Rural Atlas / county data
- BLS / Census labor and workforce data

## Governance posture

- Evidence sources are **not** funding application sources.
- No invented statistics or fake evidence records.
- Human verification required before narrative use.
- No automatic persistence.
- No external actions.
- Source proof required before use.
- Grant narrative support is advisory only.

## Normalization

`lib/evidence-connectors.ts` introduces:
- `EvidenceSourceRecord`
- `EvidenceConnectorHealth`
- `EvidenceMetricCategory`
- `EvidenceGeographyLevel`
- `EvidenceVerificationStatus`

All records remain readiness-only in CRCF 2.8 (no live fetchers/parsers in this phase).
