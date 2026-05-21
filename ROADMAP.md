# CRCF Funding Command Center Roadmap

## Canonical Baseline

- **Current baseline:** **CRCF 3.5 — Source Database Real Status Layout**
- **Package version:** `2.2.0`
- **Current focus:** Real-status Source Database workflow with premium light-first, table/list-first source intelligence presentation.

## Historical Compatibility References

Historical compatibility reference required by foundation validation:
CRCF 3.2.1 — Grants.gov Forecast / Non-Actionable Opportunity Handling

## Completed

- **CRCF 1.3** Navigation Simplification
- **CRCF 1.4** Funding Need Model
- **CRCF 1.4a** Fake Content Cleanup
- **CRCF 1.5** Unified Funding Search Shell
- **CRCF 1.5a** Category-First Search
- **CRCF 1.6** Source Role Map + Past Awards Shell
- **CRCF 1.7** Advisor Intelligence Source Expansion
- **CRCF 1.8** USAspending Advisor Intelligence Connector
- **CRCF 1.9** Evidence / Need-Proof Connectors Shell
- **CRCF 2.0** Daily Funding Brief Shell
- **CRCF 2.1** Review Queue + Internal Actions Shell
- **CRCF 2.2** Advisor Learning Loop / Feedback Memory Shell
- **CRCF 2.8a** Smart Funding Search + Fit Review Engine
- **CRCF 3.0** Match Quality Hardening + Live Connector Batch 1
- **CRCF 3.1** State + Private Funding Source Expansion
- **CRCF 3.2.1** Grants.gov Forecast / Non-Actionable Opportunity Handling
- **CRCF 3.2.3** Tool Foundation / Green Validation Chain
- **CRCF 3.2.4** Information Architecture + UX Rules Lock
- **CRCF 3.4** Funding Matches / Opportunities Page
- **CRCF 3.4a** Public-Quality App Chrome + Non-Workflow Clutter Cleanup
- **CRCF 3.4c** Activate First Helper Checks
- **CRCF 3.4d** Add Competitive Intelligence + Learning Loop Staff Plan

## Current

- **CRCF 3.5** Source Database Real Status Layout

## Next (Locked Order)

- **CRCF 3.6** Review Queue Practical Workflow
- **CRCF 3.7** Proposal Scanner Local Flow
- **CRCF 3.8+** Observability, analytics, accessibility, visual smoke, validation, QA, security tooling

## Grants.gov Newsletter / Source Intelligence Additions

These items came from Grants.gov update/newsletter intelligence and should feed the Source Database, Source Health, Daily Brief, Staff Reference, and Competitive/Process Intelligence roadmaps without creating new external actions.

### 1) Grants.gov Applicant Center launch (future compatibility input only)

- Track as future saved-search/watchlist design input only.
- Use for future compatibility planning around saved searches, applicant dashboard expectations, and user workflow references.
- Do **not** add Grants.gov login automation.
- Do **not** add applicant portal actions.
- Do **not** automate account activity.

### 2) Grants.gov maintenance windows (future source-health signal)

- Add as future Source Health / Daily Brief signal.
- Future system should warn staff when grant deadlines fall near known Grants.gov outages or maintenance windows.
- This remains read-only public status/calendar intelligence only.
- No account login or portal actions.

### 3) Grants.gov Quick Start Guide (future staff reference only)

- Add as a future staff reference/help link.
- Place in Help / Rules / Staff Reference areas; avoid primary workflow clutter.
- Use for onboarding/reference material only.

### 4) U.S. Department of the Treasury funding opportunities

- Add as a low-priority federal source lead / agency enrichment source.
- Treat as source-discovery/enrichment, not a primary connector yet.
- Preserve direct source links when used later.

### 5) Simpler.Grants.gov Co-Design Group

- Add as federal grants process / market intelligence only.
- Use for competitive/process awareness and future UX expectation planning.
- Not a funding source connector.
- Not a workflow blocker.

### 6) Assistance Listing format change (connector/data-model guardrail)

- Update connector assumptions: Assistance Listing IDs/program codes may become alphanumeric.
- Do **not** validate Assistance Listing IDs as numeric-only.
- Preserve existing numeric IDs.
- Future SAM.gov / Grants.gov connector models must support alphanumeric Assistance Listing program codes.
- Track as a future connector/data-model guardrail requirement.

## Helper Usefulness Principle

Every helper must answer:

- What did it check?
- What did it find?
- Is it blocker, warning, or info?
- What should we do next?
- Did this protect the product goal?

## Staff Communication Rule

Helper reports are for ChatGPT/owner review. ChatGPT interprets staff output and reports plain-English PASS / FAIL / WARNING to owner.

## Naming Clarification (Locked)

- DonorRoute is the preferred product direction/name.
- CRCF / CRMCF remains the internal MVP/customer context.
- GrantView / Funding Command Center may appear as legacy/internal naming in repo history.
- Naming references must not override current phase/state.

## Stripe/Payment Integration Timing (Locked)

- After internal MVP stabilization.
- After workflow validation.
- Before public beta involving real users/payments.
- Test keys only.
- Feature-flagged.
- Isolated from core donor/grant/source logic.
- No live transactions until governance/security review.

## Future Prompt Carry-Forward (Locked)

Future prompts should preserve:

- Public-quality rule.
- Show only what works.
- No fake metrics/placeholders.
- Speech notes archived under docs/notes.
- DonorRoute naming clarification.
- Stripe timing rule.
- Founder/Owner Command Center remains future private owner cockpit, not active build unless explicitly started.
