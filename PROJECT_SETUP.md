# CRCF Funding Command Center — Project Setup

## Phase 0 — Project Identity

Repository name:
crcf-funding-command

Local folder:
T:\Cole\crcf-funding-command\crcf-funding-command

Display name:
CRCF Funding Command Center

Current Save State:
CRCF 0.6 — Source Manager

## Purpose

Internal-only grant, funding, proposal-matching, donor-market, and source intelligence dashboard for Cookeville Regional Charitable Foundation.

## Independence Rule

This project is separate from Bastion, Avora, and all other main projects.

Bastion may be used as an architecture reference only. Do not merge Bastion financial engines, Firebase settings, user data, secrets, or deployment settings into this project.

## Platform Plan

- GitHub private repo
- ChatGPT for planning and prompt compression
- Codex for surgical build tasks
- Vercel later for private/internal preview deployment
- No Firebase/Firestore in this project under current governance
- Cloudflare later only if custom domain/security routing is needed

## MVP Rule

Start local/static first.

No Firebase.
No Firestore.
No external APIs.
No crawling.
No scraping.
No donor system integration.
No QuickBooks integration.
No DonorPerfect integration.
No public community-facing portal.
No PHI.
