# PR79: MVP visual cleanup

## Motivation

The guided demo flow is close enough to pause, but the actual MVP surface still needed cleanup:

- too many beige/sage/gold surfaces blended together,
- some labels and informational chips looked like buttons,
- the portal cards needed more separation and hierarchy,
- the landing page still had preview/demo-ish language,
- the product needed to feel more like a professional MVP and less like a styled prototype.

## Description

Adds:

- `app/mvp-polish.css`
- `docs/PR79_SUMMARY.md`

Updates:

- `app/layout.tsx`
- `components/LandingPageV1.tsx`

## Behavior

The MVP polish stylesheet:

- adds a clearer visual system for navy, green, sage, gold, white, and muted surfaces,
- improves page backgrounds so the app feels less beige-on-beige,
- makes main portal shells and cards more solid white with cleaner borders,
- gives the identity/status card a clearer dark green lane,
- makes non-clickable header/status pills read as labels instead of buttons,
- keeps real buttons and links visually obvious,
- reduces the purple cast in forms and narration surfaces,
- makes form fields cleaner and more production-like,
- makes the official ledger feel more like a record instead of a stack of beige cards,
- makes the role visibility panel read as an informational note rather than a CTA,
- improves landing page portal card separation.

Landing page copy changes:

- changes the logo subline to `Spiritual-care operations`,
- changes the hero eyebrow to `Spiritual-care operations`,
- tightens portal descriptions,
- changes `Pilot guardrails` to `Operational guardrails`,
- removes preview/demo-only language from the guardrail copy.

## Guardrails

- No demo-flow changes.
- No Supabase changes.
- No care workflow changes.
- No route changes.
- No auth changes.
- No pilot stack changes.

## Testing

Browser test after deploy:

1. Load the landing page and confirm it feels like a product surface, not a placeholder/demo page.
2. Confirm `Spiritual-care operations` appears as the brand subline.
3. Confirm portal cards have stronger separation.
4. Open Requester, Facility, and Partner portal pages.
5. Confirm non-clickable status/visibility/badge elements no longer feel like primary buttons.
6. Confirm real buttons and links still look clickable.
7. Confirm colors have clearer hierarchy and less same-tone wash.
8. Confirm the guided demo still starts and runs, but the demo flow itself was not changed.
