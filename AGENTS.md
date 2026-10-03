# AGENTS.md

## Project

PMP Trainer is a single-page static PMP practice tool published with GitHub Pages.

- Main application: `index.html`
- Vanilla HTML / CSS / JavaScript; no build system or framework is currently required.
- UI copy is primarily Traditional Chinese (Taiwan usage).
- `main` is the production / deploy branch.
- `dev` is the integration + staging / Dev Preview branch.
- Fixed Dev Preview: `https://naiyi-chia.github.io/pmp-trainer/dev/`

Cross-project workflow governance is defined by the latest canonical AI Product Development Playbook in `Naiyi-Chia/naiyi-product-playbook`.

## Task contract and context retrieval

The relevant GitHub Issue is the Source of Truth for each development task.

Before changing repo files:
1. Fetch the remote and read the task Issue. Treat its Goal, Scope, Expected Behavior, Constraints, Acceptance Criteria, and explicit base / target branch contract as authoritative.
2. Use the applicable repo instructions in this file.
3. Resolve the task baseline / target from the Issue; default to latest `dev` unless the Issue explicitly names another integration path.
4. Check remote scoped branches tied to the Issue before creating a new branch:
   - exactly one compatible, unambiguous branch → resume it;
   - none → update the resolved baseline, confirm a clean working tree, then create a scoped branch;
   - multiple candidates, unexpected divergence, incompatible base / target, or conflicting local state → stop and surface the blocker rather than guessing.
5. Inspect only implementation and evidence relevant to the current task.

A compatible branch must be traceable to the current Issue and match its base / target contract without unsafe or ambiguous divergence.

Engineering execution may run in local or remote runtimes. If in-progress work must survive a runtime switch, commit and push it first; uncommitted files, local chat history, and local-only runtime state are not durable handoff state.

Load additional context only when materially required:
- Parent Issue: when the Sub-issue contract is insufficient or epic coordination / checkpoint context is required.
- `PROJECT_CONTEXT.md`: when stable product or repository context is needed and is not already sufficiently defined by the task.
- Canonical Playbook: when workflow interpretation, governance, responsibility boundaries, or rule conflicts need resolution.

Do not preload these sources merely because they exist. Reuse sufficiently fresh authoritative context when available.

If Scope, Expected Behavior, or Acceptance Criteria changes during implementation, stop expanding the change and update the GitHub Issue first.

Context efficiency must not override correctness: if required evidence is missing, read the authoritative source instead of guessing.

## Editing rules

- Keep changes scoped to the Issue and prefer small, reviewable diffs.
- Keep the current vanilla HTML / CSS / JavaScript architecture unless the Issue explicitly requires an architecture change.
- Preserve mobile usability and basic accessibility.
- Do not modify the embedded PMP question bank, answer keys, explanations, or PMI sample content unless the Issue explicitly concerns question content.
- Do not remove or change existing user progress / localStorage behavior unless explicitly requested.
- Do not add external dependencies unless the need is documented in the Issue.
- Avoid unrelated refactors, formatting changes, or duplicate implementations.

## Validation

Run checks relevant to the changed scope. Prefer targeted validation and concise output when sufficient; do not emit unnecessarily broad logs or checks.

For UI / JavaScript changes, normally verify:
- the page loads without obvious JavaScript errors;
- the affected practice flow starts and navigates correctly;
- affected existing tabs / navigation still work;
- the changed feature works on a desktop-sized viewport;
- the changed feature remains usable on a mobile-sized viewport (around 375px where relevant);
- no unintended horizontal scrolling is introduced;
- `git diff --check` passes.

For feedback-form changes, additionally verify:
- the affected feedback entry opens the intended Google Form;
- expected question metadata is passed when applicable;
- category preselection / non-preselection is correct;
- new-tab behavior is correct when required;
- returning to the trainer does not break the current practice session.

Use broader regression checks only when the changed scope or risk justifies them.

## Completion and handoff

When implementation is ready:
1. Review the final scoped diff.
2. Run relevant QA / smoke checks and `git diff --check`.
3. Commit and push the scoped branch.
4. If GitHub Issue-comment permission is available, post concise Engineering Ready evidence using `<!-- engineering-ready-for-review -->`; otherwise report the same concise evidence in the current handoff channel.

Engineering Ready evidence should include only what supports review:
- Issue number;
- branch / commit SHA;
- changed scope / files;
- relevant validation and results;
- durable evidence / artifact reference when one exists;
- known limitations / blockers;
- final working-tree / remote-sync state when relevant.

Do not restate requirements already owned by the Issue or paste large logs / audits / CSVs into the handoff.

Engineering implementation stops at handoff. Follow the latest canonical Playbook and applicable Issue / repo governance for Technical Review, integration, Product Verify, release, Production Smoke, and Issue closure. Do not independently bypass required Human decisions, merge into `dev` / `main`, declare Product Verify, or release production.