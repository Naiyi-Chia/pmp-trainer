# Issue #77 — canonical PMP question bank

Engineering base: `dev@7e00c7570bce744c0238684ebcb07477bf7a2d5f`. Branch: `maint/issue-77-canonical-question-bank`. Contract: [Issue #77](https://github.com/Naiyi-Chia/pmp-trainer/issues/77). #30 schema extensions and unintegrated #29 history changes are excluded.

## Single source and migration parity

The current bank is **`data/questions.json`**, with `schema_version: 1`, `question_count: 330` and `questions`. Existing question schema is unchanged. `index.html` holds only an initially empty `Q` populated from the validated asset; it contains no second bank or fallback copy.

Migration changes **zero question records**. The parity validator compares all ordered records against the reachable pre-extraction Git commit, including every existing field/value, each record's original field order, all text/whitespace, option order and answer index. It also checks the original serialized-record SHA-256:

`208546e866e1242cee263878561981d824a7adfec5960624d71d51883e801656`

[Baseline manifest](QUESTION_BANK_MIGRATION_BASELINE.json) contains only metadata/hash, not a competing question-text fixture. `node scripts/validate-question-bank.cjs --parity` reports **330/330 exact parity** and rejects 10 malformed-bank controls. The same runtime validator is used by Node validation/QA, avoiding a separate permissive runtime schema.

## Runtime and Pages paths

The application remains hidden/inert while the JSON loads. History loading/writes, DOM bindings, navigation handlers and startup stats initialize only after bank validation. The loader checks version/count, unique positive integer IDs, the existing required fields, nonempty text, four distinct string options and integer answer indexes. A failed HTTP/JSON/schema request or a 20-second abort keeps the app unavailable, preserves existing storage, and provides a clear reload button. Reload retries the asset with `cache: no-store`. No questions are substituted or silently dropped.

Production resolves `data/questions.json` against the document directory: `/pmp-trainer/data/questions.json`. The existing `/dev/` bootstrap still fetches raw `dev/index.html`; it now injects a raw-dev base URL before writing the document. Consequently the inline bank fetch uses:

`https://raw.githubusercontent.com/Naiyi-Chia/pmp-trainer/dev/data/questions.json`

It never requests `/dev/data/questions.json` from the production Pages tree. Existing preview history/active-mock key isolation is retained. There are no external runtime JavaScript assets to encounter raw GitHub script MIME restrictions, and no build/framework/backend/dependency is introduced.

Serve a local checkout over HTTP (for example `python -m http.server 8000`); direct `file://` fetch is not a supported launch path and receives the failure/retry guidance. Production and Dev Preview remain subject to normal integration/release gates.

## Tooling and future question work

- Current bank validation and whole-bank audits read the canonical JSON. The default final-bank audit and duplicate metrics mode no longer extract current questions from HTML.
- Node regression/browser helpers load the canonical asset and use real runtime definitions. Browser servers serve JSON as JSON and wait for the validated startup gate; reports fingerprint both app and bank.
- Rendered audit accepts `--bank <canonical JSON>` and `--html <runtime HTML>` separately. Its default uses the current canonical source. Historical rendering can provide both historical files explicitly.
- All five historical remediation readers accept canonical JSON; their original bank-specific change contracts remain historical. Non-bank HTML equality is checked only when both historical inputs are HTML; canonical data-only inputs do not assert an application-code parity check. Scoped application diff/QA must be reviewed separately.
- Historical `const Q` parsing is confined to explicit old-input/revision adapters and the migration-boundary verifier. Existing archived audit evidence is unchanged. Replay old final-bank contracts with `--historical`; a canonical audit rejects historical ref/rework/sync flags rather than silently treating them as current-data checks.
- `AGENTS.md`, README and `PROJECT_CONTEXT.md` identify the new editing/validation targets. Question content belongs in JSON only within the authorizing Issue's scope; this migration authorizes no wording or schema-v2 change.

## Fresh engineering evidence

[QA summary](QUESTION_BANK_EXTRACTION_QA.json) and [canonical audit/raw rendered evidence](QUESTION_BANK_EXTRACTION_AUDIT.json) record current app/bank fingerprints and results.

- Exact parity: **330/330 PASS**. Bank/schema/count/unique IDs/options/keys: **PASS**, 10 invalid-bank controls rejected.
- Final bank audit: 330 schema/metadata/explanation/mindset checks, 330 explanation-letter checks, 34 numeric checks and 13 audit controls pass. Unique-longest 9, materially-longer 0, keys A/B/C/D = 83/83/82/82, zero exact/order-independent/normalized duplicates; all raw/key/wording metrics match the integrated baseline.
- Full native pre-answer rendered audit: **330 questions × four options × two viewports**, 2,640 exact text checks, per-option lines/heights recorded. Tallest/shortest remains desktop **24.92%/25.03%**, mobile **24.70%/25.35%**; the 38 prior canonicals remain **25%/25%** both. No rendered page/console errors or overflow.
- Existing small-IDs native Practice/Mock/Review regression: two CLI repetitions × desktop/mobile = **4/4 PASS**. Includes locked answers/explanations, settings/retry/favorites/tabs, native 180-item Mock/save/reload/resume/flag/submit 1/180/Review and #54 instant/manual behavior.
- Existing #18 persistence: **PASS**, including a native save created by the actual pre-extraction runtime then resumed/graded by the new canonical runtime with identical IDs/answers/flags/position/deadline. Existing version/content-signature compatibility, legacy/corrupt/reordered-bank rejection, overwrite/discard, expired resume and no duplicate history/resurrection pass. No storage or attempt schema changed.
- Actual preview bootstrap under faithful local `/pmp-trainer/` and `/pmp-trainer/dev/` paths: **PASS** at 1280×900 and 375×812. Raw-dev endpoints are fulfilled with scoped files in the test; requests prove correct source selection and production/preview progress isolation. Wrong Questions/Stats/lookup pass.
- Slow response, HTTP 404, invalid JSON and unsupported version: app stays hidden/inert, stored history/active Mock bytes remain intact, actual reload-button retry succeeds. A separate real-loader unit test covers abort timeout. Deliberate HTTP 404 generates an expected browser network diagnostic in the negative scenario, recorded separately; normal flows have zero page/console errors and no unexpected asset requests.
- JavaScript/Python syntax and `git diff --check`: **PASS**. Mobile startup failure and native Dev Practice screenshots inspected: readable message/retry and unchanged usable layout.

```text
node scripts/validate-question-bank.cjs --parity
node scripts/test-question-loader.cjs
node scripts/test-mock-persistence.cjs --migration-baseline
node scripts/qa-question-loader.cjs <loader-output>
node scripts/test-qa-small-ids.cjs <small-output>
node scripts/audit-option-rendering.cjs --all --output <render-output>
python -X utf8 scripts/audit-question-bank-final.py --canonical --render-after <render-output>/report.json --small-ids-json <small-output>/report.json --output docs/QUESTION_BANK_EXTRACTION_AUDIT.json
git diff --check
```

Browser QA uses the existing external Playwright/Edge runtime (`NODE_PATH` if required), not an application dependency. Parity requires Git history containing the documented reachable baseline.

## Limits / review gate

This is engineering evidence on scoped files, with Pages-shaped URLs and the actual preview bootstrap. It does not publish the new assets to live `main`/`dev`; live Dev Preview verification and Production Smoke must follow approved integration/release. Safari/physical-device testing and Human Product Verify are not claimed. JSON fetch requires network/HTTP; offline packaging/service workers are outside scope. Original content/wording/psychometric limitations remain historical content-review concerns, unchanged by extraction.

Independent Technical Review, Human integration decisions and applicable verify/release gates remain pending. If #30 lands first, re-evaluate the migration against its canonical schema before integrating; this branch must not create a competing source. No merge into dev/main, Product Verify declaration, release or Issue closure is performed.
