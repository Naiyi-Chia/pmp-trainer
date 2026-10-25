'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { fingerprint, REPO } = require('./project-status.cjs');
const { authorizedClient, applyReviewedStatus } = require('./project-status-write.cjs');
const { parse } = require('./apply-project-status.cjs');
const SHA = 'a'.repeat(40);

function fixture({ actual = 'Backlog', kind = 'engineering' } = {}) {
  const actor = { login: 'Naiyi-Chia', id: 220650167, type: 'User' };
  const issue = { number: 42, html_url: `https://github.com/${REPO}/issues/42`, body: 'Issue work',
    user: actor, updated_at: '2026-01-01T00:00:00Z', state_reason: null };
  const comment = { id: 101, user: actor, body: `Decision binds commit ${SHA}`,
    created_at: '2026-01-04T00:00:00Z', updated_at: '2026-01-04T00:00:00Z' };
  const snapshot = { issue, comments: [comment], parent: null };
  const policy = { actor, issues: { 42: { fingerprint: fingerprint(issue, [comment], null),
    events: [{ kind, comment: 101, pr: 9, commit: SHA, decision: 'reviewed-owner-attestation' }] } } };
  const optionNames = ['Backlog', 'Ready', 'In Progress', 'Review', 'Verify', 'Ready for Release', 'Done'];
  const project = { id: 'PVT_project1', options: optionNames,
    items: [{ id: 'PVTI_item42', repo: REPO, number: 42, status: actual, archived: false }] };
  const metadata = { projectId: project.id, fieldId: 'PVTSSF_field1',
    options: optionNames.map((name, i) => ({ name, id: `option${i}` })) };
  const pr = { number: 9, body: 'Refs #42', state: 'open', merged_at: null,
    base: { ref: 'dev', repo: { full_name: REPO } },
    head: { ref: 'feat/issue-42', sha: SHA, repo: { full_name: REPO } } };
  const calls = { projects: 0, snapshots: 0, writes: [] };
  const api = {
    project: () => { calls.projects++; return JSON.parse(JSON.stringify(project)); },
    snapshot: () => { calls.snapshots++; return JSON.parse(JSON.stringify(snapshot)); },
    pr: () => pr, contains: () => true,
    metadata: () => JSON.parse(JSON.stringify(metadata)),
    update: args => { calls.writes.push(args); project.items[0].status = 'Review'; }
  };
  return { issue, comment, snapshot, project, metadata, policy, pr, calls, api,
    pin: () => { policy.issues[42].fingerprint = fingerprint(issue, snapshot.comments, snapshot.parent); },
    run: () => applyReviewedStatus(42, 'Backlog', policy, api) };
}

