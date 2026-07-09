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
- active fields appeared in the center but did not balloon up from their original form positions.

## Description

Adds:

- `app/demo-polish.css`
- `app/demo-focus-field.css`
- `components/ChurchWorkDemoFlowSkipper.tsx`
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
- show only the current active form field during guided form steps,
- hide inactive form fields during narration so the field being discussed becomes the whole focus,
- enlarge the current field, select, checkbox, and current-step badge,
- animate the active field from an approximate original form-grid position into the center,
- use different starting positions for early, middle, right, lower, and acknowledgement fields,
- use a consistent floating narration/control bar for non-form steps,
- hide the floating narration/control bar while the form is center-stage so there is only one focus area,
- highlight the newest visible timeline update during the demo,
- expand the current timeline update card and add a `Current update` badge,
- keep reduced-motion behavior for users who prefer less animation.

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
3. Confirm only the current form field is shown during guided form steps.
4. Confirm the current form field is large and easy to understand.
5. Confirm inactive form fields are hidden during narration.
6. Confirm active fields balloon from different form-grid positions into the center.
7. Confirm the field movement feels like it is being pulled out of the form rather than simply appearing.
8. Confirm there are not multiple nested horizontal/vertical scrollbars around the form.
9. Confirm the guided controls follow the centered form during form steps.
10. Confirm the floating narration/control bar appears during non-form steps.
11. Confirm highlighted cards are larger and move more visibly.
12. Confirm the highlight is warmer gold/green, not purple-forward.
13. Confirm the newest timeline update expands and shows `Current update`.
14. Confirm the demo no longer stops on every intermediate ledger-only moment.
15. Confirm reduced motion settings disable the new motion.
