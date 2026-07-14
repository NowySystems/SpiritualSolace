# PR80: MVP visual cleanup and pilot-ready polish

## Motivation

The guided demo flow is paused for now. The actual MVP surface needed a stronger pilot-readiness pass:

- too many beige, eggshell, white, sage, and gold surfaces blended together,
- some labels and informational chips looked like buttons,
- the portal cards needed more separation and hierarchy,
- role visibility/explainer panels felt like placeholder training copy,
- the landing page still had preview/demo-ish language,
- the product needed more comforting contrast and less same-tone wash,
- the MVP needed to feel like an operating workspace instead of a styled prototype.

## Description

Adds:

- `app/mvp-polish.css`
- `app/pilot-ready-polish.css`
- `docs/PR79_SUMMARY.md`

Updates:

- `app/layout.tsx`
- `components/LandingPageV1.tsx`

## Behavior

The MVP/pilot-ready polish stylesheets:

- add a clearer visual system for navy, forest green, teal, mint, wheat, white, and muted surfaces,
- improve page backgrounds so the app feels less beige-on-beige,
- add cooler mint/teal contrast behind white working surfaces,
- make main portal shells and cards more solid and more separated,
- give the identity/status card a clearer dark green lane,
- hide/neutralize placeholder-looking header chips,
- hide the role visibility explainer panel from the normal MVP portal view,
- keep real buttons and links visually obvious,
- reduce the purple cast in forms and narration surfaces,
- make form fields cleaner and more production-like,
- make the official ledger feel more like a record lane instead of a stack of beige cards,
- make the checklist rail read as the primary action area,
- improve landing page portal card separation,
- make the operational guardrails section feel more like product positioning and less like demo copy.

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
2. Confirm the page has more comforting contrast and less white/eggshell wash.
3. Confirm placeholder-looking header chips are gone or visually neutralized.
4. Confirm portal cards have stronger separation.
5. Open Requester, Facility, and Partner portal pages.
6. Confirm the role visibility explainer panel is not shown in normal portal view.
7. Confirm non-clickable status/badge elements no longer feel like primary buttons.
8. Confirm real buttons and links still look clickable.
9. Confirm colors have clearer hierarchy across header, hero, case file, ledger, checklist, and forms.
10. Confirm the guided demo still starts and runs, but the demo flow itself was not changed.
