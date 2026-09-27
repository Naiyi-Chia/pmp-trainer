# Question Remediation Batch 4 — Issue #24

## Baseline and scope

- Baseline: `221c7932108b97d0bb0fa919b51e81b4e9f1406b`; `origin/dev`, `origin/main` and the requested scoped branch matched at start.
- Branch: `question/issue-24-remediation-batch4`.
- Issue #24's preflight, implementation-start and handoff comments confirm Batch 3's exit gate and the default per-batch integration path.
- Preflight was rerun before question edits: 112 untreated non-duplicate candidates; 38 existing duplicate groups / 78 IDs; the approved set remains exactly the top 60 by correct / median-distractor length ratio. Next candidate: Q-044. No scope change was needed.
- Exactly 60 records changed: People 22 / Process 22 / Business Environment 16. Only `q`, `opts`, `ans`, `exp`, `mindset` changed. IDs, order, schema, domain, approach, topic, difficulty and type are preserved.
- Other 270 records and all non-bank application text remain unchanged. No application dependency or persistence-format change.

## Editorial method

Retain each tested concept; add facts that distinguish sequencing, authority, evidence and constraints. Distractors represent plausible actions or measures that are inferior in the stated situation. Each explanation identifies the stored answer and explains all three distractors. Answer placement is stored in the bank; no runtime shuffle was added.

Engineering self-review covered all 60 questions. This is not independent Technical/Content Review or Human content acceptance.

Examples requiring particular judgment:

- Q-016: an authorized product contact may support decisions; the Product Owner retains accountability.
- Q-039: distinguish prevention from appraisal using activity purpose, without the ambiguity of classifying a generic design review.
- Q-053: the stem explicitly states an adopted trend rule has triggered; control limits and specification limits are different.
- Q-105: use permitted staged review while retaining required controls.
- Q-145: after lower-level coordination fails because of authority limits, evidence-backed escalation is appropriate.
- Q-147: coordinate meaning and timing within stated data-sharing restrictions.
- Q-203: shared product completion criteria must meet organizational quality requirements; acceptance is not permission to omit required tests.
- Q-210: the contingency remains applicable, verified and authorized; monitor its cost and secondary effects rather than repeat approval without cause.
- Q-211: distinguish competing causes of declining completion through segmented behavioral evidence.
- Q-296: activity growth and delivery conformance do not establish net benefit; include the stated service costs.
- Q-302: reassess strategy while preserving existing obligations and governance authority.
- Q-324: public-service value is framed as reducing citizen burden, replacing the original incongruous market-share/profit wording while retaining strategic alignment as the learning objective.

