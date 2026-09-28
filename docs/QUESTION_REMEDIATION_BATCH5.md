# Question Remediation Batch 5 — Issue #25

## Baseline and scope

- Baseline: `f7170e9e9e2dca58f286fffe634622a99f416006` (`main == dev` at start).
- Scoped branch: `question/issue-25-remediation-batch5`.
- Issue #25 confirms Batch 4's completed exit gate and authorizes the default per-batch path. Preflight was rerun before question edits: 200 previously remediated IDs, 38 duplicate groups / 78 IDs, and exactly 52 remaining untreated non-duplicate questions matching #25. No scope update was needed.
- All 52 items are Process questions. Only `q`, `opts`, `ans`, `exp`, `mindset` may change; record IDs/order/schema, metadata and all non-bank application code are checked against baseline.
- Duplicate cleanup, UI/navigation, storage, scoring and dependencies are outside scope.

## Editorial and calculation review

The aim is to preserve each learning objective while replacing answer-position patterns, format cues and implausible distractors with contextual reasoning or identifiable calculation mistakes. Every explanation states the stored correct letter and discusses the other three choices. Numeric options use consistent units and precision within each question. Correct positions are assigned in the bank, with no runtime shuffling change.

Two original content defects are repaired within the listed scope:

- Q-234: EV equals PV, so progress conforms to plan. The original answer choices omitted that state despite the explanation acknowledging it.
- Q-257–262: total float is `LS − ES = LF − EF`, not `LS − EF`. The revised items define elapsed-day timepoints, include internally consistent early/late start/finish values and retain the easy float-calculation objective. Answer values and explanations change accordingly.

The scoped audit recomputes 34 numeric items from their actual stems, checks exactly one matching option and verifies the stored key. It covers EVM status/indices/variances, EMV loss magnitude, weighted PERT, unordered communication pairs and total float. It does not automatically establish explanation semantics or best-answer uniqueness in qualitative scenarios; those receive engineering content review and still require independent review and Human acceptance.

## Audit results

Length counts non-whitespace characters. Materially longer means the correct option is at least 1.25 times the median distractor AND at least 8 characters longer, matching earlier batches. Numeric length differences can reflect ordinary digit counts; no artificial zero-padding was introduced.

| Metric | Before | After |
|---|---:|---:|
| Bank records | 330 | 330 |
| Changed scoped records | — | 52 |
| Unchanged out-of-scope records | — | 278 |
| Unique-longest correct | 10 | 0 |
| Materially-longer correct | 0 | 0 |
| Unique-shortest correct | 2 | 5 |
| Longest same-letter run | 19 | 3 |
| Correct positions A / B / C / D | 21 / 21 / 6 / 4 | 13 / 13 / 13 / 13 |
| Whole-bank unique-longest correct | 88 | 78 |
| Whole-bank materially-longer correct | 74 | 74 |

Key sequence by ascending ID: `ABCBBDADDDACCBADACCDDCBBBDADCBCBADCABCDACAADBCBABCDA`. No global repeated period of 1–26. Correct / median-distractor length ratio ranges from 0.83 to 1.33; extreme ratios are not sufficient to establish a cue for short numeric options. Per-item lengths and ranks are in the machine-readable audit.

For the 25 scalar numeric items, the correct value occupies all four ascending ranks. Counts by rank 1/2/3/4: 5/9/8/3. EMV, PERT, communication-channel and float distractors were checked for repeated rank shortcuts; each family now spans more than one rank. Distractors model wrong denominators, inverted ratios, extra probability weighting, wrong PERT weighting, participant-count errors, and mixing early/late timepoints.

### Wording observations

