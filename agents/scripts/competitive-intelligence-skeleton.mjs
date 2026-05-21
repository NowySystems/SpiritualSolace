import fs from 'node:fs';
import path from 'node:path';

const reportPath = path.join(process.cwd(), 'reports', 'competitive-intelligence-report.md');
const projects = ['GrantView / CRCF', 'Bastion', 'Avora', 'Future SMB/accounting platform'];

const lines = [
  '# Competitive Intelligence Report (Skeleton)',
  '',
  '- Helper: **COMPETITIVE_INTELLIGENCE_HELPER**',
  '- Mode: report-only skeleton (no web browsing in script).',
  '',
  '| Project | Competitors to monitor | What they do well | Weakness/gap | Pricing/market position | Threat level | Feature opportunity | Recommended action |',
  '|---|---|---|---|---|---|---|---|',
  ...projects.map((p) => `| ${p} | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |`),
  '',
  '## Helper Usefulness Answers',
  '- What did it check? Skeleton structure for competitor monitoring across projects.',
  '- What did it find? Reporting template is ready for human-reviewed entries.',
  '- Is it blocker, warning, or info? INFO.',
  '- What should we do next? Fill with curated findings during planning/review cycles.',
  '- Did this protect the product goal? Yes — it creates a repeatable market-awareness frame.',
];

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ helper: 'COMPETITIVE_INTELLIGENCE_HELPER', blockers: 0, warnings: 0, reportPath: 'reports/competitive-intelligence-report.md' }));
