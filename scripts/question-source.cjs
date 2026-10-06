// Canonical bank + real runtime source for Node QA. Never embeds another bank.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const definitions=source.replace(/^loadQuestionBank\(\);$/m,'');
const context=vm.createContext({});vm.runInContext(definitions,context);
function validate(data){return context.validateQuestionBank(data);}
const data=JSON.parse(fs.readFileSync(path.join(root,'data/questions.json'),'utf8'));
const bank=validate(data);
const bankHash=crypto.createHash('sha256').update(JSON.stringify(bank)).digest('hex');
const testSource=definitions+'\nQ.push(...validateQuestionBank('+JSON.stringify(data)+'));initializeTrainer();';
function serve(req,res,appHtml=html,canonical=data){
 if(new URL(req.url,'http://localhost').pathname==='/favicon.ico'){res.statusCode=204;res.end();}
 else if(new URL(req.url,'http://localhost').pathname.endsWith('/data/questions.json')){res.setHeader('Content-Type','application/json;charset=utf-8');res.end(JSON.stringify(canonical));}
 else if(req.url==='/'||new URL(req.url,'http://localhost').pathname.endsWith('/index.html')){res.setHeader('Content-Type','text/html;charset=utf-8');res.end(appHtml);}
 else{res.statusCode=404;res.end('Not found');}
}
module.exports={root,html,source,definitions,testSource,data,bank,bankHash,validate,serve};
