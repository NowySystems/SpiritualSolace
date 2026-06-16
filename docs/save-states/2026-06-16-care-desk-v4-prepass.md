# Save State — Care Desk V4 Prepass

Date: 2026-06-16
Project: SpiritualSolace
Branch: main

## Purpose

This save state records the project position before the Care Desk V4 experiment.

## Current Issue

The app workflow spine exists, but the Care Desk is still too cluttered. The user cannot immediately tell what to do first or what matters most.

Observed problems:

- Too many equal-weight regions.
- Daily brief, exception queue, action rail, readiness, and recent activity compete visually.
- Similar cream/green color values make items blend together.
- The screen does not answer the core question within two seconds: "What should I do next?"

## NS Guidance Being Applied

Use SpiritualSolace as a live test bed for NS Brain pattern guidance.

Relevant NS patterns:

- Next Human Decision
- Exception Queue
- Daily Brief
- Action Rail
- Operational color semantics
- Work separated from configuration

## Intended Care Desk V4 Direction

The `/app` home screen should be rebuilt around one dominant object:

> NEXT HUMAN DECISION

The screen should prioritize:

1. One dominant next action.
2. Clear reason why it matters.
3. One primary route to act.
4. Secondary waiting items demoted below.
5. Recent completion and system readiness demoted further.

## Rollback Anchor

If the experiment goes sideways, this file marks the prepass state before the Care Desk V4 home-screen rewrite.

Recent key commits before this save state include:

- 7f636c0 — Rework care desk into daily brief exception queue
- df45b6b — Render grouped workflow navigation in app shell
- 4d7db54 — Group app navigation around care workflow

## Experiment Success Criteria

A first-time user should understand within two seconds:

- what needs attention first
- why it matters
- where to click next

If not, the experiment failed.