test('reviewed mismatch updates Status only then reads back and verifies', () => {
  const f = fixture();
  const row = f.run();
  assert.equal(row.result, 'updated'); assert.equal(row.actual, 'Review');
  assert.equal(f.calls.writes.length, 1);
  assert.deepEqual(f.calls.writes[0], {
    projectId: 'PVT_project1', itemId: 'PVTI_item42', fieldId: 'PVTSSF_field1', optionId: 'option3'
  });
  assert.equal(f.calls.projects, 3); assert.equal(f.calls.snapshots, 2);
});
test('already synchronized is a no-op, no metadata or write calls', () => {
  const f = fixture({ actual: 'Review' });
  assert.equal(f.run().result, 'noop'); assert.equal(f.calls.writes.length, 0);
  assert.equal(f.calls.projects, 1);
});
test('concurrent status change at second read blocks without overwrite', () => {
  const f = fixture(); const original = f.api.project; let n = 0;
  f.api.project = () => { const p = original(); if (++n === 2) p.items[0].status = 'Verify'; return p; };
  assert.match(f.run().blocker, /Pre-write drift/); assert.equal(f.calls.writes.length, 0);
});
test('evidence drift between reads blocks write', () => {
  const f = fixture(); const original = f.api.snapshot; let n = 0;
  f.api.snapshot = () => { const s = original(); if (++n === 2) s.issue.body = 'Different scope'; return s; };
  assert.equal(f.run().result, 'blocked'); assert.equal(f.calls.writes.length, 0);
});
for (const [name, modify] of [
  ['unreviewed policy', f => { delete f.policy.issues[42]; }],
  ['not_planned', f => { f.issue.state_reason = 'not_planned'; }],
  ['archived item', f => { f.project.items[0].archived = true; }],
  ['missing Project item', f => { f.project.items = []; }],
  ['duplicate Project item', f => { f.project.items.push({ ...f.project.items[0] }); }],
  ['foreign repository', f => { f.project.items[0].repo = 'other/repo'; }],
  ['absent option', f => { f.project.options = ['Backlog']; }],
  ['unexpected actual', f => { f.project.items[0].status = 'In Progress'; }],
  ['metadata target project differs', f => { f.metadata.projectId = 'PVT_other'; }],
  ['metadata missing intended option', f => { f.metadata.options = f.metadata.options.filter(o => o.name !== 'Review'); }],
  ['field metadata malformed', f => { f.metadata.fieldId = ' '; }],
]) test(`fail closed: ${name}`, () => {
  const f = fixture(); modify(f); const result = f.run();
  assert.equal(result.result, 'blocked'); assert.equal(f.calls.writes.length, 0);
});
test('explicit expected-current precondition prevents accidental updates', () => {
  const f = fixture(); const r = applyReviewedStatus(42, 'Ready', f.policy, f.api);
  assert.equal(r.result, 'blocked'); assert.equal(f.calls.writes.length, 0);
});
test('backward transitions are blocked even when event is trusted', () => {
  const f = fixture({ actual: 'Done' }); const r = applyReviewedStatus(42, 'Done', f.policy, f.api);
  assert.match(r.blocker, /backward/); assert.equal(f.calls.writes.length, 0);
});
test('failed mutation does not silently report success', () => {
  const f = fixture(); f.api.update = () => { throw new Error('permission denied'); };
  assert.throws(f.run, /permission denied/);
});
test('read-back mismatch is an explicit failure, never success', () => {
  const f = fixture(); f.api.update = () => { f.calls.writes.push('called'); };
  assert.throws(f.run, /Post-write read-back mismatch/);
});
test('unauthorized client refuses missing write switch or secret', () => {
  assert.throws(() => authorizedClient({ env: { PMP_PROJECT_TOKEN: 'secret' } }), /disabled/);
  assert.throws(() => authorizedClient({ env: { PMP_PROJECT_WRITE_ENABLED: '1' } }), /disabled/);
});
test('credential is placed in child environment, never CLI argv or logs', () => {
  const seen = [];
  const api = authorizedClient({ env: { PMP_PROJECT_WRITE_ENABLED: '1', PMP_PROJECT_TOKEN: 'fake_secret' },
    run(exe, argv, opt) {
      seen.push({ exe, argv, env: opt.env });
      if (argv[3]?.startsWith('query=query')) return JSON.stringify({data:{ user:{ projectV2:{id:'PVT_project1',closed:false,
        fields:{pageInfo:{hasNextPage:false},nodes:[{id:'PVTSSF_field1',name:'Status',options:[{id:'option3',name:'Review'}]}]}}}}});
      if (argv[3]?.startsWith('query=mutation')) return JSON.stringify({data:{ updateProjectV2ItemFieldValue:{projectV2Item:{id:'PVTI_item42'}} }});
      throw new Error('Unexpected invocation');
    } });
  const meta = api.metadata(); assert.equal(meta.fieldId, 'PVTSSF_field1');
  api.update({ projectId:'PVT_project1', itemId:'PVTI_item42', fieldId:'PVTSSF_field1', optionId:'option3' });
  assert.equal(seen.length, 2);
  for (const c of seen) { assert.equal(c.env.GH_TOKEN, 'fake_secret');
    assert.equal(c.exe, 'gh'); assert.ok(!c.argv.join(' ').includes('fake_secret')); }
  assert.equal(seen[1].argv[3].startsWith('query=mutation'), true);
  assert.deepEqual(seen[1].argv.slice(4, 8), ['-f', 'projectId=PVT_project1', '-f', 'itemId=PVTI_item42']);
});
test('unsafe identifiers and wrong GraphQL response cannot confirm mutation', () => {
  const run = (_, argv) => JSON.stringify({ data: { updateProjectV2ItemFieldValue: { projectV2Item: { id:'OTHER' } } } });
  const c = authorizedClient({ run, env:{PMP_PROJECT_WRITE_ENABLED:'1',PMP_PROJECT_TOKEN:'fake_secret'} });
  assert.throws(() => c.update({projectId:'p; rm',itemId:'i',fieldId:'f',optionId:'opt'}),/Unsafe/);
  assert.throws(() => c.update({projectId:'p',itemId:'i',fieldId:'f',optionId:'opt'}),/did not confirm/);
});
test('CLI rejects ambiguous or accidental operations', () => {
  const ok = parse(['--issue','42','--expect-current','Backlog','--apply','--json']);
  assert.equal(ok.number, 42);
  for (const args of [[],['--issue','42'],['--issue','0','--expect-current','Backlog','--apply','--json'],
    ['--issue','42','--expect-current','Backlog','--dry-run','--json'],
    ['--issue','42','--expect-current','Backlog','--apply','--json','--extra']])
    assert.throws(() => parse(args));
});