| Term | Before correct / distractors | After correct / distractors |
|---|---:|---:|
| 評估 | 0 / 0 | 0 / 0 |
| 分析 | 0 / 0 | 0 / 0 |
| 檢視 | 0 / 0 | 1 / 1 |
| 協助 | 0 / 0 | 0 / 0 |
| 共同 | 0 / 0 | 1 / 0 |
| 立即 | 0 / 0 | 0 / 0 |
| 直接 | 0 / 0 | 0 / 0 |
| 要求 | 0 / 0 | 0 / 3 |
| 升級 | 0 / 0 | 0 / 1 |
| 只 | 0 / 6 | 0 / 0 |
| 所有 | 0 / 10 | 0 / 2 |
| 永遠 | 0 / 1 | 0 / 0 |
| 僅 | 0 / 0 | 0 / 0 |
| 即可 | 0 / 1 | 0 / 0 |
| 口頭 | 0 / 4 | 0 / 1 |
| 刪除 | 0 / 4 | 0 / 0 |

Counts are occurrences across 52 correct options versus 156 distractors, not equal-sized groups or a semantic pass criterion. Numeric items naturally contain little of this vocabulary. Engineering review also considered tone, action count, condition relevance and distractor plausibility. No automated count proves unique best-answer semantics.

## Per-question engineering self-review

This table records the retained concept and correct rationale. Every in-app explanation additionally addresses each distractor. Independent ChatGPT Technical/Content Review and Human Content Review remain pending.

