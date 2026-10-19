# pmp-trainer

Static PMP practice app. The single canonical bank is `data/questions.json`;
question changes belong there, within the authorizing Issue's scope.
The current bank uses [Question Schema v2 / 2026 ECO metadata](docs/QUESTION_SCHEMA_V2.md).

Serve the checkout with `python -m http.server 8000`, then open
`http://localhost:8000/`. Opening `index.html` directly as a file cannot reliably
fetch the bank. No build or application dependencies are required.

Validate with `node scripts/validate-question-bank.cjs` and
`python -X utf8 scripts/audit-question-bank-final.py --canonical`.
See [migration/runtime QA](docs/QUESTION_BANK_EXTRACTION.md) for parity,
Dev Preview asset resolution and regression commands.
