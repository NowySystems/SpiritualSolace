# PR76: Demo spotlight polish

## Motivation

The guided demo needed stronger visual emphasis before showing it to pilot stakeholders:

- the right-side rail still felt too squeezed,
- active boxes were not large or animated enough,
- timeline updates did not clearly spotlight each new update,
- the purple highlight blended into the existing palette.

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
3. Confirm highlighted cards are larger and move more visibly.
4. Confirm the highlight is warmer gold/green, not purple-forward.
5. Confirm the newest timeline update expands and shows `Current update`.
6. Confirm active fields still pop during form steps.
7. Confirm reduced motion settings disable the new motion.