| ID | Topic | Key | Lengths A/B/C/D | Rationale |
|---|---|:---:|---|---|
| Q-028 | 時程 | A | 10/10/10/11 | 零總浮時的關鍵活動延遲會沿路徑傳遞，使完工延後 5 天。 |
| Q-029 | EVM | B | 13/13/13/13 | EV 小於 PV，進度落後；EV 小於 AC，已完成工作的成本超支。SPI=0.80，CPI 約 0.89。 |
| Q-032 | 風險 | C | 12/10/10/10 | 損失期望金額=20%×NT$500,000=NT$100,000。若以收益為正、損失為負，帶符號的 EMV 為 −NT$100,000。 |
| Q-036 | 採購 | B | 17/16/17/16 | 固定總價通常讓賣方承擔約定範疇內的成本超支風險。 |
| Q-041 | 問題管理 | B | 17/16/17/17 | 已發生且需解決的事件應納入問題紀錄表，並保留與原風險的關聯。 |
| Q-043 | 進度壓縮 | D | 15/16/15/15 | Crashing 以增加資源及成本換取關鍵活動工期縮短，符合題目條件。 |
| Q-044 | Kanban | A | 19/20/21/21 | 控制 WIP 並分析等待可讓團隊先完成工作、定位流動障礙。 |
| Q-046 | 資源最佳化 | D | 17/17/17/16 | Resource leveling 以資源限制為優先，可改變關鍵路徑或完工日。 |
| Q-048 | 風險應對 | D | 17/17/17/16 | Transfer 是把約定責任或財務衝擊交給第三方；保險仍有承保邊界。 |
| Q-164 | 利害關係人溝通 | D | 20/20/21/21 | 資訊應配合對象的決策用途，同時保留共同資料來源。 |
| Q-178 | 利害關係人溝通 | A | 20/21/20/20 | 依用途與時區條件分流，能支持決策與及時交接。 |
| Q-179 | Kanban WIP | C | 21/22/21/21 | 先控制 WIP 並協作清除已知瓶頸，能改善端到端流動。 |
| Q-181 | 採購合約 | C | 17/18/17/18 | 範疇與估價條件清楚時，固定總價符合確定價款及風險分配需求。 |
| Q-192 | 利害關係人溝通 | B | 21/21/21/20 | 需同時調整內容粒度與頻率，讓同一資料支持不同用途。 |
| Q-193 | Kanban WIP | A | 22/22/22/22 | 受阻工作仍是未完成的投入，需透明呈現並以明確政策控制。 |
| Q-195 | 採購合約 | D | 16/17/18/16 | 固定總價使賣方承擔約定範疇內估算不足的主要成本風險。 |
| Q-206 | 利害關係人溝通 | A | 20/21/21/20 | 日常資訊可依需求分層，例外事件則遵守已定義的升級時效。 |
| Q-207 | Kanban WIP | C | 22/23/21/22 | 依透明例外政策取捨，可以兼顧急迫性、真實容量與流動。 |
| Q-209 | 採購合約 | C | 22/21/21/22 | 固定總價符合明確範疇的風險分配；買方核准變更仍可能調整價款。 |
| Q-220 | 利害關係人溝通 | D | 22/22/22/22 | 需修正共同資料口徑，同時維持對象需要的資訊設計。 |
| Q-231 | EVM | D | 17/17/17/17 | SPI=EV/PV=80/100=0.80；CPI=EV/AC=80/90=0.89。因此是進度落後、成本超支。 |
| Q-232 | EVM | C | 13/13/13/13 | SV=EV−PV=120−100=+20；CV=EV−AC=120−110=+10。SV 正值表示進度超前，CV 正值表示成本節餘。 |
| Q-233 | EVM | B | 17/17/17/17 | SPI=EV/PV=90/100=0.90；CPI=EV/AC=90/80=1.13。因此是進度落後、成本節餘。 |
| Q-234 | EVM | B | 13/13/13/13 | SPI=150/150=1.00，進度符合計畫；CPI=150/180 約 0.83，成本超支。 |
| Q-235 | EVM | B | 17/17/17/17 | SPI=EV/PV=210/240=0.88；CPI=EV/AC=210/200=1.05。因此是進度落後、成本節餘。 |
| Q-236 | EVM | D | 13/13/13/13 | SV=EV−PV=300−250=+50；CV=EV−AC=300−320=-20。SV 正值表示進度超前，CV 負值表示成本超支。 |
| Q-237 | EVM | A | 17/17/17/17 | SPI=EV/PV=420/500=0.84；CPI=EV/AC=420/450=0.93。因此是進度落後、成本超支。 |
| Q-238 | EVM | D | 13/13/13/13 | SV=EV−PV=160−200=-40；CV=EV−AC=160−150=+10。SV 負值表示進度落後，CV 正值表示成本節餘。 |
| Q-239 | EMV | C | 10/12/10/10 | 損失期望金額=20%×NT$500,000=NT$100,000。若以收益為正、損失為負，帶符號的 EMV 為 −NT$100,000。 |
| Q-240 | EMV | B | 10/10/10/9 | 損失期望金額=35%×NT$800,000=NT$280,000。若以收益為正、損失為負，帶符號的 EMV 為 −NT$280,000。 |
| Q-241 | EMV | C | 9/12/10/12 | 損失期望金額=10%×NT$1,200,000=NT$120,000。若以收益為正、損失為負，帶符號的 EMV 為 −NT$120,000。 |
| Q-242 | EMV | B | 10/10/10/10 | 損失期望金額=60%×NT$300,000=NT$180,000。若以收益為正、損失為負，帶符號的 EMV 為 −NT$180,000。 |
| Q-243 | EMV | A | 10/9/9/10 | 損失期望金額=25%×NT$640,000=NT$160,000。若以收益為正、損失為負，帶符號的 EMV 為 −NT$160,000。 |
| Q-244 | EMV | D | 9/10/9/10 | 損失期望金額=40%×NT$450,000=NT$180,000。若以收益為正、損失為負，帶符號的 EMV 為 −NT$180,000。 |
| Q-245 | PERT | C | 4/4/4/4 | PERT 期望工期=(O+4M+P)/6=(4+4×7+16)/6=8.0 天。 |
| Q-246 | PERT | A | 4/4/5/4 | PERT 期望工期=(O+4M+P)/6=(3+4×6+15)/6=7.0 天。 |
| Q-247 | PERT | B | 4/4/4/4 | PERT 期望工期=(O+4M+P)/6=(2+4×5+8)/6=5.0 天。 |
| Q-248 | PERT | C | 4/5/5/4 | PERT 期望工期=(O+4M+P)/6=(6+4×9+18)/6=10.0 天。 |
| Q-249 | PERT | D | 4/5/4/4 | PERT 期望工期=(O+4M+P)/6=(5+4×8+17)/6=9.0 天。 |
| Q-250 | PERT | A | 4/4/4/4 | PERT 期望工期=(O+4M+P)/6=(1+4×4+13)/6=5.0 天。 |
| Q-251 | 溝通管道 | C | 3/2/3/3 | 每一組不同的兩人只計一次，n(n−1)/2=5×4/2=10 條。 |
| Q-252 | 溝通管道 | A | 3/3/3/3 | 每一組不同的兩人只計一次，n(n−1)/2=6×5/2=15 條。 |
| Q-253 | 溝通管道 | A | 3/3/3/2 | 每一組不同的兩人只計一次，n(n−1)/2=8×7/2=28 條。 |
| Q-254 | 溝通管道 | D | 3/3/4/3 | 每一組不同的兩人只計一次，n(n−1)/2=10×9/2=45 條。 |
| Q-255 | 溝通管道 | B | 3/3/3/3 | 每一組不同的兩人只計一次，n(n−1)/2=12×11/2=66 條。 |
| Q-256 | 溝通管道 | C | 4/3/4/3 | 每一組不同的兩人只計一次，n(n−1)/2=15×14/2=105 條。 |
| Q-257 | 浮時 | B | 2/2/2/3 | 總浮時=LS−ES=15−8=7 天，也等於 LF−EF=19−12=7 天。 |
| Q-258 | 浮時 | A | 2/2/2/2 | 總浮時=LS−ES=24−15=9 天，也等於 LF−EF=29−20=9 天。 |
| Q-259 | 浮時 | B | 2/2/2/2 | 總浮時=LS−ES=8−5=3 天，也等於 LF−EF=11−8=3 天。 |
| Q-260 | 浮時 | C | 3/2/3/3 | 總浮時=LS−ES=21−10=11 天，也等於 LF−EF=27−16=11 天。 |
| Q-261 | 浮時 | D | 2/3/2/2 | 總浮時=LS−ES=34−25=9 天，也等於 LF−EF=39−30=9 天。 |
| Q-262 | 浮時 | A | 2/2/2/3 | 總浮時=LS−ES=13−7=6 天，也等於 LF−EF=17−11=6 天。 |

