# Issue #29 — attempt history foundation

Engineering implementation starts from `dev@7e00c7570bce744c0238684ebcb07477bf7a2d5f`, following the [Issue contract](https://github.com/Naiyi-Chia/pmp-trainer/issues/29) and [activation](https://github.com/Naiyi-Chia/pmp-trainer/issues/29#issuecomment-5977491582). Branch: `feat/issue-29-attempt-history-v2`. The title's “v2” refers to the new attempt model; storage/export version is **3**, succeeding the existing version-2 summary export.

## Schema and ownership

`pmp2026_v3_learning_history` is authoritative once successfully written:

```json
{
  "version": 3,
  "legacyHistory": {
    "1": {"attempts": 4, "correct": 2, "lastCorrect": false, "lastAt": 1790000000000, "star": true}
  },
  "events": [
    {"id": "session-id:1", "questionId": 1, "at": 1790000010000,
     "mode": "practice", "selectedAnswer": 2, "correct": true,
     "firstEncounter": false, "responseMs": 3200}
  ],
  "stars": {"1": true}
}
```

- `legacyHistory`: preserved pre-event summaries, including extra existing record fields and IDs outside the current bank. These counts have no reconstructable individual timestamps, modes, selections or response times. Migration creates **zero synthetic events**.
- `events`: append-only recorded answers. ID is session ID + question ID, deduplicated for submission/reload retries. `selectedAnswer` is the zero-based historical option position; `correct` is a snapshot when recorded, not regraded against future content. `at` is the final answer-selection time, or submission time when restoring an old Mock without that timestamp.
- `mode`: `practice` or `mock`. Read-only Review has no attempts; its answers already belong to the submitted Mock. Wrong-answer retry is a new Practice session, recorded only upon answering.
- `firstEncounter`: first **recorded answer**, not first visual presentation. True only when neither legacy counts nor prior committed events show an attempt. Favorites alone do not constitute an encounter. Legacy attempted questions yield false; their actual first-attempt performance cannot be reconstructed.
- `responseMs`: cumulative visible time on that question up to the recorded selection. Practice stops at its locked answer; Mock permits changes and records time through its final selection, including revisits. It excludes hidden-document time, other app tabs, settings, results and reload downtime. It is browser interaction time, not a cognitive-speed measure. Old Mock sessions without timing remain `null`, including after an answer edit.
- `stars`: current overrides, independent of events and preserved through migration/import/export.

The existing `H` summary and Dashboard/filter behavior are derived from legacy counts + events + current stars. Latest correctness uses the greatest answer timestamp. `pmp2026_v2_history` remains a compatibility summary projection; it is not added to the event counts again after v3 exists. No question, key, metadata, official sample, layout, Mock composition or scoring change is included.

## Recording and persistence

Practice records one event immediately on the first valid answer per question in the current round. Revisiting, displaying explanations, finishing a round and creating a retry do not write attempts. A fresh retry receives a fresh session ID.

Mock choices remain provisional in the existing `pmp2026_v5_active_mock` key, version 6. The optional `attemptTracking` extension stores a session ID and per-question elapsed/selection timing; old compatible version-6 saves without it still resume, with unknown response time. Existing exact-content signature checks and version-5 rejection remain intact. Answer changes do not create events; unanswered items do not create events. Manual/expired submission writes one event per answered question using the final choice. The existing 180-question scoring denominator remains intact.

The complete event model is persisted in a single localStorage write before the active Mock is cleared. A failed history write warns the user, leaves the prior active save available, and keeps current in-memory data exportable. Retry uses the same event IDs and does not count twice. Practice/favorite storage failures also warn and allow an in-memory export. There is no silent truncation or event eviction at quota.

## Migration and import/export strategy

| Input/state | Behavior |
|---|---|
| No v3 key; valid v2 summary key | Copy summaries/stars into v3, no fake events; write the new model, retain useful legacy projection. |
| Valid v3 key | Validate and derive summaries; repeated startup is idempotent. |
| Version-2 export `{version:2,history:…}` | Validate and migrate. |
| Raw legacy dictionary or unversioned `{history:…}` | Validate and migrate. |
| Version-3 export | Validate and restore `learningHistory`; derive the compatibility summary rather than trusting its redundant `history` field. |
| Unknown export version / invalid fields / duplicate event IDs / inconsistent first flag | Reject before modifying current history. |
| Invalid/future persisted data | Keep original storage bytes; block automatic history writes and display an explicit notice. Export produces a raw recovery backup. |
| Existing v3 and differing legacy projection (e.g. older client wrote later) | Preserve both originals, show v3 summary with an explicit conflict notice, and block automatic writes until a valid import/reset resolves it. No silent overwrite or automatic merge. |
| Import cancellation or failed primary storage write | Keep previous in-memory and persisted learning history. |
| Confirmed reset | Clear v3 events, legacy summaries and stars together, only after successful storage. |

Normal export is `{version:3,exportedAt,learningHistory,history}`. `history` is deliberately included so the previous app's importer can read a useful summary; old clients cannot preserve detailed events. For a full round trip, use the v3 app/export. Imports explicitly confirm replacement and recommend exporting a backup first. Recovery exports contain `recovery:true`, raw v3/legacy strings, and are not accepted as a normal import until repaired. An explicit valid import or confirmed reset can replace blocked data after backup.

## QA and reproduction

[Machine evidence](ATTEMPT_HISTORY_V3_QA.json) records the source fingerprint, source-preservation guards, fresh test outputs and actual browser results.

```text
node scripts/test-attempt-history.cjs
node scripts/test-mock-persistence.cjs
node scripts/qa-attempt-history.cjs <browser-output>
node scripts/qa-duplicate-cleanup.cjs <smoke-output> --ids=1,2,129,217 --check-explanation-action
git diff --check
```

The browser scripts use externally provided Playwright and Edge; set `NODE_PATH` to that installation if necessary. No application dependency was added.

- Migration/idempotence, legacy summaries/stars/unknown IDs, first/repeat events, visible-time pause/resume, v2/raw/v3 imports, invalid imports, storage failure/recovery, reset, native Mock final choices/reload/deduplication and read-only Review: **PASS**.
- Existing #18 full persistence regression, including legacy/corrupt/content mismatch rejection, expiration, flags/deadline, overwrite/discard and no history duplication/resurrection: **PASS**.
- Desktop 1280×900 and mobile 375×812: native migration, Practice incorrect answers/manual or instant explanations, real wrong-answer retry, Dashboard counts, actual download/reimport/reload, invalid/cancelled import, native Mock final choice/reload/resume/flag/submit 1/180 and locked Review: **PASS**.
- Separate existing Practice/Mock/Review/#54 smoke at both sizes: **PASS**. No page/console errors or document horizontal overflow. Desktop/mobile Dashboard screenshots inspected: readable content and usable import/export controls.
- Inline/runner JavaScript syntax, unchanged stored bank and static UI/official content, unchanged Mock composition, and scoped diff whitespace checks: **PASS**.

## Limits and handoff

Legacy data cannot supply historical first-attempt accuracy or response time. Old saved Mocks retain null timing. Event ordering is commit order (Mock records are appended on submission), while `at` retains selection time; consumers should use timestamps for chronology. Event IDs are retained as an opaque deduplication key across exports/imports.

localStorage has finite capacity; a write failure requires export/backup rather than dropping history. This remains a single-browser, single-active-writer design: simultaneous v3 tabs are not merged. On reload, a differing old-client projection is preserved with an explicit conflict notice rather than overwritten; choose a valid export after backup, because automatic cross-version merging is not defined. A failed compatibility-projection write can also trigger that conservative conflict guard on next startup. Physical-device/Safari, production smoke and Human QA are not claimed. Timing uses the device clock and cannot remove reading-time/familiarity effects.

Independent Technical Review and Human QA remain pending before integration/release. If another vNext change lands first, re-sync current dev and rerun affected persistence/Practice/Mock checks as the activation contract requires. No integration, Product Verify, release or Issue closure is performed in this handoff.
