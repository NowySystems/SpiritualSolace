# Reports Directory

This folder stores generated helper/staff markdown reports.

## Usage

- Run `npm run check:staff` to generate helper reports and a staff summary.
- Individual helper commands are available in `package.json`.
- Reports are read-only review artifacts for ChatGPT and owner review before any action.

## Current Report Outputs

Current active/reporting flow includes read-only helper outputs and summary reports.

- `reports/public-quality-report.md`
- `reports/ux-render-alignment-report.md`
- `reports/state-reconciliation-report.md`
- `reports/route-smoke-report.md`
- `reports/guardrail-review-report.md`
- `reports/pr-acceptance-report.md`
- `reports/ci-source-of-truth-report.md`
- `reports/visual-screenshot-report.md`
- `reports/competitive-intelligence-report.md`
- `reports/opportunity-scout-report.md`
- `reports/project-advisor-report.md`
- `reports/staff-summary-report.md`

## Planned Report Outputs

Planned additions in CRCF 3.4d/3.4e and future founder-command planning:

- `reports/lesson-capture-report.md`
- `reports/decision-log-report.md` (or `docs/DECISION_LOG.md`)
- `reports/reusable-stack-report.md`
- `reports/founder-command-summary.md`

## Helper Usefulness Principle

Every helper must answer:

- What did it check?
- What did it find?
- Is it blocker, warning, or info?
- What should we do next?
- Did this protect the product goal?

## Staff Communication Rule

Helper reports are for ChatGPT/owner review. ChatGPT interprets staff output and reports plain-English PASS / FAIL / WARNING to owner.

## Commit Policy

Generated report files are local validation artifacts and should not be committed unless intentionally capturing a stable sample.
