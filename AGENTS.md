# AGENTS.md

## Project
PMP Trainer is a single-page, static PMP practice tool published with GitHub Pages.

- Main application: `index.html`
- No build system or framework is currently required.
- UI copy is primarily Traditional Chinese (Taiwan usage).
- `main` is the production branch.
- `dev` is the development branch.

## Before making changes
1. Read the relevant GitHub Issue first and treat its acceptance criteria as the task contract.
2. Confirm you are working on `dev`, not directly on `main`.
3. Keep the change scoped to the Issue. Avoid unrelated refactors.
4. Inspect the existing implementation before adding new code; do not duplicate existing behavior.

## Editing rules
- Prefer small, reviewable diffs.
- Keep the current vanilla HTML/CSS/JavaScript approach unless the Issue explicitly requires an architecture change.
- Preserve mobile usability.
- Do not modify the embedded PMP question bank, answer keys, explanations, or PMI sample content unless the Issue specifically concerns question content.
- Do not remove existing user progress/localStorage behavior unless explicitly requested.
- Do not add external dependencies unless there is a clear need documented in the Issue.

## Validation
There is not yet a full automated test suite. Before declaring implementation work ready for review, perform the relevant manual checks in a browser.

Minimum smoke checks after UI/JavaScript changes:
- Page loads without obvious JavaScript errors.
- Practice mode can start and navigate questions.
- Existing tabs still open normally.
- The changed feature works on a desktop-sized viewport.
- The changed feature remains usable on a mobile-sized viewport.

For feedback-form changes also verify:
- Overall feedback opens the intended Google Form.
- Question feedback opens the form with the expected question metadata when applicable.
- Returning to the trainer does not break the current practice session.

## Completion report
When work is ready for review, report:
- Which Issue was addressed.
- Which files changed.
- What behavior changed.
- What checks were performed and their results.
- Any known limitations or follow-up work.

## Human gates
Agents may implement, inspect, test, and prepare a Pull Request, but must not independently:
- declare product acceptance complete;
- merge into `main`;
- close the Issue;
- claim the production site is verified.

Those decisions require human confirmation.
