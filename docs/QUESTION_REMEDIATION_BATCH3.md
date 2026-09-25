# Question Remediation Batch 3 — Issue #23

## Baseline and scope

- Baseline: `4265866f0fa9e7a8b5caa237a54513cbeea91d25` (`dev` at implementation start).
- Previous batch #22 was completed; Issue #23 pre-implementation audit and explicit implementation-start comments confirm the start gate.
- Re-run before editing: 60/60 unique-longest and materially-longer correct options, keys A/B/C/D = 0/56/4/0. The approved candidate set remained applicable.
- Exactly 60 IDs; People 8 / Process 13 / Business Environment 39. All IDs, record fields, domain, approach, topic, type, difficulty and bank order preserved.
- Only `q`, `opts`, `ans`, `exp`, `mindset` changed. Other 270 records and all non-bank application text are unchanged.
- No UI, timer, scoring, feedback, dependency, localStorage, PMI sample or mock-compatibility code changes.

## Method and interpretation

Preserve each learning objective; supply decision-relevant facts where the original stem was underspecified. Replace implausible shortcuts with actions that can be reasonable in another context but are inferior here because of sequencing, authority, evidence, lifecycle boundaries or value. Explain all four options and connect the mindset to that decision.

Length = characters after removing whitespace. A correct option is unique-longest when longer than every distractor; materially-longer means at least 1.25 × the median distractor length AND at least 8 characters longer. Wording counts are occurrences, not a semantic correctness test. These are the same heuristics as preceding batches.

Balanced keys are assigned once in the question data; no runtime option shuffle or new answer representation was added. Maximum same-letter run is 3; no global repeated pattern of period 1–30.

## Audit results

| Metric | Before | After |
|---|---:|---:|
| Bank records | 330 | 330 |
| Scoped unique-longest | 60/60 | 0/60 |
| Scoped materially-longer | 60/60 | 0/60 |
| Scoped keys A / B / C / D | 0 / 56 / 4 / 0 | 15 / 15 / 15 / 15 |
| Whole-bank unique-longest | 208 | 148 |
| Whole-bank materially-longer | 191 | 131 |

Key sequence by ascending ID: `CCDCDACCDBDBCBBAAABDCCDABBADCADCADBBDACBDCAABBDDBBACDCBAADCA`.

### Wording observations

| Term | Before correct / distractors | After correct / distractors |
|---|---:|---:|
| 評估 | 10 / 0 | 1 / 1 |
| 分析 | 5 / 0 | 10 / 11 |
| 檢視 | 1 / 0 | 9 / 3 |
| 協助 | 0 / 0 | 0 / 4 |
| 共同 | 1 / 0 | 4 / 3 |
| 立即 | 0 / 7 | 0 / 0 |
| 直接 | 0 / 15 | 0 / 0 |
| 要求 | 1 / 8 | 5 / 26 |
| 升級 | 0 / 0 | 1 / 0 |

There are 60 correct options versus 180 distractors, so raw counts must not be treated as equal-sized samples. Some vocabulary remains concentrated (for example 檢視). Counts alone do not establish the absence of cues. Engineering self-review checked the action and scenario together; options involving analysis, cooperation, training or governance can still be suboptimal when aimed at the wrong problem or performed at the wrong time. Independent content review remains required.

## Per-question decision rationale

This is engineering self-review evidence, not an independent ChatGPT review or Human acceptance. The table records the retained concept and why the stored answer is best; each application explanation separately describes why the other three options are inferior.

