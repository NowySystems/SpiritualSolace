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
- centered forms still felt like squeezed sidebar content instead of a full demo stage,
- showing the full form at once still felt squished during narration,
- active fields appeared in the center but did not balloon up from and return to their real form positions,
- the balloon clone returned too quickly before the explanation had time to land.

## Description

Adds:

- `app/demo-polish.css`
- `app/demo-focus-field.css`
- `components/ChurchWorkDemoFlowSkipper.tsx`
- `components/ChurchWorkDemoBalloonAnimator.tsx`
- `docs/PR76_SUMMARY.md`

Updates:

- `app/layout.tsx`

## Behavior

The demo polish stylesheets:

- widen the demo workspace while a guided highlight is active,
- give the right rail a larger responsive column on desktop,
- strengthen active card scale and motion,
- swap the spotlight from purple-heavy to warmer gold/green contrast,
- override the active ring/halo styling so highlighted boxes stand out more,
- move active guided forms into a centered presentation board instead of trapping them inside the right rail,
- keep the guided form controls inside the centered panel during form steps,
- keep the real form fields in place while the animated clone performs the balloon motion,
- leave the real active field highlighted in its original location,
- use a consistent floating narration/control bar for non-form steps,
- hide the floating narration/control bar while the form is center-stage so there is only one focus area,
- highlight the newest visible timeline update during the demo,
- expand the current timeline update card and add a `Current update` badge,
- keep reduced-motion behavior for users who prefer less animation.

The demo balloon animator:

- watches for the active guided form field,
- clones that exact field from its current screen rectangle,
- animates the clone from its real position to the center,
- holds the clone in the center for a longer explanation window,
- uses a slower return so the clone feels like it is being sent back to its place,
- removes the clone and leaves the real field in place.

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
2. Confirm the real form fields remain in place.
3. Confirm the active field receives an in-place highlight.
4. Confirm a clone of the active field balloons to the center.
5. Confirm the clone stays in the center long enough for the explanation to land.
6. Confirm the clone returns slowly toward the original field, not instantly.
7. Confirm the next guided field repeats the same behavior after the prior return.
8. Confirm there are not multiple nested horizontal/vertical scrollbars around the form.
9. Confirm the guided controls follow the centered form during form steps.
10. Confirm the floating narration/control bar appears during non-form steps.
11. Confirm highlighted cards are larger and move more visibly.
12. Confirm the highlight is warmer gold/green, not purple-forward.
13. Confirm the newest timeline update expands and shows `Current update`.
14. Confirm the demo no longer stops on every intermediate ledger-only moment.
15. Confirm reduced motion settings disable the new motion.
