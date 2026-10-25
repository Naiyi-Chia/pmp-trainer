#!/usr/bin/env node
'use strict';

const { authorizedClient, applyReviewedStatus } = require('./project-status-write.cjs');
const policy = require('../config/pmp-project-evidence.json');

function parse(args) {
  if (args.length !== 6 || args[0] !== '--issue' || !/^\d+$/.test(args[1]) ||
      args[2] !== '--expect-current' || !args[3] || args[4] !== '--apply' || args[5] !== '--json')
    throw new Error('Usage: node scripts/apply-project-status.cjs --issue N --expect-current "Backlog" --apply --json');
  const number = Number(args[1]);
  if (!Number.isSafeInteger(number) || number < 1) throw new Error('Invalid Issue number');
  return { number, expectedCurrent: args[3] };
}

function main(args, env = process.env, makeClient = authorizedClient, print = console.log) {
  const { number, expectedCurrent } = parse(args);
  // Both the explicit command and separate operator-managed environment switch
  // are required; no write is attempted by invoking the Stage 1 dry-run.
  const api = makeClient({ env });
  const outcome = applyReviewedStatus(number, expectedCurrent, policy, api);
  print(JSON.stringify(outcome, null, 2));
  return outcome.result === 'blocked' ? 2 : 0;
}

if (require.main === module) {
  try { process.exitCode = main(process.argv.slice(2)); }
  catch (e) { console.error(e.message); process.exitCode = 2; }
}
module.exports = { main, parse };