| ID | Topic | Key | Option lengths A/B/C/D | Best-answer rationale |
|---|---|:---:|---|---|
| Q-005 | 團隊發展 | C | 21/20/21/20 | 先釐清期待並建立分享機制，能處理資訊隔閡而保留成員優勢。 |
| Q-006 | 資源管理 | C | 20/20/20/20 | 先掌握工作依賴、時程、成本與風險，才有協商或升級所需的依據。 |
| Q-012 | 教練與指導 | D | 20/21/20/20 | 配對、可達成目標與回饋能在控制交付風險下建立能力。 |
| Q-019 | 自組織團隊 | C | 19/21/20/21 | 自我管理是在共同目標下由團隊協調工作，而非等待外部分派。 |
| Q-034 | 範疇 | D | 21/20/21/20 | 以核准需求、追溯資料和驗收標準建立共同事實，才能區分缺陷與新需求。 |
| Q-035 | 估算 | A | 21/21/21/23 | 區間與假設使不確定性透明，限時探索可提供後續細化估算的證據。 |
| Q-037 | 風險 | C | 22/23/21/22 | 直接測試關鍵假設能及早取得技術可行性的證據。 |
| Q-040 | 價值交付 | C | 20/21/18/20 | 先了解使用者成果及障礙，才能判斷產品假設與優先順序是否正確。 |
| Q-050 | 基準 | D | 22/22/22/21 | 核准變更需要受控地反映在相關基準、文件與溝通中，讓執行依據一致。 |
| Q-051 | 技術債 | B | 23/21/23/22 | 透明化成本與風險，讓產品負責人與團隊協調必要改善及品質策略。 |
| Q-055 | 價值交付 | D | 21/22/21/20 | 交付效率與效益實現是不同面向；須確認價值成果及落差原因。 |
| Q-060 | 永續 | B | 21/20/23/22 | 應以生命週期價值、環境影響及策略共同判斷，而不是單一指標選擇。 |
| Q-062 | 治理 | C | 21/21/20/22 | 既有強制要求不能由無豁免權者略過，應使用制度允許的替代途徑。 |
| Q-064 | 策略對齊 | B | 23/21/21/22 | 先分析策略對目標、指標與優先順序的影響，才能提出有依據的治理建議。 |
| Q-065 | 外部環境 | B | 22/22/22/22 | 需先確認限制適用與供應暴露，才能依採購及治理流程選擇應變。 |
| Q-067 | 組織文化 | A | 22/22/22/21 | 瓶頸源於決策權配置，需要在治理邊界內授權及調整領導行為。 |
| Q-069 | 合規 | A | 20/22/22/22 | 敏捷偏好可運作軟體並不取消必要文件，應及早整合到交付流程。 |
| Q-072 | 策略終止 | A | 21/22/22/22 | 持續證據不支持假設時，應透過治理重新考慮投資，而不是延續沉沒成本。 |
| Q-084 | 心理安全 | B | 24/24/22/23 | 貶抑回應使發言有代價，領導者須改變互動行為以恢復信任。 |
| Q-114 | 心理安全 | D | 21/24/24/20 | 已存在管道仍沉默，顯示需要處理善意揭露的後果與責難文化。 |
| Q-124 | 心理安全 | C | 23/23/23/23 | 改變權威先定調的互動模式，並讓異議得到尊重回應，才能增加公開表達的安全感。 |
| Q-144 | 心理安全 | C | 23/21/21/23 | 心理安全需要保護善意揭露，同時保留合法治理責任；界線與實際回應都要清楚。 |
| Q-158 | 變更控制 | D | 21/21/21/20 | 受控基準的重大變更需有完整影響及適當核准，才可執行。 |
| Q-169 | 價值交付 | A | 21/21/21/22 | 現場證據可區分可用性、流程與價值問題，指導 backlog 的取捨。 |
| Q-183 | 價值交付 | B | 21/21/22/22 | 流失行為與回饋能檢驗假設，避免把更多功能當成低採用率的既定解方。 |
| Q-186 | 變更控制 | B | 19/19/20/20 | 付費意願不代表完整影響已被接受，仍須依正式程序決定範疇與時程。 |
| Q-197 | 價值交付 | A | 24/23/27/23 | 以實際決策情境取得成果證據，可以檢驗不同假設並指導排序。 |
| Q-200 | 變更控制 | D | 21/19/22/20 | 資金授權與範疇變更授權不同，需由具權責者依分析作決議。 |
| Q-214 | 變更控制 | C | 22/20/21/22 | 登錄之後需提供整合影響及方案，讓正式變更決策有足夠依據。 |
| Q-264 | 法規遵循 | A | 21/21/21/22 | 適用性已確認，下一步是把要求對應到產品與計畫，形成及時的治理輸入。 |
| Q-265 | 組織變革 | D | 21/22/22/21 | 已知疑慮在責任與流程，需要參與式釐清及採用準備，而非更多技術證明。 |
| Q-267 | 永續 | C | 23/23/21/24 | 需涵蓋採購、使用及退役階段，才能權衡永續與生命週期價值。 |
| Q-272 | 效益實現 | A | 20/22/21/22 | 明確的責任、量測與追蹤讓效益管理能跨越專案結束。 |
| Q-273 | 合規與敏捷 | D | 25/25/23/19 | 必要證據應隨交付產生且保持可追溯，不能以敏捷為由省略。 |
| Q-275 | 法規遵循 | B | 21/20/22/22 | 先取得可靠解讀並定位缺口，才能選擇符合期限的變更方案。 |
| Q-276 | 組織變革 | B | 23/22/22/23 | 抗拒來自責任交接不清，需要利害關係人參與流程及角色調整。 |
| Q-278 | 永續 | D | 22/21/21/22 | 同一服務基礎下比較全生命週期，才能看清成本、永續與風險的取捨。 |
| Q-283 | 效益實現 | A | 19/23/22/22 | 有承接意願還需明確的量測及處理責任，才能持續管理效益。 |
| Q-284 | 合規與敏捷 | C | 28/22/20/22 | 可精簡重複工作，但必須先確認既有證據涵蓋必要要求並及時補齊。 |
| Q-286 | 法規遵循 | B | 23/22/22/22 | 跨介面要求需要整合分析，才能指派責任及走風險、採購與變更程序。 |
| Q-287 | 組織變革 | D | 23/23/23/23 | 已知障礙是訓練可及性與支援不足，採用安排應配合真實工作條件。 |
| Q-289 | 永續 | C | 22/22/22/23 | 以負載情境納入長期成本與環境影響，才能反映需求不確定性下的價值。 |
| Q-294 | 效益實現 | A | 24/23/24/23 | 需明確承接成果量測與解讀責任，才能在結案後持續驗證效益。 |
| Q-295 | 合規與敏捷 | A | 21/23/23/23 | 必要文件是交付的一部分，可透過工具精簡作業而不是省略。 |
| Q-297 | 法規遵循 | B | 24/25/25/25 | 供應商聲明未涵蓋實際使用情境，須先確認適用與差距，再依治理決定調整。 |
| Q-298 | 組織變革 | B | 24/24/26/24 | 採用障礙同時涉及工作負擔與誘因，需要跨部門變革，而非僅提升操作能力。 |
| Q-300 | 永續 | D | 24/23/25/23 | 以可信假設呈現價值與不確定性，並讓有權者決定預算及取捨。 |
| Q-305 | 效益實現 | D | 23/24/22/23 | 需在交接時確認一致量測、責任及應對機制，才能追蹤不確定的實際效益。 |
| Q-306 | 合規與敏捷 | B | 24/22/24/24 | 可以利用等效證據減少浪費，但不能省略已確認仍必要的審核控制。 |
| Q-308 | 法規遵循 | B | 21/22/22/23 | 合規變動須轉成明確差距與影響，才能提出符合期限的治理方案。 |
| Q-309 | 組織變革 | A | 23/23/22/23 | 需要變革溝通、角色共識與準備，讓技術交付能真正被採用。 |
| Q-311 | 永續 | C | 25/24/24/21 | 在同樣滿足必要要求下，應用一致且合理假設比較長期價值與風險。 |
| Q-316 | 效益實現 | D | 21/22/21/20 | 營運交接需包含預期成果的責任及量測，才能持續驗證辦理時間改善。 |
| Q-317 | 合規與敏捷 | C | 24/24/23/24 | 需要的是符合要求且可追溯的證據，可重用工具資料並補足缺漏。 |
| Q-319 | 法規遵循 | B | 23/24/23/24 | 先具體分析缺口與交付方案，才能同時處理生效期限與臨床需求。 |
| Q-320 | 組織變革 | A | 22/23/23/23 | 需要先理解流程與採用疑慮，再選擇適當的變革管理措施。 |
| Q-322 | 永續 | A | 23/22/23/21 | 跨部門以共同尺度比較採購、使用及退役影響，才能支持整體價值決策。 |
| Q-327 | 效益實現 | D | 23/22/22/20 | 效益跨越專案生命週期，需確認承接者及可執行的量測與檢視機制。 |
| Q-328 | 合規與敏捷 | C | 24/22/23/22 | 把必要證據整合進交付能避免事後補件，也保留持續改善效率的空間。 |
| Q-330 | 法規遵循 | A | 23/24/23/24 | 需要把法規通知轉為設備、程序及計畫的影響分析，才能選擇相稱應對。 |

