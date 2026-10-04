// Issue #29 browser regression. External Playwright/Edge; no application dependency.
// node scripts/qa-attempt-history.cjs [output-directory]
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const out=path.resolve(process.argv[2]||path.join(require('node:os').tmpdir(),'pmp29-browser'));
fs.mkdirSync(out,{recursive:true});
const report={issue:29,source_sha256_lf:crypto.createHash('sha256').update(html.replace(/\r\n/g,'\n')).digest('hex'),browser:[],errors:[]};
const legacy={1:{attempts:2,correct:1,lastCorrect:false,lastAt:1800000000000,star:true},2:{attempts:0,correct:0,lastCorrect:null,star:true}};
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html);});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,channel:'msedge'});report.browserVersion=browser.version();
 try{for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:375,height:812}:{width:1280,height:900},acceptDownloads:true});const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
  let accept=true;const dialogs=[];page.on('dialog',async d=>{dialogs.push(d.message());if(accept)await d.accept();else await d.dismiss();});
  await page.goto(url);await page.evaluate(history=>{localStorage.removeItem('pmp2026_v3_learning_history');localStorage.setItem('pmp2026_v2_history',JSON.stringify(history));},legacy);await page.reload();
  assert.deepEqual(await page.evaluate(()=>L.legacyHistory),legacy);assert.equal(await page.evaluate(()=>L.events.length),0);
  await page.locator('#pMode').selectOption('star');await page.locator('#pCount').selectOption('all');await page.locator('#pExplain').selectOption(mobile?'manual':'instant');await page.locator('#practiceStart').click();
  for(let n=0;n<2;n++){
   const q=await page.evaluate(()=>P[pi]);await page.locator('#popts button').nth((q.ans+1)%4).click();
   if(mobile)await page.locator('#expBtn').click();assert(await page.locator('#pexp').isVisible());
   const e=await page.evaluate(()=>L.events.at(-1));assert.equal(e.mode,'practice');assert.equal(e.firstEncounter,q.id===2);assert(e.responseMs>=0);assert.equal(e.selectedAnswer,(q.ans+1)%4);
   await page.locator('#practiceNext').click();
  }
  assert(await page.locator('#practiceResult').isVisible());await page.locator('#practiceRetry').click();
  assert.equal(await page.evaluate(()=>L.events.length),2);
  const retry=await page.evaluate(()=>P[pi]);await page.locator('#popts button').nth(retry.ans).click();
  assert.equal(await page.evaluate(()=>L.events.at(-1).firstEncounter),false);assert.equal(await page.evaluate(()=>L.events.length),3);
  await page.locator('[data-tab="dashboard"]').click();assert.equal(await page.locator('#dAttempts').innerText(),'5');
  const download=page.waitForEvent('download');await page.locator('button[onclick="exportProgress()"]').click();const file=await download;
  const exportPath=path.join(out,(mobile?'mobile':'desktop')+'-export.json');await file.saveAs(exportPath);const exported=JSON.parse(fs.readFileSync(exportPath,'utf8'));assert.equal(exported.version,3);assert.equal(exported.learningHistory.events.length,3);
  // Actual invalid/future import and cancellation cannot replace good data.
  const before=await page.evaluate(()=>JSON.stringify(L));
  await page.locator('#importFile').setInputFiles({name:'future.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:99,history:{}}))});
  await page.waitForFunction(()=>document.getElementById('importFile').value==='');assert.equal(await page.evaluate(()=>JSON.stringify(L)),before);
  accept=false;await page.locator('#importFile').setInputFiles({name:'legacy.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:2,history:{}}))});
  await page.waitForFunction(()=>document.getElementById('importFile').value==='');assert.equal(await page.evaluate(()=>JSON.stringify(L)),before);accept=true;
  await page.locator('#importFile').setInputFiles(exportPath);await page.waitForFunction(()=>document.getElementById('importFile').value==='');await page.reload();assert.equal(await page.evaluate(()=>JSON.stringify(L)),before);
  const oldWrite=JSON.stringify({1:{attempts:9,correct:3,lastCorrect:false,star:false}});
  await page.evaluate(raw=>localStorage.setItem('pmp2026_v2_history',raw),oldWrite);await page.reload();assert.equal(await page.evaluate(()=>historyBlocked),true);
  assert.equal(await page.evaluate(()=>localStorage.getItem('pmp2026_v2_history')),oldWrite);assert((await page.locator('#runtimeStatusText').innerText()).includes('兩份原始資料'));
  await page.locator('[data-tab="dashboard"]').click();await page.locator('#importFile').setInputFiles(exportPath);await page.waitForFunction(()=>document.getElementById('importFile').value==='');assert.equal(await page.evaluate(()=>historyBlocked),false);await page.reload();assert.equal(await page.evaluate(()=>JSON.stringify(L)),before);
  await page.locator('[data-tab="mock"]').click();await page.locator('button[onclick="startMock()"]').click();
  const first=await page.evaluate(()=>M[0]);await page.locator('#mopts button').nth((first.ans+1)%4).click();await page.locator('#mopts button').nth(first.ans).click();await page.locator('#flagBtn').click();await page.locator('#mGrid button').nth(1).click();
  assert.equal(await page.evaluate(()=>L.events.length),3);const pending=await page.evaluate(()=>loadSavedMock());await page.reload();await page.locator('[data-tab="mock"]').click();await page.locator('#resumeMockBtn').click();
  assert.equal(await page.evaluate(()=>mSession),pending.attemptTracking.sessionId);assert.deepEqual(await page.evaluate(()=>M.map(q=>q.id)),pending.questionIds);
  const second=await page.evaluate(()=>M[1]);await page.locator('#mopts button').nth((second.ans+1)%4).click();await page.locator('button[onclick="finishMock()"]').click();
  assert((await page.locator('#mockResult').innerText()).includes('1 / 180'));const events=await page.evaluate(()=>L.events);assert.equal(events.length,5);assert.equal(events[3].correct,true);assert.equal(events[3].mode,'mock');assert.equal(events[4].correct,false);
  await page.locator('button[onclick="reviewMock()"]').click();assert.equal(await page.locator('#popts button:disabled').count(),4);await page.locator('#practiceNext').click();assert(await page.locator('#pexp').isVisible());assert.equal(await page.evaluate(()=>L.events.length),5);
  for(const tab of ['practice','mock','dashboard','official','guide']){await page.locator('[data-tab="'+tab+'"]').click();assert(await page.locator('#'+tab).isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));}
  await page.locator('[data-tab="dashboard"]').click();await page.screenshot({path:path.join(out,(mobile?'mobile':'desktop')+'-dashboard.png'),fullPage:true});
  report.browser.push({viewport:mobile?'375x812':'1280x900',migration:'PASS',practiceRetry:'PASS: 3 events + legacy 2 attempts; first/repeat flags and response time',importExport:'PASS: actual v3 download/reimport/reload, rejected future version, cancelled v2 replacement, preserved old-client conflict and explicit v3 import recovery',mock:'PASS: native 180, final answer, reload/resume/session/timing/flags, submit 1/180, 2 events, read-only Review',tabs:'PASS',overflow:'none',dialogs});await context.close();
 }}finally{await browser.close();}
 assert.deepEqual(report.errors,[]);report.result='PASS';fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS: Issue #29 desktop/mobile migration, writes, import/export, Practice/Mock/Review; '+out);
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>server.close());
