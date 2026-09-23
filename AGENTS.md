# AGENTS.md

## Project
PMP Trainer is a single-page, static PMP practice tool published with GitHub Pages.

- Main application: `index.html`
- No build system or framework is currently required.
- UI copy is primarily Traditional Chinese (Taiwan usage).
- `main` is the production / deploy branch.
- `dev` is the integration + staging / Dev Preview branch.
- Fixed Dev Preview: `https://naiyi-chia.github.io/pmp-trainer/dev/`
- Cross-project workflow follows the canonical AI Product Development Playbook v1.2 in `Naiyi-Chia/naiyi-product-playbook`.

## Source of Truth
The GitHub Issue is the Source of Truth for each development task.

Before implementation, read the Issue and treat its Goal, Scope, Expected Behavior, Constraints, and Acceptance Criteria as the task contract.

If Scope, Expected Behavior, or Acceptance Criteria changes during implementation:
1. Stop expanding the implementation.
2. Update the GitHub Issue first.
3. Continue only after the Issue reflects the new requirement.

Do not keep requirement changes only in chat, commit messages, PR comments, or handoff text.

## Before making changes
1. Confirm the repository root.
2. Fetch origin.
3. Switch to `dev` and update from `origin/dev`.
4. Confirm the working tree is clean.
5. Read the relevant GitHub Issue.
6. Read this `AGENTS.md`.
7. Read `PROJECT_CONTEXT.md` for stable project context.
8. Create a scoped branch from the latest `dev`, for example:
   - `feat/issue-N-short-name`
   - `fix/issue-N-short-name`
   - `ux/issue-N-short-name`
   - `maint/issue-N-short-name`
9. Inspect the existing implementation before editing; do not duplicate existing behavior.

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
5. Push the feature branch.
6. If GitHub Issue-comment permission is available, post the completion report to the task Issue using the marker `<!-- engineering-ready-for-review -->`. If Issue commenting is unavailable, report the same information in the current handoff channel.

By default, stop after the completion report. Do not open a PR unless the human explicitly authorizes it.

## Completion report
Preferred location: the task GitHub Issue, when write permission is available.

Use this marker:

```html
<!-- engineering-ready-for-review -->
```

Report:
- Issue number.
- Branch name.
- Commit SHA.
- Files changed.
- Approximate `+/-` lines when available.
- What changed.
- Tests / browser QA performed and results.
- Known limitations or follow-up work.
- Final `git status` / working-tree state.
- Remote-sync state.

The completion report is implementation evidence / handoff status only. It does not change requirements or Acceptance Criteria. If Scope, Expected Behavior, or Acceptance Criteria changed, update the Issue first.

Posting the completion report does not authorize opening a PR, merging, closing the Issue, declaring Product Verify complete, or releasing.

A GitHub Issue comment does not automatically send a message into an existing ChatGPT conversation. It creates a shared handoff that ChatGPT can retrieve later, so the human can use a short request such as `review #22` instead of copying the full report.

If the agent cannot comment on the GitHub Issue, use the same completion-report content in the current handoff channel.

## Human gates
Unless explicitly authorized by the human, an Engineering Agent must not independently:
- open a Pull Request;
- merge into `dev`;
- merge into `main`;
- close the Issue;
- declare Product Verify complete;
- make a release decision;
- claim the production site is verified.

There are three separate Human Gates:

1. **Integration Approval**
   - Happens before a Feature PR is merged to `dev`.
   - Means the reviewed change may enter the integration / staging environment.
   - It is not Product Acceptance.

2. **Product Verify**
   - Happens after the change is integrated into `dev`.
   - Verify the fixed Dev Preview for UX, functional behavior, mobile / target-browser behavior, Acceptance Criteria, and integration behavior.
   - If Product Verify fails, keep the Issue open and repeat fix → review → integration → verify.

3. **Release Approval**
   - Happens on the Release PR from `dev` to `main`.
   - Means the human approves releasing the verified `dev` state to production.

Merge to `dev` does not mean Product Verify passed and does not mean Ready for Release.

Ready for Release requires:
- the change is integrated into `dev`; and
- Human Product Verify passed.

## Branch and release model
Default lifecycle:

```text
Issue
→ scoped branch from latest dev
→ implementation + local/browser QA
→ commit + push
→ Engineering Ready for Review Issue comment (or handoff fallback)
→ ChatGPT Technical Review
→ Feature PR: scoped branch → dev
→ Human Integration Approval
→ merge to dev
→ Dev Preview / staging
→ Human Product Verify
→ Ready for Release (Issue remains open)
→ Release PR: dev → main
→ ChatGPT Release Review
→ Human Release Approval
→ merge to main
→ Production Smoke
→ Done / Close Issue
```

Feature PRs may use squash merge. Release PRs should normally use a normal merge so `dev` ancestry is preserved.

After a release, sync `dev` to the latest `main` with a fast-forward when safe. If it cannot fast-forward, inspect branch history first; never force blindly.
