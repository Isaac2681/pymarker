"use strict";

// ═════════════════════════ config ═════════════════════════
const LEVELS = {
  beginner: { label: "Beginner", points: 10 },
  intermediate: { label: "Intermediate", points: 20 },
  advanced: { label: "Advanced", points: 35 },
};
const HINT_PENALTY = 0.2;        // each hint knocks 20% off the challenge's marks
const MIN_MULTIPLIER = 0.4;      // ...but solving always keeps at least 40%
const SOLUTION_AFTER_FAILS = 2;  // solution unlocks after this many failed submits (or all hints)
const TIME_LIMIT_MS = 8000;
const PROFILES_KEY = "pymarker.profiles";
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
const profiles = (() => {
  let p = null;
  try { p = JSON.parse(store.get(PROFILES_KEY)); } catch {}
  if (!p || !Array.isArray(p.list) || !p.list.length) p = { active: "main", list: [{ id: "main", name: "" }] };
  if (!p.list.some((l) => l.id === p.active)) p.active = p.list[0].id;
  return p;
})();
const saveProfiles = () => store.set(PROFILES_KEY, JSON.stringify(profiles));
const keyFor = (id) => (id === "main" ? "pymarker.v1" : `pymarker.v1.${id}`);
const learner = () => profiles.list.find((l) => l.id === profiles.active);
const STORE_KEY = keyFor(profiles.active);

// Shortcut labels: ⌘/⌥ on Apple keyboards, Ctrl/Alt everywhere else.
const IS_MAC = /mac|iphone|ipad|ipod/i.test(navigator.userAgentData?.platform || navigator.platform || navigator.userAgent);
const MOD = IS_MAC ? "⌘" : "Ctrl";
const ALT = IS_MAC ? "⌥" : "Alt";
const GRADES = [[90, "A*"], [80, "A"], [70, "B"], [60, "C"], [50, "D"], [40, "E"], [0, "U"]];

const CH = globalThis.CHALLENGES;
const PLAYGROUND = {
  id: "playground", title: "Playground", level: null, type: "playground",
  starter: `# Playground — try out anything here.\n# Press ▶ Run (${MOD}+Enter). Put input() lines in the "Program input" tab.\n\nname = "PyMarker"\nfor i in range(3):\n    print(f"{i}: hello from {name}")\n`,
};
const EXTRA = (k) => (Array.isArray(globalThis[k]) ? globalThis[k] : []);
// Extra tracks beyond the Python course. Each problem uses the challenges.js schema (SQL ones are marked by result set).
const TRACKS = [
  { id: "ml", label: "Machine Learning", icon: "🤖", lang: "python",
    blurb: "The maths behind machine learning, coded by hand in plain Python: statistics, distances, metrics, regression and nearest neighbours.",
    items: EXTRA("ML_PROBLEMS").filter((p) => p.track === "ml") },
  { id: "gpt", label: "Build Your GPT", icon: "✨", lang: "python",
    blurb: "Build the pieces of a tiny language model step by step: tokenizer, bigram model, sampling, softmax and attention.",
    items: EXTRA("ML_PROBLEMS").filter((p) => p.track === "gpt") },
  { id: "lld", label: "Low Level Design", icon: "🧩", lang: "python",
    blurb: "Object-oriented design: model real systems with classes, and practise patterns like Strategy and Observer.",
    items: EXTRA("LLD_PROBLEMS") },
  { id: "sql", label: "Databases (SQL)", icon: "🗄️", lang: "sql",
    blurb: "Query real tables with SQL, from SELECT and WHERE up to JOINs, GROUP BY, window functions and CTEs. Runs on SQLite in your browser.",
    items: EXTRA("SQL_PROBLEMS").map((p) => ({ ...p, type: "sql" })) },
];
const trackById = Object.assign(Object.create(null), Object.fromEntries(TRACKS.map((t) => [t.id, t])));
const PY_ALL = [PLAYGROUND, ...CH];
const ALL = [...PY_ALL];
{
  const seen = new Set(PY_ALL.map((c) => c.id));
  for (const t of TRACKS) {
    t.items = t.items.filter((c) => {
      if (seen.has(c.id) || !LEVELS[c.level]) { console.warn("Skipped problem with a duplicate id or bad level:", c.id); return false; }
      seen.add(c.id); c._track = t.id; return true;
    });
    ALL.push(...t.items);
  }
}
const byId = Object.assign(Object.create(null), Object.fromEntries(ALL.map((c) => [c.id, c])));
const trackOf = (ch) => ch._track || "python";
const trackList = (ch) => (trackOf(ch) === "python" ? PY_ALL : trackById[trackOf(ch)].items);
const isSql = (ch) => ch.type === "sql";
const MAX_POINTS = CH.reduce((s, c) => s + LEVELS[c.level].points, 0);

// Roadmap topics. Each challenge belongs to exactly one; `after` draws the arrows on the roadmap.
const TOPICS = [
  { id: "basics", label: "Python Basics", icon: "🐍", row: 0, after: [],
    blurb: "Printing, reading input, variables and arithmetic.", concepts: ["print()", "input()", "int() / float()", "f-strings"],
    ids: ["hello", "greet", "add", "c_to_f"] },
  { id: "conditionals", label: "if / elif / else", icon: "🔀", row: 1, after: ["basics"],
    blurb: "Making decisions: comparisons, elif chains, and / or, nested ifs and guard clauses.", concepts: ["== != < > <= >=", "elif chains", "and / or / not", "nested if", "guard clauses", "match / case"],
    ids: ["even_odd", "largest", "grade", "fizzbuzz", "absolute", "password_check", "sign", "bigger", "ticket_price", "temperature", "traffic_light", "day_type", "bmi_category", "leap_year", "triangle_type", "season", "rps", "calculator", "shipping", "valid_date", "income_tax", "password_strength", "text_adventure"] },
  { id: "loops", label: "Loops", icon: "🔁", row: 2, after: ["conditionals"],
    blurb: "Repeating work with for and while loops, ranges and running totals.", concepts: ["for", "range()", "while", "running totals"],
    ids: ["times_table", "total", "count_vowels", "is_prime"] },
  { id: "strings", label: "Strings", icon: "🔤", row: 3, after: ["loops"],
    blurb: "Slicing, comparing and transforming text.", concepts: ["slicing [::-1]", ".lower()", "sorted()", "ord() / chr()"],
    ids: ["reverse_string", "palindrome", "anagrams", "caesar", "rle"] },
  { id: "collections", label: "Lists & Dictionaries", icon: "📦", row: 3, after: ["loops"],
    blurb: "Storing many values: lists, sets and dictionaries.", concepts: ["lists", "sets", "dict counting", "sorting"],
    ids: ["unique", "second_largest", "word_count", "merge_intervals"] },
  { id: "recursion", label: "Functions & Recursion", icon: "🌀", row: 4, after: ["strings", "collections"],
    blurb: "Functions that call themselves, and remembering results.", concepts: ["base case", "recursive case", "memoisation"],
    ids: ["factorial", "fib", "flatten", "grid_paths"] },
  { id: "algorithms", label: "Algorithms", icon: "🧠", row: 5, after: ["recursion"],
    blurb: "Classic techniques: stacks, binary search, sliding windows.", concepts: ["stacks", "binary search", "sliding window", "greedy"],
    ids: ["balanced", "rpn", "roman", "binary_search", "longest_unique"] },
  { id: "oop", label: "Classes & Advanced", icon: "🏗️", row: 5, after: ["recursion"],
    blurb: "Classes, decorators and generators.", concepts: ["class / self", "decorators", "generators / yield"],
    ids: ["bank_account", "lru_cache", "count_calls", "primes_gen"] },
];
const topicById = Object.assign(Object.create(null), Object.fromEntries(TOPICS.map((t) => [t.id, t])));
const TOPIC_OF = {};
for (const t of TOPICS) for (const id of t.ids) TOPIC_OF[id] = t;
const topicOf = (ch) => TOPIC_OF[ch.id];
const topicItems = (t) => CH.filter((c) => TOPIC_OF[c.id] === t); // challenge order, not list order
{
  const missing = CH.filter((c) => !TOPIC_OF[c.id]).map((c) => c.id);
  if (missing.length) console.warn("Challenges with no roadmap topic:", missing);
}

// ═════════════════════════ state ═════════════════════════
const state = Object.assign(
  { progress: {}, current: null, days: [], fontSize: 14, filter: "all", collapsed: {} },
  (() => { try { return JSON.parse(store.get(STORE_KEY)) || {}; } catch { return {}; } })()
);
let warnedFull = false;
function save() {
  if (store.set(STORE_KEY, JSON.stringify(state))) return;
  // Out of space: drop saved submission code (oldest first) so marks and progress can still be saved.
  for (const p of Object.values(state.progress)) if (p.subs) p.subs = p.subs.slice(-3).map((x, i, a) => (i < a.length - 1 ? { ...x, code: "" } : x));
  if (!store.set(STORE_KEY, JSON.stringify(state)) && !warnedFull) {
    warnedFull = true;
    toast("⚠️ This browser's storage is full, so progress can't be saved. Export it from the progress report.", 6000);
  }
}
const prog = (id) => (state.progress[id] ||= { solved: false, points: 0, hints: 0, fails: 0, submits: 0, revealed: false, code: null });
const current = () => byId[state.current] || CH[0];
let view = null; // "roadmap" | "problems" | "problem"
// Progress can come from an imported file, so force every numeric field to be a number before it's ever rendered.
const num = (v) => (Number.isFinite(+v) ? +v : 0);
if (!state.progress || typeof state.progress !== "object") state.progress = {};
for (const [id, p] of Object.entries(state.progress)) {
  if (!p || typeof p !== "object") { delete state.progress[id]; continue; }
  for (const k of ["points", "hints", "fails", "submits", "editedAt"]) if (k in p) p[k] = num(p[k]);
  p.solved = !!p.solved; p.revealed = !!p.revealed;
  if (p.code != null && typeof p.code !== "string") p.code = null;
  p.subs = Array.isArray(p.subs) ? p.subs.filter((x) => x && typeof x === "object").map((x) => ({
    t: num(x.t), code: typeof x.code === "string" ? x.code : "", kind: ["ok", "wrong", "error", "timeout"].includes(x.kind) ? x.kind : "wrong",
    passed: num(x.passed), total: num(x.total) })) : undefined;
}
state.quizzes = state.quizzes && typeof state.quizzes === "object" ? state.quizzes : {};
for (const [k, v] of Object.entries(state.quizzes)) state.quizzes[k] = { best: num(v?.best), last: num(v?.last), total: num(v?.total), at: num(v?.at) };
state.lessons = state.lessons && typeof state.lessons === "object" ? state.lessons : {};
for (const k of Object.keys(state.lessons)) state.lessons[k] = !!state.lessons[k];
state.days = Array.isArray(state.days) ? state.days.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)) : [];
state.fontSize = Math.min(22, Math.max(11, num(state.fontSize) || 14));
const isPlay = (ch) => ch.type === "playground";
const levelIndex = (ch) => CH.filter((c) => c.level === ch.level).indexOf(ch) + 1;

