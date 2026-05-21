# DonorRoute / CRCF Internal MVP Discussion Summary

Date: 2026-05-21  
Timestamp: 2026-05-21 — time not recorded  
Type: Owner voice/speech discussion note  
Status: Historical owner note / does not override SAVE_STATE.md or ROADMAP.md

> This note preserves owner discussion context from a speech/drive conversation. Phase references may reflect remembered context at the time and may be older than the current repository state. Current truth remains SAVE_STATE.md and ROADMAP.md.

## Current State

- Current remembered baseline is approximately CRCF / DonorRoute 3.2.2.
- Routing + navigation cleanup completed and validated.
- Grants.gov forecast / non-actionable handling preserved.
- Major focus now is reducing clutter, simplifying workflows, improving readability, and ensuring only real/live functionality is shown.

## Immediate Next Phase

- Planned next phase remains DonorRoute 3.3 — App Shell + Dashboard Layout Adoption.
- Goals:
  - Cleaner sidebar/navigation.
  - Better workflow naming for staff users.
  - Remove fake placeholders and misleading metrics.
  - Show only live, ready, manual-review, restricted, unavailable states.
  - No fake “connected” statuses.
  - Light-first premium command-center look.

## Functional Priorities

- Dashboard
- Funding Opportunities / Match Search
- Source Database
- Review Queue
- Proposal Scanner only if actually wired
- Reports / Governance later

## Internal MVP Scope Clarification

- Goal is not a public SaaS release yet.
- Goal is an internal operational tool for CRCF/CRMCF staff.
- Functioning workflows.
- Accurate source-fed outputs.
- Safe read-only architecture.
- Human-reviewed recommendations.
- No automation/outreach/actions.

## Estimated Timeline Discussion

- Initial estimate discussed: ~1–3 weeks depending on baseline cleanliness, wired functionality, helper/tool readiness, and UI regression issues.
- Owner believes timeline may be shorter because groundwork/helpers/tooling are being integrated and stack maturity is increasing.

## Important Clarification on Helpers

- Distinguish frameworks/libraries from autonomous helpers/agents.
- Many helper/agent/tooling concepts are designed/planned.
- Actual usefulness depends on whether they are wired into workflows, configured, validated, and actively assisting development/testing.

## Stripe Roadmap Decision

- Stripe/payment integration should happen after internal MVP stabilization, after workflow validation, and before any public beta involving real users/payments.
- Test keys only initially.
- Feature-flagged.
- Isolated from core donor/grant logic.
- No live transactions until governance/security review complete.

## Strategic Direction Reinforced

- Operational software + workflow intelligence.
- Modular helper-assisted development.
- Safe read-only agents.
- Realistic/live workflow presentation.
- Reduced clutter.
- Decision-first UX.
- Human-controlled external actions only.

## Ongoing UX Philosophy

- Show only what actually works.
- Remove placeholder clutter.
- Simpler menus.
- Easier on the eyes.
- Workflow-first navigation.
- Internal command center feel instead of dev-dashboard feel.

## Actionable carry-forward

- Preserve as historical voice note.
- Do not roll back phase state.
- Carry forward the Stripe timing rule.
- Carry forward the “show only what works” rule.
- Carry forward internal MVP scope and workflow priority.
- Carry forward the rule that speech notes are owner context, not current-state truth.
