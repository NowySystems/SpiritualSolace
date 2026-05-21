# CRCF 3.4e — Staff Effectiveness Upgrade

## Purpose

Define the expanded read-only helper/staff layer so GrantView/CRCF and future projects can learn from competitor movement, PR outcomes, user feedback, helper reports, and repeated mistakes.

This phase is planning/documentation only.

- No live helper implementation in this phase.
- No app/source/workflow/package behavior changes in this phase.

## Operating Model

Helpers are assistant roles used to review, check, summarize, and report.

Codex remains the implementation agent for code changes.

Helpers provide parallel review capacity by producing reports that ChatGPT and the human owner can use to select the safest, highest-value next move.

## Global Helper Constraints (Hard)

- Read-only and report-only.
- Must not write data.
- Must not modify files automatically.
- Must not persist source results automatically.
- Must not contact funders.
- Must not submit grants.
- Must not log into portals.
- Must not scrape restricted/subscription sources.
- Must not perform source-system writes.
- Human review required before any external action.

## Existing Helper Roles (Active Plan Set)

1. SOURCE_REVIEW_HELPER
2. OPPORTUNITY_QUALITY_HELPER
3. UX_CLARITY_HELPER
4. RELEASE_QA_HELPER
5. GUARDRAIL_REVIEW_HELPER

## New Planned Staff Roles (CRCF 3.4d)

### 1) COMPETITIVE_INTELLIGENCE_HELPER

**Purpose**

Track market and competitor positioning across product lines.

**Projects covered**

- GrantView / CRCF
- Bastion
- Avora
- future SMB/accounting platform

**Competitor coverage scope**

- **GrantView / CRCF:** Zeffy, Candid, GrantWatch, GrantStation, Instrumentl, Givebutter, Gravyty, DonorPerfect, Foundation Directory/Candid, local/state/federal grant tools, and relevant nonprofit/fundraising platforms.
- **Bastion:** Monarch Money, Empower, ProjectionLab, Boldin/NewRetirement, YNAB, Copilot Money, Rocket Money, Kubera, RightCapital, eMoney, MaxiFi, advisor planning tools, tax planning tools, and AI financial copilots.
- **Avora:** OneCause, Givebutter, Eventbrite, Classy, Greater Giving, Handbid, BetterWorld, and fundraising/event/auction/check-in platforms.

**Output later**

- `reports/competitive-intelligence-report.md`

**Report fields**

- Project
- Competitor
- What they do well
- Weakness/gap
- Pricing/market position
- Threat level
- Feature opportunity
- Recommended action

**Alert behavior**

- INFO for awareness
- WARNING if competitor feature/positioning gap should be tracked
- ACTION if roadmap positioning should change
- Not a merge blocker unless product positioning is factually misleading

### 2) PROJECT_ADVISOR_HELPER

**Purpose**

Read roadmap, save state, helper reports, PR summaries, user feedback, and current phase to recommend the next safest/highest-value move.

**Should answer**

- Are we on target?
- Did we drift from the product goal?
- Did Codex make something technically valid but product-wrong?
- Should the next move be build, audit, polish, activate tools, or stop?
- What should become reusable for Bastion/Avora?

**Output later**

- `reports/project-advisor-report.md`

### 3) LESSON_CAPTURE_HELPER

**Purpose**

Turn repeated mistakes and user feedback into permanent rules, helper checks, or roadmap items.

**Should capture**

- what went wrong
- where it showed up
- whether a helper/check should catch it next time
- whether it should become a public-quality rule
- whether it should be reusable across projects

**Output later**

- `reports/lesson-capture-report.md`

### 4) DECISION_LOG_HELPER

**Purpose**

Record why decisions were made, not just what changed.

**Should track**

- decision
- context
- options considered
- final direction
- reason
- future review trigger

**Output later**

- `docs/DECISION_LOG.md` or `reports/decision-log-report.md`

### 5) REUSABLE_STACK_HELPER

**Purpose**

Identify reusable assets/tools/patterns that should be extracted or copied into Bastion, Avora, and future products.

**Should track**

- reusable scripts
- helper checks
- CI patterns
- prompt patterns
- UX rules
- governance rules
- component patterns
- report formats

**Output later**

- `reports/reusable-stack-report.md`

## Learning-Loop Rule (Locked)

The system should learn from every step by preserving:

- PR summaries
- helper reports
- CI results
- user feedback
- Codex failures
- UI regressions
- competitive findings
- decisions made
- rules added

Principle: Codex does not truly learn by itself. The project learns through structured reports, decision logs, reusable rules, helper checks, and advisor summaries.

## Staff Hierarchy (Locked)

- Owner / Lead: user
- Second-in-command: ChatGPT
- Builder: Codex or another coding tool if better
- Validators: GitHub Actions, Playwright, helper scripts
- Staff/helpers: read-only report generators
- Advisor/helper layer: recommends next moves but never writes or decides alone

## Phase and Roadmap Alignment

- **Current phase:** CRCF 3.4d — Add Competitive Intelligence + Learning Loop Staff Plan.
- **Recommended next phase:** CRCF 3.5 — Source Database Real Status Layout.
- **Then:** CRCF 3.5 — Source Database Real Status Layout.


## Helper Usefulness Principle

Every helper must answer:

- What did it check?
- What did it find?
- Is it blocker, warning, or info?
- What should we do next?
- Did this protect the product goal?


## Staff Communication Rule

Helper reports are for ChatGPT/owner review. ChatGPT interprets staff output and reports plain-English PASS / FAIL / WARNING to owner.
