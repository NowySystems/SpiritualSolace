import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportPath = path.join(root, 'reports', 'state-reconciliation-report.md');
const versions = ['1.4a', '2.5', '2.6', '2.7', '3.1', '3.2.1', '3.2.2', '3.2.3', '3.2.4', '3.2.5', '3.3', '3.4', '3.4a', '3.4b', '3.4c'];
const files = walk(root)
  .filter((f) => /\.(md|mdx|ts|tsx|js|mjs|json)$/.test(f))
  .filter((f) => !f.includes(`${path.sep}node_modules${path.sep}`) && !f.includes(`${path.sep}.git${path.sep}`));

const hits = versions.map((v) => ({ version: v, refs: [] }));
for (const file of files) {
  const rel = path.relative(root, file);
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, idx) => {
    hits.forEach((h) => {
      if (line.includes(h.version)) h.refs.push({ file: rel, line: idx + 1, sample: line.trim().slice(0, 140) });
    });
  });
}

const classify = (version) => {
  if (version === '3.4c') return 'current-target';
  if (version === '3.4b' || version === '3.4a') return 'recent-historical';
  if (version === '3.2.1') return 'compatibility-legacy';
  return 'historical-stale-risk';
};

const linesOut = ['# State Reconciliation Report', '', '- Scope: repository phase/version reference scan', '', '| Version | Count | Classification |', '|---|---:|---|'];
for (const h of hits) {
  linesOut.push(`| ${h.version} | ${h.refs.length} | ${classify(h.version)} |`);
}
linesOut.push('', '## Evidence', '');
for (const h of hits) {
  linesOut.push(`### ${h.version}`);
  if (!h.refs.length) linesOut.push('- No references found.');
  else h.refs.slice(0, 12).forEach((r) => linesOut.push(`- \`${r.file}:${r.line}\` — ${r.sample}`));
  linesOut.push('');
}

fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(reportPath, `${linesOut.join('\n')}\n`, 'utf8');
const warnings = hits.filter((h) => classify(h.version) === 'historical-stale-risk' && h.refs.length > 0).length;
console.log(JSON.stringify({ helper: 'STATE_RECONCILIATION_HELPER', blockers: 0, warnings, reportPath: 'reports/state-reconciliation-report.md' }));

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}
