"""Issue #17 pilot audit. Read-only; Python standard library only.

Usage: python scripts/audit-remediation-batch1.py --baseline /path/to/old-index.html
The baseline must be exported from the pre-remediation dev commit.
"""
import argparse
import collections
import json
import re
import statistics
from pathlib import Path

IDS = [17, 18, 21, 23, 26, 45, 59, 70, 71, 104, 110, 162, 170, 171, 188, 202, 204, 268, 299, 301]
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
    for q in bank:
        if q["id"] not in IDS:
            continue
        lengths = [len(re.sub(r"\s", "", option)) for option in q["opts"]]
        correct = lengths[q["ans"]]
        distractors = [n for i, n in enumerate(lengths) if i != q["ans"]]
        median = statistics.median(distractors)
        rows.append({"id": q["id"], "key": "ABCD"[q["ans"]], "lengths": lengths,
                     "ratio": round(correct / median, 2),
                     "unique_longest": correct > max(distractors),
                     "materially_longer": correct >= median * 1.25 and correct - median >= 8})
        for i, option in enumerate(q["opts"]):
            for term in TERMS:
                wording[term]["correct" if i == q["ans"] else "distractors"] += option.count(term)
    rows.sort(key=lambda row: row["id"])
    sequence = "".join(row["key"] for row in rows)
    return {"count": len(rows), "positions": dict(collections.Counter(sequence)),
            "sequence_by_id": sequence,
            "periodic_sequence": any(all(sequence[i] == sequence[i % period]
                                         for i in range(len(sequence))) for period in range(1, 11)),
            "unique_longest": sum(row["unique_longest"] for row in rows),
            "materially_longer": sum(row["materially_longer"] for row in rows),
            "wording_occurrences": wording, "questions": rows}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--baseline", type=Path, required=True)
    parser.add_argument("--current", type=Path, default=Path(__file__).resolve().parents[1] / "index.html")
    args = parser.parse_args()
    before_text, before_match, before = read_bank(args.baseline)
    after_text, after_match, after = read_bank(args.current)
    assert len(before) == len(after) == 330, "Bank size changed"
    assert [q["id"] for q in before] == [q["id"] for q in after], "IDs or order changed"
    assert len({q["id"] for q in after}) == 330, "Duplicate IDs"
    assert sorted(q["id"] for q, r in zip(before, after) if q != r) == IDS, "Changed ID set differs"
    for q, r in zip(before, after):
        assert q.keys() == r.keys(), f"Q-{q['id']}: schema changed"
        assert all(q[k] == r[k] for k in q if k not in EDITABLE), f"Q-{q['id']}: metadata changed"
        assert len(r["opts"]) == 4 and len(set(r["opts"])) == 4
        assert type(r["ans"]) is int and 0 <= r["ans"] < 4
        assert all(isinstance(value, str) and value.strip() and "\ufffd" not in value
                   for value in [r["q"], r["exp"], *r["opts"]]), f"Q-{q['id']}: broken text"
        if r["id"] in IDS:
            assert r["mindset"].strip()
            assert r["exp"].startswith("ABCD"[r["ans"]] + " "), f"Q-{q['id']}: explanation key mismatch"
    def outside(text, match):
        return (text[:match.start(1)] + "QUESTION_BANK" + text[match.end(1):]).rstrip()
    assert outside(before_text, before_match) == outside(after_text, after_match), "Non-bank app changed"
    pre, post = audit(before), audit(after)
    assert post["count"] == 20 and post["materially_longer"] == 0
    assert all(4 <= post["positions"].get(key, 0) <= 6 for key in "ABCD")
    assert not post["periodic_sequence"]
    print(json.dumps({"baseline": str(args.baseline), "before": pre, "after": post,
                      "scope_schema_checks": "PASS", "human_content_review": "PENDING"}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
