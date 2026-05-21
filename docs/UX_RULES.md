# CRCF UX Rules (Workflow-First)

## Product Posture

CRCF / GrantView should feel like a real logged-in SaaS product:

- Public sources only.
- Human-reviewed.
- External actions disabled.

## Primary Navigation (Workflow Only)

1. Dashboard
2. Opportunities
3. Sources
4. Proposal Scanner
5. Review Queue
6. Reports

Guardrails/Help content should be available as secondary reference, not a daily workflow destination.

## UX Quality Rules

- Premium, clear UI.
- Idiot-proof flow.
- No stacks of cards.
- Only useful information visible by default.
- Extra details belong in dropdowns, accordions, drawers, details panels, or module submenus.
- UI should not expose architecture, phase notes, or implementation internals.
- Each page must answer: **what should the user do next?**
- No fake metrics, fake grants, fake activity, fake source health, or misleading placeholder content.

## Safety and Compliance Rules

- No PHI.
- No patient names.
- No SSNs.
- No private donor records.
- No credentials committed.
- No automatic outreach.
- No submissions.
- No source-system writes.
- No QuickBooks writes.
- No DonorPerfect writes.
- Human review required before any external action.


## Helper Usefulness Principle

Every helper must answer:

- What did it check?
- What did it find?
- Is it blocker, warning, or info?
- What should we do next?
- Did this protect the product goal?


## Staff Communication Rule

Helper reports are for ChatGPT/owner review. ChatGPT interprets staff output and reports plain-English PASS / FAIL / WARNING to owner.
