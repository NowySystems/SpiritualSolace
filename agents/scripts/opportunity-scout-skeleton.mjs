import fs from 'node:fs';
import path from 'node:path';

const reportPath = path.join(process.cwd(), 'reports', 'opportunity-scout-report.md');

const lines = [
  '# Opportunity Scout Report (Skeleton)',
  '',
  '- Helper: **OPPORTUNITY_SCOUT_HELPER**',
  '- Mode: report-only skeleton (no web browsing in script).',
  '',
  '| Opportunity | Pain level | Buyer clarity | Build difficulty | Time to MVP | Revenue potential | Competition level | Reusable value | Fit with existing stack | Compliance/risk burden | Recommendation |',
  '|---|---|---|---|---|---|---|---|---|---|---|',
  '| _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ | PARK / TEST / BUILD SMALL / INCUBATE / IGNORE |',
  '',
  '## Recommendation Labels',
  '- PARK',
  '- TEST',
  '- BUILD SMALL',
  '- INCUBATE',
  '- IGNORE',
  '',
  '## Helper Usefulness Answers',
  '- What did it check? Opportunity scoring schema for future tools and revenue paths.',
  '- What did it find? Reusable scoring/report template is in place.',
  '- Is it blocker, warning, or info? INFO.',
  '- What should we do next? Populate candidate opportunities and rank with labels.',
  '- Did this protect the product goal? Yes — it channels exploration into a disciplined format.',
];

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ helper: 'OPPORTUNITY_SCOUT_HELPER', blockers: 0, warnings: 0, reportPath: 'reports/opportunity-scout-report.md' }));
