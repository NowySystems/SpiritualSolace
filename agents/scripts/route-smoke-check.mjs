import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportPath = path.join(root, 'reports', 'route-smoke-report.md');

const expected = [
  { route: '/', candidates: ['app/page.tsx'] },
  { route: '/funding-search', candidates: ['app/funding-search/page.tsx'] },
  { route: '/source-database', candidates: ['app/source-database/page.tsx'] },
  { route: '/proposal-scanner', candidates: ['app/proposal-scanner/page.tsx'] },
  { route: '/review-queue', candidates: ['app/review-queue/page.tsx'] },
  { route: '/reports', candidates: ['app/reports/page.tsx'] },
  { route: '/governance or help/rules reference', candidates: ['app/governance/page.tsx'] },
  { route: '/api/source-pilots', candidates: ['app/api/source-pilots/route.ts'] },
  { route: '/api/grants-gov/search', candidates: ['app/api/grants-gov/search/route.ts'] },
  { route: '/api/grants-gov/detail', candidates: ['app/api/grants-gov/detail/route.ts'] },
  { route: '/api/usaspending/search', candidates: ['app/api/usaspending/search/route.ts'] }
];

const results = expected.map((e) => {
  const found = e.candidates.some((c) => fs.existsSync(path.join(root, c)));
  return { ...e, found };
});

const warnings = results.filter((r) => !r.found).length;
const out = ['# Route Smoke Report', '', '- Scope: static route file inventory', `- Warning count: ${warnings}`, '', '| Route | Status | Expected file(s) |', '|---|---|---|'];
results.forEach((r) => {
  out.push(`| ${r.route} | ${r.found ? 'found' : 'missing'} | ${r.candidates.map((c) => `\`${c}\``).join(', ')} |`);
});

fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(reportPath, `${out.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ helper: 'ROUTE_SMOKE_HELPER', blockers: 0, warnings, reportPath: 'reports/route-smoke-report.md' }));
