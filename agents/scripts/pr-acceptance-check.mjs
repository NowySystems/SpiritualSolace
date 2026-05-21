import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportPath = path.join(root, 'reports', 'pr-acceptance-report.md');

const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(root, relative));

const saveState = read('SAVE_STATE.md');
const roadmap = read('ROADMAP.md');
const pkg = JSON.parse(read('package.json'));
const helperPlan = read('docs/HELPER_AGENT_PLAN.md');
const toolReality = read('docs/TOOL_REALITY_AUDIT.md');
const workflow = read('FOUNDATION_WORKFLOW.md');

const checks = [];
const add = (name, passed, detail, level = passed ? 'INFO' : 'WARNING') => checks.push({ name, passed, detail, level });

add('Current phase is documented in SAVE_STATE.md', /CRCF 3\.4e — Staff Effectiveness Upgrade/.test(saveState), 'SAVE_STATE should declare CRCF 3.4e as current phase.');
add('Next phase is documented in ROADMAP.md', /CRCF 3\.5 — Source Database Real Status Layout/.test(roadmap), 'ROADMAP should preserve CRCF 3.5 as next product phase.');
add('check:staff script exists', Boolean(pkg?.scripts?.['check:staff']), 'package.json should include check:staff.');

const requiredValidationDocs = /npm run check:staff/.test(workflow) && /npm run foundation:check/.test(workflow) && /npm run typecheck/.test(workflow) && /npm run build/.test(workflow);
add('Required validation commands are documented', requiredValidationDocs, 'FOUNDATION_WORKFLOW should list check:staff, foundation:check, typecheck, and build.');

const dangerousWording = /(build failed\s*but\s*merge anyway|merge anyway|ignore build failure|ship despite failed build)/i;
const combinedDocs = `${saveState}\n${roadmap}\n${helperPlan}\n${toolReality}\n${workflow}`;
add('No obvious "build failed but merge anyway" wording', !dangerousWording.test(combinedDocs), 'Current docs should not instruct merging despite failed builds.');

const behaviorChangeWithoutValidation = /behavior change/i.test(combinedDocs) && !requiredValidationDocs;
add('No behavior-change claims without validation language', !behaviorChangeWithoutValidation, 'If behavior changes are claimed, validation commands should be documented.');

const helperExpectationsDoc = /What did it check\?/i.test(helperPlan) && /What did it find\?/i.test(helperPlan);
add('Helper report expectations are documented', helperExpectationsDoc, 'Helper docs should include the usefulness questions for reports.');

const warnings = checks.filter((c) => !c.passed).length;
const blockers = 0;

const lines = [
  '# PR Acceptance Report',
  '',
  '- Helper: **PR_ACCEPTANCE_HELPER**',
  '- Mode: report-only (warnings do not fail).',
  '',
  '| Check | Result | Level | Detail |',
  '|---|---|---|---|',
  ...checks.map((c) => `| ${c.name} | ${c.passed ? 'PASS' : 'REVIEW'} | ${c.level} | ${c.detail} |`),
  '',
  '## Summary',
  `- Blockers: ${blockers}`,
  `- Warnings: ${warnings}`,
  '- What did it check? PR-evidence readiness and documentation integrity for merge decisions.',
  '- What did it find? See check table above.',
  '- Is it blocker, warning, or info? Report-only warning/info classifications.',
  '- What should we do next? Resolve warnings before merge where possible and keep CI-backed evidence current.',
  '- Did this protect the product goal? Yes — it reinforces documented, cloud-first merge readiness evidence.',
];

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ helper: 'PR_ACCEPTANCE_HELPER', blockers, warnings, reportPath: 'reports/pr-acceptance-report.md' }));
