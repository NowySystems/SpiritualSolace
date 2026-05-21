import fs from 'node:fs';
import path from 'node:path';

const reportPath = path.join(process.cwd(), 'reports', 'visual-screenshot-report.md');
const routes = ['/', '/funding-search', '/source-database', '/proposal-scanner', '/review-queue', '/reports'];

const lines = [
  '# Visual Screenshot Helper Report',
  '',
  '- Helper: **VISUAL_SCREENSHOT_HELPER**',
  '- Mode: report-only skeleton (capture wiring deferred).',
  '',
  '| Target route | Expected screenshot artifact path | Status | Next action |',
  '|---|---|---|---|',
  ...routes.map((route) => `| \`${route}\` | \`reports/artifacts/screenshots${route === '/' ? '/home.png' : `${route.replaceAll('/', '-')}.png`}\` | planned/skeleton | Wire capture safely via Playwright in cloud-first CI-compatible flow. |`),
  '',
  '## Helper Usefulness Answers',
  '- What did it check? Required visual QA routes and artifact naming plan.',
  '- What did it find? Skeleton coverage is prepared for all target routes.',
  '- Is it blocker, warning, or info? INFO (planning state).',
  '- What should we do next? Add safe screenshot capture implementation when approved.',
  '- Did this protect the product goal? Yes — it sets a cheap-first visual drift detection path.',
];

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ helper: 'VISUAL_SCREENSHOT_HELPER', blockers: 0, warnings: 0, reportPath: 'reports/visual-screenshot-report.md' }));
