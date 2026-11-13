"""Check every challenge: reference solution passes all tests, starter code does not.

Usage:  node -e "require('./challenges.js');console.log(JSON.stringify(CHALLENGES))" | python3 tools/verify.py
"""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import harness

challenges = json.load(sys.stdin)
bad = 0
for ch in challenges:
    spec = json.dumps({k: ch.get(k) for k in ("type", "func", "tests")})
    sol = json.loads(harness.grade(ch["solution"], spec))
    fails = [r for r in sol["results"] if not r["passed"]]
    if sol.get("load_error") or fails or not sol["results"]:
        bad += 1
        print(f"FAIL {ch['id']}: solution -> {sol.get('load_error') or fails}")
    st = json.loads(harness.grade(ch["starter"], spec))
    if st["results"] and all(r["passed"] for r in st["results"]):
        bad += 1
        print(f"FAIL {ch['id']}: starter code already passes")
    assert len(ch["hints"]) == 3, ch["id"]
print(f"{len(challenges)} challenges checked, {bad} problems")
sys.exit(1 if bad else 0)