function pointsAvailable(ch) {
  const p = prog(ch.id);
  if (p.revealed) return 0;
  return Math.round(LEVELS[ch.level].points * Math.max(MIN_MULTIPLIER, 1 - HINT_PENALTY * p.hints));
}
const gradeFor = (pct) => GRADES.find(([min]) => pct >= min)[1];
function totals() {
  let points = 0, solved = 0, hints = 0, submits = 0, revealed = 0;
  for (const c of CH) {
    const p = prog(c.id);
    points += p.points; hints += p.hints; submits += p.submits || 0;
    if (p.solved) solved++;
    if (p.revealed) revealed++;
  }
  const pct = Math.round((points / MAX_POINTS) * 100);
  return { points, solved, pct, grade: gradeFor(pct), hints, submits, revealed };
}
const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local
function streak() {
  const days = new Set(state.days);
  const d = new Date();
  if (!days.has(today())) d.setDate(d.getDate() - 1); // streak survives until you miss a whole day
  let n = 0;
  while (days.has(d.toLocaleDateString("en-CA"))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

// ═════════════════════════ python runner ═════════════════════════
class PyRunner {
  constructor(onStatus) { this.onStatus = onStatus; this.seq = 0; this.pending = new Map(); this.spawn(); }
  spawn() {
    this.onStatus("loading");
    this.ready = new Promise((res) => (this._resolveReady = res));
    this.worker = new Worker("worker.js");
    this.worker.onmessage = (e) => {
      const m = e.data;
      if (m.type === "ready") { this.onStatus("ready"); this._resolveReady(); }
      else if (m.type === "fatal") this.onStatus("error", m.message);
      else if (m.type === "result") {
        const p = this.pending.get(m.id);
        if (p) { clearTimeout(p.timer); this.pending.delete(m.id); p.resolve(m.data); }
      }
    };
    this.worker.onerror = (e) => this.onStatus("error", e.message);
  }
  async call(msg, limit = TIME_LIMIT_MS) {
    await this.ready;
    return new Promise((resolve) => {
      const id = ++this.seq;
      const timer = setTimeout(() => {
        // Runaway code: kill the worker, boot a fresh Python, report a timeout.
        this.worker.terminate();
        for (const [, p] of this.pending) { clearTimeout(p.timer); p.resolve({ timeout: true }); }
        this.pending.clear();
        this.spawn();
      }, limit);
      this.pending.set(id, { resolve, timer });
      this.worker.postMessage({ id, ...msg });
    });
  }
}

// ═════════════════════════ helpers ═════════════════════════
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function pyRepr(v) {
  if (v === null) return "None";
  if (v === true) return "True";
  if (v === false) return "False";
  if (typeof v === "string") return "'" + v.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'";
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return "[" + v.map(pyRepr).join(", ") + "]";
  return "{" + Object.entries(v).map(([k, x]) => pyRepr(k) + ": " + pyRepr(x)).join(", ") + "}";
}
function toast(msg, ms = 2600) {
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = msg;
  $("#toasts").appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 300); }, ms);
}
function confetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#5b82ff", "#9b6bff", "#2fd47e", "#ffb547", "#ff5c72", "#ffffff"];
  const box = $("#confetti");
  for (let i = 0; i < 90; i++) {
    const p = document.createElement("i");
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = colors[i % colors.length];
    p.style.setProperty("--dx", (Math.random() * 200 - 100) + "px");
    p.style.setProperty("--rot", (Math.random() * 900 - 450) + "deg");
    p.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
    p.style.animationDelay = Math.random() * 0.25 + "s";
    box.appendChild(p);
  }
  setTimeout(() => (box.innerHTML = ""), 3800);
}

const EXPLAIN = {
  SQLError: "SQLite couldn't run your query. Check the spelling of keywords, table and column names (look at the Tables section), commas between columns, and quotes around text values like <code>'London'</code>.",
  EmptyQuery: "There's no query yet. Write a <code>SELECT</code> statement under the comment.",
  SyntaxError: "Python couldn't understand the <em>shape</em> of your code. Look for a missing colon <code>:</code> after <code>if</code>/<code>for</code>/<code>def</code>, an unclosed bracket or quote, or <code>=</code> where you meant <code>==</code>.",
  IndentationError: "The spaces at the start of a line are wrong. Code inside <code>if</code>, <code>for</code>, <code>while</code> and <code>def</code> must be indented (4 spaces), and lines in the same block must line up.",
  TabError: "You've mixed tabs and spaces for indentation. Use spaces only.",
  NameError: "You used a name Python doesn't recognise. Check the spelling (Python is case-sensitive) and that you created the variable <em>before</em> using it. Text needs quotes!",
  TypeError: "A value is the wrong type — e.g. adding text to a number (<code>\"3\" + 4</code>), or calling a function with the wrong number of arguments. <code>int()</code> and <code>str()</code> convert between types.",
  ValueError: "The type was right but the value wasn't usable — e.g. <code>int(\"hello\")</code>.",
  IndexError: "You tried to read a position that doesn't exist. The first index is <code>0</code> and the last is <code>len(x) - 1</code>.",
  KeyError: "You looked up a dictionary key that isn't there. Use <code>d.get(key, default)</code> or check <code>if key in d</code> first.",
  ZeroDivisionError: "You divided by zero. Check the value you divide by first.",
  AttributeError: "You used <code>.something</code> on a value that doesn't have it — maybe a typo in a method name, or the value isn't the type you think.",
  RecursionError: "Your function called itself too many times. Make sure there's a <em>base case</em> that stops the recursion and that each call moves towards it.",
  EOFError: "Your program called <code>input()</code> more times than there are input lines. For ▶ Run, add lines in the <b>Program input</b> tab.",
  UnboundLocalError: "You used a variable inside a function before giving it a value there.",
  MissingFunction: "The marker calls your function by name, so it must be defined with exactly the name shown in the task.",
  Timeout: "Your code ran for more than 8 seconds. That usually means an <b>infinite loop</b> (a <code>while</code> whose condition never becomes False), or an approach that's too slow for the big hidden tests.",
};
const explainErr = (type) => EXPLAIN[type] || "Read the error message carefully — it says what went wrong and on which line.";

// ═════════════════════════ editor ═════════════════════════
// minimal Python line-comment toggle
CodeMirror.commands.toggleComment = (cm) => {
  const from = cm.getCursor("from").line, to = cm.getCursor("to").line;
  const lines = []; for (let l = from; l <= to; l++) lines.push(cm.getLine(l));
  const allCommented = lines.filter((s) => s.trim()).every((s) => /^\s*#/.test(s));
  cm.operation(() => lines.forEach((s, i) => {
    const l = from + i;
    if (allCommented) cm.replaceRange(s.replace(/^(\s*)# ?/, "$1"), { line: l, ch: 0 }, { line: l, ch: s.length });
    else if (s.trim()) cm.replaceRange(s.replace(/^(\s*)/, "$1# "), { line: l, ch: 0 }, { line: l, ch: s.length });
  }));
};
const editor = CodeMirror.fromTextArea($("#editor"), {
  mode: "python", theme: "material-darker", lineNumbers: true, indentUnit: 4, tabSize: 4,
  matchBrackets: true, autoCloseBrackets: true, styleActiveLine: true, autofocus: true,
  extraKeys: {
    Tab: (cm) => (cm.somethingSelected() ? cm.indentSelection("add") : cm.replaceSelection("    ", "end")),
    "Shift-Tab": (cm) => cm.indentSelection("subtract"),
    "Cmd-/": "toggleComment", "Ctrl-/": "toggleComment",
  },
});
function applyFont() {
  document.documentElement.style.setProperty("--code-size", state.fontSize + "px");
  editor.refresh();
}

let errorMark = null, saveTimer = null, applyingRemote = false;
editor.on("change", () => {
  clearErrorLine();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    prog(current().id).code = editor.getValue(); save();
    if (!isPlay(current())) renderSidebar();
  }, 300);
  if (!applyingRemote) { prog(current().id).editedAt = Date.now(); vscode.pushSoon(); }
});
function markErrorLine(line) {
  clearErrorLine();
  if (line && line <= editor.lineCount()) {
    errorMark = line - 1;
    editor.addLineClass(errorMark, "background", "cm-error-line");
    editor.scrollIntoView({ line: errorMark, ch: 0 }, 60);
  }
}
function clearErrorLine() {
  if (errorMark !== null) { editor.removeLineClass(errorMark, "background", "cm-error-line"); errorMark = null; }
}

// ═════════════════════════ VS Code sync ═════════════════════════
// Needs serve.py. Every challenge lives in "Python Lessons/<Level>/NN_title.py" with the
// task as a comment header. App edits are pushed to the file; the file is polled so
// saves in VS Code flow back. When switching challenge, whichever copy is newer wins.
const LESSON_URL = location.origin;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 60);
function htmlToText(html) {
  const d = document.createElement("div");
  d.innerHTML = html
    .replace(/<li>/g, "\n- ").replace(/<br\s*\/?>/g, "\n")
    .replace(/<\/(p|ul|table|tr)>/g, "\n").replace(/<pre>/g, "\n").replace(/<\/pre>/g, "\n")
    .replace(/<\/t[dh]>/g, "   ");
  return d.textContent.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
function wrapLine(line, width = 84) {
  if (line.length <= width || /^\s/.test(line)) return [line];
  const out = []; let cur = "";
  for (const w of line.split(" ")) {
    if ((cur + " " + w).trim().length > width) { out.push(cur); cur = w; } else cur = (cur ? cur + " " : "") + w;
  }
  if (cur) out.push(cur);
  return out;
}
function lessonHeader(ch) {
  const bar = "# " + "─".repeat(78);
  let lines;
  if (isPlay(ch)) {
    lines = [bar, "# Playground — a free space to try things out. Nothing here is marked.", `# Run it in VS Code, or press ▶ Run in PyMarker (${LESSON_URL}).`];
  } else {
    const body = htmlToText(ch.description).split("\n").flatMap((l) => wrapLine(l)).map((l) => (l ? `#   ${l}` : "#"));
    lines = [bar, `# ${LEVELS[ch.level].label} ${levelIndex(ch)} · ${ch.title}   (${LEVELS[ch.level].points} marks)`, "#", ...body, "#",
      `# Get marked: press Submit in PyMarker → ${LESSON_URL}`];
  }
  return [...lines, `# ${"─".repeat(30)} your code below ${"─".repeat(31)}`, ""].join("\n");
}

const vscode = {
  available: false, on: false, name: null, ch: null, mtime: 0, pushTimer: null, pollTimer: null, inflight: false, scaffolded: false,
  async api(path, body) {
    const r = await fetch(path, body
      ? { method: "POST", headers: { "X-PyMarker": "1", "Content-Type": "application/json" }, body: JSON.stringify(body) }
      : { headers: { "X-PyMarker": "1" } });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || r.statusText);
    return data;
  },
  fileName(ch) {
    if (isPlay(ch)) return "playground.py";
    return `${LEVELS[ch.level].label}/${String(levelIndex(ch)).padStart(2, "0")}_${slug(ch.title)}.py`;
  },
  async init() {
    if (profiles.active !== "main") { this.available = false; return; } // lesson files on this Mac belong to the first learner
    try { this.available = !!(await this.api("/api/health")).vscode; } catch { this.available = false; }
    $("#btn-vscode").hidden = !this.available;
  },
  async scaffold() {
    // Create every lesson file (existing files are never overwritten).
    const files = PY_ALL.map((c) => ({ name: this.fileName(c), header: lessonHeader(c), code: prog(c.id).code ?? c.starter }));
    const r = await this.api("/api/scaffold", { files });
    this.scaffolded = true;
    return r;
  },
  // Bring the current challenge and its file into agreement: newest copy wins.
  async syncCurrent() {
    const ch = current(), p = prog(ch.id), name = this.fileName(ch);
    this.name = name; this.ch = ch;
    const f = await this.api(`/api/file?name=${encodeURIComponent(name)}`);
    if (f.exists && f.code !== editor.getValue() && f.mtime * 1000 > (p.editedAt || 0)) {
      this.applyRemote(f.code);
      this.mtime = f.mtime;
    } else {
      const r = await this.api("/api/save", { name, header: lessonHeader(ch), code: editor.getValue() });
      this.mtime = r.mtime;
    }
  },
  async link() {
    try {
      if (!this.scaffolded) {
        const r = await this.scaffold();
        if (r.created) toast(`Created ${r.created} lesson files in <b>Python Lessons</b>`);
      }
      await this.syncCurrent();
      await this.api("/api/open", { name: this.name });
      this.on = true;
      clearInterval(this.pollTimer);
      this.pollTimer = setInterval(() => this.poll(), 1000);
      this.render();
      return true;
    } catch (e) {
      toast(`Couldn't open VS Code: ${esc(e.message)}`);
      return false;
    }
  },
  unlink() {
    this.on = false; this.name = null;
    clearInterval(this.pollTimer);
    this.render();
  },
  applyRemote(code) {
    const cur = editor.getCursor(), scroll = editor.getScrollInfo();
    applyingRemote = true;
    editor.setValue(code);
    applyingRemote = false;
    editor.setCursor(cur); editor.scrollTo(scroll.left, scroll.top);
    const p = prog(current().id);
    p.code = code; save();
    const s = $("#sync-status"); s.classList.remove("flash"); void s.offsetWidth; s.classList.add("flash");
  },
  pushSoon() {
    if (!this.on || this.ch !== current()) return;
    clearTimeout(this.pushTimer);
    const name = this.name, ch = this.ch;
    this.pushTimer = setTimeout(async () => {
      try { const r = await this.api("/api/save", { name, header: lessonHeader(ch), code: editor.getValue() }); this.mtime = r.mtime; } catch {}
      this.pushTimer = null;
    }, 350);
  },
  async poll() {
    if (!this.on || this.pushTimer || this.inflight || this.ch !== current()) return;
    this.inflight = true;
    try {
      const r = await this.api(`/api/file?name=${encodeURIComponent(this.name)}`);
      if (r.exists && r.mtime > this.mtime && !this.pushTimer && this.ch === current()) {
        this.mtime = r.mtime;
        if (r.code !== editor.getValue()) this.applyRemote(r.code);
      }
    } catch {} finally { this.inflight = false; }
  },
  render() {
    const b = $("#btn-vscode");
    b.classList.toggle("linked", this.on);
    $("#vscode-label").textContent = this.on ? "Linked to VS Code" : "Edit in VS Code";
    b.title = this.on ? "Click to stop syncing with VS Code" : "Open your Python Lessons folder in VS Code — changes sync both ways";
    const s = $("#sync-status");
    s.hidden = !this.on;
    s.textContent = this.on ? `Python Lessons/${this.name}` : "";
  },
};

