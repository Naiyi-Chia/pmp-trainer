// Exercise real loader definitions without initializing or persisting the app.
const assert=require('node:assert/strict'),vm=require('node:vm');
const {definitions,data,bankHash}=require('./question-source.cjs');
function harness(base,fetcher,preview=false){
 const nodes=new Map([['trainerApp',{hidden:true,inert:true}],['bankStartup',{hidden:false}],['bankRetry',{hidden:true}],['bankStartupText',{}]]);
 let initialized=0,timeout;
 const context=vm.createContext({URL,AbortController,fetch:fetcher,setTimeout:fn=>{timeout=fn;return 1;},clearTimeout(){},document:{baseURI:base,getElementById:id=>nodes.get(id)}});
 vm.runInContext(preview?definitions.replaceAll("'pmp2026_v2_history'","'dev:pmp2026_v2_history'"):definitions,context);context.initializeTrainer=()=>initialized++;
 return {run:()=>context.loadQuestionBank(),read:s=>vm.runInContext(s,context),nodes,count:()=>initialized,abort:()=>timeout()};
}
(async()=>{
 for(const [base,preview] of [['https://naiyi-chia.github.io/pmp-trainer/',false],['https://naiyi-chia.github.io/pmp-trainer/dev/',true]]){
  let requested;const h=harness(base,async url=>{requested=url.href;return {ok:true,json:async()=>data};},preview);
  assert.equal(await h.run(),true);assert.equal(requested,preview?'https://raw.githubusercontent.com/Naiyi-Chia/pmp-trainer/dev/data/questions.json':base+'data/questions.json');assert.equal(h.read('LEARNING_STORE'),preview?'dev:pmp2026_v3_learning_history':'pmp2026_v3_learning_history');assert.equal(h.count(),1);assert.equal(h.read('Q.length'),330);assert.equal(h.nodes.get('trainerApp').inert,false);
 }
 for(const response of [{ok:false,status:404},{ok:true,json:async()=>{throw Error('invalid JSON');}},{ok:true,json:async()=>({...data,schema_version:99})}]){
  const h=harness('https://example.test/pmp-trainer/',async()=>response);assert.equal(await h.run(),false);assert.equal(h.count(),0);assert.equal(h.read('Q.length'),0);assert.equal(h.nodes.get('trainerApp').hidden,true);assert.equal(h.nodes.get('bankRetry').hidden,false);
 }
 const h=harness('https://example.test/',(url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('timeout')))));
 const pending=h.run();h.abort();assert.equal(await pending,false);assert.equal(h.count(),0);assert.equal(h.nodes.get('trainerApp').inert,true);
 console.log('PASS: production/dev asset URLs, validated startup gate, HTTP/JSON/version/timeout failures and retry visibility; canonical '+bankHash);
})().catch(e=>{console.error(e);process.exitCode=1;});
