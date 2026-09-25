"""Read-only Issue #23 audit; same length/wording heuristics as Batch 1.

Export the pre-change 4265866:index.html to a UTF-8 file, then run:
python -X utf8 scripts/audit-remediation-batch3.py --baseline <baseline.html>
No third-party packages. Semantic content review remains a separate gate.
"""
import argparse
import collections
import itertools
import json
import re
import statistics
from pathlib import Path

IDS = [
    5, 6, 12, 19, 34, 35, 37, 40, 50, 51, 55, 60,
    62, 64, 65, 67, 69, 72, 84, 114, 124, 144, 158, 169,
    183, 186, 197, 200, 214, 264, 265, 267, 272, 273, 275, 276,
    278, 283, 284, 286, 287, 289, 294, 295, 297, 298, 300, 305,
    306, 308, 309, 311, 316, 317, 319, 320, 322, 327, 328, 330,
]
TERMS = ["評估", "分析", "檢視", "協助", "共同", "立即", "直接", "要求", "升級"]
EDITABLE = {"q", "opts", "ans", "exp", "mindset"}


def read_bank(path):
    text = path.read_text(encoding="utf-8-sig")
    match = re.search(r"^const Q=(.*);$", text, re.M)
    if not match:
        raise ValueError(f"Question bank not found: {path}")
    return text, match, json.loads(match[1])


def audit(bank):
    rows = []
    wording = {term: {"correct": 0, "distractors": 0} for term in TERMS}
    for q in sorted((q for q in bank if q["id"] in IDS), key=lambda q: q["id"]):
        lengths = [len(re.sub(r"\s", "", option)) for option in q["opts"]]
        correct = lengths[q["ans"]]
        distractors = [n for i, n in enumerate(lengths) if i != q["ans"]]
        median = statistics.median(distractors)
        rows.append({"id": q["id"], "key": "ABCD"[q["ans"]], "lengths": lengths,
                     "ratio": round(correct / median, 2),
                     "unique_longest": correct > max(distractors),
                     "materially_longer": correct >= 1.25 * median and correct - median >= 8})
        for i, option in enumerate(q["opts"]):
            for term in TERMS:
                wording[term]["correct" if i == q["ans"] else "distractors"] += option.count(term)
    sequence = "".join(row["key"] for row in rows)
    return {"count": len(rows), "positions": dict(collections.Counter(sequence)),
            "sequence_by_id": sequence,
            "periodic_sequence": any(all(sequence[i] == sequence[i % period] for i in range(len(sequence)))
                                     for period in range(1, len(sequence) // 2 + 1)),
            "longest_same_key_run": max(len(list(group)) for _, group in itertools.groupby(sequence)),
            "unique_longest": sum(row["unique_longest"] for row in rows),
            "materially_longer": sum(row["materially_longer"] for row in rows),
            "wording_occurrences": wording, "questions": rows}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--baseline", type=Path, required=True)
    parser.add_argument("--current", type=Path, default=Path(__file__).resolve().parents[1] / "index.html")
    args = parser.parse_args()
    bt, bm, before = read_bank(args.baseline)
    at, am, after = read_bank(args.current)
    assert len(before) == len(after) == 330, "Question count changed"
    assert [q["id"] for q in before] == [q["id"] for q in after], "IDs/order changed"
    assert len({q["id"] for q in after}) == 330, "Duplicate IDs"
    changed = [r["id"] for q, r in zip(before, after) if q != r]
    assert sorted(changed) == IDS, f"Changed-question scope differs: {changed}"
    for q, r in zip(before, after):
        assert q.keys() == r.keys(), f"Q-{r['id']}: schema changed"
        assert all(q[k] == r[k] for k in q if k not in EDITABLE), f"Q-{r['id']}: metadata changed"
        assert len(r["opts"]) == len(set(r["opts"])) == 4, f"Q-{r['id']}: options invalid"
        assert type(r["ans"]) is int and 0 <= r["ans"] < 4, f"Q-{r['id']}: invalid answer"
        assert all(isinstance(t, str) and t.strip() and "\ufffd" not in t
                   for t in [r["q"], *r["opts"], r["exp"], r["mindset"]]), f"Q-{r['id']}: text invalid"
        if r["id"] in IDS:
            assert r["exp"].startswith("ABCD"[r["ans"]] + " "), f"Q-{r['id']}: explanation key mismatch"
            assert set(re.findall(r"\b[A-D]\b", r["exp"])) == set("ABCD"), f"Q-{r['id']}: missing option rationale"
    def outside(text, match):
        return text[:match.start(1)] + "QUESTION_BANK" + text[match.end(1):]
    assert outside(bt, bm) == outside(at, am), "Non-bank application changed"
    pre, post = audit(before), audit(after)
    assert post["count"] == 60 and post["materially_longer"] == 0
    assert all(12 <= post["positions"].get(key, 0) <= 18 for key in "ABCD")
    assert not post["periodic_sequence"]
    # No new exact stem+options+key duplicates; pre-existing groups are outside this task.
    signatures = collections.defaultdict(list)
    for q in after:
        signatures[json.dumps([q["q"], q["opts"], q["ans"]], ensure_ascii=False)].append(q["id"])
    assert not any(len(ids) > 1 and set(ids).intersection(IDS) for ids in signatures.values())
    print(json.dumps({"baseline": str(args.baseline), "changed_ids": changed,
                      "scope_schema_application_checks": "PASS", "before": pre, "after": post,
                      "semantic_review": "See review document; human acceptance remains separate"},
                     ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
