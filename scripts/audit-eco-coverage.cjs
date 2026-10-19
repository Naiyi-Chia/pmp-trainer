// node scripts/audit-eco-coverage.cjs [--write]
// Counts primary ECO tasks, not legacy UI domains; never invents task/enabler quotas.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {data,bank,bankHash,root}=require('./question-source.cjs');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/eco-2026.json'),'utf8'));
assert.equal(data.schema_version,2);
const tasks=catalog.tasks.map(t=>({...t,count:bank.filter(q=>q.ecoTask===t.id).length,ids:bank.filter(q=>q.ecoTask===t.id).map(q=>q.id)}));
assert.equal(tasks.reduce((n,t)=>n+t.count,0),bank.length);
const domains=['People','Process','Business Environment'].map(domain=>({domain,count:bank.filter(q=>q.ecoDomain===domain).length}));
const report={schema_version:2,eco_version:'2026',question_bank_sha256:bankHash,question_count:bank.length,
 approved:bank.filter(q=>q.qa.qualityStatus==='approved').length,
 mapping_status:Object.fromEntries(['proposed','reviewed'].map(s=>[s,bank.filter(q=>q.qa.mappingStatus===s).length])),
 enabler_tagged:bank.filter(q=>q.ecoEnabler?.length).length,
 domain_reclassified_ids:bank.filter(q=>q.domain!==q.ecoDomain).map(q=>q.id),domains,tasks,
 gaps:tasks.filter(t=>!t.count).map(t=>t.id),
 limitations:['Mappings are engineering proposals pending independent Content Review. Approved status is inherited from the integrated bank, not new mapping approval.',
 'Counts describe the current practice bank. They are not official task or enabler exam quotas.',
 'Legacy Domain, approach, topic and all question/answer content remain unchanged. No remediation or question expansion is performed.']};
if(process.argv.includes('--write'))fs.writeFileSync(path.join(root,'docs/ECO_TASK_COVERAGE_V2.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({result:'PASS',question_count:bank.length,covered_tasks:tasks.filter(t=>t.count).length,total_tasks:tasks.length,gaps:report.gaps,domains,mapping_status:report.mapping_status}));