// ═════════════════════════ rendering ═════════════════════════
function renderHeader() {
  const t = totals();
  $("#stat-points").textContent = t.points;
  $("#stat-max").textContent = `/ ${MAX_POINTS} marks`;
  $("#stat-pct").textContent = `${t.pct}%`;
  $("#stat-grade").textContent = t.grade;
  $("#stat-streak").textContent = streak();
}

function statusFor(c, n) {
  const p = prog(c.id);
  if (p.solved && p.revealed) return `<span class="status revealed" title="Solved after viewing solution">✓</span>`;
  if (p.solved) return `<span class="status solved" title="Solved">✓</span>`;
  if (p.fails > 0) return `<span class="status failed" title="Attempted">${n}</span>`;
  if (p.code && p.code !== c.starter) return `<span class="status started" title="In progress">${n}</span>`;
  return `<span class="status">${n}</span>`;
}

function renderSidebar() {
  const cur = current().id;
  const q = $("#search").value.trim().toLowerCase();
  const f = state.filter;
  $$("#filters button").forEach((b) => b.classList.toggle("on", b.dataset.filter === f));
  const tr = trackOf(current()), src = tr === "python" ? CH : trackById[tr].items;
  $("#filters [data-filter=if]").hidden = tr !== "python";
  if (tr !== "python" && f === "if") state.filter = "all";
  let html = tr === "python" ? `<button class="ch-item playground-item ${cur === "playground" ? "active" : ""}" data-id="playground">
    <span class="status play">✦</span><span class="title">Playground</span><span class="score">free code</span></button>`
    : `<a class="ch-item track-head" href="#/track/${tr}"><span class="status play">${trackById[tr].icon}</span><span class="title">${esc(trackById[tr].label)}</span><span class="score">all ›</span></a>`;
  let shown = 0;
  for (const [lvl, meta] of Object.entries(LEVELS)) {
    const items = src.filter((c) => c.level === lvl);
    const done = items.filter((c) => prog(c.id).solved).length;
    const visible = items.filter((c) => {
      const p = prog(c.id);
      if (f === "todo" && p.solved) return false;
      if (f === "done" && !p.solved) return false;
      if (f === "if" && c.topic !== "if") return false;
      return !q || c.title.toLowerCase().includes(q) || (c.func || "").toLowerCase().includes(q);
    });
    if (!visible.length) continue;
    shown += visible.length;
    const collapsed = state.collapsed[lvl] && !q;
    html += `<div class="level-group ${collapsed ? "collapsed" : ""}" data-level="${lvl}">
      <div class="level-head" data-toggle="${lvl}"><span class="lvl-dot" style="background:var(--${lvl})"></span><h3 style="color:var(--${lvl})">${meta.label}</h3>
        <span class="count">${done}/${items.length}</span><span class="chev">▼</span></div>
      <div class="level-bar"><div style="width:${(done / items.length) * 100}%;background:var(--${lvl})"></div></div><div class="level-items">`;
    for (const c of visible) {
      const p = prog(c.id);
      const score = p.solved ? `${p.points}/${LEVELS[c.level].points}` : `${LEVELS[c.level].points}`;
      html += `<button class="ch-item ${c.id === cur ? "active" : ""}" data-id="${c.id}">
        ${statusFor(c, items.indexOf(c) + 1)}<span class="title">${esc(c.title)}</span>${c.topic === "if" && f !== "if" ? `<span class="topic-tag" title="if / elif / else practice">if</span>` : ""}<span class="score">${score}</span></button>`;
    }
    html += `</div></div>`;
  }
  if (!shown) html += `<div class="empty-list">${f === "done" ? "Nothing solved yet — you've got this." : f === "if" ? "No if/else challenges match." : "No challenges match."}</div>`;
  $("#ch-list").innerHTML = html;
}

let leftTab = "task";
let lastError = null;

function renderTitle() {
  const ch = current(), list = trackList(ch);
  const i = list.indexOf(ch);
  $("#btn-prev").disabled = i <= 0;
  $("#btn-next").disabled = i >= list.length - 1;
  $("#btn-vscode").hidden = !vscode.available || trackOf(ch) !== "python";
  $(".lang-tag").textContent = isSql(ch) ? "SQLite" : "Python 3";
  $("#left-tabs").hidden = isPlay(ch);
  $("#btn-submit").hidden = isPlay(ch);
  if (view === "problem") document.title = `${ch.title} · PyMarker`;
}

const levelPill = (ch) => `<span class="lvl-pill ${ch.level}">${LEVELS[ch.level].label}</span>`;
function questionHead(ch) {
  const p = prog(ch.id), max = LEVELS[ch.level].points, t = topicOf(ch);
  const marks = p.solved ? `Earned <b>${p.points}</b>/${max} marks`
    : p.revealed ? `Solution viewed · <b>0</b>/${max} marks`
    : `Worth <b>${pointsAvailable(ch)}</b>/${max} marks${p.hints ? ` (${p.hints} hint${p.hints > 1 ? "s" : ""} used)` : ""}`;
  return `<div class="q-head"><h1 class="q-title">${esc(ch.title)}</h1>${p.solved ? `<span class="solved-tag" title="Solved">✓ Solved</span>` : ""}</div>
    <div class="q-meta">${levelPill(ch)}${t ? `<button class="chip-btn" data-topic="${t.id}">${t.icon} ${esc(t.label)}</button>`
      : trackById[trackOf(ch)] ? `<a class="chip-btn" href="#/track/${trackOf(ch)}">${trackById[trackOf(ch)].icon} ${esc(trackById[trackOf(ch)].label)}</a>` : ""}
      <button class="chip-btn" data-open-tab="help">💡 Hints</button><span class="marks-tag">${marks}</span></div>`;
}

