# Issue #22 — Remediation Batch 2

Baseline: `e462e180b634427d5034f055c3323f69d50ac841` (latest dev at branch creation).
Implementation/self-review and local QA completed 2026-09-23. Separate ChatGPT
content review and Human Content Review remain pending; this is not batch acceptance.
The latest Issue #22 records Batch 1 as accepted; the older Batch 1 document's
historical pending status does not supersede that Issue record.

## Scope and writing standard

- Exactly the 60 IDs listed in #22 changed: People 15, Process 20, Business
  Environment 25; medium 51, hard 9. The other 270 records are unchanged.
- Only stems, options, answer indexes, explanations and mindsets changed.
  IDs, ordering, schema, domain/approach/topic/difficulty/type are preserved.
- The complete non-bank application is unchanged, including #18 persistence,
  history, timers, practice lifecycle, mock grading/review, feedback and official content.
- No dependencies or interactive question types were introduced; duplicate-group
  cleanup is not part of this batch. No new exact stem/options/key duplicate was added.

Each item preserves its original learning objective. Added decision context makes
the best option depend on authority, timing, available evidence, value or the scope
of a control. Distractors represent credible actions that are premature, partial,
outside the given authority or mismatched to the constraint. Explanations name
the key and explain all three distractors; mindsets state the transferable lesson.
Stems were clarified individually rather than mechanically replacing only keywords.

Particular checks: explicit actors in Sprint-scope negotiation; team autonomy
within required controls; documents versus actual acceptance evidence; future
value versus sunk costs; tool approval versus authorization for a new data use.
Regulatory/AI scenarios do not assert jurisdiction-specific legal conclusions.

## Audit method and results

Same Batch 1 / parent #8 length heuristic: count non-whitespace characters;
unique longest means strictly longer than every distractor. Materially longer
means correct length >= 1.25 times the distractor median AND difference >= 8.

| Measure | Before | After |
| --- | ---: | ---: |
| Correct option uniquely longest | 60/60 | 2/60 |
| Correct option materially longer | 60/60 | 0/60 |
| A / B / C / D keys | 0 / 59 / 1 / 0 | 15 / 15 / 15 / 15 |
| Longest consecutive same-key run, sorted IDs | 55 | 3 |

Bank-wide context (330 items): unique-longest keys 266 → 208; materially-longer
keys 251 → 191; A/B/C/D 33/267/21/9 → 48/223/35/24. The remaining bank still has
substantial cues; those records were not changed to improve this batch's totals.

Only Q-130 and Q-150 remain uniquely longest: their correct option has 27
characters versus a longest distractor of 26. These are not material length gaps.
The sorted-ID key sequence is:

```text
CDBBDABBBACBDCCBACDBCCABCADACCDBACDAAADDABCADBCBCBDDADADBDAC
```

No period of 1–30 repeats throughout the 60-key sequence. This and the balanced
counts are checks against obvious cues, not proof of randomness or item validity.

### Wording occurrences (correct / distractors)

Denominators differ: 60 correct options versus 180 distractors. These counts
describe wording, not equally sized groups or an automatic acceptance threshold.

| Term | Before | After |
| --- | ---: | ---: |
| 評估 | 1 / 0 | 1 / 3 |
| 分析 | 7 / 0 | 1 / 6 |
| 檢視 | 6 / 0 | 0 / 1 |
| 協助 | 0 / 0 | 1 / 0 |
| 共同 | 7 / 0 | 8 / 5 |
| 立即 | 0 / 1 | 1 / 5 |
| 直接 | 0 / 17 | 0 / 1 |
| 要求 | 0 / 16 | 4 / 24 |
| 升級 | 0 / 0 | 1 / 0 |

Analysis/collaboration words now also occur in distractors; immediate action and
requirements can be appropriate in correct options. Low/zero counts do not prove
a word has no bias. 共同 is still more frequent proportionally in keys, reflecting
the batch's team-agreement topics: human review should check reasoning, not reward
that word. Do not teach either a positive or reversed keyword rule.

## Content self-review map

Reviewed against the original concept, explicit actor, strongest competing option,
key/explanation references and mindset. These are reviewer prompts, not a claim
that independent ChatGPT or human acceptance has already passed. Full wording is
in the trainer's question records; the table identifies the decision to recheck.

