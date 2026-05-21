import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportPath = path.join(root, 'reports', 'ci-source-of-truth-report.md');

const sections = [
  '# CI Source-of-Truth Report',
  '',
  '- Helper: **CI_SOURCE_OF_TRUTH_HELPER**',
  '- Mode: report-only.',
  '',
  '## Cloud-First Validation Rulebook',
  '',
  '| Rule | Classification | Next Action |',
  '|---|---|---|',
  '| GitHub Actions is the final validation source of truth. | INFO | Treat GitHub Actions as merge gate. |',
  '| Codex/local Playwright failure caused by missing browser binaries. | WARNING (environment) | Install browsers or rely on CI result; do not treat alone as product failure. |',
  '| Codex/local build failure caused by stale Next page/module artifacts. | WARNING (transient) | Run `rm -rf .next` and rerun build once. |',
  '| GitHub Actions passes while local environment has transient/tooling noise. | PASS | CI wins; proceed with documented evidence. |',
  '| GitHub Actions fails. | BLOCKER | Stop and fix before merge. |',
  '| Owner local validation is not required. | INFO | Local runs are optional confidence checks only. |',
  '',
  '## Helper Usefulness Answers',
  '- What did it check? The required cloud-first interpretation policy for validation outcomes.',
  '- What did it find? Source-of-truth policy is explicitly documented for staff interpretation.',
  '- Is it blocker, warning, or info? This report defines all three classifications.',
  '- What should we do next? Apply these classifications consistently in helper/staff summaries.',
  '- Did this protect the product goal? Yes — it prevents local-environment confusion from overriding CI truth.',
];

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${sections.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ helper: 'CI_SOURCE_OF_TRUTH_HELPER', blockers: 0, warnings: 0, reportPath: 'reports/ci-source-of-truth-report.md' }));
