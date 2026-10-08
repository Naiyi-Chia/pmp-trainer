// Standard-library checks of the real runtime authoring/publication validator.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const {data,bank,validate,root}=require('./question-source.cjs');
const clone=v=>JSON.parse(JSON.stringify(v));
const mutations=[
 d=>delete d.eco_version,d=>d.eco_version='2021',d=>d.unexpected=true,
 d=>delete d.questions[0].ecoTask,d=>d.questions[0].ecoTask='people.9',d=>d.questions[0].ecoTask='business.10',
 d=>d.questions[0].ecoDomain='Process',d=>d.questions[0].concept=' ',d=>d.questions[0].concept='�',
 d=>d.questions[0].ecoEnabler=['people.2.e7'],d=>d.questions[0].ecoEnabler=['people.3.e1'],d=>d.questions[0].ecoEnabler=['people.2.e1','people.2.e1'],
 d=>d.questions[0].qa.qualityStatus='published',d=>d.questions[0].qa.revision=0,d=>d.questions[0].qa.mappingStatus='approved',
 d=>d.questions[0].qa.provenance='',d=>d.questions[0].qa.extra=true,d=>d.questions[0].qa.qualityStatus='draft',
 d=>d.questions[0].questionType='multiple-response',d=>d.questions[0].stimulus={kind:'case',caseId:'c1',text:'context'},
 d=>d.questions[0].responseType='single-response'
];
for(const mutate of mutations){const d=clone(data);mutate(d);assert.throws(()=>validate(d));}
const noTags=clone(data);delete noTags.questions[0].ecoEnabler;assert.equal(validate(noTags).length,330);
const tagged=clone(data);tagged.questions[0].ecoEnabler=['people.2.e1'];assert.equal(validate(tagged).length,330);
const valid=[];
for(const kind of ['single-response','multiple-response','case','graphic-based']){
 for(const response of (['case','graphic-based'].includes(kind)?['single-response','multiple-response']:[kind])){
  const q=clone(bank[0]);q.questionType=kind;q.qa.qualityStatus='draft';q.ans=response==='multiple-response'?[0,1]:0;
  if(kind==='case'){q.stimulus={kind:'case',caseId:'case-1',text:'Shared context'};q.responseType=response;}
  if(kind==='graphic-based'){q.stimulus={kind:'graphic',src:'images/example.svg',alt:'Meaningful accessible description'};q.responseType=response;}
  const d={schema_version:2,question_count:1,eco_version:'2026',questions:[q]};assert.equal(validate(d,false).length,1);assert.throws(()=>validate(d));valid.push(d);
  // A complete, approved 330-record future bank must still stay behind the renderer gate.
  const published=clone(data);published.questions[0]=clone(q);published.questions[0].qa.qualityStatus='approved';
  assert.equal(validate(published,false).length,330);
  if(kind==='single-response')assert.equal(validate(published).length,330);else assert.throws(()=>validate(published));
  for(const bad of [response==='multiple-response'?[0,0]:-1,response==='multiple-response'?[0,4]:4,response==='multiple-response'?[0]:[0,1]]){
   const candidate=clone(d);candidate.questions[0].ans=bad;assert.throws(()=>validate(candidate,false));
  }
  if(q.stimulus){const candidate=clone(d);delete candidate.questions[0].stimulus[kind==='case'?'text':'alt'];assert.throws(()=>validate(candidate,false));}
 }
}
for(const status of ['draft','in-review','approved','needs-revision','retired']){
 const candidate=clone(data);candidate.questions[0].qa.qualityStatus=status;
 assert.equal(validate(candidate,false).length,330);
 if(status==='approved')assert.equal(validate(candidate).length,330);else assert.throws(()=>validate(candidate));
}
const mapping=JSON.parse(fs.readFileSync(path.join(root,'data/question-v2-mapping.json'),'utf8'));
const baseline=JSON.parse(cp.execFileSync('git',['show',mapping.baseline_commit+':data/questions.json'],{cwd:root,encoding:'utf8'}));
assert.equal(validate(baseline).length,330); // Rollback compatibility.
for(let i=0;i<bank.length;i++){
 assert.deepEqual(Object.fromEntries(Object.keys(baseline.questions[i]).map(k=>[k,bank[i][k]])),baseline.questions[i]);
 assert.equal(bank[i].concept,bank[i].topic);
}
const schema=JSON.parse(fs.readFileSync(path.join(root,'data/question-schema-v2.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/eco-2026.json'),'utf8'));
assert.deepEqual(schema.$defs.question.properties.ecoTask.enum,catalog.tasks.map(t=>t.id));
for(const t of catalog.tasks){
 const rule=schema.$defs.question.allOf.find(r=>r.if.properties.ecoTask.const===t.id);
 assert.equal(rule.then.properties.ecoDomain.const,t.domain);
 assert.deepEqual(rule.then.properties.ecoEnabler.items.enum,Array.from({length:t.enabler_count},(_,i)=>t.id+'.e'+(i+1)));
 const q=clone(bank[0]);q.ecoTask=t.id;q.ecoDomain=t.domain;q.ecoEnabler=[t.id+'.e'+t.enabler_count];
 const d={schema_version:2,question_count:1,eco_version:'2026',questions:[q]};assert.equal(validate(d,false).length,1);
 q.ecoEnabler=[t.id+'.e'+(t.enabler_count+1)];assert.throws(()=>validate(d,false));
}
if(process.argv.includes('--fixtures'))fs.writeFileSync(process.argv[process.argv.indexOf('--fixtures')+1],JSON.stringify({valid}));
console.log(`PASS: 330 lossless records; v1 rollback; ${mutations.length} metadata/publication controls; 26 task/enabler bounds; six future-format contracts and invalid answer/stimulus controls`);
