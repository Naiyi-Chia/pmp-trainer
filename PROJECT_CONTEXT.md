# PROJECT_CONTEXT.md

## Purpose

This file provides stable project context for ChatGPT and Engineering Agents working on PMP Trainer.

It is intentionally semi-stable. Do not use it as a work log and do not store current PR numbers, latest commit SHAs, or transient task status here. Live task state belongs in GitHub Issues / PRs.

## Product

PMP Trainer is a single-page, static PMP practice tool published with GitHub Pages.

- Production: `https://naiyi-chia.github.io/pmp-trainer/`
- Dev Preview: `https://naiyi-chia.github.io/pmp-trainer/dev/`
- Primary UI language: Traditional Chinese (Taiwan usage)
- Main application: `index.html`
- Current architecture: vanilla HTML / CSS / JavaScript
- No build system or framework is required.

## Source of Truth Hierarchy

Use the following hierarchy when deciding what to trust:

1. **Canonical cross-project workflow** — `Naiyi-Chia/naiyi-product-playbook`, AI Product Development Playbook v1.2.
2. **GitHub Issue** — task-level Source of Truth for Goal, Scope, Expected Behavior, Constraints, and Acceptance Criteria.
3. **AGENTS.md** — repository execution rules and agent guardrails.
4. **docs/GITHUB_PROJECT_WORKFLOW.md** — PMP-specific mapping of the workflow to GitHub Project states / fields.
5. **PROJECT_CONTEXT.md** — stable product and repository context only.

If a task requirement changes, update the GitHub Issue first. Do not treat chat, commit messages, or PR comments as a replacement for the Issue contract.

## Branch and Environment Semantics

- `main` = production / deploy boundary.
- `dev` = integration + staging / fixed Dev Preview environment.
- Scoped implementation branches are created from the latest `dev`.
- Feature / fix / UX / maintenance work should not be implemented directly on `main`.

The fixed Dev Preview loads the current public `dev/index.html`, allowing integrated Human Product Verify before release to `main`.

## Standard Lifecycle

```text
Feedback / Requirement
→ GitHub Issue
→ scoped branch from latest dev
→ implementation + local/browser QA
→ commit + push
→ ChatGPT Technical Review
→ Feature PR: scoped branch → dev
→ Human Integration Approval
→ merge to dev
→ Dev Preview / staging
→ Human Product Verify
→ Ready for Release
→ Release PR: dev → main
→ ChatGPT Release Review
→ Human Release Approval
→ merge to main
→ Production Smoke
→ Done / Close Issue
```

Key rule:

`merge to dev` ≠ Product Verify passed ≠ Ready for Release.

Ready for Release requires both:
- integration into `dev`; and
- Human Product Verify passed.

## Human Gates

1. **Integration Approval** — approves entry into `dev` for integrated testing.
2. **Product Verify** — human verification on the integrated Dev Preview.
3. **Release Approval** — approves promoting the verified `dev` state to `main`.

Engineering Agent testing, ChatGPT review, and Human Product Verify are separate responsibilities.

## PMP-Specific Guardrails

- Preserve the current vanilla HTML / CSS / JavaScript architecture unless an Issue explicitly changes it.
- Keep changes scoped and reviewable; avoid unrelated refactors.
- Preserve mobile usability, including a target around 375px where relevant.
- Preserve basic accessibility and avoid introducing horizontal overflow.
- Do not modify the embedded PMP question bank, answer keys, explanations, or PMI sample content unless the Issue explicitly includes question-content scope.
- Do not change user progress or localStorage behavior unless explicitly requested.
- Current production localStorage keys include:
  - `pmp2026_v2_history`
  - `pmp2026_v5_active_mock`
- The Dev Preview isolates those keys with `dev:` prefixes so preview testing does not overwrite production progress.
- Do not add external dependencies unless the Issue documents the need.

## Validation Expectations

There is not yet a full automated test suite. Relevant local/browser smoke checks and `git diff --check` are expected before implementation is reported ready for review.

For UI / JavaScript work, verify the changed behavior plus core navigation on desktop and mobile-sized viewports.

For feedback-form work, also verify link destination, expected metadata / category behavior, new-tab behavior when required, and that returning to the trainer does not break the active practice session.

## Context Hygiene

Keep this file focused on durable project facts.

Do not add:
- transient task or review state;
- latest commit SHA;
- temporary branch names;
- one-off implementation notes;
- short-lived release status.

Put that information in the relevant GitHub Issue or PR instead.
