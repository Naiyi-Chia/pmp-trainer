# Question Schema v2 — Issue #30

`data/questions.json` remains the only runtime question bank. Its v2 envelope has
`schema_version: 2`, `eco_version: "2026"`, `question_count: 330`, and `questions`.
The formal authoring contract is [JSON Schema 2020-12](../data/question-schema-v2.json).
Node validation additionally checks count agreement, unique IDs, answer bounds,
safe integers and the current publication profile. No application dependencies
or new renderers are introduced.

## Fields and compatibility

All eleven v1 fields remain unchanged, including ordered `opts`, zero-based `ans`,
`type` (情境題／計算題), `domain`, `topic`, `approach`, and `difficulty`.
These preserve current filtering, weakness analysis, scoring, progress lookup,
feedback metadata, timer, and history semantics. No storage keys or history
migrations change. `concept` initially equals `topic`; it can later evolve as a
learner-facing concept without replacing the legacy field in this Issue.

| New field | Contract |
| --- | --- |
| `ecoDomain` | People, Process, or Business Environment under the July 2026 ECO |
| `ecoTask` | One primary Task ID: `people.1`–`.8`, `process.1`–`.10`, `business.1`–`.8` |
| `ecoEnabler` | Optional unique array; omission or `[]` means untagged. IDs such as `people.2.e1` identify the source Task's one-based enabler ordinal |
| `concept` | Nonempty learning concept; initially the exact legacy topic |
| `questionType` | Response/presentation format, distinct from the legacy learning category `type` |
| `qa` | Separate quality/revision/provenance/mapping metadata object |

The [ECO catalog](../data/eco-2026.json) records all 26 Task IDs and enabler bounds.
Local Chinese labels are summaries. The authoritative reference is the
[PMI July 2026 ECO](https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf),
printed pages 7–12. IDs are app identifiers, not official PMI identifiers.
Task numbers are scoped to Domain; Enabler references are scoped to Task.
An ECO edition change requires a new catalog/version and reviewed remapping.

Official Task alignment is separate from legacy UI Domain: risk, change control,
and impediments now map to Business Environment; much communication maps to
People and value delivery to Process. Existing UI filters are preserved.
The [per-question mapping manifest](../data/question-v2-mapping.json) provides
330 explicit assignments, rationale and a hash of each ordered legacy record.
These are content-based engineering proposals, not PMI classification or Human
Content Review approval. `qa.mappingStatus` is `proposed` for all migrated records;
only accepted independent review can change it to `reviewed`.

## Quality and revision lifecycle

`qa.qualityStatus` is one of `draft`, `in-review`, `approved`, `needs-revision`,
`retired`. New authored questions start as draft. Engineering validation permits
review; authorized Content Review/Human acceptance permits approval. Flagged
content goes to needs-revision, then in-review and approved after acceptance.
Retired questions are retained in editorial history and excluded from any future
publication workflow. This Issue adds no publication manager or silent filtering.

The current integrated bank is grandfathered as approved **content**. Its
`qa.provenance` is `integrated-dev:<baseline SHA>` and does not assert a new review
of ECO metadata or undo the original quality audit's limitations. Content status
and mapping review status are separate. Every approved v2 question requires an
ECO Domain/Task regardless of mapping review status.

`qa.revision` starts at 1 for the v2 representation. Increment it on subsequent
content, answer, metadata, or QA status changes; keep the question ID stable.
Update provenance to the authorizing Issue/review/commit reference. Approved
content changes require re-review under repo governance. Schema version identifies
the data shape; revision identifies a question's editorial state. Neither alters
stored historical attempt versions or re-scores past answers.

## Reserved future contracts

The authoring validator accepts these formats; the current loader deliberately
accepts only 330 approved single-response questions with four options. Other
formats remain gated with the existing startup error/retry behavior.

| `questionType` | Answer / stimulus |
| --- | --- |
| `single-response` | `ans` is one zero-based option index |
| `multiple-response` | `ans` is a unique array of at least two valid option indices; array order carries no scoring meaning |
| `case` | `stimulus: {kind: "case", caseId, text}` plus `responseType` single/multiple; shared case IDs identify context across records |
| `graphic-based` | `stimulus: {kind: "graphic", src, alt}` plus `responseType` single/multiple; alt text is required |

Case context is self-contained so each question can be represented independently;
future case editors must keep shared case text consistent. Graphic assets are
references, not fetched by this implementation. Case grouping, media safety,
multi-answer scoring, and interactive renderers belong to their future Issues.
Draft type examples are exercised in `scripts/test-question-schema-v2.cjs` and
never included in the canonical bank. Legacy `type` stays a learning category.

## Migration and checks

The pinned baseline is `a68564d00ec069948fc6fbb00299adc136ad211a` (latest dev at
implementation start). The migration reads its canonical v1 asset through Git,
validates each mapping fingerprint and preserves all 330 ordered legacy records.
It refuses to overwrite a bank changed since that baseline. `--write` is
idempotent for the initial migration; it is not a future metadata reset tool.

```sh
python -X utf8 scripts/migrate-question-schema-v2.py --check
node scripts/validate-question-bank.cjs
node scripts/test-question-schema-v2.cjs
python -X utf8 scripts/audit-question-bank-final.py --canonical
node scripts/audit-eco-coverage.cjs
```

Use `--write` on the migration only to reproduce the authorized initial v2 bank.
Use `node scripts/validate-question-bank.cjs --authoring <file.json>` for draft
and future-format data. This is structural validation, not approval or semantic
proof. The runtime also accepts the unchanged v1 bank for rollback compatibility.
The historical `--parity` contract remains only for Issue #77's v1 extraction;
use the pinned v1 checkout to replay it, not the current v2 bank.

`node scripts/audit-eco-coverage.cjs --write` regenerates
[Task coverage evidence](ECO_TASK_COVERAGE_V2.json). Current coverage is 24/26:
People Task 1 (shared vision) and Process Task 6 (finance planning/management)
have no primary assignments. Mentoring arrangements map to People Task 5,
which includes mentoring opportunities in the 2026 ECO. EVM items count
under status evaluation; they do not establish finance-planning coverage.
Enablers are intentionally unassigned. Counts measure this practice bank, not
official Task or Enabler quotas. Coverage gaps are reported without adding or
remediating questions. Future review can refine ambiguous primary assignments.

Practice/Mock regression uses the current asset-serving QA helpers, including
`/dev/` raw-dev JSON resolution and existing `dev:` storage separation.
[Validation evidence](QUESTION_SCHEMA_V2_QA.json) records runtime, migration,
standard JSON Schema cross-checks and browser results. Human Content Review,
Technical Review and integration remain separate gates.
