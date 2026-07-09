# PR72: Pilot status alignment

## Motivation

ChurchWork has moved past concept/demo into pilot hardening. The pilot workspace should say that clearly so Cole, Sam, and early testers see the same current path inside `/pilot`.

## Description

Updates:

- `components/PilotWorkspaceShell.tsx`
- `docs/PR72_SUMMARY.md`

## Behavior

The pilot overview now reflects the current pilot state:

- Grandview Post Acute is shown as the first facility pilot target.
- Hope Church is shown as the first church partner target.
- ChurchWork Owner/Admin is shown as the control layer for Cole and Sam.
- The next build path is listed directly in the overview:
  - role-based pilot routing,
  - Grandview facility request review queue,
  - Hope Church partner workspace,
  - requester status tied to the shared timeline,
  - timeline visibility and RLS test matrix.

The seed check copy now confirms the intended seed targets: ChurchWork, Grandview Post Acute, and Hope Church.

## Guardrails

- No Supabase schema changes.
- No RLS changes.
- No requester intake behavior changes.
- No medical fields.
- No open chat.
- No partner routing yet.
- No Worship From Home implementation yet; it is only noted as queued after the pilot path is stable.

## Testing

Source-level update only. Browser testing should confirm that `/pilot` renders the updated overview and the existing tabs still switch correctly.
