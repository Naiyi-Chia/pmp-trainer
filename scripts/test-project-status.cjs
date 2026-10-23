'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { REPO, fingerprint, client, reconcile, states } = require('./project-status.cjs');
const { main } = require('./reconcile-project-status.cjs');
const SHA = 'a'.repeat(40);
function fixture(kind = 'smoke', actual = 'Backlog') {
  const user = { login: 'Naiyi-Chia', id: 220650167, type: 'User' };
  const issue = { number: 42, html_url: `https://github.com/${REPO}/issues/42`, user,
    body: 'Reviewed task', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-02T00:00:00Z' };
  const comment = { id: 100, user, body: `Decision on ${SHA}`, created_at: '2026-01-04T00:00:00Z', updated_at: '2026-01-04T00:00:00Z' };
  const snapshot = { issue, comments: [comment], parent: null };
  const project = { id: 'pilot', options: Object.values(states), items: [{ id: 'item', repo: REPO, number: 42, status: actual }] };
  const policy = { actor: user, issues: { 42: { events: [{ kind, comment: 100, decision: 'reviewed-owner-attestation', pr: 9, commit: SHA }] } } };
  const pr = { number: 9, body: 'Refs #42', state: 'open', base: { ref: kind === 'smoke' ? 'main' : 'dev', repo: { full_name: REPO } },
    head: { ref: kind === 'smoke' ? 'dev' : 'feat/issue-42', sha: SHA, repo: { full_name: REPO } },
    merged_at: ['engineering', 'review'].includes(kind) ? null : '2026-01-03T00:00:00Z', merge_commit_sha: SHA };
  const api = { pr: () => pr, contains: () => true, project: () => project, snapshot: () => snapshot };
  const pin = () => { policy.issues[42].fingerprint = fingerprint(issue, snapshot.comments, snapshot.parent); };
  pin();
  return { issue, comment, snapshot, project, policy, pr, api, pin,
    run: () => reconcile(42, project, snapshot, policy, api) };
}

for (const [kind, expected] of Object.entries(states)) {
  test(`canonical reviewed event: ${kind} -> ${expected}`, () => {
    const f = fixture(kind);
    if (kind === 'epic-integrated') { f.policy.issues[42].epicTarget = 'epic/42'; f.pr.base.ref = 'epic/42'; }
    assert.equal(f.run().expected, expected);
  });
}
test('already-correct state is idempotent; drift reports mismatch', () => {
  const f = fixture('smoke', 'Done');
  const before = JSON.stringify([f.project, f.snapshot, f.policy]);
  assert.equal(f.run().result, 'match');
  assert.deepEqual(f.run(), f.run());
  assert.equal(JSON.stringify([f.project, f.snapshot, f.policy]), before);
  f.project.items[0].status = 'Review';
  assert.equal(f.run().result, 'mismatch');
});
for (const [label, mutate] of [
  ['forged marker in new comment', f => f.snapshot.comments.push({ ...f.comment, id: 101, body: '<!-- production-smoke --> PASS' })],
  ['edited evidence', f => { f.comment.body += ' Changed'; }],
  ['changed task contract', f => { f.issue.body += ' new scope'; }],
  ['native parent drift', f => { f.snapshot.parent = { number: 1 }; }],
  ['stale review head', f => { f.pr.head.sha = 'b'.repeat(40); }],
]) {
  test(label, () => { const f = fixture('review'); mutate(f); assert.equal(f.run().result, 'blocked'); });
}
for (const [label, mutate] of [
  ['untrusted author', f => { f.comment.user = { id: 1, login: 'attacker', type: 'User' }; f.pin(); }],
  ['bot impersonation', f => { f.comment.user = { ...f.comment.user, type: 'Bot' }; f.pin(); }],
  ['missing source', f => { f.policy.issues[42].events[0].comment = 999; }],
  ['unreviewed human claim', f => { delete f.policy.issues[42].events[0].decision; }],
  ['wrong repository', f => { f.issue.html_url = 'https://github.com/other/repo/issues/42'; }],
  ['wrong Issue number', f => { f.issue.number = 41; }],
  ['wrong PR target', f => { f.pr.base.ref = 'other'; }],
  ['wrong PR repository', f => { f.pr.base.repo.full_name = 'other/repo'; }],
  ['wrong PR number', f => { f.pr.number = 10; }],
  ['ambiguous Issue reference', f => { f.pr.body = 'Refs #420'; }],
  ['unmerged release', f => { f.pr.merged_at = null; }],
  ['stale release commit', f => { f.pr.merge_commit_sha = 'b'.repeat(40); }],
  ['release not from dev', f => { f.pr.head.ref = 'feature'; }],
  ['smoke before release', f => { f.pr.merged_at = '2026-01-05T00:00:00Z'; }],
  ['commit removed from target', f => { f.api.contains = () => false; }],
  ['unbound commit', f => { f.comment.body = 'Smoke PASS'; f.pin(); }],
  ['missing Status option', f => { f.project.options = ['Review']; }],
  ['missing item', f => { f.project.items = []; }],
  ['duplicate item', f => { f.project.items.push({ ...f.project.items[0] }); }],
  ['foreign Project item', f => { f.project.items[0].repo = 'other/repo'; }],
  ['parent activation cannot activate child', f => { f.snapshot.parent = { number: 28 }; f.pin(); }],
]) {
  test(label, () => { const f = fixture(); mutate(f); assert.equal(f.run().result, 'blocked'); assert.equal(f.run().expected, null); });
}
test('not_planned and archived skip; ordinary closure gives no Done', () => {
  const f = fixture();
  f.issue.state_reason = 'not_planned'; assert.equal(f.run().result, 'skipped');
  f.issue.state_reason = 'completed'; f.project.items[0].archived = true; assert.equal(f.run().result, 'skipped');
  f.project.items[0].archived = false; f.policy.issues[42].events = [];
  assert.equal(f.run().expected, null);
});
test('missing evidence preserves backlog and flags dependency', () => {
  const f = fixture(); delete f.policy.issues[42]; f.snapshot.parent = { number: 28 };
  assert.match(f.run().blocker, /Parent #28/); assert.equal(f.project.items[0].status, 'Backlog');
});
test('review PASS alone remains Review; merged PR alone gives no Done', () => {
  const f = fixture('review'); assert.equal(f.run().expected, 'Review');
  f.pr.merged_at = '2026-01-03T00:00:00Z'; assert.equal(f.run().expected, null);
});
test('later failure supersedes prior PASS; out-of-order/equal timestamps block', () => {
  const f = fixture();
  f.snapshot.comments.push({ ...f.comment, id: 101, body: 'Changes requested', created_at: '2026-01-05T00:00:00Z' });
  f.policy.issues[42].events.push({ kind: 'changes', comment: 101, decision: 'reviewed-owner-attestation' }); f.pin();
  assert.equal(f.run().expected, 'In Progress');
  f.policy.issues[42].events.reverse(); assert.equal(f.run().expected, null);
  f.policy.issues[42].events.reverse(); f.snapshot.comments[1].created_at = f.comment.created_at; f.pin();
  assert.equal(f.run().expected, null);
});
test('explicit epic integration is unsupported without field option or activation', () => {
  const f = fixture('epic-integrated'); assert.equal(f.run().expected, null);
  f.policy.issues[42].epicTarget = 'epic/42'; f.pr.base.ref = 'epic/42';
  f.project.options = ['Verify']; assert.match(f.run().blocker, /Unsupported Status option: Integrated/);
});
test('CLI rejects all write flags before making any calls', () => {
  for (const args of [[], ['--write'], ['--dry-run', '--apply'], ['--dry-run', '0'], ['--dry-run', '1', '2']])
    assert.throws(() => main(args, {}, () => {}));
});
test('CLI reads actual status and emits no mutations; read failure is visible', () => {
  const f = fixture('smoke', 'Done'); let output;
  // Use the real pilot key with a synthetic matching transport, without touching GitHub.
  const policy = require('../config/pmp-project-evidence.json');
  const saved = policy.issues[42]; policy.issues[42] = f.policy.issues[42];
  try {
    assert.equal(main(['--dry-run', '42', '--json'], f.api, s => { output = JSON.parse(s); }), 0);
    assert.equal(output.rows[0].actual, 'Done');
    f.api.snapshot = () => { throw new Error('permission denied'); };
    assert.equal(main(['--dry-run', '42', '--json'], f.api, s => { output = JSON.parse(s); }), 2);
    assert.match(output.rows[0].blocker, /permission denied/);
  } finally { if (saved) policy.issues[42] = saved; else delete policy.issues[42]; }
});
test('transport uses GET for REST reads, queries for GraphQL, no shell; redacts errors', () => {
  const calls = [];
  const api = client((exe, args, options) => { calls.push([exe, args, options]); return JSON.stringify([{}]); });
  api.pr(9); api.contains('main', SHA);
  for (const [exe, args, options] of calls) {
    assert.equal(exe, 'gh'); assert.deepEqual(args.slice(0, 4), ['api', '--method', 'GET', args[3]]);
    assert.equal(options.shell, undefined);
    assert.ok(!args.some(a => /mutation|item-edit|comment|PATCH|PUT|DELETE/.test(a)));
  }
  assert.throws(() => client(() => { throw new Error('secret-token'); }).pr(1), error => !error.message.includes('secret-token'));
});
function projectResponse({ next = false, archived = false, fieldOverflow = false, valueOverflow = false } = {}) {
  return { data: { user: { projectV2: { id: 'P1', closed: false,
    fields: { pageInfo: { hasNextPage: fieldOverflow }, nodes: [{ name: 'Status', options: [{ name: 'Done' }] }] },
    items: { pageInfo: { hasNextPage: next, endCursor: 'next' }, nodes: [{ id: 'I1', isArchived: archived,
      content: { number: 42, repository: { nameWithOwner: REPO } },
      fieldValues: { pageInfo: { hasNextPage: valueOverflow }, nodes: [{ name: 'Done', field: { name: 'Status' } }] }
    }] }
  } } } };
}
test('Project pagination reads Status/archival with query-only calls', () => {
  let calls = 0;
  const api = client((exe, args) => {
    calls++;
    assert.equal(exe, 'gh'); assert.deepEqual(args.slice(0, 3), ['api', 'graphql', '-f']);
    assert.ok(args[3].startsWith('query=query ')); assert.ok(!args[3].includes('mutation'));
    if (calls === 2) assert.ok(args[3].includes('after:"next"'));
    return JSON.stringify(projectResponse({ next: calls === 1, archived: calls === 2 }));
  });
  const p = api.project();
  assert.equal(calls, 2); assert.deepEqual(p.options, ['Done']);
  assert.equal(p.items[0].status, 'Done'); assert.equal(p.items[1].archived, true);
});
test('incomplete Project pagination or GraphQL failure cannot yield partial success', () => {
  for (const response of [projectResponse({ fieldOverflow: true }), projectResponse({ valueOverflow: true }), { errors: [{ message: 'forbidden' }] }])
    assert.throws(() => client(() => JSON.stringify(response)).project());
  let calls = 0;
  assert.throws(() => client(() => { calls++; return JSON.stringify(projectResponse({ next: true })); }).project(), /pagination bound/);
  assert.equal(calls, 10);
});
test('snapshot consumes every comments page and native parent via read-only transport', () => {
  const f = fixture();
  let calls = 0;
  const api = client((exe, args) => {
    calls++;
    if (calls === 1) return JSON.stringify([f.issue]);
    if (calls === 2) {
      assert.ok(args.includes('--paginate')); assert.ok(args.includes('--slurp'));
      return JSON.stringify([[f.comment], [{ ...f.comment, id: 101 }]]);
    }
    assert.ok(args[3].startsWith('query=query '));
    return JSON.stringify({ data: { repository: { issue: { parent: { number: 28 } } } } });
  });
  const s = api.snapshot(42); assert.equal(s.comments.length, 2); assert.equal(s.parent.number, 28);
});
test('CLI enforces batch bound', () => {
  assert.throws(() => main(['--dry-run', Array.from({length:21}, (_,i) => i+1).join(',')], {}, () => {}), /1–20/);
});
