# Issue #17 — Remediation Batch 1

Status: implemented and locally checked; **human content review PENDING**.
This document does not declare batch acceptance or authorize Batch 2.

## Scope and baseline

- Baseline: `5791ec2` (dev when the feature branch was created).
- Exactly 20 pilot records changed: 017, 018, 021, 023, 026, 045, 059,
  070, 071, 104, 110, 162, 170, 171, 188, 202, 204, 268, 299, 301.
- People / Process / Business Environment: 6 / 8 / 6; medium / hard: 14 / 6.
- IDs, ordering, metadata, schema and the other 310 records are unchanged.
- Only stem, options, answer index, explanation and mindset fields changed.
- Application code, UI, timers, storage schema, scoring and dependencies are unchanged.

## Same heuristic as parent #8

Option length counts non-whitespace characters. A correct answer is uniquely
longest only if strictly longer than every distractor. It is materially longer
if its length is at least 1.25 times the distractor median AND at least 8
characters longer. These are screening measures, not evidence of item validity.

| Pilot measure | Before | After |
| --- | ---: | ---: |
| Correct answer uniquely longest | 20/20 | 1/20 |
| Correct answer materially longer | 20/20 | 0/20 |
| Correct position A / B / C / D | 1 / 19 / 0 / 0 | 5 / 5 / 5 / 5 |
| Q-070 A/B/C/D lengths | 10 / 26 / 7 / 4 | 23 / 24 / 24 / 24 |
| Q-070 correct / distractor median | 3.71 | 1.00 |

The only uniquely longest key is Q-026: 25 versus 24/24/23 characters.
Sorted-ID answer sequence: `CADBACDBCADBDACBADBC`. No period of 1–10 repeats
through the entire 20-item sequence. Human review should still check visible
local patterns; the test is not a randomness or psychometric assessment.

### Wording occurrences

Counts below are occurrences in 20 correct options / 60 distractors, not rates
with equal denominators. Terms are permitted when they fit the scenario.

| Term | Before correct / distractors | After correct / distractors |
| --- | ---: | ---: |
| 評估 | 1 / 0 | 0 / 2 |
| 分析 | 0 / 0 | 0 / 4 |
| 檢視 | 2 / 0 | 1 / 4 |
| 協助 | 0 / 0 | 1 / 1 |
| 共同 | 2 / 0 | 1 / 12 |
| 立即 | 0 / 1 | 1 / 0 |
| 直接 | 0 / 3 | 0 / 2 |
| 要求 | 0 / 6 | 1 / 8 |
| 升級 | 0 / 1 | 0 / 0 |

Collaboration and analysis now also occur in credible distractors; immediate
intervention is correct in the active psychological-safety incident. Do not
interpret zero/small counts as proof that a word is safe or unsafe. In particular,
共同 remains more common in distractors: avoid teaching a reversed word rule.

## Human review map

Each row identifies the intended distinction, including a credible competitor.
The complete options and explanations are in `index.html`.

| ID | Key | Preserved concept and contextual distinction |
| --- | --- | --- |
| 017 | C | 績效回饋：先核對原因；訓練與工作量調整都可信，但尚未確認需要哪一種支持。 |
| 018 | A | 知識移轉：跟做及獨立實作驗證；文件簽核與錄影保留知識但未驗證接手能力。 |
| 021 | D | 無職權影響：先談雙方目標與投入；贊助人協調可在協商未果時使用。 |
| 023 | B | 團隊激勵：回應已知的認可與目的感缺口；條件式獎勵是可信但較不直接的方案。 |
| 026 | A | Sprint 需求管理：範圍可以協商，但題幹已確認納入危及仍有效的 Sprint Goal。 |
| 045 | C | 滾動式規劃：近期細化、保留遠期方向；全年詳細估算超出目前資訊成熟度。 |
| 059 | D | 商業案例：更新效益與未來成本交治理決策；降成本不必然恢復商業合理性。 |
| 070 | B | 價值衡量：以處理時間與每案成本對照基準；採用率與滿意度是輔助而非本題成果。 |
| 071 | C | EEF：聚焦既存資訊系統處理能力；OPA 程序與知識是可信分類，但不是題幹限制。 |
| 104 | A | 心理安全：正在打斷與責備時制止行為並讓成員說完；私下收集無法修復眼前互動。 |
| 110 | D | 自我管理：團隊有能力與權限，應自行承擔工作決策；輪值派工只是換派工者。 |
| 162 | B | 技術風險：用代表實際負載的限時試驗補足證據；契約保證不能證明可行性。 |
| 170 | D | 範疇驗收：先對齊核准版本；變更流程不能在差異未明時把缺陷當新增要求。 |
| 171 | A | 技術債：量化影響後與功能一起排序；固定容量可行但本題不支持固定一半。 |
| 188 | C | 根因分析：已控制影響，再追查機制；加強測試或抽樣主要改善偵測。 |
| 202 | B | 根因分析：跨職能查證，不以主管歸責取代證據；增加檢查未解釋原有控制漏失。 |
| 204 | A | 技術風險：不可退投入前驗證未覆蓋假設；採購後驗收條款無法挽回不可退費用。 |
| 268 | D | AI 治理：資料傳送前確認用途、控制與核准；保密協議或去姓名不等同獲准使用。 |
| 299 | B | 商業案例：前瞻比較並依權限決策；降低剩餘成本是選項，但不能沿用失真效益。 |
| 301 | C | AI 治理：核准工具改用新資料時重查用途邊界；加密與不訓練承諾只是部分控制。 |

