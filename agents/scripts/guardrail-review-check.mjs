import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportPath = path.join(root, 'reports', 'guardrail-review-report.md');
const files = walk(path.join(root, 'app')).concat(walk(path.join(root, 'docs'))).filter((f) => /\.(tsx|ts|js|mjs|md|mdx)$/.test(f));

const blockerRules = [
  { id: 'auto-submit', label: 'Implies app submits applications automatically', pattern: /\b(automatically\s+submit|auto-?submit|submits\s+applications?)\b/i },
  { id: 'auto-contact', label: 'Implies automatic funder contact/outreach', pattern: /\b(automatically\s+contact|auto-?outreach|contacts\s+funders?)\b/i },
  { id: 'source-writes', label: 'Implies source-system writes', pattern: /\b(write\s+to\s+source\s+systems?|updates?\s+source\s+records?)\b/i },
  { id: 'qb-dp-writes', label: 'Implies QuickBooks/DonorPerfect writes', pattern: /\b(write\s+to\s+quickbooks|update\s+quickbooks|write\s+to\s+donorperfect|update\s+donorperfect)\b/i },
  { id: 'sensitive-data', label: 'Encourages PHI/patient names/SSNs/private donor records/credentials', pattern: /\b(share\s+phi|patient\s+names?|ssns?|social\s+security\s+numbers?|private\s+donor\s+records?|api\s*keys?|credentials?)\b/i }
];

const findings = [];
for (const file of files) {
  const rel = path.relative(root, file);
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, idx) => {
    blockerRules.forEach((rule) => {
      if (rule.pattern.test(line) && !/\b(no|not|must\s+not|disabled|prohibited|never|without)\b/i.test(line)) {
        findings.push({ rule: rule.id, label: rule.label, file: rel, line: idx + 1, sample: line.trim().slice(0, 160) });
      }
    });
  });
}

const out = ['# Guardrail Review Report', '', '- Scope: safety-language read-only scan', `- Blocker count: ${findings.length}`, '', '## Findings', ''];
if (!findings.length) out.push('No blocker findings.');
else findings.forEach((f, i) => {
  out.push(`${i + 1}. **[${f.rule}]** ${f.label}`);
  out.push(`   - File: \`${f.file}:${f.line}\``);
  out.push(`   - Sample: \`${f.sample}\``);
});

fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(reportPath, `${out.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ helper: 'GUARDRAIL_REVIEW_HELPER', blockers: findings.length, warnings: 0, reportPath: 'reports/guardrail-review-report.md' }));
if (findings.length > 0) process.exit(1);

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
