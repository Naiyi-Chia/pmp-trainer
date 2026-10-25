# PMP Project Status — Stage 2 controlled write pilot

**Default remains Stage 1 read-only.** No GitHub Actions workflow or automatic status write is enabled. This Stage 2 branch is an implementation candidate pending independent Technical Review, Human Integration Approval, Product Verify, Release Approval and rollout approval.

## Local/operator entrypoints

```sh
# Safe read-only; existing gh authentication with Project read permission:
node scripts/reconcile-project-status.cjs --dry-run 28,30,29,77,83 --json

# Example syntax ONLY, not an instruction to change #30:
# Securely provide PMP_PROJECT_TOKEN out-of-band, not in files/Issues/chat.
PMP_PROJECT_WRITE_ENABLED=1 node scripts/apply-project-status.cjs --issue 30 --expect-current 'Backlog' --apply --json
```

The sample write is **not authorized**, and the current board has #30 in Review; do not roll that status backward to test. A normal Stage 1 dry-run never uses a GraphQL mutation.

Write execution requires **all**: explicit `--apply`, one Issue number, `--expect-current`, `PMP_PROJECT_WRITE_ENABLED=1`, and `PMP_PROJECT_TOKEN` provided through the operator-managed environment. The CLI uses a child-process `GH_TOKEN` from that secret; it never places the token in argv, logs or committed files.

The write command **does not trust new free-form lifecycle comments**. It only reuses Stage 1's reviewed/fingerprinted historical evidence policy. Any new Issue, comment, parent dependency, Human decision or code scope causes a blocker until an independently reviewed policy/evidence update. Do not auto-refresh pinned hashes or infer Human authority merely from GitHub account ownership.

## Safety boundary

1. Identify exactly one PMP Project item for the correct repo/Issue; reject archived, not_planned, duplicate, missing or unknown.
2. Resolve the exact user Project and `Status` field/option IDs through a fresh Projects V2 metadata read, comparing option names with the read-only collector.
3. Require a pinned-evidence **mismatch**, explicit current Status, and forward-only transition. Already-correct status is a no-op. Backward/failure transitions require separately reviewed disposition.
4. Immediately re-read the full Project and Issue/PR evidence before mutation. Drift in evidence, target item, expected status or current status blocks write.
5. Perform exactly one `updateProjectV2ItemFieldValue` GraphQL mutation setting only `Status`; read back Project and verify matching item/desired Status. If response/readback fails, report unverified outcome.
6. No Issue/PR close/reopen, merge, archive, other Project field or deployment changes are implemented.

**Concurrency limitation:** GitHub Projects V2 field mutation has no atomic compare-and-swap or expected-old-value guard. The second read prevents overwriting already-visible drift but cannot guarantee safety if a third party edits Status in the milliseconds between read and write. Any future Actions rollout should enforce one writer with a `concurrency` group and reconcile external edits. Do not claim an atomic lock or zero race risk.

**Credential scope:** A user-owned Projects V2 update requires separately authorized Project access. A broad classic PAT is not ideal; prefer the narrowest credential that actually supports the user's Project, with Human-managed rotation/revocation. Never collect or paste tokens in chat. `GITHUB_TOKEN` for repository data alone is not sufficient to write the account Project.

## Validation and rollout

```sh
node --test scripts/test-project-status-write.cjs
node --test scripts/test-project-status.cjs
node --check scripts/project-status-write.cjs
node --check scripts/apply-project-status.cjs
```

Stage 2 code is reviewable but **does not yet provide autonomous lifecycle event synchronization**. A subsequent scoped change must implement an authenticated structured event/provenance contract (rather than trusting comment prose), an independently reviewed default-branch workflow/invocation, bounded triggering, safe initial read-only activation, visibility of failed syncs, credential control and a kill switch. A workflow committed to `dev` alone does not activate `issue_comment` triggers on default branch. No write automation or production activation is included here.

Rollback: stop invoking the CLI; disable any future workflow and revoke its Project secret. To correct Project status after any suspected partial write, reconcile against durable evidence before manual remediation, never blindly retry an uncertain mutation.
