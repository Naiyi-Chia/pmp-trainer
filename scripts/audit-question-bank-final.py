"""Issue #27 read-only audit of the current main bank; no question edits.

python -X utf8 scripts/audit-question-bank-final.py [--ref origin/main] [--qa-json file]
python -X utf8 scripts/audit-question-bank-final.py --negative-controls
Reuses the released length/wording definitions, not the #26 mutation contract.
"""
import argparse
import collections
import copy
import hashlib
import json
import re
import runpy
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRIOR = runpy.run_path(str(ROOT / 'scripts/audit-duplicate-cleanup.py'))
CANONICAL = PRIOR['CANONICAL']
BASELINE = {'source': 'https://github.com/Naiyi-Chia/pmp-trainer/issues/8',
            'count': 330, 'unique_longest': 286, 'materially_longer': 271,
            'positions': {'A': 29, 'B': 281, 'C': 16, 'D': 4},
            'exact_duplicate_groups': 38, 'duplicate_ids': 78,
            'wording_correct_distractors': {'評估': [19,0], '分析': [15,0], '檢視': [10,0],
                '協助': [13,0], '共同': [41,0], '立即': [0,41], '直接': [0,48],
                '要求': [1,74], '升級': [0,11]}}
ADDITIONAL = ['只', '所有', '永遠', '僅', '即可', '口頭', '刪除', '一定', '一律', '完全', '不需', '無須']
FIELDS = {'id','domain','approach','topic','q','opts','ans','exp','mindset','difficulty','type'}
ENUMS = {'domain': {'People','Process','Business Environment'},
         'approach': {'Agile','Hybrid','Predictive'}, 'difficulty': {'易','中','難'},
         'type': {'情境題','計算題'}}


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT).decode('utf-8').strip()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def validate_source(authoritative, candidate):
    require(candidate == authoritative, 'source differs from main')


def validate(bank):
    require(len(bank) == 330, 'count')
    require([q['id'] for q in bank] == list(range(1,331)), 'IDs/order')
    explicit, unlabelled = [], []
    for q in bank:
        i = q['id']
        require(set(q) == FIELDS, f'Q-{i}: schema')
        for field, values in ENUMS.items():
            require(q[field] in values, f'Q-{i}: metadata {field}')
        require(isinstance(q['opts'], list) and len(q['opts']) == 4, f'Q-{i}: option count')
        require(type(q['ans']) is int and 0 <= q['ans'] < 4, f'Q-{i}: answer index')
        for value in [q['q'],q['topic'],q['exp'],q['mindset'],*q['opts']]:
            require(isinstance(value,str) and value.strip() and '\ufffd' not in value, f'Q-{i}: empty/invalid text')
        require(len(set(q['opts'])) == 4, f'Q-{i}: repeated option')
        labels = re.findall(r'^\s*([A-D])(?=\s|[：:])', q['exp'])
        labels += re.findall(r'(?:正確答案|答案為|答案是)\s*[:：]?\s*([A-D])\b', q['exp'])
        require(all(label == 'ABCD'[q['ans']] for label in labels), f'Q-{i}: explanation letter')
        (explicit if labels else unlabelled).append(i)
    require(not PRIOR['duplicates'](bank), 'exact duplicate')
    require(not PRIOR['duplicates'](bank, True), 'order-independent duplicate')
    # Also reproduce the parent #8 definition (normalized stem + options, no key).
    signatures = collections.defaultdict(list)
    for q in bank:
        signatures[json.dumps([PRIOR['normalize'](q['q']), [PRIOR['normalize'](o) for o in q['opts']]])].append(q['id'])
    require(not any(len(ids)>1 for ids in signatures.values()), 'normalized stem/options duplicate')
    return {'schema_ids_metadata_options': 'PASS', 'nonempty_explanations_mindsets': 'PASS',
            'explicit_explanation_key_ids': explicit, 'unlabelled_explanation_ids': unlabelled,
            'semantic_limit': 'Letter matching/nonempty text is not semantic proof. Canonicals require targeted disposition; prior content reviews and calculations are supporting evidence only.'}


