// Issue #77: deployed main bootstrap + candidate dev runtime/data (dev-only integration topology).
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const canonical=require('./question-source.cjs');
const {execFileSync}=require('node:child_process');
const previewCommit=execFileSync('git',['rev-parse','origin/main'],{cwd:canonical.root,encoding:'utf8'}).trim();
const preview=execFileSync('git',['show',previewCommit+':dev/index.html'],{cwd:canonical.root,encoding:'utf8'});
assert(!preview.includes('<base href='));assert(!preview.includes('pmp2026_v3_learning_history'));
assert.equal(preview.replace(/\r\n/g,'\n'),fs.readFileSync(path.join(canonical.root,'dev/index.html'),'utf8').replace(/\r\n/g,'\n'));
const out=path.resolve(process.argv[2]||path.join(require('node:os').tmpdir(),'pmp77-loader'));fs.mkdirSync(out,{recursive:true});
const report={issue:77,source_sha256_lf:crypto.createHash('sha256').update(canonical.html.replace(/\r\n/g,'\n')).digest('hex'),question_bank_sha256:canonical.bankHash,preview_bootstrap:{ref:previewCommit+':dev/index.html',sha256:crypto.createHash('sha256').update(preview.replace(/\r\n/g,'\n')).digest('hex'),topology:'main bootstrap unchanged; only raw dev app/data use candidate branch; Pages /dev/data is unavailable'},views:[],failures:[],errors:[]};
let mode='ok',delayResolve;const requests=[];
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://local');requests.push(url.pathname);
 if(url.pathname==='/favicon.ico'){res.statusCode=204;res.end();return;}
 if(url.pathname==='/pmp-trainer/dev/'){res.setHeader('Content-Type','text/html;charset=utf-8');res.end(preview);return;}
 if(url.pathname==='/pmp-trainer/data/questions.json'){
  if(mode==='delay')await new Promise(resolve=>delayResolve=resolve);
  if(mode==='404'){res.statusCode=404;res.end('Not found');return;}
  res.setHeader('Content-Type','application/json');res.end(mode==='json'?'broken':JSON.stringify(mode==='version'?{...canonical.data,schema_version:99}:canonical.data));return;
 }
 if(url.pathname==='/pmp-trainer/'){res.setHeader('Content-Type','text/html;charset=utf-8');res.end(canonical.html);return;}
 res.statusCode=404;res.end('Unexpected asset path');
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,channel:'msedge'});report.browserVersion=browser.version();
 try{
 // Replay the reviewed implementation against the deployed bootstrap: it must fail at the missing Pages asset.
 const control=await browser.newContext(),oldPage=await control.newPage(),controlErrors=[],requestStart=requests.length;
 oldPage.on('console',m=>{if(m.type()==='error')controlErrors.push(m.text());});
 const reviewedHtml=execFileSync('git',['show','f62baf0acef7e2419ae7a36f4e9bff4d1e476dc6:index.html'],{cwd:canonical.root,encoding:'utf8'});
 await oldPage.route('https://raw.githubusercontent.com/Naiyi-Chia/pmp-trainer/dev/index.html**',r=>r.fulfill({status:200,contentType:'text/html',body:reviewedHtml}));
 await oldPage.goto(origin+'/pmp-trainer/dev/');await oldPage.locator('#bankRetry').waitFor({state:'visible'});
 assert.equal(await oldPage.evaluate(()=>Q.length),0);assert(await oldPage.locator('#trainerApp').evaluate(e=>e.hidden&&e.inert));
 const rejectedRequests=requests.splice(requestStart);assert(rejectedRequests.includes('/pmp-trainer/dev/data/questions.json'));
 report.regression_control={reviewed_commit:'f62baf0acef7e2419ae7a36f4e9bff4d1e476dc6',result:'PASS: prior runtime reproduces missing /dev/data startup failure with deployed bootstrap',requests:rejectedRequests,expected_console:controlErrors};await control.close();
 for(const mobile of [false,true]){

  const context=await browser.newContext({viewport:mobile?{width:375,height:812}:{width:1280,height:900}});const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});page.on('dialog',d=>d.accept());
  await page.goto(origin+'/pmp-trainer/');await page.waitForFunction(()=>Q.length===330&&!document.getElementById('trainerApp').hidden);
  assert.equal(await page.evaluate(()=>new URL('data/questions.json',document.baseURI).pathname),'/pmp-trainer/data/questions.json');
  const history={1:{attempts:1,correct:0,lastCorrect:false,star:true}};
  await page.evaluate(h=>{replaceLearning(migrateHistory(h));},history);await page.locator('#pMode').selectOption('wrong');await page.locator('#pCount').selectOption('all');await page.locator('#practiceStart').click();assert.equal(await page.evaluate(()=>P[0].id),1);
  const q=canonical.bank[0];await page.locator('#popts button').nth(q.ans).click();assert((await page.locator('#pexp').innerText()).includes(q.exp));await page.locator('#practiceNext').click();
  await page.locator('[data-tab="dashboard"]').click();assert.equal(await page.locator('#dAttempts').innerText(),'2');assert.equal(await page.locator('#dUnique').innerText(),'1');
  const prodHistory=await page.evaluate(()=>localStorage.getItem('pmp2026_v2_history'));
  const prodLearning=await page.evaluate(()=>localStorage.getItem('pmp2026_v3_learning_history'));
  await page.evaluate(()=>localStorage.setItem('pmp2026_v5_active_mock','production-mock-sentinel'));
  const prodMock=await page.evaluate(()=>localStorage.getItem('pmp2026_v5_active_mock'));
  const rawRequests=[];await page.route('https://raw.githubusercontent.com/Naiyi-Chia/pmp-trainer/dev/**',route=>{
   const u=new URL(route.request().url());rawRequests.push(u.pathname);
   if(u.pathname.endsWith('/index.html'))return route.fulfill({status:200,contentType:'text/html',body:canonical.html});
   if(u.pathname.endsWith('/data/questions.json'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(canonical.data)});
   return route.abort();
  });
  await page.goto(origin+'/pmp-trainer/dev/');await page.waitForFunction(()=>typeof Q!=='undefined'&&Q.length===330&&!document.getElementById('trainerApp').hidden);
  assert((await page.title()).startsWith('[DEV]'));assert.equal(await page.evaluate(()=>document.baseURI),origin+'/pmp-trainer/dev/');assert(rawRequests.includes('/Naiyi-Chia/pmp-trainer/dev/data/questions.json'));
  assert.equal(await page.evaluate(()=>LEARNING_STORE),'dev:pmp2026_v3_learning_history');assert.equal(await page.evaluate(()=>localStorage.getItem('pmp2026_v3_learning_history')),prodLearning);assert.equal(await page.evaluate(()=>STORE),'dev:pmp2026_v2_history');assert.equal(await page.evaluate(()=>MOCK_STORE),'dev:pmp2026_v5_active_mock');assert.equal(await page.evaluate(()=>localStorage.getItem('pmp2026_v2_history')),prodHistory);assert.equal(await page.evaluate(()=>Object.keys(H).length),0);
  await page.locator('#practiceStart').click();await page.locator('#popts button').first().click();assert.equal(await page.evaluate(()=>Object.keys(H).length),1);assert.equal(await page.evaluate(()=>L.events.length),1);assert.equal(await page.evaluate(()=>localStorage.getItem('pmp2026_v3_learning_history')),prodLearning);assert.equal(await page.evaluate(()=>localStorage.getItem('pmp2026_v2_history')),prodHistory);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));await page.screenshot({path:path.join(out,(mobile?'mobile':'desktop')+'-dev.png'),fullPage:true});
  await page.locator('[data-tab="mock"]').click();await page.locator('button[onclick="startMock()"]').click();
  const first=await page.evaluate(()=>M[0]);await page.locator('#mopts button').nth(first.ans).click();await page.locator('#flagBtn').click();await page.locator('#mGrid button').nth(1).click();
  const pending=await page.evaluate(()=>loadSavedMock());await page.reload();await page.waitForFunction(()=>typeof Q!=='undefined'&&Q.length===330&&!document.getElementById('trainerApp').hidden);
  await page.locator('[data-tab="mock"]').click();await page.locator('#resumeMockBtn').click();assert.deepEqual(await page.evaluate(()=>M.map(q=>q.id)),pending.questionIds);assert.equal(await page.evaluate(()=>mSession),pending.attemptTracking.sessionId);assert.equal(await page.evaluate(()=>mi),1);assert.equal(await page.evaluate(()=>mFlag[M[0].id]),true);
  const second=await page.evaluate(()=>M[1]);await page.locator('#mopts button').nth((second.ans+1)%4).click();await page.locator('button[onclick="finishMock()"]').click();assert((await page.locator('#mockResult').innerText()).includes('1 / 180'));assert.equal(await page.evaluate(()=>L.events.length),3);
  await page.locator('button[onclick="reviewMock()"]').click();assert.equal(await page.locator('#popts button:disabled').count(),4);await page.locator('#practiceNext').click();assert(await page.locator('#pexp').isVisible());assert.equal(await page.evaluate(()=>L.events.length),3);
  assert.equal(await page.evaluate(()=>localStorage.getItem('pmp2026_v2_history')),prodHistory);assert.equal(await page.evaluate(()=>localStorage.getItem('pmp2026_v3_learning_history')),prodLearning);assert.equal(await page.evaluate(()=>localStorage.getItem('pmp2026_v5_active_mock')),prodMock);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));
  report.views.push({viewport:mobile?'375x812':'1280x900',production:'PASS: relative /pmp-trainer/data/questions.json, Wrong Questions/Stats/lookup',dev:'PASS: deployed main bootstrap without base/v3 rewrite; raw dev data; all three production storage bytes preserved; native Practice/Mock reload/resume/flags/submit 1/180/read-only Review',overflow:'none',rawRequests});await context.close();
 }
 // No app/storage initialization until bank arrives. Missing/invalid banks remain inert.
 const context=await browser.newContext({viewport:{width:375,height:812}}),page=await context.newPage();const expectedNetworkErrors=[];
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')expectedNetworkErrors.push(m.text());});
 await page.goto(origin+'/pmp-trainer/');await page.waitForFunction(()=>Q.length===330);await page.evaluate(()=>{localStorage.removeItem('pmp2026_v3_learning_history');localStorage.setItem('pmp2026_v2_history','{"1":{"attempts":2,"correct":1,"star":true}}');localStorage.setItem('pmp2026_v5_active_mock','{"version":5,"sentinel":"preserve"}');});
 const saved=await page.evaluate(()=>({history:localStorage.getItem(STORE),learning:localStorage.getItem(LEARNING_STORE),mock:localStorage.getItem(MOCK_STORE)}));
 mode='delay';await page.goto(origin+'/pmp-trainer/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>typeof Q!=='undefined');assert.equal(await page.evaluate(()=>Q.length),0);assert(await page.locator('#trainerApp').evaluate(e=>e.hidden&&e.inert));assert.deepEqual(await page.evaluate(()=>({history:localStorage.getItem(STORE),learning:localStorage.getItem(LEARNING_STORE),mock:localStorage.getItem(MOCK_STORE)})),saved);
 delayResolve();await page.waitForFunction(()=>Q.length===330);Object.assign(saved,await page.evaluate(()=>({history:localStorage.getItem(STORE),learning:localStorage.getItem(LEARNING_STORE),mock:localStorage.getItem(MOCK_STORE)})));report.failures.push({case:'slow response',result:'PASS: app hidden/inert; storage unchanged before data validation'});
 for(const failure of ['404','json','version']){
  mode=failure;await page.goto(origin+'/pmp-trainer/');await page.locator('#bankRetry').waitFor({state:'visible'});assert.equal(await page.evaluate(()=>Q.length),0);assert(await page.locator('#trainerApp').evaluate(e=>e.hidden&&e.inert));assert.deepEqual(await page.evaluate(()=>({history:localStorage.getItem(STORE),learning:localStorage.getItem(LEARNING_STORE),mock:localStorage.getItem(MOCK_STORE)})),saved);
  await page.screenshot({path:path.join(out,'mobile-failure-'+failure+'.png'),fullPage:true});mode='ok';await page.locator('#bankRetry').click();await page.waitForFunction(()=>Q.length===330&&!document.getElementById('trainerApp').hidden);assert.equal(await page.evaluate(()=>getHist(1).attempts),2);
  report.failures.push({case:failure,result:'PASS: failure/reload retry; history/active mock unchanged'});
 }
 report.expected_failure_console=expectedNetworkErrors;await context.close();assert(!requests.includes('/pmp-trainer/dev/data/questions.json'),'preview mistakenly requested Pages/main asset');assert.deepEqual(report.errors,[]);
 report.result='PASS';fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS: Pages paths, dev isolation, startup gating/failure/retry and progress preservation; '+out);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>server.close());
