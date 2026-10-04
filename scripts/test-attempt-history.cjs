// Run: node scripts/test-attempt-history.cjs (standard library only).
// Executes the real inline application with a minimal DOM/storage/clock harness.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = require('./question-source.cjs').testSource;
const KEY = 'pmp2026_v5_active_mock';
const storage = new Map();
let now = 1800000000000;
function app() {
  const nodes = new Map(), events = {}, timers = new Map(), confirmations = [];
  let sequence = 0;
  function element(id) {
    if (!nodes.has(id)) {
      const classes = new Set();
      nodes.set(id, {textContent:'', innerHTML:'', value:'', style:{}, disabled:false,
        classList:{add:c=>classes.add(c), remove:c=>classes.delete(c), contains:c=>classes.has(c),
          toggle:(c,on)=>on ? classes.add(c) : classes.delete(c)},
        setAttribute(){}, focus(){}, click(){}});
    }
    return nodes.get(id);
  }
  const context = vm.createContext({
    console, Date:class extends Date {static now(){return now;}},
    window:{localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>{if(context.failWrites)throw Error('quota');storage.set(k,v);},removeItem:k=>storage.delete(k)},
      addEventListener:(name,fn)=>events[name]=fn},
    document:{hidden:false,getElementById:element,querySelector:element,querySelectorAll:()=>[],
      addEventListener:(name,fn)=>events[name]=fn},
    confirm:message=>{confirmations.push(message);return context.confirmAnswer;}, confirmAnswer:true,
    alert:message=>element('alert').textContent=message,
    setTimeout:()=>0, clearTimeout(){},
    setInterval:fn=>{timers.set(++sequence,fn);return sequence;},clearInterval:id=>timers.delete(id)
  });
  vm.runInContext(source, context);
  assert(!element('runtimeStatusText').textContent.includes('啟動失敗'));
  return {run:code=>vm.runInContext(code,context), element, events, timers, confirmations, context};
}
const json = value=>JSON.parse(JSON.stringify(value));
const HISTORY='pmp2026_v2_history',LEARNING='pmp2026_v3_learning_history';
const legacy={1:{attempts:4,correct:2,lastCorrect:false,lastAt:now-1000,star:true},2:{star:true},999:{attempts:2,correct:1,lastCorrect:true,star:false}};
storage.set(HISTORY,JSON.stringify(legacy));let a=app();
assert.deepEqual(json(a.run('L.legacyHistory')),legacy);
assert.equal(a.run('L.events.length'),0,'migration must not fabricate attempts');
assert.equal(a.run('H[1].attempts'),4);assert.equal(a.run('H[999].correct'),1);
assert.equal(a.run('H[2].star'),true);assert.equal(a.run('H[2].attempts'),0);
const migrated=storage.get(LEARNING);a=app();assert.equal(storage.get(LEARNING),migrated,'migration is idempotent');
// An older client changing its compatibility key must not be silently overwritten.
const mirror=storage.get(HISTORY),oldClient={...legacy,1:{...legacy[1],attempts:5,correct:3,star:false}};
storage.set(HISTORY,JSON.stringify(oldClient));a=app();assert.equal(a.run('historyBlocked'),true);
assert.equal(storage.get(HISTORY),JSON.stringify(oldClient));assert.equal(storage.get(LEARNING),migrated);
storage.set(HISTORY,mirror);a=app();assert.equal(a.run('historyBlocked'),false);

