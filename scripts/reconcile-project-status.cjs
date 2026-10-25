#!/usr/bin/env node
'use strict';
const { REPO, client, reconcile } = require('./project-status.cjs');
const policy = require('../config/pmp-project-evidence.json');

function main(args, api = client(), output = console.log) {
  if (!args.includes('--dry-run') || args.some(a => !['--dry-run', '--json'].includes(a) && !/^\d+(,\d+)*$/.test(a)))
    throw new Error('Usage: node scripts/reconcile-project-status.cjs --dry-run [28,30,...] [--json]. Writes are unavailable.');
  const selections = args.filter(a => /^\d/.test(a));
  if (selections.length > 1) throw new Error('Supply one comma-separated Issue list');
  const numbers = selections.length ? [...new Set(selections[0].split(',').map(Number))] : policy.pilot;
  if (numbers.length > 20 || numbers.some(n => !Number.isSafeInteger(n) || n < 1)) throw new Error('Select 1–20 positive Issue numbers');
  const project = api.project();
  const rows = numbers.map(n => {
    try { return reconcile(n, project, api.snapshot(n), policy, api); }
    catch (error) {
      const items = project.items.filter(i => i.number === n && i.repo === REPO);
      return { issue: `#${n}`, actual: items.length === 1 ? items[0].status : null,
        expected: null, result: 'blocked', evidence: [], blocker: error.message };
    }
  });
  if (args.includes('--json')) output(JSON.stringify({ mode: 'read-only', project: project.id, rows }, null, 2));
  else {
    output('Issue | Actual | Expected | Evidence | Confidence/Blocker');
    rows.forEach(r => output([r.issue, r.actual ?? '—', r.expected ?? '—', r.evidence.join(', ') || '—',
      r.blocker ? `${r.result}: ${r.blocker}` : `reviewed + live-validated: ${r.result}`].join(' | ')));
  }
  return rows.some(r => r.result === 'blocked') ? 2 : rows.some(r => r.result === 'mismatch') ? 1 : 0;
}
if (require.main === module) {
  try { process.exitCode = main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 2; }
}
module.exports = { main };
