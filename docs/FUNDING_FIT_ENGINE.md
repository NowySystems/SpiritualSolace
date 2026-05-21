# Funding Fit Engine (CRCF 3.0)

## Purpose

CRCF 2.8a adds a Smart Funding Search + Fit Review Engine that classifies, ranks, and explains source-backed opportunities while preserving human-review-first governance.

## Review tier model

- `strong_fit`
- `possible_fit`
- `partner_needed`
- `research_intelligence_only`
- `bad_fit`
- `excluded`

## Review priority model

- `urgent`
- `high`
- `medium`
- `low`
- `ignore`

## Fit score model

- `fitScore` is `0-100`.
- `fitScore` is **not** a probability of award.
- It is a review-priority signal for internal triage only.

## Explanation fields

- `matchBucket` (`best_matches`, `possible_matches`, `partner_needed`, `intelligence_only`, `hidden_bad_fits`)
- `whyItFits`
- `whyItMayNotFit`
- `likelyCRCFRol`
- `recommendedNextStep`
- `badFitReasons`
- `partnerNeededReason`
- `confidenceLevel`
- `sourceProofStatus`

## Recommended next-step values

- `review_this_week`
- `verify_eligibility`
- `identify_partner`
- `monitor_reapplication`
- `use_as_evidence_only`
- `save_to_review_queue`
- `ignore_bad_fit`
- `needs_more_source_detail`

## Governance

- Human review remains required before any external action.
- No automatic grant submission, outreach, portal login, or contact.
- No fake opportunities or invented statistics.
- No automatic persistence to Firestore/review queue from search results.
- USAspending references are advisory/past-award intelligence only; if no usable linkage is available, the fit review must explicitly say unavailable.
