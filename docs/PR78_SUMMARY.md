# PR78: Guided demo role transition cues

## Motivation

The guided demo now has strong field animation and better card behavior, but the viewer can still lose the story when the demo moves between requester, facility, partner, and requester update views.

The first role cue pass created a current-lane chip, but it was easy to miss and could feel like it got swallowed by the narration bar. The demo needs an actual persistent legend so a first-time viewer always knows where they are in the path.

## Description

Adds:

- `components/ChurchWorkDemoRoleCue.tsx`
- `docs/PR78_SUMMARY.md`

Updates:

- `app/layout.tsx`
- `app/demo-polish.css`

## Behavior

The role cue component:

- watches the current guided demo step number,
- maps steps 1–7 to Requester,
- maps steps 8–13 to Facility,
- maps steps 14–19 to Partner,
- maps step 20 to Requester update,
- shows a persistent bottom `Demo path` legend while the demo is running,
- shows all lanes in order: Request → Facility → Partner → Update,
- visually separates past, current, and upcoming lanes,
- keeps the current lane obvious without covering the narration/title area,
- shows a larger chapter card when the demo transitions between lanes:
  - Requester → Facility,
  - Facility → Partner,
  - Partner → Requester update.

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
2. Confirm a persistent bottom `Demo path` legend appears while the demo is running.
3. Confirm the legend shows Request → Facility → Partner → Update.
4. Confirm steps 1–7 mark Request as current.
5. Confirm a large transition cue appears when moving to Facility.
6. Confirm steps 8–13 mark Facility as current.
7. Confirm a large transition cue appears when moving to Partner.
8. Confirm steps 14–19 mark Partner as current.
9. Confirm a large transition cue appears before the final requester update.
10. Confirm step 20 marks Update as current.
11. Confirm the legend does not cover the title/narration area.
12. Confirm the legend does not block the field balloon animation during normal field steps.
