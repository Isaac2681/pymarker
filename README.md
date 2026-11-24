# PyMarker

Python challenges from beginner to advanced, marked automatically in the browser.

Laid out like a coding-practice site:
- **Roadmap** (`#/`): a graph of 8 topics (Basics → if/elif/else → Loops → Strings / Lists & Dicts → Recursion →
  Algorithms / Classes), each with a progress bar. Click a topic for its problems. Beside it: a solved-by-level ring,
  your grade, a *Continue* button, and a streak calendar.
- **Problems** (`#/problems`): every problem in a table grouped by topic, filterable by topic, level, status and search.
- **Problem** (`#/problem/<id>`): Question / Hints / Solution / Submissions tabs, the editor, and a console with
  *Testcases* (Case 1, Case 2…) and *Result*, plus Run and Submit. Light/dark theme toggle in the top bar.

**Menu** (☰, top left) opens everything else:
- **Python Course:** Roadmap, Problems, Cheatsheets (10), Quizzes (18 quizzes, 124 questions), Playground
- **System Design:** 8 lessons, each with a quiz
- **Machine Learning:** 10 ML fundamentals problems, plus *Build Your GPT* (6 steps, from a tokenizer to attention)
- **Low Level Design:** 8 object-oriented design problems (Parking Lot, Vending Machine, Observer, Strategy…)
- **Databases:** 16 SQL problems on SQLite in the browser, marked by comparing your result set with the model
  answer on the example data *and* a hidden dataset
- AI Coding: coming soon

Content lives in `content/` (`learn.js`, `sql.js`, `ml.js`, `lld.js`). Check the problem sets with `tools/verify.py`
in the same way as `challenges.js`.

Topics live in `TOPICS` in `app.js`. A new challenge must be added to one topic's `ids`, or the console warns.

- **53 challenges** — 22 Beginner (10 marks), 18 Intermediate (20), 13 Advanced (35), including a
  23-challenge **if / elif / else** pack (sidebar filter: *if/else*)
- **Submit** runs every test (including hidden ones) and tells you Correct / Incorrect, with expected vs. got
- **Help when stuck** — 3 progressive hints per challenge (each costs 20% of that challenge's marks),
  plain-English explanations of Python errors, error line highlighted, and a model solution that unlocks
  after 2 failed submits or all hints (viewing it before solving scores 0)
- **Grade** — overall % of marks → A* / A / B / C / D / E / U. Progress saves in your browser.
- Python runs locally via Pyodide in a Web Worker; infinite loops are killed after 8 s.

- **Edit in VS Code** — creates `Python Lessons/{Beginner,Intermediate,Advanced}/NN_title.py` (plus
  `playground.py`), each starting with the task as a comment header, and opens the folder in VS Code.
  Edits sync both ways; the header is stripped before marking. Press Submit in the app to get marked.
- Playground, search + filters, progress dashboard (export/import/reset), day streak, font size, ⌘/ comments.

## Learners and devices

- **Different computers or phones:** each browser keeps its own progress, so two people on two devices are automatically separate.
- **Sharing one computer:** click the person button in the top bar (*Who's learning?*) and add a learner for each person.
  Each learner gets their own progress, marks and code, and switching is one click.
- Shortcut hints show ⌘/⌥ on Macs and Ctrl/Alt on Windows/Linux. The shortcuts themselves accept either.
- The VS Code sync is for the first learner on the Mac running `serve.py`, so other learners never overwrite those lesson files.

## Sync progress across devices

Sign in with an email code (person button → *Who's learning?* → *Sync across devices*) and that learner's progress
follows you to every phone and computer. It uses [Supabase](https://supabase.com) (free tier):
one `progress` row per person, protected by row-level security. Each sync reads, merges and writes, and the merge
never loses work: solved stays solved, best scores win, the newest code wins, and histories combine.

Setup: create a Supabase project, run `supabase-setup.sql`, and put the project URL and *anon public* key in
`sync-config.js`. Both values are meant to be public. Never put the `service_role` key in this repo.

## Use it on a phone

Live at **https://isaac2681.github.io/pymarker/**. Open it on each phone, then use Share → *Add to Home Screen* (iPhone)
or ⋮ → *Add to Home screen* / *Install app* (Android).

- Each phone keeps its **own** progress, saved on that phone. Two people on two phones never see each other's marks.
- Adding it to the home screen stops iPhone Safari clearing saved progress after a week without a visit.
- To move progress to another device, use the progress report (tap the grade) → *Export* / *Import*.
- On touch screens there's a row of coding keys above the editor (Tab, `:`, brackets, quotes, `==`, undo…),
  and the challenge list opens from the ☰ button.

## Run locally

```bash
python3 serve.py
```
then open http://localhost:8765 (needs internet the first time to load Pyodide + CodeMirror from CDN).
Plain `python3 -m http.server 8765` also works, just without the VS Code button.

## Adding challenges

After changing `app.js`, `challenges.js` or `style.css`, bump the `?v=` number on their links in `index.html`. GitHub Pages caches files for 10 minutes, and the version tag makes every visitor load matching files.

Add an entry to `challenges.js` (`stdout`, `function` or `script` type — see the header comment), then check it:

```bash
node -e "require('./challenges.js');console.log(JSON.stringify(CHALLENGES))" | python3 tools/verify.py
```
