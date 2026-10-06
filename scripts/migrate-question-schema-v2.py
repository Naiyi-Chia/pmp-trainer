"""Lossless #30 migration; explicit record mappings are checked against the integrated baseline.

python -X utf8 scripts/migrate-question-schema-v2.py --check
python -X utf8 scripts/migrate-question-schema-v2.py --write
No network, content inference, approval, or changes to user storage.
"""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEGACY_FIELDS = ('id', 'domain', 'approach', 'topic', 'q', 'opts', 'ans', 'exp', 'difficulty', 'type', 'mindset')


def fingerprint(record):
    return hashlib.sha256(json.dumps(record, ensure_ascii=False, separators=(',', ':')).encode()).hexdigest()


def migrate(source, mapping):
    if source.get('schema_version') != 1 or source.get('question_count') != 330 or len(source.get('questions', [])) != 330:
        raise ValueError('Migration requires the 330-record v1 baseline')
    entries = mapping['questions']
    if [q['id'] for q in entries] != [q['id'] for q in source['questions']]:
        raise ValueError('Mapping IDs/order must match the baseline exactly')
    catalog = json.loads((ROOT / 'data/eco-2026.json').read_text(encoding='utf-8'))
    tasks = {t['id']: t for t in catalog['tasks']}
    migrated = []
    for q, entry in zip(source['questions'], entries):
        if set(q) != set(LEGACY_FIELDS) or fingerprint(q) != entry['legacy_sha256']:
            raise ValueError(f"Q-{q['id']}: stale mapping/content fingerprint")
        if entry['ecoTask'] not in tasks or tasks[entry['ecoTask']]['domain'] != entry['ecoDomain'] or entry['concept'] != q['topic'] or not entry['rationale'].strip():
            raise ValueError(f"Q-{q['id']}: missing or inconsistent mapping")
        migrated.append({**q, **{k: entry[k] for k in ('ecoDomain', 'ecoTask', 'ecoEnabler', 'concept')},
                         'questionType': 'single-response',
                         'qa': {'qualityStatus': 'approved', 'revision': 1,
                                'provenance': 'integrated-dev:' + mapping['baseline_commit'],
                                'mappingStatus': mapping['mapping_status']}})
    return {'schema_version': 2, 'question_count': 330, 'eco_version': '2026', 'questions': migrated}


def expected():
    mapping = json.loads((ROOT / 'data/question-v2-mapping.json').read_text(encoding='utf-8'))
    source = json.loads(subprocess.check_output(['git', 'show', mapping['baseline_commit'] + ':data/questions.json'], cwd=ROOT))
    return source, migrate(source, mapping)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true')
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    if args.write and args.check:
        parser.error('Choose --write or --check')
    path = ROOT / 'data/questions.json'
    current = json.loads(path.read_text(encoding='utf-8'))
    source, target = expected()
    if args.write:
        if current not in (source, target):
            raise ValueError('Refusing to overwrite content or metadata changed since the mapping baseline')
        path.write_text(json.dumps(target, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    elif current != target:
        raise ValueError('Canonical bank does not match the deterministic v2 migration')
    restored = [{k: q[k] for k in LEGACY_FIELDS} for q in target['questions']]
    if restored != source['questions']:
        raise ValueError('Legacy information loss')
    print('PASS: 330/330 ordered legacy records unchanged; explicit ECO mappings; deterministic v2 migration')


if __name__ == '__main__':
    main()
