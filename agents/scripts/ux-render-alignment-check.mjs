import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportPath = path.join(root, 'reports', 'ux-render-alignment-report.md');

const targets = [
  'app/layout.tsx',
  'app/page.tsx'
].map((p) => path.join(root, p)).filter(fs.existsSync);

const warnings = [];
const rules = [
  { id: 'account-panel', label: 'Account/reference links may be always-visible large panel', pattern: /account|reference\s+links|quick\s+links/i },
  { id: 'primary-nav-clutter', label: 'Primary nav may expose non-workflow clutter', pattern: /roadmap|technical|system|admin/i },
  { id: 'visible-save-state', label: 'Save State/version visible in normal chrome', pattern: /save\s*state|version\s*[:#]?\s*\d/i },
  { id: 'guardrails-primary-nav', label: 'Guardrails appears as primary nav item', pattern: /guardrails/i },
  { id: 'top-chrome-overexplains', label: 'Top chrome may be over-explaining posture', pattern: /architecture|pipeline|internal\s+governance/i }
];

for (const file of targets) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, idx) => {
    for (const rule of rules) {
      if (rule.pattern.test(line)) {
        warnings.push({ rule: rule.id, label: rule.label, file: path.relative(root, file), line: idx + 1, sample: line.trim().slice(0, 160) });
      }
    }
  });
}

const workflowNavItems = ['funding-search', 'source-database', 'proposal-scanner', 'review-queue', 'reports'];
const layoutText = fs.existsSync(path.join(root, 'app/layout.tsx')) ? fs.readFileSync(path.join(root, 'app/layout.tsx'), 'utf8') : '';
const missingWorkflowNav = workflowNavItems.filter((item) => !layoutText.includes(item));
if (missingWorkflowNav.length) {
  warnings.push({ rule: 'missing-workflow-nav', label: `Missing workflow nav items: ${missingWorkflowNav.join(', ')}`, file: 'app/layout.tsx', line: 1, sample: missingWorkflowNav.join(', ') });
}
if (!/aria-current|active|pathname|usePathname/.test(layoutText)) {
  warnings.push({ rule: 'no-active-nav-styling', label: 'No active-nav styling hints detected in shell', file: 'app/layout.tsx', line: 1, sample: 'No active/nav state tokens found' });
}

const out = ['# UX Render Alignment Report', '', '- Scope: rule-based shell/navigation text scan', `- Warning count: ${warnings.length}`, '', '## Findings', ''];
if (!warnings.length) out.push('No warning findings.');
else warnings.forEach((w, i) => {
  out.push(`${i + 1}. **[${w.rule}]** ${w.label}`);
  out.push(`   - File: \`${w.file}:${w.line}\``);
  out.push(`   - Sample: \`${w.sample}\``);
});

fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(reportPath, `${out.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ helper: 'UX_RENDER_ALIGNMENT_HELPER', blockers: 0, warnings: warnings.length, reportPath: 'reports/ux-render-alignment-report.md' }));
