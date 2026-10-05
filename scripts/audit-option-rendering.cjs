// Issues #26/#27: measure verbatim options in the real, unanswered trainer UI.
// Uses externally supplied Playwright + installed Edge; no app dependencies.
// node scripts/audit-option-rendering.cjs --output <directory> [--html <file>] [--all]
const {chromium} = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const canonical = require('./question-source.cjs');
const arg = name => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : undefined;
const html = fs.readFileSync(arg('--html') || path.join(root, 'index.html'), 'utf8');
const out = arg('--output') || path.join(os.tmpdir(), 'pmp26-rendering');
const legacyIds = [113,116,118,119,122,123,126,128,129,132,133,134,135,136,137,138,139,140,141,142,143,146,148,149,152,153,154,155,156,157,215,216,217,219,221,222,223,228,229,230];
const bankFile = arg('--bank') || path.join(root,'data/questions.json');
const bankData = JSON.parse(fs.readFileSync(bankFile,'utf8'));
const bank = canonical.validate(bankData);
const ids = process.argv.includes('--all') ? bank.map(q => q.id) : legacyIds;
const canonicalIds = [73,74,75,76,77,78,79,82,83,86,88,89,92,93,94,95,96,97,98,99,100,101,102,103,106,108,109,112,159,160,161,163,165,166,167,172,173,174];
const source = new Map(bank.map(q => [q.id, q]));
fs.mkdirSync(out, {recursive: true});

function classify(values, answer, epsilon = 0.01) {
  const maximum = Math.max(...values), minimum = Math.min(...values);
  const tallest = values.map((v, i) => Math.abs(v - maximum) <= epsilon ? i : -1).filter(i => i >= 0);
  const shortest = values.map((v, i) => Math.abs(v - minimum) <= epsilon ? i : -1).filter(i => i >= 0);
  return {values, maximum, minimum, tallest, shortest,
    unique_tallest: tallest.length === 1 && tallest.includes(answer),
    tied_tallest: tallest.length > 1 && tallest.includes(answer),
    informative_tied_tallest: tallest.length > 1 && tallest.length < 4 && tallest.includes(answer),
    all_equal: tallest.length === 4,
    unique_shortest: shortest.length === 1 && shortest.includes(answer),
    tallest_rule_credit: tallest.includes(answer) ? 1 / tallest.length : 0,
    shortest_rule_credit: shortest.includes(answer) ? 1 / shortest.length : 0};
}

function summarize(rows, field) {
  const result = {count: rows.length};
  for (const name of ['unique_tallest','tied_tallest','informative_tied_tallest','all_equal','unique_shortest']) {
    result[name] = rows.filter(r => r[field][name]).length;
    result[name + '_ids'] = rows.filter(r => r[field][name]).map(r => r.id);
  }
  for (const name of ['tallest_rule_credit','shortest_rule_credit']) {
    result[name + '_sum'] = Number(rows.reduce((sum, r) => sum + r[field][name], 0).toFixed(3));
  }
  return result;
}

