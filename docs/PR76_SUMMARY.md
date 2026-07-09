# PR76: Demo spotlight polish

## Motivation

The guided demo needed stronger visual emphasis before showing it to pilot stakeholders:

- the right-side rail still felt too squeezed,
- active boxes were not large or animated enough,
- timeline updates did not clearly spotlight each new update,
- the purple highlight blended into the existing palette,
- active forms were trapped inside the right rail and created nested scrollbars,
- the viewer could lose track of where they were in the story.

## Description

Adds:

- `app/demo-polish.css`
- `docs/PR76_SUMMARY.md`

Updates:

- `app/layout.tsx`

## Behavior

The demo polish stylesheet:

- widens the demo workspace while a guided highlight is active,
- gives the right rail a larger responsive column on desktop,
- strengthens active card scale and motion,
- swaps the spotlight from purple-heavy to warmer gold/green contrast,
- overrides the active ring/halo styling so highlighted boxes stand out more,
- moves active guided forms into a centered stage panel instead of trapping them inside the right rail,
- keeps the guided form controls inside the centered panel during form steps,
- uses a consistent floating narration/control bar for non-form steps,
- hides the floating narration/control bar while the form is center-stage so there is only one focus area,
- highlights the newest visible timeline update during the demo,
- expands the current timeline update card and adds a `Current update` badge,
- keeps reduced-motion behavior for users who prefer less animation.

## Guardrails

- No business logic changes.
- No Supabase changes.
- No pilot workflow changes.
- No demo script copy changes.
- No audio route changes.
- No production data changes.

## Testing

Source-level review only in this environment.

Browser test after deployment:

1. Start the guided demo.
2. Confirm the right rail has more room on desktop.
3. Confirm active guided forms pop to the center instead of staying trapped in the right rail.
4. Confirm there are not multiple nested horizontal/vertical scrollbars around the form.
5. Confirm the guided controls follow the centered form during form steps.
6. Confirm the floating narration/control bar appears during non-form steps.
7. Confirm highlighted cards are larger and move more visibly.
8. Confirm the highlight is warmer gold/green, not purple-forward.
9. Confirm the newest timeline update expands and shows `Current update`.
10. Confirm reduced motion settings disable the new motion.