function renderLeft() {
  const ch = current();
  $$("#left-tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === leftTab));
  const p = prog(ch.id);
  $("#help-dot").hidden = !(p.fails > 0 && !p.solved && p.hints < (ch.hints?.length || 0) && leftTab !== "help");
  let html;
  if (isPlay(ch)) {
    html = `<div class="task"><p>A free space to experiment. Nothing here is marked and your code is saved automatically.</p>
      <p>Ideas: test a function before you submit it, explore <code>math</code>, <code>random</code>, <code>itertools</code> or <code>collections</code>, or debug with <code>print()</code>.</p></div>` + shortcutsHtml();
  } else if (leftTab === "task") {
    html = questionHead(ch) + `<div class="task">${ch.description}</div>` + examplesHtml(ch) + shortcutsHtml();
  } else if (leftTab === "help") {
    html = hintsHtml(ch);
  } else if (leftTab === "solution") {
    html = solutionHtml(ch);
  } else {
    html = subsHtml(ch);
  }
  $("#left-body").innerHTML = html;
}

function shortcutsHtml() {
  return `<div class="shortcuts"><div class="section-label">Shortcuts</div><div class="tips">
    <div class="tip-row"><kbd>${MOD}</kbd><kbd>↵</kbd> Run your code</div>
    <div class="tip-row"><kbd>${MOD}</kbd><kbd>⇧</kbd><kbd>↵</kbd> Submit for marking</div>
    <div class="tip-row"><kbd>${MOD}</kbd><kbd>/</kbd> Comment / uncomment lines</div>
    <div class="tip-row"><kbd>${ALT}</kbd><kbd>←</kbd><kbd>→</kbd> Previous / next challenge</div></div></div>`;
}

function examplesHtml(ch) {
  if (isSql(ch)) {
    const pv = sqlPreviewCache[ch.id];
    return `<div class="section-label">Tables</div>` + (pv
      ? `<div id="sql-tables">${pv.tables.map((t) => `<div class="tbl-name">${esc(t.name)}</div>${dataTable(t)}`).join("")}</div>`
      : `<div id="sql-tables" class="muted small">Loading the tables…</div>`);
  }
  const vis = ch.tests.filter((t) => !t.hidden);
  const hidden = ch.tests.length - vis.length;
  let html = `<div class="section-label">Examples</div>`;
  vis.forEach((t, i) => {
    html += `<div class="example"><div class="example-head"><span>Example ${i + 1}</span></div><div class="example-grid">`;
    if (ch.type === "stdout") {
      html += `<span class="k">input</span><pre>${esc(t.input.length ? t.input.join("\n") : "(none)")}</pre>
               <span class="k">output</span><pre>${esc(t.expected)}</pre>`;
    } else if (ch.type === "function") {
      html += `<span class="k">call</span><pre>${esc(`${ch.func}(${t.args.map(pyRepr).join(", ")})`)}</pre>
               <span class="k">returns</span><pre>${esc(pyRepr(t.expected))}</pre>`;
    } else {
      html += `<span class="k">code</span><pre>${esc(t.code)}</pre><span class="k">result</span><pre>${esc(pyRepr(t.expected))}</pre>`;
    }
    html += `</div></div>`;
  });
  if (hidden) html += `<div class="hidden-count">🔒 Plus ${hidden} hidden test${hidden > 1 ? "s" : ""} checking edge cases.</div>`;
  if (ch.type === "stdout" && vis[0]?.input.length)
    html += `<button class="btn" data-fill-input>Use example 1 as program input</button>`;
  return html;
}

function hintsHtml(ch) {
  const p = prog(ch.id);
  const cost = p.solved || p.revealed ? "" : `<span class="cost">−20% marks</span>`;
  let html = `<p class="help-intro">Stuck? Reveal the hints one at a time. Each one nudges you a bit further.</p>`;
  for (let i = 0; i < ch.hints.length; i++) {
    if (i < p.hints) html += `<div class="hint-card"><span class="hint-num">${i + 1}</span><div>${ch.hints[i]}</div></div>`;
    else if (i === p.hints) html += `<div class="hint-locked"><span class="hint-num">${i + 1}</span><span>Hint ${i + 1} ${cost}</span><button class="btn" id="btn-hint">💡 Reveal</button></div>`;
    else html += `<div class="hint-locked"><span class="hint-num">${i + 1}</span><span>Locked</span></div>`;
  }
  if (lastError) html += `<div class="explain"><b>About your last error: <code>${esc(lastError.type)}</code></b><br>${explainErr(lastError.type)}</div>`;
  return html;
}

function solutionHtml(ch) {
  const p = prog(ch.id);
  const canSolution = p.revealed || p.solved || p.fails >= SOLUTION_AFTER_FAILS || p.hints >= ch.hints.length;
  let html = `<div class="solution-card"><h4>🔓 Model solution</h4>`;
  if (p.solutionOpen) {
    html += `<pre><code>${esc(ch.solution)}</code></pre><div class="actions"><button class="btn" id="btn-load-solution">Load into editor</button>
      <button class="btn ghost" id="btn-solution">Hide</button></div><p class="muted small">Tip: type it out yourself rather than pasting. You'll remember it far better.</p>`;
  } else if (canSolution) {
    html += `<p class="muted small">${p.solved || p.revealed ? "Compare your answer with ours." : "Viewing it before you've solved it means this challenge scores 0 marks."}</p>
      <button class="btn ${p.solved ? "" : "danger"}" id="btn-solution">Show solution</button>`;
  } else {
    html += `<p class="muted small">🔒 Unlocks after ${SOLUTION_AFTER_FAILS} failed submissions (${p.fails}/${SOLUTION_AFTER_FAILS}) or once you've used every hint (${p.hints}/${ch.hints.length}).</p>`;
  }
  return html + `</div>`;
}

const SUB_LABEL = { ok: ["Accepted", "pass"], wrong: ["Wrong Answer", "fail"], error: ["Runtime Error", "fail"], timeout: ["Time Limit Exceeded", "fail"] };
function ago(t) {
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hr ago`;
  return new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
function subsHtml(ch) {
  const subs = prog(ch.id).subs || [];
  if (!subs.length) return placeholder("🕑", "No submissions yet", "Every time you press Submit, the result and your code are saved here.");
  return `<div class="subs">${subs.slice().reverse().map((x, j) => {
    const i = subs.length - 1 - j, [label, cls] = SUB_LABEL[x.kind] || SUB_LABEL.wrong;
    return `<details class="sub-row"><summary><span class="sub-status ${cls}">${label}</span>
      <span class="sub-tests">${x.total ? `${x.passed}/${x.total} tests` : ""}</span><span class="sub-time">${ago(x.t)}</span></summary>
      ${x.code ? `<pre><code>${esc(x.code)}</code></pre><button class="btn" data-load-sub="${i}">Load this code into the editor</button>` : `<p class="muted small" style="margin:0 12px 12px">Same code as the next submission.</p>`}</details>`;
  }).join("")}</div>`;
}

const placeholder = (icon, title, sub) => `<div class="placeholder"><span class="big">${icon}</span><div><h3>${title}</h3><p>${sub}</p></div></div>`;
function verdictHtml(kind, icon, title, sub, passed, total) {
  return `<div class="verdict ${kind}"><span class="v-ico">${icon}</span><div><h3>${title}</h3>${sub ? `<p>${sub}</p>` : ""}</div>
    ${total ? `<div class="mark"><strong>${passed}/${total}</strong><span>tests passed</span></div>` : ""}</div>`;
}
const errorBlock = (err) => `<div class="err-line">${esc(err.type)}${err.line ? ` · line ${err.line}` : ""}: ${esc(err.message)}</div>`;
const explainBlock = (err) => `<div class="explain"><b>What does <code>${esc(err.type)}</code> mean?</b><br>${explainErr(err.type)}</div>`;

function renderGrade(data, ch, earned, firstSolve) {
  const out = $("#console-results");
  showConsole("results");
  if (data.timeout) {
    lastError = { type: "Timeout" };
    out.innerHTML = verdictHtml("fail", "⏱", "Time limit exceeded", "Your code took longer than 8 seconds.") + explainBlock(lastError);
    return renderLeft();
  }
  if (data.internal_error) {
    out.innerHTML = verdictHtml("fail", "!", "Something went wrong running your code", esc(data.internal_error));
    return;
  }
  if (data.load_error) {
    lastError = data.load_error;
    markErrorLine(data.load_error.line);
    out.innerHTML = verdictHtml("fail", "✗", "Incorrect — your code didn't run", "Fix the error below, then submit again.")
      + errorBlock(data.load_error) + explainBlock(data.load_error);
    return renderLeft();
  }
  const res = data.results;
  const passed = res.filter((r) => r.passed).length;
  const all = passed === res.length;
  let html = all
    ? verdictHtml("pass", "✓", "Correct!", firstSolve ? `+${earned} marks — nice work.` : "All tests pass.", passed, res.length)
    : verdictHtml("fail", "✗", "Incorrect", `${Math.round((passed / res.length) * 100)}% of tests passed. Open a failing test to see why.`, passed, res.length);
  const actions = [];
  if (all) {
    const tl = trackList(ch).filter((c) => !isPlay(c)), next = tl[tl.indexOf(ch) + 1];
    if (next) actions.push(`<button class="btn primary" data-goto="${next.id}">Next: ${esc(next.title)} →</button>`);
    actions.push(`<button class="btn" data-open-tab="solution">Compare with model solution</button>`);
  } else if (prog(ch.id).hints < ch.hints.length) {
    actions.push(`<button class="btn" data-open-tab="help">💡 Get a hint</button>`);
  }
  if (actions.length) html += `<div class="verdict-actions">${actions.join("")}</div>`;
  html += `<div class="test-dots">${res.map((r) => `<span class="${r.passed ? "ok" : ""}"></span>`).join("")}</div>`;
  let firstErr = null, firstFailOpened = false;
  res.forEach((r, i) => {
    if (r.error && !firstErr) firstErr = r.error;
    const open = !r.passed && !firstFailOpened; if (open) firstFailOpened = true;
    const label = r.hidden ? `Hidden test ${i + 1}` : esc(r.call);
    html += `<details class="test ${r.passed ? "pass" : "fail"}" ${open ? "open" : ""}><summary><span class="st">${r.passed ? "✓" : "✗"}</span><span class="call">${label}</span>${r.hidden ? `<span class="tag">hidden</span>` : ""}</summary>`;
    html += `<div class="test-body">`;
    if (isSql(ch)) {
      if (r.error) html += `<span class="k">error</span>${errorBlock(r.error)}`;
      else if (r.hidden) html += `<span class="k">result</span><span>${r.passed ? "Passed." : esc(r.why || "Different result.")} The hidden dataset has the same tables with different rows, so hard-coded answers fail here.</span>`;
      else {
        if (r.why) html += `<span class="k">why</span><span>${esc(r.why)}</span>`;
        html += `<span class="k">expected</span>${dataTable(r.exp)}<span class="k">yours</span>${dataTable(r.got)}`;
      }
    } else if (r.hidden) {
      html += `<span class="k">result</span><span class="err-line" style="color:var(--text-2)">${r.passed ? "Passed." : r.error ? esc(`${r.error.type}: ${r.error.message}`) : "Wrong answer on a hidden case — think about edge cases: empty input, negatives, duplicates, very large numbers."}</span>`;
    } else {
      html += `<span class="k">expected</span><pre>${esc(r.expected)}</pre>`;
      if (r.error) html += `<span class="k">error</span>${errorBlock(r.error)}`;
      else html += `<span class="k">got</span><pre>${esc(r.got === "" ? "(no output)" : r.got)}</pre>`;
      if (r.printed) html += `<span class="k">printed</span><pre>${esc(r.printed)}</pre>`;
      if (!r.passed && !r.error && ch.type === "function" && r.got === "None")
        html += `<span class="k">tip</span><span>Your function returned <code>None</code> — did you <code>print</code> instead of <code>return</code>?</span>`;
    }
    html += `</div></details>`;
  });
  if (firstErr) html += explainBlock(firstErr);
  out.innerHTML = html;
  out.scrollTop = 0;
  lastError = firstErr;
  if (firstErr) markErrorLine(firstErr.line);
  renderLeft();
}

let caseIdx = 0;
function renderCases() {
  const ch = current();
  if (isSql(ch)) {
    const pv = sqlPreviewCache[ch.id];
    $("#case-pills").innerHTML = `<span class="case-pill on">Example dataset</span>${ch.hiddenSetup ? `<span class="muted small">+ a hidden dataset</span>` : ""}`;
    $("#case-detail").innerHTML = !pv ? `<span class="muted small">Loading…</span>`
      : pv.expected?.columns ? `<span class="k">expected result</span>${dataTable(pv.expected)}` : `<span class="muted small">Couldn't load the expected result.</span>`;
    $("#stdin-wrap").hidden = true;
    return;
  }
  const vis = isPlay(ch) ? [] : ch.tests.filter((t) => !t.hidden);
  caseIdx = Math.min(caseIdx, Math.max(0, vis.length - 1));
  const hidden = isPlay(ch) ? 0 : ch.tests.length - vis.length;
  $("#case-pills").innerHTML = vis.map((_, i) => `<button class="case-pill ${i === caseIdx ? "on" : ""}" data-case="${i}">Case ${i + 1}</button>`).join("")
    + (hidden ? `<span class="muted small">+ ${hidden} hidden</span>` : "");
  const t = vis[caseIdx];
  let d = "";
  if (t && ch.type === "function") d = `<span class="k">call</span><pre>${esc(`${ch.func}(${t.args.map(pyRepr).join(", ")})`)}</pre><span class="k">expected</span><pre>${esc(pyRepr(t.expected))}</pre>`;
  else if (t && ch.type === "script") d = `<span class="k">code</span><pre>${esc(t.code)}</pre><span class="k">expected</span><pre>${esc(pyRepr(t.expected))}</pre>`;
  else if (t) d = `<span class="k">expected output</span><pre>${esc(t.expected)}</pre>`;
  $("#case-detail").innerHTML = d;
  $("#stdin-wrap").hidden = !(isPlay(ch) || ch.type === "stdout");
}

function showConsole(tab) {
  $$("#console-tabs button").forEach((b) => b.classList.toggle("on", b.dataset.ctab === tab));
  $("#console-results").hidden = tab !== "results";
  $("#console-input").hidden = tab !== "input";
}

function renderAll() { renderHeader(); renderSidebar(); renderTitle(); renderLeft(); }

