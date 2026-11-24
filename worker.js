// Runs Python (Pyodide) off the main thread so the page can kill runaway code.
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

const ready = (async () => {
  const py = await loadPyodide();
  const src = await (await fetch("harness.py")).text();
  py.runPython(src);
  const g = (name) => py.globals.get(name);
  return { py, grade: g("grade"), run: g("run"), gradeSql: g("grade_sql"), runSql: g("run_sql"), sqlPreview: g("sql_preview") };
})();

// SQLite is a separate Pyodide package: only download it the first time a SQL problem runs.
let sqlite = null;
const needSqlite = (py) => (sqlite ||= py.loadPackage("sqlite3").catch((e) => { sqlite = null; throw e; }));

ready.then(
  () => postMessage({ type: "ready" }),
  (err) => postMessage({ type: "fatal", message: String(err) })
);

onmessage = async (e) => {
  const { id, action, code, spec, stdin, setup } = e.data;
  try {
    const h = await ready;
    let out;
    if (action === "grade") out = h.grade(code, JSON.stringify(spec));
    else if (action === "grade_sql") { await needSqlite(h.py); out = h.gradeSql(code, JSON.stringify(spec)); }
    else if (action === "run_sql") { await needSqlite(h.py); out = h.runSql(code, setup); }
    else if (action === "sql_preview") { await needSqlite(h.py); out = h.sqlPreview(setup, code); }
    else out = h.run(code, stdin || "");
    postMessage({ type: "result", id, data: JSON.parse(out) });
  } catch (err) {
    postMessage({ type: "result", id, data: { internal_error: String(err) } });
  }
};
