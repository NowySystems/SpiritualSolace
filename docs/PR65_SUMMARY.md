# PR65 Summary

## Title

Make dove the landing hero and CW mark the product logo

## Motivation

The ChurchWork brand hierarchy is now locked:

- Dove = hero / emotional mission visual.
- CW people mark = corner logo / app logo / marketing logo.

The landing page needed to reflect that clearly.

## What changed

Added:

- `components/ChurchWorkDoveHero.tsx`
- `components/LandingPageV1.tsx`

Updated:

- `app/page.tsx`

## Behavior

The landing page now uses:

- CW people logo in the top-left header.
- Dove as the large hero visual.
- CW mark as a small decorative corner/product mark.
- A cleaner V1 landing structure for the current pilot.

## Notes

This does not change database behavior, Supabase policy behavior, or pilot permissions.

The uploaded CW artwork remains the brand direction for corner/app/marketing use. This PR implements the hierarchy in code while keeping the current vector logo component in place.