Concept-level references (not question sources): [Scrum Guide 2020](https://scrumguides.org/scrum-guide.html) for self-management, product responsibility and completion standards; [PMI Benefits Realization Management Framework](https://www.pmi.org/learning/thought-leadership/series/benefits-realization/benefits-realization-management-framework) for benefit ownership and outcomes beyond delivery. These references support concept checks; each question's scenario and rationale is authored for this bank.

## Audit results

Length counts non-whitespace characters. Materially longer means correct length >= 1.25 times the median distractor AND at least 8 characters longer. Wording values count occurrences, not semantic validity. These match prior-batch heuristics.

| Metric | Before | After |
|---|---:|---:|
| Bank size | 330 | 330 |
| Scoped unique-longest correct | 60 | 0 |
| Scoped materially-longer correct | 57 | 0 |
| Scoped unique-shortest correct | 0 | 12 |
| A / B / C / D | 5 / 52 / 3 / 0 | 15 / 15 / 15 / 15 |
| Longest same-key run | 19 | 3 |
| Whole-bank unique-longest correct | 148 | 88 |
| Whole-bank materially-longer correct | 131 | 74 |

Post-change correct / median-distractor ratio: 0.85–1.05. No global repeated key pattern of period 1–30. Unique-shortest is recorded to detect a reversed length cue; it occurs in 12/60 items with small differences, not a reliable batch answer rule.

Sequence by ascending ID: `DDDCCDCAABCAACDAADCBACBBCCBCDDBDDCADACBCABCBABBBADACADBDBABD`.

| Term | Before correct / distractors | After correct / distractors |
|---|---:|---:|
| 評估 | 7 / 0 | 1 / 3 |
| 分析 | 1 / 0 | 6 / 8 |
| 檢視 | 1 / 0 | 4 / 5 |
| 協助 | 9 / 0 | 0 / 4 |
| 共同 | 8 / 0 | 4 / 4 |
| 立即 | 0 / 4 | 0 / 0 |
| 直接 | 0 / 1 | 0 / 1 |
| 要求 | 0 / 16 | 1 / 7 |
| 升級 | 0 / 1 | 0 / 0 |

There are 60 correct options and 180 distractors, so raw counts represent unequal populations. Counts cannot prove absence of a semantic cue. Self-review also checked option tone, number of actions and contextual plausibility. The value/outcome items were revised again so distractors use legitimate but insufficient delivery, adoption or technical measures instead of obvious absolute claims.

Machine-readable evidence, per-question lengths and browser results: [QUESTION_REMEDIATION_BATCH4_AUDIT.json](QUESTION_REMEDIATION_BATCH4_AUDIT.json).

## Per-question self-review

The following is engineering rationale; independent content review remains a separate gate. In-app explanations additionally explain every distractor.

| ID | Topic | Key | Lengths A/B/C/D | Best-answer rationale |
|---|---|:---:|---|---|
| Q-001 | 衝突管理 | D | 20/20/20/20 | 先建立共同事實與評估尺度，才能解決技術分歧。 |
| Q-002 | 領導風格 | D | 19/20/19/20 | 共同建立規範可處理形成階段的期待差異。 |
| Q-003 | 利害關係人溝通 | D | 20/19/19/20 | 需要先確認資訊的內容、管道及頻率是否適切。 |
| Q-004 | 僕人式領導 | C | 20/20/20/20 | 應跨越組織邊界改善已確認的瓶頸。 |
| Q-007 | 團隊績效 | C | 20/21/20/21 | 應先分析系統性原因再設計改善實驗。 |
| Q-008 | 衝突管理 | D | 20/21/21/20 | 資源協商需反映實際限制與共同目標。 |
| Q-009 | 虛擬團隊 | C | 20/20/20/21 | 明確紀錄、理解確認與有限同步可同時處理語言與時區問題。 |
| Q-010 | 授權 | A | 20/21/20/21 | 產品負責人管理價值與排序，開發團隊決定實作方式。 |
| Q-013 | 心理安全 | A | 20/21/19/20 | 公開嘲諷使揭露有代價，需要改善心理安全。 |
| Q-014 | 權責 | B | 19/19/19/19 | 基準變更核准屬於變更治理的決策權責。 |
| Q-016 | 產品負責人協作 | C | 23/22/22/23 | 可委派釐清工作並界定授權，但產品負責人仍承擔產品責任。 |
| Q-022 | 衝突 | A | 20/20/20/20 | 應以事實與系統改善取代人身歸因。 |
| Q-027 | 風險管理 | A | 18/19/20/19 | 已符合條件且授權完備，應執行並監控回應。 |
| Q-030 | 優先排序 | C | 20/19/19/19 | 排序需兼顧價值、可行性、風險及學習。 |
| Q-031 | 品質 | D | 19/20/20/20 | 重複缺陷需要找出形成機制並驗證流程改善。 |
| Q-033 | 完成定義 | A | 20/19/20/20 | Definition of Done 提供增量共同的品質完成標準。 |
| Q-038 | 整合管理 | A | 20/20/20/21 | 需跨工作流協調契約與交付順序，及早驗證整體。 |
| Q-039 | 品質成本 | D | 13/15/11/11 | 預防缺陷的訓練屬預防；檢驗符合性屬評鑑。 |
| Q-042 | 溝通 | C | 20/20/20/21 | 應以收件者用途設計資訊，同時維持共同資料來源。 |
| Q-047 | 回饋 | B | 21/21/21/20 | 短回饋循環能直接驗證實際使用情境與需求假設。 |
| Q-053 | 品質控制 | A | 19/20/21/19 | 界限內的非隨機訊號也可能顯示特殊原因，需調查。 |
| Q-057 | 商業價值 | C | 20/20/20/20 | 新證據應用於重新排序，並考慮依賴。 |
| Q-058 | 組織變革 | B | 21/20/20/21 | 需要針對已知的角色與能力落差進行變革管理。 |
| Q-068 | 效益實現 | B | 21/20/21/21 | 明確量測、責任與追蹤安排才能跨越專案生命週期管理效益。 |
| Q-085 | 僕人式領導 | C | 21/20/20/20 | 跨部門權責及服務約定能處理反覆阻塞。 |
| Q-087 | 虛擬團隊 | C | 20/20/20/19 | 共享紀錄與確認能建立可信來源，並兼顧時區限制。 |
| Q-105 | 僕人式領導 | B | 22/21/21/21 | 在治理允許範圍改善流動，能移除瓶頸而不犧牲控制。 |
| Q-107 | 虛擬團隊 | C | 20/20/20/20 | 需同時處理語意一致性與可持續參與。 |
| Q-115 | 僕人式領導 | D | 20/19/21/19 | 需促成跨部門權責與流程共識，消除反覆轉送。 |
| Q-117 | 虛擬團隊 | D | 21/20/21/18 | 範例與確認直接處理語意模糊且符合時區條件。 |
| Q-125 | 僕人式領導 | B | 21/21/21/21 | 先定位瓶頸，才能選擇有效且相稱的移除措施。 |
| Q-127 | 虛擬團隊 | D | 21/20/21/20 | 清楚責任與可行的確認節奏能避免跨時區問題滯留。 |
| Q-145 | 僕人式領導 | D | 21/21/22/21 | 已確認障礙超出窗口權限，應帶著證據與方案適當升級。 |
| Q-147 | 虛擬團隊 | C | 21/21/21/21 | 共同語意、允許的摘要與澄清管道兼顧限制與理解。 |
| Q-168 | 風險回應 | A | 22/23/22/22 | 已具有效且授權的回應，應執行並監控衍生影響。 |
| Q-175 | Definition of Done | D | 19/19/19/19 | DoD 統一何時可宣稱增量完成。 |
| Q-177 | 整合管理 | A | 20/21/20/22 | 跨組介面與整合節點直接對應已知失敗原因。 |
| Q-182 | 風險回應 | C | 21/21/19/20 | 有效且已核准的應變應先落實，並追蹤結果。 |
| Q-189 | Definition of Done | B | 21/20/21/21 | 共同 DoD 可使必要的整合品質與責任透明。 |
| Q-191 | 整合管理 | C | 21/21/21/20 | 需協調相依服務的版本及時序並驗證相容性。 |
| Q-196 | 風險回應 | A | 20/20/20/20 | 條件與授權仍有效，應執行並監控應變。 |
| Q-203 | Definition of Done | B | 22/20/21/21 | 同一產品的團隊應遵守共同 DoD，且不能低於組織標準。 |
| Q-205 | 整合管理 | C | 23/23/22/22 | 需建立跨商契約與版本協調並提早驗證。 |
| Q-210 | 風險回應 | B | 22/20/23/21 | 觸發、可行性及授權皆具備，應執行並監控取捨。 |
| Q-211 | 價值交付 | A | 21/21/22/22 | 需以分群行為與回饋辨識原因，驗證成果假設。 |
| Q-224 | 風險回應 | B | 22/20/21/22 | 已有可執行回應，應落實並追蹤結果及風險。 |
| Q-225 | 價值交付 | B | 21/21/21/21 | 先理解實際使用障礙，才能選擇能改善成果的工作。 |
| Q-263 | 價值與成果 | B | 20/18/18/19 | 應以原訂服務成果判斷投資效益，交付完成並不保證等候時間改善。 |
| Q-269 | 策略對齊 | A | 22/22/22/21 | 需先分析策略對目標及效益的影響，再依治理調整。 |
| Q-274 | 價值與成果 | D | 20/20/21/20 | 應用實際營運成果檢視價值，不能只看交付限制。 |
| Q-280 | 策略對齊 | A | 22/22/22/22 | 應重新驗證價值與成功尺度，再提出有依據的調整。 |
| Q-285 | 價值與成果 | C | 20/21/20/21 | 應透明呈現交付與實際成果的不同狀態。 |
| Q-291 | 策略對齊 | A | 21/21/22/21 | 需分析策略與功能貢獻，再調整排序和指標。 |
| Q-296 | 價值與成果 | D | 22/23/22/21 | 原訂成果是淨收益，需納入相關服務成本。 |
| Q-302 | 策略對齊 | B | 21/21/21/21 | 需整合獲利、既有義務與治理權限，再提適當方案。 |
| Q-307 | 價值與成果 | D | 22/22/22/21 | 價值應連到客戶成果，採用障礙可協助解釋落差。 |
| Q-313 | 策略對齊 | B | 20/20/22/21 | 需重新驗證目標、成本與收益關係，讓指標對齊策略。 |
| Q-318 | 價值與成果 | A | 19/20/20/20 | 需要檢視實際交通成果，不能止於交付達標。 |
| Q-324 | 策略對齊 | B | 21/20/21/22 | 政策變化需要重新驗證公共價值、目標與衡量方式。 |
| Q-329 | 價值與成果 | D | 20/21/21/20 | 實際工作效率才是本案預期成果，技術交付達標並不保證它實現。 |

## Validation — 2026-09-27

- PASS: baseline preflight, exact 60-ID change scope, 330 unique IDs/order, schema/metadata, four unique options, valid answer indexes and non-empty text, correct explanation prefix and all four option labels, non-bank application equality, balanced/non-periodic keys and no new exact stem/options/key duplicate involving this batch.
- PASS: negative controls reject an out-of-scope Q-005 edit, answer-key mismatch, difficulty metadata change, and non-bank application edit. Mutations were in temporary files only.
- PASS: `node scripts/test-mock-persistence.cjs`: actual inline app save/reload/resume, old/corrupt/content-reordered rejection, flags/position/deadline, overwrite/discard, submit/review, expired resume and no duplicate history/resurrection.
- PASS: temporary extension of the same VM harness checks locked-answer attempts, results/retry without extra history writes, wrong-only retry excluding unanswered items, exactly one new attempt on retry answer, and retained manual-explanation preference. An initial test expectation incorrectly included unanswered questions in retry; correcting that harness expectation required no app change.
- PASS: `vm.Script` compiles the final inline JavaScript; `git diff --check`.

### Browser QA

Final bank tested with installed Microsoft Edge in Playwright headless mode on an isolated localhost origin. No app source modifications were used by the browser harness.

- Desktop 1280 x 900: all 60 scoped questions answered correctly; instant explanation, matching four options, stored key, full rationale and mindset, locked answers, no page horizontal overflow. Result 60/60, 100%.
- Mobile viewport 375 x 812: all 60 answered incorrectly; explanations hidden until requested, correct/wrong feedback, four locked options, no page horizontal overflow. Result 0/60, 0%; retry includes all 60 wrong answers with zero initially answered and manual preference retained; answering and favorite toggle pass.
- Both sizes: normal random practice startup/answer/previous/next, dashboard, official samples, Mindset, mock and return-to-practice tabs pass.
- Both sizes: a 180-question mock with Q-001/Q-203 at the first two positions; one correct/one wrong answer and a flag survive reload/resume with the same IDs, answer state, position and absolute deadline. Submission reports 1/180; review locks choices and shows matching correct/wrong explanations. Native confirm dialogs were handled through Playwright's dialog API.
- No captured page errors or console errors.
- Screenshot inspection: mobile Q-329 and desktop Q-203 mock review show readable wrapped options/explanations and accessible answer-state text; no clipped question content. Existing horizontal tab scrolling is unchanged.

### Test setup and limits

- A temporary browser harness first exercises ordinary random practice, then replaces the in-memory selected practice array with the exact scoped IDs. It also orders two scoped questions first in a normal 180-item mock. Rendering, scoring, persistence and review functions remain the actual application functions. This deterministic selection does not validate random coverage probabilities. The practice header retains its original setup count in these instrumented screenshots; actual question counter, scoring and results use the injected 60-item selection.
- The machine-readable artifact records the tested `index.html` SHA-256 and final browser assertions. Harnesses and screenshots were temporary QA artifacts, not application changes.
- Mobile coverage is a 375px desktop-browser viewport, not a physical device or Safari test. No complete 180-answer timed sitting or 240-minute wall-clock run; expiration paths are covered by the existing VM regression.
- Content changes intentionally invalidate incompatible saved mocks through the existing #18 signature safeguards; historical progress storage is unchanged.
- Independent ChatGPT Technical/Content Review and Human Content Review remain pending. No Product Verify, integration, release or production verification is claimed.

## Reproduce scripted checks

```powershell
python -c "import pathlib,subprocess,tempfile; pathlib.Path(tempfile.gettempdir(),'pmp24-baseline.html').write_bytes(subprocess.check_output(['git','show','221c7932108b97d0bb0fa919b51e81b4e9f1406b:index.html']))"
python -X utf8 scripts/audit-remediation-batch4.py --baseline "$env:TEMP\pmp24-baseline.html" --preflight
python -X utf8 scripts/audit-remediation-batch4.py --baseline "$env:TEMP\pmp24-baseline.html"
node scripts/test-mock-persistence.cjs
node -e "const fs=require('fs'),vm=require('vm');new vm.Script(fs.readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1]);console.log('JS syntax PASS')"
git diff --check
```
