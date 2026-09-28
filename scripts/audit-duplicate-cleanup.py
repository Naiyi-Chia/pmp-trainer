"""Read-only Issue #26 audit, using the approved 2136a54 baseline by default.

python -X utf8 scripts/audit-duplicate-cleanup.py > report.json
python -X utf8 scripts/audit-duplicate-cleanup.py --negative-controls
Optional --baseline and --current accept UTF-8 HTML files. No dependencies.
Length/wording/similarity heuristics assist, but do not replace content review.
"""
import argparse
import collections
import copy
import difflib
import hashlib
import itertools
import json
import re
import statistics
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "2136a54479091d95484487905b61bea3ac289f95"
GROUPS = [
    [73, 113, 153], [74, 154], [75, 155], [76, 116, 156], [77, 157],
    [78, 118], [79, 119], [82, 122], [83, 123], [86, 126], [88, 128],
    [89, 129], [92, 132], [93, 133], [94, 134], [95, 135], [96, 136],
    [97, 137], [98, 138], [99, 139], [100, 140], [101, 141], [102, 142],
    [103, 143], [106, 146], [108, 148], [109, 149], [112, 152],
    [159, 215], [160, 216], [161, 217], [163, 219], [165, 221],
    [166, 222], [167, 223], [172, 228], [173, 229], [174, 230],
]
CANONICAL = sorted(g[0] for g in GROUPS)
REPLACEMENTS = sorted(i for g in GROUPS for i in g[1:])
HANDLED = sorted(i for g in GROUPS for i in g)
EDITABLE = {"q", "opts", "ans", "exp", "mindset"}
TERMS = ["評估", "分析", "檢視", "協助", "共同", "立即", "直接", "要求", "升級",
         "只", "所有", "永遠", "僅", "即可", "口頭", "刪除"]


def check(ok, message):
    if not ok:
        raise ValueError(message)


def parse(text):
    match = re.search(r"^const Q=(.*);$", text, re.M)
    check(match is not None, "Question bank not found")
    return json.loads(match[1]), text[:match.start(1)] + "BANK" + text[match.end(1):]


def normalize(text):
    return re.sub(r"\s+", "", text).casefold()


def duplicates(bank, order_independent=False):
    groups = collections.defaultdict(list)
    for q in bank:
        signature = ([normalize(q["q"]), sorted(normalize(o) for o in q["opts"]),
                      normalize(q["opts"][q["ans"]])]
                     if order_independent else [q["q"], q["opts"], q["ans"]])
        groups[json.dumps(signature, ensure_ascii=False)].append(q["id"])
    return sorted(sorted(g) for g in groups.values() if len(g) > 1)


