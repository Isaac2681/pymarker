// PyMarker learning content: cheat sheets, quizzes and System Design lessons.
// Loaded as a plain script; defines three globals. HTML strings use only simple tags.
// Code inside <pre><code> is escaped (&lt; &gt; &amp;) and is runnable Python 3 unless it
// starts with "# snippet" or is SQL.

globalThis.CHEATSHEETS = [
  // ───────────────────────────── PYTHON BASICS ─────────────────────────────
  {
    id: "cs_basics", title: "Python Basics", icon: "🐍", topic: "basics",
    sections: [
      { heading: "Printing", html: `<p><code>print()</code> shows values on the screen. Give it several values separated by commas and it puts a space between them.</p>
<pre><code>print("Hello, World!")
print("Score:", 10)
print("a", "b", "c", sep="-")   # a-b-c
print("no newline", end="")
print()                          # just a blank line</code></pre>
<p><strong>Common mistake:</strong> forgetting the quotes. <code>print(Hello)</code> looks for a <em>variable</em> called <code>Hello</code> and raises a <code>NameError</code>.</p>` },
      { heading: "Variables", html: `<p>A variable is a name that points at a value. You create one with <code>=</code>. Names use lowercase and underscores (<code>total_score</code>), and can't start with a digit.</p>
<pre><code>name = "Isaac"
age = 30
age = age + 1        # reassign using the old value
age += 1             # the same thing, shorter
print(name, age)     # Isaac 32</code></pre>
<p><strong>Common mistake:</strong> <code>=</code> assigns, <code>==</code> compares. <code>if age = 30:</code> is a syntax error.</p>` },
      { heading: "Types", html: `<p>Every value has a type. The everyday ones are:</p>
<table><tr><th>Type</th><th>Example</th><th>Meaning</th></tr>
<tr><td><code>int</code></td><td><code>42</code></td><td>whole number</td></tr>
<tr><td><code>float</code></td><td><code>3.14</code></td><td>decimal number</td></tr>
<tr><td><code>str</code></td><td><code>"hi"</code></td><td>text</td></tr>
<tr><td><code>bool</code></td><td><code>True</code></td><td>True or False</td></tr>
<tr><td><code>NoneType</code></td><td><code>None</code></td><td>"no value"</td></tr></table>
<pre><code>print(type(42))       # &lt;class 'int'&gt;
print(type("42"))     # &lt;class 'str'&gt;
print(int("42") + 1)  # 43
print(str(7) + "up")  # 7up</code></pre>
<p><strong>Common mistake:</strong> <code>"5" + 5</code> is a <code>TypeError</code>. Convert one side first.</p>` },
      { heading: "Arithmetic", html: `<p>Python follows the usual order of operations (brackets first, then <code>**</code>, then <code>* / // %</code>, then <code>+ -</code>).</p>
<pre><code>print(7 + 2)    # 9
print(7 / 2)    # 3.5  (always a float)
print(7 // 2)   # 3    (floor division)
print(7 % 2)    # 1    (remainder)
print(2 ** 3)   # 8    (power)
print(round(3.14159, 2))  # 3.14</code></pre>
<p><strong>Tip:</strong> <code>n % 2 == 0</code> is the classic test for "is n even?".</p>` },
      { heading: "Reading input", html: `<p><code>input()</code> waits for the user to type a line and always returns a <strong>string</strong>. Convert it if you need a number.</p>
<pre><code># snippet: needs someone typing
name = input("Your name: ")
age = int(input("Your age: "))
print("Next year you'll be", age + 1)</code></pre>
<p><strong>Common mistake:</strong> <code>input() + 1</code> fails, because the input is text. Wrap it in <code>int()</code> or <code>float()</code>.</p>` },
      { heading: "f-strings", html: `<p>Put an <code>f</code> before the quotes and you can drop values straight into text with <code>{ }</code>.</p>
<pre><code>name = "Isaac"
price = 4.5
print(f"Hi {name}!")              # Hi Isaac!
print(f"Total: £{price * 2:.2f}") # Total: £9.00
print(f"{7:03d}")                 # 007</code></pre>
<p><strong>Common mistake:</strong> forgetting the <code>f</code>. Without it you'll literally print <code>{name}</code>.</p>` },
      { heading: "Comments", html: `<p>Anything after <code>#</code> on a line is ignored by Python. Use comments to explain <em>why</em>, not what.</p>
<pre><code># Convert Celsius to Fahrenheit
c = 20
f = c * 9 / 5 + 32   # the standard formula
print(f)             # 68.0</code></pre>` },
    ],
  },

  // ───────────────────────────── CONDITIONALS ─────────────────────────────
  {
    id: "cs_conditionals", title: "if / elif / else", icon: "🔀", topic: "conditionals",
    sections: [
      { heading: "Comparisons", html: `<p>A comparison gives back <code>True</code> or <code>False</code>.</p>
<table><tr><th>Operator</th><th>Means</th><th>Example (gives True)</th></tr>
<tr><td><code>==</code></td><td>equal to</td><td><code>3 == 3</code></td></tr>
<tr><td><code>!=</code></td><td>not equal to</td><td><code>3 != 4</code></td></tr>
<tr><td><code>&lt;</code> / <code>&gt;</code></td><td>less / greater than</td><td><code>2 &lt; 5</code></td></tr>
<tr><td><code>&lt;=</code> / <code>&gt;=</code></td><td>... or equal to</td><td><code>5 &lt;= 5</code></td></tr></table>
<pre><code>age = 18
print(age &gt; 18)    # False  (18 is not MORE than 18)
print(age &gt;= 18)   # True
print(13 &lt;= age &lt;= 19)  # True: Python lets you chain comparisons</code></pre>
<p><strong>Common mistake:</strong> boundaries. "18 or over" is <code>&gt;= 18</code>, not <code>&gt; 18</code>. Always test the exact boundary value.</p>` },
      { heading: "if, else", html: `<p>The indented block under <code>if</code> runs only when the condition is True. <code>else</code> catches everything else. Don't forget the colon.</p>
<pre><code>temperature = 25
if temperature &gt; 20:
    print("T-shirt weather")
else:
    print("Bring a jumper")</code></pre>
<p><strong>Common mistake:</strong> mixing indentation. Use 4 spaces for every level, and make sure everything in the block lines up.</p>` },
      { heading: "elif chains", html: `<p><code>elif</code> ("else if") checks another condition. Python tests from the top and runs <strong>only the first</strong> branch that's True, then skips the rest.</p>
<pre><code>score = 72
if score &gt;= 90:
    grade = "A"
elif score &gt;= 70:
    grade = "B"
elif score &gt;= 50:
    grade = "C"
else:
    grade = "F"
print(grade)   # B</code></pre>
<p><strong>Common mistake:</strong> wrong order. If you check <code>score &gt;= 50</code> first, a 95 gets a C, because that branch is True and wins. Put the strictest test first.</p>
<p><strong>Also:</strong> a run of separate <code>if</code>s is not the same as an <code>elif</code> chain: every <code>if</code> is checked, so several can run.</p>` },
      { heading: "and, or, not", html: `<p>Combine conditions with <code>and</code> (both must be True), <code>or</code> (at least one True) and <code>not</code> (flips it).</p>
<pre><code>age = 16
has_ticket = True
if age &gt;= 12 and has_ticket:
    print("Come in")
day = "Sat"
if day == "Sat" or day == "Sun":
    print("Weekend")
if not has_ticket:
    print("Buy a ticket first")</code></pre>
<p><strong>Common mistake:</strong> <code>if day == "Sat" or "Sun":</code> is always True, because <code>"Sun"</code> on its own is truthy. Write the comparison out twice, or use <code>day in ("Sat", "Sun")</code>.</p>` },
      { heading: "Truthiness", html: `<p><code>if</code> works on any value, not just True/False. These count as <strong>False</strong>: <code>0</code>, <code>0.0</code>, <code>""</code>, <code>[]</code>, <code>{}</code>, <code>None</code>, <code>False</code>. Almost everything else is True.</p>
<pre><code>name = ""
if name:
    print("Hello", name)
else:
    print("You didn't type a name")

items = [3, 1]
if items:
    print("Basket has", len(items), "items")</code></pre>
<p><strong>Watch out:</strong> <code>"0"</code> and <code>"False"</code> are non-empty strings, so they're truthy.</p>` },
      { heading: "Nested ifs and guard clauses", html: `<p>You can put an <code>if</code> inside another. When nesting gets deep, a <strong>guard clause</strong> (deal with the bad case first and leave early) keeps it flat.</p>
<pre><code>def can_drive(age, has_licence):
    if age &lt; 17:
        return "Too young"
    if not has_licence:
        return "Get a licence first"
    return "Off you go"

print(can_drive(16, True))   # Too young
print(can_drive(20, False))  # Get a licence first
print(can_drive(20, True))   # Off you go</code></pre>` },
      { heading: "Conditional expression (ternary)", html: `<p>A one-line if/else that gives back a value: <code>A if condition else B</code>.</p>
<pre><code>n = 7
kind = "even" if n % 2 == 0 else "odd"
print(kind)   # odd</code></pre>
<p><strong>Tip:</strong> great for simple choices; use a normal <code>if</code> block once it needs more than two outcomes.</p>` },
      { heading: "match / case (Python 3.10+)", html: `<p><code>match</code> compares one value against several patterns. <code>case _</code> is the catch-all, like <code>else</code>. Use <code>|</code> for "or".</p>
<pre><code>command = "stop"
match command:
    case "go":
        print("Moving")
    case "stop" | "halt":
        print("Stopping")
    case _:
        print("Unknown command")</code></pre>
<p><strong>Note:</strong> unlike some languages, Python doesn't "fall through" to the next case, so there's no <code>break</code> needed.</p>` },
    ],
  },

  // ───────────────────────────── LOOPS ─────────────────────────────
  {
    id: "cs_loops", title: "Loops", icon: "🔁", topic: "loops",
    sections: [
      { heading: "for loops", html: `<p>A <code>for</code> loop runs once for each item in a sequence (a list, a string, a range...).</p>
<pre><code>for fruit in ["apple", "pear", "fig"]:
    print(fruit)

for letter in "hey":
    print(letter.upper())</code></pre>` },
      { heading: "range()", html: `<p><code>range(stop)</code>, <code>range(start, stop)</code> and <code>range(start, stop, step)</code>. The <strong>stop value is never included</strong>.</p>
<pre><code>print(list(range(5)))         # [0, 1, 2, 3, 4]
print(list(range(1, 6)))      # [1, 2, 3, 4, 5]
print(list(range(10, 0, -3))) # [10, 7, 4, 1]</code></pre>
<p><strong>Common mistake:</strong> off-by-one. To count 1 to 10 you need <code>range(1, 11)</code>.</p>` },
      { heading: "Running totals", html: `<p>Start a variable <em>before</em> the loop, update it <em>inside</em>, use it <em>after</em>.</p>
<pre><code>numbers = [4, 8, 15, 16]
total = 0
for n in numbers:
    total += n
print(total)            # 43
print(total / len(numbers))  # 10.75</code></pre>
<p><strong>Common mistake:</strong> putting <code>total = 0</code> inside the loop, which resets it every time.</p>` },
      { heading: "while loops", html: `<p><code>while</code> repeats as long as its condition is True. Something inside must eventually make it False.</p>
<pre><code>count = 3
while count &gt; 0:
    print(count)
    count -= 1
print("Lift off!")</code></pre>
<p><strong>Common mistake:</strong> forgetting to change <code>count</code>, giving an infinite loop.</p>` },
      { heading: "break and continue", html: `<p><code>break</code> leaves the loop straight away. <code>continue</code> skips to the next round.</p>
<pre><code>for n in range(1, 10):
    if n % 2 == 0:
        continue      # skip even numbers
    if n &gt; 7:
        break         # stop completely
    print(n)          # 1 3 5 7</code></pre>` },
      { heading: "enumerate() and zip()", html: `<p><code>enumerate</code> gives you the position as well as the item. <code>zip</code> walks two lists side by side.</p>
<pre><code>names = ["Ann", "Bo", "Cy"]
scores = [90, 75, 60]
for i, name in enumerate(names, start=1):
    print(i, name)
for name, score in zip(names, scores):
    print(f"{name}: {score}")</code></pre>` },
      { heading: "Nested loops", html: `<p>A loop inside a loop: the inner one runs completely for each round of the outer one.</p>
<pre><code>for row in range(1, 4):
    line = ""
    for col in range(1, 4):
        line += str(row * col) + " "
    print(line)</code></pre>` },
    ],
  },

  // ───────────────────────────── STRINGS ─────────────────────────────
  {
    id: "cs_strings", title: "Strings", icon: "🔤", topic: "strings",
    sections: [
      { heading: "Indexing and slicing", html: `<p>Positions start at <strong>0</strong>. Negative indexes count from the end. A slice <code>s[start:stop:step]</code> excludes <code>stop</code>.</p>
<pre><code>s = "python"
print(s[0])     # p
print(s[-1])    # n
print(s[1:4])   # yth
print(s[:2])    # py
print(s[::-1])  # nohtyp  (reversed)
print(len(s))   # 6</code></pre>
<p><strong>Common mistake:</strong> <code>s[len(s)]</code> is an <code>IndexError</code>; the last index is <code>len(s) - 1</code>.</p>` },
      { heading: "Strings can't be changed", html: `<p>Strings are <em>immutable</em>. Methods give you a <strong>new</strong> string; they don't alter the old one.</p>
<pre><code>word = "hello"
word.upper()          # result thrown away!
print(word)           # hello
word = word.upper()   # keep the result
print(word)           # HELLO</code></pre>
<p><strong>Common mistake:</strong> <code>word[0] = "J"</code> raises a <code>TypeError</code>. Build a new string: <code>"J" + word[1:]</code>.</p>` },
      { heading: "Handy methods", html: `<pre><code>s = "  Hello World  "
print(s.strip())               # Hello World
print(s.lower(), s.upper())
print("a,b,c".split(","))      # ['a', 'b', 'c']
print("-".join(["a", "b"]))    # a-b
print("banana".count("a"))     # 3
print("banana".replace("a", "o"))  # bonono
print("banana".find("n"))      # 2  (-1 if missing)
print("hi".startswith("h"))    # True</code></pre>` },
      { heading: "Checking characters", html: `<pre><code>print("abc".isalpha())   # True
print("123".isdigit())   # True
print("a1".isalnum())    # True
print(" ".isspace())     # True
print("ell" in "hello")  # True</code></pre>
<p><strong>Tip:</strong> <code>in</code> is the quickest way to ask "does this text contain that?".</p>` },
      { heading: "Looping over text", html: `<p>Loop over characters to count or transform them.</p>
<pre><code>text = "Programming"
vowels = 0
for ch in text.lower():
    if ch in "aeiou":
        vowels += 1
print(vowels)   # 3</code></pre>` },
      { heading: "ord() and chr()", html: `<p>Every character has a number. <code>ord</code> goes character to number; <code>chr</code> goes back.</p>
<pre><code>print(ord("a"))   # 97
print(chr(98))    # b
# shift a lowercase letter by 3, wrapping round z
ch = "y"
shifted = chr((ord(ch) - ord("a") + 3) % 26 + ord("a"))
print(shifted)    # b</code></pre>` },
    ],
  },

  // ───────────────────────────── LISTS ─────────────────────────────
  {
    id: "cs_lists", title: "Lists", icon: "📋", topic: "collections",
    sections: [
      { heading: "Making and reading lists", html: `<p>A list holds items in order, in square brackets. Indexing and slicing work like strings.</p>
<pre><code>nums = [5, 3, 8]
print(nums[0], nums[-1])   # 5 8
print(len(nums))           # 3
print(8 in nums)           # True
nums[1] = 30               # lists CAN be changed
print(nums)                # [5, 30, 8]</code></pre>` },
      { heading: "Adding and removing", html: `<pre><code>items = ["a", "b"]
items.append("c")        # add to end
items.insert(0, "z")     # add at position 0
items.extend(["d", "e"]) # add several
last = items.pop()       # remove and return last
items.remove("z")        # remove first matching value
print(items, last)       # ['a', 'b', 'c', 'd'] e</code></pre>
<p><strong>Common mistake:</strong> <code>items = items.append("x")</code> sets <code>items</code> to <code>None</code>, because <code>append</code> changes the list in place and returns nothing.</p>` },
      { heading: "Sorting", html: `<p><code>sorted()</code> returns a new list; <code>.sort()</code> changes the list itself.</p>
<pre><code>nums = [3, 1, 2]
print(sorted(nums))                # [1, 2, 3]
print(sorted(nums, reverse=True))  # [3, 2, 1]
words = ["pear", "fig", "banana"]
words.sort(key=len)
print(words)                       # ['fig', 'pear', 'banana']</code></pre>` },
      { heading: "Useful built-ins", html: `<pre><code>nums = [4, 9, 1]
print(sum(nums), min(nums), max(nums))  # 14 1 9
print(nums.index(9))                    # 1
print([0] * 3)                          # [0, 0, 0]</code></pre>` },
      { heading: "List comprehensions", html: `<p>A short way to build a list from a loop, optionally with a filter.</p>
<pre><code>squares = [n * n for n in range(5)]
print(squares)                     # [0, 1, 4, 9, 16]
evens = [n for n in range(10) if n % 2 == 0]
print(evens)                       # [0, 2, 4, 6, 8]</code></pre>` },
      { heading: "Copying (the aliasing trap)", html: `<p><code>b = a</code> does not copy a list; both names point at the <em>same</em> list.</p>
<pre><code>a = [1, 2]
b = a
b.append(3)
print(a)        # [1, 2, 3]  surprise!
c = a.copy()    # or a[:] or list(a)
c.append(4)
print(a)        # [1, 2, 3]  unchanged</code></pre>` },
    ],
  },

  // ───────────────────────────── DICTS & SETS ─────────────────────────────
  {
    id: "cs_dicts_sets", title: "Dictionaries & Sets", icon: "📦", topic: "collections",
    sections: [
      { heading: "Dictionary basics", html: `<p>A dictionary maps <strong>keys</strong> to <strong>values</strong>. Look things up by key, not by position.</p>
<pre><code>ages = {"Ann": 31, "Bo": 25}
print(ages["Ann"])      # 31
ages["Cy"] = 40         # add or update
del ages["Bo"]          # remove
print(ages)             # {'Ann': 31, 'Cy': 40}
print("Bo" in ages)     # False (checks keys)</code></pre>
<p><strong>Common mistake:</strong> <code>ages["Zed"]</code> raises a <code>KeyError</code> if the key is missing. Use <code>ages.get("Zed")</code> (gives <code>None</code>) or <code>ages.get("Zed", 0)</code>.</p>` },
      { heading: "Looping over a dictionary", html: `<pre><code>prices = {"tea": 1.5, "cake": 2.75}
for item in prices:                 # keys
    print(item)
for item, price in prices.items():  # key and value
    print(f"{item}: £{price:.2f}")
print(list(prices.values()))        # [1.5, 2.75]</code></pre>` },
      { heading: "Counting with a dictionary", html: `<p>The classic pattern: start each key at 0 the first time you see it.</p>
<pre><code>words = "the cat and the hat".split()
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
print(counts)   # {'the': 2, 'cat': 1, 'and': 1, 'hat': 1}

from collections import Counter
print(Counter(words).most_common(1))  # [('the', 2)]</code></pre>` },
      { heading: "Sets", html: `<p>A set holds <strong>unique</strong> items with no order. Great for removing duplicates and fast "is it in there?" checks.</p>
<pre><code>nums = [3, 1, 3, 2, 1]
unique = set(nums)
print(sorted(unique))      # [1, 2, 3]
seen = set()
seen.add("x")
print("x" in seen)         # True</code></pre>
<p><strong>Common mistake:</strong> <code>{}</code> is an empty <em>dictionary</em>. An empty set is <code>set()</code>.</p>` },
      { heading: "Set operations", html: `<pre><code>a = {1, 2, 3}
b = {2, 3, 4}
print(a | b)   # union: {1, 2, 3, 4}
print(a &amp; b)   # intersection: {2, 3}
print(a - b)   # difference: {1}</code></pre>` },
      { heading: "Which collection?", html: `<table><tr><th>Need</th><th>Use</th></tr>
<tr><td>Things in order, duplicates fine</td><td>list</td></tr>
<tr><td>Look up a value by a name/ID</td><td>dict</td></tr>
<tr><td>Unique items, fast membership test</td><td>set</td></tr>
<tr><td>Fixed group that won't change</td><td>tuple, e.g. <code>(x, y)</code></td></tr></table>
<p>Dictionary keys must be immutable: strings, numbers and tuples work; lists don't.</p>` },
    ],
  },

  // ───────────────────────────── FUNCTIONS & RECURSION ─────────────────────────────
  {
    id: "cs_functions", title: "Functions & Recursion", icon: "🌀", topic: "recursion",
    sections: [
      { heading: "Defining functions", html: `<p><code>def</code> names a reusable block. Parameters go in brackets; <code>return</code> sends a result back.</p>
<pre><code>def area(width, height):
    return width * height

print(area(3, 4))   # 12</code></pre>
<p><strong>Common mistake:</strong> using <code>print</code> instead of <code>return</code>. A function with no <code>return</code> gives back <code>None</code>, so <code>x = area(3, 4)</code> would be useless.</p>` },
      { heading: "Defaults and keyword arguments", html: `<pre><code>def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Isaac"))                  # Hello, Isaac!
print(greet("Isaac", greeting="Hiya")) # Hiya, Isaac!</code></pre>
<p><strong>Common mistake:</strong> a mutable default like <code>def add(x, items=[])</code>. The same list is shared between calls. Use <code>items=None</code> and create the list inside.</p>` },
      { heading: "Scope", html: `<p>Variables created inside a function are <em>local</em>: they vanish when it returns, and don't affect variables outside with the same name.</p>
<pre><code>x = 10
def change():
    x = 99      # a new, local x
    return x
print(change(), x)   # 99 10</code></pre>` },
      { heading: "Recursion", html: `<p>A recursive function calls itself on a smaller problem. It needs a <strong>base case</strong> (stop) and a <strong>recursive case</strong> (shrink and call again).</p>
<pre><code>def factorial(n):
    if n &lt;= 1:          # base case
        return 1
    return n * factorial(n - 1)   # recursive case

print(factorial(5))   # 120</code></pre>
<p><strong>Common mistake:</strong> no base case, or one that's never reached, gives <code>RecursionError: maximum recursion depth exceeded</code>.</p>` },
      { heading: "Recursion on lists", html: `<p>Handle the first item, recurse on the rest. Or, for nested data, recurse whenever you find a list inside a list.</p>
<pre><code>def flatten(items):
    out = []
    for item in items:
        if isinstance(item, list):
            out.extend(flatten(item))
        else:
            out.append(item)
    return out

print(flatten([1, [2, [3, 4]], 5]))   # [1, 2, 3, 4, 5]</code></pre>` },
      { heading: "Memoisation", html: `<p>Naive Fibonacci recomputes the same values again and again. Remember (cache) results and it becomes fast.</p>
<pre><code>from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n &lt; 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(50))   # 12586269025, instantly</code></pre>` },
    ],
  },

  // ───────────────────────────── CLASSES ─────────────────────────────
  {
    id: "cs_classes", title: "Classes", icon: "🏗️", topic: "oop",
    sections: [
      { heading: "A first class", html: `<p>A class is a blueprint; each object made from it has its own data. <code>__init__</code> runs when you create one, and <code>self</code> is the object itself.</p>
<pre><code>class Dog:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} says woof"

rex = Dog("Rex")
print(rex.speak())   # Rex says woof</code></pre>
<p><strong>Common mistake:</strong> leaving out <code>self</code> as the first parameter of a method, which gives "takes 0 positional arguments but 1 was given".</p>` },
      { heading: "Changing state", html: `<pre><code>class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        if amount &lt;= 0:
            raise ValueError("Deposit must be positive")
        self.balance += amount

acc = BankAccount()
acc.deposit(50)
print(acc.balance)   # 50</code></pre>` },
      { heading: "__str__ and __repr__", html: `<p>Tell Python how to show your object as text.</p>
<pre><code>class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __repr__(self):
        return f"Point({self.x}, {self.y})"

print(Point(2, 3))   # Point(2, 3)</code></pre>` },
      { heading: "Inheritance", html: `<p>A child class gets everything from its parent and can override or extend it. <code>super()</code> calls the parent's version.</p>
<pre><code>class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Cat(Animal):
    def speak(self):
        return f"{self.name} says meow"

print(Cat("Tom").speak())   # Tom says meow</code></pre>` },
      { heading: "Decorators", html: `<p>A decorator wraps a function to add behaviour without changing its code.</p>
<pre><code>def shout(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs).upper()
    return wrapper

@shout
def hello(name):
    return f"hello {name}"

print(hello("isaac"))   # HELLO ISAAC</code></pre>` },
      { heading: "Generators", html: `<p>A function with <code>yield</code> produces values one at a time, only when asked. Handy for long or endless sequences.</p>
<pre><code>def countdown(n):
    while n &gt; 0:
        yield n
        n -= 1

print(list(countdown(3)))   # [3, 2, 1]</code></pre>` },
    ],
  },

  // ───────────────────────────── ALGORITHMS ─────────────────────────────
  {
    id: "cs_algorithms", title: "Common Algorithms", icon: "🧠", topic: "algorithms",
    sections: [
      { heading: "Big-O in one minute", html: `<p>Big-O describes how work grows as input size <em>n</em> grows.</p>
<table><tr><th>Big-O</th><th>Name</th><th>Example</th></tr>
<tr><td>O(1)</td><td>constant</td><td>dict lookup</td></tr>
<tr><td>O(log n)</td><td>logarithmic</td><td>binary search</td></tr>
<tr><td>O(n)</td><td>linear</td><td>one loop over a list</td></tr>
<tr><td>O(n log n)</td><td></td><td><code>sorted()</code></td></tr>
<tr><td>O(n²)</td><td>quadratic</td><td>loop inside a loop</td></tr></table>` },
      { heading: "Stack (matching brackets)", html: `<p>A stack is last-in, first-out. In Python a list works: <code>append</code> to push, <code>pop</code> to pop.</p>
<pre><code>def balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack

print(balanced("([]{})"))  # True
print(balanced("(]"))      # False</code></pre>
<p><strong>Common mistake:</strong> forgetting the final <code>not stack</code>: <code>"(("</code> has no mismatches but is still unbalanced.</p>` },
      { heading: "Binary search", html: `<p>On a <strong>sorted</strong> list, check the middle and throw away the half that can't contain the target. O(log n).</p>
<pre><code>def binary_search(items, target):
    lo, hi = 0, len(items) - 1
    while lo &lt;= hi:
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid
        elif items[mid] &lt; target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

print(binary_search([1, 3, 5, 7, 9], 7))   # 3</code></pre>
<p><strong>Common mistake:</strong> <code>while lo &lt; hi</code> (instead of <code>&lt;=</code>) misses the case where the target is the last item left.</p>` },
      { heading: "Two pointers", html: `<p>Start one pointer at each end of a sorted list and move them towards each other. Turns many O(n²) pair problems into O(n).</p>
<pre><code>def pair_with_sum(nums, target):
    left, right = 0, len(nums) - 1
    while left &lt; right:
        total = nums[left] + nums[right]
        if total == target:
            return nums[left], nums[right]
        if total &lt; target:
            left += 1
        else:
            right -= 1
    return None

print(pair_with_sum([1, 2, 4, 7, 11], 9))   # (2, 7)</code></pre>` },
      { heading: "Sliding window", html: `<p>Keep a "window" over part of the list and slide it along, updating the answer as items enter and leave, instead of recomputing from scratch.</p>
<pre><code>def max_sum_of_k(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]   # add new, drop old
        best = max(best, window)
    return best

print(max_sum_of_k([2, 1, 5, 1, 3, 2], 3))   # 9</code></pre>` },
      { heading: "Longest substring without repeats", html: `<p>A variable-size window: grow the right edge, and shrink from the left whenever a repeat appears.</p>
<pre><code>def longest_unique(s):
    last_seen = {}
    start = best = 0
    for i, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] &gt;= start:
            start = last_seen[ch] + 1
        last_seen[ch] = i
        best = max(best, i - start + 1)
    return best

print(longest_unique("abcabcbb"))   # 3</code></pre>` },
      { heading: "Greedy", html: `<p>Make the best-looking choice at each step. Works when local best choices add up to the global best, as with coin change in pounds and pence.</p>
<pre><code>def fewest_coins(pence):
    coins = [200, 100, 50, 20, 10, 5, 2, 1]
    count = 0
    for c in coins:
        count += pence // c
        pence %= c
    return count

print(fewest_coins(388))   # 8  (200+100+50+20+10+5+2+1)</code></pre>` },
    ],
  },

  // ───────────────────────────── SQL ─────────────────────────────
  {
    id: "cs_sql", title: "SQL Basics", icon: "🗃️", topic: "sql",
    sections: [
      { heading: "Tables, rows and columns", html: `<p>A relational database stores data in <strong>tables</strong>. Each row is one record; each column is one field. A <strong>primary key</strong> uniquely identifies each row.</p>
<pre><code>CREATE TABLE customers (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL,
  city  TEXT
);
INSERT INTO customers (id, name, city) VALUES (1, 'Ann', 'Leeds');</code></pre>` },
      { heading: "SELECT and WHERE", html: `<p>Pick columns with <code>SELECT</code>, filter rows with <code>WHERE</code>.</p>
<pre><code>SELECT name, city
FROM customers
WHERE city = 'Leeds' AND name LIKE 'A%';</code></pre>
<p><strong>Common mistake:</strong> comparing with <code>= NULL</code>. Missing values need <code>IS NULL</code> / <code>IS NOT NULL</code>.</p>` },
      { heading: "ORDER BY and LIMIT", html: `<pre><code>SELECT name, total
FROM orders
ORDER BY total DESC
LIMIT 5;</code></pre>
<p>Without <code>ORDER BY</code> the database may return rows in any order.</p>` },
      { heading: "JOIN", html: `<p>A <code>JOIN</code> combines rows from two tables that match on a column, usually a foreign key.</p>
<pre><code>SELECT c.name, o.total
FROM customers AS c
JOIN orders AS o ON o.customer_id = c.id;</code></pre>
<p><code>JOIN</code> (inner) keeps only matches. <code>LEFT JOIN</code> keeps every row from the left table, filling the right side with <code>NULL</code> when there's no match: useful for "customers with no orders".</p>` },
      { heading: "GROUP BY and aggregates", html: `<p>Aggregates (<code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code>) squash many rows into one value. <code>GROUP BY</code> gives one result per group.</p>
<pre><code>SELECT customer_id, COUNT(*) AS orders, SUM(total) AS spent
FROM orders
GROUP BY customer_id
HAVING SUM(total) &gt; 100
ORDER BY spent DESC;</code></pre>
<p><strong>Common mistake:</strong> using <code>WHERE</code> to filter on an aggregate. <code>WHERE</code> filters rows <em>before</em> grouping; <code>HAVING</code> filters groups <em>after</em>.</p>` },
      { heading: "UPDATE and DELETE", html: `<pre><code>UPDATE customers SET city = 'York' WHERE id = 1;
DELETE FROM orders WHERE total = 0;</code></pre>
<p><strong>Common mistake:</strong> forgetting <code>WHERE</code>. <code>DELETE FROM orders;</code> deletes every row.</p>` },
    ],
  },
];