function practice(id){a.run(`P=[Q.find(q=>q.id===${id})];pi=0;pAns={};pReview=false;pResult=null;pSession=newAttemptSession();pTiming={};renderPractice()`);}
practice(1);now+=1200;a.run('answerPractice(P[0].ans);answerPractice(0)');
assert.equal(a.run('L.events.length'),1);assert.equal(a.run('L.events[0].firstEncounter'),false);
assert.equal(a.run('L.events[0].responseMs'),1200);assert.equal(a.run('H[1].attempts'),5);
practice(2);now+=500;a.run('answerPractice((P[0].ans+1)%4)');
assert.equal(a.run('L.events[1].firstEncounter'),true,'star alone is not prior encounter');
practice(2);now+=300;a.run('answerPractice(P[0].ans)');assert.equal(a.run('L.events[2].firstEncounter'),false);
assert.equal(a.run('H[2].attempts'),2);assert.equal(a.run('H[2].star'),true);
const eventCount=a.run('L.events.length');a.run('pReview=true;answerPractice(0);showPracticeExplanation()');assert.equal(a.run('L.events.length'),eventCount);

// Visible exposure accumulates across visits; hidden/settings/other tabs exclude idle time.
practice(3);now+=200;a.context.document.hidden=true;a.events.visibilitychange();now+=10000;
a.context.document.hidden=false;a.element('practice').classList.add('active');a.events.visibilitychange();now+=100;
a.run('showPracticeSettings()');now+=3000;a.run('returnToPractice();renderPractice()');now+=400;
a.run('answerPractice(P[0].ans)');assert.equal(a.run('L.events.at(-1).responseMs'),700);
const exported=json(a.run('progressExport()'));const original=json(a.run('H'));
assert.equal(exported.version,3);assert.deepEqual(exported.history,original);
a.run(`const roundtrip=decodeProgress(${JSON.stringify(exported)});replaceLearning(roundtrip)`);
assert.deepEqual(json(a.run('H')),original);
for(const fixture of [{version:2,history:legacy},legacy,{history:legacy}]){
 assert.equal(a.run(`decodeProgress(${JSON.stringify(fixture)}).events.length`),0);
}
// All invalid imports are rejected before mutating existing in-memory or stored data.
const before=storage.get(LEARNING);
const invalid=[{version:99,history:legacy},{version:2,history:[]},{version:2,history:{1:{attempts:1,correct:2}}},
 {...exported,learningHistory:{...exported.learningHistory,events:[...exported.learningHistory.events,exported.learningHistory.events[0]]}},
 {...exported,learningHistory:{...exported.learningHistory,events:[{...exported.learningHistory.events[0],firstEncounter:true}]}},
 {...exported,learningHistory:{...exported.learningHistory,events:[{...exported.learningHistory.events[0],responseMs:-1}]}}];
for(const fixture of invalid)assert.throws(()=>a.run(`decodeProgress(${JSON.stringify(fixture)})`));
assert.equal(storage.get(LEARNING),before);assert.deepEqual(json(a.run('H')),original);
a.context.failWrites=true;assert.equal(a.run('replaceLearning(emptyLearning())'),false);assert.deepEqual(json(a.run('H')),original);a.context.failWrites=false;

// Mock edits are provisional; final answer and timing survive reload; Review is read-only.
a.run('startMock()');const mockId=a.run('M[0].id');now+=250;a.run('answerMock((M[0].ans+1)%4)');now+=150;a.run('answerMock(M[0].ans);mockNext()');
const pending=storage.get(KEY);const priorCount=a.run('L.events.length');assert.equal(priorCount,4);
const validPending=JSON.parse(pending);
for(const tracking of [{sessionId:'',timing:{}},{sessionId:'test',timing:{999:{elapsedMs:1,responseMs:null,answeredAt:null}}},{sessionId:'test',timing:{[mockId]:{elapsedMs:-1,responseMs:null,answeredAt:null}}}]){
 assert.equal(a.run(`validSavedMock(${JSON.stringify({...validPending,attemptTracking:tracking})})`),false);
}
now+=10000;a=app();a.run('resumeMock()');assert.equal(a.run('mTiming[M[0].id].responseMs'),400);
now+=200;a.run('answerMock((M[1].ans+1)%4)');const secondId=a.run('M[1].id');
a.run('finishMock()');assert.equal(a.run('L.events.length'),priorCount+2);
const mockEvents=json(a.run('L.events.slice(-2)'));assert.equal(mockEvents[0].mode,'mock');assert.equal(mockEvents[0].correct,true);assert.equal(mockEvents[0].responseMs,400);assert.equal(mockEvents[1].responseMs,200);
const committed=storage.get(LEARNING);a.run('reviewMock();answerPractice(0);finishMock(true)');assert.equal(storage.get(LEARNING),committed);
// Stale save replay after a crash cannot duplicate an already committed session.
storage.set(KEY,pending);a=app();a.run('resumeMock();finishMock()');assert.equal(a.run('L.events.length'),priorCount+2);
assert.equal(a.run(`H[${mockId}].attempts`),original[mockId]?.attempts+1||1);

