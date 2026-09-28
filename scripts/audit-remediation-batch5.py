"""Read-only Issue #25 audit; same length/wording heuristics as Batch 1.

Export the pre-change f7170e9:index.html to a UTF-8 file, then run:
python -X utf8 scripts/audit-remediation-batch5.py --baseline <baseline.html>
No third-party packages. Semantic content review remains a separate gate.
"""
import argparse
import collections
import itertools
import json
import re
import runpy
import statistics
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

IDS = [28, 29, 32, 36, 41, 43, 44, 46, 48, 164, 178, 179, 181, 192, 193, 195, 206, 207, 209, 220, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262]
TERMS = ["評估", "分析", "檢視", "協助", "共同", "立即", "直接", "要求", "升級",
         "只", "所有", "永遠", "僅", "即可", "口頭", "刪除"]
EDITABLE = {"q", "opts", "ans", "exp", "mindset"}
CALC_IDS = [29, 32, *range(231, 263)]


def calculations(bank):
    """Recompute from the actual stem; do not use authored answer fixtures."""
    results = []
    for q in (q for q in bank if q["id"] in CALC_IDS):
        number = q["id"]
        labels = {key: Decimal(value.replace(",", "")) for key, value in
                  re.findall(r"\b(EV|PV|AC|O|M|P|ES|EF|LS|LF)\s*=\s*([\d,]+(?:\.\d+)?)", q["q"])}
        if number == 29 or 231 <= number <= 238:
            ev, pv, ac = (labels[k] for k in ("EV", "PV", "AC"))
            if number in (29, 234):
                kind = "evm_status"
                schedule = "進度超前" if ev > pv else "進度落後" if ev < pv else "進度符合計畫"
                cost = "成本超支" if ev < ac else "成本節餘" if ev > ac else "成本符合預算"
                expected = [schedule, cost]
                matches = [i for i, option in enumerate(q["opts"])
                           if all(t in option.replace("呈現", "") for t in expected)]
            else:
                is_index = number in (231, 233, 235, 237)
                kind = "evm_indices" if is_index else "evm_variances"
                expected = ({"SPI": (ev / pv).quantize(Decimal(".01"), rounding=ROUND_HALF_UP),
                             "CPI": (ev / ac).quantize(Decimal(".01"), rounding=ROUND_HALF_UP)}
                            if is_index else {"SV": ev - pv, "CV": ev - ac})
                matches = []
                for i, option in enumerate(q["opts"]):
                    values = {key: Decimal(value) for key, value in
                              re.findall(r"\b(SPI|CPI|SV|CV)\s*=\s*([+\-]?\d+(?:\.\d+)?)", option)}
                    if values == expected:
                        matches.append(i)
        else:
            if number == 32 or 239 <= number <= 244:
                kind = "emv_loss_magnitude"
                probabilities = re.findall(r"(\d+(?:\.\d+)?)\s*%", q["q"])
                impacts = re.findall(r"NT\$\s*([\d,]+)", q["q"])
                assert len(probabilities) == len(impacts) == 1, f"Q-{number}: ambiguous EMV inputs"
                probability = Decimal(probabilities[0]) / 100
                impact = Decimal(impacts[0].replace(",", ""))
                labels = {"probability": probability, "loss": impact}
                expected = probability * impact
            elif 245 <= number <= 250:
                kind = "pert"
                expected = ((labels["O"] + 4 * labels["M"] + labels["P"]) / 6).quantize(Decimal(".1"), rounding=ROUND_HALF_UP)
            elif 251 <= number <= 256:
                kind = "channels"
                people = re.findall(r"(\d+)\s*位", q["q"])
                assert len(people) == 1, f"Q-{number}: ambiguous team size"
                n = int(people[0])
                labels = {"people": n}
                expected = Decimal(n * (n - 1)) / 2
            else:
                kind = "total_float"
                assert labels["EF"] - labels["ES"] == labels["LF"] - labels["LS"] > 0, f"Q-{number}: inconsistent duration"
                expected = labels["LS"] - labels["ES"]
                assert expected == labels["LF"] - labels["EF"], f"Q-{number}: float identities disagree"
            values = [re.findall(r"[+\-]?\d[\d,]*(?:\.\d+)?", option) for option in q["opts"]]
            assert all(len(value) == 1 for value in values), f"Q-{number}: expected one number per option"
            matches = [i for i, value in enumerate(values) if Decimal(value[0].replace(",", "")) == expected]
        assert matches == [q["ans"]], f"Q-{number}: computed {expected}, matching options {matches}, stored {q['ans']}"
        results.append({"id": number, "kind": kind, "inputs": labels,
                        "computed": expected, "key": "ABCD"[matches[0]], "result": "PASS"})
    assert sorted(r["id"] for r in results) == CALC_IDS
    return results


