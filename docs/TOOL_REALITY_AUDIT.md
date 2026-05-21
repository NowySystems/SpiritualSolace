# CRCF 3.4d — Tool Reality Audit

Date: 2026-05-20  
Scope: Evidence-based status audit of checks/tools/helpers/agents.

## Audit Standard (Locked)

Nothing is "working" unless evidence exists:

1. Script/check/tool exists.
2. CI runs it **or** a local command exists.
3. Output can be inspected.
4. Status is documented correctly.

Classification rules:

- If only documented: **Planned only**.
- If script/check exists but is not wired: **Built but not enforced**.
- If CI runs it: **Active in CI**.

## Tool Reality Table

| Item | Status | Where it lives | Runs in CI | Blocks merge | Evidence it works | Next action needed |
|---|---|---|---|---|---|---|
| GitHub Actions Foundation Check | Active in CI | `.github/workflows/foundation-check.yml` | Yes | Yes | Workflow runs on `pull_request`/`push` to `main`; executes validation chain | Keep as required gate and keep docs synced with actual steps |
| artifact scan | Active in CI | `.github/workflows/foundation-check.yml` ("Scan for hard conflict markers and Codex artifacts") | Yes | Yes | Step exits non-zero on hard markers/artifact fragments | Keep exclusion list intentional and minimal |
| secret scan | Active in CI | `.github/workflows/foundation-check.yml` ("Basic secret pattern scan") | Yes | Yes | Step exits non-zero on secret regex hits | Consider stronger scanner later (still keep current guard) |
| `npm run foundation:check` | Active in CI | `package.json`, `agents/scripts/foundation-check.mjs` | Yes | Yes | Script exists and is executed in workflow | Keep required text assertions aligned to current baseline docs |
| `npm run typecheck` | Active in CI | `package.json` + workflow | Yes | Yes | Script exists and is executed in workflow | Continue enforcing on every PR |
| `npm run build` | Active in CI | `package.json` + workflow | Yes | Yes | Script exists and is executed in workflow | Continue enforcing on every PR |
| Playwright smoke tests (`npm run test:smoke`) | Active in CI | `package.json` + workflow + Playwright dependency | Yes | Yes | Workflow installs Chromium and runs smoke tests | Add route coverage criteria report for failures |
| Vercel preview/deploy | Active in CI (external platform gate) | Mentioned in `SAVE_STATE.md`, `FOUNDATION_WORKFLOW.md` | Yes (outside GitHub workflow) | Yes (repo process requirement) | Current state docs record passing preview | Add explicit doc pointer to Vercel project/check policy |
| Existing helper scripts (`npm run check:staff`) | Active local check / report generation | `package.json`, `agents/scripts/` | Optional local use | No | Scripts generate read-only reports and summary | Keep read-only behavior and expand planned helper coverage |
| COMPETITIVE_INTELLIGENCE_HELPER | Planned only | `docs/HELPER_AGENT_PLAN.md` | No | No | Role/report schema documented only | Add report skeleton and invocation in CRCF 3.4e |
| PROJECT_ADVISOR_HELPER | Planned only | `docs/HELPER_AGENT_PLAN.md` | No | No | Role/output documented only | Add report skeleton and invocation in CRCF 3.4e |
| LESSON_CAPTURE_HELPER | Planned only | `docs/HELPER_AGENT_PLAN.md` | No | No | Role/output documented only | Add report skeleton and invocation in CRCF 3.4e |
| DECISION_LOG_HELPER | Planned only | `docs/HELPER_AGENT_PLAN.md` | No | No | Role/output documented only | Add decision-log artifact structure in CRCF 3.4e |
| REUSABLE_STACK_HELPER | Planned only | `docs/HELPER_AGENT_PLAN.md` | No | No | Role/output documented only | Add reusable-stack report skeleton in CRCF 3.4e |

## Current Truth (Baseline Reconciliation)

- **Current:** CRCF 3.4d — Add Competitive Intelligence + Learning Loop Staff Plan.
- **Current concern:** Most new helper roles are planned, not yet activated as report skeletons.
- **Recommended next phase:** **CRCF 3.5 — Source Database Real Status Layout**.
- **Then:** **CRCF 3.5 — Source Database Real Status Layout**.

## Learning-Loop Reality Note

Codex does not truly learn by itself. Project learning currently depends on preserving PR summaries, helper reports, CI outcomes, user feedback, decisions, and explicit rule updates in repository docs/reports.


## Helper Usefulness Principle

Every helper must answer:

- What did it check?
- What did it find?
- Is it blocker, warning, or info?
- What should we do next?
- Did this protect the product goal?


## Staff Communication Rule

Helper reports are for ChatGPT/owner review. ChatGPT interprets staff output and reports plain-English PASS / FAIL / WARNING to owner.
