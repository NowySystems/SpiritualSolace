# ChurchWork Build Phases

ChurchWork is moving from prototype demo into a structured spiritual-care coordination product. This file is the working phase tracker so product language, workflow records, audit events, and audio narration do not drift as the app grows.

## North Star

ChurchWork should feel like warm professional care coordination: calm, trustworthy, human-reviewed, role-safe, and simple enough for requesters, facility staff, and partner care teams to use without training.

The timeline is the trust layer. It is not decoration. It records acknowledgements, consent decisions, sharing approvals, assignments, care outcomes, and visibility-safe updates.

## Phase 1 — Workflow Foundation

Status: mostly complete in the guided portal demo.

Locked end-to-end path:

1. Requester submits a structured care request.
2. Requester accepts the spiritual-care-only / no-medical-details acknowledgement.
3. Facility receives the request.
4. Facility reviews the request.
5. Facility confirms consent and visibility.
6. Facility approves partner sharing.
7. Partner receives approved context only.
8. Partner accepts assignment.
9. Partner selects approved prayer/care focus.
10. Partner logs a structured outcome.
11. Requester sees approved updates only.

## Phase 2 — Product Language and Records

Status: starting now.

Replace prototype language with real product records.

### Product objects

- Care Request
- Requester Acknowledgement
- Facility Review
- Consent Record
- Visibility Decision
- Partner Sharing Approval
- Partner Assignment
- Prayer / Care Focus
- Care Outcome
- Timeline Event

### Timeline event categories

- Guided Step: used only during demos.
- Audit Log: terms, acknowledgements, consent decisions, and sharing approvals.
- Care Request: requester-submitted request records.
- Facility Review: facility review and routing decisions.
- Partner Assignment: approved external care team work.
- Care Outcome: completed care and follow-up outcomes.

### Language rules

- Use "structured request" instead of "message" or "freeform request."
- Use "spiritual-care-only acknowledgement" instead of vague terms copy.
- Use "Approve Partner Sharing" instead of casual "Share With Partner."
- Use "Partner Assignment" instead of generic assignment copy.
- Use "Care Outcome" instead of open-ended prayer response.
- Do not imply medical, clinical, or emergency communication.
- Requester and partner portals should never expose open-ended prayer or medical-text boxes.

## Phase 3 — Visual Redesign

Status: next.

Current UI proves the workflow but still feels box-heavy. The design pass should reduce visual clutter and move toward a calm care workspace.

Targets:

- Fewer boxed cards.
- One clear primary workspace surface.
- Softer dividers instead of borders everywhere.
- Timeline as an official ledger/audit log.
- Right rail as a guided checklist, not a generic action stack.
- Warmer and calmer palette with fewer simultaneous accent colors.
- Better spacing and typography hierarchy.
- Stronger mobile and tablet behavior.

## Phase 4 — Persistence and Data Model

Status: pending.

The guided demo currently simulates the workflow. This phase makes the records real.

Needed saved records:

- careRequests
- timelineEvents
- requesterAcknowledgements
- facilityReviews
- consentRecords
- visibilityDecisions
- partnerSharingApprovals
- partnerAssignments
- careOutcomes

Each timeline event should store:

- event id
- request id
- actor id / actor role
- event type
- event title
- event detail
- visibility flags
- created timestamp
- source portal
- immutable audit flag where needed

## Phase 5 — Role Access and Visibility Enforcement

Status: pending.

Every role should see only what is appropriate:

- Requester: own request, own acknowledgements, approved updates, family-safe outcomes.
- Facility: full case workflow, consent, internal review, partner sharing, all timeline events.
- Partner: approved assignments, approved context, partner-visible timeline, structured report-back actions.

## Phase 6 — Audio Narration Layer

Status: planned.

Current browser speech synthesis is fallback only. Final demo narration should support OpenAI-generated audio through a server-side API route so the API key never reaches the browser.

Target architecture:

1. Demo step script provides narration text.
2. Browser requests audio for a step from `/api/churchwork-demo-audio`.
3. Server validates the step and calls OpenAI speech generation.
4. Server returns an audio blob or cached URL.
5. Browser plays consistent narration.
6. Browser falls back to speechSynthesis if API audio is unavailable.

Rules:

- No API keys in client code.
- Cache generated narration by script version and step id.
- Keep voice optional with Voice On / Off.
- Keep Replay Step.
- Never auto-start audio without the user choosing the demo.

## Phase 7 — Pilot QA

Status: pending.

Before pilot use:

- Verify no free-text request/prayer paths exist for requester or partner.
- Verify timeline event visibility by role.
- Verify audit events appear for terms, consent, sharing approval, partner acceptance, and care outcome.
- Verify mobile readability.
- Verify facility workflow can be completed quickly.
- Verify requester tone feels warm, not clinical.
- Verify partner portal is simple enough for volunteer care teams.