def read_bank(path):
    text = path.read_text(encoding="utf-8-sig")
    match = re.search(r"^const Q=(.*);$", text, re.M)
    if not match:
        raise ValueError(f"Question bank not found: {path}")
    return text, match, json.loads(match[1])


def audit(bank):
    rows = []
    ranks = collections.Counter()
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
        # Scalar numeric distractors can otherwise create an always-smallest shortcut.
        if q["id"] == 32 or 239 <= q["id"] <= 262:
            values = [re.findall(r"[+\-]?\d[\d,]*(?:\.\d+)?", option) for option in q["opts"]]
            if all(len(value) == 1 for value in values):
                numbers = [Decimal(value[0].replace(",", "")) for value in values]
                rank = sum(value < numbers[q["ans"]] for value in numbers) + 1
                rows[-1]["correct_numeric_rank_ascending"] = rank
                ranks[rank] += 1
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
            "scalar_numeric_rank_counts": dict(sorted(ranks.items())),
            "wording_occurrences": wording, "questions": rows}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--baseline", type=Path, required=True)
    parser.add_argument("--current", type=Path, default=Path(__file__).resolve().parents[1] / "index.html")
    parser.add_argument("--preflight", action="store_true", help="Check the remaining untreated unique set before editing")
    args = parser.parse_args()
    bt, bm, before = read_bank(args.baseline)
    if args.preflight:
        treated = set()
        for number in (1, 2, 3, 4):
            treated.update(runpy.run_path(str(Path(__file__).with_name(f"audit-remediation-batch{number}.py")))["IDS"])
        groups = collections.defaultdict(list)
        for q in before:
            groups[json.dumps([q["q"], q["opts"], q["ans"]], ensure_ascii=False)].append(q["id"])
        duplicates = {i for group in groups.values() if len(group) > 1 for i in group}
        pool = [q for q in before if q["id"] not in treated | duplicates]
        assert len(before) == 330 and len({q["id"] for q in before}) == 330
        assert {q["id"] for q in pool} == set(IDS), "Remaining scope changed: update Issue before editing"
        print(json.dumps({"candidate_scope": "PASS", "remaining_pool": len(pool),
                          "treated_ids": len(treated),
                          "duplicate_groups": sum(len(group) > 1 for group in groups.values()),
                          "duplicate_ids": len(duplicates),
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
    assert outside(bt, bm) == outside(at, am), "Non-bank application changed"
    pre, post = audit(before), audit(after)
    assert post["count"] == 52 and post["materially_longer"] == 0
    assert all(post["positions"].get(key, 0) == 13 for key in "ABCD")
    assert not post["periodic_sequence"]
    assert post["longest_same_key_run"] <= 3
    computed = calculations(after)
    # No new exact stem+options+key duplicates; pre-existing groups are outside this task.
    signatures = collections.defaultdict(list)
    for q in after:
        signatures[json.dumps([q["q"], q["opts"], q["ans"]], ensure_ascii=False)].append(q["id"])
    assert not any(len(ids) > 1 and set(ids).intersection(IDS) for ids in signatures.values())
    print(json.dumps({"baseline": str(args.baseline), "changed_ids": changed,
                      "scope_schema_application_checks": "PASS", "before": pre, "after": post,
                      "calculation_checks": computed,
                      "semantic_review": "See review document; human acceptance remains separate"},
                     ensure_ascii=False, indent=2, default=str))


if __name__ == "__main__":
    main()
