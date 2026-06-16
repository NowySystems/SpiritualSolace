# SpiritualSolace Build Driver Plan

Date: 2026-06-16
Owner: ChatGPT + NS Brain
Status: Active build directive

## Operating Decision

SpiritualSolace will be built as a viable product and as the first live proving ground for NS Brain design guidance.

The goal is not to force every NowySystems project into the same pattern. The goal is to test whether NS Brain can provide rules, constraints, and design intelligence that improve a real product while preserving the product's own identity.

## Product Identity

SpiritualSolace is a facility-controlled comfort-message coordination system.

It is not:

- a generic SaaS dashboard
- a CRM
- a social services case manager
- a public prayer wall
- a direct patient/responder messaging app

It is:

- intake
- responder matching
- message review
- delivery confirmation
- audit/record closure

## Current Build Pattern Being Tested

The current experiment is the NS pattern:

> One screen, one dominant human decision.

Applied as:

- Care Desk: What should staff do next?
- Intake: Is this request ready to move forward?
- Match: Who should receive this request?
- Review: Should this message be delivered?
- Delivery: Has delivery occurred?
- Record: Is the file complete?

## Build Principles

1. Make the next human decision obvious within two seconds.
2. Use operational color semantics, not decorative color.
3. Demote everything that is not part of the decision.
4. Keep admin/configuration separate from daily work.
5. Save states before major experiments.
6. Let NS Brain guide, but do not let NS force every product into the same layout.
7. Build complete workflow before polishing every visual detail.

## Near-Term Build Sequence

1. Care Desk V4 — complete.
2. Message Review decision pass — complete.
3. Intake Queue decision pass — next.
4. Match Workspace — new workflow stage.
5. Delivery Confirmation pass.
6. Record Closure / Audit pass.
7. Admin cleanup: responders, rules, guardrails.
8. App shell cleanup after workflow stabilizes.
9. Landing page touch only after app identity is clear.

## Success Criteria

A facility user can move through the app without hunting:

1. See what needs attention.
2. Open the request.
3. Confirm the request can move forward.
4. Match responder.
5. Review returned message.
6. Confirm delivery.
7. See that the file is recorded.

## NS Learning Goal

NS should record what works and what fails as reusable product intelligence, not as a universal template.

The lesson should be:

> Pattern engines must adapt to product identity. They should not make every project look or behave the same.
