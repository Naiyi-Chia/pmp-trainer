// Issue #26 browser QA. Uses an externally provided Playwright installation and Edge.
// Run: node scripts/qa-duplicate-cleanup.cjs [output-directory] [--ids=17,29,...]
// Default remains the 78 Issue #26 IDs; --ids supports later read-only bank audits.
// Serves the unchanged HTML; imports a fixture through the existing import UI.
const {chromium}=require('playwright');
const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert/strict'),vm=require('vm'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
const defaultIds=[73, 74, 75, 76, 77, 78, 79, 82, 83, 86, 88, 89, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 106, 108, 109, 112, 113, 116, 118, 119, 122, 123, 126, 128, 129, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 146, 148, 149, 152, 153, 154, 155, 156, 157, 159, 160, 161, 163, 165, 166, 167, 172, 173, 174, 215, 216, 217, 219, 221, 222, 223, 228, 229, 230];
const sampleArg=process.argv.find(arg=>arg.startsWith('--ids='));
const ids=sampleArg?sampleArg.slice(6).split(',').map(Number).sort((a,b)=>a-b):defaultIds;
assert(ids.length>1 && ids.every(id=>Number.isInteger(id)&&id>=1&&id<=330) && new Set(ids).size===ids.length);
const out=process.argv.slice(2).find(arg=>!arg.startsWith('--')) || path.join(require('os').tmpdir(),'pmp26','browser');fs.mkdirSync(out,{recursive:true});
const report={source_sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'index.html'))).digest('hex'),source_sha256_lf:crypto.createHash('sha256').update(html.replace(/\r\n/g,'\n')).digest('hex'),syntax:'PASS',sample_ids:ids,browser:[],errors:[]};
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html)});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,channel:'msedge'});report.browserVersion=browser.version();
 try {
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:375,height:812}:{width:1280,height:900}});const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
  const dialogs=[];page.on('dialog',async d=>{dialogs.push(d.message());await d.accept()});
  await page.goto(url);assert(!(await page.locator('#runtimeStatusText').innerText()).includes('失敗'));
  await page.locator('#practiceStart').click();assert.equal(await page.locator('#popts button').count(),4);
  await page.locator('#popts button').first().click();await page.locator('#practiceNext').click();await page.locator('#practicePrev').click();
  for(const tab of ['dashboard','official','guide','mock','practice']){await page.locator('[data-tab="'+tab+'"]').click();assert(await page.locator('#'+tab).isVisible())}
  // Seed exact scoped favorites via the application's existing JSON import UI.
  const history=Object.fromEntries(ids.map(id=>[id,{attempts:0,correct:0,lastCorrect:null,star:true}]));
  await page.locator('[data-tab="dashboard"]').click();
  await page.locator('#importFile').setInputFiles({name:'issue26-fixture.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:2,history}))});
  await page.waitForFunction(count=>Object.values(H).filter(h=>h.star).length===count,ids.length);
  await page.reload();await page.locator('#pExplain').selectOption(mobile?'manual':'instant');await page.locator('#pMode').selectOption('star');await page.locator('#pCount').selectOption('all');await page.locator('#practiceStart').click();
  assert((await page.locator('#practiceSummary').innerText()).includes(String(ids.length)));const seen=[];
  for(let n=0;n<ids.length;n++){
   const q=await page.evaluate(()=>P[pi]);seen.push(q.id);assert.equal(await page.locator('#pq').innerText(),q.q);
   for(let j=0;j<4;j++)assert((await page.locator('#popts button').nth(j).innerText()).includes(q.opts[j]));
   await page.locator('#popts button').nth(mobile?(q.ans+1)%4:q.ans).click();assert.equal(await page.locator('#popts button:disabled').count(),4);
   if(mobile){assert(!(await page.locator('#pexp').isVisible()));await page.locator('#expBtn').click();assert.equal(await page.locator('#popts .wrong').count(),1)}
   const exp=await page.locator('#pexp').innerText();assert(exp.includes(q.exp));assert(exp.includes(q.mindset));assert(exp.includes('正確答案 '+'ABCD'[q.ans]));assert.equal(await page.locator('#popts .correct').count(),1);
   const dims=await page.evaluate(()=>({w:document.documentElement.clientWidth,s:document.documentElement.scrollWidth}));assert(dims.s<=dims.w,JSON.stringify({id:q.id,...dims}));
   if([73,76,86,113,129,137,143,217,221,257,301].includes(q.id))await page.screenshot({path:path.join(out,(mobile?'mobile':'desktop')+'-q'+q.id+'.png'),fullPage:true});
   await page.locator('#practiceNext').click();
  }
  assert.deepEqual([...seen].sort((a,b)=>a-b),ids);assert.equal(await page.locator('#prCorrect').innerText(),mobile?'0':String(ids.length));assert.equal(await page.locator('#prAccuracy').innerText(),mobile?'0%':'100%');
  if(mobile){await page.locator('#practiceRetry').click();assert.equal(await page.evaluate(()=>P.length),ids.length);assert.equal(await page.evaluate(()=>Object.keys(pAns).length),0);assert.equal(await page.evaluate(()=>pSettings.pExplain),'manual');await page.locator('#popts button').first().click();await page.locator('#starBtn').click();assert((await page.locator('#starBtn').innerText()).includes('☆'));await page.locator('#starBtn').click();assert((await page.locator('#starBtn').innerText()).includes('已收藏'))}
  await page.locator('[data-tab="mock"]').click();await page.locator('button[onclick="startMock()"]').click();
  const selected=await page.evaluate(ids=>M.map((q,i)=>({id:q.id,index:i,key:q.ans})).filter(q=>ids.includes(q.id)).slice(0,2),sampleArg?ids:[113, 116, 118, 119, 122, 123, 126, 128, 129, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 146, 148, 149, 152, 153, 154, 155, 156, 157, 215, 216, 217, 219, 221, 222, 223, 228, 229, 230]);assert.equal(selected.length,2);
  const [first,second]=selected;await page.locator('#mGrid button').nth(first.index).click();await page.locator('#mopts button').nth(first.key).click();await page.locator('#flagBtn').click();
  await page.locator('#mGrid button').nth(second.index).click();await page.locator('#mopts button').nth((second.key+1)%4).click();
  const before=await page.evaluate(()=>({ids:M.map(q=>q.id),ans:mAns,flag:mFlag,end:mEndAt,position:mi}));
  await page.reload();await page.locator('[data-tab="mock"]').click();await page.locator('#resumeMockBtn').click();assert.deepEqual(await page.evaluate(()=>({ids:M.map(q=>q.id),ans:mAns,flag:mFlag,end:mEndAt,position:mi})),before);
  await page.locator('#mGrid button').nth(first.index).click();assert((await page.locator('#flagBtn').innerText()).includes('已標記'));await page.locator('#mGrid button').nth(second.index).click();
  await page.locator('button[onclick="finishMock()"]').click();assert((await page.locator('#mockResult').innerText()).includes('1 / 180'));
  await page.locator('button[onclick="reviewMock()"]').click();
  for(let n=0;n<second.index;n++){if(n===first.index){assert.equal(await page.locator('#popts button:disabled').count(),4);assert((await page.locator('#pexp').innerText()).includes('答對'))}await page.locator('#practiceNext').click()}
  assert((await page.locator('#pexp').innerText()).includes('答錯'));assert.equal(await page.locator('#popts button:disabled').count(),4);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));
  await page.screenshot({path:path.join(out,(mobile?'mobile':'desktop')+'-mock-review.png'),fullPage:true});assert(dialogs.some(s=>s.includes('交卷')));
  report.browser.push({viewport:mobile?'375x812':'1280x900',practice:mobile?`${ids.length} incorrect; manual explanations; 0/${ids.length}; retry/favorite PASS`:`${ids.length} correct; instant explanations; ${ids.length}/${ids.length} PASS`,ids:seen,tabs:'PASS',randomFlow:'PASS',overflow:'none',mock:'native 180-item selection; two scoped answers; save/reload/resume/flag/submit 1/180/review PASS',mockItems:selected,nativeDialogs:dialogs});
  console.log('PASS',mobile?'mobile':'desktop');await context.close();
 }
 assert.deepEqual(report.errors,[]);fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log('PASS: browser QA and syntax;',out);
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
