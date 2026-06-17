# SpiritualSolace Workflow Spine Map

## Current Primary Path

1. `/app` — Care Desk
   - Question: What needs attention first?

2. `/app/intake` — Intake
   - Question: Is this request ready to move forward?

3. `/app/match` — Match Workspace
   - Question: Which responder fits this request?

4. `/app/message-review` — Message Review
   - Question: Should this message be delivered?

5. `/app/delivery-workspace` — Delivery
   - Question: Has this message been delivered?

6. `/app/record` — Record Closure
   - Question: Is this file complete?

## Legacy / Secondary Routes

- `/app/support-requests` — Legacy request file view, retained until Intake route is validated.
- `/app/approved-responders` — Admin responder roster.
- `/app/facility-rules` — Admin facility rules.
- `/app/guardrails` — Admin safety constraints.
- `/app/audit-log` — Records and audit view.
- `/app/patient-view` — Recipient-facing demo view.

## Current Rule

The primary product path should avoid legacy routes unless there is a reason to compare old/new designs.
