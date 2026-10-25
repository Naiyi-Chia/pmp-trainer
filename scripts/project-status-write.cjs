'use strict';

// Stage 2 controlled transport. Nothing runs automatically; CLI must opt in.
const { execFileSync } = require('node:child_process');
const { client, reconcile, REPO } = require('./project-status.cjs');

const RANK = Object.freeze({ Backlog: 0, Inbox: 0, Ready: 1,
  'In Progress': 2, Review: 3, Integrated: 3.5, Verify: 4,
  'Ready for Release': 5, Done: 6 });
const ID = /^[A-Za-z0-9_-]{1,256}$/;
const MUTATION = `mutation($projectId:ID!,$itemId:ID!,$fieldId:ID!,$optionId:String!) {
  updateProjectV2ItemFieldValue(input:{projectId:$projectId,itemId:$itemId,
    fieldId:$fieldId,value:{singleSelectOptionId:$optionId}}) {
    projectV2Item { id }
  }
}`;

function authorizedClient({ run = execFileSync, env = process.env } = {}) {
  // This token is only ever passed via child environment, never argv, logs or files.
  if (env.PMP_PROJECT_WRITE_ENABLED !== '1' || !env.PMP_PROJECT_TOKEN)
    throw new Error('Project writes disabled: require write-enabled flag and PMP_PROJECT_TOKEN');
  const childEnv = { ...env, GH_TOKEN: env.PMP_PROJECT_TOKEN };
  const invoke = (args) => {
    try {
      const data = JSON.parse(run('gh', args, { encoding: 'utf8', timeout: 60000,
        maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'], env: childEnv }));
      if (data.errors) throw new Error('GraphQL errors');
      return data.data;
    } catch {
      throw new Error('Project API call failed; inspect credentials, access, network or response');
    }
  };
  const read = client((command, args, options) => run(command, args, { ...options, env: childEnv }));
  return {
    ...read,
    metadata() {
      const data = invoke(['api', 'graphql', '-f',
        'query=query { user(login:"Naiyi-Chia") { projectV2(number:1) { id closed fields(first:100) { pageInfo { hasNextPage } nodes { ... on ProjectV2SingleSelectField { id name options { id name } } } } } } }']);
      const project = data?.user?.projectV2;
      if (!project || project.closed || project.fields?.pageInfo?.hasNextPage)
        throw new Error('Project metadata unavailable or incomplete');
      const matches = project.fields.nodes.filter(x => x?.name === 'Status');
      if (matches.length !== 1 || !ID.test(matches[0].id)) throw new Error('Status field missing or ambiguous');
      const options = matches[0].options;
      if (!Array.isArray(options) || options.some(x => !x || !ID.test(x.id) || !x.name))
        throw new Error('Invalid Status field options');
      if (new Set(options.map(x => x.name)).size !== options.length ||
          new Set(options.map(x => x.id)).size !== options.length)
        throw new Error('Duplicate Status field options');
      return { projectId: project.id, fieldId: matches[0].id, options };
    },
    update({ projectId, itemId, fieldId, optionId }) {
      if (![projectId, itemId, fieldId, optionId].every(x => typeof x === 'string' && ID.test(x)))
        throw new Error('Unsafe/invalid Project identifier');
      const data = invoke(['api', 'graphql', '-f', `query=${MUTATION}`,
        '-f', `projectId=${projectId}`, '-f', `itemId=${itemId}`,
        '-f', `fieldId=${fieldId}`, '-f', `optionId=${optionId}`]);
      if (data?.updateProjectV2ItemFieldValue?.projectV2Item?.id !== itemId)
        throw new Error('Mutation result did not confirm target Project item');
    }
  };
}

function block(reason, row = null) {
  return { result: 'blocked', issue: row?.issue, actual: row?.actual ?? null,
    expected: row?.expected ?? null, blocker: reason, evidence: row?.evidence || [] };
}

function applyReviewedStatus(number, expectedCurrent, policy, api) {
  if (!Number.isSafeInteger(number) || number < 1 || typeof expectedCurrent !== 'string')
    return block('Invalid Issue or expected-current Status');
  const initialProject = api.project();
  const initial = reconcile(number, initialProject, api.snapshot(number), policy, api);
  if (initial.result === 'match')
    return { ...initial, result: 'noop', blocker: null, note: 'Already synchronized; no mutation' };
  if (initial.result !== 'mismatch') return block(initial.blocker || 'No trusted transition', initial);
  if (initial.actual !== expectedCurrent) return block('Current Status differs from explicit expected-current', initial);
  // Conservative: never automatically roll a board status backward, even for a
  // reviewed failure; regression requires a separate human-governed path.
  if (!(initial.actual in RANK) || !(initial.expected in RANK) ||
      RANK[initial.expected] <= RANK[initial.actual])
    return block('Unsupported or backward Status transition; manual disposition required', initial);
  const metadata = api.metadata();
  if (metadata.projectId !== initialProject.id || !ID.test(metadata.projectId))
    return block('Project identity changed', initial);
  const matchingOptions = metadata.options.filter(x => x.name === initial.expected);
  if (matchingOptions.length !== 1 || !ID.test(metadata.fieldId))
    return block('Expected Status option missing/ambiguous', initial);
  if (JSON.stringify(metadata.options.map(x => x.name).sort()) !==
      JSON.stringify([...initialProject.options].sort()))
    return block('Project Status options changed', initial);
  const firstItems = initialProject.items.filter(x => x.repo === REPO && x.number === number);
  if (firstItems.length !== 1 || firstItems[0].archived || !ID.test(firstItems[0].id))
    return block('Invalid target Project item', initial);

  // Re-read evidence and status immediately before mutation; a concurrent edit
  // must not be overwritten if it is visible at this pre-write boundary.
  const freshProject = api.project();
  const fresh = reconcile(number, freshProject, api.snapshot(number), policy, api);
  const freshItems = freshProject.items.filter(x => x.repo === REPO && x.number === number);
  if (fresh.result !== 'mismatch' || fresh.expected !== initial.expected ||
      fresh.actual !== initial.actual || freshProject.id !== initialProject.id ||
      freshItems.length !== 1 || freshItems[0].id !== firstItems[0].id ||
      freshItems[0].archived ||
      JSON.stringify([...freshProject.options].sort()) !== JSON.stringify([...initialProject.options].sort()))
    return block('Pre-write drift detected; no mutation', fresh);
  api.update({ projectId: metadata.projectId, itemId: firstItems[0].id,
    fieldId: metadata.fieldId, optionId: matchingOptions[0].id });

  const after = api.project();
  const afterItems = after.items.filter(x => x.repo === REPO && x.number === number);
  if (after.id !== metadata.projectId || afterItems.length !== 1 ||
      afterItems[0].id !== firstItems[0].id || afterItems[0].archived ||
      afterItems[0].status !== initial.expected)
    throw new Error('Post-write read-back mismatch: treat Status as unverified and reconcile');
  return { ...fresh, actual: afterItems[0].status, result: 'updated', blocker: null,
    note: `Verified ${initial.actual} -> ${initial.expected}` };
}

module.exports = { authorizedClient, applyReviewedStatus, RANK };