| ID | Key | Contextual distinction / credible competitor to inspect |
| --- | --- | --- |
| 011 | C | 新依賴尚未說明；A 先辯護、B 改為會後討論都不如先冷靜探詢。 |
| 015 | D | 衝突在可觀察回覆時限；B 文化訓練不能取代共同工作協議。 |
| 020 | B | 談判前尚未核對條款及替代方案；A 先談折扣縮窄了選項。 |
| 024 | B | 資訊與時限已到且有決策規則；D 臨時投票不是已同意的機制。 |
| 025 | D | 基準變更須整體分析；A 等量範疇交換仍可能需要核准。 |
| 049 | A | 授權內細化與超出基準分開；B 每個故事送委員會過度控制。 |
| 052 | B | 衡量需支持資源決策；A 相同百分比可能掩蓋產出差異。 |
| 054 | B | Planning Poker 分歧是資訊；D 類比歷史資料不能代替釐清假設。 |
| 056 | B | 法規適用性未明，先納入影響與治理；A 最嚴格解讀可能過度投入。 |
| 061 | A | 工具及用途未核准；C 保密協議只是部分控制。 |
| 063 | C | MVP 假設是自行完成及減少協助；B 註冊/點擊不能驗證該成果。 |
| 066 | B | 有代表性低需求證據與替代需求；A 完成後學習仍須比較成本。 |
| 080 | D | 團隊已有能力及目標；B 換資深成員派工未建立自我管理。 |
| 081 | C | 新團隊尚無共同慣例；B 舊章程只是參考而非現成答案。 |
| 090 | C | 開發安排可自主，上線核准保留；B 授權主管派工仍有瓶頸。 |
| 091 | B | AI 政策為界線，協作規則由團隊建立；A 單方慣例未必適用。 |
| 111 | A | 不同班別使回覆約定失效但核准權限仍適用；B 全天代理未必必要。 |
| 120 | C | 目標、在製工作與容量共同決策；A 集中平衡工時仍依賴經理。 |
| 121 | D | 區分緊急程度與責任；A 統一一小時看似一致卻未必可行。 |
| 130 | B | 成員已有能力，保留權限外求助；C 代理派工不等於自主。 |
| 131 | C | 範本可用，但須共同調整；A 成功範本不保證適合本團隊。 |
| 150 | C | 責備經驗使授權不可信，需明確界線及實際支持；B 增加審批未解題。 |
| 151 | A | 協議可處理逾時與升級，不能改寫核准權限；D 全部上送又過度控制。 |
| 176 | B | 單人展示未驗證併發；C 效能承諾不能取代技術試驗。 |
| 180 | C | 近期已知、遠期需試用；A 類比不足以支持完整遠期細節。 |
| 184 | A | 整體與情境別門檻的核准依據未對齊；C 增加整體樣本未解爭議。 |
| 185 | D | 技術債的交付影響須參與排序；A 加測試未必降低結構性修改成本。 |
| 187 | A | 新工作會排擠有效目標必要部分；B 等量交換不代表不危及目標。 |
| 190 | C | 本系統尖峰尚未驗證，可用合成資料；A 同業報告只是參考。 |
| 194 | C | 保留整體路線圖並等待實驗細化；B 只看近期缺少整合視野。 |
| 198 | D | 故事與核准需求缺追溯；C 故事重測無法證明需求完整承接。 |
| 199 | B | 重複邏輯增加修改負擔；A 自動化不能取代技術債排序。 |
| 201 | A | 等點數工作對可靠性目標貢獻不同；B 協商仍不能危及目標。 |
| 208 | C | 遠期不確定但已知設備交期長；B 全等需求成熟會錯過必要規劃。 |
| 212 | D | 已核准變更與舊測試版本不一致；B 先改程式未釐清落實範圍。 |
| 213 | A | 分段重構與重寫需比較機會成本；D 固定配額不能取代價值判斷。 |
| 218 | A | 平時測試未涵蓋尖峰及一致性；D 文件審查不能取代早期實驗。 |
| 226 | A | 「即時」歧義須先查核准附件；D 不能先認定是新增範疇。 |
| 227 | D | 完成量掩蓋等待/返工；B 只另列工時卻維持承諾未處理取捨。 |
| 266 | D | 效益下降且經理無停案權；A 折扣可比較但不能保留失真效益。 |
| 270 | A | 限制範圍與缺口未明；C 替代採購也需確認可行性。 |
| 271 | B | 非強制功能需求低；A 最小上線學習也需與其他價值比較。 |
| 277 | C | 據點減少使效益來源改變；D 削減支援可能又降低採用效益。 |
| 279 | A | 不訓練承諾未涵蓋用途與保留；C 輸出審查不能保護未授權輸入。 |
| 281 | D | 替代性能相近不等於可整合；A 先訂購會提前承諾未驗證方案。 |
| 282 | B | 現場研究指出另一價值瓶頸；D 不能先假定客戶只是不了解功能。 |
| 288 | C | 採用假設下降；A 更強推廣方案須有證據，而非維持原目標。 |
| 290 | B | 內部資料仍需用途及保留授權；A 內網部署只涵蓋部分風險。 |
| 292 | C | 庫存跨團隊共用，需整合時序；B 各自找供應商可能重複投入。 |
| 293 | B | 重新排序包含切換代價；A 避免切換不自動勝過高價值替代機會。 |
| 303 | D | 交期說法衝突，替代仍需驗證；C 平行採購須比較成本與限制。 |
| 304 | D | 聲譽/轉換影響是未來成本；B 避免沉沒成本不等於一律立即停止。 |
| 310 | A | 縮小/延後兩方案需同尺度比較；B 只選最低成本未必保留價值。 |
| 312 | D | 合成資料核准未涵蓋真實紀錄；A 人工覆核不等於用途授權。 |
| 314 | A | 轉運路徑是否允許未明；C 賠償不能保證合規可行。 |
| 315 | D | 剩餘容量有高價值替代用途；A 原功能發布實驗也要有投資理由。 |
| 321 | B | 轉向小眾市場仍是未驗證假設；C 共用功能也不必然值得先投入。 |
| 323 | D | 原始存取權不同於外部分析用途；C 安全驗證不等於本次用途核准。 |
| 325 | A | 緩衝與替代整合成本未確認；B 不能假定緩衝足夠吸收全部差異。 |
| 326 | C | 路線圖可隨價值證據調整；A 先做完再看維護不處理當前機會成本。 |

