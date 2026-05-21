# Owner Command Center Plan (Future Private Surface)

## Purpose

Plan a future private owner dashboard that becomes the cockpit across GrantView/CRCF, Bastion, Avora, and future products.

## What the Dashboard Should Track

- active products
- current phase/state
- open PRs
- CI status
- Vercel/deployment status
- helper/staff warnings
- blocker/warning/info counts
- next recommended task
- decision log
- competitor notes
- opportunity-scout ideas
- reusable stack items
- product lanes and wedges
- current risks
- next 3 recommended moves

## Suggested Modules

- Product Portfolio Overview
- Active Build Queue
- Staff Reports
- CI / Deployment Health
- Decision Log
- Lesson Capture
- Competitive Intelligence
- Opportunity Scout
- Reusable Stack Library
- Founder Learning Log
- Next Best Move

## Guardrails (Locked)

- Private owner-only surface.
- Not visible to normal users.
- No secrets or credentials.
- No patient data, PHI, donor records, SSNs, or private financial data.
- Read-only by default.
- Reports and recommendations only.
- No automatic deploys, merges, outreach, submissions, or source-system writes.
- Human owner remains final decision-maker.

## Implementation Staging (Planning-Only)

1. Define canonical inputs (roadmap, save-state, reports, CI status, deployment status).
2. Define normalization format for cross-product tracking (CRCF/Bastion/Avora/future).
3. Define recommendation rubric for "next best move" and "next 3 moves".
4. Define private access model and audit logging expectations.
5. Activate as read-only internal dashboard only after schema stability.