// ═════════════════════════ dashboard ═════════════════════════
function openDashboard() {
  const t = totals();
  const C = 2 * Math.PI * 52;
  let rows = "";
  for (const [lvl, meta] of Object.entries(LEVELS)) {
    const items = CH.filter((c) => c.level === lvl);
    const solved = items.filter((c) => prog(c.id).solved).length;
    const pts = items.reduce((s, c) => s + prog(c.id).points, 0);
    const max = items.length * meta.points;
    rows += `<div class="lvl-row"><span style="color:var(--${lvl});font-weight:600">${meta.label}</span>
      <div class="bar"><div style="width:${(pts / max) * 100}%;background:var(--${lvl})"></div></div>
      <span class="num">${solved}/${items.length} · ${pts}/${max}</span><span class="g">${gradeFor(Math.round((pts / max) * 100))}</span></div>`;
  }
  const next = GRADES.slice().reverse().find(([min]) => min > t.pct);
  const msg = t.solved === 0 ? "Solve your first challenge to start building a grade."
    : next ? `${Math.ceil((next[0] / 100) * MAX_POINTS) - t.points} more marks to reach ${next[1]}.`
    : "Top grade — outstanding work!";
  $("#modal-body").innerHTML = `
    <div class="dash-hero">
      <div class="ring"><svg viewBox="0 0 120 120"><defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b82ff"/><stop offset="1" stop-color="#9b6bff"/></linearGradient></defs>
        <circle class="track" cx="60" cy="60" r="52"/><circle class="val" cx="60" cy="60" r="52" stroke-dasharray="${C}" stroke-dashoffset="${C}" id="ring-val"/></svg>
        <div class="center"><div><b>${t.grade}</b><span>${t.pct}%</span></div></div></div>
      <div><h2 id="modal-title">${learner().name ? `${esc(learner().name)}'s progress report` : "Your progress report"}</h2><p>${msg}</p></div>
    </div>
    <div class="dash-stats">
      <div class="dash-stat"><b>${t.solved}/${CH.length}</b><span>challenges solved</span></div>
      <div class="dash-stat"><b>${t.points}/${MAX_POINTS}</b><span>marks</span></div>
      <div class="dash-stat"><b>🔥 ${streak()}</b><span>day streak</span></div>
      <div class="dash-stat"><b>${t.hints}</b><span>hints used</span></div>
    </div>
    <div class="section-label" style="margin-top:0">By level</div>${rows}
    <div class="section-label">Grade boundaries</div>
    <div class="boundaries">${GRADES.map(([min, g]) => `<span class="${g === t.grade ? "now" : ""}">${g} ${min ? `≥ ${min}%` : `&lt; 40%`}</span>`).join("")}</div>
    <div class="dash-actions">
      <button class="btn" id="btn-export">⬇ Export progress</button>
      <button class="btn" id="btn-import">⬆ Import progress</button>
      <span class="spacer"></span>
      <button class="btn danger" id="btn-reset-all">Reset everything</button>
    </div>`;
  $("#modal").hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const el = $("#ring-val"); if (el) el.style.strokeDashoffset = C * (1 - t.pct / 100);
  }));
}
const closeModal = () => ($("#modal").hidden = true);

// ═════════════════════════ actions ═════════════════════════
let busy = false;
function setBusy(b, what) {
  busy = b;
  $("#btn-run").disabled = b;
  $("#btn-submit").disabled = b;
  $("#btn-submit").querySelector("span").textContent = b && what === "grade" ? "Marking…" : "Submit";
  $("#btn-run").querySelector("span").textContent = b && what === "run" ? "Running…" : "▶ Run";
}

function selectChallenge(id) {
  if (saveTimer && byId[state.current]) { // don't lose the last 300ms of typing on the old challenge
    clearTimeout(saveTimer); saveTimer = null;
    prog(current().id).code = editor.getValue();
  }
  state.current = id;
  save();
  const ch = current();
  const p = prog(ch.id);
  lastError = null;
  editor.setOption("mode", isSql(ch) ? "text/x-sqlite" : "python");
  applyingRemote = true;
  editor.setValue(p.code ?? ch.starter);
  applyingRemote = false;
  editor.clearHistory();
  editor.setCursor(editor.lineCount(), 0);
  if (ch.type === "stdout") $("#stdin").value = (ch.tests.find((t) => !t.hidden)?.input || []).join("\n");
  else if (!isPlay(ch)) $("#stdin").value = "";
  leftTab = "task";
  caseIdx = 0;
  renderCases();
  if (isSql(ch)) loadSqlPreview(ch);
  showConsole("input");
  $("#console-results").innerHTML = isPlay(ch)
    ? placeholder("✦", "Playground", "Press ▶ Run to see your output here.")
    : p.solved
      ? placeholder("✅", "Already solved", `You earned ${p.points}/${LEVELS[ch.level].points} marks. Resubmit any time to check a new approach.`)
      : placeholder("📝", "Write your code, then submit it for marking", "Use ▶ Run to try things out first. Submit runs every test, including hidden ones.");
  renderAll();
  if (vscode.on) trackOf(ch) === "python" ? vscode.link() : vscode.unlink(); // keeps VS Code on the same lesson; newest copy wins
  if (view === "problem" && !isTouch) editor.focus();
}
const openProblem = (id) => { location.hash = `#/problem/${id}`; };
const go = (delta) => {
  const list = trackList(current()), i = list.indexOf(current()) + delta;
  if (list[i]) openProblem(list[i].id);
};

async function runCode() {
  if (busy) return;
  setBusy(true, "run");
  if (isSql(current())) return runSql();
  const data = await runner.call({ action: "run", code: editor.getValue(), stdin: $("#stdin").value });
  setBusy(false);
  showConsole("results");
  const out = $("#console-results");
  if (data.timeout) {
    out.innerHTML = verdictHtml("fail", "⏱", "Time limit exceeded", "Your code took longer than 8 seconds.") + explainBlock({ type: "Timeout" });
    return;
  }
  let html = `<div class="out-label"><span>Output</span><span>▶ Run — not marked</span></div><pre class="console-out">${esc(data.output || "(no output)")}${data.truncated ? "\n… output truncated" : ""}</pre>`;
  if (data.error) { html += errorBlock(data.error) + explainBlock(data.error); markErrorLine(data.error.line); lastError = data.error; renderLeft(); }
  const ch = current();
  if (!data.error && ch.type !== "stdout" && !isPlay(ch) && !data.output)
    html += `<p class="muted small">Nothing printed — normal for this kind of task. Add a line like <code>print(${esc(ch.func || "...")}(...))</code> to test it, or press Submit.</p>`;
  out.innerHTML = html;
}

async function submitCode() {
  const ch = current();
  if (busy || isPlay(ch)) return;
  const p = prog(ch.id);
  setBusy(true, "grade");
  const data = isSql(ch)
    ? await runner.call({ action: "grade_sql", code: editor.getValue(), spec: { setup: ch.setup, hiddenSetup: ch.hiddenSetup, solution: ch.solution, ordered: !!ch.ordered } }, sqlLimit()).then((d) => (noteSql(d), d))
    : await runner.call({ action: "grade", code: editor.getValue(), spec: { type: ch.type, func: ch.func, tests: ch.tests } });
  setBusy(false);
  const allPass = !data.timeout && !data.load_error && !data.internal_error && data.results?.length && data.results.every((r) => r.passed);
  let earned = 0, firstSolve = false;
  p.submits = (p.submits || 0) + 1;
  const code = editor.getValue();
  const lastSub = (p.subs || []).at(-1);
  p.subs = (p.subs || []).concat({
    t: Date.now(), code: code.length > 8000 ? code.slice(0, 8000) + "\n# … (trimmed)" : code,
    kind: allPass ? "ok" : data.timeout ? "timeout" : data.load_error || data.internal_error ? "error" : data.results?.some((r) => r.error) ? "error" : "wrong",
    passed: data.results ? data.results.filter((r) => r.passed).length : 0, total: data.results ? data.results.length : 0,
  }).slice(-20);
  if (lastSub && lastSub.code === code) p.subs.at(-2).code = ""; // identical resubmit: keep one copy of the code
  if (allPass) {
    earned = pointsAvailable(ch);
    firstSolve = !p.solved;
    p.solved = true;
    p.points = Math.max(p.points, earned);
    if (!state.days.includes(today())) state.days.push(today());
  } else {
    p.fails++;
  }
  save();
  renderGrade(data, ch, earned, firstSolve);
  renderHeader(); renderSidebar(); renderTitle();
  if (allPass) renderLeft();
  if (allPass && firstSolve) {
    confetti();
    const lvlItems = CH.filter((c) => c.level === ch.level);
    if (lvlItems.every((c) => prog(c.id).solved)) setTimeout(() => toast(`🏆 You've completed every <b>${LEVELS[ch.level].label}</b> challenge!`, 4000), 600);
  }
}

// ═════════════════════════ wiring ═════════════════════════
const runner = new PyRunner((status, msg) => {
  const el = $("#py-status");
  el.className = `py-status ${status}`;
  el.querySelector(".txt").textContent = status === "ready" ? "Python ready" : status === "loading" ? "Loading Python" : `Python failed: ${msg}`;
});

$("#btn-run").onclick = runCode;
$("#btn-submit").onclick = submitCode;
$("#btn-prev").onclick = () => go(-1);
$("#btn-next").onclick = () => go(1);
$("#btn-dashboard").onclick = openDashboard;
$("#btn-reset").onclick = () => {
  if (confirm("Reset this challenge to the starter code? Your current code will be lost.")) editor.setValue(current().starter);
};
$("#btn-vscode").onclick = async () => {
  if (vscode.on) { vscode.unlink(); toast("Stopped syncing with VS Code"); return; }
  if (await vscode.link()) toast("Opened in VS Code — edits sync both ways. Submit here to get marked.", 4000);
};
$("#font-dec").onclick = () => { state.fontSize = Math.max(11, state.fontSize - 1); save(); applyFont(); };
$("#font-inc").onclick = () => { state.fontSize = Math.min(22, state.fontSize + 1); save(); applyFont(); };
$("#search").addEventListener("input", renderSidebar);
$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  state.filter = b.dataset.filter; save(); renderSidebar();
});
$("#sidebar").addEventListener("click", (e) => {
  const t = e.target.closest("[data-toggle]");
  if (t) { state.collapsed[t.dataset.toggle] = !state.collapsed[t.dataset.toggle]; save(); renderSidebar(); return; }
  const b = e.target.closest(".ch-item");
  if (b) { closeDrawer(); openProblem(b.dataset.id); }
});

// ── phone layout: challenge drawer + coding key bar ──
const isTouch = matchMedia("(hover: none) and (pointer: coarse)").matches;
if (isTouch) {
  editor.getInputField().blur(); // don't pop the keyboard up on load
  // stop iPhone Safari zooming in whenever the editor or a text box gets focus (pinch-zoom still works)
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    document.querySelector('meta[name="viewport"]').content = "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover";
  }
}
// ask the browser not to clear saved progress when storage runs low (Safari otherwise may after a week unused)
navigator.storage?.persist?.().catch(() => {});

function openDrawer() {
  document.body.classList.add("drawer-open"); $("#drawer-backdrop").hidden = false;
  $("#btn-menu").setAttribute("aria-expanded", "true");
  $("#ch-list .active")?.scrollIntoView({ block: "center" });
}
function closeDrawer() {
  if (!document.body.classList.contains("drawer-open")) return;
  document.body.classList.remove("drawer-open"); $("#drawer-backdrop").hidden = true;
  $("#btn-menu").setAttribute("aria-expanded", "false");
}
$("#btn-menu").addEventListener("click", () => document.body.classList.contains("drawer-open") ? closeDrawer() : openDrawer());
$("#drawer-backdrop").addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

// Buttons use pointerdown + preventDefault so the phone keyboard stays open while tapping them.
$("#keybar").addEventListener("pointerdown", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  e.preventDefault();
  const cm = editor;
  if (b.dataset.key === "indent") cm.somethingSelected() ? cm.indentSelection("add") : cm.replaceSelection("    ", "end");
  else if (b.dataset.key === "dedent") cm.indentSelection("subtract");
  else if (b.dataset.key === "undo") cm.undo();
  else if (b.dataset.key === "redo") cm.redo();
  else if (b.dataset.pair) {
    const [open, close] = b.dataset.pair;
    const sel = cm.getSelection();
    cm.replaceSelection(open + sel + close);
    if (!sel) { const c = cm.getCursor(); cm.setCursor({ line: c.line, ch: c.ch - 1 }); }
  } else if (b.dataset.ins) cm.replaceSelection(b.dataset.ins);
  cm.focus();
});
$("#left-tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  leftTab = b.dataset.tab; renderLeft();
});
$("#case-pills").addEventListener("click", (e) => {
  const b = e.target.closest("[data-case]"); if (!b) return;
  caseIdx = +b.dataset.case;
  const ch = current(), t = ch.tests.filter((x) => !x.hidden)[caseIdx];
  if (ch.type === "stdout" && t) $("#stdin").value = t.input.join("\n");
  renderCases();
});
$("#console-tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (b) showConsole(b.dataset.ctab);
});
$("#console-results").addEventListener("click", (e) => {
  const g = e.target.closest("[data-goto]");
  if (g) return openProblem(g.dataset.goto);
  const o = e.target.closest("[data-open-tab]");
  if (o) { leftTab = o.dataset.openTab; renderLeft(); }
});
$("#left-body").addEventListener("click", (e) => {
  const ch = current();
  const p = prog(ch.id);
  const tp = e.target.closest("[data-topic]");
  if (tp) return openTopic(tp.dataset.topic);
  const ot = e.target.closest("[data-open-tab]");
  if (ot) { leftTab = ot.dataset.openTab; return renderLeft(); }
  const ls = e.target.closest("[data-load-sub]");
  if (ls) {
    const sub = (p.subs || [])[+ls.dataset.loadSub];
    if (sub && confirm("Replace the code in the editor with this submission?")) editor.setValue(sub.code);
    return;
  }
  if (e.target.closest("#btn-hint")) {
    if (p.hints < ch.hints.length) p.hints++;
    save(); renderLeft(); renderTitle();
  } else if (e.target.closest("#btn-solution")) {
    if (!p.solutionOpen && !p.solved && !p.revealed) {
      if (!confirm("Viewing the solution before solving it means this challenge will score 0 marks. Continue?")) return;
      p.revealed = true; // penalty only applies if viewed before solving
    }
    p.solutionOpen = !p.solutionOpen;
    save(); renderAll();
  } else if (e.target.closest("#btn-load-solution")) {
    editor.setValue(ch.solution);
  } else if (e.target.closest("[data-fill-input]")) {
    $("#stdin").value = ch.tests.filter((t) => !t.hidden)[0].input.join("\n");
    caseIdx = 0; renderCases(); showConsole("input");
  }
});
$("#modal").addEventListener("click", (e) => {
  if (e.target === $("#modal") || e.target.closest("[data-close]")) return closeModal();
  if (e.target.closest("#btn-export")) {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `pymarker-progress-${learner().name ? slug(learner().name) + "-" : ""}${today()}.json` });
    a.click(); URL.revokeObjectURL(a.href);
  } else if (e.target.closest("#btn-import")) {
    $("#import-file").click();
  } else if (e.target.closest("#btn-reset-all")) {
    if (confirm(`Delete ALL of ${learner().name ? learner().name + "'s" : "this learner's"} progress, marks and saved code? This can't be undone.`)) {
      store.del(STORE_KEY); location.reload();
    }
  }
});
$("#import-file").addEventListener("change", async (e) => {
  const file = e.target.files[0]; if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data || typeof data.progress !== "object") throw new Error("not a PyMarker progress file");
    store.set(STORE_KEY, JSON.stringify(data));
    location.reload();
  } catch (err) { toast(`Import failed: ${esc(err.message)}`); }
});
document.addEventListener("keydown", (e) => {
  const mod = e.metaKey || e.ctrlKey;
  if (e.key === "Escape" && !$("#modal").hidden) return closeModal();
  if (e.key === "Escape") { closeTopic(); closeMenu(); }
  if (view !== "problem") return;
  if (mod && e.key === "Enter") { e.preventDefault(); return e.shiftKey ? submitCode() : runCode(); }
  if (e.altKey && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); go(e.key === "ArrowRight" ? 1 : -1); }
});


