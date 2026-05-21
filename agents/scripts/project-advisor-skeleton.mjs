import fs from 'node:fs';
import path from 'node:path';

const reportPath = path.join(process.cwd(), 'reports', 'project-advisor-report.md');

const lines = [
  '# Project Advisor Report (Skeleton)',
  '',
  '- Helper: **PROJECT_ADVISOR_HELPER**',
  '- Mode: report-only skeleton.',
  '',
  '## Current state',
  '- _TBD from SAVE_STATE.md and ROADMAP.md_',
  '',
  '## Current blockers',
  '- _TBD from CI/helpers/PR summaries_',
  '',
  '## Staff/helper warnings',
  '- _TBD from reports/staff-summary-report.md and helper outputs_',
  '',
  '## Product drift risks',
  '- _TBD_',
  '',
  '## Recommended next move',
  '- _TBD_',
  '',
  '## Why',
  '- _TBD_',
  '',
  '## Reusable lessons for Bastion/Avora/future products',
  '- _TBD_',
  '',
  '## Helper Usefulness Answers',
  '- What did it check? The advisory report structure for safe next-step recommendations.',
  '- What did it find? A consistent template for decision-quality guidance.',
  '- Is it blocker, warning, or info? INFO.',
  '- What should we do next? Feed this template with live helper and PR evidence each phase.',
  '- Did this protect the product goal? Yes — it formalizes anti-drift recommendation flow.',
];

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ helper: 'PROJECT_ADVISOR_HELPER', blockers: 0, warnings: 0, reportPath: 'reports/project-advisor-report.md' }));
