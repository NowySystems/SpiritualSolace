# Tennessee / Regional Sources (CRCF 3.1)

CRCF 3.1 adds Tennessee and Upper Cumberland source-connector readiness models without enabling live crawling, external actions, or automatic persistence.

## Scope

- Tennessee state agencies
- Upper Cumberland regional/public entities
- Community/corporate/private foundations with service-area validation requirements

## Normalized model fields

Each Tennessee/regional source readiness record includes:

- `sourceName`
- `sourceUrl`
- `sourceRole`
- `connectorType`
- `geography`
- `tennesseeUpperCumberlandRelevance`
- `possibleFundingCategories`
- `applicantEligibilityNotes`
- `crmcfFitRationale`
- `partnerNeededReason` (optional)
- `humanReviewRequired`
- `confidenceLevel`
- `sourceProofPresent`
- `canFetch`
- `canNormalize`
- `canPersist`
- `notes`

## Governance posture

- No fake grants or opportunities.
- No live source scraping/crawling.
- No login-gated/subscription scraping.
- No automatic persistence.
- No automatic review queue writes.
- No external actions.
- Human review required before any source-backed recommendation can be acted on.

## Corporate/foundation service-area rule

Statewide Tennessee branding does not automatically imply Upper Cumberland eligibility.
Each corporate/foundation source must include service-area validation notes before high-fit recommendation.
