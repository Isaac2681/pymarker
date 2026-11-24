"""PyMarker grading harness.

Runs inside Pyodide (in a Web Worker) in the browser, and under CPython for
tools/verify.py. Exposes two entry points that take/return JSON strings:

    run(code, stdin_text)   -> {"output", "error"}
    grade(code, spec_json)  -> {"results": [...], "load_error"?}

Each test runs against a fresh namespace so state never leaks between tests.
"""
import ast
import copy
import io
import json
import sys
import traceback

USER_FILE = "<your code>"
MAX_OUT = 5000


def _norm(x):
    """Normalise values so tuples==lists, float noise is ignored, sets compare sorted."""
    if x is None or isinstance(x, (bool, int, str)):
        return x
    if isinstance(x, float):
        return round(x, 6)
    if isinstance(x, (list, tuple)):
        return [_norm(i) for i in x]
    if isinstance(x, dict):
        return {str(k): _norm(v) for k, v in x.items()}
    if isinstance(x, (set, frozenset)):
        items = [_norm(i) for i in x]
        try:
            return sorted(items)
        except TypeError:
            return items
    return x


def _short(s, n=300):
    s = str(s)
    return s if len(s) <= n else s[:n] + "…"


def _err(e):
    if isinstance(e, SyntaxError):
        line = e.lineno if e.filename == USER_FILE else None
        return {"type": type(e).__name__, "message": e.msg or str(e), "line": line}
    line = None
    for fr in traceback.extract_tb(e.__traceback__):
        if fr.filename == USER_FILE:
            line = fr.lineno
    return {"type": type(e).__name__, "message": _short(str(e), 500), "line": line}


class _Input:
    """Replacement for input(): feeds test lines, never echoes the prompt."""

    def __init__(self, lines):
        self.lines = [str(l) for l in lines]
        self.i = 0

    def __call__(self, prompt=""):
        if self.i >= len(self.lines):
            raise EOFError("input() was called more times than there are lines of input")
        v = self.lines[self.i]
        self.i += 1
        return v


class _Capture:
    def __enter__(self):
        self.buf = io.StringIO()
        self.old = sys.stdout
        sys.stdout = self.buf
        return self

    def __exit__(self, *exc):
        sys.stdout = self.old
        return False

    @property
    def text(self):
        return self.buf.getvalue()


def _exec_user(code, stdin_lines=()):
    ns = {"__name__": "__main__", "input": _Input(stdin_lines)}
    err = None
    with _Capture() as cap:
        try:
            exec(compile(code, USER_FILE, "exec"), ns)
        except SystemExit:
            pass
        except BaseException as e:  # noqa: BLE001 - everything is reported to the learner
            err = _err(e)
    return ns, cap.text, err


def _eval_snippet(src, ns):
    tree = ast.parse(src, mode="exec")
    last = tree.body[-1] if tree.body else None
    if isinstance(last, ast.Expr):
        exec(compile(ast.Module(body=tree.body[:-1], type_ignores=[]), "<test>", "exec"), ns)
        return eval(compile(ast.Expression(last.value), "<test>", "eval"), ns)
    exec(compile(tree, "<test>", "exec"), ns)
    return None


def _clean_lines(s):
    lines = [l.rstrip() for l in str(s).replace("\r\n", "\n").split("\n")]
    while lines and lines[-1] == "":
        lines.pop()
    return lines


def run(code, stdin_text=""):
    lines = stdin_text.split("\n") if stdin_text else []
    _, out, err = _exec_user(code, lines)
    return json.dumps({"output": out[:MAX_OUT], "truncated": len(out) > MAX_OUT, "error": err})


def grade(code, spec_json):
    spec = json.loads(spec_json)
    kind = spec["type"]
    try:
        compile(code, USER_FILE, "exec")
    except SyntaxError as e:
        return json.dumps({"load_error": _err(e), "results": []})

    results = []
    for t in spec["tests"]:
        hidden = bool(t.get("hidden"))
        if kind == "stdout":
            stdin = t.get("input", [])
            _, out, err = _exec_user(code, stdin)
            ok = err is None and _clean_lines(out) == _clean_lines(t["expected"])
            results.append({
                "passed": ok, "hidden": hidden, "error": err,
                "call": "input: " + (", ".join(repr(s) for s in stdin) if stdin else "(none)"),
                "expected": t["expected"], "got": out[:MAX_OUT],
            })
            continue

        ns, load_out, err = _exec_user(code, [])
        if err:
            return json.dumps({"load_error": err, "results": [], "stdout": load_out[:MAX_OUT]})
        if kind == "function":
            fn = ns.get(spec["func"])
            if not callable(fn):
                return json.dumps({"load_error": {
                    "type": "MissingFunction",
                    "message": f"Couldn't find a function called {spec['func']}(). Check the name is spelled exactly like that.",
                    "line": None}, "results": []})
            call = f"{spec['func']}({', '.join(repr(a) for a in t['args'])})"
        else:
            call = t["code"]

        got, terr = None, None
        with _Capture() as cap:
            try:
                if kind == "function":
                    got = fn(*copy.deepcopy(t["args"]))
                else:
                    got = _eval_snippet(t["code"], ns)
            except BaseException as e:  # noqa: BLE001
                terr = _err(e)
        ok = terr is None and _norm(got) == _norm(t["expected"])
        results.append({
            "passed": ok, "hidden": hidden, "error": terr, "call": call,
            "expected": repr(t["expected"]),
            "got": None if terr else _short(repr(got)),
            "printed": cap.text[:500],
        })
    return json.dumps({"results": results})


