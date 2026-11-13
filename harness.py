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