// Discard/overwrite and unanswered questions never create events.
a.run('startMock();answerMock(0)');const count=a.run('L.events.length');a.run('discardSavedMock();startMock();finishMock()');assert.equal(a.run('L.events.length'),count);
// Existing version:6 saves without tracking remain resumable; missing timing is unknown.
storage.set(KEY,pending);const old=JSON.parse(pending);delete old.attemptTracking;storage.set(KEY,JSON.stringify(old));a=app();a.run('resumeMock();finishMock()');
assert.equal(a.run('L.events.at(-1).responseMs'),null);
storage.set(KEY,JSON.stringify(old));a=app();a.run('resumeMock();gotoMock(0)');now+=200;a.run('answerMock(M[0].ans)');
assert.equal(a.run('mTiming[M[0].id].responseMs'),null,'unknown pre-upgrade exposure stays unknown after an answer edit');

// Submission storage failure preserves the active save; retry writes each event once.
a.run('startMock()');now+=100;a.run('answerMock(M[0].ans)');a.context.failWrites=true;a.run('finishMock()');
assert(storage.has(KEY));const failedCount=a.run('L.events.length');assert(a.element('alert').textContent.includes('尚未儲存'));
a.context.failWrites=false;a.run('finishMock()');assert.equal(a.run('L.events.length'),failedCount);assert(!storage.has(KEY));
a=app();assert.equal(a.run('L.events.length'),failedCount);
// A reload while the previous commit failed reconstructs from the retained Mock.
a.run('startMock();answerMock(M[0].ans)');const diskCount=a.run('L.events.length');a.context.failWrites=true;a.run('finishMock()');a=app();a.run('resumeMock();finishMock()');assert.equal(a.run('L.events.length'),diskCount+1);assert(!storage.has(KEY));
// Corrupt/future stored models are preserved byte-for-byte, never silently overwritten.
for(const raw of ['{broken',JSON.stringify({version:99}),JSON.stringify({...exported.learningHistory,events:[{bad:true}]})]){
 storage.set(LEARNING,raw);const backup=storage.get(HISTORY);a=app();assert.equal(a.run('historyBlocked'),true);assert.equal(storage.get(LEARNING),raw);assert.equal(storage.get(HISTORY),backup);
 assert.equal(a.run('safeSave(H)'),false);assert.equal(storage.get(LEARNING),raw);
}
storage.delete(LEARNING);storage.set(HISTORY,'{bad');a=app();assert.equal(a.run('historyBlocked'),true);assert.equal(storage.get(HISTORY),'{bad');
assert.equal(a.run(`replaceLearning(decodeProgress(${JSON.stringify({version:2,history:legacy})}))`),true);assert.equal(a.run('H[1].star'),true);
a.run('resetAll()');assert.equal(a.run('L.events.length'),0);assert.equal(a.run('Object.keys(H).length'),0);a=app();assert.equal(a.run('Object.keys(H).length'),0);
console.log('PASS: migration/idempotence/legacy preservation, first/repeat events, visible timing, v2/raw/v3 imports/exports, invalid data and quota preservation, native Mock reload/final-answer/discard/submit/dedupe, read-only Review');