Human review should pay particular attention to the nine hard items (111, 150,
151, 201, 208, 212, 213, 303, 304), the near-topic pairs, whether added constraints
over-cue the key, and whether at least two candidates remain credible. Read in
three groups of 20 sorted IDs; do not use length scores as a substitute for review.

## QA performed

- Batch audit: exact changed IDs, other 270 unchanged, schema and metadata,
  valid indexes, four distinct options, explanation key prefix and references
  to all four choices, nonempty mindset, no replacement characters, and exact
  non-bank application comparison. PASS.
- `node scripts/test-mock-persistence.cjs`: PASS without changing that test.
  Covers v5 rejection, simulated option reorder, compatible save/reload/resume,
  position/flags/deadline, submit/review, no duplicate history or resurrected save.
- Negative audit checks using temporary copies correctly rejected an out-of-scope
  question edit, a mismatched explanation key and a non-bank application edit.
- All inline JS parsed with Node `vm.Script`; `git diff --check`: PASS.
- Desktop 1024px: all 60 answered correctly; four locked options and matching
  explanation key for each; result 60/60 (100%), no visible retry action.
- Mobile measured 375px: all 60 answered incorrectly; manual explanation hidden
  before reveal, correct/wrong labels and key checked for each. Result 0/60;
  retry contains 60 questions, starts at 0 answered and preserves manual preference.
- Favorite and previous/next checked on desktop. Every tested question had no
  document horizontal overflow; mobile document width 360px plus scrollbar.
- Mock spot-check Q-011 correct and Q-020 wrong: saved/reloaded/resumed at question
  3 with selections, flag and remaining time retained; submitted result 1/180,
  People 2%, other domains 0%; review displayed the same correct/wrong choices.
- After submit/reload, no unfinished mock reappeared. Mobile mock submit/review
  also checked on Q-011; correct answer/explanation and layout remained consistent.
- Exact application copy (without test sorting): random practice start, answer,
  next/previous and all navigation tabs checked.

### Browser test method and limitations

Temporary localhost fixtures prioritized the 60 IDs through `shuffle` and added
a 60-question setting for deterministic coverage, with fixed-width iframe
documents. They retained all 330 records and original lifecycle handlers. Native
`confirm` was replaced by an always-accept shim only in these fixtures because
the in-app browser's native confirmation control previously timed out. Fixtures
are not committed. Native dialogs, all 180 mock answers, real devices, full-duration
timing and screen-reader behavior were not reverified in this content-only change.
The existing persistence regression test covers confirmation cancellation branches.
Browser logs included the previously seen `MutationObserver.observe` error; the
application does not use that API and tested flows continued. This is not a claim
that production or Human Verify has passed.

## Reproduce / review gate

Export `git show e462e18:index.html` to a UTF-8 temporary baseline, then run:

```text
python -X utf8 scripts/audit-remediation-batch2.py --baseline <baseline.html>
node scripts/test-mock-persistence.cjs
git diff --check
```

The audit is read-only and prints per-item lengths/ratios, keys, wording counts
and scope results. Letter checks establish mechanical consistency, not semantic
correctness. Content self-review above is separate from the Issue's required
ChatGPT review and Human Content Review. No next batch or release is authorized.

Concept references checked while drafting: [Scrum Guide 2020](https://scrumguides.org/scrum-guide.html),
[PMI 2026 ECO](https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf),
and [PMI organizational assets/technical debt guidance](https://www.pmi.org/disciplined-agile/mindset/guidelines/leverageassets).
These are original scenarios, not official PMI questions or endorsement.
