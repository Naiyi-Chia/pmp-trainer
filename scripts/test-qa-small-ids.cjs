// Issue #27: end-to-end regression for the accepted small custom Practice set.
// Uses the same external Playwright/Edge runtime as qa-duplicate-cleanup.cjs.
// node scripts/test-qa-small-ids.cjs [output-directory]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const out = path.resolve(process.argv[2] || path.join(os.tmpdir(), 'pmp27-small-ids'));
const runs = [];
fs.mkdirSync(out, {recursive:true});
for (let n = 1; n <= 2; n++) {
  const runOut = path.join(out, 'run-' + n);
  const child = spawnSync(process.execPath, [path.join(__dirname, 'qa-duplicate-cleanup.cjs'), runOut,
    '--ids=1,2', '--check-explanation-action'], {cwd:root, encoding:'utf8', timeout:180000});
  assert.ifError(child.error);
  assert.equal(child.status, 0, child.stderr || child.stdout);
  const report = JSON.parse(fs.readFileSync(path.join(runOut, 'report.json'), 'utf8'));
  assert.deepEqual(report.sample_ids, [1,2]);
  assert.deepEqual(report.errors, []);
  assert.equal(report.syntax, 'PASS');
  assert.deepEqual(report.browser.map(v => v.viewport), ['1280x900','375x812']);
  for (const view of report.browser) {
    assert.equal(view.mockSelection, 'first two actual M items; independent of practice --ids');
    assert.deepEqual(view.mockItems.map(q => q.index), [0,1]);
    assert.equal(new Set(view.mockItems.map(q => q.id)).size, 2);
    assert(view.mock.includes('submit 1/180/review PASS'));
    assert(view.explanationAction.startsWith('PASS:'));
    assert.equal(view.overflow, 'none');
  }
  runs.push(report);
  console.log('PASS: --ids=1,2 run ' + n + ', desktop/mobile native Mock persistence/Review');
}
assert.equal(runs[0].source_sha256_lf, runs[1].source_sha256_lf);
const evidence = {issue:27, contract:'https://github.com/Naiyi-Chia/pmp-trainer/issues/27#issuecomment-5976033827',
  source_sha256_lf:runs[0].source_sha256_lf, result:'PASS', sample_ids:[1,2], repetitions:2,
  method:'Native random 180-item mocks; choose actual positions 0/1 independently of custom Practice IDs; repeat full CLI twice at both viewports. No product random/scoring/storage override.', runs};
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(evidence,null,2) + '\n');
console.log('PASS: small custom IDs regression; ' + out);
