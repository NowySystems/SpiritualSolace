# PR77: Demo overlap/readability hotfix

## Motivation

After PR76, the guided demo motion felt much better, but some boxes overlapped and the form cards could still feel visually crowded. The root issue was that the real active form field was still being transformed/inflated by CSS instead of staying in its original layout position.

## Description

Adds:

- `components/ChurchWorkDemoBalloonAnimator.tsx`
- `docs/PR77_SUMMARY.md`

Updates:

- `app/demo-focus-field.css`
- `app/layout.tsx`

## Behavior

This hotfix changes the guided form behavior to:

- keep the real form fields in a stable grid,
- keep inactive fields visible,
- avoid hiding/inflating real fields,
- apply only an in-place highlight to the real active field,
- use a temporary cloned field for the balloon-out/hold/return animation,
- make the clone hold in the center long enough for narration,
- return the clone slowly to the original field position,
- improve card opacity, borders, and shadows to reduce background bleed-through.

## Guardrails

- No Supabase changes.
- No care workflow changes.
- No demo script changes.
- No audio route changes.
- No pilot stack changes.
- No changes to real user data behavior.

## Testing

Browser test the guided demo:

1. Start the guided demo.
2. Confirm form cards do not overlap.
3. Confirm all real form fields stay in their grid positions.
4. Confirm the active real field is only highlighted in place.
5. Confirm a cloned field balloons to center, holds, then returns slowly.
6. Confirm the next field repeats the behavior.
7. Confirm there is no weird layout jump or nested scrollbar issue.
8. Confirm mobile still stacks fields normally.