// ═════════════════════════ views & routing ═════════════════════════
// #/ → roadmap   #/problems → problem list   #/problem/<id> → workspace
const VIEWS = { roadmap: "#view-roadmap", problems: "#view-problems", problem: "#view-problem", page: "#view-page" };
function showView(v) {
  const changed = view !== v;
  view = v;
  document.body.dataset.view = v;
  for (const [k, sel] of Object.entries(VIEWS)) $(sel).hidden = k !== v;
  $$(".main-nav a").forEach((a) => a.classList.toggle("on", a.dataset.nav === v));
  renderMenu();
  closeDrawer();
  if (v !== "roadmap") closeTopic();
  if (v === "roadmap") { renderRoadmap(); document.title = "Roadmap · PyMarker"; }
  if (v === "problems") { renderProblems(); document.title = "Problems · PyMarker"; }
  if (v === "problem") { editor.refresh(); renderTitle(); }
  if (changed) window.scrollTo(0, 0);
}
function route() {
  const h = location.hash;
  let m2;
  closeMenu();
  const m = h.match(/^#\/problem\/([\w-]+)/);
  if (m && byId[m[1]]) {
    if (m[1] !== state.current) selectChallenge(m[1]);
    showView("problem");
    if (!isTouch) editor.focus();
  } else if (h.startsWith("#/problems")) {
    showView("problems");
  } else if ((m2 = h.match(/^#\/(track|cheatsheets|quizzes|quiz|system-design|lesson)(?:\/([\w-]+))?/))) {
    showView("page");
    const [, kind, arg] = m2;
    ({ track: renderTrack, cheatsheets: renderCheatsheets, quizzes: renderQuizzes, quiz: renderQuiz,
       "system-design": renderLessons, lesson: renderLesson })[kind](arg);
    $("#view-page").scrollTop = 0;
  } else {
    showView("roadmap");
    if (pendingTopic) { openTopic(pendingTopic); pendingTopic = null; }
  }
}
let pendingTopic = null;
window.addEventListener("hashchange", route);

// ── roadmap ──
const solvedIn = (items) => items.filter((c) => prog(c.id).solved).length;
function renderRoadmap() {
  const rows = [];
  for (const t of TOPICS) (rows[t.row] ||= []).push(t);
  const nextUp = TOPICS.find((t) => solvedIn(topicItems(t)) < t.ids.length);
  $("#rm-graph").innerHTML = rows.map((row) => `<div class="rm-row">${row.map((t) => {
    const items = topicItems(t), done = solvedIn(items), pct = (done / items.length) * 100;
    const cls = done === items.length ? "done" : t === nextUp ? "next" : done ? "started" : "";
    return `<button class="rm-node ${cls}" data-topic="${t.id}" id="node-${t.id}" title="${esc(t.blurb)}">
      <span class="rm-top"><span class="rm-ico">${t.icon}</span><span class="rm-label">${esc(t.label)}</span></span>
      <span class="rm-foot"><span class="rm-bar"><i style="width:${pct}%"></i></span><span class="rm-count">${done}/${items.length}</span></span>
      ${t === nextUp ? `<span class="rm-badge">Up next</span>` : ""}</button>`;
  }).join("")}</div>`).join("");
  requestAnimationFrame(drawEdges);
  renderStats();
  renderCalendar();
}
function drawEdges() {
  const wrap = $(".rm-graph-wrap"), svg = $("#rm-edges");
  if (!wrap || view !== "roadmap") return;
  const box = wrap.getBoundingClientRect();
  svg.setAttribute("width", box.width); svg.setAttribute("height", box.height);
  svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
  let paths = "";
  for (const t of TOPICS) for (const from of t.after) {
    const a = $(`#node-${from}`)?.getBoundingClientRect(), b = $(`#node-${t.id}`)?.getBoundingClientRect();
    if (!a || !b) continue;
    const x1 = a.left + a.width / 2 - box.left, y1 = a.bottom - box.top;
    const x2 = b.left + b.width / 2 - box.left, y2 = b.top - box.top;
    const my = (y1 + y2) / 2;
    const done = solvedIn(topicItems(topicById[from])) === topicById[from].ids.length;
    paths += `<path class="${done ? "lit" : ""}" d="M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}"/>`;
  }
  svg.innerHTML = paths;
}
new ResizeObserver(() => drawEdges()).observe(document.querySelector(".rm-graph-wrap"));

function ringSvg(size = 132) {
  // One ring, split into a segment per level (sized by how many challenges it has); each fills as you solve.
  const r = 52, C = 2 * Math.PI * r, gap = 6;
  let start = 0, arcs = "";
  for (const [lvl] of Object.entries(LEVELS)) {
    const items = CH.filter((c) => c.level === lvl);
    const seg = (C * items.length) / CH.length - gap;
    const fill = (seg * solvedIn(items)) / items.length;
    arcs += `<circle cx="60" cy="60" r="${r}" class="ring-track" stroke-dasharray="${seg} ${C}" stroke-dashoffset="${-start}"/>`;
    if (fill > 0) arcs += `<circle cx="60" cy="60" r="${r}" stroke="var(--${lvl})" stroke-dasharray="${fill} ${C}" stroke-dashoffset="${-start}"/>`;
    start += seg + gap;
  }
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" class="ring3">${arcs}</svg>`;
}
function renderStats() {
  const t = totals(), cur = current();
  const lv = Object.entries(LEVELS).map(([lvl, meta]) => {
    const items = CH.filter((c) => c.level === lvl);
    return `<div class="lv-row"><span class="lv-name" style="color:var(--${lvl})">${meta.label}</span><span class="lv-num">${solvedIn(items)}<span class="muted">/${items.length}</span></span></div>`;
  }).join("");
  const resume = isPlay(cur) || prog(cur.id).solved ? CH.find((c) => !prog(c.id).solved) : cur;
  $("#rm-stats").innerHTML = `
    <div class="st-top"><div class="lv-list">${lv}</div>
      <div class="ring-wrap">${ringSvg()}<div class="ring-center"><b>${t.solved}</b><span>/${CH.length}</span><small>Solved</small></div></div></div>
    <button class="grade-line" id="rm-grade"><span class="grade-letter sm">${t.grade}</span><span><b>${t.points}</b>/${MAX_POINTS} marks · ${t.pct}%</span><span class="muted">Report ›</span></button>
    ${resume ? `<a class="btn primary wide" href="#/problem/${resume.id}">${prog(resume.id).code ? "Continue" : "Start"}: ${esc(resume.title)} →</a>` : `<div class="all-done">🏆 Every challenge solved!</div>`}`;
}

let calOffset = 0; // months back from this month
function bestStreak() {
  const days = [...new Set(state.days)].sort();
  let best = 0, run = 0, prev = null;
  for (const d of days) {
    const cur = new Date(d + "T12:00:00");
    run = prev && (cur - prev) / 864e5 === 1 ? run + 1 : 1;
    best = Math.max(best, run); prev = cur;
  }
  return best;
}
function renderCalendar() {
  const now = new Date(), first = new Date(now.getFullYear(), now.getMonth() - calOffset, 1);
  const daysIn = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // Monday-first
  const solved = new Set(state.days), todayStr = today();
  let cells = "";
  for (let i = 0; i < lead; i++) cells += `<span></span>`;
  for (let d = 1; d <= daysIn; d++) {
    const ds = new Date(first.getFullYear(), first.getMonth(), d).toLocaleDateString("en-CA");
    cells += `<span class="day ${solved.has(ds) ? "hit" : ""} ${ds === todayStr ? "today" : ""}" title="${solved.has(ds) ? "Solved something" : ""}">${d}</span>`;
  }
  $("#rm-cal").innerHTML = `
    <div class="cal-head"><button class="btn icon ghost" data-cal="1" aria-label="Previous month">‹</button>
      <b>${first.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</b>
      <button class="btn icon ghost" data-cal="-1" aria-label="Next month" ${calOffset === 0 ? "disabled" : ""}>›</button></div>
    <div class="cal-grid">${["M", "T", "W", "T", "F", "S", "S"].map((x) => `<span class="dow">${x}</span>`).join("")}${cells}</div>
    <div class="streaks"><div><span class="muted small">Current streak</span><b>🔥 ${streak()} day${streak() === 1 ? "" : "s"}</b></div>
      <div><span class="muted small">Best streak</span><b>🏆 ${bestStreak()} day${bestStreak() === 1 ? "" : "s"}</b></div></div>
    <p class="muted small cal-tip">Solve one problem a day to keep your streak going.</p>`;
}
$("#view-roadmap").addEventListener("click", (e) => {
  const n = e.target.closest("[data-topic]"); if (n) return openTopic(n.dataset.topic);
  const c = e.target.closest("[data-cal]"); if (c) { calOffset = Math.max(0, calOffset + +c.dataset.cal); return renderCalendar(); }
  if (e.target.closest("#rm-grade")) openDashboard();
});

// ── topic drawer ──
function statusIcon(c) {
  const p = prog(c.id);
  if (p.solved) return `<span class="st-ico done" title="Solved">✓</span>`;
  if (p.fails > 0 || (p.code && p.code !== c.starter)) return `<span class="st-ico tried" title="In progress"></span>`;
  return `<span class="st-ico" title="Not started"></span>`;
}
function problemRows(items) {
  return items.map((c) => {
    const p = prog(c.id), max = LEVELS[c.level].points;
    return `<tr data-open="${c.id}" tabindex="0"><td class="c-st">${statusIcon(c)}</td>
      <td class="c-title"><a href="#/problem/${c.id}">${esc(c.title)}</a></td>
      <td class="c-lvl">${levelPill(c)}</td>
      <td class="c-marks">${p.solved ? `<b>${p.points}</b>/${max}` : `<span class="muted">${max}</span>`}</td></tr>`;
  }).join("");
}
const tableHead = `<thead><tr><th class="c-st">Status</th><th>Problem</th><th class="c-lvl">Level</th><th class="c-marks">Marks</th></tr></thead>`;
function openTopic(id) {
  const t = topicById[id]; if (!t) return;
  const items = topicItems(t), done = solvedIn(items);
  $("#td-title").innerHTML = `${t.icon} ${esc(t.label)} <span class="muted">(${done} / ${items.length})</span>`;
  $("#td-sub").textContent = t.blurb;
  const pre = t.after.map((a) => `<button class="chip-btn" data-topic="${a}">${topicById[a].icon} ${esc(topicById[a].label)}</button>`).join("");
  $("#td-body").innerHTML = `
    <div class="td-bar"><i style="width:${(done / items.length) * 100}%"></i></div>
    <div class="section-label">Key ideas</div><div class="concepts">${t.concepts.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
    ${pre ? `<div class="section-label">Builds on</div><div class="concepts">${pre}</div>` : ""}
    <div class="section-label">Problems</div>
    <table class="ptable">${tableHead}<tbody>${problemRows(items)}</tbody></table>`;
  $("#topic-drawer").hidden = false; $("#topic-backdrop").hidden = false;
  requestAnimationFrame(() => document.body.classList.add("topic-open"));
}
function closeTopic() {
  if ($("#topic-drawer").hidden) return;
  document.body.classList.remove("topic-open");
  $("#topic-drawer").hidden = true; $("#topic-backdrop").hidden = true;
}
$("#td-close").onclick = closeTopic;
$("#topic-backdrop").onclick = closeTopic;
$("#topic-drawer").addEventListener("click", (e) => {
  const tp = e.target.closest("[data-topic]"); if (tp) return openTopic(tp.dataset.topic);
  const row = e.target.closest("[data-open]");
  if (row) { e.preventDefault(); closeTopic(); openProblem(row.dataset.open); }
});

// ── problem list ──
const pl = { q: "", topic: "all", level: "all", status: "all" };
$("#pl-topic").innerHTML = `<option value="all">All topics</option>` + TOPICS.map((t) => `<option value="${t.id}">${t.icon} ${esc(t.label)}</option>`).join("");
function renderProblems() {
  const t = totals();
  $("#pl-summary").textContent = `${t.solved} of ${CH.length} solved · ${t.points}/${MAX_POINTS} marks · grade ${t.grade}`;
  $$("#pl-level button").forEach((b) => b.classList.toggle("on", b.dataset.level === pl.level));
  $$("#pl-status button").forEach((b) => b.classList.toggle("on", b.dataset.status === pl.status));
  $("#pl-topic").value = pl.topic;
  const q = pl.q.trim().toLowerCase();
  let html = "", shown = 0;
  for (const tp of TOPICS) {
    if (pl.topic !== "all" && pl.topic !== tp.id) continue;
    const all = topicItems(tp);
    const items = all.filter((c) => {
      const p = prog(c.id);
      if (pl.level !== "all" && c.level !== pl.level) return false;
      if (pl.status === "todo" && p.solved) return false;
      if (pl.status === "done" && !p.solved) return false;
      return !q || c.title.toLowerCase().includes(q) || (c.func || "").toLowerCase().includes(q);
    });
    if (!items.length) continue;
    shown += items.length;
    const done = solvedIn(all);
    html += `<section class="pl-group"><header><button class="pl-topic" data-topic="${tp.id}">${tp.icon} ${esc(tp.label)}</button>
      <span class="pl-count">${done}/${all.length}</span><span class="td-bar sm"><i style="width:${(done / all.length) * 100}%"></i></span></header>
      <table class="ptable">${tableHead}<tbody>${problemRows(items)}</tbody></table></section>`;
  }
  $("#pl-body").innerHTML = shown ? html : `<div class="empty-list">No problems match those filters.</div>`;
}
$("#pl-search").addEventListener("input", (e) => { pl.q = e.target.value; renderProblems(); });
$("#pl-topic").addEventListener("change", (e) => { pl.topic = e.target.value; renderProblems(); });
$("#pl-level").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { pl.level = b.dataset.level; renderProblems(); } });
$("#pl-status").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { pl.status = b.dataset.status; renderProblems(); } });
$("#pl-body").addEventListener("click", (e) => {
  const tp = e.target.closest("[data-topic]");
  if (tp) { pendingTopic = tp.dataset.topic; if (location.hash === "#/") route(); else location.hash = "#/"; return; }
  const row = e.target.closest("[data-open]");
  if (row) { e.preventDefault(); openProblem(row.dataset.open); }
});
for (const sel of ["#pl-body", "#topic-drawer"]) $(sel).addEventListener("keydown", (e) => {
  const row = e.target.closest("[data-open]");
  if (row && e.key === "Enter") { closeTopic(); openProblem(row.dataset.open); }
});