// Validate tie classification so an all-equal set is not misreported as a cue.
assert.equal(classify([52,52,52,52], 0).informative_tied_tallest, false);
assert.equal(classify([52,78,52,52], 1).unique_tallest, true);
assert.equal(classify([78,78,52,52], 1).informative_tied_tallest, true);
assert.equal(classify([52,78,52,52], 0).unique_tallest, false);
const report = {
  source_sha256_lf: crypto.createHash('sha256').update(html.replace(/\r\n/g, '\n')).digest('hex'),
  question_bank_sha256: crypto.createHash('sha256').update(JSON.stringify(bank)).digest('hex'),
  method: 'Unanswered #popts buttons; exact DOM text = letter label + stored option; document.fonts.ready; DOM Range line rectangles and button border-box height. No answer/feedback labels measured. CSS and app code unchanged.',
  height_tolerance_px: 0.01,
  cue_rule: 'Credit for guessing uniformly among tallest/shortest options; random four-option expectation = 25%. This descriptive screen is not a semantic or statistical acceptance test.',
  measurement_controls: 'PASS: equal-height, unique-tallest, partial-tie and nonmatching-key cases',
  views: [], errors: []
};
const server = http.createServer((req, res) => {
  canonical.serve(req,res,html,bankData);
});
(async () => {
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({headless: true, channel: 'msedge'});
    report.browser_version = browser.version();
    for (const viewport of [{width:1280,height:900}, {width:375,height:812}]) {
      const context = await browser.newContext({viewport});
      const page = await context.newPage();
      page.on('dialog', dialog => dialog.accept());
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
      await page.goto('http://127.0.0.1:' + server.address().port);
      await page.waitForFunction(()=>Q.length===330);
      await page.locator('[data-tab="dashboard"]').click();
      const history = Object.fromEntries(ids.map(id => [id, {attempts:0,correct:0,lastCorrect:null,star:true}]));
      await page.locator('#importFile').setInputFiles({name:'rendering-fixture.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:2,history}))});
      await page.waitForFunction(count => Object.values(H).filter(h => h.star).length === count, ids.length);
      await page.reload();
      await page.waitForFunction(()=>Q.length===330);
      await page.locator('#pMode').selectOption('star');
      await page.locator('#pCount').selectOption('all');
      await page.locator('#practiceStart').click();
      await page.evaluate(() => document.fonts.ready);
      const rows = [];
      for (let n = 0; n < ids.length; n++) {
        const state = await page.evaluate(() => ({q:P[pi], answered:pAns[P[pi].id] !== undefined}));
        assert.equal(state.answered, false);
        const q = source.get(state.q.id);
        assert.deepEqual(state.q, q);
        assert.equal(await page.locator('#pq').textContent(), q.q);
        const options = await page.locator('#popts button').evaluateAll(buttons => buttons.map(button => {
          const range = document.createRange(); range.selectNodeContents(button);
          const rects = [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0);
          const tops = [];
          for (const r of rects) if (!tops.some(y => Math.abs(y - r.top) < 0.5)) tops.push(r.top);
          const box = button.getBoundingClientRect(), css = getComputedStyle(button);
          return {text:button.textContent, height:box.height, width:box.width, lines:tops.length,
            font:css.font, line_height:css.lineHeight, padding:css.padding};
        }));
        assert.equal(options.length, 4);
        options.forEach((option, i) => {
          assert.equal(option.text, 'ABCD'[i] + '. ' + q.opts[i]);
          assert(option.lines > 0 && option.height > 0);
        });
        rows.push({id:q.id, key:'ABCD'[q.ans], stem:q.q, options,
          height:classify(options.map(o => o.height), q.ans),
          lines:classify(options.map(o => o.lines), q.ans)});
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
        if ([129,137,217].includes(q.id)) await page.screenshot({path:path.join(out,viewport.width+'-q'+q.id+'.png'),fullPage:true});
        // Navigation is native; answer only after collecting the blind-state measurements.
        await page.locator('#popts button').nth(q.ans).click();
        await page.locator('#practiceNext').click();
      }
      rows.sort((a,b) => a.id-b.id);
      assert.deepEqual(rows.map(r => r.id), ids);
      const groups = {whole_bank:rows, canonical:rows.filter(r => canonicalIds.includes(r.id)), outside_canonical:rows.filter(r => !canonicalIds.includes(r.id))};
      const view = {viewport, height_summary:summarize(rows,'height'), line_summary:summarize(rows,'lines'),
        groups:Object.fromEntries(Object.entries(groups).map(([name, subset]) => [name, {height:summarize(subset,'height'),lines:summarize(subset,'lines')}])),
        verbatim_options:rows.length*4, unanswered_questions:rows.length, horizontal_overflow:0, rows};
      report.views.push(view);
      console.log(JSON.stringify({viewport, groups:Object.fromEntries(Object.entries(view.groups).map(([name,g]) => [name,{count:g.height.count,tallest:g.height.tallest_rule_credit_sum,shortest:g.height.shortest_rule_credit_sum}]))}));
      await context.close();
    }
    assert.deepEqual(report.errors, []);
    fs.writeFileSync(path.join(out,'report.json'), JSON.stringify(report,null,2)+'\n');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