### Concept references

Primary references were used to cross-check concepts, not to copy examination questions:

- [PMI EVM formulas](https://www.pmi.org/learning/library/practical-calculation-schedule-variance-7028): EV/PV and EV/AC compare schedule and cost performance; differences use EV minus the appropriate baseline.
- [PMI CPM calculations](https://www.pmi.org/learning/library/basics-cpm-scheduling-software-axon-8170): total float uses corresponding early and late start or finish values.
- [PMI estimating guidance](https://www.pmi.org/learning/library/leveraging-new-practice-standard-project-estimating-6222): distinguish the weighted PERT expectation from standard deviation.
- [PMI EMV analysis](https://www.pmi.org/learning/library/project-risk-management-success-tool-6078): expected impacts are probability-weighted; the revised stems explicitly ask for positive loss magnitude.
- [PMI contract risk allocation](https://www.pmi.org/learning/library/project-contracts-vendor-buyer-views-7254): fixed price differs from fixed fee and reimbursable actual cost. The scenarios explicitly limit the claim to agreed scope and preserve change procedures.
- [The Kanban Guide](https://kanbanguides.org/the-kanban-guide/): started but unfinished work is WIP; policies should make flow and actual load visible. Q-193 covers hidden blocked work, and Q-207 applies an explicit urgent-work exception rather than silently raising all limits.

Communication channels are the count of unordered pairs, derived directly as n(n−1)/2. Stems state that the project manager is already included. Resource and risk-response items retain their original learning objectives with clearer scenario constraints.

## Validation — 2026-09-28

- PASS: scoped preflight, exactly 52 changed IDs, unchanged other 278 records, IDs/order/schema/metadata and non-bank application text.
- PASS: four distinct options, valid answer indexes, non-empty text, correct explanation prefix and all A/B/C/D rationale labels; balanced keys, maximum run 3 and no global periodic sequence.
- PASS: 34 calculations independently recomputed from the actual final stems. Q-234 recognizes EV=PV; all six total-float items have consistent durations and matching `LS−ES` / `LF−EF` results. Numeric matching checks exactly one correct option, including decimal-equivalent values.
- PASS: seven negative controls reject an out-of-scope question change, answer-key/explanation mismatch, metadata change, corrupted float answer, incorrect EVM equality interpretation, numerically equivalent duplicate answer, and non-bank application change. Mutations were temporary fixtures only.
- PASS: `node scripts/test-mock-persistence.cjs` runs the actual inline application and covers save/reload/resume, old/corrupt/content-changed rejection, flags/position/deadline, overwrite/discard, submit/review, expired resume, and no duplicate history/resurrection.
- PASS: JavaScript compilation with `vm.Script`; `git diff --check`.
- PASS: final source SHA-256 matches the browser-tested source and the [machine-readable audit](QUESTION_REMEDIATION_BATCH5_AUDIT.json). That artifact contains before/after metrics, item-level measurements, calculation checks, negative controls and browser outcomes.

### Browser QA

Final source was served unchanged from a temporary localhost server and tested with installed Microsoft Edge 153.0.4234.48 via headless Playwright.

- Desktop 1280 × 900: all 52 scoped items answered correctly, four matching options, locked answers, instant explanations with matching correct letter, full explanation and mindset. Result 52/52, 100%.
- Mobile viewport 375 × 812: all 52 answered incorrectly; manual explanations remain hidden until requested, correct/wrong feedback and answer locking verified. Result 0/52, 0%; retry contains 52 items and zero initially answered, retains manual preference, and supports answering and favorite toggling.
- Both sizes: normal random practice starts, answers and navigates previous/next. Dashboard, official samples, Mindset, mock and practice tabs open normally.
- Both sizes: normal 180-item mock selection, two scoped answers and a flag; reload/resume preserves question IDs, answers, flag, current index and original absolute deadline. Submit gives 1/180; review locks answers and renders matching correct/wrong explanations. Native confirmation dialogs were accepted through the browser dialog API.
- Final mock samples: desktop Q-179 / Q-245; mobile Q-258 / Q-238.
- No captured JavaScript page errors or console errors; no page horizontal overflow across all scoped items and representative mock review.
- Final screenshots inspected: mobile Q-257 and desktop Q-234 show readable formulas, option wrapping, feedback and explanations without clipped question content. Existing horizontal tab scrolling is unchanged.

### Setup and limits

The exact 52-item practice set was created by importing a favorites-only history fixture through the application's existing import UI, then selecting favorites/all. The normal shuffle, selection, rendering and scoring functions were used. Mock questions also came from the normal selector; the harness chose two scoped IDs already in that exam using the question grid. No in-memory question-array replacement, altered application source or confirmation stub was needed.

Browser contexts were isolated from the learner's storage and production. Mobile coverage is viewport emulation, not a physical device or Safari test. No complete 180-answer timed sitting or 240-minute wall-clock run was performed; the existing VM regression covers expiration. Screenshots and harnesses were temporary QA files, while summarized results and exact-source fingerprint are committed in the audit artifact.

Content edits can invalidate saved mocks containing affected questions through the existing #18 signature safeguards; no progress-storage behavior was changed. Numeric computations and label checks do not automatically validate every explanatory sentence. Engineering self-review covered all 52 items; independent ChatGPT Technical/Content Review and Human Content Review remain pending. This handoff does not declare Product Verify, integration, release or Production Smoke.

## Reproduce scripted checks

```powershell
python -c "import pathlib,subprocess,tempfile; pathlib.Path(tempfile.gettempdir(),'pmp25-baseline.html').write_bytes(subprocess.check_output(['git','show','f7170e9e9e2dca58f286fffe634622a99f416006:index.html']))"
python -X utf8 scripts/audit-remediation-batch5.py --baseline "$env:TEMP\pmp25-baseline.html" --preflight
python -X utf8 scripts/audit-remediation-batch5.py --baseline "$env:TEMP\pmp25-baseline.html"
node scripts/test-mock-persistence.cjs
node -e "const fs=require('fs'),vm=require('vm');new vm.Script(fs.readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1]);console.log('JS syntax PASS')"
git diff --check
```
