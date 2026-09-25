# GitHub Project Workflow — PMP Trainer

This document defines the target GitHub Project configuration for PMP Trainer according to AI Product Development Playbook v1.6.

> Note: GitHub Project (Projects v2) fields are account-level project metadata and are not currently exposed by the connected GitHub actions available in ChatGPT. The configuration below is therefore the verification target and manual setup checklist.

## Status

Use these workflow states:

```text
Inbox
Ready
In Progress
Review
Verify
Ready for Release
Done
```

Definitions:

- **Inbox** — recorded but not fully triaged / specified.
- **Ready** — Issue has clear Goal / Scope / Acceptance Criteria and can be handed to an Engineering Agent.
- **In Progress** — implementation is active.
- **Review** — code / diff / scope review is in progress.
- **Verify** — the change is integrated into `dev` and Human Product Verify is in progress on the fixed Dev Preview.
- **Ready for Release** — the change is integrated into `dev` and Human Product Verify passed; Issue remains open.
- **Done** — production / final verification gate passed and Issue may be closed.

## Deployment

Keep deployment state separate from Status when possible:

```text
Dev
Production
```

Do not encode deployment entirely in Status.

## Priority

```text
P0 = Production blocker / data loss / security
P1 = High impact
P2 = Normal
P3 = Later / nice-to-have
```

## Type

Recommended values for PMP Trainer:

```text
Bug
Feature
UX
Question
Maintenance
Docs
```

`Question` is the PMP Trainer project-specific mapping for the cross-project `Content` type.

## Release / Version

Use a single-select or text field, for example:

```text
v0.1-beta
v0.2-beta
v1.0
```

## Recommended Views

### Current Work
Filter Status to:

```text
Ready
In Progress
Review
Verify
Ready for Release
```

### Inbox / Backlog
Filter Status to:

```text
Inbox
Ready
```

### Release
Group by `Release / Version`.

## State transitions

```text
Feedback / idea
→ Inbox
→ Ready
→ In Progress
→ Review
→ Verify
→ Ready for Release
→ Done
```

Workflow mechanics:

- **Review** includes Engineering Ready evidence + independent ChatGPT Technical Review.
- Technical Review PASS may create / update the correct Feature PR automatically; PR creation is not a Human Gate.
- **Integration Approval** is the Human decision before a reviewed change crosses into `dev`.
- Merge to `dev` moves work into integrated verification; it does **not** mean Product Verify passed.
- **Product Verify** happens on the fixed Dev Preview at `https://naiyi-chia.github.io/pmp-trainer/dev/`.
- `Product Verify 通過` moves the Issue to **Ready for Release** but does not release automatically.
- `Product Verify 通過，可以發布` may also supply Human Release Approval / release intent.
- After release intent, Release PR creation + **Final Release Review** may proceed automatically.
- A clean Final Release Review may merge `main`; any blocker / conflict / unexpected scope stops automation.
- User-facing deployable work reaches **Done** only after Production Smoke passes.
- Docs / maintenance work with no product deployment may reach Done after its defined final verification gate.

Optional Epic Integration Branch:
- Human must explicitly enable the pattern in the Parent Issue.
- Each Sub-issue still requires Engineering QA + independent Technical Review.
- Clean reviewed Sub-issue PRs may accumulate into the enabled epic branch without a per-Sub-issue Human Gate.
- Final Epic Integration Branch → `dev` still requires Human Integration Approval.
- Product Verify remains on integrated `dev`.

## Manual verification checklist

- [ ] Project contains Status field with all seven states.
- [ ] Deployment is a separate field with Dev / Production (if useful for the board).
- [ ] Priority contains P0 / P1 / P2 / P3.
- [ ] Type contains Bug / Feature / UX / Question / Maintenance / Docs.
- [ ] Release / Version field exists.
- [ ] Current Work view exists.
- [ ] Inbox / Backlog view exists.
- [ ] Release view groups by Release / Version.