def wording(bank, terms):
    result = {}
    for term in terms:
        correct = sum(q['opts'][q['ans']].count(term) for q in bank)
        distractors = sum(o.count(term) for q in bank for p,o in enumerate(q['opts']) if p!=q['ans'])
        cp = sum(term in q['opts'][q['ans']] for q in bank)
        dp = sum(term in o for q in bank for p,o in enumerate(q['opts']) if p!=q['ans'])
        result[term] = {'correct_occurrences':correct, 'distractor_occurrences':distractors,
                        'correct_options_with_term':cp, 'distractor_options_with_term':dp,
                        'correct_presence_rate':round(cp/len(bank),4),
                        'distractor_presence_rate':round(dp/(3*len(bank)),4),
                        'correct_ids':[q['id'] for q in bank if term in q['opts'][q['ans']]],
                        'distractor_ids':[q['id'] for q in bank if any(term in o for p,o in enumerate(q['opts']) if p!=q['ans'])]}
    return result


def length_strategies(bank):
    result={'count':len(bank),'uniform_guess_expected_hits':len(bank)/4}
    for name,extreme in [('longest',max),('shortest',min)]:
        credit=0
        for q in bank:
            lengths=[len(re.sub(r'\s','',o)) for o in q['opts']]
            candidates=[i for i,v in enumerate(lengths) if v==extreme(lengths)]
            credit += 1/len(candidates) if q['ans'] in candidates else 0
        result[name]={'expected_hits':round(credit,6),'rate':round(credit/len(bank),6)}
    return result


