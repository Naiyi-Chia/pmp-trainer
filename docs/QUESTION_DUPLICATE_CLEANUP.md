# Duplicate Cleanup — Issue #26

## Baseline and protected scope

- Baseline: `2136a54479091d95484487905b61bea3ac289f95`; latest `dev` and scoped branch HEAD at start.
- Branch: `question/issue-26-duplicate-cleanup`.
- Contract: [Issue #26](https://github.com/Naiyi-Chia/pmp-trainer/issues/26), [approved Human Product Decision](https://github.com/Naiyi-Chia/pmp-trainer/issues/26#issuecomment-5872888917), and [Engineering handoff](https://github.com/Naiyi-Chia/pmp-trainer/issues/26#issuecomment-5872900467). Distractor standards follow [#17](https://github.com/Naiyi-Chia/pmp-trainer/issues/17).
- Preflight independently reproduced 38 groups / 78 IDs: 36 pairs and 2 triples. Lowest-ID canonical retained in each group; the other 40 slots receive new questions.
- Result: 330 records, same IDs/order/schema. Exactly 68 records differ: 40 replacements plus 28 canonical option-order/key changes. The other 10 canonical records need no change. All 252 out-of-scope records are exactly equal to baseline.
- Canonical stem, option-text multiset, correct answer text, explanation, mindset and metadata are preserved. Canonical changes only move the existing correct option and update its stored key.
- Every replacement preserves its own original domain / approach / topic / difficulty / type. Q-118 and Q-119 remain Predictive even though their source canonicals are Hybrid.
- Replacement coverage remains People 30 / Process 10; Agile 12 / Hybrid 14 / Predictive 14; 中 35 / 難 5; all 情境題. Topic labels are also unchanged.
- Non-bank HTML/CSS/JavaScript is exactly equal after LF normalization. No UI, scoring, storage, runtime shuffle, dependencies, or unrelated question edits. Additional files are scoped audit/QA tools and reports. The browser tool uses an already installed external Playwright/Edge runtime.

## Explicit resolution of all 38 groups

Each row keeps the listed lowest-ID canonical and replaces every listed copy with the distinct decision shown. Both exact and option-order-independent duplicate checks now return zero groups across the entire bank. “Unchanged” means the canonical already has its assigned balanced key.

| Canonical | Canonical treatment | Replaced copies and new decisions |
|---|---|---|
| Q-073 | Option order/key only | Q-113: 調解後協議的履行情況; Q-153: 辨識個人誘因造成的團隊衝突 |
| Q-074 | Option order/key only | Q-154: 在約定護欄內失敗的實驗學習 |
| Q-075 | Option order/key only | Q-155: 保護團隊免於繞過排序的零碎需求 |
| Q-076 | Option order/key only | Q-116: 以提問支持熟練成員自主思考; Q-156: 依熟練證據逐步減少指導支援 |
| Q-077 | Option order/key only | Q-157: 混合會議中的同等參與機會 |
| Q-078 | Option order/key only | Q-118: 辨識並調節自己的情緒反應 |
| Q-079 | Option order/key only | Q-119: 透過不同優先偏好創造交換方案 |
| Q-082 | Option order/key only | Q-122: 以具體行為及影響提供回饋 |
| Q-083 | Unchanged | Q-123: 情緒升高時有期限的降溫安排 |
| Q-086 | Unchanged | Q-126: 將課堂技能轉移到真實工作 |
| Q-088 | Option order/key only | Q-128: 先確認情緒線索而非推斷意圖 |
| Q-089 | Option order/key only | Q-129: 有條件的整體讓步 |
| Q-092 | Option order/key only | Q-132: 及時強化有效的合作行為 |
| Q-093 | Unchanged | Q-133: 依明定程序處理不當言論申訴 |
| Q-094 | Option order/key only | Q-134: 對善意近失事件回報的回應 |
| Q-095 | Option order/key only | Q-135: 支持團隊建立可持續工作節奏 |
| Q-096 | Unchanged | Q-136: 把練習主導權交回學習者 |
| Q-097 | Unchanged | Q-137: 遠端新成員的融入與資訊取得 |
| Q-098 | Option order/key only | Q-138: 同理支持與資訊界線 |
| Q-099 | Unchanged | Q-139: 談判前建立內部授權與界線 |
| Q-100 | Option order/key only | Q-140: 自主管理仍共同對齊 Sprint Goal |
| Q-101 | Unchanged | Q-141: 使既有團隊協議成為可檢視的承諾 |
| Q-102 | Option order/key only | Q-142: 依改善證據調整回饋頻率 |
| Q-103 | Unchanged | Q-143: 限時事故處置中的決策權與後續回顧 |
| Q-106 | Option order/key only | Q-146: 指導關係中的評估角色與保密界線 |
| Q-108 | Option order/key only | Q-148: 同理回應但不做未授權保證 |
| Q-109 | Option order/key only | Q-149: 超出談判授權時的條件提案 |
| Q-112 | Option order/key only | Q-152: 跨主管評分標準校準 |
| Q-159 | Option order/key only | Q-215: 依使用者價值垂直切分待辦項目 |
| Q-160 | Unchanged | Q-216: 以驗證區分根因假設 |
| Q-161 | Option order/key only | Q-217: 未符合已知 DoD 的項目狀態 |
| Q-163 | Option order/key only | Q-219: 核准跨元件變更後的整合一致性 |
| Q-165 | Option order/key only | Q-221: 以工作項目年齡發現被平均值遮蔽的風險 |
| Q-166 | Option order/key only | Q-222: 規劃包進入近期時的漸進細化 |
| Q-167 | Option order/key only | Q-223: 依明確驗收條款處理不符規格的返工 |
| Q-172 | Option order/key only | Q-228: 變更遭否決後的執行與溝通 |
| Q-173 | Option order/key only | Q-229: 多方需求衝突時的待辦排序責任 |
| Q-174 | Unchanged | Q-230: 以可比較數據驗證根因改善成效 |

## Audit results

Length is the number of non-whitespace characters, matching previous batches. “Materially longer” requires both correct/median-distractor ≥ 1.25 and a difference ≥ 8 characters. Word counts count occurrences, with 3 times as many distractor options as correct options. Neither heuristic proves semantic correctness.

| Scope / metric | Before | After |
|---|---:|---:|
| Bank records | 330 | 330 |
| Exact duplicate groups / IDs | 38 / 78 | 0 / 0 |
| 40 replacements: unique-longest correct | 39 | 2 |
| 40 replacements: materially-longer correct | 38 | 0 |
| 40 replacements: unique-shortest correct | 0 | 14 |
| 40 replacements: longest same-key run | 32 | 3 |
| 40 replacements: A / B / C / D | 1 / 38 / 1 / 0 | 10 / 10 / 10 / 10 |
| 38 canonicals: unique-longest correct | 37 | 37 |
| 38 canonicals: materially-longer correct | 36 | 36 |
| 38 canonicals: unique-shortest correct | 0 | 0 |
| 38 canonicals: longest same-key run | 30 | 3 |
| 38 canonicals: A / B / C / D | 1 / 36 / 1 / 0 | 10 / 10 / 9 / 9 |
| 78 handled: unique-longest correct | 76 | 39 |
| 78 handled: materially-longer correct | 74 | 36 |
| 78 handled: unique-shortest correct | 0 | 14 |
| 78 handled: longest same-key run | 60 | 3 |
| 78 handled: A / B / C / D | 2 / 74 / 2 / 0 | 20 / 20 / 19 / 19 |
| Whole bank: unique-longest correct | 78 | 41 |
| Whole bank: materially-longer correct | 74 | 36 |
| Whole bank: unique-shortest correct | 71 | 85 |
| Whole bank: longest same-key run | 13 | 4 |
| Whole bank: A / B / C / D | 65 / 137 / 65 / 63 | 83 / 83 / 82 / 82 |

The untouched 252 records remain 63 / 63 / 63 / 63. The 78 handled IDs have no repeated global period and at most 3 identical consecutive keys in ascending-ID order; the whole-bank longest run is 4. Replacement keys are 10 per letter; canonical keys are 10 / 10 / 9 / 9. These are stored option orders, with no application change.

Handled key sequence by ascending ID: `ACCCACAABBDDABAABBDBDBCBADDCBCCCBDBDAADDABCADDBCCAACBDBBAACBCDACDDABADBDCBCCDA`.

Replacement correct/median-distractor length ratios range from 0.882 to 1.152. Two correct options are uniquely longest: Q-137 (33 vs median 32) and Q-217 (38 vs median 33, including English Product Backlog). Fourteen are uniquely shortest, so shortest is not a universal cue either. Options were reviewed for comparable detail and plausible actions; lengths are not forced to identical padding.

**Protected canonical limitation:** 37 of 38 canonical answers remain uniquely longest and 36 remain materially longer. Existing wording associations also remain, e.g. canonical `共同` occurs 15 / 0 in correct / distractor options. This is inherited content protected by the approved decision. The cleanup does not claim that every bank-wide length/wording risk is eliminated.

### Replacement wording audit

| Term | Before correct / distractors | After correct / distractors |
|---|---:|---:|
| 評估 | 0 / 0 | 2 / 2 |
| 分析 | 1 / 0 | 0 / 5 |
| 檢視 | 0 / 0 | 8 / 22 |
| 協助 | 2 / 0 | 3 / 8 |
| 共同 | 17 / 0 | 7 / 27 |
| 立即 | 0 / 15 | 1 / 2 |
| 直接 | 0 / 6 | 1 / 4 |
| 要求 | 0 / 14 | 3 / 7 |
| 升級 | 0 / 5 | 0 / 0 |
| 只 | 0 / 12 | 0 / 0 |
| 所有 | 0 / 7 | 1 / 3 |
| 永遠 | 0 / 0 | 0 / 0 |
| 僅 | 0 / 0 | 0 / 0 |
| 即可 | 0 / 0 | 0 / 0 |
| 口頭 | 0 / 1 | 0 / 2 |
| 刪除 | 0 / 1 | 0 / 0 |

Cooperative wording appears in credible but mistimed or misdirected distractors: reviewing a written charter without clarifying behavior, discussing only unit tests before a cross-component deployment, and collaborative voting instead of testing a causal hypothesis. Conversely, direct policy/contract enforcement is correct where the scenario explicitly provides authority (Q-133, Q-143, Q-223). This lets the object, timing, evidence and authority distinguish choices instead of a friendly or directive verb alone. Rare terms are reported without treating zero counts as a semantic guarantee.

## Engineering content self-review

All 40 replacements were checked against their canonical and against the new set for distinct decisions. Stems give the relevant constraint; each explanation names the stored correct letter and addresses the other three options. The five hard slots retain their difficulty label and add competing role, authority, emotional or evaluation considerations. Actual difficulty and distractor credibility still require independent content review.

The lexical screen compares normalized stems using SequenceMatcher (not an embedding or plagiarism detector). Similarity to the original canonical ranges from 0.059 to 0.250. Closest other current stem is at most 0.361 (Q-140 / Q-019); Q-140 concerns individually selected easy work undermining a shared goal, while Q-019 concerns dependency on manager assignment. Other inspected overlaps include Q-219 / Q-050 (cross-component deployment consistency versus communicating updated approved baselines). Shared concepts do not establish duplicate questions; the explicit decision differences below are the substantive evidence.

| Replacement | Canonical | New decision angle | Key | Why this is best under the stated facts |
|---|---|---|:---:|---|
| Q-113 | Q-073 | 調解後協議的履行情況 | B | 爭點已從方案選擇轉為協議履行，應查明障礙並明確追蹤修正。 |
| Q-116 | Q-076 | 以提問支持熟練成員自主思考 | C | 能力已足夠且目標是自主判斷，教練式提問能支持其思考與承擔。 |
| Q-118 | Q-078 | 辨識並調節自己的情緒反應 | C | 已察覺情緒干擾時，先自我調節再處理事實可降低衝動回應。 |
| Q-119 | Q-079 | 透過不同優先偏好創造交換方案 | C | 不同優先偏好提供交換空間，組合方案可同時照顧早期價值與最終日期。 |
| Q-122 | Q-082 | 以具體行為及影響提供回饋 | B | 具體行為與影響能讓回饋可核對，也為雙向理解留下空間。 |
| Q-123 | Q-083 | 情緒升高時有期限的降溫安排 | D | 有期限的降溫保留當日解決機會，也恢復有效對話的條件。 |
| Q-126 | Q-086 | 將課堂技能轉移到真實工作 | B | 缺口在工作情境中的應用，觀察、練習與回饋能直接檢驗技能轉移。 |
| Q-128 | Q-088 | 先確認情緒線索而非推斷意圖 | D | 情緒線索不等於意圖證據，直接且尊重地確認能減少誤讀。 |
| Q-129 | Q-089 | 有條件的整體讓步 | A | 明確的條件連結可避免一項被視為無條件承諾，另一項仍未成立。 |
| Q-132 | Q-092 | 及時強化有效的合作行為 | A | 及時連結具體行為與成果，能讓成員理解值得重複的是哪種合作。 |
| Q-133 | Q-093 | 依明定程序處理不當言論申訴 | D | 題幹已有明定的轉交義務，應遵循程序並適當保護資訊。 |
| Q-134 | Q-094 | 對善意近失事件回報的回應 | D | 善意回報與改善責任可並存，檢查系統缺口能把近失轉為學習。 |
| Q-135 | Q-095 | 支持團隊建立可持續工作節奏 | A | 持續超載已影響品質與健康節奏，應以真實容量調整工作承諾。 |
| Q-136 | Q-096 | 把練習主導權交回學習者 | B | 瓶頸是缺少實作與判斷機會，應把操作主導權交回學習者並提供支援。 |
| Q-137 | Q-097 | 遠端新成員的融入與資訊取得 | C | 問題涉及社會連結與決策資訊取得，夥伴、透明紀錄及窗口可直接補足。 |
| Q-138 | Q-098 | 同理支持與資訊界線 | A | 同理回應應兼顧本人參與、可行支援與適當資訊界線。 |
| Q-139 | Q-099 | 談判前建立內部授權與界線 | D | 內部利益與授權先對齊，代表才能提出可履行且符合組織需要的交換。 |
| Q-140 | Q-100 | 自主管理仍共同對齊 Sprint Goal | D | 自主管理包含共同承擔目標與調整計畫，不等於各自最佳化簡單任務。 |
| Q-141 | Q-101 | 使既有團隊協議成為可檢視的承諾 | B | 章程需轉化為共同理解與實際行為，釐清標準及追蹤才能處理落差。 |
| Q-142 | Q-102 | 依改善證據調整回饋頻率 | C | 支持強度應隨實證調整；肯定進步並保留合理檢查點兼顧信任與持續性。 |
| Q-143 | Q-103 | 限時事故處置中的決策權與後續回顧 | C | 緊急情境已有明確授權與資料，應及時決策，同時保留異議與學習機會。 |
| Q-146 | Q-106 | 指導關係中的評估角色與保密界線 | A | 角色衝突正在阻礙坦誠學習，可利用可行的角色分離與明確資訊界線改善。 |
| Q-148 | Q-108 | 同理回應但不做未授權保證 | A | 同理與誠實可並行；承認影響並討論應變，不代表承諾不存在的確定性。 |
| Q-149 | Q-109 | 超出談判授權時的條件提案 | C | 時間允許核准，可清楚保留條件並循程序評估，避免把提案當成已成立承諾。 |
| Q-152 | Q-112 | 跨主管評分標準校準 | B | 已存在共同目標，先校準證據如何對應標準，才能避免彼此矛盾的回饋。 |
| Q-153 | Q-073 | 辨識個人誘因造成的團隊衝突 | D | 制度正在獎勵與合作相反的行為，需處理誘因才能改善反覆發生的衝突。 |
| Q-154 | Q-074 | 在約定護欄內失敗的實驗學習 | B | 護欄內的實驗用來驗證假設，承認有效學習能支持負責任的探索。 |
| Q-155 | Q-075 | 保護團隊免於繞過排序的零碎需求 | B | 透明入口與明確排序責任能處理打斷來源，幫助團隊維持專注。 |
| Q-156 | Q-076 | 依熟練證據逐步減少指導支援 | A | 能力已有實證，逐步減少支援並保留檢查點可建立信心與獨立性。 |
| Q-157 | Q-077 | 混合會議中的同等參與機會 | A | 障礙是即時參與不對等，共同工具與發言安排可直接補足。 |
| Q-215 | Q-159 | 依使用者價值垂直切分待辦項目 | A | 小範圍但端到端可用的能力可提供可觀察價值與真實回饋。 |
| Q-216 | Q-160 | 以驗證區分根因假設 | D | 存在混淆因素時，應收集能區分假設的證據，而非把相關當作因果。 |
| Q-217 | Q-161 | 未符合已知 DoD 的項目狀態 | B | 不符合 DoD 的工作不能算入完成增量；應透明保留未完成工作再規劃。 |
| Q-219 | Q-163 | 核准跨元件變更後的整合一致性 | D | 核准後仍需整合版本、時序、文件與驗證，確保跨元件變更一致。 |
| Q-221 | Q-165 | 以工作項目年齡發現被平均值遮蔽的風險 | C | 穩定完成量可能遮蔽個別老化項目，應主動檢視阻礙並管理流動風險。 |
| Q-222 | Q-166 | 規劃包進入近期時的漸進細化 | B | 滾動式規劃會隨近期資訊成熟展開細節，並維持與既有範圍的連結。 |
| Q-223 | Q-167 | 依明確驗收條款處理不符規格的返工 | C | 已有明確的不符合規格與自費修正條款，應先依合約及驗收證據處理。 |
| Q-228 | Q-172 | 變更遭否決後的執行與溝通 | C | 正式否決後應傳達決議並維持核准基準；有新資訊可循既定程序重新提出。 |
| Q-229 | Q-173 | 多方需求衝突時的待辦排序責任 | D | 產品負責人需聽取資訊並對排序負責，避免多套競爭的優先順序。 |
| Q-230 | Q-174 | 以可比較數據驗證根因改善成效 | A | 產量改變會影響件數，應用可比較的比率與趨勢驗證效果，而非只看總量。 |

### Concept references

These are concept checks for original scenarios, not copied examination questions or a claim of PMI endorsement.

- [Scrum Guide (2020)](https://scrumguides.org/scrum-guide.html): developer self-management, shared Sprint Goal, Product Owner ordering accountability, usable increments and unfinished work that fails Definition of Done (Q-140, Q-155, Q-215, Q-217, Q-229).
- [Kanban Guide (May 2025)](https://kanbanguides.org/the-kanban-guide/): work-item age and active management of flow alongside throughput (Q-221).
- [PMI: Agile Coach](https://www.pmi.org/disciplined-agile/agile-coach) and [PMI: Coaching with feedback](https://www.pmi.org/learning/library/coaching-feedback-helping-team-grow-5892): learning through questions and observation, feedback that reinforces or improves behavior (coaching/feedback replacements).
- Q-133, Q-143, Q-149 and Q-223 explicitly state the organization/contract authority needed to decide their cases; they do not presume a universal legal or contractual rule.

## Regression and browser QA

Tested LF-source SHA-256: `a713b637d8bfed3d65e332c3d0e44e6f215b8abf3cd1475a95b2c20e9258c31a`. Machine evidence: [audit](QUESTION_DUPLICATE_CLEANUP_AUDIT.json) and [QA](QUESTION_DUPLICATE_CLEANUP_QA.json).

- `python -X utf8 scripts/audit-duplicate-cleanup.py`: PASS. Checks original groups, 330 unique IDs/order, schema, all metadata, 252 untouched records, canonical option/correct-text preservation, rewritten fields, keys/explanation labels, zero exact/permutation-independent duplicates, new-stem uniqueness, length and key balance/patterns. Per-item lengths and similarity results are in the audit JSON.
- `python -X utf8 scripts/audit-duplicate-cleanup.py --negative-controls`: 14 / 14 intentional mutations rejected. Covers unauthorized question, canonical stem/option/correct-meaning changes, replacement metadata/key mismatch, missing schema/record, non-bank code, duplicate and reordered duplicate, unrewritten replacement, unbalanced keys with matching label, and an overlong correct option. Mutations are in memory only.
- `node scripts/test-mock-persistence.cjs`: PASS. Existing regression executes real inline application code, including save/reload/resume, legacy/corrupt/reordered-bank rejection, flags/position/deadline, overwrite/discard, submit/review, expired resume and no duplicate history/resurrection.
- JS syntax: inline script compiled with Node `vm.Script`; browser executed it without page or console errors.
- `node scripts/qa-duplicate-cleanup.cjs`: PASS with Edge 154.0.4258.37, headless Chromium engine, fresh isolated contexts at **1280×900** and **375×812**.
- All **78 handled IDs** on each viewport: rendered stem + all 4 options, correct-answer marker, explanation/mindset, answer lock, navigation and scoring verified. Desktop answered all correctly with instant explanation (78/78); mobile answered all incorrectly with manual reveal (0/78). Mobile retry resets answers and retains settings; favorite toggle works.
- Normal random practice, previous/next, all 5 tabs and page overflow checks passed. Native import UI loaded the scoped favorite fixture; no application variables or functions were replaced to force test results.
- Each viewport started a native random 180-question mock, answered two replacement questions, flagged one, reloaded/resumed, verified IDs/answers/flag/position/deadline, submitted through the native confirmation dialog (1/180), and checked correct/incorrect locked review states. Desktop samples Q-113/Q-142; mobile Q-134/Q-136.
- Generated full-page screenshots for Q-073/Q-113/Q-143/Q-217/Q-221 and mock review on both viewports. Visual inspection of desktop Q-143 and mobile Q-217 confirmed readable wrapping, feedback, full explanation/mindset and controls. The existing horizontally scrollable tab strip is unchanged; the page itself does not overflow.
- `git diff --check`: PASS before commit.

### Reproduce

Audit defaults to the pinned baseline via `git show`; `--baseline <utf8.html>` and `--current <utf8.html>` are available for independent comparison. Python uses only its standard library. Persistence regression and JS compilation use Node. Browser QA requires an externally available `playwright` module and installed Edge (`NODE_PATH` can point at the provided runtime); there is no package installation or application dependency change. Optional browser output directory is the second command argument. Screenshots and raw browser JSON are written there; the checked-in QA JSON records this run and the negative controls.

## Handoff limits

Engineering implementation and local QA are complete. Independent ChatGPT Technical/Content Review and Human content review of the new questions remain pending. This report does not record integration, Product Verify, release or issue closure.

Browser evidence covers desktop Chromium and a 375px Chromium viewport, not a physical iOS/Android device. Canonical content risks described above remain intentionally protected. Exact/lexical duplicate checks cannot prove all semantic distinctions automatically; the per-question decisions and explanations are supplied for content review.
