# AGENTS.md

## Project
PMP Trainer is a single-page, static PMP practice tool published with GitHub Pages.

- Main application: `index.html`
- No build system or framework is currently required.
- UI copy is primarily Traditional Chinese (Taiwan usage).
- `main` is the production / deploy branch.
- `dev` is the integration + staging / Dev Preview branch.
- Fixed Dev Preview: `https://naiyi-chia.github.io/pmp-trainer/dev/`
- Cross-project workflow follows the canonical AI Product Development Playbook v1.6 in `Naiyi-Chia/naiyi-product-playbook`.

## Source of Truth
The canonical Playbook defines the cross-project workflow. The GitHub Issue is the Source of Truth for each development task.

Before implementation, read the Issue and treat its Goal, Scope, Expected Behavior, Constraints, Acceptance Criteria, and any explicit base / target branch contract as authoritative for that task.

If Scope, Expected Behavior, or Acceptance Criteria changes during implementation:
1. Stop expanding the implementation.
2. Update the GitHub Issue first.
3. Continue only after the Issue reflects the new requirement.

Do not keep requirement changes only in chat, commit messages, PR comments, or handoff text.

## Before making changes
1. Confirm the repository root and fetch origin.
2. Read the relevant GitHub Issue; it is the mandatory task contract.
3. Use the applicable `AGENTS.md` / repo instructions. If the runtime already loaded them, do not reload or paste them only for formality.
4. Load additional context only when materially needed:
   - Parent Issue: when the Sub-issue contract is insufficient, or for epic orchestration / checkpoint / final integration.
   - `PROJECT_CONTEXT.md`: when stable product / repository context is needed for the task.
   - Canonical Playbook: for workflow ambiguity, governance changes, or interpreting repo rules; routine implementation should not reread the whole Playbook.
5. Resolve the task base branch:
   - default: latest `dev`;
   - optional Epic pattern: latest named Epic Integration Branch only when the Parent Issue records an explicit Human decision and the current Sub-issue explicitly names its base / target.
6. Switch / update the correct baseline and confirm the working tree is clean.
7. Create a scoped branch from that baseline, for example:
   - `feat/issue-N-short-name`
   - `fix/issue-N-short-name`
   - `ux/issue-N-short-name`
   - `maint/issue-N-short-name`
8. Inspect only the relevant implementation / evidence before editing; do not duplicate existing behavior.

Do not infer or enable an Epic Integration Branch merely because a Parent Issue or multiple Sub-issues exist. Without an explicit Human decision and Issue contract, the base remains latest `dev`.

Context efficiency must not override correctness: if required evidence is missing, read the authoritative source instead of guessing.

## Editing rules
- Keep changes scoped to the Issue. Avoid unrelated refactors.
- Prefer small, reviewable diffs.
- Keep the current vanilla HTML/CSS/JavaScript approach unless the Issue explicitly requires an architecture change.
- Preserve mobile usability and basic accessibility.
- Do not modify the embedded PMP question bank, answer keys, explanations, or PMI sample content unless the Issue specifically concerns question content.
- Do not remove or change existing user progress / localStorage behavior unless explicitly requested.
- Do not add external dependencies unless the need is documented in the Issue.
- Do not change unrelated files merely to reformat them.

## Validation
There is not yet a full automated test suite. Before reporting implementation ready for review, run the relevant checks and record the result.

Minimum smoke checks after UI / JavaScript changes:
- Page loads without obvious JavaScript errors.
- Practice mode can start and navigate questions.
- Existing tabs still open normally.
- The changed feature works on a desktop-sized viewport.
- The changed feature remains usable on a mobile-sized viewport (target around 375px where relevant).
- No unintended horizontal scroll is introduced.
- Run `git diff --check` before commit.

For feedback-form changes also verify:
- Overall feedback opens the intended Google Form.
- Question feedback opens the form with the expected question metadata when applicable.
- Expected category preselection / non-preselection is correct.
- Feedback opens in a new tab when required.
- Returning to the trainer does not break the current practice session.

## Implementation completion
When implementation is complete:
1. Review the final diff.
2. Run relevant QA / smoke checks.
3. Run `git diff --check`.
4. Commit the scoped change.
5. Push the scoped branch.
6. If GitHub Issue-comment permission is available, post concise Engineering Ready evidence using `<!-- engineering-ready-for-review -->`; otherwise report the same concise evidence in the current handoff channel.

Stop implementation after the handoff. Technical Review PASS may cause ChatGPT / orchestration to create or update the correct PR automatically. Engineering implementation itself must not merge into `dev` / `main`, close the Issue, declare Product Verify, or make a release decision.

## Completion report
Preferred location: the task GitHub Issue, when write permission is available.

Use this marker:

```html
<!-- engineering-ready-for-review -->
```

Keep the report concise. Record:
- Issue number.
- Branch / commit SHA.
- Changed scope / files.
- Relevant tests / browser QA and results.
- Durable evidence / report path when one exists.
- Known limitations / blockers.
- Final working-tree / remote-sync state when relevant.

Do **not** restate Goal / Scope / Expected Behavior / Acceptance Criteria already owned by the Issue.

Detailed generated audits, CSVs, logs, or large reports should live in durable repository artifacts when useful; the completion comment should reference them instead of pasting them.

The completion report is implementation evidence / handoff status only. If Scope, Expected Behavior, or Acceptance Criteria changed, update the Issue first.

A GitHub Issue comment creates a retrievable shared handoff, so the Human can use a short request such as `review #N` instead of copying the report into chat.

