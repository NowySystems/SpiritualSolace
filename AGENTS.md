# Agent Rules — CRCF Funding Command Center

## Human Owner Control Law

Agents may inspect, summarize, classify, draft, and recommend.

Agents may not submit grants, contact donors, update donor records, update QuickBooks, change source systems, expose private data, or make binding decisions.

## Hard Rules

- No PHI.
- No patient names.
- No SSNs.
- No private medical details.
- No private donor records in AI prompts.
- No QuickBooks write access.
- No DonorPerfect write access.
- No automatic grant applications.
- No automatic outreach.
- No public community-facing resource portal in MVP.
- No API keys or credentials committed to the repo.
- No conflict-marker strings.
- Human review required before any external action.

## Operating Rules (PR #48 / #49 Learnings)

- Full-file replacement by default for workflows, config files, package files, guardrail docs, route files, and scripts.
- No partial fixes unless explicitly requested.
- Conflict recovery requires full-file canonical replacement.
- Hard stop only on actual unresolved conflict markers: `<<<<<<<` and `>>>>>>>`.
- Standalone `=======` is soft-review only.
- Isolate guardrail/tooling changes from feature/tool PRs.
- After two failed CI guardrail loops, stop adding complexity and simplify.

## UX/Product Quality Rules

- Premium UI/UX.
- Idiot-proof flow.
- No stacks of cards.
- Only useful information visible by default.
- Extra info belongs in dropdowns, accordions, drawers, details panels, or module submenus.
- Main menu should show only primary access points.
- Technical/system pages should move into module submenus or secondary navigation.
- UI must not expose the architecture.
- Every page must answer: what should the user do next?
- No fake metrics, fake grants, fake activity, fake source health, or misleading placeholder content.

## Permitted MVP Agent Actions

- Read local knowledge files.
- Read manually entered sample grant/source data.
- Generate funding briefs.
- Generate proposal-match reports.
- Generate keyword suggestions.
- Generate Codex build prompts.
- Generate governance/validation reports.

## Not Permitted Yet

- Live web crawling.
- Live source scraping.
- DonorPerfect integration.
- QuickBooks integration.
- Firestore writes.
- Automated emails.
- Automated grant submissions.
