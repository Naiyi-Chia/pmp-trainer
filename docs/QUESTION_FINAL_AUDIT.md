# Final Question Bank Audit — Issue #27

## Audit phase outcome

Audit-phase tooling and fresh QA are complete. **Final question-quality acceptance is not PASS.** No question or application content was edited. The 38 protected canonicals require Product/Human disposition, and an additional raw shortest-option signal warrants review. No content remediation, integration, Product Verify, release or closure is claimed.

Contract: [#27 audit-only handoff](https://github.com/Naiyi-Chia/pmp-trainer/issues/27#issuecomment-5966308099). Comparison baseline: [#8 published audit](https://github.com/Naiyi-Chia/pmp-trainer/issues/8). Machine evidence: [QUESTION_FINAL_AUDIT.json](QUESTION_FINAL_AUDIT.json). Prior batches and [#26 report](QUESTION_DUPLICATE_CLEANUP.md) are historical supporting evidence, not substitutes for this fresh run.

## Source and start gate

- #22–#26 were freshly checked through GitHub: all closed with state reason `completed`.
- Resumed the single remote branch `question/issue-27-final-audit` at handoff base `3b37e89`. It had no implementation commits and was safely fast-forwarded over two subsequent governance commits to current main/dev. No branch was duplicated or history rewritten.
- Audited current `origin/main == origin/dev == 570bad452a7e1d3015476db3984443459a53f92d`. Local `index.html` matches that exact source (LF-normalized).
- Git blob: `4f4249d15a1d84fa7cea95e6a5f302d4c75e41c8`; identical to the released #26 application. Changes after release `41c70e8` touch only `AGENTS.md`.
- Source SHA-256 (LF): `fe9f3f9d6df84a6a6b590fb2ae6980f7986586b0a881e23c8732922e47a923d1`. Fresh browser QA fingerprint matches.
- Scope: one new read-only audit script, this report, machine evidence, and a small optional `--ids` extension to the existing browser QA runner. Its default #26 sample stays intact. No dependencies or application files changed.

## Published #8 baseline versus current main

| Metric | #8 baseline | Current |
|---|---:|---:|
| Questions | 330 | 330 |
| Unique-longest correct | 286 (86.7%) | 42 (12.7%) |
| Materially-longer correct | 271 (82.1%) | 36 (10.9%) |
| A / B / C / D | 29 / 281 / 16 / 4 | 83 / 83 / 82 / 82 |
| Exact duplicate groups / IDs | 38 / 78 | 0 / 0 |
| Tied-longest correct | Not published | 90 |
| Correct at maximum, including ties | Not published | 132 |
| All four options equal length | Not published | 47 |
| Unique-shortest correct | Not published | 85 (25.8%) |
| Longest same-key run by ID | Not published | 4 |

Length = non-whitespace source characters. Materially longer requires ≥1.25× median distractor length **and** ≥8 additional characters. Tied-longest includes all-equal items; at-maximum = unique-longest + tied-longest. Source counts include English text and do not measure rendered width/height.

Exact checks cover ordered stem/options/key, normalized stem/options without key (the parent definition), and whitespace/case-normalized stem + sorted option texts + correct answer text. All return zero groups. This does not establish conceptual uniqueness: some retained canonical scenarios and answer templates remain very similar.

The answer sequence has no exact global period from 1–165 and no 12-ID window repeating a period of 1–4. These are limited pattern screens, not a guarantee against every possible shortcut.

### Additional shortest/longest strategy screen

To avoid hiding an opposite-length bias, the audit also assigns 1/k credit when the stored answer is among k tied shortest/longest options. This is the expected score from uniformly choosing within that set, using actual source character counts.

| Scope | Longest rule | Shortest rule | Uniform 4-choice baseline |
|---|---:|---:|---:|
| 330 questions | 71.417/330 (21.6%) | 134.750/330 (40.8%) | 25% |
| 38 canonicals | 37.333/38 (98.2%) | 0.000/38 (0.0%) | 25% |
| Other 292 questions | 34.083/292 (11.7%) | 134.750/292 (46.1%) | 25% |

The old bank-wide longest-answer pattern is greatly reduced, but the canonical slice remains highly exploitable by that rule. Conversely, raw shortest-choice credit is **40.8% bank-wide** (46.1% outside canonicals), above the 25% descriptive reference. Many differences are small and some are numeric formatting; this does not establish a rendered visual cue or a statistically validated learner strategy. It is still a material review candidate under #27, not a basis for silently rewriting another 292 questions. Product/Human should disposition this additional signal alongside the canonical set before final acceptance.

## Wording screens

Counts below are occurrences in 330 correct versus 990 distractor options. Presence rates/affected IDs are retained in JSON to avoid comparing unequal denominators or double-counted words as though they were equal samples.

| Term | #8 correct / distractor occurrences | Current correct / distractor occurrences | Current presence % correct / distractor |
|---|---:|---:|---:|
| 評估 | 19 / 0 | 5 / 11 | 1.52 / 1.11 |
| 分析 | 15 / 0 | 18 / 34 | 5.45 / 3.43 |
| 檢視 | 10 / 0 | 23 / 36 | 6.97 / 3.64 |
| 協助 | 13 / 0 | 7 / 17 | 2.12 / 1.72 |
| 共同 | 41 / 0 | 40 / 51 | 10.61 / 5.05 |
| 立即 | 0 / 41 | 3 / 20 | 0.91 / 2.02 |
| 直接 | 0 / 48 | 1 / 14 | 0.30 / 1.41 |
| 要求 | 1 / 74 | 14 / 89 | 4.24 / 8.89 |
| 升級 | 0 / 11 | 2 / 5 | 0.61 / 0.51 |

The original nine one-word associations are no longer deterministic across the full bank, but frequencies are not neutral. `共同` remains concentrated in correct options, including 15 correct / 0 distractor occurrences inside the canonical slice. `要求` and `直接` still skew toward distractors. None of this is a blanket wording-quality PASS.

| Additional screen | Correct / distractor occurrences |
|---|---:|
| 只 | 0 / 16 |
| 所有 | 2 / 57 |
| 永遠 | 0 / 0 |
| 僅 | 0 / 3 |
| 即可 | 0 / 0 |
| 口頭 | 0 / 8 |
| 刪除 | 0 / 3 |
| 一定 | 0 / 0 |
| 一律 | 0 / 1 |
| 完全 | 0 / 1 |
| 不需 | 0 / 0 |
| 無須 | 0 / 0 |

`只`, `僅`, `口頭`, `刪除`, `一律` and `完全` currently occur only in distractors; several are rare. `所有` is 2/57. These can be legitimate wrong-action descriptions in context, yet their elimination value should be considered in residual content review. Counts are flags, not automatic replacement instructions.

## Targeted canonical review table

All rows remain **pending documented Product/Human disposition**. U = uniquely longest, T = tied-longest, M = materially longer. Per-row lengths follow stored A/B/C/D order. The correct text, explanation and mindset for all 38 are retained in JSON for review. A targeted engineering scan found their explanations/mindsets aligned with the intended correct action, but that does not establish adequate distractor difficulty, universal applicability, or Human acceptance.

Suggested review focus codes: **D** = strengthen plausible distractors and comparable option detail; **W** = avoid cooperative/absolute-word cues; **C** = clarify contextual limits instead of implying an always-first rule; **F** = compare like-for-like answer categories. These are proposals for disposition, not authorized edits.

| ID | Topic | Key | A/B/C/D lengths | Flags | Review focus |
|---|---|:---:|---|---|---|
| Q-073 | 衝突管理 | A | 22 / 8 / 8 / 10 | U/M | D, W, C |
| Q-074 | 心理安全 | C | 8 / 6 / 19 / 6 | U/M | D, W |
| Q-075 | 僕人式領導 | C | 4 / 9 / 14 / 6 | U/M | D, W |
| Q-076 | 教練與指導 | C | 4 / 7 / 35 / 6 | U/M | D, W |
| Q-077 | 虛擬團隊 | A | 21 / 8 / 7 / 8 | U/M | D, W |
| Q-078 | 情緒智力 | C | 4 / 7 / 18 / 9 | U/M | D, W, C |
| Q-079 | 談判 | A | 20 / 4 / 6 / 8 | U/M | D, W, C |
| Q-082 | 績效回饋 | A | 22 / 4 / 4 / 6 | U/M | D, W, C |
| Q-083 | 衝突管理 | B | 8 / 22 / 8 / 10 | U/M | D, W, C |
| Q-086 | 教練與指導 | B | 4 / 35 / 7 / 6 | U/M | D, W |
| Q-088 | 情緒智力 | D | 4 / 7 / 9 / 18 | U/M | D, W, C |
| Q-089 | 談判 | D | 4 / 6 / 8 / 20 | U/M | D, W, C |
| Q-092 | 績效回饋 | A | 22 / 4 / 4 / 6 | U/M | D, W, C |
| Q-093 | 衝突管理 | B | 8 / 22 / 8 / 10 | U/M | D, W, C |
| Q-094 | 心理安全 | A | 19 / 8 / 6 / 6 | U/M | D, W |
| Q-095 | 僕人式領導 | A | 14 / 4 / 9 / 6 | U/M | D, W |
| Q-096 | 教練與指導 | B | 4 / 35 / 7 / 6 | U/M | D, W |
| Q-097 | 虛擬團隊 | B | 8 / 21 / 7 / 8 | U/M | D, W |
| Q-098 | 情緒智力 | D | 4 / 7 / 9 / 18 | U/M | D, W, C |
| Q-099 | 談判 | B | 4 / 20 / 6 / 8 | U/M | D, W, C |
| Q-100 | 自組織團隊 | D | 6 / 6 / 6 / 25 | U/M | D, W |
| Q-101 | 團隊章程 | B | 8 / 32 / 8 / 6 | U/M | D, W |
| Q-102 | 績效回饋 | C | 4 / 4 / 22 / 6 | U/M | D, W, C |
| Q-103 | 衝突管理 | B | 8 / 22 / 8 / 10 | U/M | D, W, C |
| Q-106 | 教練與指導 | A | 35 / 4 / 7 / 6 | U/M | D, W |
| Q-108 | 情緒智力 | D | 4 / 7 / 9 / 18 | U/M | D, W, C |
| Q-109 | 談判 | D | 4 / 6 / 8 / 20 | U/M | D, W, C |
| Q-112 | 績效回饋 | C | 4 / 4 / 22 / 6 | U/M | D, W, C |
| Q-159 | 需求管理 | C | 8 / 4 / 27 / 6 | U/M | D, W, C |
| Q-160 | 根因分析 | B | 7 / 29 / 5 / 6 | U/M | D, W |
| Q-161 | Definition of Done | C | 12 / 8 / 16 / 6 | U/M | D, W |
| Q-163 | 整合管理 | D | 8 / 7 / 5 / 15 | U/M | D, W |
| Q-165 | Kanban WIP | A | 9 / 7 / 7 / 7 | U | D, W (刪除 Done 欄 remains implausible despite no M flag) |
| Q-166 | Rolling Wave | C | 8 / 5 / 30 / 6 | U/M | D, W |
| Q-167 | 採購合約 | D | 4 / 2 / 4 / 4 | T | F, W (口頭約定 is not a comparable priced-contract type) |
| Q-172 | 變更控制 | D | 6 / 6 / 6 / 17 | U/M | D, W |
| Q-173 | 需求管理 | A | 27 / 8 / 4 / 6 | U/M | D, W, C |
| Q-174 | 根因分析 | B | 7 / 29 / 5 / 6 | U/M | D, W |

Canonical totals: **37/38 U, 36/38 M**. Q-165 and Q-167 are the only non-M canonicals; Q-167 is the only non-U canonical. Passing a length threshold does not remove their distractor concerns. Repeated answer/scenario templates across the conflict, coaching, feedback and negotiation canonicals also warrant topic-breadth review; zero exact duplicates is a narrower result.

### Other unique-longest outliers

| ID | Lengths A/B/C/D | Key / ratio to distractor median | Engineering observation / disposition |
|---|---|---|---|
| Q-129 | 36 / 32 / 32 / 31 | A / 1.125 | Exact Human-approved supplier wording; localized mobile three-line A documented in #26. Retain pending aggregate disposition. |
| Q-130 | 25 / 27 / 26 / 26 | B / 1.038 | Only one character above longest distractor; context distinguishes self-management from substitute assignment. No new edit proposed. |
| Q-137 | 32 / 32 / 33 / 31 | C / 1.031 | One character above median; #26 rendered audit showed equal option heights. No new edit proposed. |
| Q-150 | 24 / 26 / 27 / 26 | C / 1.038 | One character above longest distractor; explicit authority/accountability bounds distinguish choices. No new edit proposed. |
| Q-217 | 35 / 38 / 33 / 32 | B / 1.152 | English Product Backlog affects source count; #26 rendered audit showed equal heights. DoD reasoning retained; no new edit proposed. |

## Validation and fresh browser QA

- Schema PASS: 330 unique stable IDs in order, expected fields/metadata enums, four distinct nonempty options, integer answer indexes 0–3, nonempty stems/topics/explanations/mindsets, no replacement characters.
- Explicit answer-letter checks PASS for **292** explanations; the **38 unlabelled canonical explanations** are explicitly excluded from letter proof. No mismatch was found. Format checks do not prove qualitative best-answer uniqueness.
- Reused the released Batch 5 independent arithmetic checker on current source: **34/34** numeric/status items recomputed from stems and matched exactly one stored option/key. It covers EVM, EMV, PERT, communication pairs and total float.
- **13/13 negative controls rejected**: count/ID/schema/metadata, option count/index/duplicates, empty explanation/mindset, wrong explanation letter, exact/permuted duplicates and modified application source.
- `node scripts/test-mock-persistence.cjs`: PASS, including real inline-code save/reload/resume, legacy/corrupt/reordered-bank rejection, flags/position/deadline, overwrite/discard, submit/review, expired resume and no duplicate history/resurrection.
- Browser: fresh Edge **154.0.4258.53**, isolated contexts at **1280×900** and **375×812**. Source compiled with Node `vm.Script`; zero page/console errors and no page horizontal overflow.
- Representative 20-item sample covers all three domains, all approaches and all three difficulty labels, scenarios/calculations, canonical risks and prior outliers: `17,29,59,70,73,76,106,129,130,137,150,159,165,167,217,234,257,268,299,301`.
- On each viewport: native import of favorite fixture, exact question/options, score, answer locks, full explanation/mindset and navigation. Desktop all correct/instant (20/20); mobile all incorrect/manual (0/20), retry resets and favorites toggle. All tabs and random practice navigation passed.
- Native random 180-question mock on each viewport: answer one correctly/one incorrectly, flag, reload/resume, compare IDs/answers/position/flag/deadline, submit through native dialog (1/180), inspect locked review states. Sampled mock IDs and native dialog messages are recorded in JSON.
- Visual inspection: desktop Q-073 and mobile Q-301 screenshots were readable with intact feedback/explanation/buttons. This is local Chromium viewport QA, not physical-device/Safari or production smoke. It is not a fresh 330-item rendered-height audit.
- `git diff --check`: PASS before commit. `index.html` is unchanged relative to current main/dev; only scoped tooling/evidence differs.

## Reproduce

Use the repository Python/Node environment; no new package dependency is required. Playwright/Edge are external QA tools already available in the execution environment. `NODE_PATH` may point at that provided runtime.

```text
node scripts/test-mock-persistence.cjs
node scripts/qa-duplicate-cleanup.cjs <qa-output-dir> --ids=17,29,59,70,73,76,106,129,130,137,150,159,165,167,217,234,257,268,299,301
python -X utf8 scripts/audit-question-bank-final.py --ref 570bad452a7e1d3015476db3984443459a53f92d --qa-json <qa-output-dir>/report.json
python -X utf8 scripts/audit-question-bank-final.py --negative-controls
git diff --check
```

The audit defaults to current `origin/main`, reads it with `git show`, and refuses a different working application source. The report labels the published #8 baseline as historical rather than pretending missing historical metrics were measured. JSON contains per-item lengths, all wording hits, IDs requiring manual semantic review, calculation results and the fresh browser run.

## Remaining decision

Product/Human must disposition the canonical residual and the additional shortest/wording signals before #27 can be quality PASS. Any approved content changes require a subsequent documented contract, scoped implementation and re-audit. Independent Technical Review and Human quality acceptance remain pending. The comparison is ready for parent #8 traceability, but final acceptance metrics and the #8 close gate remain pending; neither Issue is closed by this audit-phase handoff.
