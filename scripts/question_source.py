"""Canonical current data; embedded HTML is supported only for historical inputs."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = ROOT / 'data/questions.json'

def parse_source(text):
    if text.lstrip().startswith('{'):
        data = json.loads(text)
        if type(data.get('schema_version')) is not int or data['schema_version'] not in (1, 2) or type(data.get('question_count')) is not int or data['question_count'] != 330 or not isinstance(data.get('questions'), list) or len(data['questions']) != 330:
            raise ValueError('Canonical bank version/count invalid')
        if data['schema_version'] == 2 and data.get('eco_version') != '2026':
            raise ValueError('Canonical ECO version invalid')
        return data['questions'], 'CANONICAL_DATA'
    match = re.search(r'^const Q=(.*);$', text, re.M)
    if not match:
        raise ValueError('Historical embedded bank not found; use data/questions.json for current audits')
    return json.loads(match[1]), text[:match.start(1)] + 'BANK' + text[match.end(1):]

def read_source(path):
    path = Path(path)
    text = path.read_text(encoding='utf-8-sig')
    if path.suffix == '.html' and 'const Q=[];' in text:
        path = path.parent / 'data/questions.json'
        text = path.read_text(encoding='utf-8-sig')
    bank, _ = parse_source(text)
    match = re.search(r'^const Q=(.*);$', text, re.M) if path.suffix == '.html' else None
    return text, match, bank
