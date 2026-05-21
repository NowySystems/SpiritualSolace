# Firestore Schema (CRCF 2.5)

CRCF 2.5 preserves the controlled server-side write path for `review_items` only.
No broad source writes are enabled in this phase; source registry remains read-only in-app.

## Planned collections

1. `review_items`
   - Internal queue entries for real source-backed opportunities.
   - MVP persisted fields:
     - `id`, `title`, `sourceName`, `sourceUrl`, `opportunityUrl`, `directUrl`, `sourceType`
     - `fundingCategory`, `agencyOrFunder`, `deadline`, `amountSummary`, `eligibilitySummary`
     - `fitSummary`, `badFitReasons`, `researchFlag`, `status`, `priority`
     - `assignedReviewer`, `internalNotes`, `createdAt`, `updatedAt`, `createdBy`, `lastReviewedAt`
   - Status options: `new`, `reviewing`, `high_priority`, `bad_fit`, `partner_needed`, `research_partner_only`, `archived`.
   - Priority options: `low`, `medium`, `high`, `urgent`.
   - Validation requires source proof (`sourceName` and `sourceUrl`; plus direct opportunity link fields when available).
2. `source_registry`
   - Future controlled collection for source registry records and governance metadata.
   - Planned fields mirror the CRCF 2.5 typed source model in `lib/source-database.ts`.
3. `source_checks`
   - Future source check snapshots (last checked date, status, quality, confidence, cadence checks).
4. `daily_briefs`
   - Internal daily brief memory records.
5. `reapplication_watch`
   - Recurrence and reapplication-window tracking.
6. `advisor_memory_events`
   - Auditable learning events tied to staff decisions and outcomes.
7. `source_quality_scores`
   - Source quality scoring history (junk/mixed/strong-lead trend).
8. `grant_outcomes`
   - Outcome tracking (won/lost/pending/pursued/not pursued).

9. `source_leads`
   - Future controlled queue for discovered public source leads (readiness only).
   - Planned fields: `id`, `sourceName`, `sourceUrl`, `discoveredFrom`, `sourceCategory`, `sourceRole`, `connectorType`, `accessMethod`, `geography`, `possibleFundingCategories`, `crcFitRationale`, `riskNotes`, `termsRisk`, `confidenceLevel`, `humanReviewRequired`, `recommendedStatus`, `discoveredAt`, `lastCheckedAt`, `reviewedAt`, `reviewedBy`, `reviewDecision`, `promotedSourceId`.
   - Status options: `new_lead`, `needs_review`, `likely_useful`, `low_confidence`, `duplicate`, `rejected`, `promoted_to_registry`, `restricted_manual_only`.

## Data constraints

- Real data only.
- No fake grants/opportunities/statistics.
- No PHI, patient names, SSNs, private medical details, immigration status, or private financial details.
- No auto-saving proposal text.
- No auto-saving uploaded documents.