def negative_controls(bank, source):
    result = []
    cases = [
        ('missing record', lambda b:b.pop(), 'count'),
        ('duplicate ID', lambda b:b[1].__setitem__('id',1), 'IDs/order'),
        ('extra schema field', lambda b:b[0].__setitem__('extra',True), 'schema'),
        ('missing metadata', lambda b:b[0].__setitem__('domain',''), 'metadata'),
        ('three options', lambda b:b[0]['opts'].pop(), 'option count'),
        ('bad answer index', lambda b:b[0].__setitem__('ans',4), 'answer index'),
        ('empty explanation', lambda b:b[0].__setitem__('exp',''), 'empty/invalid text'),
        ('empty mindset', lambda b:b[0].__setitem__('mindset',''), 'empty/invalid text'),
        ('wrong explanation letter', lambda b:b[0].__setitem__('exp','ABCD'[(b[0]['ans']+1)%4]+' 正確：control'), 'explanation letter'),
        ('repeated option', lambda b:b[0]['opts'].__setitem__(1,b[0]['opts'][0]), 'repeated option'),
    ]
    def duplicate(b, reorder=False):
        q=copy.deepcopy(b[0]);q['id']=2
        if reorder:
            q['opts']=q['opts'][1:]+q['opts'][:1];q['ans']=(q['ans']-1)%4
            q['exp']='ABCD'[q['ans']]+' correct control'
        b[1]=q
    cases += [('duplicate record',duplicate,'exact duplicate'),
              ('reordered duplicate',lambda b:duplicate(b,True),'order-independent duplicate')]
    for name, mutate, expected in cases:
        b=copy.deepcopy(bank);mutate(b)
        try: validate(b)
        except ValueError as error:
            require(expected in str(error), f'{name}: unexpected {error}')
            result.append({'case':name,'result':'rejected','reason':str(error)})
        else: raise ValueError(f'{name}: unexpectedly passed')
    try: validate_source(source, source+'\n// changed')
    except ValueError as error: result.append({'case':'application source mutation','result':'rejected','reason':str(error)})
    return result


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ref',default='origin/main')
    parser.add_argument('--qa-json',type=Path)
    parser.add_argument('--negative-controls',action='store_true')
    args=parser.parse_args()
    sha=git('rev-parse',args.ref)
    raw=subprocess.check_output(['git','show',f'{sha}:index.html'],cwd=ROOT)
    text=raw.decode('utf-8').replace('\r\n','\n')
    local=(ROOT/'index.html').read_text(encoding='utf-8')
    validate_source(text, local)
    bank,_=PRIOR['parse'](text)
    checks=validate(bank)
    controls=negative_controls(bank,text)
    if args.negative_controls:
        print(json.dumps(controls,ensure_ascii=False,indent=2));return
    all_ids=[q['id'] for q in bank]
    current=PRIOR['metrics'](bank,all_ids)
    sequence=current['sequence_by_id']
    local_patterns=[]
    for start in range(len(sequence)-11):
        window=sequence[start:start+12]
        periods=[p for p in range(1,5) if all(window[i]==window[i%p] for i in range(12))]
        if periods:local_patterns.append({'first_id':start+1,'last_id':start+12,'sequence':window,'periods':periods})
    canonical=PRIOR['metrics'](bank,CANONICAL)
    byid={q['id']:q for q in bank}
    canonical['questions']=[r|{'topic':byid[r['id']]['topic'], 'correct_text':byid[r['id']]['opts'][byid[r['id']]['ans']],
        'explanation':byid[r['id']]['exp'],'mindset':byid[r['id']]['mindset'],
        'disposition':'Pending Product/Human targeted review; no content edits authorized in this phase'} for r in canonical['questions']]
    # Numeric consistency independently recomputed from actual current stems.
    calc=runpy.run_path(str(ROOT/'scripts/audit-remediation-batch5.py'))['calculations'](bank)
    qa=json.loads(args.qa_json.read_text(encoding='utf-8')) if args.qa_json else None
    fingerprint=hashlib.sha256(text.encode()).hexdigest()
    if qa:require(qa.get('source_sha256_lf',qa['source_sha256'])==fingerprint,'QA fingerprint mismatch')
    result={
        'issue':27,'phase':'audit only; residual disposition pending; not final quality PASS',
        'source':{'audited_ref':args.ref,'audited_commit':sha,'main_commit':git('rev-parse','origin/main'),
                  'dev_commit':git('rev-parse','origin/dev'),'index_blob':git('rev-parse',f'{sha}:index.html'),
                  'sha256_lf':fingerprint,'working_source_matches_audited_main':'PASS',
                  'released_issue26_index_blob':'4f4249d15a1d84fa7cea95e6a5f302d4c75e41c8',
                  'post_release_changed_paths':git('diff','--name-only','41c70e8',sha).splitlines()},
        'published_issue8_baseline':BASELINE,'validation':checks,'negative_controls':controls,
        'current':current,'key_pattern_screen':{'ordering':'ascending stable ID',
            'global':'all periods 1..165', 'local':'12 consecutive IDs; periods 1..4',
            'local_repeated_windows':local_patterns},'protected_canonical_residual':canonical,
        'outside_canonicals':PRIOR['metrics'](bank,[i for i in all_ids if i not in CANONICAL]),
        'wording_screen':wording(bank,list(dict.fromkeys([*BASELINE['wording_correct_distractors'],*ADDITIONAL]))),
        'duplicates':{'exact':PRIOR['duplicates'](bank),'order_independent':PRIOR['duplicates'](bank,True),
                      'parent_normalized_stem_options':'zero groups'},
        'metadata_counts':{f:dict(collections.Counter(q[f] for q in bank)) for f in ENUMS},
        'length_strategy_screen':{'method':'Pick uniformly among raw-character longest/shortest options; descriptive retrospective screen, not rendered geometry or a statistical acceptance test.',
            'whole_bank':length_strategies(bank),
            'canonical':length_strategies([q for q in bank if q['id'] in CANONICAL]),
            'outside_canonical':length_strategies([q for q in bank if q['id'] not in CANONICAL])},
        'recomputed_numeric_items':calc,'fresh_browser_qa':qa,
        'limitations':['Counts/periodicity screen are heuristics, not proof of semantic correctness or absence of exploitable patterns.',
                      'Wording uses occurrences plus option-presence rates; correct/distractor denominators are 330/990.',
                      '38 protected canonicals remain pending disposition; no automatic remediation or Product acceptance.']}
    require(result['source']['index_blob']==result['source']['released_issue26_index_blob'],'released source mismatch')
    require(result['source']['post_release_changed_paths']==['AGENTS.md'],'unexpected post-release change')
    # Keep per-item rows once bank-wide plus the explicit 38-item review table.
    result['outside_canonicals'].pop('questions')
    print(json.dumps(result,ensure_ascii=False,indent=2,default=str))


if __name__=='__main__':main()
