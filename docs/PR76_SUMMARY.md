# PR76: Demo spotlight polish

## Motivation

The guided demo needed stronger visual emphasis before showing it to pilot stakeholders:

- the right-side rail still felt too squeezed,
- active boxes were not large or animated enough,
- timeline updates did not clearly spotlight each new update,
- the purple highlight blended into the existing palette,
- active forms were trapped inside the right rail and created nested scrollbars,
- the viewer could lose track of where they were in the story,
- the demo stopped at the ledger too often instead of keeping the story moving,
- centered forms still felt like squeezed sidebar content instead of a full demo stage.

## Description

Adds:

- `app/demo-polish.css`
- `components/ChurchWorkDemoFlowSkipper.tsx`
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
- moves active guided forms into a centered presentation board instead of trapping them inside the right rail,
- widens the center-stage form to use far more of the viewport,
- compresses the form header/controls so the fields get more room,
- lays form fields into two columns on desktop and three columns on wide screens,
- keeps checkbox/acknowledgement rows full-width,
- keeps the guided form controls inside the centered panel during form steps,
- uses a consistent floating narration/control bar for non-form steps,
- hides the floating narration/control bar while the form is center-stage so there is only one focus area,
- highlights the newest visible timeline update during the demo,
- expands the current timeline update card and adds a `Current update` badge,
- keeps reduced-motion behavior for users who prefer less animation.

The demo flow skipper:

- automatically advances past intermediate ledger-only stops,
- keeps the story focused on the active module,
- still leaves major ledger/timeline moments available as summaries and final proof.

Skipped intermediate ledger stops:

- Step 10: facility review recorded,
- Step 12: consent recorded,
- Step 16: partner acceptance recorded.

## Guardrails

- No business data changes.
- No Supabase changes.
- No pilot workflow changes.
- No audio route changes.
- No production data changes.
- No changes to the real care workflow.

## Testing

Source-level review only in this environment.

Browser test after deployment:

1. Start the guided demo.
2. Confirm active guided forms pop to the center instead of staying trapped in the right rail.
3. Confirm the centered form feels like a wide presentation board, not a narrow modal.
4. Confirm fields appear in multiple columns on desktop/wide screens.
5. Confirm there are not multiple nested horizontal/vertical scrollbars around the form.
6. Confirm the guided controls follow the centered form during form steps.
7. Confirm the floating narration/control bar appears during non-form steps.
8. Confirm the right rail has more room on desktop.
9. Confirm highlighted cards are larger and move more visibly.
10. Confirm the highlight is warmer gold/green, not purple-forward.
11. Confirm the newest timeline update expands and shows `Current update`.
12. Confirm the demo no longer stops on every intermediate ledger-only moment.
13. Confirm reduced motion settings disable the new motion.
