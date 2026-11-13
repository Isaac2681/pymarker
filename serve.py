#!/usr/bin/env python3
"""PyMarker local server.

Serves the app and adds a small API so challenges can be edited in VS Code.
Every challenge is a file in "Python Lessons/":

    Python Lessons/
        Beginner/01_hello_world.py ...
        Intermediate/01_palindrome_checker.py ...
        Advanced/01_balanced_brackets.py ...
        playground.py

Each file starts with the task as a comment header ending in a
"your code below" marker. The header is stripped before code goes back to
the app, so only the learner's code is ever marked.

    python3 serve.py            # http://localhost:8765
    python3 serve.py 9000       # custom port

Bound to 127.0.0.1 only. API calls must send the X-PyMarker header, which
browsers won't let other websites add without a CORS preflight we never
approve, so random pages can't write files or launch VS Code.
"""
import json
import os
import re
import subprocess
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, unquote, urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
LESSONS = os.path.join(ROOT, "Python Lessons")
VSCODE_APP = "/Applications/Visual Studio Code.app"
NAME_RE = re.compile(r"^((Beginner|Intermediate|Advanced)/[0-9]{2}_[a-z0-9_]{1,60}\.py|playground\.py)$")
MARKER = "your code below"


def file_for(name):
    if not NAME_RE.match(name or ""):
        raise ValueError("bad file name")
    return os.path.join(LESSONS, *name.split("/"))


def strip_header(text):
    """Return only the learner's code: everything after the 'your code below' marker line."""
    head = text[:4000]
    i = head.find(MARKER)
    if i == -1 or not head[:i].lstrip().startswith("#"):
        return text
    nl = text.find("\n", i)
    return "" if nl == -1 else text[nl + 1:]


def write_lesson(path, header, code):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(str(header or "") + str(code or ""))


def ensure_lessons():
    os.makedirs(os.path.join(LESSONS, ".vscode"), exist_ok=True)
    settings = os.path.join(LESSONS, ".vscode", "settings.json")
    if not os.path.exists(settings):
        with open(settings, "w") as f:
            json.dump({"files.autoSave": "afterDelay", "files.autoSaveDelay": 500,
                       "editor.tabSize": 4, "editor.insertSpaces": True,
                       "explorer.sortOrder": "default"}, f, indent=2)
    readme = os.path.join(LESSONS, "README.md")
    if not os.path.exists(readme):
        with open(readme, "w") as f:
            f.write("# Python Lessons\n\nYour PyMarker challenges, synced with the app.\n\n"
                    "- Each file starts with the task. Write your code under the `your code below` line.\n"
                    "- Auto-save is on; the app picks up your changes within a second.\n"
                    "- Press **Submit** in PyMarker (http://localhost:8765) to get marked.\n")


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        if args and "/api/" in str(args[0]):
            return  # keep the sync polling quiet
        super().log_message(fmt, *args)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _json(self, status, obj):
        body = json.dumps(obj).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _guard(self):
        if self.headers.get("X-PyMarker") != "1":
            self._json(403, {"error": "missing X-PyMarker header"})
            return False
        return True

    def do_GET(self):
        url = urlparse(self.path)
        if not url.path.startswith("/api/"):
            if unquote(url.path).startswith(("/Python Lessons", "/workspace", "/tools", "/.claude", "/serve.py", "/.git")):
                return self.send_error(404)
            return super().do_GET()
        if not self._guard():
            return
        if url.path == "/api/health":
            return self._json(200, {"ok": True, "vscode": os.path.isdir(VSCODE_APP), "lessons": LESSONS})
        if url.path == "/api/file":
            try:
                path = file_for(parse_qs(url.query).get("name", [""])[0])
            except ValueError as e:
                return self._json(400, {"error": str(e)})
            if not os.path.exists(path):
                return self._json(200, {"exists": False})
            with open(path, encoding="utf-8") as f:
                code = strip_header(f.read())
            return self._json(200, {"exists": True, "code": code, "mtime": os.path.getmtime(path)})
        self._json(404, {"error": "unknown endpoint"})

    def do_POST(self):
        url = urlparse(self.path)
        if not self._guard():
            return
        try:
            length = min(int(self.headers.get("Content-Length", 0)), 2_000_000)
            data = json.loads(self.rfile.read(length) or b"{}")
        except (ValueError, json.JSONDecodeError) as e:
            return self._json(400, {"error": str(e)})

        if url.path == "/api/scaffold":
            # Create any lesson files that don't exist yet; never overwrite existing ones.
            ensure_lessons()
            created = 0
            for item in data.get("files", [])[:200]:
                try:
                    path = file_for(item.get("name"))
                except ValueError:
                    continue
                if not os.path.exists(path):
                    write_lesson(path, item.get("header"), item.get("code"))
                    created += 1
            return self._json(200, {"ok": True, "created": created, "lessons": LESSONS})

        try:
            path = file_for(data.get("name"))
        except ValueError as e:
            return self._json(400, {"error": str(e)})

        if url.path == "/api/save":
            ensure_lessons()
            write_lesson(path, data.get("header"), data.get("code"))
            return self._json(200, {"ok": True, "mtime": os.path.getmtime(path)})
        if url.path == "/api/open":
            if not os.path.isdir(VSCODE_APP):
                return self._json(500, {"error": "Visual Studio Code isn't installed in /Applications"})
            subprocess.Popen(["open", "-a", VSCODE_APP, LESSONS, path])
            return self._json(200, {"ok": True})
        self._json(404, {"error": "unknown endpoint"})


def already_running(port):
    """True if a PyMarker server is already answering on this port."""
    import urllib.request
    try:
        req = urllib.request.Request(f"http://127.0.0.1:{port}/api/health", headers={"X-PyMarker": "1"})
        with urllib.request.urlopen(req, timeout=1) as r:
            return json.load(r).get("ok") is True
    except Exception:
        return False


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    for candidate in range(port, port + 10):
        if already_running(candidate):
            print(f"PyMarker is already running — open http://localhost:{candidate}")
            subprocess.run(["open", f"http://localhost:{candidate}"])
            sys.exit(0)
        try:
            server = ThreadingHTTPServer(("127.0.0.1", candidate), Handler)
        except OSError:
            print(f"Port {candidate} is busy, trying {candidate + 1}…")
            continue
        url = f"http://localhost:{candidate}"
        print(f"PyMarker running at {url}  (Ctrl+C to stop)", flush=True)
        subprocess.Popen(["open", url])
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
        sys.exit(0)
    sys.exit(f"No free port between {port} and {port + 9}.")