# ───────────────────────────── SQL (SQLite) ─────────────────────────────
# A query is marked by running it and the model solution on the same fresh in-memory database
# (the visible dataset, then an optional hidden one) and comparing result sets.
SQL_MAX_ROWS = 200


def _sql_db(setup):
    import sqlite3
    db = sqlite3.connect(":memory:")
    db.executescript(setup)
    return db


def _sql_query(db, query):
    q = query.strip()
    if not q or all(line.strip().startswith("--") or not line.strip() for line in q.splitlines()):
        raise ValueError("Your query is empty. Write a SELECT statement.")
    cur = db.execute(q)
    cols = [d[0] for d in cur.description] if cur.description else []
    rows = cur.fetchall()
    return cols, rows


def _sql_err(e):
    msg = str(e)
    if "one statement at a time" in msg:
        msg = "Only one SQL statement is allowed. Remove the extra statement (check for a stray semicolon)."
    return {"type": "SQLError" if not isinstance(e, ValueError) else "EmptyQuery", "message": msg, "line": None}


def _sql_safe(v):
    """Make a SQLite value JSON-safe (blobs and inf/nan would break the reply)."""
    if isinstance(v, (bytes, bytearray, memoryview)):
        return "0x" + bytes(v).hex()
    if isinstance(v, float) and (v != v or v in (float("inf"), float("-inf"))):
        return str(v)
    return v


def _sql_rows(rows):
    return [[_sql_safe(v) for v in r] for r in rows[:SQL_MAX_ROWS]]


def _sql_norm_row(r):
    return tuple(_sql_safe(v) for v in r)


def _sql_key(r):
    # numbers sort together whether int or float (1 == 1.0); then text; NULLs last
    return tuple((0, float(v), "") if isinstance(v, (int, float)) and not isinstance(v, bool)
                 else (1, 0.0, str(v)) if v is not None else (2, 0.0, "") for v in r)


def _sql_same(a, b):
    if len(a) != len(b):
        return False
    for ra, rb in zip(a, b):
        if len(ra) != len(rb):
            return False
        for x, y in zip(ra, rb):
            if isinstance(x, (int, float)) and isinstance(y, (int, float)) and not isinstance(x, bool) and not isinstance(y, bool):
                if abs(x - y) > 0.005:
                    return False
            elif x != y:
                return False
    return True


def run_sql(code, setup):
    try:
        db = _sql_db(setup)
    except Exception as e:  # noqa: BLE001
        return json.dumps({"error": {"type": "SetupError", "message": str(e), "line": None}})
    try:
        cols, rows = _sql_query(db, code)
    except Exception as e:  # noqa: BLE001
        return json.dumps({"error": _sql_err(e)})
    return json.dumps({"columns": cols, "rows": _sql_rows(rows),
                       "count": len(rows), "truncated": len(rows) > SQL_MAX_ROWS})


def grade_sql(code, spec_json):
    spec = json.loads(spec_json)
    datasets = [("visible", spec["setup"], False)]
    if spec.get("hiddenSetup"):
        datasets.append(("hidden", spec["hiddenSetup"], True))
    results = []
    for name, setup, hidden in datasets:
        exp_cols, exp_rows = _sql_query(_sql_db(setup), spec["solution"])
        res = {"passed": False, "hidden": hidden, "error": None,
               "call": "Hidden dataset" if hidden else "Example dataset",
               "exp": {"columns": exp_cols, "rows": _sql_rows(exp_rows)}}
        try:
            cols, rows = _sql_query(_sql_db(setup), code)
        except Exception as e:  # noqa: BLE001
            res["error"] = _sql_err(e)
            if not hidden:
                return json.dumps({"load_error": res["error"], "results": []})
            results.append(res)
            continue
        res["got"] = {"columns": cols, "rows": _sql_rows(rows)}
        a = [_sql_norm_row(r) for r in rows]
        b = [_sql_norm_row(r) for r in exp_rows]
        if len(cols) != len(exp_cols):
            res["why"] = f"Your result has {len(cols)} column(s); the answer has {len(exp_cols)}."
        elif not spec.get("ordered"):
            a, b = sorted(a, key=_sql_key), sorted(b, key=_sql_key)
        res["passed"] = len(cols) == len(exp_cols) and _sql_same(a, b)
        if not res["passed"] and "why" not in res:
            if len(a) != len(b):
                res["why"] = f"Your result has {len(a)} row(s); the answer has {len(b)}."
            elif spec.get("ordered") and _sql_same(sorted(a, key=_sql_key), sorted(b, key=_sql_key)):
                res["why"] = "Right rows, wrong order. Check your ORDER BY."
            else:
                res["why"] = "Some values in your rows are different."
        results.append(res)
    return json.dumps({"results": results})


def sql_preview(setup, solution):
    """The tables in the example dataset, plus the expected result, for the Testcases tab."""
    db = _sql_db(setup)
    names = [r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY rowid")]
    tables = []
    for n in names:
        cur = db.execute(f'SELECT * FROM "{n}"')
        tables.append({"name": n, "columns": [d[0] for d in cur.description], "rows": _sql_rows(cur.fetchall()[:50])})
    try:
        cols, rows = _sql_query(db, solution)
        expected = {"columns": cols, "rows": _sql_rows(rows[:50])}
    except Exception as e:  # noqa: BLE001
        expected = {"error": str(e)}
    return json.dumps({"tables": tables, "expected": expected})
