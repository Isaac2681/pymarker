// Runs Python (Pyodide) off the main thread so the page can kill runaway code.
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

const ready = (async () => {
  const py = await loadPyodide();
  const src = await (await fetch("harness.py")).text();
  py.runPython(src);
  return { py, grade: py.globals.get("grade"), run: py.globals.get("run") };
})();

ready.then(
  () => postMessage({ type: "ready" }),
  (err) => postMessage({ type: "fatal", message: String(err) })
);

onmessage = async (e) => {
  const { id, action, code, spec, stdin } = e.data;
  try {
    const h = await ready;
    const out = action === "grade" ? h.grade(code, JSON.stringify(spec)) : h.run(code, stdin || "");
    postMessage({ type: "result", id, data: JSON.parse(out) });
  } catch (err) {
    postMessage({ type: "result", id, data: { internal_error: String(err) } });
  }
};
