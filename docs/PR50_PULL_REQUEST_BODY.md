# PR50 Pull Request Body

This file mirrors the PR body for traceability.

## Motivation

ChurchWork has moved from demo validation into Pilot #001 preparation with Grandview Post Acute and Hope Church.

This PR creates the first pilot-safe backend, policy, launch, and theme foundation before live signup, QR distribution, or real request submission.

## Description

Adds Pilot Safe v1 documentation and a Supabase migration for the live pilot foundation.

## Guardrails

- No frozen demo UI changes.
- No requester free-text notes.
- No medical fields on care requests.
- Request creation requires `no_medical_information_acknowledged = true`.
- Facility and partner notes are limited to non-medical coordination notes on timeline events.
- Partner access is limited to assigned partner-safe request context.
- Requester access is limited to their own request and requester/shared timeline visibility.

## Testing

Source-level checks only. Supabase migration execution and RLS integration testing still required before live deployment.