## Technical Review evidence
ChatGPT Technical Review remains mandatory and independent from Engineering QA.

Keep the review record concise:
- reviewed head / target;
- independent checks performed;
- PASS / FAIL;
- blockers / material risk;
- durable evidence reference when needed.

Do not reproduce the full Issue, Engineering Ready report, or large generated artifacts in the review comment.

## Pull request traceability
PR creation is review / traceability mechanics, not a Human Gate.

After Technical Review PASS:
- create or update the correct Feature / Sub-issue PR automatically;
- default target: scoped branch → `dev`;
- enabled Epic pattern: Sub-issue scoped branch → named Epic Integration Branch;
- PR body must include `Refs #N` for the task Issue;
- add a durable backlink comment to the task Issue using `<!-- feature-pr-link -->`, recording PR number, head, base, and current status.

For a Release PR:
- target is `dev → main`;
- PR body must contain `Refs #N` for every included Issue;
- add a durable backlink comment to every included Issue using `<!-- release-pr-link -->`.

For normal deployable work, do not use `Closes #N`, `Fixes #N`, or `Resolves #N` in Feature or Release PRs. Merge to `main` means Released; Production Smoke remains the Close Gate.

Traceability comments are execution evidence only. They do not change requirements, Product Verify state, or any Human decision.

## Human gates
Human decisions control state transitions; GitHub mechanics around those decisions may be automated.

An Engineering Agent / orchestrator must not independently:
- merge into `dev` without Human Integration Approval;
- declare Product Verify complete;
- release / merge into `main` without Human Release Approval / release intent;
- close a deployable Issue before Production Smoke passes;
- claim the production site is verified without evidence.

PR creation itself is **not** a Human Gate.

There are three Human-owned decision semantics:

1. **Integration Approval**
   - Required before a reviewed change crosses into `dev`.
   - Human can simply say `可以 merge 到 dev`.
   - If the PR does not exist yet, orchestration may create it, verify head / base / review / mergeability, then merge when clean.
   - It is not Product Acceptance.

2. **Product Verify**
   - Happens after the change is integrated into `dev`.
   - Verify the fixed Dev Preview for UX, functional behavior, mobile / target-browser behavior, Acceptance Criteria, and integration behavior.
   - `Product Verify 通過` means Ready for Release; it does **not** release automatically.
   - If Product Verify fails, keep the Issue open. If Scope / Expected Behavior / AC changes, update the Issue before rework.

3. **Release Approval / release intent**
   - Human decides whether the verified `dev` state should enter production.
   - `Product Verify 通過，可以發布` may provide Product Verify and Release Approval in one explicit instruction.
   - If Product Verify already passed, a later `可以發布` supplies Release Approval.
   - After release intent, orchestration may create / update the Release PR and run Final Release Review.
   - If Final Release Review is clean, it may merge `main` without asking for a redundant second approval. Any blocker / conflict / unexpected scope stops automation.

If the Human explicitly enables an Epic Integration Branch:
- every Sub-issue still requires Engineering QA + independent ChatGPT Technical Review;
- after Technical Review PASS, a clean Sub-issue PR may be created and merged into the named Epic Integration Branch without a per-Sub-issue Human Gate;
- Human aggregate checkpoints remain available when risk warrants them;
- final Epic Integration Branch → `dev` still requires Human Integration Approval;
- canonical Product Verify occurs only on integrated `dev`.

Merge to `dev` does not mean Product Verify passed and does not mean Ready for Release.

## Branch and release model
Default lifecycle:

```text
Issue
→ scoped branch from latest dev
→ implementation + local/browser QA
→ commit + push
→ concise Engineering Ready evidence
→ ChatGPT Technical Review
→ Feature PR automatically created / updated
→ Human Integration Approval
→ merge to dev
→ Dev Preview / staging
→ Human Product Verify
→ Ready for Release
→ Human Release Approval / release intent
→ Release PR automatically created / updated
→ ChatGPT Final Release Review
→ clean: merge to main / blocker: stop
→ Production Smoke
→ Done / Close Issue
```

The optional Epic Integration Branch pattern is an exception, not a new default. It is valid only when the Human decision is recorded in the Parent Issue and each affected Sub-issue explicitly states its base / target.

```text
Sub-issue
→ scoped branch from latest named Epic Integration Branch
→ implementation + QA
→ concise Engineering Ready
→ ChatGPT Technical Review
→ Sub-issue PR automatically created / updated
→ clean checks: merge to Epic Integration Branch
```

Each Sub-issue still requires its own QA and independent Technical Review. Human aggregate checkpoint review may be used for accumulated initiative quality, but it is not Product Verify. The Epic Integration Branch should synchronize with latest `dev` at meaningful checkpoints and must synchronize with current `dev` before final integration; inspect divergence first and never blindly rewrite shared epic-branch history.

Final Epic integration returns to the canonical path:

```text
Epic Integration Branch
→ final aggregate QA / conflict check
→ PR: Epic Integration Branch → dev
→ Human Integration Approval
→ merge to dev
→ Dev Preview / staging
→ Human Product Verify
→ Ready for Release
→ Human Release Approval / release intent
→ Release PR + Final Release Review
→ clean: merge main / blocker: stop
→ Production Smoke
→ Done
```

Feature / Sub-issue PRs may use squash merge. Release PRs should normally use a normal merge so `dev` ancestry is preserved.

After a release, sync `dev` to the latest `main` with a fast-forward when safe. If it cannot fast-forward, inspect branch history first; never force blindly.