### Hard-item checks

- Q-144: protect good-faith disclosure while preserving formal accountability; psychological safety is not blanket immunity.
- Q-200: distinguish funding authority from authority to change a scope baseline.
- Q-297: verify applicability in the actual use context rather than assume a supplier statement or earlier release grants exemption.
- Q-298: address process and incentive conflicts, not only operation training.
- Q-300: disclose lifecycle sensitivity and budget constraints; avoid optimistic assumptions or unapproved scope cuts.
- Q-305: reconcile benefit measurement and ownership before handover, including ongoing variance response.
- Q-306: reuse acceptable electronic evidence while retaining required approval controls.

### Concept cross-checks

Primary references consulted for concept-level checks (not sources of exam questions):

- [Scrum Guide 2020](https://scrumguides.org/scrum-guide.html): self-management and completion/quality expectations; informs Q-019 and the distinction between a functioning increment and required completion evidence.
- [PMI Benefits Realization Management Framework](https://www.pmi.org/learning/thought-leadership/series/benefits-realization/benefits-realization-management-framework): benefits can continue after project work transitions to business operations.
- [PMI Benefits Realization Management Practice Guide](https://www.pmi.org/standards/benefits-realization): strategic alignment and benefit/value measurement beyond deliverables.

Compliance scenarios explicitly state their applicable requirements and decision authority. They do not assert jurisdiction-specific law or invent exemptions. Sustainability choices ask for lifecycle trade-offs rather than declaring that the cheapest or greenest option always wins.

## Validation — 2026-09-26

- PASS: scoped audit; exactly the approved 60 changed IDs, unchanged schema/metadata/order and non-bank app, valid answer indexes, all four rationale labels, correct explanation prefix, no new exact stem+options+key duplicate involving this batch.
- PASS: audit negative controls rejected an out-of-scope question edit, a mismatched answer key, and a non-bank code edit (temporary files only).
- PASS: `node scripts/test-mock-persistence.cjs` on the actual inline application: save/reload/resume, legacy/corrupt/reordered-content rejection, flags/position/deadline, overwrite/discard, submit/review, expired resume and no duplicate history/resurrection.
- PASS: temporary extension of the existing VM harness: a locked second answer is ignored; result rendering and retry creation do not write attempts; a real retry answer increments attempts exactly once; manual explanation preference survives retry.
- PASS: Node `vm.Script` compilation of the root inline script; `git diff --check`.

### Browser QA

- Desktop 1280 × 900: all 60 updated questions answered correctly with instant explanations; matching answer labels and feedback, four locked options, no horizontal overflow. Finish gives 60/60 and 100%, with no retry CTA.
- Mobile 375 × 812: all 60 answered incorrectly with manual explanations; explanations hidden until requested, matching correct/wrong states and four locked options, no horizontal overflow. Finish gives 0/60; retry includes 60, resets answered count and retains manual preference. A retry answer, favorite and previous/next navigation pass.
- Desktop mock smoke: Q-006 correct and Q-034 incorrect; save/reload/resume restores position, prior answer, flag and decreasing timer. Submit reports 1/180 with matching domain score; review shows locked answers and matching explanations.
- Mobile mock smoke: entry, question/selection and submit result; Q-034 review text and answer feedback remain readable without horizontal overflow (360px client width within the 375px viewport with scrollbar).
- Uninstrumented application copy: page starts without reported console errors; random practice starts, answers and previous/next work; analytics, official samples, Mindset and mock entry tabs open and practice state remains intact.

### Test setup and limitations

- Browser files were served from an OS temporary directory on a separate localhost origin, not production. The repository contains no QA harness modifications to the app.
- For deterministic coverage, a temporary copy adds a 60-question select option and prioritizes the approved IDs in question selection; lifecycle, rendering and recording functions are unchanged. The normal random flow was also smoke-tested on an uninstrumented copy.
- The browser tool timed out on the native mock-start confirm dialog and could not retrieve it. Mock browser checks therefore used a temporary `confirm()` acceptance stub. Native confirm accept/cancel behavior is NOT claimed as browser-verified; the existing VM test covers confirmation branches.
- No full 180-question timed sitting or 240-minute wall-clock run; expiry behavior is covered by the VM clock tests.
- Automated audits cannot establish semantic best-answer uniqueness. Engineering self-review is complete; independent ChatGPT Technical/Content Review and Human Content Review are pending. No Product Verify, release or production verification is claimed.

## Reproduce scripted checks

Export the immutable baseline using Python (preserves UTF-8 without shell redirection conversion), then run:

```powershell
python -c "import pathlib,subprocess,tempfile; pathlib.Path(tempfile.gettempdir(),'pmp23-baseline.html').write_bytes(subprocess.check_output(['git','show','4265866f0fa9e7a8b5caa237a54513cbeea91d25:index.html']))"
python -X utf8 scripts/audit-remediation-batch3.py --baseline "$env:TEMP\pmp23-baseline.html"
node scripts/test-mock-persistence.cjs
git diff --check
```
