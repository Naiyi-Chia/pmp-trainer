// Run: node scripts/test-mock-persistence.cjs (standard library only).
// Executes the real inline application with a minimal DOM/storage/clock harness.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
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
    window:{localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
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
let a = app();
a.run('startMock();answerMock(M[0].ans);toggleMockFlag();mockNext();answerMock((M[1].ans+1)%4);mockNext();');
const saved = JSON.parse(storage.get(KEY));
assert.equal(saved.version,6);
assert.equal(saved.currentIndex,2);
assert.equal(saved.questionIds.length,180);
assert.equal(Object.keys(saved.answers).length,2);
assert.equal(saved.flags[saved.questionIds[0]],true);
assert.equal(a.run('validSavedMock(loadSavedMock())'),true);
const stateText=storage.get(KEY);

// Actual fresh application context represents reload; no application globals survive.
now += 61000;
a = app();
a.run('resumeMock()');
assert.deepEqual(json(a.run('M.map(q=>q.id)')),saved.questionIds);
assert.deepEqual(json(a.run('mAns')),saved.answers);
assert.deepEqual(json(a.run('mFlag')),saved.flags);
assert.equal(a.run('mi'),2);
assert.equal(a.run('mStartedAt'),saved.startedAt);
assert.equal(a.run('mEndAt'),saved.endAt);
assert.equal(a.run('mRemain'),14339);
assert.equal(a.element('mTimer').textContent,'238:59');
assert.equal(a.run('mAns[M[2].id]'),undefined);
a.run('gotoMock(0)');
assert(a.element('mopts').innerHTML.includes('opt selected'));
assert.equal(a.element('flagBtn').textContent,'★ 已標記');

// Cancelled overwrite and discard preserve the save; accepted discard removes only the mock.
a.context.confirmAnswer=false;
const beforeCancel=storage.get(KEY);
a.run('startMock();discardSavedMock()');
assert.equal(storage.get(KEY),beforeCancel);
assert(a.confirmations.some(s=>s.includes('覆蓋舊進度')));
a.context.confirmAnswer=true;
a.run('discardSavedMock()');
assert.equal(storage.has(KEY),false);
assert(storage.has('pmp2026_v2_history'));

// Legacy and malformed data are explicitly rejected, preserved for user disposal, never restored.
for (const value of [JSON.stringify({...saved,version:5,questionSignature:undefined}),'{broken',JSON.stringify({...saved,version:99})]) {
  storage.set(KEY,value); a=app();
  assert.equal(a.element('resumeMockBtn').disabled,true);
  assert(a.element('resumeMockText').textContent.includes('不能繼續') || a.element('resumeMockText').textContent.includes('無法安全恢復'));
  a.run('resumeMock()');
  assert.equal(a.run('M.length'),0);
  assert.equal(a.run('mEndAt'),null);
  assert.equal(storage.get(KEY),value);
}

// Simulate a deployment with reordered options and corresponding key, not just a bad index.
storage.set(KEY,stateText); a=app();
a.run(`const changed=Q.find(q=>q.id===${saved.questionIds[0]});
  const oldKey=changed.ans; [changed.opts[0],changed.opts[1]]=[changed.opts[1],changed.opts[0]];
  changed.ans=oldKey===0?1:oldKey===1?0:oldKey; refreshMockResumeUI();`);
assert.equal(a.element('resumeMockBtn').disabled,true);
assert(a.element('resumeMockText').textContent.includes('選項順序已更新'));
assert.equal(a.run('restoreMockState(loadSavedMock())'),false);
assert.equal(a.run('M.length'),0);
assert.equal(a.timers.size,0);

// Validate corrupted position/timestamps/answers/flags/IDs and edited stems/keys as well.
const invalidStates=[
  {...saved,currentIndex:180}, {...saved,currentIndex:0.5}, {...saved,endAt:null},
  {...saved,startedAt:null}, {...saved,savedAt:null}, {...saved,questionSignature:''},
  {...saved,answers:{[saved.questionIds[0]]:4}}, {...saved,answers:{999:0}},
  {...saved,answers:[]}, {...saved,flags:{[saved.questionIds[0]]:'true'}},
  {...saved,questionIds:saved.questionIds.map(()=>saved.questionIds[0])}
];
for(const state of invalidStates){storage.set(KEY,JSON.stringify(state));a=app();assert.equal(a.run('validSavedMock(loadSavedMock())'),false);}
for(const edit of ['q += " updated"','ans = (changed.ans+1)%4','exp += " updated"']){
  storage.set(KEY,stateText);a=app();a.run(`const changed=Q.find(q=>q.id===${saved.questionIds[0]});changed.${edit}`);
  assert.equal(a.run('restoreMockState(loadSavedMock())'),false);
}
// Bank array ordering and unrelated items do not invalidate this particular mock.
storage.set(KEY,stateText);a=app();a.run('Q.reverse();Q.find(q=>!loadSavedMock().questionIds.includes(q.id)).q+=" updated"');
assert.equal(a.run('restoreMockState(loadSavedMock())'),true);

// Submit resumed answers: exactly one correct, one wrong; review adds no history/timer.
storage.set(KEY,stateText);a=app();a.run('resumeMock();finishMock()');
assert(a.element('mockResult').innerHTML.includes('1 / 180'));
assert(!/Infinity|NaN/.test(a.element('mockResult').innerHTML));
const domainCounts=a.run('Object.fromEntries([...new Set(M.map(q=>q.domain))].map(d=>[d,M.filter(q=>q.domain===d).length]))');
const correctDomain=a.run('M[0].domain');
assert(a.element('mockResult').innerHTML.includes(`<b>${Math.round(100/domainCounts[correctDomain])}%</b>`));
assert.equal(storage.has(KEY),false);
const history=storage.get('pmp2026_v2_history');
const records=JSON.parse(history);
assert.equal(records[saved.questionIds[0]].attempts,1);
assert.equal(records[saved.questionIds[0]].correct,1);
assert.equal(records[saved.questionIds[1]].correct,0);
a.run('reviewMock();answerPractice(0);finishMock(true)');
a.events.beforeunload();
a.context.document.hidden=true;a.events.visibilitychange();
a.context.document.hidden=false;a.events.visibilitychange();
assert.equal(storage.has(KEY),false,'submitted exam must not resurrect on unload');
assert.equal(storage.get('pmp2026_v2_history'),history);
assert.equal(a.run('pReview'),true);
assert.equal(a.run('pTick'),null);
assert.equal(a.run('pResult'),null);
assert.equal(a.timers.size,0);
assert(a.element('pexp').innerHTML.includes('答對'));
assert.deepEqual(json(a.run('pAns')),saved.answers);

// Expired but compatible state grades once immediately, never extends the deadline.
storage.set(KEY,stateText);now=saved.endAt+1000;a=app();a.run('resumeMock()');
assert.equal(storage.has(KEY),false);
assert.equal(a.timers.size,0);
assert(a.element('mockResult').innerHTML.includes('1 / 180'));
console.log('PASS: save/reload/resume, legacy/corruption/reorder rejection, flags/position/deadline, overwrite/discard, submit/review, expired resume, no duplicate history/resurrection');