def metrics(bank, ids):
    rows, wording = [], {t: {"correct": 0, "distractors": 0} for t in TERMS}
    for q in sorted((q for q in bank if q["id"] in ids), key=lambda q: q["id"]):
        lengths = [len(re.sub(r"\s", "", o)) for o in q["opts"]]
        correct = lengths[q["ans"]]
        others = [v for p, v in enumerate(lengths) if p != q["ans"]]
        median = statistics.median(others)
        rows.append({"id": q["id"], "key": "ABCD"[q["ans"]], "lengths": lengths,
                     "correct_to_distractor_median": round(correct / median, 3),
                     "unique_longest": correct > max(others),
                     "unique_shortest": correct < min(others),
                     "materially_longer": correct >= 1.25 * median and correct - median >= 8})
        for p, option in enumerate(q["opts"]):
            for term in TERMS:
                wording[term]["correct" if p == q["ans"] else "distractors"] += option.count(term)
    seq = "".join(r["key"] for r in rows)
    return {"count": len(rows), "positions": {k: seq.count(k) for k in "ABCD"},
            "sequence_by_id": seq,
            "longest_same_key_run": max(len(list(g)) for _, g in itertools.groupby(seq)),
            "periodic_sequence": any(all(seq[i] == seq[i % p] for i in range(len(seq)))
                                     for p in range(1, len(seq) // 2 + 1)),
            **{k: sum(r[k] for r in rows) for k in
               ("unique_longest", "unique_shortest", "materially_longer")},
            "wording_occurrences": wording, "questions": rows}


def validate(before, after, old_app, new_app):
    check(len(before) == len(after) == 330, "Question count changed")
    check([q["id"] for q in before] == [q["id"] for q in after], "IDs/order changed")
    check(len({q["id"] for q in after}) == 330, "Duplicate IDs")
    check(duplicates(before) == sorted(GROUPS), "Baseline duplicate contract differs")
    check(old_app == new_app, "Non-bank application changed")
    check(all(min(g) == g[0] for g in GROUPS), "Canonical must be lowest ID")
    for old, q in zip(before, after):
        i = q["id"]
        check(list(old) == list(q), f"Q-{i}: schema changed")
        check(all(q[k] == old[k] for k in old if k not in EDITABLE), f"Q-{i}: metadata changed")
        check(type(q["ans"]) is int and 0 <= q["ans"] < 4, f"Q-{i}: invalid answer")
        check(isinstance(q["opts"], list) and len(q["opts"]) == 4 and
              all(isinstance(o, str) for o in q["opts"]) and len(set(q["opts"])) == 4,
              f"Q-{i}: options invalid")
        check(all(isinstance(s, str) and s.strip() and "\ufffd" not in s
                  for s in [q["q"], *q["opts"], q["exp"], q["mindset"]]), f"Q-{i}: text invalid")
        if i not in HANDLED:
            check(old == q, f"Q-{i}: unauthorized question change")
        elif i in CANONICAL:
            check(all(old[k] == q[k] for k in old if k not in {"opts", "ans"}),
                  f"Q-{i}: canonical content changed")
            check(collections.Counter(old["opts"]) == collections.Counter(q["opts"]),
                  f"Q-{i}: canonical options changed")
            check(old["opts"][old["ans"]] == q["opts"][q["ans"]],
                  f"Q-{i}: canonical correct meaning changed")
        else:
            check(all(old[k] != q[k] for k in ("q", "opts", "exp", "mindset")),
                  f"Q-{i}: replacement content not rewritten")
            check(q["exp"].startswith("ABCD"[q["ans"]] + " 正確："),
                  f"Q-{i}: explanation key mismatch")
            check(set(re.findall(r"\b[A-D]\b", q["exp"])) == set("ABCD"),
                  f"Q-{i}: missing option rationale")
    check(not duplicates(after), "Exact duplicates remain")
    check(not duplicates(after, True), "Order-independent duplicates remain")
    for q in after:
        if q["id"] in REPLACEMENTS:
            check(sum(normalize(q["q"]) == normalize(r["q"]) for r in after) == 1,
                  f"Q-{q['id']}: repeated replacement stem")
    handled, new = metrics(after, HANDLED), metrics(after, REPLACEMENTS)
    check(sorted(handled["positions"].values()) == [19, 19, 20, 20], "Handled keys not balanced")
    check(new["materially_longer"] == 0, "Replacement length cue")
    for m in (handled, new):
        check(not m["periodic_sequence"] and m["longest_same_key_run"] <= 3, "Key pattern")
    untouched = [q["id"] for q in after if q["id"] not in HANDLED]
    check(list(metrics(after, untouched)["positions"].values()) == [63] * 4, "Outside keys changed")
    check(sorted(metrics(after, [q["id"] for q in after])["positions"].values()) == [82, 82, 83, 83],
          "Whole-bank keys not balanced")


def negative_controls(before, after, old_app, new_app):
    """Perturb real inputs in memory; each must fail the named invariant."""
    cases = []

    def case(name, change, expected):
        rows = copy.deepcopy(after)
        changed_app = change(rows) or new_app
        try:
            validate(before, rows, old_app, changed_app)
        except ValueError as exc:
            check(expected in str(exc), f"{name}: wrong failure: {exc}")
            cases.append({"case": name, "result": "rejected", "reason": str(exc)})
        else:
            raise ValueError(f"Negative control unexpectedly passed: {name}")

    def set_field(i, k, v):
        return lambda rows: rows[i - 1].__setitem__(k, v)

    case("out-of-scope stem", set_field(1, "q", "unauthorized"), "unauthorized question")
    case("canonical stem", set_field(73, "q", "changed canonical"), "canonical content")
    case("canonical option text", lambda r: r[72]["opts"].__setitem__(0, "new option"), "canonical options")
    case("canonical answer meaning", set_field(73, "ans", (after[72]["ans"] + 1) % 4), "canonical correct meaning")
    case("replacement metadata", set_field(113, "approach", "Predictive"), "metadata changed")
    case("replacement explanation key", set_field(113, "ans", (after[112]["ans"] + 1) % 4), "explanation key")
    case("schema", lambda r: r[112].pop("mindset") and None, "schema changed")
    case("record removed", lambda r: r.pop() and None, "Question count")
    case("application code", lambda r: new_app + "\n// changed storage", "Non-bank application")

    def clone(rows, reorder=False):
        source, target = rows[112], rows[115]
        for k in EDITABLE:
            target[k] = copy.deepcopy(source[k])
        if reorder:
            target["opts"] = source["opts"][1:] + source["opts"][:1]
            target["ans"] = (source["ans"] - 1) % 4
            target["exp"] = "ABCD"[target["ans"]] + " 正確：test; A B C D"

    case("replacement clone", clone, "Exact duplicates")
    case("reordered replacement clone", lambda r: clone(r, True), "Order-independent duplicates")
    case("unchanged replacement", lambda r: r.__setitem__(112, copy.deepcopy(before[112])), "not rewritten")

    def change_key(rows):
        q = rows[112]
        counts = collections.Counter(r["ans"] for r in rows if r["id"] in HANDLED)
        q["ans"] = next(k for k, count in counts.items() if count == 20 and k != q["ans"])
        q["exp"] = "ABCD"[q["ans"]] + " 正確：negative control; A B C D"

    case("unbalanced keys with matching explanation label", change_key, "Handled keys not balanced")
    case("long correct option", lambda r: r[112]["opts"].__setitem__(
        r[112]["ans"], r[112]["opts"][r[112]["ans"]] + "補充詳細執行條件與說明" * 5), "Replacement length cue")
    return cases


def similarity(before, after):
    old = {q["id"]: q for q in before}
    canonical = {i: g[0] for g in GROUPS for i in g[1:]}
    rows = []
    for q in (q for q in after if q["id"] in REPLACEMENTS):
        def score(other):
            return difflib.SequenceMatcher(None, normalize(q["q"]), normalize(other["q"]),
                                           autojunk=False).ratio()
        other = max((r for r in after if r["id"] != q["id"]), key=score)
        rows.append({"id": q["id"], "canonical": canonical[q["id"]],
                     "baseline_canonical_stem_similarity": round(score(old[canonical[q["id"]]]), 3),
                     "closest_current_stem_id": other["id"], "closest_similarity": round(score(other), 3)})
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--baseline", type=Path)
    parser.add_argument("--current", type=Path, default=ROOT / "index.html")
    parser.add_argument("--negative-controls", action="store_true")
    args = parser.parse_args()
    baseline = (args.baseline.read_text(encoding="utf-8-sig") if args.baseline else
                subprocess.check_output(["git", "show", f"{BASE}:index.html"], cwd=ROOT).decode("utf-8").replace("\r\n", "\n"))
    current = args.current.read_text(encoding="utf-8-sig")
    before, old_app = parse(baseline)
    after, new_app = parse(current)
    validate(before, after, old_app, new_app)
    if args.negative_controls:
        print(json.dumps({"negative_controls": negative_controls(before, after, old_app, new_app)},
                         ensure_ascii=False, indent=2))
        return
    scopes = {"canonical": CANONICAL, "replacements": REPLACEMENTS, "handled": HANDLED,
              "untouched": [q["id"] for q in after if q["id"] not in HANDLED],
              "whole_bank": [q["id"] for q in after]}

    def scoped_metrics(bank):
        results = {s: metrics(bank, ids) for s, ids in scopes.items()}
        # Keep per-item evidence once for each handled ID; aggregate scopes
        # would otherwise duplicate those rows and unrelated bank details.
        for scope in ("handled", "untouched", "whole_bank"):
            results[scope].pop("questions")
        return results

    print(json.dumps({
        "issue": 26, "baseline_commit": BASE,
        "source_sha256_lf": hashlib.sha256(current.encode("utf-8")).hexdigest(),
        "scope_schema_metadata_canonical_application_checks": "PASS",
        "changed_ids": [q["id"] for old, q in zip(before, after) if old != q],
        "resolutions": [{"canonical": g[0], "replacements": g[1:], "result": "distinct stems/options/keys"}
                        for g in GROUPS],
        "duplicates": {"before_exact_groups": duplicates(before), "after_exact_groups": duplicates(after),
                       "after_order_independent_groups": duplicates(after, True)},
        "before": scoped_metrics(before),
        "after": scoped_metrics(after),
        "replacement_stem_similarity_screen": similarity(before, after),
        "limitations": "Similarity and wording are screening only. Canonical content/length/wording is protected. "
                       "See QUESTION_DUPLICATE_CLEANUP.md for distinct decisions and engineering content self-review. "
                       "Independent review and Human content review remain pending.",
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
