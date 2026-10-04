# Final Question Bank Audit — Issue #27 targeted remediation

## Engineering outcome

All 38 authorized canonicals have been remediated. Full pre-answer UI measurement was completed **before content edits** and repeated on the final 330-question source at **1280×900** and **375×812**. Engineering validation passes; independent Technical / Content Review and Human content acceptance remain pending. This evidence now includes the Round 1 Human-requested rework of Q-076/Q-086 and supersedes the `a06a5b6` Engineering Ready head; Human re-review remains required.

Contract: [Human disposition](https://github.com/Naiyi-Chia/pmp-trainer/issues/27#issuecomment-5968746145) and [initial Engineering handoff](https://github.com/Naiyi-Chia/pmp-trainer/issues/27#issuecomment-5968753182) and [Round 1 CHANGES REQUIRED](https://github.com/Naiyi-Chia/pmp-trainer/issues/27#issuecomment-5975782093). Machine evidence: [QUESTION_FINAL_AUDIT.json](QUESTION_FINAL_AUDIT.json). Historical comparison: [parent #8](https://github.com/Naiyi-Chia/pmp-trainer/issues/8). Existing PR #73 remains open and unmerged; no Product Verify, release or closure is claimed.

## Source and scope

- Resumed `question/issue-27-final-audit` at `4e192e9207a46f5cfff1be4bdeecb6296b1de21d`, clean and synchronized with its single remote branch; existing dev ancestry is intact.
- Original remediation baseline used main/dev `570bad452a7e1d3015476db3984443459a53f92d`; #22–#26 start gate was already completed. The new handoff explicitly authorizes remediation on this scoped branch.
- Before source SHA-256 (LF): `fe9f3f9d6df84a6a6b590fb2ae6980f7986586b0a881e23c8732922e47a923d1`.
- Final source SHA-256 (LF): `3ae2fbc427636082d777ceed477bbbed600663844bda691715fa9fab0de8c515`; Git application blob: `55f1ae320e7ff8895c03c4bf51624a78e9475e9d`. Rendered and fresh browser QA fingerprints match.
- Exactly 38 records changed: options and explanations in all 38; context clarified in 14 stems. IDs/order/schema, original learning objectives, domain/approach/topic/difficulty/type, answer positions and mindsets are preserved. No CSS, application logic, localStorage, scoring, embedded official samples, dependencies or other 292 question records changed.
- Changed IDs: `73,74,75,76,77,78,79,82,83,86,88,89,92,93,94,95,96,97,98,99,100,101,102,103,106,108,109,112,159,160,161,163,165,166,167,172,173,174`.

## Round 1 rework — Q-076 and Q-086 only

Human finding: both former stems said the capability gap was already affecting delivery quality, making experienced-member takeover a plausible first response. Contract: [comment 5975782093](https://github.com/Naiyi-Chia/pmp-trainer/issues/27#issuecomment-5975782093). Reviewed head: `a06a5b624f9ff3cfabd1bd88f9d97e979bf78004`.

- Rework changes only `q` / `opts` / `exp` in **Q-076 and Q-086**. The other 36 canonicals and all other 292 records are exactly equal to the reviewed head. Existing positions remain C and B; metadata, mindsets and application code remain equal.
- Both scenarios now specify controlled test work, nonurgent schedules, no immediate production/service incident or safety/compliance exposure, and small practice increments with review. Neither stem announces that development is the goal.
- Correct alternatives combine hands-on practice, coaching/mentoring, capability targets and timely feedback. Alternatives retain realistic demonstration/observation, self-study/testing and independent-practice/end-review methods; explanations distinguish their limits under these conditions.
- `rework.questions` preserves complete reviewed/reworked records and rationale; `rework.before_rendered` preserves previous source-fingerprinted affected geometry and bank/group totals, sourced from the reviewed commit’s durable evidence.
- Prior Technical Review evidence applies to its reviewed head only. Human Content Review remains **CHANGES REQUIRED / BLOCKED until exact new stored wording is re-reviewed**; Engineering does not mark that finding resolved. Existing PR #73 remains unmerged.

| Rework metric | Reviewed a06a5b6 | New source |
|---|---:|---:|
| Unique-longest / materially-longer correct, whole bank | 8 / 0 | 9 / 0 |
| A / B / C / D | 83 / 83 / 82 / 82 | unchanged |
| Exact / order-independent duplicates | 0 / 0 | unchanged |
| Whole-bank desktop tallest / shortest | 24.92% / 25.03% | unchanged |
| Whole-bank mobile tallest / shortest | 24.70% / 25.35% | unchanged |
| 38 canonical tallest / shortest, both viewports | 25% / 25% | unchanged |

Fresh rendered audit remeasures all 330 questions on the new source. Each affected question has desktop A/B/C/D lines **1/1/1/1**, heights **54.390625px ×4**, and mobile lines **2/2/2/2**, heights **82.78125px ×4**. No mechanical padding or new rendered cue. Raw lengths are Q-076 **23/24/22/25** and Q-086 **24/25/23/24**; character extrema alone do not trigger further rewriting.

Fresh checks: 330 schema/key/explanation/mindset checks, 34 numeric recomputations, 13 original + 3 rework negative controls, #18 persistence, inline JS syntax, full rendered evidence and 52-item Practice/Mock/Review QA at both viewports pass. No page/console errors or document horizontal overflow.

### Exact stored reworked wording (Engineering evidence)

**Q-076**

在一個製造自動化專案中，一位新成員學習意願高，但尚無法獨立完成設備設定與驗證。他目前使用隔離的測試設備，工作可拆成小段實作並逐段審查；時程有餘裕，沒有緊急生產事故或安全、法規風險。專案經理最適當的安排是？

- A. 由資深成員完成設定，新人觀察操作並記錄驗證步驟
- B. 提供設備操作教材，讓新人自學後以測驗確認理解程度
- C. 由導師帶領分段實作，依能力目標檢核並即時回饋
- D. 讓新人獨立完成測試，驗收時再依缺失清單說明改善方法

**Q-086**

你是政府數位服務的專案經理。一位新成員學習意願高，但尚未熟悉服務設定與驗證流程。他目前在使用模擬資料的測試環境工作，可分批練習並逐段審查；近期沒有迫近的交付期限、正式服務事故或安全、法規風險。專案經理最適當的安排是？

- A. 安排資深成員代做設定，新人跟隨觀察並整理操作筆記
- B. 以小段實作配合即時教練回饋，依階段能力目標確認進展
- C. 提供操作文件讓新人自學，每週以書面測驗追蹤成果
- D. 交由新人自行完成練習，待整批作業驗收後給改善建議

## Content remediation and semantic checks

Each row in `remediation.questions` contains the complete before/after record, changed fields, original topic/mindset, revised explanation and Engineering rationale. All 38 explanations now state the correct answer letter and explain why the alternatives are less suitable. Engineering checked the correct action against the retained learning objective and each new distractor; this is not independent content acceptance.

| IDs | Preserved learning objective / remediation |
|---|---|
| 73,83,93,103 | Conflict resolution: compare facts, assumptions, constraints and verification criteria. Replace rank/instant escalation/removal cues with plausible authority, vote, compromise and delayed-integration alternatives; clarify why facilitation comes first. |
| 74,94 | Psychological safety: clarify fear of negative judgment/blame; compare leadership response with reporting, anonymity and turn-taking mechanisms. |
| 75,95 | Servant leadership: remove recurring cross-department approval impediments; contrast a sustainable process with temporary delegation, capacity and scope responses. |
| 76,86,96,106 | Coaching/mentoring: retain motivated novice capability development; compare specific practice/feedback with substitution, self-study, generic training and inspection. |
| 77,97 | Virtual teams: combine asynchronous confirmation, language clarity and workable overlap; contrast headquarters-centric schedules, relay and single-channel approaches. |
| 78,88,98,108 | Emotional intelligence: clarify that there is no emergency/disruption requiring immediate intervention; distinguish listening/self-management from defense, deferral and authority. |
| 79,89,99,109 | Resource negotiation: use impact and alternatives before commitment enforcement, escalation or unilateral replanning. |
| 82,92,102,112 | Performance feedback: diagnose privately with concrete examples and follow-up before public comparison, reassignment or deadline adjustment. |
| 100 | Self-management: pull work by goal/capacity and authority boundaries versus replacing the dispatcher or imposing quotas. |
| 101 | Team charter: participatory agreement on response/meeting/decision norms versus imported, departmental or PM-announced rules. |
| 159,173 | Requirements: active iteration goal remains valid; PO orders the product backlog and discusses delivery rather than unilateral replacement, delayed intake or cancellation. Scope can be renegotiated without endangering the goal. |
| 160,174 | Root cause: identify formation mechanism, improve process and verify prevention versus detection, repair or monitoring alone. |
| 161 | Definition of Done: testing is a completion threshold; compare estimates, extra testing time and approval as alternative mechanisms. |
| 163 | Integration: manage interfaces, dependencies and integration checkpoints versus local schedule/utilization improvements. |
| 165 | Kanban WIP: limit work and relieve the bottleneck; replace the implausible deleted-Done-column distractor with a batch-size intervention that still pushes work. |
| 166 | Rolling wave: near-term detail and evolving high-level distant plan versus premature detail, waiting for certainty or ignoring the horizon. |
| 167 | Contract risk: compare four priced contract structures; replace oral agreement with cost-plus-incentive, and explain fixed-price scope-change limits. |
| 172 | Change control: document/analyze/authorize before implementing or updating baselines; use plausible timing/governance alternatives. |

For the Scrum-related checks (75,95,100,159,161,173), Engineering consulted the [official Scrum Guide](https://scrumguides.org/scrum-guide.html): self-management, impediment removal, backlog ordering, a still-valid Sprint Goal, scope negotiation and the Definition of Done. These support the retained concepts; the bank remains PMP practice and is not asserted to be official exam content. No automated padding or length-equalizing mutation was used.

## Raw character metrics — separate from geometry

Length = non-whitespace source characters. Materially longer = ≥1.25× median distractor length and ≥8 additional characters. Tied-longest includes all-equal items.

| Bank-wide metric | #8 published baseline | Before remediation | Final |
|---|---:|---:|---:|
| Questions | 330 | 330 | 330 |
| Unique-longest correct | 286 | 42 | 9 |
| Materially-longer correct | 271 | 36 | 0 |
| Tied-longest correct | — | 90 | 106 |
| Correct at maximum | — | 132 | 115 |
| All equal raw lengths | — | 47 | 47 |
| Unique-shortest correct | — | 85 | 90 |
| Longest same-key run | — | 4 | 4 |
| A / B / C / D | 29 / 281 / 16 / 4 | 83 / 83 / 82 / 82 | 83 / 83 / 82 / 82 |
| Exact duplicate groups | 38 | 0 | 0 |

Canonical unique-longest correct: **37/38 → 4/38**; materially longer: **36/38 → 0/38**. All three duplicate definitions return zero groups: exact ordered stem/options/key, normalized stem/options without key, and option-order-independent normalized stem/options/correct text. No global period 1–165 or 12-ID window of period 1–4 is found.

| Raw guessing rule (uniform within ties) | Before longest / shortest | Final longest / shortest |
|---|---:|---:|
| 330 bank-wide | 21.6% / 40.8% | 13.7% / 43.3% |
| 38 canonicals | 98.2% / 0.0% | 29.4% / 21.1% |
| Other 292 | 11.7% / 46.1% | 11.7% / 46.1% |

The raw shortest rule remains elevated (**43.26% bank-wide; 46.15% outside canonicals**). It is explicitly retained as a source-length signal. The full rendered evidence below does not demonstrate a bank-wide height/line shortcut, so this is not authorization to rewrite the other 292. Character counting, text-width estimation, or a different browser/font might require separate review; this handoff does not claim every conceivable strategy is neutral.

## Pre-answer rendered baseline and final audit

Actual native Practice UI, isolated Edge contexts, fonts ready, favorite fixture imported through the existing UI. Each question is measured **before selecting an answer**. DOM stem is exactly the stored stem; option DOM text is exactly letter label + stored option. DOM Range line rectangles and button border-box heights are recorded for all four options. Navigation and answer selection occur only after that measurement. Neither answer feedback labels nor an artificial option layout are measured.

- Both phases: 330 questions × 4 options × 2 viewports = **2,640 verbatim option checks** each; 5,280 total.
- `rendered_audit.before/after.views[].rows` stores every question ID/key/stem and all four text/line/height/width measurements. Uniform CSS is retained once per view; summary IDs/classifications remain in `groups`.
- Height tolerance: 0.01px. Equal-height, unique-tallest, partial-tie and nonmatching-key controls pass. Guessing ties use 1/k credit; all-four-equal earns 0.25, not an informative cue.
- No page/console errors or document horizontal overflow in any of the 1,320 measured question screens.
- Height and line-count rule summaries coincide at both viewports in both phases.

| Viewport / scope | Before tallest / shortest expected hits | Final tallest / shortest expected hits | Final rates |
|---|---:|---:|---:|
| 1280×900 / 330 bank-wide | 82.250 / 82.583 | 82.250 / 82.583 | 24.92% / 25.03% |
| 1280×900 / 38 canonicals | 9.500 / 9.500 | 9.500 / 9.500 | 25.00% / 25.00% |
| 1280×900 / Other 292 | 72.750 / 73.083 | 72.750 / 73.083 | 24.91% / 25.03% |
| 375×812 / 330 bank-wide | 105.500 / 75.667 | 81.500 / 83.667 | 24.70% / 25.35% |
| 375×812 / 38 canonicals | 33.500 / 1.500 | 9.500 / 9.500 | 25.00% / 25.00% |
| 375×812 / Other 292 | 72.000 / 74.167 | 72.000 / 74.167 | 24.66% / 25.40% |

On mobile the canonical tallest rule drops from **88.16% to 25%**. Unique-tallest correct canonicals drop from **32 to 0**. All 38 final canonical option sets are four-way equal: desktop one line / 54.390625px; mobile two lines / 82.78125px. This comes from substantive comparable actions, with no CSS change.

### Other 292 disposition and retained localized geometry

The pre-edit other-292 tallest/shortest rates are 24.91%/25.03% desktop and 24.66%/25.40% mobile. They remain identical after remediation. There is no demonstrated systematic line/height shortcut in that slice and no additional blocking content defect was discovered during this task. **All 292 remain unchanged**, including explicitly Human-accepted Q-129.

Final desktop: 329/330 four-way equal height. Final mobile: 322/330 four-way equal height. The remaining localized sets are below; they do not form a uniform correct-choice rule.

| ID / key | Mobile A/B/C/D lines | Mobile A/B/C/D heights (px) | Disposition |
|---|---|---|---|
| Q-026 / A | 2 / 3 / 2 / 2 | 82.78125 / 109.17188 / 82.78125 / 82.78125 | Retain: localized wrapping; included in near-random aggregate evidence. |
| Q-040 / C | 2 / 2 / 1 / 2 | 82.78125 / 82.78125 / 56.39062 / 82.78125 | Retain: localized wrapping; included in near-random aggregate evidence. |
| Q-041 / B | 1 / 1 / 1 / 2 | 56.39062 / 56.39062 / 56.39062 / 82.78125 | Retain: localized wrapping; included in near-random aggregate evidence. |
| Q-129 / A | 3 / 2 / 2 / 2 | 109.17188 / 82.78125 / 82.78125 / 82.78125 | Prior explicit Human wording/localized-height acceptance retained; sole unique-tallest correct item. |
| Q-154 / B | 2 / 2 / 3 / 2 | 82.78125 / 82.78125 / 109.17188 / 82.78125 | Retain: localized wrapping; included in near-random aggregate evidence. |
| Q-155 / B | 2 / 2 / 2 / 3 | 82.78125 / 82.78125 / 82.78125 / 109.17188 | Retain: localized wrapping; included in near-random aggregate evidence. |
| Q-181 / C | 1 / 2 / 1 / 2 | 56.39062 / 82.78125 / 56.39062 / 82.78125 | Retain: localized wrapping; included in near-random aggregate evidence. |
| Q-195 / D | 1 / 1 / 2 / 1 | 56.39062 / 56.39062 / 82.78125 / 56.39062 | Retain: localized wrapping; included in near-random aggregate evidence. |

Q-026 also has desktop lines 1/2/1/1 and heights 54.390625/80.78125/54.390625/54.390625px; the taller option is a distractor.

## Wording audit

Occurrences below use unequal denominators: 330 correct options / 990 distractors. Per-option presence rates and affected IDs are retained in JSON. Canonical `共同` goes from **15/0 to 0/0**; canonical cooperative/absolute cue words were removed through specific actions and plausible competing interventions, not indiscriminate word replacement.

| Term | #8 correct / distractor | Before | Final |
|---|---:|---:|---:|
| 評估 | 19 / 0 | 5 / 11 | 6 / 14 |
| 分析 | 15 / 0 | 18 / 34 | 19 / 34 |
| 檢視 | 10 / 0 | 23 / 36 | 23 / 36 |
| 協助 | 13 / 0 | 7 / 17 | 5 / 17 |
| 共同 | 41 / 0 | 40 / 51 | 25 / 51 |
| 立即 | 0 / 41 | 3 / 20 | 3 / 7 |
| 直接 | 0 / 48 | 1 / 14 | 1 / 8 |
| 要求 | 1 / 74 | 14 / 89 | 14 / 76 |
| 升級 | 0 / 11 | 2 / 5 | 2 / 1 |

Additional screens: `只 0/4`, `所有 2/51`, `僅 0/3`, `口頭 0/7`, `刪除 0/2`, `一律 0/1`; 永遠/即可/一定/完全/不需/無須 are 0/0. Rare distractor-only terms and unequal presence rates remain review flags. These words can describe legitimate wrong actions; no blanket wording-neutrality or semantic-quality PASS is inferred. Raw counts alone do not authorize unrequested edits.

## Validation / QA

- Schema, stable ordered IDs, field order, metadata enums, four distinct nonempty options, valid integer answer indexes and nonempty explanation/mindset checks: **PASS for 330**. Explicit explanation-letter checks now cover **330/330** (before: 292).
- Approved scope guard: **PASS**. Compares baseline/current records and non-bank HTML; rejects outside-canonical edits or changes to protected fields and checks exact Human Q-129 wording.
- Numeric/status recomputation: **34/34 PASS**, including EVM, EMV, PERT, communication pairs and total float; exactly one matching option/key per checked item.
- Existing negative controls: **13/13 rejected**; rework guard controls **3/3 rejected** (unauthorized Q-096 edit, changed Q-076 key, changed Q-086 difficulty). Existing controls cover malformed schema/keys/text, exact/permuted duplicates and source mismatch.
- `node scripts/test-mock-persistence.cjs`: **PASS**, including save/reload/resume, legacy/corrupt/reordered-bank rejection, flags/position/deadline, overwrite/discard, submit/review, expired resume and no duplicate history/resurrection. Fresh execution/output is embedded in JSON.
- Inline JavaScript syntax: **PASS** via Node `vm.Script`; both audit scripts execute successfully.
- Fresh Edge **154.0.4258.53**, desktop/mobile Practice QA: **52 questions per viewport**, all 38 changed IDs plus prior risks/outliers and domain/approach/difficulty/calculation coverage. Native import, exact content, answer locks, score, explanations/mindsets, navigation, tabs and random practice pass. Desktop correct/instant = 52/52; mobile incorrect/manual = 0/52; retry and favorite toggle pass.
- Mock/Review on both viewports: native random 180-question selection, one correct + one incorrect scoped answer, flag, reload/resume with identical question IDs/answers/position/deadline/flags, native submit = 1/180, locked correct/incorrect review states: **PASS**. Sampled IDs/dialog evidence is embedded in JSON.
- No page/console errors or document horizontal overflow in fresh Practice/Mock/Review QA. Desktop/mobile Q-076 and Q-086 screenshots visually inspected: readable text, feedback, full explanations and navigation controls.
- Final scoped diff reviewed; `git diff --check`: **PASS**. Engineering commit and remote-sync state are supplied in the Issue handoff after push.

## Reproduce

Use provided Python/Node and external Playwright/Edge; no application dependency was added. Set `NODE_PATH` to the available Playwright runtime when required. Export `4e192e9207a46f5cfff1be4bdeecb6296b1de21d:index.html` with UTF-8 intact as `<baseline.html>` before replaying the baseline audit.

```text
node scripts/audit-option-rendering.cjs --all --html <baseline.html> --output <before-dir>
node scripts/audit-option-rendering.cjs --all --output <after-dir>
node scripts/qa-duplicate-cleanup.cjs <qa-dir> --ids=17,29,59,70,73,74,75,76,77,78,79,82,83,86,88,89,92,93,94,95,96,97,98,99,100,101,102,103,106,108,109,112,129,130,137,150,159,160,161,163,165,166,167,172,173,174,217,234,257,268,299,301
python -X utf8 scripts/audit-question-bank-final.py --working --rework-ref a06a5b624f9ff3cfabd1bd88f9d97e979bf78004 --render-before <before-dir>/report.json --render-after <after-dir>/report.json --qa-json <qa-dir>/report.json --output docs/QUESTION_FINAL_AUDIT.json
python -X utf8 scripts/audit-question-bank-final.py --working --rework-ref a06a5b624f9ff3cfabd1bd88f9d97e979bf78004 --negative-controls
git diff --check
```

The final auditor checks source fingerprints and exact stored text against both rendered reports, requires desktop/mobile coverage and all changed questions in fresh QA, checks edit scope, recomputes raw metrics and reruns persistence. The historical audit mode is retained for the unmodified released main source.

## Known limitations / review gate

Geometry evidence is specific to Edge, the installed fonts and these two viewport sizes; it is not physical-device/Safari or production smoke. Descriptive expected guessing credit is not a learner study or statistical proof. Raw shortest-length and residual wording signals remain documented; closely related retained learning objectives can still recur even with zero exact duplicates. Engineering semantic checks do not replace independent Content Review, psychometric assessment or Human acceptance.

Revised wording requires independent Technical / Content Review and Human content acceptance before Integration Approval. No PR/merge into dev or main, Product Verify, production release or #27/#8 closure is authorized by this Engineering handoff. Final acceptance/parent close gates remain owned by the Issue.
