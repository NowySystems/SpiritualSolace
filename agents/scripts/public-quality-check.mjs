import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportPath = path.join(root, 'reports', 'public-quality-report.md');

const scanFiles = [
  ...walk(path.join(root, 'app')).filter((p) => /\.(tsx|ts|jsx|js|mdx)$/.test(p)),
  ...walk(path.join(root, 'components')).filter((p) => /\.(tsx|ts|jsx|js|mdx)$/.test(p))
];

const warningRules = [
  { id: 'visible-save-state', label: 'Visible Save State/version language in user-facing UI', pattern: /save\s*state|version\s*[:#]?\s*\d/i },
  { id: 'roadmap-build-phase-clutter', label: 'Roadmap/build/phase clutter in app surfaces', pattern: /roadmap|build\s+notes?|phase\s+\d|crcf\s+\d/i },
  { id: 'building-language', label: '"What we are building" style language', pattern: /what\s+we\s+are\s+building|we\s+are\s+building|under\s+construction/i },
  { id: 'coming-soon', label: 'Placeholder language in primary workflows', pattern: /coming\s+soon|placeholder|to\s+be\s+added/i },
  { id: 'guardrail-wall', label: 'Oversized guardrail/system explanation wording', pattern: /guardrail|system\s+architecture|internal\s+tooling/i },
  { id: 'fake-metrics', label: 'Potential fake metrics/activity wording', pattern: /\b\d+[\d,]*\s*(grants?|matches|opportunities|awards|activities)\b|fake\s+metrics?|demo\s+data/i },
  { id: 'architecture-exposed', label: 'Architecture-exposing text in UI', pattern: /firestore|firebase|api\s+route|pipeline|workflow|backend\s+service/i }
];

const findings = [];
for (const file of scanFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    warningRules.forEach((rule) => {
      if (rule.pattern.test(line)) {
        findings.push({ severity: 'warning', rule: rule.id, label: rule.label, file: path.relative(root, file), line: index + 1, sample: line.trim().slice(0, 160) });
      }
    });
  });
}

const markdown = ['# Public Quality Report', '', '- Scope: app + components static text scan', `- Warning count: ${findings.length}`, '', '## Findings', ''];
if (!findings.length) markdown.push('No warning findings.');
else findings.forEach((f, idx) => {
  markdown.push(`${idx + 1}. **[${f.rule}]** ${f.label}`);
  markdown.push(`   - File: ${f.file}:${f.line}`);
  markdown.push(`   - Sample: ${f.sample || '(blank line)'}`);
});

fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(reportPath, `${markdown.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ helper: 'PUBLIC_QUALITY_APP_HELPER', blockers: 0, warnings: findings.length, reportPath: 'reports/public-quality-report.md' }));

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}