Q-071 deliberately replaces the old combined system/procedure restriction with
a concrete system-capacity constraint. Q-026 does not teach a blanket ban on
Sprint scope negotiation. AI items describe organizational governance decisions,
not a jurisdiction-specific legal conclusion.

## Local QA — 2026-09-22

- JavaScript syntax: PASS, all inline script blocks parsed with Node `vm.Script`.
- Scope/schema/length/key audit: PASS with the command below.
- Desktop: all 20 pilot items answered correctly; 4 options each, locked after
  answering, correct key and explanation shown, no document horizontal overflow.
- 375px: all 20 answered incorrectly; manual explanations hidden until requested,
  correct and selected-wrong states readable; viewport measured 375px, document
  scroll width 360px (scrollbar consumes remaining width), no horizontal overflow.
- Desktop 20/20 result: 100%, no retry CTA. Mobile 0/20 result: 0%, retry count 20.
- Mobile retry opens a new unanswered round labelled 本輪錯題重練・20 題.
- Favorite toggle and previous/next navigation checked on desktop.
- Mock entry screen renders. Starting the mock was initially rejected by automatic
  approval review using an earlier UI-task restriction. After re-reading #17's
  explicit Mock QA requirement and retrying, the browser tool timed out at the
  native confirmation; its dialog API returned no handle. **Mock submit/review
  browser QA remains unverified.** No confirmation bypass or app change was added.
- No real-device, full-duration exam or screen-reader test was performed.

Browser method: a temporary localhost copy kept the application handlers and all
330 records intact, with only `shuffle` overridden in a test-only script to put
the 20 IDs first. Fixed-width 1024px and 375px iframe documents exercised actual
responsive layout. None of these fixtures is included in the repository/commit.
This provides deterministic pilot coverage, not verification of random sampling.

## Repeat the audit

Export `git show 5791ec2:index.html` to a UTF-8 temporary baseline file, then run:

```text
python -X utf8 scripts/audit-remediation-batch1.py --baseline <baseline.html>
git diff --check
```

The standard-library script is read-only. It checks the exact changed-ID set,
unchanged metadata/schema/non-bank application, valid options/keys, explanation
key prefixes and the batch heuristics. It prints per-item lengths and wording
counts; it cannot determine whether the best answer is educationally sound.

## Writing rules and next gate

1. Define the decision constraint (authority, timing, known evidence, goal) before
   writing options. Preserve the original concept rather than just changing keys.
2. Use actions that could be appropriate in another circumstance; explain why the
   strongest competitor is premature, incomplete or mismatched here.
3. Give distractors comparable specificity and grammatical structure. Do not pad
   text to hit a length quota or equate equal length with good questions.
4. Apply collaboration/analysis verbs to multiple candidates when natural. A verb
   alone must not identify the key; do not create a reversed distractor vocabulary.
5. Rebalance positions after content drafting and recheck every letter reference.

Before Batch 2, a human PMP reviewer must confirm the preserved concepts, best
answer uniqueness, plausibility of at least two candidates, medium/hard labels
and whether added constraints over-cue the answer. Closely related pilot pairs
162/204 and 188/202 need particular review for meaningful difficulty differences.
Heuristic success alone does not establish those properties or learner outcomes.

### Compatibility risk requiring release review

Existing unfinished mock exams store question IDs and numeric option indices,
then restore questions from the current bank. Reordering these 20 options can
make a pre-update saved choice refer to different text after update. No storage
migration or resume-policy change is in this Issue's scope. Decide how to handle
in-flight exams before release. Historical aggregate records are not rewritten.

### Reference checks

- [PMI 2026 ECO](https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf)
- [Scrum Guide 2020](https://scrumguides.org/scrum-guide.html): Sprint Goal and self-management.
- [PMI: Creating an environment for teams to thrive](https://www.pmi.org/learning/library/creating-environment-project-teams-to-thrive-9867): organizational assets context.
- [PMI: Leverage and enhance organizational assets](https://www.pmi.org/disciplined-agile/mindset/guidelines/leverageassets): technical debt trade-offs.

These are concept checks, not a claim that PMI authored or endorsed the items.
