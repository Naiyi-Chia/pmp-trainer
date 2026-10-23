'use strict';

// Stage 1 only: no mutation transport or workflow is shipped.
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const REPO = 'Naiyi-Chia/pmp-trainer';
const OWNER = 'Naiyi-Chia';
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

function fingerprint(issue, comments, parent) {
  return hash({ body: issue.body, author: issue.user.id, updated: issue.updated_at,
    parent, comments: comments.map(c => [c.id, c.user.id, c.body, c.created_at, c.updated_at])
      .sort((a, b) => a[0] - b[0]) });
}

function client(run = execFileSync) {
  function api(endpoint, query) {
    // All endpoints originate in this module; GraphQL accepts queries only.
    if (query && !query.startsWith('query ')) throw new Error('Read-only query required');
    const args = query ? ['api', 'graphql', '-f', `query=${query}`]
      : ['api', '--method', 'GET', endpoint, '--paginate', '--slurp'];
    let result;
    try { result = JSON.parse(run('gh', args, { encoding: 'utf8', timeout: 60000,
      maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] })); }
    catch { throw new Error('GitHub read failed (authentication, permission, network or response); retry after checking gh auth status'); }
    if (result.errors) throw new Error('GitHub GraphQL read returned errors');
    return query ? result.data : result.flat();
  }
  return {
    project() {
      let cursor = null, items = [], project;
      for (let page = 0; page < 10; page++) {
        const data = api(null, `query { user(login:"${OWNER}") { projectV2(number:1) {
          id closed fields(first:100) { pageInfo { hasNextPage } nodes {
            ... on ProjectV2SingleSelectField { name options { name } }
          } } items(first:100${cursor ? `,after:${JSON.stringify(cursor)}` : ''}) {
            pageInfo { hasNextPage endCursor } nodes { id isArchived
              fieldValues(first:100) { pageInfo { hasNextPage } nodes {
                ... on ProjectV2ItemFieldSingleSelectValue { name field { ... on ProjectV2SingleSelectField { name } } }
              } } content { ... on Issue { number repository { nameWithOwner } } }
            }
          }
        } } }`);
        project = data.user?.projectV2;
        if (!project || project.closed || project.fields.pageInfo.hasNextPage) throw new Error('Project unavailable/closed or incomplete fields');
        for (const item of project.items.nodes) {
          if (item.fieldValues.pageInfo.hasNextPage) throw new Error('Incomplete item fields');
          items.push({ id: item.id, archived: item.isArchived, number: item.content?.number,
            repo: item.content?.repository.nameWithOwner,
            status: item.fieldValues.nodes.find(v => v.field?.name === 'Status')?.name ?? null });
        }
        if (!project.items.pageInfo.hasNextPage) {
          const fields = project.fields.nodes.filter(f => f.name === 'Status');
          if (fields.length !== 1) throw new Error('Missing/ambiguous Status field');
          return { id: project.id, options: fields[0].options.map(o => o.name), items };
        }
        cursor = project.items.pageInfo.endCursor;
      }
      throw new Error('Project pagination bound exceeded; no partial reconciliation');
    },
    snapshot(number) {
      const issue = api(`repos/${REPO}/issues/${number}`)[0];
      const comments = api(`repos/${REPO}/issues/${number}/comments?per_page=100`);
      const data = api(null, `query { repository(owner:"${OWNER}",name:"pmp-trainer") {
        issue(number:${number}) { parent { number repository { nameWithOwner } } }
      } }`);
      const parent = data.repository.issue.parent;
      return { issue, comments, parent };
    },
    pr(number) { return api(`repos/${REPO}/pulls/${number}`)[0]; },
    contains(base, sha) {
      const comparison = api(`repos/${REPO}/compare/${sha}...${base}`)[0];
      return comparison.status === 'ahead' || comparison.status === 'identical';
    }
  };
}

const states = {
  triage: 'Ready', started: 'In Progress', engineering: 'Review', review: 'Review',
  changes: 'In Progress', integrated: 'Verify', 'epic-integrated': 'Integrated',
  'verify-fail': 'In Progress', 'verify-blocked': 'Verify', verified: 'Ready for Release', smoke: 'Done'
};

