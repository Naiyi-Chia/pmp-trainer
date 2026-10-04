"""Read-only Issue #24 audit; same length/wording heuristics as Batch 1.

Export the pre-change 221c793:index.html to a UTF-8 file, then run:
python -X utf8 scripts/audit-remediation-batch4.py --baseline <baseline.html>
No third-party packages. Semantic content review remains a separate gate.
"""
from question_source import read_source, CANONICAL
import argparse
import collections
import itertools
import json
import re
import runpy
import statistics
from pathlib import Path

IDS = [1, 2, 3, 4, 7, 8, 9, 10, 13, 14, 16, 22, 27, 30, 31, 33, 38, 39, 42, 47, 53, 57, 58, 68, 85, 87, 105, 107, 115, 117, 125, 127, 145, 147, 168, 175, 177, 182, 189, 191, 196, 203, 205, 210, 211, 224, 225, 263, 269, 274, 280, 285, 291, 296, 302, 307, 313, 318, 324, 329]
TERMS = ["評估", "分析", "檢視", "協助", "共同", "立即", "直接", "要求", "升級"]
EDITABLE = {"q", "opts", "ans", "exp", "mindset"}


def read_bank(path):
    return read_source(path)

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
                     "unique_shortest": correct < min(distractors),
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
            "unique_shortest": sum(row["unique_shortest"] for row in rows),
            "materially_longer": sum(row["materially_longer"] for row in rows),
            "wording_occurrences": wording, "questions": rows}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--baseline", type=Path, required=True)
    parser.add_argument("--current", type=Path, default=CANONICAL)
    parser.add_argument("--preflight", action="store_true", help="Check baseline candidate priority without requiring edits")
    args = parser.parse_args()
    bt, bm, before = read_bank(args.baseline)
    if args.preflight:
        treated = set()
        for number in (1, 2, 3):
            treated.update(runpy.run_path(str(Path(__file__).with_name(f"audit-remediation-batch{number}.py")))["IDS"])
        groups = collections.defaultdict(list)
        for q in before:
            groups[json.dumps([q["q"], q["opts"], q["ans"]], ensure_ascii=False)].append(q["id"])
        duplicates = {i for group in groups.values() if len(group) > 1 for i in group}
        pool = [q for q in before if q["id"] not in treated | duplicates]
        def ratio(q):
            lengths = [len(re.sub(r"\s", "", option)) for option in q["opts"]]
            return lengths[q["ans"]] / statistics.median(n for i, n in enumerate(lengths) if i != q["ans"])
        ranked = sorted(pool, key=ratio, reverse=True)
        assert len(before) == 330 and len({q["id"] for q in before}) == 330
        assert {q["id"] for q in ranked[:60]} == set(IDS), "Candidate priority changed: update Issue before editing"
        print(json.dumps({"candidate_priority": "PASS", "remaining_pool": len(pool),
                          "duplicate_groups": sum(len(group) > 1 for group in groups.values()),
                          "duplicate_ids": len(duplicates), "next_candidate": ranked[60]["id"],
                          "before": audit(before)}, ensure_ascii=False, indent=2))
        return
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
    if bm is not None and am is not None: assert outside(bt, bm) == outside(at, am), "Non-bank application changed"
    pre, post = audit(before), audit(after)
    assert post["count"] == 60 and post["materially_longer"] == 0
    assert all(12 <= post["positions"].get(key, 0) <= 18 for key in "ABCD")
    assert not post["periodic_sequence"]
    assert post["longest_same_key_run"] <= 3
    # No new exact stem+options+key duplicates; pre-existing groups are outside this task.
    signatures = collections.defaultdict(list)
    for q in after:
        signatures[json.dumps([q["q"], q["opts"], q["ans"]], ensure_ascii=False)].append(q["id"])
    assert not any(len(ids) > 1 and set(ids).intersection(IDS) for ids in signatures.values())
    print(json.dumps({"baseline": str(args.baseline), "changed_ids": changed,
                      "scope_schema_checks": "PASS", "application_guard": "historical HTML only; canonical data edits require scoped git diff review", "before": pre, "after": post,
                      "semantic_review": "See review document; human acceptance remains separate"},
                     ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
