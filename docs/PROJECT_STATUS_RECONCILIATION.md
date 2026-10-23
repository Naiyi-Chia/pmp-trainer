# PMP Project reconciliation — Stage 1

Orchestration / Codex can run this after a lifecycle handoff:

```sh
node scripts/reconcile-project-status.cjs --dry-run
```

Use `--dry-run 30` for one Issue, or `--dry-run 28,30,29,77,83 --json`
for a bounded machine-readable batch. Maximum 20 unique Issues; the default is
the 11-Issue pilot from #87. Output includes actual Status, expected Status,
evidence URLs and match/mismatch/blocker. Exit codes: 0 = matches/skips,
1 = mismatch, 2 = incomplete or blocked reconciliation (takes precedence).
Dependency-gated #31–#33 intentionally produce blockers, so the default pilot
returns 2. This is not a signal to advance those items.

Requires Node.js, authenticated `gh`, repository read access and user-owned
Project #1 read access (`read:project`, or existing broader `project` scope).
The existing GitHub connector has no Projects V2 operations, so this pilot uses
GitHub CLI. Credentials stay in the CLI credential store/environment and are
never command arguments, report content or committed files. API failures omit
raw stderr. No application dependency or build step is added.

## Evidence boundary

Canonical semantics remain in the
[Product Development Playbook](https://github.com/Naiyi-Chia/naiyi-product-playbook/blob/main/AI_PRODUCT_DEVELOPMENT_PLAYBOOK.md#canonical-status-transitions).
This implementation is a conservative historical pilot, **not a natural-language
approval interpreter**. A marker, author name, Issue closure, deployment success
or Technical Review PASS alone cannot grant a later gate.

`config/pmp-project-evidence.json` contains reviewed event classifications and
source pointers for the pilot, bound to authenticated numeric account identity
and SHA-256 fingerprints of the complete current Issue body/update timestamp,
native parent relationship and paginated comments (IDs, author IDs, text and
creation/update timestamps). Event order follows source creation time. Any drift,
new comment, missing source, unsupported status or unknown Issue fails closed.
There is deliberately no automatic fingerprint refresh command: refreshing a
hash without reviewing its contents would defeat this boundary. New lifecycle
evidence requires a reviewed policy update in a scoped change. Do not accept
policy files supplied by an untrusted Issue or PR.

The initial reviewed classifications are:

| Issue | Source | Interpretation / binding |
| --- | --- | --- |
| #28 | Current owner-authored Issue body, “Human activation decision” | Explicit ACTIVE initiative; does not activate its dependent Sub-issues |
| #30 | Comment 6019839729 | Engineering Ready on `c17375e…`; PR #82 must still be open with that head, targeting `dev`; explicit child activation is also present in the pinned comment set |
| #29 | Comment 6019340564 | Owner records Human Production Smoke PASS for release PR #80 / `dfbf47b…` |
| #77 | Comment 6019343162 | Owner records Human Production Smoke PASS for the same release |
| #83 | Comment 6229241906 | Owner records Product Verify, Release Approval and Production Smoke PASS for PR #85 / `06807a1…` |
| #31–#33 | Current native parent and full Issue/comment snapshot | No reviewed child start decision; preserve dependency gate |

These historical Human decisions were recorded through the owner's shared
GitHub account by orchestration. GitHub authenticates the account, **not the
human behind a shared session**. The pilot treats the specifically reviewed,
pinned owner attestations as evidence; it does not trust future comments merely
because that same account posts them. Independent review must assess those
classifications before rollout. Missing/conflicting Human decision attribution
must remain blocked rather than guessed.

Live PR reads independently check repository, Issue reference, target, current
review head or actual merge commit/time, and merged commit reachability from
the target. Release must be `dev → main`; smoke must follow the merge and bind
the production SHA in its source. Reviewed later failure events supersede prior
PASS; ambiguous/equal timestamps and reordered events block. Explicit Epic
integration needs a reviewed epic target/dependency activation and an actual
`Integrated` field option. Project #1 currently has no `Integrated` option;
the pilot never substitutes `Verify`. Parent events are not inherited.

Archived/not-planned items are skipped, including absent Project items.
Other absent/duplicate items and incomplete pagination are blockers. Reads
paginate all comments and Project items; Project pagination has a fail-closed
1,000-item bound. Fields/field values exceeding their first 100 entries block.
Project/Issue identity cannot be redirected through CLI arguments.

## Validation and limitations

```sh
node --test scripts/test-project-status.cjs
```

Tests cover transition interpretation, later failure/out-of-order evidence,
forgery, author and identity checks, parent gating, missing options/items,
archived/not-planned handling, commit/PR drift, retries/read failures and
idempotent actual-status reads. Transport tests reject write flags and verify
REST GET / GraphQL query-only calls; there is no mutation function or workflow.
See [pilot output](PROJECT_STATUS_PILOT.json) for the captured live run.

The policy is intentionally limited to reviewed historical evidence. It cannot
autonomously classify a new free-form handoff or prove human identity from
comment prose. It reports unknown evidence instead of silently reusing stale
approvals. The event model supports the canonical states, but a new initiative's
Epic activation/checkpoints and dependency satisfaction require explicit
reviewed bindings. This deliverable does not claim general hands-off sync.

## Activation, retry and rollback

Stage 1 is invocation-only and read-only. No Project fields, Issues, PRs,
archives or branch policy are changed. A blocked run must surface its report;
retry the same command after resolving permissions/network failures. Evidence
drift requires review, not blind retry or rehashing. Repeated runs add nothing
to GitHub and create no duplicate updates. Rollback is to stop invoking the CLI.

Stage 2 is deferred by #87's Engineering handoff contract. After the dry-run and
security review plus normal Human Gates, a separately reviewed rollout must add
only Status writes, re-fetch before writing, verify exact read-back, handle
concurrent edits and test no extra mutations. A Human must configure a narrowly
scoped `PMP_PROJECT_TOKEN` secret for user Project access; ordinary repository
`GITHUB_TOKEN` can serve repo-local reads but cannot write this user Project.
Never request tokens in chat. If using `issue_comment` Actions, deploying to
`dev` alone is insufficient: the reviewed workflow must reach the default
branch through the normal approved release, then be explicitly enabled with
writes initially disabled. Include visible failure/retry reporting, bounded
events and a kill switch. Roll back by disabling that workflow/write flag and
revoking its Project credential. No write automation or production activation
is included here.
