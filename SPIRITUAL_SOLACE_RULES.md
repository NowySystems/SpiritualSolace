# SpiritualSolace Prototype Rules

SpiritualSolace is a demo-only prototype for a consent-first, one-way spiritual support request platform for patients and families.

This is not a ministry-first platform, not a social network, not a chat app, and not a hospital-integrated production system.

## Prototype Status

- Demo only
- No real patient information
- No real hospital integration
- No real clergy/responder accounts
- No real video upload
- No backend persistence required
- No compliance certification claimed

## Core Workflow

1. Patient or family member requests spiritual support.
2. Patient chooses identity display: anonymous or first name only.
3. Facility rules determine what information may be shown.
4. Only approved responders may receive eligible requests.
5. Responder submits one short support message.
6. Message is reviewed if facility rules require review.
7. Patient receives a temporary one-way message.
8. Message expires and is no longer available.

## Hard Rules

- No diagnosis fields
- No treatment fields
- No medical advice
- No PHI-heavy data collection
- No open chat
- No reply threads
- No patient search
- No public responder directory
- No unapproved responder access
- No external contact sharing
- No fundraising
- No solicitation
- No political messaging
- No automatic hospital actions
- No permanent message storage by default
- All messages must show temporary/expiration status
- Facility rules control identity display, retention, review requirements, video length, and responder permissions

## Required Pages

- Dashboard
- Support Requests
- Approved Responders
- Message Review
- Facility Rules
- Patient View
- Audit Log
- Guardrails

## UI Direction

Reuse the clean DonorRoute-style shell and layout, but remove all grant/funding/source language.

The app should feel:
- calm
- patient-first
- facility-controlled
- consent-first
- safe
- simple
- prototype/demo clearly labeled