globalThis.QUIZZES = [
  // ───────────────────────────── PYTHON: BASICS ─────────────────────────────
  {
    id: "qz_basics", title: "Python Basics", icon: "🐍", track: "python",
    questions: [
      { q: `What does this print?<pre><code>print(7 // 2)</code></pre>`, options: ["3.5", "3", "4", "1"], answer: 1,
        explain: `<code>//</code> is <strong>floor division</strong>: it divides and rounds down to a whole number. <code>7 / 2</code> would give <code>3.5</code>, and <code>7 % 2</code> (the remainder) would give <code>1</code>.` },
      { q: `What type of value does <code>input()</code> give back?`, options: ["int", "float", "It depends on what the user types", "str"], answer: 3,
        explain: `<code>input()</code> always returns a string, even if the user types <code>42</code>. Convert it with <code>int()</code> or <code>float()</code> when you need a number.` },
      { q: `What does this print?<pre><code>print("5" + "5")</code></pre>`, options: ["55", "10", "An error", "5 5"], answer: 0,
        explain: `Both values are strings, so <code>+</code> joins them end to end ("concatenation"), giving <code>55</code>. Only <code>5 + 5</code> (two ints) gives <code>10</code>.` },
      { q: `What does this print?<pre><code>print(10 % 3)</code></pre>`, options: ["3", "0", "1", "3.33"], answer: 2,
        explain: `<code>%</code> gives the remainder. 3 goes into 10 three times (9), leaving <strong>1</strong>.` },
      { q: `What does this print?<pre><code>name = "Isaac"
print("Hi {name}")</code></pre>`, options: ["Hi Isaac", "Hi {name}", "An error", "Hi"], answer: 1,
        explain: `There's no <code>f</code> before the string, so it isn't an f-string. The braces are printed literally. <code>print(f"Hi {name}")</code> would print <code>Hi Isaac</code>.` },
      { q: `Which of these is a valid variable name?`, options: ["2nd_place", "my-score", "total_score", "class"], answer: 2,
        explain: `Names can't start with a digit (<code>2nd_place</code>), can't contain a hyphen (Python reads <code>my-score</code> as <code>my</code> minus <code>score</code>), and can't be a keyword (<code>class</code>).` },
      { q: `What does this print?<pre><code>print(2 + 3 * 4)</code></pre>`, options: ["20", "24", "9", "14"], answer: 3,
        explain: `Multiplication happens before addition: <code>3 * 4 = 12</code>, then <code>2 + 12 = 14</code>. Use brackets, <code>(2 + 3) * 4</code>, to get 20.` },
      { q: `What does this print?<pre><code>x = 5
x += 2
x *= 3
print(x)</code></pre>`, options: ["21", "17", "15", "10"], answer: 0,
        explain: `<code>x += 2</code> makes x 7, then <code>x *= 3</code> makes it 21. Each line uses the value left by the line before.` },
    ],
  },

  // ───────────────────────────── PYTHON: CONDITIONALS ─────────────────────────────
  {
    id: "qz_conditionals", title: "if / elif / else", icon: "🔀", track: "python",
    questions: [
      { q: `What does this print?<pre><code>x = 7
if x &gt; 5:
    print("big")
elif x &gt; 3:
    print("medium")
else:
    print("small")</code></pre>`, options: ["big", "medium", "big, then medium", "small"], answer: 0,
        explain: `7 &gt; 5 is True, so the first branch runs. Even though 7 &gt; 3 is also True, an <code>elif</code> chain runs <strong>only the first</strong> matching branch and skips the rest.` },
      { q: `What does this print?<pre><code>age = 18
if age &gt; 18:
    print("adult")
else:
    print("child")</code></pre>`, options: ["nothing", "adult", "An error", "child"], answer: 3,
        explain: `<code>18 &gt; 18</code> is <strong>False</strong>: 18 isn't <em>more</em> than 18. So the <code>else</code> runs. If 18-year-olds should count as adults, the test needs <code>age &gt;= 18</code>. Always test the exact boundary value.` },
      { q: `A cinema gives a discount to anyone <strong>65 or over</strong>. Which condition is right?`, options: ["age > 65", "age >= 65", "age => 65", "age == 65"], answer: 1,
        explain: `"65 or over" includes 65 itself, so you need <code>&gt;=</code>. <code>&gt; 65</code> wrongly excludes a 65-year-old, <code>=&gt;</code> isn't valid Python, and <code>== 65</code> only matches exactly 65.` },
      { q: `What does this print?<pre><code>n = 10
if n &gt; 5:
    print("A")
if n &gt; 8:
    print("B")
else:
    print("C")</code></pre>`, options: ["A", "A then B", "B", "A then C"], answer: 1,
        explain: `These are two <strong>separate</strong> <code>if</code> statements, not one chain, so both are checked. 10 &gt; 5 prints A. Then 10 &gt; 8 prints B, and the <code>else</code> belongs only to the second <code>if</code>, so C is skipped.` },
      { q: `What does this print?<pre><code>score = 95
if score &gt;= 50:
    print("C")
elif score &gt;= 70:
    print("B")
elif score &gt;= 90:
    print("A")</code></pre>`, options: ["A", "B", "C", "A, B and C"], answer: 2,
        explain: `Python checks from the top. 95 &gt;= 50 is True, so it prints C and skips the rest. This is the classic ordering bug: put the <strong>strictest</strong> test (<code>&gt;= 90</code>) first.` },
      { q: `What does this print?<pre><code>day = "Mon"
if day == "Sat" or "Sun":
    print("weekend")
else:
    print("weekday")</code></pre>`, options: ["weekend", "weekday", "An error", "nothing"], answer: 0,
        explain: `Python reads it as <code>(day == "Sat") or ("Sun")</code>. The first part is False, but <code>"Sun"</code> is a non-empty string, which is truthy, so the whole condition is True. Write <code>day == "Sat" or day == "Sun"</code>, or <code>day in ("Sat", "Sun")</code>.` },
      { q: `Which of these values is <strong>falsy</strong> (counts as False in an <code>if</code>)?`, options: [`"0"`, "[0]", "0", `" "`], answer: 2,
        explain: `The number <code>0</code> is falsy. <code>"0"</code> and <code>" "</code> are non-empty strings, and <code>[0]</code> is a list with one item, so all three are truthy.` },
      { q: `What does this print?<pre><code>n = 0
print("pos" if n &gt; 0 else "neg" if n &lt; 0 else "zero")</code></pre>`, options: ["pos", "neg", "An error", "zero"], answer: 3,
        explain: `It reads like an elif chain: 0 &gt; 0 is False, 0 &lt; 0 is False, so the final value <code>"zero"</code> is chosen. Conditional expressions can be chained, though a normal if/elif block is often clearer.` },
      { q: `What does this print?<pre><code>print(True or False and False)</code></pre>`, options: ["True", "False", "None", "An error"], answer: 0,
        explain: `<code>and</code> binds more tightly than <code>or</code>, so this is <code>True or (False and False)</code>, which is <code>True or False</code>, which is <code>True</code>. Add brackets when mixing them, to make your intent obvious.` },
      { q: `What does this print?<pre><code>temp = 15
raining = True
if temp &gt; 10:
    if raining:
        print("umbrella")
    else:
        print("sunglasses")
else:
    print("coat")</code></pre>`, options: ["coat", "sunglasses", "umbrella", "umbrella and coat"], answer: 2,
        explain: `15 &gt; 10 is True, so we go into the outer block. Inside, <code>raining</code> is True, so it prints umbrella. The outer <code>else</code> (coat) only runs when temp is 10 or less.` },
      { q: `What does this print? (Python 3.10+)<pre><code>value = 3
match value:
    case 1 | 2:
        print("low")
    case 3:
        print("three")
    case _:
        print("other")</code></pre>`, options: ["low", "three", "other", "three, then other"], answer: 1,
        explain: `<code>match</code> runs the first case that fits, then stops. There's no fall-through, so <code>case _</code> (the catch-all) doesn't run as well.` },
      { q: `What does this print?<pre><code>x = 10
print(1 &lt; x &lt; 10)</code></pre>`, options: ["10", "An error", "True", "False"], answer: 3,
        explain: `A chained comparison means <code>1 &lt; x and x &lt; 10</code>. The second part, <code>10 &lt; 10</code>, is False, so the result is False. With <code>&lt;=</code> at the end it would be True. Boundaries again!` },
    ],
  },

  // ───────────────────────────── PYTHON: LOOPS ─────────────────────────────
  {
    id: "qz_loops", title: "Loops", icon: "🔁", track: "python",
    questions: [
      { q: `What does this print?<pre><code>print(list(range(2, 8, 2)))</code></pre>`, options: ["[2, 4, 6, 8]", "[2, 4, 6]", "[2, 3, 4, 5, 6, 7]", "[4, 6, 8]"], answer: 1,
        explain: `Start at 2, go up in steps of 2, and stop <strong>before</strong> 8. The stop value is never included.` },
      { q: `What does this print?<pre><code>total = 0
for i in range(4):
    total += i
print(total)</code></pre>`, options: ["10", "4", "6", "3"], answer: 2,
        explain: `<code>range(4)</code> is 0, 1, 2, 3. Adding them gives 0 + 1 + 2 + 3 = 6.` },
      { q: `How many times does the body of <code>for i in range(1, 10):</code> run?`, options: ["10", "11", "9", "1"], answer: 2,
        explain: `It runs for 1, 2, ... 9: that's 9 times. The number of steps is <code>stop - start</code> = 10 - 1.` },
      { q: `What does this print?<pre><code>for n in [3, 6, 9, 12]:
    if n &gt; 7:
        break
    print(n)</code></pre>`, options: ["3 and 6", "3, 6 and 9", "9 and 12", "3"], answer: 0,
        explain: `3 and 6 are printed. When n is 9, <code>9 &gt; 7</code> is True and <code>break</code> leaves the loop immediately, before printing.` },
      { q: `What does this print?<pre><code>n = 1
while n &lt; 20:
    n *= 3
print(n)</code></pre>`, options: ["9", "20", "81", "27"], answer: 3,
        explain: `n goes 1, 3, 9, 27. After it becomes 27, the check <code>27 &lt; 20</code> is False, so the loop stops and 27 is printed. A while loop can overshoot its limit.` },
      { q: `What does this print?<pre><code>for c in "banana":
    if c == "a":
        continue
    print(c, end="")</code></pre>`, options: ["aaa", "banana", "bnn", "b"], answer: 2,
        explain: `<code>continue</code> skips the rest of the loop body for that character, so every "a" is skipped and only b, n, n are printed.` },
      { q: `Which of these loops never ends?`, options: [`for i in range(5): print(i)`, `i = 0, then while i < 5: i += 1`, `while False: print("hi")`, `i = 0, then while i < 5: print(i)`], answer: 3,
        explain: `In the last one nothing inside the loop changes <code>i</code>, so <code>i &lt; 5</code> stays True for ever. Something in a while loop must move it towards stopping.` },
      { q: `What does this print?<pre><code>for i, ch in enumerate("hi"):
    print(i, ch)</code></pre>`, options: ["1 h, then 2 i", "0 h, then 1 i", "h 0, then i 1", "0 hi"], answer: 1,
        explain: `<code>enumerate</code> gives (position, item) pairs, starting at 0 unless you pass <code>start=1</code>.` },
    ],
  },

  // ───────────────────────────── PYTHON: STRINGS ─────────────────────────────
  {
    id: "qz_strings", title: "Strings", icon: "🔤", track: "python",
    questions: [
      { q: `What does this print?<pre><code>s = "python"
print(s[1:3])</code></pre>`, options: ["py", "yt", "yth", "pyt"], answer: 1,
        explain: `Index 1 is "y", index 2 is "t", and the slice stops <strong>before</strong> index 3.` },
      { q: `What is <code>"hello"[-2]</code>?`, options: ["o", "e", "l", "h"], answer: 2,
        explain: `Negative indexes count from the end: -1 is "o", -2 is "l".` },
      { q: `What does this print?<pre><code>word = "hi"
word.upper()
print(word)</code></pre>`, options: ["HI", "Hi", "None", "hi"], answer: 3,
        explain: `Strings are immutable. <code>upper()</code> returns a <em>new</em> string, which is thrown away here. You need <code>word = word.upper()</code>.` },
      { q: `What is <code>"a-b-c".split("-")</code>?`, options: ["['a', 'b', 'c']", "['a-b-c']", "'abc'", "['a', '-', 'b', '-', 'c']"], answer: 0,
        explain: `<code>split</code> cuts the string at each separator and returns a list of the pieces. The separators themselves are dropped.` },
      { q: `What happens here?<pre><code>s = "abc"
s[0] = "z"</code></pre>`, options: ["s becomes 'zbc'", "Nothing changes, silently", "TypeError", "IndexError"], answer: 2,
        explain: `You can't change a character inside a string. Python raises <code>TypeError: 'str' object does not support item assignment</code>. Build a new one: <code>s = "z" + s[1:]</code>.` },
      { q: `What is <code>"Mississippi".count("ss")</code>?`, options: ["4", "2", "1", "3"], answer: 1,
        explain: `"ss" appears twice: Mi<strong>ss</strong>i<strong>ss</strong>ippi. <code>count</code> counts non-overlapping occurrences of the whole substring.` },
      { q: `What is <code>len("hi there")</code>?`, options: ["7", "9", "2", "8"], answer: 3,
        explain: `The space counts as a character: h, i, space, t, h, e, r, e makes 8.` },
      { q: `What does <code>s[::-1]</code> do?`, options: ["Reverses the string", "Sorts the letters", "Removes duplicates", "Takes every other letter"], answer: 0,
        explain: `A step of -1 walks backwards through the whole string, so it gives the reverse. It's the quickest palindrome check: <code>s == s[::-1]</code>.` },
    ],
  },

  // ───────────────────────────── PYTHON: COLLECTIONS ─────────────────────────────
  {
    id: "qz_collections", title: "Lists & Dictionaries", icon: "📦", track: "python",
    questions: [
      { q: `What does this print?<pre><code>a = [1, 2]
b = a
b.append(3)
print(a)</code></pre>`, options: ["[1, 2]", "[1, 2, 3]", "[3]", "An error"], answer: 1,
        explain: `<code>b = a</code> doesn't copy; both names point at the same list, so changing it through <code>b</code> changes what <code>a</code> sees. Use <code>a.copy()</code> for a real copy.` },
      { q: `What does this print?<pre><code>nums = [3, 1, 2]
x = nums.sort()
print(x)</code></pre>`, options: ["[1, 2, 3]", "[3, 1, 2]", "None", "An error"], answer: 2,
        explain: `<code>.sort()</code> sorts the list in place and returns <code>None</code>. <code>nums</code> is now sorted, but <code>x</code> is None. Use <code>sorted(nums)</code> if you want a new list back.` },
      { q: `What is <code>{"a": 1}.get("b", 0)</code>?`, options: ["0", "KeyError", "None", "'b'"], answer: 0,
        explain: `<code>get</code> returns the default (the second argument) when the key is missing, instead of raising a <code>KeyError</code> like <code>d["b"]</code> would.` },
      { q: `What is <code>len(set([1, 1, 2, 3, 3, 3]))</code>?`, options: ["6", "2", "1", "3"], answer: 3,
        explain: `A set keeps only unique values: {1, 2, 3}. So its length is 3.` },
      { q: `How do you make an empty <strong>set</strong>?`, options: ["{}", "set()", "[]", "()"], answer: 1,
        explain: `<code>{}</code> is an empty <em>dictionary</em> (dictionaries came first). For an empty set you must write <code>set()</code>.` },
      { q: `What is this list?<pre><code>[n * 2 for n in range(4) if n % 2 == 1]</code></pre>`, options: ["[0, 4]", "[1, 3]", "[2, 6]", "[2, 4, 6, 8]"], answer: 2,
        explain: `<code>range(4)</code> is 0 to 3. The filter keeps the odd ones, 1 and 3, and each is doubled: [2, 6].` },
      { q: `Which of these <strong>can't</strong> be a dictionary key?`, options: ["'name'", "42", "(1, 2)", "[1, 2]"], answer: 3,
        explain: `Keys must be immutable (hashable). Strings, numbers and tuples are fine; a list can change, so it can't be a key.` },
      { q: `What does this print?<pre><code>print({1, 2, 3} &amp; {2, 3, 4})</code></pre>`, options: ["{1, 2, 3, 4}", "{2, 3}", "{1, 4}", "{1}"], answer: 1,
        explain: `<code>&amp;</code> is intersection: only the items in <strong>both</strong> sets. <code>|</code> would give the union.` },
    ],
  },

  // ───────────────────────────── PYTHON: RECURSION ─────────────────────────────
  {
    id: "qz_recursion", title: "Functions & Recursion", icon: "🌀", track: "python",
    questions: [
      { q: `In a recursive function, what is the <strong>base case</strong>?`, options: ["The condition where the function stops calling itself", "The first line of the function", "The biggest input it can handle", "The case that calls itself"], answer: 0,
        explain: `The base case answers the smallest version of the problem directly, without recursing. Without one, the calls never stop.` },
      { q: `What does <code>f(4)</code> return?<pre><code>def f(n):
    if n == 0:
        return 0
    return n + f(n - 1)</code></pre>`, options: ["4", "10", "24", "0"], answer: 1,
        explain: `f(4) = 4 + f(3) = 4 + 3 + f(2) = ... = 4 + 3 + 2 + 1 + 0 = 10. It sums 1 to n.` },
      { q: `What happens when you call <code>f(5)</code>?<pre><code>def f(n):
    return n * f(n - 1)</code></pre>`, options: ["Returns 0", "Returns None", "RecursionError", "Returns 120"], answer: 2,
        explain: `There's no base case, so it keeps calling f(4), f(3), ... f(-1000) until Python hits its recursion limit and raises <code>RecursionError</code>.` },
      { q: `What does <code>count(3)</code> print?<pre><code>def count(n):
    if n == 0:
        return
    print(n)
    count(n - 1)</code></pre>`, options: ["1 2 3", "3 2 1 0", "3", "3 2 1"], answer: 3,
        explain: `It prints n, then recurses on n - 1. When n reaches 0 it returns before printing, so 0 isn't shown.` },
      { q: `What does a function return if it has no <code>return</code> statement?`, options: ["None", "0", "An empty string", "An error is raised"], answer: 0,
        explain: `Every Python function returns something. With no <code>return</code> it's <code>None</code>. This is why <code>x = print("hi")</code> sets x to None.` },
      { q: `Why does memoisation speed up recursive Fibonacci?`, options: ["It uses less memory", "It turns recursion into a loop", "It avoids recomputing the same values again and again", "It runs on several CPU cores"], answer: 2,
        explain: `Plain <code>fib(n)</code> recomputes fib(2), fib(3)... huge numbers of times. Caching each result means every value is worked out once, turning exponential time into linear.` },
      { q: `What does <code>power(2, 5)</code> return?<pre><code>def power(b, e):
    if e == 0:
        return 1
    return b * power(b, e - 1)</code></pre>`, options: ["10", "25", "64", "32"], answer: 3,
        explain: `It multiplies 2 by itself 5 times: 2 × 2 × 2 × 2 × 2 = 32. The base case <code>e == 0</code> returns 1, because anything to the power 0 is 1.` },
      { q: `What does this print?<pre><code>def add(x, items=[]):
    items.append(x)
    return items

add(1)
print(add(2))</code></pre>`, options: ["[2]", "[1, 2]", "[1]", "An error"], answer: 1,
        explain: `The default list is created <strong>once</strong>, when the function is defined, and shared by every call. Use <code>items=None</code> and create a new list inside the function.` },
    ],
  },

  // ───────────────────────────── PYTHON: ALGORITHMS ─────────────────────────────
  {
    id: "qz_algorithms", title: "Algorithms", icon: "🧠", track: "python",
    questions: [
      { q: `What must be true for binary search to work?`, options: ["The list has no duplicates", "The list is sorted", "The list has an even length", "The list contains only numbers"], answer: 1,
        explain: `Binary search throws away half the list based on whether the middle item is too big or too small. That only makes sense if the items are in order.` },
      { q: `What is the Big-O time of binary search?`, options: ["O(n)", "O(1)", "O(log n)", "O(n²)"], answer: 2,
        explain: `Each step halves the search space, so a million items takes about 20 steps. That's logarithmic: O(log n).` },
      { q: `You push 1, then 2, then 3 onto a stack. What does <code>pop()</code> return?`, options: ["1", "3", "2", "[1, 2]"], answer: 1,
        explain: `A stack is last in, first out (LIFO), like a pile of plates. The last thing pushed, 3, comes off first.` },
      { q: `A loop over n items contains another loop over the same n items. Roughly how does the work grow?`, options: ["O(n)", "O(log n)", "O(2n)", "O(n²)"], answer: 3,
        explain: `For each of the n outer steps, the inner loop does n steps: n × n = n². Doubling the input makes it about four times slower.` },
      { q: `What is the largest sum of 2 neighbouring numbers in <code>[1, 4, 2, 5]</code>?`, options: ["7", "6", "5", "12"], answer: 0,
        explain: `The windows are [1, 4] = 5, [4, 2] = 6 and [2, 5] = 7. A sliding window computes each new sum by adding the item entering and subtracting the one leaving.` },
      { q: `Two pointers on a sorted list: the left + right sum is <strong>smaller</strong> than the target. What do you do?`, options: ["Move the left pointer right", "Move the right pointer left", "Move both pointers", "Stop: there's no answer"], answer: 0,
        explain: `Moving the left pointer right picks a bigger number (the list is sorted), so the sum goes up. Moving the right pointer left would only make it smaller.` },
      { q: `Which is fastest, on average, for checking "is x in here?" on a big collection?`, options: ["list", "set", "tuple", "string"], answer: 1,
        explain: `Sets (and dict keys) use hashing, so membership checks are O(1) on average. Lists and tuples must be scanned item by item: O(n).` },
      { q: `Greedy coin change always takes the biggest coin that fits. With coins 1, 3 and 4, making 6: how many coins does greedy use, and what's the best possible?`, options: ["2 and 2", "3 and 3", "3 and 2", "2 and 1"], answer: 2,
        explain: `Greedy picks 4, then 1, then 1: three coins. But 3 + 3 uses only two. Greedy is fast, but only correct for some coin systems (UK coins happen to work).` },
    ],
  },

  // ───────────────────────────── PYTHON: OOP ─────────────────────────────
  {
    id: "qz_oop", title: "Classes & Advanced", icon: "🏗️", track: "python",
    questions: [
      { q: `In a method, what is <code>self</code>?`, options: ["The class itself", "A keyword that must be spelled 'self'", "The object the method was called on", "A copy of the object"], answer: 2,
        explain: `When you write <code>rex.speak()</code>, Python passes <code>rex</code> in as <code>self</code>. It's a naming convention, not a keyword, but always use it.` },
      { q: `What does this print?<pre><code>class Counter:
    def __init__(self):
        self.n = 0
    def inc(self):
        self.n += 1

a = Counter()
b = Counter()
a.inc()
a.inc()
b.inc()
print(a.n, b.n)</code></pre>`, options: ["3 3", "2 1", "1 2", "2 2"], answer: 1,
        explain: `Each object has its own <code>self.n</code>. <code>a</code> was incremented twice and <code>b</code> once.` },
      { q: `When does <code>__init__</code> run?`, options: ["When a new object is created", "When the class is defined", "When the program ends", "Only when you call it by name"], answer: 0,
        explain: `<code>Counter()</code> creates a new object and immediately calls its <code>__init__</code> to set it up.` },
      { q: `What does this print?<pre><code>class A:
    def hi(self):
        return "A"

class B(A):
    pass

print(B().hi())</code></pre>`, options: ["B", "An error", "None", "A"], answer: 3,
        explain: `B inherits from A. B doesn't define <code>hi</code>, so Python looks it up in the parent class and finds A's version.` },
      { q: `What happens?<pre><code>class Dog:
    def speak():
        return "woof"

Dog().speak()</code></pre>`, options: ["TypeError", "Prints nothing", "NameError", "It returns 'woof'"], answer: 0,
        explain: `Python passes the object in automatically, but <code>speak</code> takes no parameters: "speak() takes 0 positional arguments but 1 was given". Add <code>self</code>.` },
      { q: `What does <code>super().__init__(name)</code> do inside a child class?`, options: ["Creates a second object", "Calls the parent class's __init__", "Deletes the parent class", "Makes the method run faster"], answer: 1,
        explain: `<code>super()</code> gives you the parent class, so the parent can do its own set-up before the child adds anything extra.` },
      { q: `What does this print?<pre><code>def g():
    yield 1
    yield 2

print(list(g()))</code></pre>`, options: ["1", "[2]", "[1]", "[1, 2]"], answer: 3,
        explain: `A generator produces a value at each <code>yield</code>. <code>list()</code> asks for all of them in turn.` },
      { q: `What does putting <code>@timer</code> above a function do?`, options: ["Runs the function on a timer", "Makes it a class method", "Replaces the function with timer(function), a wrapped version", "Nothing; it's a comment"], answer: 2,
        explain: `<code>@timer</code> is shorthand for <code>func = timer(func)</code>. The decorator usually returns a wrapper that adds behaviour around the original.` },
    ],
  },

  // ───────────────────────────── SQL ─────────────────────────────
  {
    id: "qz_sql", title: "SQL Basics", icon: "🗃️", track: "sql",
    questions: [
      { q: `Which clause filters <strong>groups</strong> after <code>GROUP BY</code>, e.g. "customers who spent over £100"?`, options: ["WHERE", "ORDER BY", "HAVING", "LIMIT"], answer: 2,
        explain: `<code>WHERE</code> filters individual rows before grouping. <code>HAVING</code> filters the grouped results, so it can use aggregates like <code>SUM(total) &gt; 100</code>.` },
      { q: `An inner <code>JOIN</code> between customers and orders returns...`, options: ["Only rows that have a match in both tables", "Every customer, matched or not", "Every row from both tables", "Only the first match"], answer: 0,
        explain: `An inner join keeps only pairs where the <code>ON</code> condition matches. Customers with no orders disappear.` },
      { q: `With <code>customers LEFT JOIN orders</code>, what happens to a customer with no orders?`, options: ["They're left out", "They appear once, with NULL in the order columns", "The query fails", "They appear once per order in the table"], answer: 1,
        explain: `A LEFT JOIN keeps every row from the left table. Where there's no match, the right-hand columns are NULL. Add <code>WHERE o.id IS NULL</code> to find customers who have never ordered.` },
      { q: `How do you find rows where <code>city</code> is missing?`, options: ["WHERE city = NULL", "WHERE city == NULL", "WHERE city EMPTY", "WHERE city IS NULL"], answer: 3,
        explain: `NULL means "unknown", and comparing anything to unknown with <code>=</code> gives unknown, never true. SQL has the special test <code>IS NULL</code>.` },
      { q: `A table has three rows with city Leeds, York, Leeds. How many rows does <code>SELECT city, COUNT(*) FROM t GROUP BY city</code> return?`, options: ["3", "1", "2", "0"], answer: 2,
        explain: `One row per distinct group: (Leeds, 2) and (York, 1).` },
      { q: `What does <code>DELETE FROM orders;</code> do?`, options: ["Deletes every row in orders", "Deletes the orders table itself", "Nothing, without a WHERE", "Deletes the first row"], answer: 0,
        explain: `With no <code>WHERE</code> clause it deletes every row (the empty table remains; <code>DROP TABLE</code> removes the table). Always double-check the WHERE on UPDATE and DELETE.` },
      { q: `What is a primary key for?`, options: ["Sorting the table", "Uniquely identifying each row", "Encrypting the data", "Linking to a different database"], answer: 1,
        explain: `No two rows can share a primary key value, and it can't be NULL, so it's a reliable way to point at exactly one row. Other tables refer to it with <em>foreign keys</em>.` },
      { q: `What does <code>SELECT * FROM orders ORDER BY total DESC LIMIT 1;</code> give you?`, options: ["The smallest order", "The first order ever placed", "A random order", "The order with the largest total"], answer: 3,
        explain: `<code>DESC</code> sorts biggest first, and <code>LIMIT 1</code> keeps just the top row.` },
    ],
  },

  // ───────────────────────────── MACHINE LEARNING ─────────────────────────────
  {
    id: "qz_ml_basics", title: "Machine Learning Basics", icon: "🤖", track: "ml",
    questions: [
      { q: `What is <strong>supervised</strong> learning?`, options: ["A person watches the model while it trains", "Learning from examples that come with the right answers (labels)", "Learning with no data at all", "A model that rewrites its own code"], answer: 1,
        explain: `In supervised learning each training example has a label, e.g. emails marked spam or not spam. The model learns to map inputs to those labels.` },
      { q: `Predicting a house's sale price from its size and location is...`, options: ["Regression", "Classification", "Clustering", "Reinforcement learning"], answer: 0,
        explain: `The output is a number on a continuous scale, so it's regression. Classification predicts a category, e.g. "will sell within a month: yes or no".` },
      { q: `Why do we keep a separate <strong>test set</strong>?`, options: ["To make training faster", "Because the model needs two copies of the data", "To check how well the model does on data it hasn't seen", "To store the labels"], answer: 2,
        explain: `Scoring a model on its own training data is like marking an exam you've seen the answers to. A held-out test set estimates real-world performance.` },
      { q: `A model scores 99% on training data but 60% on new data. This is...`, options: ["Underfitting", "Perfect generalisation", "A data leak", "Overfitting"], answer: 3,
        explain: `It has memorised the training examples (including their noise) rather than learning general patterns. Fixes include more data, a simpler model and regularisation.` },
      { q: `Grouping customers into similar types when you have <strong>no labels</strong> is...`, options: ["Supervised learning", "Unsupervised learning (clustering)", "Regression", "Overfitting"], answer: 1,
        explain: `With no right answers to learn from, the algorithm (e.g. k-means) finds structure in the data itself.` },
      { q: `In ML, a <strong>feature</strong> is...`, options: ["An input variable the model uses, like house size", "The thing being predicted", "A bug in the model", "A type of neural network"], answer: 0,
        explain: `Features are the inputs (columns) the model learns from. The thing being predicted is the label or target.` },
      { q: `Only 1 in 100 emails is spam. A "model" that always says "not spam" has what accuracy?`, options: ["1%", "50%", "99%", "0%"], answer: 2,
        explain: `It's right on the 99 normal emails, so 99% accuracy, yet it never catches spam. For imbalanced data, look at precision and recall, not just accuracy.` },
      { q: `During training the loss jumps about wildly and never settles. A likely cause is...`, options: ["Too much test data", "Too few features", "The model is too simple", "The learning rate is too high"], answer: 3,
        explain: `The learning rate sets the size of each update. Too big and gradient descent overshoots the minimum and bounces around; too small and training is slow.` },
    ],
  },

  // ───────────────────────────── SYSTEM DESIGN QUIZZES ─────────────────────────────
  {
    id: "qz_sd_client_server", title: "Clients, Servers and HTTP", icon: "🌐", track: "system-design",
    questions: [
      { q: `In the client–server model, which statement is right?`, options: ["The server starts the conversation", "The client sends a request and the server sends back a response", "Clients talk directly to the database", "A server can only have one client"], answer: 1,
        explain: `The client (browser, app, script) always asks first; the server listens and answers. One server typically handles many clients at once.` },
      { q: `Which HTTP method should you use to <strong>read</strong> data without changing anything?`, options: ["POST", "DELETE", "GET", "PATCH"], answer: 2,
        explain: `GET is for reading. It should be safe (no side effects), which is also why browsers and caches feel free to repeat or store GET responses.` },
      { q: `A server replies with status <code>404</code>. What does that mean?`, options: ["Everything worked", "The server crashed", "You must log in", "The thing you asked for doesn't exist"], answer: 3,
        explain: `4xx codes mean the client asked for something wrong; 404 is "Not Found". 2xx is success, 401 is "not authenticated", and 5xx means the server itself failed.` },
      { q: `What does it mean for an API to be <strong>stateless</strong>?`, options: ["Each request carries everything the server needs, so any server can handle it", "The server never stores anything in a database", "The API has no URLs", "Responses never change"], answer: 0,
        explain: `Stateless means the server doesn't remember anything between requests in its own memory (the client sends a token, IDs and so on). That's what makes it easy to run many identical servers.` },
      { q: `What does DNS do?`, options: ["Encrypts traffic", "Turns a name like example.com into an IP address", "Stores web pages", "Balances load between servers"], answer: 1,
        explain: `DNS is the internet's phone book. Your computer asks it for the IP address behind a domain name, then connects to that address.` },
    ],
  },
  {
    id: "qz_sd_databases", title: "Databases", icon: "🗄️", track: "system-design",
    questions: [
      { q: `Which is a strength of a relational (SQL) database?`, options: ["It has no schema at all", "It can only store text", "Strong consistency, joins and transactions across tables", "It never needs indexes"], answer: 2,
        explain: `Relational databases shine when data is structured and related, and when you need ACID transactions, e.g. money moving between accounts.` },
      { q: `What does an index on <code>users.email</code> do?`, options: ["Lets the database find a user by email without scanning every row", "Encrypts the email column", "Makes emails unique automatically", "Speeds up every write"], answer: 0,
        explain: `An index is like the index at the back of a book: a sorted structure (usually a B-tree) that jumps straight to matching rows. A <em>unique</em> index also enforces uniqueness, but a plain one doesn't.` },
      { q: `What is the main <strong>cost</strong> of adding an index?`, options: ["Reads get slower", "The table can't be joined any more", "Queries return different results", "Writes get a little slower and it uses extra storage"], answer: 3,
        explain: `Every insert, update or delete must also update the index. So index the columns you search on often, not every column.` },
      { q: `A key-value store (like Redis or DynamoDB) is a good fit for...`, options: ["Complex reports joining ten tables", "Looking things up very fast by a single key, e.g. a session ID", "Storing data with no keys", "Replacing every database"], answer: 1,
        explain: `Key-value stores trade query flexibility for speed and easy scaling. Perfect when you always know the exact key you want.` },
      { q: `What does the "A" in ACID (atomicity) guarantee?`, options: ["Data is always available", "Queries are automatic", "A transaction happens completely or not at all", "Data is stored alphabetically"], answer: 2,
        explain: `If a bank transfer debits one account and then crashes before crediting the other, atomicity rolls the whole thing back. No half-finished transactions.` },
    ],
  },
  {
    id: "qz_sd_caching", title: "Caching", icon: "⚡", track: "system-design",
    questions: [
      { q: `What is a cache <strong>hit</strong>?`, options: ["The cache crashed", "The data was found in the cache", "The data had to be fetched from the database", "The cache was cleared"], answer: 1,
        explain: `A hit means the answer was already in the fast store. A miss means going to the slower source (usually the database) and, typically, saving the result in the cache for next time.` },
      { q: `In the <strong>cache-aside</strong> pattern, what happens on a miss?`, options: ["The request fails", "The cache asks the user to try again", "The app reads from the database, then stores the result in the cache", "The database writes to the cache on a timer"], answer: 2,
        explain: `The application checks the cache, falls back to the database, and fills the cache on the way back. It's the most common caching pattern.` },
      { q: `What does a TTL (time to live) do?`, options: ["Makes a cached item expire after a set time", "Measures network speed", "Encrypts cached data", "Limits the number of users"], answer: 0,
        explain: `After the TTL runs out the item is dropped, so the next read fetches fresh data. It puts an upper limit on how stale the cache can get.` },
      { q: `Which data is usually the <strong>worst</strong> candidate for caching?`, options: ["A product page viewed millions of times", "A user's profile picture", "The site's list of countries", "A bank balance that must always be exactly right"], answer: 3,
        explain: `Caching trades freshness for speed. Data that's read often and changes rarely is ideal; data that must be perfectly up to date is risky to cache.` },
      { q: `An LRU cache is full and needs room. What does it remove?`, options: ["The newest item", "The item that hasn't been used for the longest time", "A random item", "The biggest item"], answer: 1,
        explain: `Least Recently Used assumes that what you haven't touched in a while is least likely to be needed soon.` },
    ],
  },
  {
    id: "qz_sd_load_balancing", title: "Load Balancing & Scaling", icon: "⚖️", track: "system-design",
    questions: [
      { q: `What is <strong>horizontal</strong> scaling?`, options: ["Adding more servers that share the work", "Buying a bigger, faster server", "Making the database wider", "Moving servers to another country"], answer: 0,
        explain: `Horizontal = more machines (scale out). Vertical = a bigger machine (scale up). Horizontal has no hard ceiling and survives one machine dying.` },
      { q: `What does a load balancer do?`, options: ["Stores user sessions", "Compresses images", "Spreads incoming requests across several servers", "Replaces the database"], answer: 2,
        explain: `It sits in front of a pool of servers, passing each request to one of them, and stops sending traffic to any server that fails its health check.` },
      { q: `Round robin load balancing means...`, options: ["Send everything to the fastest server", "Send each request to the next server in turn", "Send each user to a random country", "Send requests to the server with the most RAM"], answer: 1,
        explain: `Server 1, 2, 3, 1, 2, 3... Simple and fair when servers and requests are similar. "Least connections" is better when requests vary a lot.` },
      { q: `Why is it easier to scale <strong>stateless</strong> app servers?`, options: ["They use less electricity", "They don't need a load balancer", "They never crash", "Any server can handle any request, so you can add or remove servers freely"], answer: 3,
        explain: `If session data lives in a shared store (database, Redis) instead of one server's memory, the load balancer can send a user anywhere.` },
      { q: `What is a <strong>single point of failure</strong>?`, options: ["A part that, if it fails, takes the whole system down", "A bug that happens once", "A server that only fails at night", "The first server in a pool"], answer: 0,
        explain: `If you have ten app servers but one database and one load balancer, those are single points of failure. Redundancy (spares, replicas) removes them.` },
    ],
  },
  {
    id: "qz_sd_queues", title: "Queues & Async Work", icon: "📬", track: "system-design",
    questions: [
      { q: `Why put "send welcome email" on a queue instead of doing it during sign-up?`, options: ["Emails can't be sent from web servers", "So the user gets a fast response and the slow work happens in the background", "Queues make emails cheaper", "To send the email twice"], answer: 1,
        explain: `The sign-up request just adds a message to the queue and returns. A worker picks it up and sends the email moments later. The user doesn't wait for the slow part.` },
      { q: `In a message queue, who takes messages off and processes them?`, options: ["The producer", "The load balancer", "The consumer (worker)", "The DNS server"], answer: 2,
        explain: `Producers add messages; consumers (workers) take them off and do the work. They don't need to know about each other.` },
      { q: `Many queues deliver "at least once". What must your worker be?`, options: ["Idempotent: processing the same message twice has the same effect as once", "Written in Python", "Faster than the producer", "Running on the same server as the queue"], answer: 0,
        explain: `If a worker crashes after doing the work but before acknowledging the message, it'll be delivered again. Idempotency (e.g. checking "already sent?") makes duplicates harmless.` },
      { q: `Traffic spikes to 10× normal for five minutes. How does a queue help?`, options: ["It drops the extra requests", "It makes the spike shorter", "It speeds up the database", "It buffers the work so workers can catch up at their own pace"], answer: 3,
        explain: `The queue grows during the spike and drains afterwards. This "load levelling" protects downstream systems from being overwhelmed.` },
      { q: `What is a dead-letter queue for?`, options: ["Deleting old messages", "Holding messages that keep failing, so they can be inspected", "Sending email to deleted users", "Speeding up delivery"], answer: 1,
        explain: `After a message fails a set number of retries it's moved aside, so one bad message can't block the queue or retry for ever. A person can look at it later.` },
    ],
  },
  {
    id: "qz_sd_url_shortener", title: "Designing a URL Shortener", icon: "🔗", track: "system-design",
    questions: [
      { q: `A URL shortener gets far more...`, options: ["Writes than reads", "Deletes than reads", "Reads (redirects) than writes (new links)", "Equal reads and writes"], answer: 2,
        explain: `A link is created once and clicked many times, so it's read-heavy, often 100 to 1 or more. That points us towards caching and read replicas.` },
      { q: `How many different 7-character codes can you make from a–z, A–Z and 0–9 (base 62)?`, options: ["About 3.5 trillion", "About 7 million", "About 62 thousand", "About 434"], answer: 0,
        explain: `62 to the power 7 is about 3.5 × 10¹². Plenty of room: even a billion links uses a tiny fraction.` },
      { q: `Which HTTP status suits a short link that should always forward to the long URL, while still letting you count clicks?`, options: ["200 OK", "404 Not Found", "500 Server Error", "302 Found (a temporary redirect)"], answer: 3,
        explain: `A redirect (3xx) tells the browser to go to the <code>Location</code> header. 301 (permanent) lets browsers cache it, so later clicks skip your server; 302 means every click comes through you, which is what analytics needs.` },
      { q: `Why convert a unique numeric ID to base 62 to make the code?`, options: ["It encrypts the URL", "Every ID gives a different, short code, so there are no collisions", "Base 62 is faster for databases", "It makes codes random"], answer: 1,
        explain: `Each ID is unique, so each code is unique: no need to check for clashes. The downside is codes are guessable in sequence, which you can soften by shuffling IDs.` },
      { q: `What's the best first step to make redirects fast under heavy load?`, options: ["Use a bigger font", "Store URLs in a text file", "Cache popular code-to-URL lookups in memory (e.g. Redis)", "Remove the database"], answer: 2,
        explain: `A small fraction of links get most of the clicks. Caching those means most redirects never touch the database.` },
    ],
  },
  {
    id: "qz_sd_rate_limiting", title: "Rate Limiting", icon: "🚦", track: "system-design",
    questions: [
      { q: `Which HTTP status code means "too many requests"?`, options: ["429", "403", "503", "301"], answer: 0,
        explain: `429 Too Many Requests, ideally with a <code>Retry-After</code> header saying when the client may try again.` },
      { q: `How does a <strong>token bucket</strong> limiter work?`, options: ["Each user gets one request per day", "Requests wait in a line and leave at a fixed speed", "Tokens refill at a steady rate; each request spends one, and with none left the request is refused", "It blocks users at random"], answer: 2,
        explain: `The bucket's size allows short bursts, while the refill rate sets the long-term average. It's simple and very widely used.` },
      { q: `What's the weakness of a <strong>fixed window</strong> counter (e.g. 100 per minute, reset on the minute)?`, options: ["It uses too much memory", "It can't count", "It only works for one user", "A burst at the end of one window plus the start of the next can allow double the limit"], answer: 3,
        explain: `100 requests at 12:00:59 and 100 more at 12:01:00 are both allowed: 200 in two seconds. Sliding windows smooth this out.` },
      { q: `With ten app servers, where should the rate-limit counters live?`, options: ["In each server's own memory", "In a shared fast store such as Redis", "In the user's browser", "In a log file"], answer: 1,
        explain: `If each server counted separately, a user could get ten times the limit by being spread across servers. A shared store gives one true count.` },
      { q: `Which is <strong>not</strong> a good reason to rate limit?`, options: ["To make the site faster for a single user", "To stop one client using up all the capacity", "To slow down password-guessing attacks", "To control costs of expensive operations"], answer: 0,
        explain: `Rate limiting protects fairness, security and cost. It doesn't make anything faster for the person being limited.` },
    ],
  },
  {
    id: "qz_sd_consistency", title: "Consistency, Replication & CAP", icon: "🔄", track: "system-design",
    questions: [
      { q: `What is replication?`, options: ["Splitting data across servers so each has a different part", "Deleting old data", "Keeping copies of the same data on several servers", "Compressing a database"], answer: 2,
        explain: `Replicas are copies. They give you redundancy (survive a failure) and more read capacity. Splitting data into parts is <em>sharding</em>, a different idea.` },
      { q: `With asynchronous replication, you write to the leader and immediately read from a follower. You might...`, options: ["Get an error every time", "See the old value, because the follower hasn't caught up", "Corrupt the database", "Read someone else's data"], answer: 1,
        explain: `This is <strong>replication lag</strong>. The follower will catch up shortly (eventual consistency), but for a moment it's stale.` },
      { q: `In the CAP theorem, during a network partition a system must choose between...`, options: ["Consistency and availability", "Speed and cost", "SQL and NoSQL", "Caching and queuing"], answer: 0,
        explain: `If nodes can't talk to each other, you either refuse some requests (stay consistent) or answer with possibly stale data (stay available). Partitions can't be wished away, so that's the real choice.` },
      { q: `Which system should favour <strong>consistency</strong> over availability?`, options: ["A social media like counter", "A news feed", "A video view count", "Bank account balances"], answer: 3,
        explain: `Showing a wrong balance or allowing a double spend is far worse than briefly saying "try again". A like count being a few seconds behind harms no one.` },
      { q: `What does <strong>eventual consistency</strong> promise?`, options: ["Every read is always up to date", "Data is never lost", "If writes stop, all replicas will end up with the same value", "The system is never down"], answer: 2,
        explain: `Replicas may disagree for a short while, but they converge. It's the trade many large systems make to stay fast and available.` },
    ],
  },
];

