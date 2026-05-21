import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const checks = [
  { name: 'PUBLIC_QUALITY_APP_HELPER', cmd: ['node', 'agents/scripts/public-quality-check.mjs'] },
  { name: 'UX_RENDER_ALIGNMENT_HELPER', cmd: ['node', 'agents/scripts/ux-render-alignment-check.mjs'] },
  { name: 'STATE_RECONCILIATION_HELPER', cmd: ['node', 'agents/scripts/state-reconciliation-check.mjs'] },
  { name: 'ROUTE_SMOKE_HELPER', cmd: ['node', 'agents/scripts/route-smoke-check.mjs'] },
  { name: 'GUARDRAIL_REVIEW_HELPER', cmd: ['node', 'agents/scripts/guardrail-review-check.mjs'] },
  { name: 'PR_ACCEPTANCE_HELPER', cmd: ['node', 'agents/scripts/pr-acceptance-check.mjs'] },
  { name: 'CI_SOURCE_OF_TRUTH_HELPER', cmd: ['node', 'agents/scripts/ci-source-of-truth-check.mjs'] },
  { name: 'VISUAL_SCREENSHOT_HELPER', cmd: ['node', 'agents/scripts/visual-screenshot-helper.mjs'] },
  { name: 'COMPETITIVE_INTELLIGENCE_HELPER', cmd: ['node', 'agents/scripts/competitive-intelligence-skeleton.mjs'] },
  { name: 'OPPORTUNITY_SCOUT_HELPER', cmd: ['node', 'agents/scripts/opportunity-scout-skeleton.mjs'] },
  { name: 'PROJECT_ADVISOR_HELPER', cmd: ['node', 'agents/scripts/project-advisor-skeleton.mjs'] }
];

const summary = [];
let hasCrash = false;
let hasGuardrailBlocker = false;

for (const check of checks) {
  const run = spawnSync(check.cmd[0], check.cmd.slice(1), { cwd: root, encoding: 'utf8' });
  let parsed = { helper: check.name, blockers: 0, warnings: 0, reportPath: 'n/a' };
  try {
    parsed = JSON.parse((run.stdout || '').trim().split('\n').filter(Boolean).at(-1) || '{}');
  } catch {
    hasCrash = true;
  }

  const crashed = run.status !== 0 && check.name !== 'GUARDRAIL_REVIEW_HELPER';
  const guardrailBlocked = check.name === 'GUARDRAIL_REVIEW_HELPER' && run.status !== 0 && Number(parsed.blockers || 0) > 0;
  if (crashed) hasCrash = true;
  if (guardrailBlocked) hasGuardrailBlocker = true;

  const warnings = Number(parsed.warnings || 0);
  summary.push({
    helper: parsed.helper || check.name,
    blockers: Number(parsed.blockers || 0),
    warnings,
    reportPath: parsed.reportPath || 'n/a',
    nextAction: guardrailBlocked
      ? 'Resolve blocker language before merge.'
      : warnings > 0
        ? 'Review warnings and schedule cleanup.'
        : 'No immediate action required.'
  });
}

const out = ['# Staff Summary Report', '', '| Helper | Blockers | Warnings | Report | Recommended next action |', '|---|---:|---:|---|---|'];
summary.forEach((s) => out.push(`| ${s.helper} | ${s.blockers} | ${s.warnings} | \`${s.reportPath}\` | ${s.nextAction} |`));
out.push('', '- Exit rule: fail only on guardrail blockers or script crash.', `- Guardrail blockers detected: ${hasGuardrailBlocker ? 'yes' : 'no'}`, `- Script crash detected: ${hasCrash ? 'yes' : 'no'}`);

fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'reports', 'staff-summary-report.md'), `${out.join('\n')}\n`, 'utf8');

if (hasCrash || hasGuardrailBlocker) process.exit(1);
console.log('Staff checks completed.');
