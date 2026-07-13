# PR78: Guided demo role transition cues

## Motivation

The guided demo now has strong field animation and better card behavior, but the viewer can still lose the story when the demo moves between requester, facility, partner, and requester update views.

The demo needs obvious chapter markers so a first-time viewer understands which role is currently acting and why the screen changed.

## Description

Adds:

- `components/ChurchWorkDemoRoleCue.tsx`
- `docs/PR78_SUMMARY.md`

Updates:

- `app/layout.tsx`
- `app/demo-polish.css`

## Behavior

The new role cue component:

- watches the current guided demo step number,
- maps steps 1–7 to Requester,
- maps steps 8–13 to Facility,
- maps steps 14–19 to Partner,
- maps step 20 to Requester update,
- shows a persistent `Current lane` pill while the demo is running,
- shows a larger chapter card when the demo transitions between lanes:
  - Requester → Facility,
  - Facility → Partner,
  - Partner → Requester.

The chapter card explains:

- who is acting now,
- what that role is doing,
- why the transition matters,
- which lane the demo moved from and to.

## Guardrails

- No Supabase changes.
- No care workflow changes.
- No demo step order changes.
- No audio route changes.
- No field animation changes.
- No pilot stack changes.

## Testing

Browser test the guided demo:

1. Start the guided demo.
2. Confirm a `Current lane` pill appears while the demo is running.
3. Confirm steps 1–7 read as Requester.
4. Confirm a large transition cue appears when moving to Facility.
5. Confirm steps 8–13 read as Facility.
6. Confirm a large transition cue appears when moving to Partner.
7. Confirm steps 14–19 read as Partner.
8. Confirm a large transition cue appears before the final requester update.
9. Confirm the cue does not block the field balloon animation during normal field steps.