// ── theme ──
const THEME_KEY = "pymarker.theme";
let theme = store.get(THEME_KEY) === "light" ? "light" : "dark";
function applyTheme(t) {
  theme = t;
  document.documentElement.dataset.theme = t;
  editor.setOption("theme", t === "light" ? "default" : "material-darker");
  document.querySelector('meta[name="theme-color"]').content = t === "light" ? "#f6f7fb" : "#0a0d13";
}
$("#btn-theme").onclick = () => { applyTheme(theme === "light" ? "dark" : "light"); store.set(THEME_KEY, theme); if (view === "roadmap") drawEdges(); };


// ═════════════════════════ SQL helpers ═════════════════════════
let sqlWarm = false; // the first SQL call downloads SQLite, so allow longer
const sqlLimit = () => (sqlWarm ? TIME_LIMIT_MS : 45000);
// A timeout restarts the worker (and SQLite must be downloaded again); only a real answer means it's loaded.
const noteSql = (d) => { sqlWarm = !d.timeout && !d.internal_error; };
const sqlPreviewCache = {};
const cell = (v) => (v === null ? `<span class="null">NULL</span>` : esc(typeof v === "number" && !Number.isInteger(v) ? +v.toFixed(4) : v));
function dataTable(t, cap = 50) {
  if (!t || !t.columns) return `<span class="muted small">(no result)</span>`;
  const rows = t.rows.slice(0, cap);
  return `<div class="tbl-scroll"><table class="data"><thead><tr>${t.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((v) => `<td>${cell(v)}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="${t.columns.length}" class="muted">(no rows)</td></tr>`}</tbody></table></div>`
    + (t.rows.length > cap ? `<p class="muted small">… ${t.rows.length - cap} more rows</p>` : "");
}
async function loadSqlPreview(ch) {
  if (sqlPreviewCache[ch.id]) return; // examplesHtml / renderCases read the cache directly
  const pv = await runner.call({ action: "sql_preview", setup: ch.setup, code: ch.solution }, sqlLimit());
  noteSql(pv);
  if (pv.timeout || pv.internal_error || !pv.tables) return;
  sqlPreviewCache[ch.id] = pv;
  if (current() !== ch) return;
  if (leftTab === "task") renderLeft();
  renderCases();
}
async function runSql() {
  const ch = current();
  const data = await runner.call({ action: "run_sql", code: editor.getValue(), setup: ch.setup }, sqlLimit());
  noteSql(data);
  setBusy(false);
  showConsole("results");
  const out = $("#console-results");
  if (data.timeout) { out.innerHTML = verdictHtml("fail", "⏱", "Time limit exceeded", "Your query took too long."); return; }
  if (data.internal_error) { out.innerHTML = verdictHtml("fail", "!", "Something went wrong", esc(data.internal_error)); return; }
  if (data.error) { lastError = data.error; out.innerHTML = errorBlock(data.error) + explainBlock(data.error); renderLeft(); return; }
  out.innerHTML = `<div class="out-label"><span>Result · ${data.count} row${data.count === 1 ? "" : "s"}</span><span>▶ Run on the example dataset — not marked</span></div>${dataTable(data)}`;
}

