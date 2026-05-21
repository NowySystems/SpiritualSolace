# Source Governance (CRCF 3.2.1)

## Mandatory controls

- No external actions from source pages.
- No auto-submission, outreach, portal login, or funder contact.
- No PHI/patient names/SSNs/private donor records.
- Human review required before any external action.

## CRCF 3.1 Tennessee/regional governance

- Tennessee/regional records are readiness metadata only.
- No broad crawling or subscription/login-gated scraping.
- `canPersist` remains false for Tennessee/regional readiness records in this phase.
- Community/corporate foundation sources require explicit service-area validation notes.
- No automatic review queue writes from connector output.
- No automatic source-system writes.

## Connector governance

- `API` and `Download / Bulk File` entries are planning metadata, not auto-running jobs.
- `Public Page Parser` entries are lead-only until explicitly approved.
- `Subscription / Staff-Entered` entries remain manual/restricted.
- `Partner-Only Intelligence` entries are advisory and often research-heavy.

## CRCF 3.2.1 fit-quality controls

- `/funding-search` remains decision-first: Best Matches, Possible Matches, Partner Needed, Intelligence Only, Hidden/Bad Fits.
- Bad-fit suppression must downgrade or hide individual-only, student-only, university-only, for-profit-only, foreign-only/global-only, expired, geography-mismatch, no-proof, and vague/non-actionable opportunities.
- Partner-needed classifications must include explicit rationale and likely CRCF role.
- No automatic persistence from fit results, including no auto-add to Review Queue.

## Phase completeness gate

- A phase cannot be marked current unless required implementation files and behaviors are present. Passing docs/foundation validation alone is not enough.
