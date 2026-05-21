# Source Registry (CRCF 3.1)

CRCF 3.1 extends the read-only Source Registry for Tennessee/Regional connector readiness while preserving 2.8a fit-quality direction.

## Purpose

- Classify funding and intelligence sources before connector work.
- Separate direct opportunity sources from advisor/evidence/research/manual sources.
- Preserve human-review-first controls.

## Registry fields

`id, sourceName, sourceUrl, sourceCategory, sourceRole, connectorType, accessMethod, apiAvailable, authRequired, termsRisk, lastChecked, checkFrequency, geography, eligibleApplicantTypes, fundingCategories, crcFitLevel, humanReviewRequired, confidenceLevel, notes, directApplySource, evidenceSource, awardHistorySource, programCatalogSource, sourceOwner, status, updatedAt`

## CRCF 3.1 additions

- Added Tennessee state and regional source coverage in source records.
- Added Tennessee/regional connector-readiness normalization model in `lib/tennessee-regional-sources.ts`.
- Added service-area caution for community/corporate foundation handling.
- Maintained read-only/no-autosave posture.

## Status model

- `active`
- `ready_to_connect`
- `coming_later`
- `manual_only`
- `subscription_manual`
- `needs_review`
- `restricted`
- `retired`