function reconcile(number, project, snapshot, policy, api) {
  const matches = project.items.filter(i => i.repo === REPO && i.number === number);
  const actual = matches.length === 1 ? matches[0].status : null;
  const row = { issue: `#${number}`, actual, expected: null, evidence: [], result: 'blocked', blocker: null };
  const block = reason => ({ ...row, blocker: reason });
  const { issue, comments, parent } = snapshot;
  if (issue.number !== number || issue.pull_request || issue.html_url !== `https://github.com/${REPO}/issues/${number}`)
    return block('Issue identity mismatch');
  if (issue.state_reason === 'not_planned' || matches.some(i => i.archived))
    return { ...row, result: 'skipped', blocker: 'Archived or not_planned; preserve item (including absent item)' };
  if (matches.length !== 1) return block('Missing or duplicate Project item');
  const entry = policy.issues[number];
  if (!entry) return block(parent ? `Parent #${parent.number}: no reviewed child activation/dependency evidence` : 'No reviewed lifecycle evidence');
  if (fingerprint(issue, comments, parent) !== entry.fingerprint) return block('Evidence drift: body, parent or comments changed; review required');
  if (!entry.events.length) return block(parent ? `Parent #${parent.number}: no reviewed child activation/dependency evidence; preserve backlog`
    : 'No reviewed lifecycle event; preserve backlog');
  let previous = -Infinity;
  let selected;
  for (const event of entry.events) {
    if (!states[event.kind]) return block('Unsupported lifecycle event');
    const source = event.comment ? comments.find(c => c.id === event.comment) : issue;
    if (!source || source.user.id !== policy.actor.id || source.user.login !== policy.actor.login || source.user.type !== 'User')
      return block('Missing/untrusted evidence author');
    const time = Date.parse(event.comment ? source.created_at : source.updated_at);
    if (!Number.isFinite(time) || time <= previous) return block('Conflicting or out-of-order evidence');
    previous = time;
    if (event.decision !== 'reviewed-owner-attestation') return block('Unreviewed decision identity');
    if (parent && !entry.dependenciesSatisfied) return block('Child dependency/activation not reviewed');
    if (event.kind === 'epic-integrated' && !entry.epicTarget) return block('No explicit Human-enabled epic target');
    if (['engineering', 'review', 'integrated', 'epic-integrated', 'verified', 'smoke', 'verify-blocked', 'verify-fail'].includes(event.kind)) {
      if (!event.pr || !/^[a-f0-9]{40}$/.test(event.commit)) return block('Missing PR/commit binding');
      const pr = api.pr(event.pr);
      const target = event.kind === 'smoke' ? 'main' : event.kind === 'epic-integrated' ? entry.epicTarget : 'dev';
      if (pr.number !== event.pr || pr.base.repo.full_name !== REPO || pr.head.repo?.full_name !== REPO || pr.base.ref !== target ||
          !new RegExp(`#${number}(?!\\d)`).test(pr.body || '')) return block('PR identity, scope or target mismatch');
      const merged = !['engineering', 'review'].includes(event.kind);
      if (merged) {
        if (!pr.merged_at || !Number.isFinite(Date.parse(pr.merged_at)) || pr.merge_commit_sha !== event.commit || Date.parse(pr.merged_at) > time ||
            !api.contains(target, event.commit)) return block('Unmerged, stale or out-of-order commit evidence');
        if (event.kind === 'smoke' && pr.head.ref !== 'dev') return block('Release must originate from dev');
      } else if (pr.state !== 'open' || pr.merged_at || pr.head.sha !== event.commit) return block('Stale review head or closed PR');
      if (!source.body.includes(event.commit)) return block('Attestation does not bind affected commit');
    }
    selected = states[event.kind];
    row.evidence.push(event.comment ? `https://github.com/${REPO}/issues/${number}#issuecomment-${event.comment}` : issue.html_url);
  }
  if (!project.options.includes(selected)) return block(`Unsupported Status option: ${selected}`);
  row.expected = selected;
  row.result = actual === selected ? 'match' : 'mismatch';
  return row;
}

module.exports = { REPO, hash, fingerprint, client, reconcile, states };