globalThis.SD_LESSONS = [
  // ───────────────────────────── 1. CLIENTS & SERVERS ─────────────────────────────
  {
    id: "sd_client_server", title: "Clients, Servers and HTTP", icon: "🌐", level: "beginner", minutes: 6, quiz: "qz_sd_client_server",
    html: `<p>Almost every system you'll ever design starts with the same simple conversation: something <strong>asks</strong>, and something else <strong>answers</strong>. The asker is the <em>client</em>; the answerer is the <em>server</em>. Understanding that conversation is the foundation for everything else in System Design.</p>

<h3>The client–server model</h3>
<p>A <strong>client</strong> is any program that makes a request: your web browser, a phone app, or a Python script using <code>requests</code>. A <strong>server</strong> is a program, running on a computer somewhere, that listens for requests and sends back responses. One server usually handles thousands of clients, and the client always speaks first.</p>
<pre>  Browser / app                      Server
  +-----------+   1. request    +-------------+     +----------+
  |  client   | --------------&gt; | web / API   | --&gt; | database |
  |           | &lt;-------------- |   server    | &lt;-- |          |
  +-----------+   2. response   +-------------+     +----------+</pre>
<p>Notice the client never talks to the database directly. The server sits in the middle, checking who you are, applying the business rules, and deciding what you're allowed to see.</p>

<h3>Finding the server: DNS and IP addresses</h3>
<p>Computers find each other by <strong>IP address</strong> (like <code>93.184.215.14</code>), but people prefer names like <code>example.com</code>. <strong>DNS</strong> (the Domain Name System) is the internet's phone book: your computer asks a DNS server "what's the address for example.com?", gets an IP back, and then connects to it. DNS answers are cached for a while, which is why changes to a domain can take time to spread.</p>

<h3>HTTP: the language of the web</h3>
<p>Clients and servers on the web talk using <strong>HTTP</strong> (or HTTPS, the encrypted version). An HTTP request has:</p>
<ul>
<li>a <strong>method</strong>, which says what you want to do,</li>
<li>a <strong>path</strong>, such as <code>/users/42</code>,</li>
<li><strong>headers</strong>: extra information like the content type or a login token,</li>
<li>an optional <strong>body</strong>, usually JSON, carrying data you're sending.</li>
</ul>
<p>The common methods are:</p>
<table>
<tr><th>Method</th><th>Used to</th><th>Example</th></tr>
<tr><td>GET</td><td>read data</td><td><code>GET /books/7</code></td></tr>
<tr><td>POST</td><td>create something</td><td><code>POST /books</code></td></tr>
<tr><td>PUT / PATCH</td><td>replace / partly update</td><td><code>PATCH /books/7</code></td></tr>
<tr><td>DELETE</td><td>remove</td><td><code>DELETE /books/7</code></td></tr>
</table>
<p>The response comes back with a <strong>status code</strong>, headers and usually a body. Status codes are grouped by their first digit:</p>
<ul>
<li><strong>2xx</strong> success (200 OK, 201 Created)</li>
<li><strong>3xx</strong> redirect, "look over there" (301, 302)</li>
<li><strong>4xx</strong> the client got something wrong (400 Bad Request, 401 Unauthorised, 404 Not Found, 429 Too Many Requests)</li>
<li><strong>5xx</strong> the server failed (500 Internal Server Error, 503 Service Unavailable)</li>
</ul>

<h3>APIs</h3>
<p>An <strong>API</strong> (Application Programming Interface) is the menu of requests a server accepts. A <strong>REST</strong> API organises things around <em>resources</em> (nouns, like books or users) and uses the HTTP methods as the verbs. Here's what a client might do with a book API, written in Python:</p>
<pre><code># snippet: needs the requests library and a real server
import requests

r = requests.get("https://api.example.com/books/7")
if r.status_code == 200:
    book = r.json()
    print(book["title"])
elif r.status_code == 404:
    print("No such book")</code></pre>
<p>Good APIs are predictable: plural nouns for collections, consistent status codes, and clear error messages. They're also <strong>versioned</strong> (e.g. <code>/v1/books</code>) so you can improve them without breaking existing clients.</p>

<h3>Stateless servers</h3>
<p>HTTP is <strong>stateless</strong>: each request stands on its own, and the server doesn't rely on remembering the previous one. If you're logged in, your client sends a token (or cookie) with <em>every</em> request. This sounds wasteful, but it's a superpower for scaling: since no server holds anything special about you, <em>any</em> server can answer <em>any</em> request. You'll see why that matters in the load balancing lesson.</p>

<h3>Latency: why distance matters</h3>
<p>Each request takes time to travel. Within one data centre a round trip is under a millisecond; across the Atlantic it's around 70–100 ms. Reading from memory is far faster than reading from disk, which is far faster than a network trip. A lot of System Design is about avoiding slow trips, which is exactly what caching is for.</p>

<h3>Key takeaways</h3>
<ul>
<li>Clients send requests; servers send responses. The client always starts.</li>
<li>DNS turns names into IP addresses.</li>
<li>HTTP requests have a method, path, headers and body; responses have a status code.</li>
<li>2xx success, 3xx redirect, 4xx client error, 5xx server error.</li>
<li>Stateless servers make it easy to run many copies side by side.</li>
</ul>`,
  },

  // ───────────────────────────── 2. DATABASES ─────────────────────────────
  {
    id: "sd_databases", title: "Databases: SQL, NoSQL and Indexes", icon: "🗄️", level: "beginner", minutes: 7, quiz: "qz_sd_databases",
    html: `<p>Servers come and go, but data must survive. The <strong>database</strong> is where your system keeps its long-term memory, and choosing and using it well is one of the biggest decisions in any design.</p>

<h3>Relational (SQL) databases</h3>
<p>A relational database, such as PostgreSQL, MySQL or SQLite, stores data in <strong>tables</strong> with a fixed <strong>schema</strong>: every row in <code>users</code> has the same columns. Tables relate to each other through keys:</p>
<pre>  users                         orders
  +----+-------+               +----+---------+-------+
  | id | name  |               | id | user_id | total |
  +----+-------+               +----+---------+-------+
  |  1 | Ann   | &lt;------------ | 10 |    1    | 25.00 |
  |  2 | Bo    | &lt;------------ | 11 |    2    |  9.50 |
  +----+-------+   foreign key +----+---------+-------+</pre>
<p>You ask questions in SQL, joining tables as needed:</p>
<pre><code>SELECT u.name, SUM(o.total) AS spent
FROM users AS u
JOIN orders AS o ON o.user_id = u.id
GROUP BY u.name;</code></pre>
<p>Relational databases support <strong>transactions</strong> with <strong>ACID</strong> guarantees:</p>
<ul>
<li><strong>Atomicity</strong>: a transaction happens completely or not at all.</li>
<li><strong>Consistency</strong>: rules (like "balance can't go negative") are never broken.</li>
<li><strong>Isolation</strong>: transactions running at the same time don't trip over each other.</li>
<li><strong>Durability</strong>: once committed, data survives a crash.</li>
</ul>
<p>Think of a bank transfer: take £50 from Ann, give £50 to Bo. If the server crashes in the middle, atomicity makes sure money doesn't simply vanish.</p>

<h3>NoSQL databases</h3>
<p>"NoSQL" is a loose label for databases that aren't relational. The main families are:</p>
<table>
<tr><th>Type</th><th>Examples</th><th>Good for</th></tr>
<tr><td>Key-value</td><td>Redis, DynamoDB</td><td>very fast lookup by one key (sessions, caches)</td></tr>
<tr><td>Document</td><td>MongoDB</td><td>flexible JSON-like records (product catalogues)</td></tr>
<tr><td>Wide-column</td><td>Cassandra</td><td>huge volumes of writes (event logs, metrics)</td></tr>
<tr><td>Graph</td><td>Neo4j</td><td>relationships (friends of friends)</td></tr>
</table>
<p>Many NoSQL systems were built to <strong>scale out</strong> across lots of machines easily. The trade-off is usually weaker support for joins and transactions, and sometimes weaker consistency.</p>

<h3>How to choose</h3>
<p>A sensible default for most applications is a relational database: it's flexible, well understood and handles far more traffic than most projects ever see. Reach for NoSQL when you have a clear reason:</p>
<ul>
<li>your access pattern is simple (always "get by key") and the scale is huge,</li>
<li>your data has no fixed shape,</li>
<li>you need enormous write throughput.</li>
</ul>
<p>Plenty of real systems use both: SQL for orders and accounts, Redis for sessions and caching.</p>

<h3>Indexes: the biggest easy win</h3>
<p>Without an index, finding <code>WHERE email = 'ann@example.com'</code> means checking every row: a <strong>full table scan</strong>, O(n). With an index on <code>email</code>, the database keeps a sorted structure (usually a <strong>B-tree</strong>) that jumps straight to the right row in O(log n), much like the index at the back of a book.</p>
<pre><code>CREATE INDEX idx_users_email ON users (email);</code></pre>
<p>You can think of an index as binary search, built in. You've seen the same idea in Python:</p>
<pre><code>import bisect

emails = sorted(["cy@x.com", "ann@x.com", "bo@x.com"])
i = bisect.bisect_left(emails, "bo@x.com")
print(i, emails[i])   # 1 bo@x.com</code></pre>
<p>Indexes aren't free. Every insert, update and delete must also update each index, and they take disk space. Index the columns you <strong>filter, join or sort on often</strong>, and leave the rest alone. Primary keys are indexed automatically.</p>

<h3>Scaling a database (a preview)</h3>
<p>When one database gets busy, the usual steps are, in order: add indexes and fix slow queries; add a <strong>cache</strong>; add <strong>read replicas</strong> (copies that serve reads); and finally <strong>shard</strong> (split the data across several databases, e.g. users A–M on one, N–Z on another). Each step adds complexity, so don't jump to sharding first.</p>

<h3>Key takeaways</h3>
<ul>
<li>Relational databases give you schemas, joins and ACID transactions: a great default.</li>
<li>NoSQL families (key-value, document, wide-column, graph) trade features for scale or flexibility.</li>
<li>An index turns a full scan into a quick lookup, at the cost of slower writes and extra space.</li>
<li>Scale step by step: indexes, cache, replicas, then sharding.</li>
</ul>`,
  },

  // ───────────────────────────── 3. CACHING ─────────────────────────────
  {
    id: "sd_caching", title: "Caching", icon: "⚡", level: "beginner", minutes: 6, quiz: "qz_sd_caching",
    html: `<p>A <strong>cache</strong> is a small, fast store that keeps copies of data you're likely to need again, so you don't have to fetch or compute it the slow way each time. Caching is probably the single most effective trick for making systems faster.</p>

<h3>Why it works</h3>
<p>Two facts make caching powerful. First, memory is dramatically faster than disks and networks: reading from RAM takes around 100 nanoseconds, while a database query over the network might take several milliseconds, tens of thousands of times longer. Second, access is uneven: a small number of items (the home page, a viral post, today's prices) get most of the requests. Keep those few in memory and most requests become fast.</p>

<h3>Where caches live</h3>
<pre>  browser cache -&gt; CDN -&gt; load balancer -&gt; app server -&gt; Redis -&gt; database
   (your device)  (near you)              (in-process)  (shared)</pre>
<ul>
<li><strong>Browser cache</strong>: images, CSS and scripts saved on your device.</li>
<li><strong>CDN</strong> (Content Delivery Network): servers around the world holding copies of static files close to users.</li>
<li><strong>Application cache</strong>: a shared in-memory store such as Redis or Memcached, sitting in front of the database.</li>
<li><strong>Database cache</strong>: the database keeps hot data in memory too.</li>
</ul>

<h3>The cache-aside pattern</h3>
<p>The most common approach. The application checks the cache first; on a <strong>hit</strong> it returns straight away; on a <strong>miss</strong> it reads from the database and saves the result in the cache for next time.</p>
<pre><code>import time

cache = {}          # stands in for Redis
TTL = 60            # seconds

def slow_db_lookup(user_id):
    time.sleep(0.1)                 # pretend this is a slow query
    return {"id": user_id, "name": "User " + str(user_id)}

def get_user(user_id):
    entry = cache.get(user_id)
    if entry and entry["expires"] &gt; time.time():
        return entry["value"]                       # hit
    value = slow_db_lookup(user_id)                 # miss
    cache[user_id] = {"value": value, "expires": time.time() + TTL}
    return value

print(get_user(1))   # slow the first time
print(get_user(1))   # fast: served from the cache</code></pre>
<p>Other patterns exist. <strong>Write-through</strong> writes to the cache and database together, keeping them in step. <strong>Write-back</strong> writes to the cache and saves to the database later, which is fast but risks losing data in a crash.</p>

<h3>Keeping it fresh: invalidation</h3>
<p>The hard part of caching is that cached copies can go <strong>stale</strong>. If a user changes their name, the cache may still hold the old one. Two common tools:</p>
<ul>
<li><strong>TTL (time to live)</strong>: every item expires after, say, 60 seconds. Simple, and puts a limit on how stale things can get.</li>
<li><strong>Explicit invalidation</strong>: when you update the database, delete the matching cache key so the next read fetches the new value.</li>
</ul>
<p>There's an old joke that the two hardest problems in computing are cache invalidation, naming things, and off-by-one errors.</p>

<h3>When the cache is full: eviction</h3>
<p>Memory is limited, so caches must throw things out. The usual policy is <strong>LRU</strong> (least recently used): remove whatever hasn't been touched for longest. Python even has one built in, <code>functools.lru_cache</code>, which you may have met when memoising Fibonacci.</p>

<h3>What to cache (and what not to)</h3>
<p>Great candidates are read often, change rarely, and are expensive to produce: product pages, user profiles, rendered HTML, results of heavy queries. Poor candidates must always be exactly right (bank balances, stock levels at checkout) or are rarely read twice.</p>
<p>Watch out for a <strong>thundering herd</strong>: when a very popular item expires, thousands of requests miss at once and all hit the database together. Fixes include letting just one request refill the cache while the others wait, or adding a little randomness to TTLs.</p>

<h3>Key takeaways</h3>
<ul>
<li>Caches keep hot data in fast memory; most requests then skip the slow database.</li>
<li>Cache-aside: check the cache, fall back to the database, fill the cache.</li>
<li>TTLs and invalidation stop data going too stale.</li>
<li>LRU eviction removes the least recently used items when space runs out.</li>
<li>Cache data that is read often and changes rarely; be careful with data that must be exact.</li>
</ul>`,
  },

  // ───────────────────────────── 4. LOAD BALANCING ─────────────────────────────
  {
    id: "sd_load_balancing", title: "Load Balancing and Horizontal Scaling", icon: "⚖️", level: "beginner", minutes: 6, quiz: "qz_sd_load_balancing",
    html: `<p>One server can only do so much. When more people turn up than it can serve, requests slow down and then start failing. This lesson is about how systems grow to handle more traffic, and the component that makes it possible: the <strong>load balancer</strong>.</p>

<h3>Scaling up vs scaling out</h3>
<p>There are two ways to add capacity:</p>
<ul>
<li><strong>Vertical scaling (scale up)</strong>: buy a bigger machine with more CPU and RAM. Easy, as nothing in your code changes, but there's a ceiling, big machines get expensive fast, and it's still one machine: if it dies, you're down.</li>
<li><strong>Horizontal scaling (scale out)</strong>: run several ordinary machines side by side and share the work. There's no hard ceiling, and losing one machine is no disaster. The catch is you now need something to share out the work.</li>
</ul>

<h3>The load balancer</h3>
<p>A load balancer sits in front of a pool of identical servers. Clients only ever talk to the balancer, which passes each request on to one of the servers.</p>
<pre>                         +-----------+
                    +--&gt; | server A  | --+
  clients --&gt; [ load |   +-----------+   |
              balancer]-&gt;| server B  | --+--&gt; database
                    |    +-----------+   |
                    +--&gt; | server C  | --+
                         +-----------+</pre>
<p>It also runs <strong>health checks</strong>: every few seconds it asks each server "are you OK?" (for example, a request to <code>/health</code>). If server B stops answering, the balancer simply stops sending it traffic. Users never notice. When B recovers, or you add server D, it joins the pool.</p>

<h3>How does it choose a server?</h3>
<table>
<tr><th>Strategy</th><th>How it works</th><th>Good when</th></tr>
<tr><td>Round robin</td><td>A, B, C, A, B, C...</td><td>servers and requests are similar</td></tr>
<tr><td>Least connections</td><td>pick the server with fewest active requests</td><td>some requests take much longer</td></tr>
<tr><td>Weighted</td><td>bigger servers get a bigger share</td><td>servers are different sizes</td></tr>
<tr><td>Hash-based</td><td>hash the user or IP to pick a server</td><td>the same user should land on the same server</td></tr>
</table>
<p>Round robin is easy to picture in Python:</p>
<pre><code>from itertools import cycle

servers = cycle(["A", "B", "C"])
for request in range(5):
    print("request", request, "-&gt; server", next(servers))</code></pre>

<h3>Keep app servers stateless</h3>
<p>Horizontal scaling works best when any server can handle any request. That means servers shouldn't keep important data in their own memory. If server A stores your shopping basket in a Python dictionary, and your next request goes to server B, your basket has vanished.</p>
<p>The fix is to move <strong>state</strong> out of the app servers into shared stores: the database, or Redis for sessions and baskets. Then servers become interchangeable "cattle, not pets": you can add five more for a sale and remove them afterwards. Some balancers offer <em>sticky sessions</em> (always sending a user to the same server), but it's a workaround with downsides: uneven load, and lost sessions when a server dies.</p>

<h3>Autoscaling</h3>
<p>In the cloud you can let the system scale itself: "if average CPU is above 70% for five minutes, add a server; if below 30%, remove one". This keeps you fast during busy periods and cheap during quiet ones.</p>

<h3>Watch for single points of failure</h3>
<p>Ten app servers don't help if they all depend on one load balancer and one database. Any component that would take everything down when it fails is a <strong>single point of failure</strong>. Real systems run load balancers in pairs, replicate databases, and spread servers across several data centres (availability zones). The database is often the hardest part to scale, which is why caching and replicas matter so much.</p>

<h3>Key takeaways</h3>
<ul>
<li>Vertical scaling = bigger machine; horizontal scaling = more machines.</li>
<li>A load balancer spreads requests across servers and routes round failed ones via health checks.</li>
<li>Round robin, least connections, weighted and hash-based are the common strategies.</li>
<li>Stateless app servers (state kept in a shared store) make scaling out easy.</li>
<li>Hunt down single points of failure and add redundancy.</li>
</ul>`,
  },

  // ───────────────────────────── 5. QUEUES ─────────────────────────────
  {
    id: "sd_queues", title: "Queues and Asynchronous Work", icon: "📬", level: "beginner", minutes: 6, quiz: "qz_sd_queues",
    html: `<p>Not everything has to happen while the user waits. When you upload a video, the site says "Processing..." and lets you carry on: the slow encoding happens in the background. The tool that makes this possible is the <strong>message queue</strong>.</p>

<h3>Synchronous vs asynchronous</h3>
<p>In a <strong>synchronous</strong> design, the server does every step before replying. If sign-up means "save user, send welcome email, resize avatar, update analytics", the user waits for all of it, and if the email service is down, sign-up fails too.</p>
<p>In an <strong>asynchronous</strong> design, the server does only the essential step (save the user), drops a message on a queue saying "new user 42 signed up", and replies at once. Separate <strong>workers</strong> pick up that message and do the rest.</p>
<pre>  web server            queue                    workers
  +---------+  put  +---------------+  take  +-------------+
  | sign-up | ----&gt; | msg | msg | msg| -----&gt; | email       |
  +---------+       +---------------+        | avatar      |
   (replies fast)     (holds the work)       | analytics   |
                                             +-------------+</pre>

<h3>Producers, consumers and messages</h3>
<ul>
<li><strong>Producers</strong> put messages on the queue.</li>
<li>The <strong>queue</strong> (also called a broker, e.g. RabbitMQ, Amazon SQS, Kafka) stores them safely until they're handled.</li>
<li><strong>Consumers</strong> (workers) take messages off and do the work, then <strong>acknowledge</strong> them so the queue can delete them.</li>
</ul>
<p>Producers and consumers don't need to know about each other, or even be running at the same time. That <strong>decoupling</strong> is a big part of the appeal. Here's the idea in plain Python, using a queue and a background thread:</p>
<pre><code>import queue
import threading

jobs = queue.Queue()

def worker():
    while True:
        email = jobs.get()
        if email is None:          # a signal to stop
            break
        print("sending welcome email to", email)
        jobs.task_done()

t = threading.Thread(target=worker)
t.start()
for address in ["ann@x.com", "bo@x.com"]:
    jobs.put(address)              # the "web server" returns immediately
jobs.join()                        # wait until both are handled
jobs.put(None)
t.join()</code></pre>

<h3>Why queues help</h3>
<ul>
<li><strong>Faster responses</strong>: users don't wait for slow work.</li>
<li><strong>Load levelling</strong>: during a spike the queue just gets longer, and workers catch up afterwards, instead of the database being flattened.</li>
<li><strong>Resilience</strong>: if the email service is down, messages wait in the queue and are retried later. Nothing is lost.</li>
<li><strong>Independent scaling</strong>: queue getting long? Add more workers without touching the web servers.</li>
</ul>

<h3>Things that go wrong</h3>
<p><strong>Duplicates.</strong> Most queues promise <em>at-least-once</em> delivery. If a worker sends the email and then crashes before acknowledging, the message is delivered again. So workers should be <strong>idempotent</strong>: doing the job twice has the same effect as once. For example, record "welcome email sent to user 42" and check it first.</p>
<p><strong>Poison messages.</strong> A message that always makes the worker crash would be retried for ever. After a few attempts it's moved to a <strong>dead-letter queue</strong> for a human to inspect.</p>
<p><strong>Ordering.</strong> With many workers, messages may finish out of order. If order matters (e.g. "create account" before "update account"), you need a queue that preserves order per key.</p>
<p><strong>Visibility.</strong> Async work is invisible to the user, so you need monitoring: queue length, how old the oldest message is, and failure rates.</p>

<h3>When to use a queue</h3>
<p>Use one for work that is slow (video encoding, reports), unreliable (third-party APIs), or doesn't need to finish before the reply (emails, notifications, analytics). Don't use one when the user needs the result right now, like checking a password.</p>

<h3>Key takeaways</h3>
<ul>
<li>Queues let the server reply fast and hand slow work to background workers.</li>
<li>Producers add messages; consumers process and acknowledge them.</li>
<li>Queues absorb spikes and survive outages of downstream services.</li>
<li>Expect duplicates: make workers idempotent; use a dead-letter queue for repeat failures.</li>
</ul>`,
  },

  // ───────────────────────────── 6. URL SHORTENER ─────────────────────────────
  {
    id: "sd_url_shortener", title: "Designing a URL Shortener", icon: "🔗", level: "intermediate", minutes: 8, quiz: "qz_sd_url_shortener",
    html: `<p>Time to put the pieces together. A URL shortener (like bit.ly) turns a long link into something like <code>sho.rt/aZ3kP9q</code>. It's the classic first System Design interview question because it's small enough to finish yet touches APIs, databases, caching and scaling. We'll follow the same steps you'd use for any design.</p>

<h3>Step 1: Requirements</h3>
<p><strong>Functional</strong> (what it does):</p>
<ul>
<li>Given a long URL, create a short code.</li>
<li>Visiting the short URL redirects to the long one.</li>
<li>Optional: custom codes, expiry dates, click counts.</li>
</ul>
<p><strong>Non-functional</strong> (how well it does it):</p>
<ul>
<li>Redirects must be fast (a few milliseconds) and highly available: broken links are very visible.</li>
<li>Codes should be short and not easy to guess one after another.</li>
</ul>

<h3>Step 2: Estimate the scale</h3>
<p>Assume 100 million new links a month and 100 clicks per link, so a <strong>read-heavy</strong> 100:1 ratio.</p>
<ul>
<li>Writes: 100 million / (30 × 24 × 3600) ≈ <strong>40 per second</strong>.</li>
<li>Reads: about <strong>4,000 per second</strong>, with peaks several times higher.</li>
<li>Storage: about 500 bytes per link × 100 million × 12 months × 5 years ≈ <strong>3 TB</strong>.</li>
</ul>
<p>These rough numbers tell us what matters: reads dominate, so caching is key; storage is modest.</p>

<h3>Step 3: The API</h3>
<table>
<tr><th>Request</th><th>Response</th></tr>
<tr><td><code>POST /api/links</code> with body <code>{"url": "https://..."}</code></td><td><code>201 Created</code>, <code>{"code": "aZ3kP9q"}</code></td></tr>
<tr><td><code>GET /aZ3kP9q</code></td><td><code>302 Found</code> with header <code>Location: https://...</code></td></tr>
</table>
<p>Why 302 rather than 301? A <strong>301</strong> (permanent) lets browsers remember the redirect and skip our server next time, which saves load but hides clicks. A <strong>302</strong> sends every click through us, so we can count them.</p>

<h3>Step 4: Data model</h3>
<pre><code>CREATE TABLE links (
  id          BIGINT PRIMARY KEY,
  code        VARCHAR(10) UNIQUE NOT NULL,
  long_url    TEXT NOT NULL,
  created_at  TIMESTAMP NOT NULL,
  expires_at  TIMESTAMP
);</code></pre>
<p>The lookup is always "find by code", and the <code>UNIQUE</code> constraint gives us an index on <code>code</code> for free. A relational database is fine here; a key-value store would also suit this simple access pattern.</p>

<h3>Step 5: Generating codes</h3>
<p>Using the characters a–z, A–Z and 0–9 gives 62 symbols. Seven characters give 62⁷ ≈ 3.5 trillion codes, which is plenty. A neat approach is to take each link's unique numeric ID and write it in <strong>base 62</strong>. Unique IDs give unique codes, so there are no collisions to check for:</p>
<pre><code>ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def encode(n):
    if n == 0:
        return ALPHABET[0]
    code = ""
    while n &gt; 0:
        n, rem = divmod(n, 62)
        code = ALPHABET[rem] + code
    return code

def decode(code):
    n = 0
    for ch in code:
        n = n * 62 + ALPHABET.index(ch)
    return n

print(encode(125))                    # 21
print(decode(encode(987654321)))      # 987654321</code></pre>
<p>Sequential IDs make codes guessable, though. Alternatives are random codes (check the database for a clash and retry), or shuffling IDs before encoding. With several app servers, each can grab a <strong>block</strong> of IDs (say 1,000 at a time) from a central counter so they never hand out the same one.</p>

<h3>Step 6: The architecture</h3>
<pre>                         +--------------+
  users --&gt; [ load ] ---&gt; | app servers  | --&gt; [ Redis cache ]
            [balancer]    |  (stateless) |          | miss
                          +--------------+          v
                                 |            +-----------+
                                 +----------&gt; | database  |
                                  new links   | + replicas|
                                              +-----------+</pre>
<ul>
<li><strong>Stateless app servers</strong> behind a load balancer, so we can add more for peaks.</li>
<li><strong>Cache</strong> code-to-URL lookups in Redis. A small share of links get most clicks, so the hit rate is high and most redirects never touch the database.</li>
<li><strong>Read replicas</strong> take the remaining read load; writes (only about 40 a second) go to the primary.</li>
<li><strong>Click counting</strong> goes on a <strong>queue</strong>: the redirect fires off a "clicked" message and returns immediately, and workers update the statistics.</li>
<li>If the data eventually outgrows one database, <strong>shard</strong> by code.</li>
</ul>

<h3>Step 7: Extras</h3>
<p>Add rate limiting on link creation (to stop spammers), check new URLs against a list of known malicious sites, and use a background job to delete expired links.</p>

<h3>Key takeaways</h3>
<ul>
<li>Start with requirements and rough numbers; they reveal that this system is read-heavy.</li>
<li>Keep the API tiny: create a link, follow a link (302 so clicks can be counted).</li>
<li>Base 62 encoding of unique IDs gives short codes without collisions.</li>
<li>Cache hot links, use replicas for reads, and push analytics onto a queue.</li>
</ul>`,
  },

  // ───────────────────────────── 7. RATE LIMITING ─────────────────────────────
  {
    id: "sd_rate_limiting", title: "Rate Limiting", icon: "🚦", level: "intermediate", minutes: 6, quiz: "qz_sd_rate_limiting",
    html: `<p>A <strong>rate limiter</strong> controls how many requests a client can make in a given time, for example "100 requests per minute per user". Excess requests are refused, usually with HTTP status <strong>429 Too Many Requests</strong>.</p>

<h3>Why limit?</h3>
<ul>
<li><strong>Fairness</strong>: one runaway script shouldn't use up capacity everyone else needs.</li>
<li><strong>Security</strong>: slow down password guessing and scraping.</li>
<li><strong>Cost</strong>: some operations (sending SMS, calling a paid API, running AI models) cost real money per call.</li>
<li><strong>Stability</strong>: protect databases and downstream services from overload.</li>
</ul>
<p>You decide <em>who</em> to limit by choosing a key: user ID, API key, or IP address (for visitors who aren't logged in). Limits can differ per endpoint: logins might allow 5 a minute, while reading the home page allows hundreds.</p>

<h3>Algorithm 1: Fixed window counter</h3>
<p>Count requests in each calendar minute and reset the counter when the minute changes. It's very simple, but has an edge problem: 100 requests at 12:00:59 plus 100 at 12:01:00 are all allowed, giving 200 in two seconds.</p>

<h3>Algorithm 2: Sliding window</h3>
<p>Look back over the <em>last</em> 60 seconds from now, rather than the calendar minute. The exact version keeps a timestamp for each request and counts those within the window. It's accurate but uses more memory. A cheaper approximation blends the current and previous window counts.</p>

<h3>Algorithm 3: Token bucket</h3>
<p>The most popular approach. Picture a bucket holding up to <em>capacity</em> tokens, topped up at a steady <em>rate</em>. Each request takes one token; if the bucket is empty, the request is refused.</p>
<pre>   refill: 1 token / second
          |
          v
     +---------+
     | o o o o |  capacity 5
     | o       |
     +----+----+
          |  each request takes 1 token
          v
     allowed (or 429 if empty)</pre>
<p>The capacity allows short bursts (handy for a page that fires several requests at once), while the refill rate sets the long-term average. It needs only two numbers per client: tokens left and when it was last refilled.</p>
<pre><code>import time

class TokenBucket:
    def __init__(self, capacity, refill_per_sec):
        self.capacity = capacity
        self.rate = refill_per_sec
        self.tokens = capacity
        self.last = time.monotonic()

    def allow(self):
        now = time.monotonic()
        elapsed = now - self.last
        self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)
        self.last = now
        if self.tokens &gt;= 1:
            self.tokens -= 1
            return True
        return False

bucket = TokenBucket(capacity=3, refill_per_sec=1)
print([bucket.allow() for _ in range(5)])   # [True, True, True, False, False]</code></pre>
<p>A close cousin, the <strong>leaky bucket</strong>, queues requests and lets them out at a fixed rate: it smooths traffic rather than allowing bursts.</p>

<h3>Rate limiting across many servers</h3>
<p>If each of ten app servers kept its own counters, a user spread across them could get ten times their limit. So counters usually live in a <strong>shared fast store</strong> like Redis, which has atomic operations (such as "increment and set expiry") so two servers can't both read 99 and both allow request 100. Many teams put the limiter in an <strong>API gateway</strong> in front of all services, so it's enforced in one place.</p>
<pre>  client --&gt; [ API gateway + limiter ] --&gt; services
                      |
                   [ Redis ]  (shared counters)</pre>

<h3>Being a good citizen</h3>
<p>Tell clients what's happening. Return <code>429</code> with a <code>Retry-After</code> header, and many APIs also send headers showing the limit and how many requests remain. On the client side, when you're limited, wait and retry with <strong>exponential backoff</strong> (1 s, 2 s, 4 s...) plus a little randomness, rather than hammering the server.</p>
<p>Also decide what happens if Redis itself is down: <em>fail open</em> (allow everything, keeping the site up) or <em>fail closed</em> (block everything, staying safe). Most sites fail open for normal traffic but closed for sensitive actions like logins.</p>

<h3>Key takeaways</h3>
<ul>
<li>Rate limiting protects fairness, security, cost and stability; refused requests get 429.</li>
<li>Fixed windows are simple but allow bursts at the edges; sliding windows fix that.</li>
<li>Token bucket: capacity allows bursts, refill rate sets the average. It's the usual choice.</li>
<li>With many servers, keep counters in a shared store like Redis, often at an API gateway.</li>
</ul>`,
  },

  // ───────────────────────────── 8. CONSISTENCY & CAP ─────────────────────────────
  {
    id: "sd_consistency", title: "Consistency, Replication and CAP", icon: "🔄", level: "intermediate", minutes: 7, quiz: "qz_sd_consistency",
    html: `<p>As soon as you keep data on more than one machine, a tricky question appears: what if the copies disagree? This lesson gently introduces replication, consistency and the famous <strong>CAP theorem</strong>.</p>

<h3>Why replicate?</h3>
<p><strong>Replication</strong> means keeping copies of the same data on several servers (replicas). It gives you:</p>
<ul>
<li><strong>Durability and availability</strong>: if one machine dies, another has the data.</li>
<li><strong>Read capacity</strong>: spread reads across many copies.</li>
<li><strong>Lower latency</strong>: put a copy near users in each region.</li>
</ul>
<p>Don't confuse this with <strong>sharding</strong>, which splits data so each server holds a <em>different</em> part. Real systems often do both: each shard is itself replicated.</p>

<h3>Leader and followers</h3>
<p>The most common set-up has one <strong>leader</strong> (primary) that accepts all writes, and several <strong>followers</strong> (replicas) that copy its changes and serve reads.</p>
<pre>             writes
  app ----------------&gt; [ leader ]
   |                     |      |
   |  reads              | copy | copy
   |                     v      v
   +---------------&gt; [follower] [follower]</pre>
<p>Copying can be:</p>
<ul>
<li><strong>Synchronous</strong>: the leader waits until followers confirm before telling the client "saved". Safe, but slower, and a slow follower holds everything up.</li>
<li><strong>Asynchronous</strong>: the leader replies straight away and followers catch up a moment later. Fast, but followers can briefly be behind. This is <strong>replication lag</strong>.</li>
</ul>

<h3>What consistency means here</h3>
<p>Picture this: you change your profile name, the write goes to the leader, then your page reloads and reads from a follower that hasn't caught up. You see your <em>old</em> name and assume the save failed. That's a consistency problem.</p>
<ul>
<li><strong>Strong consistency</strong>: every read sees the latest write. It behaves as if there were only one copy.</li>
<li><strong>Eventual consistency</strong>: replicas may disagree for a while, but if writes stop, they all converge to the same value.</li>
<li><strong>Read-your-own-writes</strong>: a practical middle ground: you always see <em>your own</em> changes (e.g. by reading from the leader for a few seconds after you write), even if others see them a little later.</li>
</ul>

<h3>The CAP theorem</h3>
<p>CAP names three properties of a distributed data store:</p>
<ul>
<li><strong>C</strong>onsistency: every read gets the most recent write (or an error).</li>
<li><strong>A</strong>vailability: every request gets a non-error response.</li>
<li><strong>P</strong>artition tolerance: the system keeps working when the network between nodes breaks.</li>
</ul>
<p>It's often summarised as "pick two of three", but that's misleading. Networks <em>do</em> fail, so partition tolerance isn't optional. The real message is: <strong>when a partition happens, you must choose between consistency and availability.</strong></p>
<pre>   [ node 1 ]  -- X  network cut  X --  [ node 2 ]
   a write lands here                   a read arrives here

   CP choice: node 2 refuses ("can't confirm, try later")
   AP choice: node 2 answers with possibly old data</pre>
<p><strong>CP systems</strong> refuse some requests to avoid giving wrong answers. Good for bank balances, stock at checkout and booking the last seat. <strong>AP systems</strong> keep answering and sort out differences afterwards. Good for like counts, news feeds and shopping-basket contents, where being slightly stale for a moment is fine.</p>
<p>When there's <em>no</em> partition, there's still a trade-off between consistency and <strong>latency</strong>: waiting for replicas to agree takes time. (This extension is called PACELC, if you want to read further.)</p>

<h3>Choosing in practice</h3>
<p>Ask of each piece of data: "What's the harm if a user sees a slightly old value?" If the answer is "money lost" or "double-booked seat", favour consistency. If it's "a like count is off by two for a second", favour availability and speed. One system can make different choices for different data.</p>

<h3>Key takeaways</h3>
<ul>
<li>Replication keeps copies for safety and read capacity; sharding splits data into parts.</li>
<li>Asynchronous replication is fast but causes replication lag (stale reads).</li>
<li>Strong consistency: always latest. Eventual consistency: copies converge over time.</li>
<li>CAP: during a network partition, choose consistency (refuse) or availability (answer, maybe stale).</li>
<li>Decide per kind of data, based on the harm of a stale read.</li>
</ul>`,
  },
];
