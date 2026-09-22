# Issue #18 — unfinished mock compatibility

## Decision

Use explicit incompatibility detection rather than guessing an old answer's
identity. The existing key `pmp2026_v5_active_mock` remains intentional: the new
reader must find old saves and explain why they cannot be resumed. New values
use `version:6` and include an exact ordered `questionSignature` for the 180
questions in that mock. Numeric answers remain unchanged in memory and storage.

The signature is canonical JSON of each question's ID, stem, ordered options,
key, explanation, mindset and classification fields. It is compared as a string,
not a lossy hash, and is never rendered or used as a trusted question snapshot.
The current bank remains the only source of displayed/graded questions.

Before restoring any state, validate the version, 180 unique existing IDs,
signature, position, finite timestamps, answer index ranges and boolean flags.
Only then restore answers/flags and the original absolute deadline. Reordering
the bank array or changing a question outside this exam does not invalidate it.

### Old or incompatible saves

- Version 5 has no evidence of the previous option text. Reject it even if the
  current IDs still exist; migration cannot be proven safe.
- Changed included content/options/key, unsupported formats or corrupt data show
  a specific explanation and disable resume. No answers are graded/recorded.
- Keep rejected data until the learner discards it or starts a new exam; do not
  silently delete it during validation. Aggregate learning history is untouched.
- Compatible saved mocks still require confirmation before a new mock overwrites
  them. Discard retains its confirmation. Existing browser-storage write failures
  remain handled by the existing save return value; this is not a storage redesign.

### Trade-offs

This favors safety over preserving every unfinished exam. Even an explanation
or classification edit within an exam invalidates it; there is no attempt to
match rewritten options by text or migrate older selections. The content string
adds storage and serialization cost for one 180-question exam, but avoids a new
dependency, async hashing, manual bank-version maintenance or question-schema
change. It does not protect users who keep running an older application build;
old cached pages/tabs should be refreshed after deployment.

Submission now clears the active deadline as well as the interval. This prevents
unload/visibility handlers from saving a completed exam again, and makes repeat
submission a no-op. Result computation and review still use the same question
objects and answers. No question content or history schema changed.

## Repeatable regression check

```text
node scripts/test-mock-persistence.cjs
git diff --check
```

The dependency-free Node harness executes the actual inline application with a
minimal DOM, storage and clock. It covers:

- new save, fresh-context reload/resume, ordered IDs, selected/unanswered states;
- flags, current position and the original deadline after time away;
- v5, unknown version, malformed JSON and invalid fields rejected without restore;
- simulated option reorder with corresponding key change, stem/key/explanation
  edits rejected; unrelated questions and bank-array order remain compatible;
- overwrite warning/cancel, discard/cancel, unaffected aggregate history;
- resumed scoring, finite/correct domain percentages, correct/wrong review;
- no practice timer/result/attempt writes during review;
- no duplicate history or re-created active save after submit/unload/visibility;
- expired compatible resume submits once without extending the deadline.

## Local browser QA — 2026-09-22

Final implementation checked at 1024px desktop and a measured 375px iframe:

- New mock: answer, flag, navigate, reload and resume. Same question and selected
  text restored, flags retained, third question still unanswered, elapsed wall
  time deducted (mobile example: 239:59 before reload, 239:28 after resume).
- Version 5 fixture: clear old-format explanation, resume disabled; discard works.
- Version 6 fixture signed with a swapped option order: clear content-update
  explanation and disabled resume; starting a new mock remains available.
- Submit resumed mock: result matches review. Final desktop example 1/180 with
  Process 1%, other domains 0%; mobile example 0/180 with all domain values 0%.
- Reload after submit does not show an unfinished mock again.
- Desktop/mobile normal practice starts, answers and navigates; analytics,
  official samples, Mindset and mock tabs remain available.
- Mobile document scroll width 360px within 375px viewport (scrollbar excluded),
  with readable incompatibility message, controls and review. No page overflow.
- JS syntax and unchanged 330-question data checked separately.

### QA limitations

The in-app browser times out on the native `confirm()` and returns no dialog
handle. Browser flow tests therefore used a temporary localhost copy with only
`window.confirm` replaced by an always-accept shim that logs its message in the
DOM. The application handlers, question bank and persistence code were unchanged.
Cancel/overwrite branches were tested in the Node harness; **native confirmation
dialog interaction still needs human/browser verification**. Fixtures are not
shipped in this repository. An isolated `MutationObserver.observe` error appeared
in the browser tool log; the application does not use that API and the tested
flows continued. No real phone, full 240-minute wait, multi-tab concurrency or
production smoke test was performed. Human Verify/release approval remain separate.