// ═════════════════════════ menu ═════════════════════════
const menuOpenGroups = new Set(["python"]);
function renderMenu() {
  const h = location.hash || "#/";
  const solvedOf = (items) => items.filter((c) => prog(c.id).solved).length;
  const link = (href, label, extra = "", match = href) =>
    `<a class="m-sub ${h === match || h.startsWith(match + "/") ? "on" : ""}" href="${href}"><span>${label}</span>${extra}</a>`;
  const count = (items) => (items.length ? `<span class="m-count">${solvedOf(items)}/${items.length}</span>` : `<span class="m-soon">SOON</span>`);
  const ico = {
    python: `<path d="m8 7-5 5 5 5m8-10 5 5-5 5"/>`,
    ai: `<path d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2 2m8 8 2 2M6 18l2-2m8-8 2-2"/>`,
    sd: `<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 0v20M3 7l9 5 9-5"/>`,
    ml: `<circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4M5 5l3 3m8 8 3 3M5 19l3-3m8-8 3-3"/>`,
    lld: `<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3"/>`,
    db: `<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>`,
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ico[k]}</svg>`;
  const group = (key, icon, label, subs) => {
    const open = menuOpenGroups.has(key);
    return `<div class="m-group ${open ? "open" : ""}"><button class="m-item" data-group="${key}" aria-expanded="${open}">${svg(icon)}<span>${label}</span>
      <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><div class="m-subs">${subs}</div></div>`;
  };
  const single = (href, icon, label, extra = "") =>
    `<a class="m-item ${h === href || h.startsWith(href + "/") ? "on" : ""}" href="${href}">${svg(icon)}<span>${label}</span>${extra}</a>`;
  const ml = trackById.ml.items, gpt = trackById.gpt.items;
  const lessons = EXTRA("SD_LESSONS");
  $("#menu-body").innerHTML =
    group("python", "python", "Python Course",
      link("#/", "Roadmap", "", "#/") + link("#/problems", "Problems", count(CH)) + link("#/cheatsheets", "Cheatsheets", EXTRA("CHEATSHEETS").length ? "" : `<span class="m-soon">SOON</span>`)
      + link("#/quizzes", "Quizzes", EXTRA("QUIZZES").length ? "" : `<span class="m-soon">SOON</span>`) + link("#/problem/playground", "Playground"))
    + `<div class="m-item disabled" title="Coming soon">${svg("ai")}<span>AI Coding</span><span class="m-beta">SOON</span></div>`
    + single("#/system-design", "sd", "System Design", lessons.length ? `<span class="m-count">${lessons.filter((l) => state.lessons[l.id]).length}/${lessons.length}</span>` : `<span class="m-soon">SOON</span>`)
    + group("ml", "ml", "Machine Learning", link("#/track/ml", "Problems", count(ml)) + link("#/track/gpt", "Build Your GPT", count(gpt)))
    + single("#/track/lld", "lld", "Low Level Design", count(trackById.lld.items))
    + single("#/track/sql", "db", "Databases", count(trackById.sql.items));
}
function openMenu() {
  renderMenu();
  $("#menu-drawer").hidden = false; $("#menu-backdrop").hidden = false;
  requestAnimationFrame(() => document.body.classList.add("menu-open"));
  $("#btn-nav-menu").setAttribute("aria-expanded", "true");
}
function closeMenu() {
  if ($("#menu-drawer").hidden) return;
  document.body.classList.remove("menu-open");
  $("#menu-drawer").hidden = true; $("#menu-backdrop").hidden = true;
  $("#btn-nav-menu").setAttribute("aria-expanded", "false");
}
$("#btn-nav-menu").onclick = () => ($("#menu-drawer").hidden ? openMenu() : closeMenu());
$("#menu-close").onclick = closeMenu;
$("#menu-backdrop").onclick = closeMenu;
$("#menu-body").addEventListener("click", (e) => {
  const g = e.target.closest("[data-group]");
  if (g) { menuOpenGroups.has(g.dataset.group) ? menuOpenGroups.delete(g.dataset.group) : menuOpenGroups.add(g.dataset.group); renderMenu(); return; }
  if (e.target.closest("a")) closeMenu();
});

// ═════════════════════════ pages ═════════════════════════
const page = (html) => { $("#page-body").innerHTML = html; };
const notFound = (what, back, backLabel) => page(`<div class="empty-list">That ${what} doesn't exist. <a href="${back}">${backLabel}</a></div>`);

function renderTrack(id) {
  const t = trackById[id];
  if (!t) return notFound("track", "#/", "Back to the roadmap");
  document.title = `${t.label} · PyMarker`;
  const done = t.items.filter((c) => prog(c.id).solved).length;
  let html = `<div class="pg-head"><div class="pg-icon">${t.icon}</div><div><h1>${esc(t.label)}</h1><p class="muted">${esc(t.blurb)}</p></div></div>
    <div class="pg-progress"><span class="td-bar"><i style="width:${t.items.length ? (done / t.items.length) * 100 : 0}%"></i></span><span>${done} / ${t.items.length} solved</span></div>`;
  if (!t.items.length) html += `<div class="empty-list">Problems for this track are on their way.</div>`;
  for (const [lvl, meta] of Object.entries(LEVELS)) {
    const items = t.items.filter((c) => c.level === lvl);
    if (!items.length) continue;
    html += `<section class="pl-group"><header><span class="pl-topic">${meta.label}</span><span class="pl-count">${items.filter((c) => prog(c.id).solved).length}/${items.length}</span></header>
      <table class="ptable">${tableHead}<tbody>${problemRows(items)}</tbody></table></section>`;
  }
  page(html);
}

function renderCheatsheets(id) {
  const sheets = EXTRA("CHEATSHEETS");
  document.title = "Cheatsheets · PyMarker";
  if (!sheets.length) return page(`<div class="empty-list">Cheatsheets are on their way.</div>`);
  const cur = sheets.find((x) => x.id === id) || sheets[0];
  const practice = topicById[cur.topic] ? `<button class="btn" data-topic-go="${cur.topic}">Practise ${esc(topicById[cur.topic].label)} →</button>`
    : trackById[cur.topic] ? `<a class="btn" href="#/track/${cur.topic}">Practise ${esc(trackById[cur.topic].label)} →</a>` : "";
  page(`<div class="pg-head"><div class="pg-icon">📄</div><div><h1>Cheatsheets</h1><p class="muted">Quick reference for each topic. Keep one open while you solve problems.</p></div></div>
    <div class="cs-layout">
      <nav class="cs-list">${sheets.map((x) => `<a href="#/cheatsheets/${x.id}" class="${x === cur ? "on" : ""}">${x.icon} ${esc(x.title)}</a>`).join("")}</nav>
      <article class="cs-body"><div class="cs-title"><h2>${cur.icon} ${esc(cur.title)}</h2>${practice}</div>
        ${cur.sections.map((sec) => `<section class="cs-sec"><h3>${esc(sec.heading)}</h3><div class="task">${sec.html}</div></section>`).join("")}</article>
    </div>`);
}

const QUIZ_TRACKS = { python: "Python", sql: "Databases (SQL)", ml: "Machine Learning", "system-design": "System Design" };
function renderQuizzes() {
  const qs = EXTRA("QUIZZES");
  document.title = "Quizzes · PyMarker";
  if (!qs.length) return page(`<div class="empty-list">Quizzes are on their way.</div>`);
  let html = `<div class="pg-head"><div class="pg-icon">🧠</div><div><h1>Quizzes</h1><p class="muted">Quick multiple-choice checks. Your best score for each quiz is saved.</p></div></div>`;
  for (const [tk, label] of Object.entries(QUIZ_TRACKS)) {
    const list = qs.filter((q) => q.track === tk);
    if (!list.length) continue;
    html += `<div class="section-label">${label}</div><div class="quiz-grid">${list.map((q) => {
      const r = state.quizzes[q.id], n = q.questions.length;
      return `<a class="quiz-card" href="#/quiz/${q.id}"><span class="qc-icon">${q.icon}</span><span class="qc-title">${esc(q.title)}</span>
        <span class="qc-meta">${n} questions</span>${r ? `<span class="qc-best ${r.best === n ? "full" : ""}">Best ${r.best}/${n}</span>` : `<span class="qc-best new">Not taken</span>`}</a>`;
    }).join("")}</div>`;
  }
  page(html);
}

let quizRun = null; // { id, i, picks: [] }
function renderQuiz(id) {
  const quiz = EXTRA("QUIZZES").find((q) => q.id === id);
  if (!quiz) return notFound("quiz", "#/quizzes", "All quizzes");
  document.title = `${quiz.title} quiz · PyMarker`;
  if (!quizRun || quizRun.id !== id) quizRun = { id, i: 0, picks: [] };
  const n = quiz.questions.length, { i, picks } = quizRun;
  if (i >= n) {
    const score = picks.filter((p, k) => p === quiz.questions[k].answer).length;
    const prev = state.quizzes[id];
    if (!quizRun.saved) {
      state.quizzes[id] = { best: Math.max(score, prev?.best || 0), last: score, total: n, at: Date.now() };
      quizRun.saved = true; save();
      if (score === n) confetti();
    }
    const pct = Math.round((score / n) * 100);
    return page(`<div class="quiz-wrap"><div class="quiz-done">
      <div class="qd-score ${pct >= 80 ? "good" : pct >= 50 ? "ok" : "low"}">${score}<span>/${n}</span></div>
      <h2>${pct === 100 ? "Perfect score! 🏆" : pct >= 80 ? "Great work!" : pct >= 50 ? "Good effort — review the ones you missed." : "Keep going — the cheatsheet will help."}</h2>
      <p class="muted">Best: ${state.quizzes[id].best}/${n}</p>
      <div class="qd-actions"><button class="btn primary" data-quiz-retry>Try again</button><a class="btn" href="#/quizzes">All quizzes</a></div></div>
      <div class="section-label">Review</div>
      ${quiz.questions.map((q, k) => `<div class="q-review ${picks[k] === q.answer ? "right" : "wrong"}"><div class="qr-mark">${picks[k] === q.answer ? "✓" : "✗"}</div>
        <div><div class="task">${q.q}</div><p class="small">${picks[k] === q.answer ? "" : `You chose: <b>${esc(q.options[picks[k]])}</b> · `}Answer: <b>${esc(q.options[q.answer])}</b></p><div class="explain">${q.explain}</div></div></div>`).join("")}</div>`);
  }
  const q = quiz.questions[i], picked = picks[i];
  const answered = picked !== undefined;
  page(`<div class="quiz-wrap">
    <div class="quiz-top"><a href="#/quizzes" class="muted small">← All quizzes</a><span class="muted small">${quiz.icon} ${esc(quiz.title)}</span><span class="muted small">Question ${i + 1} of ${n}</span></div>
    <div class="quiz-bar"><i style="width:${(i / n) * 100}%"></i></div>
    <div class="quiz-q task">${q.q}</div>
    <div class="quiz-opts">${q.options.map((o, k) => {
      const cls = !answered ? "" : k === q.answer ? "right" : k === picked ? "wrong" : "dim";
      return `<button class="quiz-opt ${cls}" data-pick="${k}" ${answered ? "disabled" : ""}><span class="qo-key">${"ABCD"[k]}</span><span>${esc(o)}</span></button>`;
    }).join("")}</div>
    ${answered ? `<div class="quiz-feedback ${picked === q.answer ? "right" : "wrong"}"><b>${picked === q.answer ? "✓ Correct!" : "✗ Not quite."}</b><div>${q.explain}</div></div>
      <div class="quiz-next"><button class="btn primary" data-quiz-next>${i + 1 < n ? "Next question →" : "See my score →"}</button></div>` : ""}
  </div>`);
}

function renderLessons() {
  const ls = EXTRA("SD_LESSONS");
  document.title = "System Design · PyMarker";
  if (!ls.length) return page(`<div class="empty-list">System Design lessons are on their way.</div>`);
  const done = ls.filter((l) => state.lessons[l.id]).length;
  page(`<div class="pg-head"><div class="pg-icon">🏛️</div><div><h1>System Design</h1><p class="muted">How real apps are built to serve millions of people. Read each lesson, then take its quiz.</p></div></div>
    <div class="pg-progress"><span class="td-bar"><i style="width:${(done / ls.length) * 100}%"></i></span><span>${done} / ${ls.length} lessons done</span></div>
    <div class="lesson-list">${ls.map((l, k) => {
      const qz = state.quizzes[l.quiz], qd = EXTRA("QUIZZES").find((q) => q.id === l.quiz);
      return `<a class="lesson-card ${state.lessons[l.id] ? "done" : ""}" href="#/lesson/${l.id}"><span class="lc-num">${state.lessons[l.id] ? "✓" : k + 1}</span>
        <span class="lc-main"><b>${l.icon} ${esc(l.title)}</b><span class="muted small">${LEVELS[l.level]?.label || ""} · ${l.minutes || 5} min read${qz && qd ? ` · quiz ${qz.best}/${qd.questions.length}` : ""}</span></span><span class="muted">›</span></a>`;
    }).join("")}</div>`);
}
function renderLesson(id) {
  const ls = EXTRA("SD_LESSONS"), k = ls.findIndex((l) => l.id === id), l = ls[k];
  if (!l) return notFound("lesson", "#/system-design", "All lessons");
  document.title = `${l.title} · PyMarker`;
  const prev = ls[k - 1], next = ls[k + 1], hasQuiz = EXTRA("QUIZZES").some((q) => q.id === l.quiz);
  page(`<article class="lesson">
    <a href="#/system-design" class="muted small">← System Design</a>
    <h1>${l.icon} ${esc(l.title)}</h1><p class="muted small">${LEVELS[l.level]?.label || ""} · ${l.minutes || 5} min read · Lesson ${k + 1} of ${ls.length}</p>
    <div class="task lesson-body">${l.html}</div>
    <div class="lesson-actions">
      <button class="btn ${state.lessons[l.id] ? "" : "primary"}" data-lesson-done="${l.id}">${state.lessons[l.id] ? "✓ Marked as done" : "Mark as done"}</button>
      ${hasQuiz ? `<a class="btn" href="#/quiz/${l.quiz}">Take the quiz →</a>` : ""}
    </div>
    <div class="lesson-nav">${prev ? `<a href="#/lesson/${prev.id}">← ${esc(prev.title)}</a>` : "<span></span>"}${next ? `<a href="#/lesson/${next.id}">${esc(next.title)} →</a>` : ""}</div>
  </article>`);
}

$("#page-body").addEventListener("click", (e) => {
  const row = e.target.closest("[data-open]");
  if (row) { e.preventDefault(); return openProblem(row.dataset.open); }
  const pk = e.target.closest("[data-pick]");
  if (pk && quizRun && quizRun.picks[quizRun.i] === undefined) { quizRun.picks[quizRun.i] = +pk.dataset.pick; return renderQuiz(quizRun.id); }
  if (e.target.closest("[data-quiz-next]")) { quizRun.i++; renderQuiz(quizRun.id); return $("#view-page").scrollTo(0, 0); }
  if (e.target.closest("[data-quiz-retry]")) { const id = quizRun.id; quizRun = null; return renderQuiz(id); }
  const ld = e.target.closest("[data-lesson-done]");
  if (ld) { state.lessons[ld.dataset.lessonDone] = !state.lessons[ld.dataset.lessonDone]; save(); renderLesson(ld.dataset.lessonDone); renderMenu(); return; }
  const tg = e.target.closest("[data-topic-go]");
  if (tg) { pendingTopic = tg.dataset.topicGo; location.hash = "#/"; }
});
$("#page-body").addEventListener("keydown", (e) => {
  const row = e.target.closest("[data-open]");
  if (row && e.key === "Enter") openProblem(row.dataset.open);
});

// ═════════════════════════ learners ═════════════════════════
// Several people can share one browser; each learner's progress lives under its own key.
function learnerStats(id) {
  let s = {};
  try { s = id === profiles.active ? state : JSON.parse(store.get(keyFor(id))) || {}; } catch {}
  const pr = s.progress || {};
  const points = CH.reduce((n, c) => n + (pr[c.id]?.points || 0), 0);
  return { solved: CH.filter((c) => pr[c.id]?.solved).length, grade: gradeFor(Math.round((points / MAX_POINTS) * 100)) };
}
const initial = (name) => (name.trim()[0] || "?").toUpperCase();
function renderLearnerButton() {
  const l = learner();
  $("#learner-initial").textContent = l.name ? initial(l.name) : "👤";
  $("#learner-name").textContent = l.name || "Add your name";
  $("#btn-learner").title = l.name ? `Learning as ${l.name}. Click to switch learner` : "Add your name, or add another learner";
}
function openLearners() {
  const rows = profiles.list.map((l) => {
    const st = learnerStats(l.id), on = l.id === profiles.active;
    return `<div class="learner-row ${on ? "on" : ""}">
      <span class="avatar">${l.name ? esc(initial(l.name)) : "👤"}</span>
      <div class="who"><b>${l.name ? esc(l.name) : "Unnamed learner"}</b><span>${st.solved}/${CH.length} solved · grade ${st.grade}</span></div>
      ${on ? `<span class="you">Current</span><button class="btn ghost" data-rename="${l.id}">Rename</button>`
           : `<button class="btn" data-switch="${l.id}">Switch</button><button class="btn ghost icon" data-remove="${l.id}" title="Remove this learner">✕</button>`}
    </div>`;
  }).join("");
  $("#modal-body").innerHTML = `
    <h2 id="modal-title" style="margin:0 0 4px">Who's learning?</h2>
    <p class="muted" style="margin:0 0 18px">Each learner has their own progress, marks and code. On a shared computer, add a learner for each person.
      Progress is saved in this browser, so a different computer starts fresh (use Export / Import in the progress report to move it).</p>
    <div class="learner-list">${rows}</div>
    <form class="learner-add" id="learner-add">
      <input id="learner-new" maxlength="30" placeholder="New learner's name" autocomplete="off" required />
      <button class="btn primary" type="submit">Add learner</button>
    </form>`;
  $("#modal").hidden = false;
  if (!learner().name && profiles.list.length === 1) setTimeout(() => $("[data-rename]")?.click(), 0);
}
function switchLearner(id) {
  save(); profiles.active = id; saveProfiles(); location.reload();
}
$("#btn-learner").addEventListener("click", openLearners);
$("#modal").addEventListener("click", (e) => {
  const sw = e.target.closest("[data-switch]");
  if (sw) return switchLearner(sw.dataset.switch);
  const rn = e.target.closest("[data-rename]");
  if (rn) {
    const row = rn.closest(".learner-row"), l = learner();
    row.querySelector(".who").innerHTML = `<form class="rename-form"><input maxlength="30" value="${esc(l.name)}" placeholder="Your name" aria-label="Your name" /></form>`;
    rn.remove();
    const input = row.querySelector("input"); input.focus(); input.select();
    const done = () => { l.name = input.value.trim(); saveProfiles(); renderLearnerButton(); openLearners(); };
    row.querySelector("form").addEventListener("submit", (ev) => { ev.preventDefault(); done(); });
    input.addEventListener("blur", done, { once: true });
    return;
  }
  const rm = e.target.closest("[data-remove]");
  if (rm) {
    const l = profiles.list.find((x) => x.id === rm.dataset.remove);
    if (confirm(`Remove ${l.name || "this learner"} and delete all their progress on this computer? This can't be undone.`)) {
      store.del(keyFor(l.id)); profiles.list = profiles.list.filter((x) => x.id !== l.id); saveProfiles(); openLearners();
    }
  }
});
$("#modal").addEventListener("submit", (e) => {
  if (e.target.id !== "learner-add") return;
  e.preventDefault();
  const name = $("#learner-new").value.trim(); if (!name) return;
  const id = "l" + Date.now().toString(36);
  profiles.list.push({ id, name });
  if (!learner().name && profiles.list.length === 2) { /* keep the unnamed first learner as-is */ }
  switchLearner(id);
});

$("#btn-run kbd").textContent = `${MOD}↵`;
$("#btn-submit kbd").textContent = `${MOD}⇧↵`;
$("#btn-prev").title = `Previous (${ALT} ←)`;
$("#btn-next").title = `Next (${ALT} →)`;
renderLearnerButton();
applyFont();
applyTheme(theme);
{
  const deep = location.hash.match(/^#\/problem\/([\w-]+)/);
  if (deep && byId[deep[1]]) state.current = deep[1];
}
selectChallenge(current().id);
route();
vscode.init();
