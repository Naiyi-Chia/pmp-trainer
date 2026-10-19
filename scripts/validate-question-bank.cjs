// node scripts/validate-question-bank.cjs [--parity | --authoring <v2-file>]
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const {bank,bankHash,data,validate,root}=require('./question-source.cjs');
if(process.argv.includes('--authoring')){
 const file=process.argv[process.argv.indexOf('--authoring')+1];
 assert(file,'--authoring requires a JSON file');assert(!process.argv.includes('--parity'),'authoring and parity are separate contracts');
 const candidate=JSON.parse(fs.readFileSync(file,'utf8'));assert.equal(candidate.schema_version,2);
 const questions=validate(candidate,false);
 console.log('PASS: v2 authoring contract; '+questions.length+' records; future formats validated without enabling renderers');
 process.exit(0);
}
assert.equal(bank.length,330);assert.deepEqual(bank.map(q=>q.id),Array.from({length:330},(_,i)=>i+1));
if(process.argv.includes('--parity')){
 const fixture=JSON.parse(fs.readFileSync(path.join(root,'docs/QUESTION_BANK_MIGRATION_BASELINE.json'),'utf8'));
 const oldHtml=execFileSync('git',['show',fixture.baseline_commit+':index.html'],{cwd:root,encoding:'utf8'});
 // Historical migration boundary only. Current tools always read data/questions.json.
 const old=JSON.parse(oldHtml.match(/^const Q=(.*);\r?$/m)[1]);
 assert.deepEqual(bank,old);assert.equal(bankHash,fixture.ordered_records_sha256);
 for(let i=0;i<bank.length;i++)assert.deepEqual(Object.keys(bank[i]),Object.keys(old[i]));
 console.log('PASS: 330/330 exact ordered records/fields match reachable migration baseline '+fixture.baseline_commit);
}
const mutations=[d=>d.schema_version=99,d=>d.question_count=329,d=>d.questions.pop(),d=>d.questions[1].id=d.questions[0].id,d=>delete d.questions[0].mindset,d=>d.questions[0].ans=4,d=>d.questions[0].opts=[],d=>d.questions[0].opts[1]=d.questions[0].opts[0],d=>d.questions[0].q='',d=>d.questions[0].id=0];
for(const mutate of mutations){const candidate=JSON.parse(JSON.stringify(data));mutate(candidate);assert.throws(()=>validate(candidate));}
console.log('PASS: schema/count/unique IDs/required fields/options/keys; 10 invalid-bank controls rejected; bank SHA256 '+bankHash);
