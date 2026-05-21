# CRCF Foundation Workflow

## Current State (Post-CRCF 3.4d / Foundation Check #40)

The tool foundation chain is green in GitHub Actions.

Foundation chain remains green after CRCF 3.4c helper activation; current concern is safely extending helper/staff planning while preserving zero behavior changes.

Verified:

- Foundation Check #40 passed.
- Install dependencies passed.
- Playwright browser install passed.
- Hard conflict/Codex artifact scan passed.
- Basic secret pattern scan passed.
- `npm run foundation:check` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run test:smoke` passed.
- Vercel preview deployment is passing.

## Working Loop

1. ChatGPT compresses planning, roadmap, grant logic, and build prompts.
2. Codex performs scoped tasks with guardrails first.
3. GitHub Actions validates foundation/tooling quality gates.
4. Vercel preview confirms deployment integrity.
5. Human owner reviews before any external/system-changing action.

## Operating Rules (PR #48 / #49 Learnings)

- Full-file replacement by default for workflows, config files, package files, guardrail docs, route files, and scripts.
- No partial fixes unless explicitly requested.
- Conflict recovery requires full-file canonical replacement.
- Hard stop only on actual unresolved conflict markers: `<<<<<<<` and `>>>>>>>`.
- Standalone `=======` is soft-review only.
- Isolate guardrail/tooling changes from feature/tool PRs.
- After two failed CI guardrail loops, stop adding complexity and simplify.

## MVP Data Rule

Use local/static/sample data first.

## Data Rule

Keep all MVP data local/static/sample only. No Firebase, Firestore, external APIs, crawling, scraping, source-system writes, private records, or automated submissions are permitted.

## Learning Loop Governance Rule

Codex does not truly learn by itself. The project learns through structured reports, decision logs, reusable rules, helper checks, advisor summaries, and preserved validation/user-feedback history.


## Helper Usefulness Principle

Every helper must answer:

- What did it check?
- What did it find?
- Is it blocker, warning, or info?
- What should we do next?
- Did this protect the product goal?


## Staff Communication Rule

Helper reports are for ChatGPT/owner review. ChatGPT interprets staff output and reports plain-English PASS / FAIL / WARNING to owner.
