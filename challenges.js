// PyMarker challenge bank.
// type "stdout"   — program reads input() lines and prints; output compared line by line.
// type "function" — learner defines `func`; each test calls it with `args`.
// type "script"   — each test runs `code` after the learner's code; last line's value is compared.
// Tests marked hidden: true are graded but their inputs aren't shown.

const table = (n) => Array.from({ length: 10 }, (_, i) => `${n} x ${i + 1} = ${n * (i + 1)}`).join("\n");

globalThis.CHALLENGES = [
  // ───────────────────────────── BEGINNER ─────────────────────────────
  {
    id: "hello", level: "beginner", title: "Hello, World!", type: "stdout",
    description: `<p>Every programmer starts here. Write a program that prints exactly:</p>
<pre>Hello, World!</pre>`,
    starter: `# Print the message below\n`,
    tests: [{ input: [], expected: "Hello, World!" }],
    hints: [
      "Python's <code>print()</code> function shows text on the screen.",
      "Text (a <em>string</em>) must be wrapped in quotes: <code>\"like this\"</code>.",
      "Check capitals, the comma and the exclamation mark — the marker compares exactly.",
    ],
    solution: `print("Hello, World!")\n`,
  },
  {
    id: "greet", level: "beginner", title: "Personal Greeting", type: "stdout",
    description: `<p>Ask for the user's name with <code>input()</code>, then print <code>Hello, &lt;name&gt;!</code></p>
<p>Example — if the input is <code>Ada</code>, print:</p><pre>Hello, Ada!</pre>
<p class="note">Prompts like <code>input("Name? ")</code> are fine — the marker ignores them.</p>`,
    starter: `name = input("What is your name? ")\n# print the greeting\n`,
    tests: [
      { input: ["Ada"], expected: "Hello, Ada!" },
      { input: ["Isaac"], expected: "Hello, Isaac!" },
      { input: ["Grace Hopper"], expected: "Hello, Grace Hopper!", hidden: true },
    ],
    hints: [
      "You already have the name stored in the variable <code>name</code>.",
      "You can join strings with <code>+</code>, or use an f-string: <code>f\"Hello, {name}!\"</code>.",
      "Watch the spacing: <code>\"Hello, \" + name + \"!\"</code>.",
    ],
    solution: `name = input("What is your name? ")\nprint(f"Hello, {name}!")\n`,
  },
  {
    id: "add", level: "beginner", title: "Add Two Numbers", type: "stdout",
    description: `<p>Read two whole numbers (one per line) and print their sum.</p>
<p>Input <code>3</code> then <code>4</code> → print <code>7</code></p>`,
    starter: `a = input()\nb = input()\n`,
    tests: [
      { input: ["3", "4"], expected: "7" },
      { input: ["-10", "25"], expected: "15" },
      { input: ["0", "0"], expected: "0", hidden: true },
      { input: ["1000000", "2345"], expected: "1002345", hidden: true },
    ],
    hints: [
      "<code>input()</code> always gives you a <em>string</em>. <code>\"3\" + \"4\"</code> is <code>\"34\"</code>!",
      "Convert a string to a whole number with <code>int()</code>.",
      "<code>a = int(input())</code> then <code>print(a + b)</code>.",
    ],
    solution: `a = int(input())\nb = int(input())\nprint(a + b)\n`,
  },
  {
    id: "even_odd", level: "beginner", topic: "if", title: "Even or Odd", type: "stdout",
    description: `<p>Read a whole number and print <code>Even</code> if it's even, otherwise <code>Odd</code>.</p>`,
    starter: `n = int(input())\n`,
    tests: [
      { input: ["4"], expected: "Even" },
      { input: ["7"], expected: "Odd" },
      { input: ["0"], expected: "Even", hidden: true },
      { input: ["-3"], expected: "Odd", hidden: true },
    ],
    hints: [
      "The modulo operator <code>%</code> gives the remainder after division.",
      "A number is even when <code>n % 2 == 0</code>.",
      "Use <code>if ... :</code> / <code>else:</code> and indent the <code>print</code> lines.",
    ],
    solution: `n = int(input())\nif n % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")\n`,
  },
  {
    id: "times_table", level: "beginner", title: "Times Table", type: "stdout",
    description: `<p>Read a number <code>n</code> and print its times table from 1 to 10, in this format:</p>
<pre>3 x 1 = 3
3 x 2 = 6
...
3 x 10 = 30</pre>`,
    starter: `n = int(input())\n`,
    tests: [
      { input: ["3"], expected: table(3) },
      { input: ["7"], expected: table(7) },
      { input: ["12"], expected: table(12), hidden: true },
    ],
    hints: [
      "A <code>for</code> loop repeats code. <code>range(1, 11)</code> gives 1 up to 10.",
      "Inside the loop, <code>i</code> changes each time: <code>for i in range(1, 11):</code>",
      "Use an f-string: <code>print(f\"{n} x {i} = {n * i}\")</code>.",
    ],
    solution: `n = int(input())\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n * i}")\n`,
  },
  {
    id: "largest", level: "beginner", topic: "if", title: "Largest of Three", type: "function", func: "largest",
    description: `<p>Write a function <code>largest(a, b, c)</code> that <strong>returns</strong> the biggest of three numbers.</p>
<pre>largest(1, 2, 3)   → 3
largest(10, 5, 7)  → 10</pre>
<p class="note">Try it with <code>if</code> statements first, then compare with <code>max()</code>.</p>`,
    starter: `def largest(a, b, c):\n    # return the biggest number\n    pass\n`,
    tests: [
      { args: [1, 2, 3], expected: 3 },
      { args: [10, 5, 7], expected: 10 },
      { args: [-1, -5, -3], expected: -1 },
      { args: [4, 4, 2], expected: 4, hidden: true },
      { args: [0, 9, 9], expected: 9, hidden: true },
    ],
    hints: [
      "<code>return</code> sends a value back from a function — <code>print</code> doesn't count!",
      "Check <code>if a >= b and a >= c:</code> first, then <code>elif b >= c:</code>.",
      "Or simply: <code>return max(a, b, c)</code>.",
    ],
    solution: `def largest(a, b, c):\n    if a >= b and a >= c:\n        return a\n    elif b >= c:\n        return b\n    return c\n`,
  },
  {
    id: "c_to_f", level: "beginner", title: "Celsius to Fahrenheit", type: "function", func: "c_to_f",
    description: `<p>Write <code>c_to_f(c)</code> that converts Celsius to Fahrenheit using <code>F = C × 9/5 + 32</code>.</p>
<pre>c_to_f(0)   → 32
c_to_f(100) → 212</pre>`,
    starter: `def c_to_f(c):\n    pass\n`,
    tests: [
      { args: [0], expected: 32 },
      { args: [100], expected: 212 },
      { args: [-40], expected: -40 },
      { args: [37], expected: 98.6, hidden: true },
      { args: [21.5], expected: 70.7, hidden: true },
    ],
    hints: [
      "Multiplication is <code>*</code> and division is <code>/</code> in Python.",
      "Write the formula exactly: <code>c * 9 / 5 + 32</code>.",
      "Remember to <code>return</code> the result.",
    ],
    solution: `def c_to_f(c):\n    return c * 9 / 5 + 32\n`,
  },
  {
    id: "grade", level: "beginner", topic: "if", title: "Exam Grade", type: "function", func: "grade",
    description: `<p>Write <code>grade(score)</code> that turns a percentage into a grade:</p>
<table class="mini"><tr><th>Score</th><th>Grade</th></tr>
<tr><td>90+</td><td>A*</td></tr><tr><td>80–89</td><td>A</td></tr><tr><td>70–79</td><td>B</td></tr>
<tr><td>60–69</td><td>C</td></tr><tr><td>50–59</td><td>D</td></tr><tr><td>40–49</td><td>E</td></tr><tr><td>below 40</td><td>U</td></tr></table>`,
    starter: `def grade(score):\n    pass\n`,
    tests: [
      { args: [95], expected: "A*" }, { args: [85], expected: "A" }, { args: [72], expected: "B" },
      { args: [65], expected: "C" }, { args: [50], expected: "D" }, { args: [44], expected: "E" },
      { args: [12], expected: "U" },
      { args: [90], expected: "A*", hidden: true }, { args: [80], expected: "A", hidden: true },
      { args: [39], expected: "U", hidden: true }, { args: [100], expected: "A*", hidden: true },
    ],
    hints: [
      "Use a chain of <code>if</code> / <code>elif</code> / <code>else</code>.",
      "Check the <em>highest</em> boundary first: <code>if score >= 90: return \"A*\"</code>.",
      "Boundaries are inclusive — 80 is an A, so use <code>&gt;=</code>, not <code>&gt;</code>.",
    ],
    solution: `def grade(score):\n    if score >= 90:\n        return "A*"\n    elif score >= 80:\n        return "A"\n    elif score >= 70:\n        return "B"\n    elif score >= 60:\n        return "C"\n    elif score >= 50:\n        return "D"\n    elif score >= 40:\n        return "E"\n    return "U"\n`,
  },
  {
    id: "count_vowels", level: "beginner", title: "Count the Vowels", type: "function", func: "count_vowels",
    description: `<p>Write <code>count_vowels(text)</code> that returns how many vowels (a, e, i, o, u — upper or lower case) are in the text.</p>
<pre>count_vowels("hello")  → 2
count_vowels("PYTHON") → 1</pre>`,
    starter: `def count_vowels(text):\n    pass\n`,
    tests: [
      { args: ["hello"], expected: 2 }, { args: ["PYTHON"], expected: 1 },
      { args: ["rhythm"], expected: 0 }, { args: ["Aeiou"], expected: 5 },
      { args: [""], expected: 0, hidden: true }, { args: ["The quick brown fox"], expected: 5, hidden: true },
    ],
    hints: [
      "Loop over a string one character at a time: <code>for ch in text:</code>",
      "<code>ch.lower() in \"aeiou\"</code> is True when <code>ch</code> is a vowel.",
      "Start a counter at 0 and add 1 each time you find a vowel, then return it.",
    ],
    solution: `def count_vowels(text):\n    count = 0\n    for ch in text:\n        if ch.lower() in "aeiou":\n            count += 1\n    return count\n`,
  },
  {
    id: "reverse_string", level: "beginner", title: "Reverse a String", type: "function", func: "reverse_string",
    description: `<p>Write <code>reverse_string(s)</code> that returns the string backwards.</p>
<pre>reverse_string("hello") → "olleh"</pre>`,
    starter: `def reverse_string(s):\n    pass\n`,
    tests: [
      { args: ["hello"], expected: "olleh" }, { args: ["Python"], expected: "nohtyP" }, { args: [""], expected: "" },
      { args: ["racecar"], expected: "racecar", hidden: true }, { args: ["a b c"], expected: "c b a", hidden: true },
    ],
    hints: [
      "You could build a new string by looping and adding each character to the <em>front</em>.",
      "Slicing takes a start, stop and <em>step</em>: <code>s[start:stop:step]</code>.",
      "A step of -1 walks backwards: <code>s[::-1]</code>.",
    ],
    solution: `def reverse_string(s):\n    return s[::-1]\n`,
  },
  {
    id: "total", level: "beginner", title: "Sum a List", type: "function", func: "total",
    description: `<p>Write <code>total(nums)</code> that returns the sum of a list of numbers <strong>without</strong> using the built-in <code>sum()</code>.</p>
<pre>total([1, 2, 3]) → 6
total([])        → 0</pre>`,
    starter: `def total(nums):\n    pass\n`,
    tests: [
      { args: [[1, 2, 3]], expected: 6 }, { args: [[]], expected: 0 }, { args: [[-5, 5, 10]], expected: 10 },
      { args: [[100]], expected: 100, hidden: true }, { args: [[1.5, 2.5]], expected: 4.0, hidden: true },
    ],
    hints: [
      "Make a variable to keep a running total, starting at 0.",
      "Loop through the list: <code>for n in nums:</code>",
      "Add each number on: <code>running += n</code>, then return it after the loop.",
    ],
    solution: `def total(nums):\n    running = 0\n    for n in nums:\n        running += n\n    return running\n`,
  },
  {
    id: "fizzbuzz", level: "beginner", topic: "if", title: "FizzBuzz", type: "function", func: "fizzbuzz",
    description: `<p>Write <code>fizzbuzz(n)</code> that returns a <strong>list of strings</strong> for the numbers 1 to n, where:</p>
<ul><li>multiples of 3 become <code>"Fizz"</code></li><li>multiples of 5 become <code>"Buzz"</code></li>
<li>multiples of both become <code>"FizzBuzz"</code></li><li>everything else is the number as a string</li></ul>
<pre>fizzbuzz(5) → ["1", "2", "Fizz", "4", "Buzz"]</pre>`,
    starter: `def fizzbuzz(n):\n    result = []\n    # fill the list\n    return result\n`,
    tests: [
      { args: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] },
      { args: [15], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] },
      { args: [1], expected: ["1"], hidden: true }, { args: [0], expected: [], hidden: true },
    ],
    hints: [
      "Loop with <code>for i in range(1, n + 1):</code> and <code>result.append(...)</code> each time.",
      "Check the <em>FizzBuzz</em> case (divisible by 15) <strong>first</strong> — otherwise Fizz catches it.",
      "For plain numbers, convert with <code>str(i)</code>.",
    ],
    solution: `def fizzbuzz(n):\n    result = []\n    for i in range(1, n + 1):\n        if i % 15 == 0:\n            result.append("FizzBuzz")\n        elif i % 3 == 0:\n            result.append("Fizz")\n        elif i % 5 == 0:\n            result.append("Buzz")\n        else:\n            result.append(str(i))\n    return result\n`,
  },

  // ─────────────────────────── INTERMEDIATE ───────────────────────────
  {
    id: "palindrome", level: "intermediate", title: "Palindrome Checker", type: "function", func: "is_palindrome",
    description: `<p>Write <code>is_palindrome(text)</code> that returns <code>True</code> if the text reads the same forwards and backwards, <strong>ignoring case, spaces and punctuation</strong>.</p>
<pre>is_palindrome("racecar")                        → True
is_palindrome("A man, a plan, a canal: Panama") → True
is_palindrome("hello")                          → False</pre>`,
    starter: `def is_palindrome(text):\n    pass\n`,
    tests: [
      { args: ["racecar"], expected: true }, { args: ["hello"], expected: false },
      { args: ["A man, a plan, a canal: Panama"], expected: true },
      { args: ["No 'x' in Nixon"], expected: true, hidden: true }, { args: [""], expected: true, hidden: true },
      { args: ["ab"], expected: false, hidden: true },
    ],
    hints: [
      "First clean the text: keep only letters/digits, all lower case.",
      "<code>ch.isalnum()</code> tells you if a character is a letter or digit. Try <code>\"\".join(...)</code>.",
      "Once cleaned, compare it with its reverse: <code>cleaned == cleaned[::-1]</code>.",
    ],
    solution: `def is_palindrome(text):\n    cleaned = "".join(ch.lower() for ch in text if ch.isalnum())\n    return cleaned == cleaned[::-1]\n`,
  },
  {
    id: "word_count", level: "intermediate", title: "Word Frequency", type: "function", func: "word_count",
    description: `<p>Write <code>word_count(text)</code> that returns a <strong>dictionary</strong> mapping each word (lower case) to how many times it appears. Strip the punctuation <code>. , ! ? ; :</code> from the ends of words.</p>
<pre>word_count("the cat the hat")    → {"the": 2, "cat": 1, "hat": 1}
word_count("Hello hello HELLO!") → {"hello": 3}</pre>`,
    starter: `def word_count(text):\n    counts = {}\n    return counts\n`,
    tests: [
      { args: ["the cat the hat"], expected: { the: 2, cat: 1, hat: 1 } },
      { args: ["Hello hello HELLO!"], expected: { hello: 3 } },
      { args: [""], expected: {} },
      { args: ["Yes, no. Yes!"], expected: { yes: 2, no: 1 }, hidden: true },
    ],
    hints: [
      "<code>text.split()</code> breaks text into a list of words on whitespace.",
      "<code>word.strip(\".,!?;:\").lower()</code> cleans a single word.",
      "Count with <code>counts[w] = counts.get(w, 0) + 1</code>.",
    ],
    solution: `def word_count(text):\n    counts = {}\n    for word in text.split():\n        w = word.strip(".,!?;:").lower()\n        if w:\n            counts[w] = counts.get(w, 0) + 1\n    return counts\n`,
  },
  {
    id: "unique", level: "intermediate", title: "Remove Duplicates", type: "function", func: "unique",
    description: `<p>Write <code>unique(items)</code> that returns a new list with duplicates removed, <strong>keeping the original order</strong> of first appearance.</p>
<pre>unique([1, 2, 2, 3, 1]) → [1, 2, 3]</pre>`,
    starter: `def unique(items):\n    pass\n`,
    tests: [
      { args: [[1, 2, 2, 3, 1]], expected: [1, 2, 3] }, { args: [["b", "a", "b"]], expected: ["b", "a"] },
      { args: [[]], expected: [] }, { args: [[5, 5, 5, 5]], expected: [5], hidden: true },
      { args: [[3, 1, 2, 1, 3, 4]], expected: [3, 1, 2, 4], hidden: true },
    ],
    hints: [
      "<code>list(set(items))</code> removes duplicates but <em>loses the order</em> — so avoid it.",
      "Keep a <code>seen</code> set and a <code>result</code> list.",
      "For each item: if it's not in <code>seen</code>, add it to both.",
    ],
    solution: `def unique(items):\n    seen = set()\n    result = []\n    for item in items:\n        if item not in seen:\n            seen.add(item)\n            result.append(item)\n    return result\n`,
  },
  {
    id: "is_prime", level: "intermediate", title: "Prime Checker", type: "function", func: "is_prime",
    description: `<p>Write <code>is_prime(n)</code> that returns <code>True</code> if <code>n</code> is a prime number.</p>
<p>A prime is a whole number greater than 1 whose only divisors are 1 and itself.</p>
<pre>is_prime(17) → True
is_prime(18) → False
is_prime(1)  → False</pre>
<p class="note">⚠ One hidden test uses a very large prime — a slow solution will time out.</p>`,
    starter: `def is_prime(n):\n    pass\n`,
    tests: [
      { args: [2], expected: true }, { args: [1], expected: false }, { args: [17], expected: true }, { args: [18], expected: false },
      { args: [0], expected: false, hidden: true }, { args: [-7], expected: false, hidden: true },
      { args: [97], expected: true, hidden: true }, { args: [7919], expected: true, hidden: true },
      { args: [1000000007], expected: true, hidden: true },
    ],
    hints: [
      "Anything less than 2 is not prime. Then try dividing by every number from 2 upwards.",
      "If <code>n % d == 0</code> for some divisor <code>d</code>, it's not prime.",
      "You only need to check up to the square root: <code>while d * d &lt;= n:</code>.",
    ],
    solution: `def is_prime(n):\n    if n < 2:\n        return False\n    d = 2\n    while d * d <= n:\n        if n % d == 0:\n            return False\n        d += 1\n    return True\n`,
  },
  {
    id: "factorial", level: "intermediate", title: "Recursive Factorial", type: "function", func: "factorial",
    description: `<p>Write <code>factorial(n)</code> that returns <code>n!</code> (n × (n-1) × … × 1). Try to do it with <strong>recursion</strong> — a function that calls itself.</p>
<pre>factorial(5) → 120
factorial(0) → 1</pre>`,
    starter: `def factorial(n):\n    pass\n`,
    tests: [
      { args: [0], expected: 1 }, { args: [1], expected: 1 }, { args: [5], expected: 120 },
      { args: [10], expected: 3628800, hidden: true }, { args: [15], expected: 1307674368000, hidden: true },
    ],
    hints: [
      "Every recursive function needs a <em>base case</em> where it stops. Here: <code>if n == 0: return 1</code>.",
      "The recursive step: n! is n multiplied by (n-1)!.",
      "<code>return n * factorial(n - 1)</code>",
    ],
    solution: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n`,
  },
  {
    id: "fib", level: "intermediate", title: "Fibonacci", type: "function", func: "fib",
    description: `<p>Write <code>fib(n)</code> that returns the n-th Fibonacci number, where <code>fib(0) = 0</code>, <code>fib(1) = 1</code> and each one after is the sum of the previous two.</p>
<pre>0, 1, 1, 2, 3, 5, 8, 13, ...
fib(10) → 55</pre>
<p class="note">⚠ A hidden test asks for <code>fib(50)</code>. The obvious recursive version is far too slow!</p>`,
    starter: `def fib(n):\n    pass\n`,
    tests: [
      { args: [0], expected: 0 }, { args: [1], expected: 1 }, { args: [2], expected: 1 }, { args: [10], expected: 55 },
      { args: [30], expected: 832040, hidden: true }, { args: [50], expected: 12586269025, hidden: true },
    ],
    hints: [
      "Recursion like <code>fib(n-1) + fib(n-2)</code> recalculates the same values billions of times.",
      "Use a loop that keeps just the last two numbers: <code>a, b = 0, 1</code>.",
      "Each step: <code>a, b = b, a + b</code>. After n steps, <code>a</code> is the answer.",
    ],
    solution: `def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n`,
  },
  {
    id: "anagrams", level: "intermediate", title: "Anagram Detector", type: "function", func: "are_anagrams",
    description: `<p>Write <code>are_anagrams(a, b)</code> that returns <code>True</code> if the two strings use exactly the same letters, ignoring case and spaces.</p>
<pre>are_anagrams("listen", "silent")        → True
are_anagrams("Dormitory", "Dirty room") → True</pre>`,
    starter: `def are_anagrams(a, b):\n    pass\n`,
    tests: [
      { args: ["listen", "silent"], expected: true }, { args: ["hello", "world"], expected: false },
      { args: ["Dormitory", "Dirty room"], expected: true },
      { args: ["aab", "abb"], expected: false, hidden: true }, { args: ["", ""], expected: true, hidden: true },
    ],
    hints: [
      "Normalise both strings: lower case and remove spaces with <code>.replace(\" \", \"\")</code>.",
      "Two anagrams contain the same letters — so what happens if you <em>sort</em> them?",
      "<code>sorted(a) == sorted(b)</code> after cleaning.",
    ],
    solution: `def are_anagrams(a, b):\n    clean = lambda s: sorted(s.lower().replace(" ", ""))\n    return clean(a) == clean(b)\n`,
  },
  {
    id: "caesar", level: "intermediate", title: "Caesar Cipher", type: "function", func: "caesar",
    description: `<p>Write <code>caesar(text, shift)</code> that shifts every letter along the alphabet by <code>shift</code> places, wrapping round from z to a. Keep upper/lower case; leave other characters alone. Negative shifts go backwards.</p>
<pre>caesar("abc", 1)            → "bcd"
caesar("xyz", 3)            → "abc"
caesar("Hello, World!", 5)  → "Mjqqt, Btwqi!"</pre>`,
    starter: `def caesar(text, shift):\n    pass\n`,
    tests: [
      { args: ["abc", 1], expected: "bcd" }, { args: ["xyz", 3], expected: "abc" },
      { args: ["Hello, World!", 5], expected: "Mjqqt, Btwqi!" },
      { args: ["Mjqqt, Btwqi!", -5], expected: "Hello, World!", hidden: true },
      { args: ["Python", 26], expected: "Python", hidden: true },
    ],
    hints: [
      "<code>ord(\"a\")</code> gives 97 and <code>chr(97)</code> gives \"a\" — letters are numbers underneath.",
      "Work out the letter's position 0–25: <code>ord(ch) - ord(\"a\")</code>, add the shift, then <code>% 26</code> to wrap.",
      "Use <code>\"A\"</code> as the base for capitals (<code>ch.isupper()</code>), and keep non-letters as they are.",
    ],
    solution: `def caesar(text, shift):\n    out = []\n    for ch in text:\n        if ch.isalpha():\n            base = ord("A") if ch.isupper() else ord("a")\n            out.append(chr((ord(ch) - base + shift) % 26 + base))\n        else:\n            out.append(ch)\n    return "".join(out)\n`,
  },
  {
    id: "second_largest", level: "intermediate", title: "Second Largest", type: "function", func: "second_largest",
    description: `<p>Write <code>second_largest(nums)</code> that returns the second-largest <strong>distinct</strong> value, or <code>None</code> if there isn't one.</p>
<pre>second_largest([1, 2, 3, 4]) → 3
second_largest([5, 5, 4])    → 4
second_largest([7])          → None</pre>`,
    starter: `def second_largest(nums):\n    pass\n`,
    tests: [
      { args: [[1, 2, 3, 4]], expected: 3 }, { args: [[5, 5, 4]], expected: 4 },
      { args: [[7]], expected: null }, { args: [[3, 3, 3]], expected: null },
      { args: [[-1, -2, -3]], expected: -2, hidden: true }, { args: [[10, 9, 10, 8]], expected: 9, hidden: true },
      { args: [[]], expected: null, hidden: true },
    ],
    hints: [
      "Duplicates don't count — <code>set(nums)</code> removes them.",
      "If there are fewer than 2 distinct values, <code>return None</code>.",
      "Sort the distinct values and take the second from the end: <code>sorted(set(nums))[-2]</code>.",
    ],
    solution: `def second_largest(nums):\n    distinct = sorted(set(nums))\n    if len(distinct) < 2:\n        return None\n    return distinct[-2]\n`,
  },
  {
    id: "rle", level: "intermediate", title: "Run-Length Encoding", type: "function", func: "rle",
    description: `<p>Write <code>rle(s)</code> that compresses a string by replacing runs of the same character with the character followed by the run length.</p>
<pre>rle("aaabcc") → "a3b1c2"
rle("")       → ""</pre>`,
    starter: `def rle(s):\n    pass\n`,
    tests: [
      { args: ["aaabcc"], expected: "a3b1c2" }, { args: [""], expected: "" }, { args: ["a"], expected: "a1" },
      { args: ["aaaaaaaaaaaa"], expected: "a12", hidden: true }, { args: ["abab"], expected: "a1b1a1b1", hidden: true },
    ],
    hints: [
      "Track the current character and how many times you've seen it in a row.",
      "When the character changes, write out the previous run and start a new count.",
      "Don't forget to write out the <em>last</em> run after the loop ends.",
    ],
    solution: `def rle(s):\n    if not s:\n        return ""\n    out = []\n    current, count = s[0], 1\n    for ch in s[1:]:\n        if ch == current:\n            count += 1\n        else:\n            out.append(f"{current}{count}")\n            current, count = ch, 1\n    out.append(f"{current}{count}")\n    return "".join(out)\n`,
  },
  {
    id: "flatten", level: "intermediate", title: "Flatten a Nested List", type: "function", func: "flatten",
    description: `<p>Write <code>flatten(nested)</code> that takes a list which may contain lists (nested to any depth) and returns one flat list.</p>
<pre>flatten([1, [2, 3], [4, [5, 6]]]) → [1, 2, 3, 4, 5, 6]</pre>`,
    starter: `def flatten(nested):\n    pass\n`,
    tests: [
      { args: [[1, [2, 3], [4, [5, 6]]]], expected: [1, 2, 3, 4, 5, 6] }, { args: [[]], expected: [] },
      { args: [[[[[1]]]]], expected: [1] }, { args: [[1, 2, 3]], expected: [1, 2, 3], hidden: true },
      { args: [[["a", ["b"]], "c"]], expected: ["a", "b", "c"], hidden: true },
    ],
    hints: [
      "<code>isinstance(x, list)</code> tells you whether an item is itself a list.",
      "If it's a list, you need to flatten <em>that</em> too — sounds like recursion!",
      "<code>result.extend(flatten(item))</code> for lists, <code>result.append(item)</code> otherwise.",
    ],
    solution: `def flatten(nested):\n    result = []\n    for item in nested:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result\n`,
  },
  {
    id: "bank_account", level: "intermediate", title: "Bank Account Class", type: "script",
    description: `<p>Create a class <code>BankAccount</code>:</p>
<ul><li><code>BankAccount(balance=0)</code> — starting balance (defaults to 0)</li>
<li><code>.balance</code> — attribute holding the current balance</li>
<li><code>.deposit(amount)</code> — adds money; raise <code>ValueError</code> if amount ≤ 0</li>
<li><code>.withdraw(amount)</code> — removes money; raise <code>ValueError</code> if there isn't enough (and leave the balance unchanged)</li></ul>
<pre>acc = BankAccount(100)
acc.deposit(50)
acc.balance   → 150</pre>`,
    starter: `class BankAccount:\n    def __init__(self, balance=0):\n        pass\n`,
    tests: [
      { code: "a = BankAccount()\na.balance", expected: 0 },
      { code: "a = BankAccount(100)\na.deposit(50)\na.balance", expected: 150 },
      { code: "a = BankAccount(100)\na.withdraw(30)\na.balance", expected: 70 },
      { code: "a = BankAccount(10)\ntry:\n    a.withdraw(50)\n    r = 'no error'\nexcept ValueError:\n    r = 'ValueError'\nr", expected: "ValueError" },
      { code: "a = BankAccount(10)\ntry:\n    a.withdraw(50)\nexcept ValueError:\n    pass\na.balance", expected: 10, hidden: true },
      { code: "a = BankAccount()\ntry:\n    a.deposit(-5)\n    r = 'no error'\nexcept ValueError:\n    r = 'ValueError'\nr", expected: "ValueError", hidden: true },
      { code: "a = BankAccount(5)\na.deposit(5)\na.withdraw(10)\na.balance", expected: 0, hidden: true },
    ],
    hints: [
      "In <code>__init__</code>, store the starting value: <code>self.balance = balance</code>.",
      "Methods take <code>self</code> first: <code>def deposit(self, amount):</code>",
      "Raise errors with <code>raise ValueError(\"Insufficient funds\")</code> <em>before</em> changing the balance.",
    ],
    solution: `class BankAccount:\n    def __init__(self, balance=0):\n        self.balance = balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("Deposit must be positive")\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            raise ValueError("Insufficient funds")\n        self.balance -= amount\n`,
  },

  // ───────────────────────────── ADVANCED ─────────────────────────────
  {
    id: "balanced", level: "advanced", title: "Balanced Brackets", type: "function", func: "is_balanced",
    description: `<p>Write <code>is_balanced(s)</code> that returns <code>True</code> if every bracket <code>() [] {}</code> is closed in the correct order. Ignore any other characters.</p>
<pre>is_balanced("([]{})") → True
is_balanced("(]")     → False
is_balanced("((")     → False</pre>`,
    starter: `def is_balanced(s):\n    pass\n`,
    tests: [
      { args: ["()"], expected: true }, { args: ["([]{})"], expected: true },
      { args: ["(]"], expected: false }, { args: ["(("], expected: false },
      { args: [""], expected: true, hidden: true }, { args: ["{[()()]}"], expected: true, hidden: true },
      { args: ["())("], expected: false, hidden: true }, { args: ["a(b)c"], expected: true, hidden: true },
      { args: ["([)]"], expected: false, hidden: true },
    ],
    hints: [
      "Use a <em>stack</em> (a list with <code>.append</code> and <code>.pop</code>).",
      "Push opening brackets. On a closing bracket, the top of the stack must be its matching opener.",
      "Map closers to openers: <code>pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}</code>. At the end the stack must be empty.",
    ],
    solution: `def is_balanced(s):\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for ch in s:\n        if ch in "([{":\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return not stack\n`,
  },
  {
    id: "roman", level: "advanced", title: "Roman Numerals", type: "function", func: "to_roman",
    description: `<p>Write <code>to_roman(n)</code> that converts a number from 1 to 3999 into Roman numerals.</p>
<pre>to_roman(4)    → "IV"
to_roman(58)   → "LVIII"
to_roman(1994) → "MCMXCIV"</pre>`,
    starter: `def to_roman(n):\n    pass\n`,
    tests: [
      { args: [3], expected: "III" }, { args: [4], expected: "IV" }, { args: [9], expected: "IX" },
      { args: [58], expected: "LVIII" }, { args: [1994], expected: "MCMXCIV" },
      { args: [3999], expected: "MMMCMXCIX", hidden: true }, { args: [40], expected: "XL", hidden: true },
      { args: [444], expected: "CDXLIV", hidden: true },
    ],
    hints: [
      "Treat the 'subtractive' pairs (CM, CD, XC, XL, IX, IV) as symbols in their own right.",
      "Make a list from largest to smallest: <code>[(1000, \"M\"), (900, \"CM\"), (500, \"D\"), ...]</code>.",
      "For each pair, while <code>n &gt;= value</code>: add the symbol and subtract the value.",
    ],
    solution: `def to_roman(n):\n    table = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC"),\n             (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]\n    out = ""\n    for value, symbol in table:\n        while n >= value:\n            out += symbol\n            n -= value\n    return out\n`,
  },
  {
    id: "binary_search", level: "advanced", title: "Binary Search", type: "function", func: "binary_search",
    description: `<p>Write <code>binary_search(nums, target)</code> that returns the index of <code>target</code> in the <strong>sorted</strong> list <code>nums</code>, or <code>-1</code> if it isn't there. Don't use <code>.index()</code> or <code>in</code> — halve the search range each step.</p>
<pre>binary_search([1, 3, 5, 7, 9], 7) → 3
binary_search([1, 3, 5, 7, 9], 4) → -1</pre>`,
    starter: `def binary_search(nums, target):\n    low, high = 0, len(nums) - 1\n`,
    tests: [
      { args: [[1, 3, 5, 7, 9], 7], expected: 3 }, { args: [[1, 3, 5, 7, 9], 4], expected: -1 },
      { args: [[], 1], expected: -1 }, { args: [[2], 2], expected: 0, hidden: true },
      { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1], expected: 0, hidden: true },
      { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10], expected: 9, hidden: true },
      { args: [[-8, -3, 0, 4, 11], 11], expected: 4, hidden: true },
    ],
    hints: [
      "Keep two pointers, <code>low</code> and <code>high</code>, and loop <code>while low &lt;= high</code>.",
      "Look at the middle: <code>mid = (low + high) // 2</code>.",
      "If <code>nums[mid] &lt; target</code> move <code>low = mid + 1</code>; if bigger, <code>high = mid - 1</code>; if equal, return <code>mid</code>.",
    ],
    solution: `def binary_search(nums, target):\n    low, high = 0, len(nums) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n`,
  },
  {
    id: "merge_intervals", level: "advanced", title: "Merge Intervals", type: "function", func: "merge_intervals",
    description: `<p>Write <code>merge_intervals(intervals)</code> that merges any overlapping <code>[start, end]</code> intervals and returns them sorted by start. Touching intervals (like <code>[1,4]</code> and <code>[4,5]</code>) count as overlapping.</p>
<pre>merge_intervals([[1,3],[2,6],[8,10],[15,18]]) → [[1,6],[8,10],[15,18]]</pre>`,
    starter: `def merge_intervals(intervals):\n    pass\n`,
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] }, { args: [[]], expected: [] },
      { args: [[[5, 6], [1, 2]]], expected: [[1, 2], [5, 6]], hidden: true },
      { args: [[[1, 10], [2, 3], [4, 5]]], expected: [[1, 10]], hidden: true },
    ],
    hints: [
      "Sort the intervals by their start first: <code>sorted(intervals)</code>.",
      "Walk through them; compare each with the <em>last</em> interval in your result.",
      "If <code>start &lt;= last_end</code>, extend: <code>last[1] = max(last[1], end)</code>. Otherwise append a new one.",
    ],
    solution: `def merge_intervals(intervals):\n    merged = []\n    for start, end in sorted(intervals):\n        if merged and start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged\n`,
  },
  {
    id: "longest_unique", level: "advanced", title: "Longest Unique Substring", type: "function", func: "longest_unique",
    description: `<p>Write <code>longest_unique(s)</code> that returns the <strong>length</strong> of the longest substring with no repeated characters.</p>
<pre>longest_unique("abcabcbb") → 3   ("abc")
longest_unique("bbbbb")    → 1
longest_unique("pwwkew")   → 3   ("wke")</pre>`,
    starter: `def longest_unique(s):\n    pass\n`,
    tests: [
      { args: ["abcabcbb"], expected: 3 }, { args: ["bbbbb"], expected: 1 }, { args: ["pwwkew"], expected: 3 },
      { args: [""], expected: 0 }, { args: ["dvdf"], expected: 3, hidden: true },
      { args: ["abcdef"], expected: 6, hidden: true }, { args: ["abba"], expected: 2, hidden: true },
    ],
    hints: [
      "Use a 'sliding window': a <code>start</code> index and the current index <code>i</code>.",
      "Remember where you last saw each character in a dictionary.",
      "If <code>ch</code> was last seen at or after <code>start</code>, move <code>start</code> to one past that position. Track the best <code>i - start + 1</code>.",
    ],
    solution: `def longest_unique(s):\n    last_seen = {}\n    start = best = 0\n    for i, ch in enumerate(s):\n        if ch in last_seen and last_seen[ch] >= start:\n            start = last_seen[ch] + 1\n        last_seen[ch] = i\n        best = max(best, i - start + 1)\n    return best\n`,
  },
  {
    id: "grid_paths", level: "advanced", title: "Grid Paths (Dynamic Programming)", type: "function", func: "grid_paths",
    description: `<p>A robot starts in the top-left of a <code>rows × cols</code> grid and can only move <strong>right</strong> or <strong>down</strong>. Write <code>grid_paths(rows, cols)</code> that returns how many different routes reach the bottom-right.</p>
<pre>grid_paths(2, 2) → 2
grid_paths(3, 3) → 6
grid_paths(3, 7) → 28</pre>
<p class="note">⚠ A hidden test uses an 18 × 18 grid — plain recursion will time out.</p>`,
    starter: `def grid_paths(rows, cols):\n    pass\n`,
    tests: [
      { args: [1, 1], expected: 1 }, { args: [2, 2], expected: 2 }, { args: [3, 3], expected: 6 }, { args: [3, 7], expected: 28 },
      { args: [1, 50], expected: 1, hidden: true }, { args: [18, 18], expected: 2333606220, hidden: true },
    ],
    hints: [
      "The number of ways into a cell = ways into the cell above + ways into the cell to the left.",
      "The whole top row and left column have exactly 1 way each.",
      "Build a table row by row (or use <code>@functools.lru_cache</code> on a recursive version).",
    ],
    solution: `def grid_paths(rows, cols):\n    row = [1] * cols\n    for _ in range(1, rows):\n        for c in range(1, cols):\n            row[c] += row[c - 1]\n    return row[-1]\n`,
  },
  {
    id: "rpn", level: "advanced", title: "Reverse Polish Calculator", type: "function", func: "eval_rpn",
    description: `<p>In Reverse Polish Notation, operators come <em>after</em> their operands: <code>2 1 + 3 *</code> means <code>(2 + 1) × 3</code>.</p>
<p>Write <code>eval_rpn(tokens)</code> that evaluates a list of string tokens using <code>+ - * /</code>. Division should truncate towards zero (so <code>7 / -2</code> is <code>-3</code>).</p>
<pre>eval_rpn(["2", "1", "+", "3", "*"])  → 9
eval_rpn(["4", "13", "5", "/", "+"]) → 6</pre>`,
    starter: `def eval_rpn(tokens):\n    pass\n`,
    tests: [
      { args: [["2", "1", "+", "3", "*"]], expected: 9 }, { args: [["4", "13", "5", "/", "+"]], expected: 6 },
      { args: [["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]], expected: 22 },
      { args: [["3", "4", "-"]], expected: -1, hidden: true }, { args: [["7", "-2", "/"]], expected: -3, hidden: true },
      { args: [["42"]], expected: 42, hidden: true },
    ],
    hints: [
      "Use a stack. Numbers get pushed; an operator pops two numbers and pushes the result.",
      "Order matters: pop <code>b</code> first, then <code>a</code>, and compute <code>a op b</code>.",
      "<code>//</code> rounds <em>down</em> (−4 for −3.5). Use <code>int(a / b)</code> to truncate towards zero.",
    ],
    solution: `def eval_rpn(tokens):\n    stack = []\n    for t in tokens:\n        if t in ("+", "-", "*", "/"):\n            b = stack.pop()\n            a = stack.pop()\n            if t == "+":\n                stack.append(a + b)\n            elif t == "-":\n                stack.append(a - b)\n            elif t == "*":\n                stack.append(a * b)\n            else:\n                stack.append(int(a / b))\n        else:\n            stack.append(int(t))\n    return stack[0]\n`,
  },
  {
    id: "count_calls", level: "advanced", title: "Call-Counting Decorator", type: "script",
    description: `<p>Write a <strong>decorator</strong> <code>count_calls</code> that counts how many times a function is called. The wrapped function must still return the original result, and expose the count as a <code>.calls</code> attribute.</p>
<pre>@count_calls
def add(a, b):
    return a + b

add(2, 3)   → 5
add.calls   → 1</pre>`,
    starter: `def count_calls(func):\n    pass\n`,
    tests: [
      { code: "@count_calls\ndef hi():\n    return 'hi'\nhi.calls", expected: 0 },
      { code: "@count_calls\ndef hi():\n    return 'hi'\nhi(); hi()\nhi.calls", expected: 2 },
      { code: "@count_calls\ndef add(a, b):\n    return a + b\nadd(2, 3)", expected: 5 },
      { code: "@count_calls\ndef add(a, b):\n    return a + b\nadd(a=1, b=2)", expected: 3, hidden: true },
      { code: "@count_calls\ndef f():\n    pass\n@count_calls\ndef g():\n    pass\nf(); f(); g()\n[f.calls, g.calls]", expected: [2, 1], hidden: true },
    ],
    hints: [
      "A decorator is a function that takes a function and returns a new <em>wrapper</em> function.",
      "Inside, define <code>def wrapper(*args, **kwargs):</code> that calls <code>func(*args, **kwargs)</code>.",
      "Functions can have attributes: set <code>wrapper.calls = 0</code> and do <code>wrapper.calls += 1</code> inside the wrapper.",
    ],
    solution: `import functools\n\ndef count_calls(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        return func(*args, **kwargs)\n    wrapper.calls = 0\n    return wrapper\n`,
  },
  {
    id: "primes_gen", level: "advanced", title: "Infinite Prime Generator", type: "script",
    description: `<p>Write a <strong>generator</strong> function <code>primes()</code> that yields prime numbers forever: 2, 3, 5, 7, 11, …</p>
<pre>from itertools import islice
list(islice(primes(), 5)) → [2, 3, 5, 7, 11]</pre>`,
    starter: `def primes():\n    pass\n`,
    tests: [
      { code: "g = primes()\nnext(g)", expected: 2 },
      { code: "from itertools import islice\nlist(islice(primes(), 10))", expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29] },
      { code: "import types\nisinstance(primes(), types.GeneratorType)", expected: true, hidden: true },
      { code: "from itertools import islice\nlist(islice(primes(), 100))[-1]", expected: 541, hidden: true },
    ],
    hints: [
      "A generator uses <code>yield</code> instead of <code>return</code> — it pauses and resumes.",
      "Loop forever with <code>while True:</code>, checking each candidate number.",
      "Keep a list of primes found so far; a number is prime if none of them (up to its square root) divide it.",
    ],
    solution: `def primes():\n    found = []\n    n = 2\n    while True:\n        if all(n % p for p in found if p * p <= n):\n            found.append(n)\n            yield n\n        n += 1\n`,
  },
  {
    id: "lru_cache", level: "advanced", title: "LRU Cache", type: "script",
    description: `<p>Build a class <code>LRUCache(capacity)</code> — a cache that holds at most <code>capacity</code> items and, when full, evicts the <strong>least recently used</strong> one.</p>
<ul><li><code>get(key)</code> — return the value, or <code>-1</code> if missing. Counts as a "use".</li>
<li><code>put(key, value)</code> — insert or update. Counts as a "use". Evict the LRU item if over capacity.</li></ul>
<pre>c = LRUCache(2)
c.put(1, 1); c.put(2, 2)
c.get(1)      → 1
c.put(3, 3)   # evicts key 2
c.get(2)      → -1</pre>`,
    starter: `class LRUCache:\n    def __init__(self, capacity):\n        pass\n\n    def get(self, key):\n        pass\n\n    def put(self, key, value):\n        pass\n`,
    tests: [
      { code: "c = LRUCache(2)\nc.put(1, 1); c.put(2, 2)\nc.get(1)", expected: 1 },
      { code: "c = LRUCache(2)\nc.get(5)", expected: -1 },
      { code: "c = LRUCache(2)\nc.put(1, 1); c.put(2, 2); c.get(1); c.put(3, 3)\nc.get(2)", expected: -1 },
      { code: "c = LRUCache(2)\nc.put(1, 1); c.put(2, 2); c.get(1); c.put(3, 3)\n[c.get(1), c.get(3)]", expected: [1, 3] },
      { code: "c = LRUCache(2)\nc.put(1, 1); c.put(2, 2); c.put(1, 10); c.put(3, 3)\n[c.get(1), c.get(2), c.get(3)]", expected: [10, -1, 3], hidden: true },
      { code: "c = LRUCache(1)\nc.put('a', 1); c.put('b', 2)\n[c.get('a'), c.get('b')]", expected: [-1, 2], hidden: true },
    ],
    hints: [
      "Since Python 3.7, dictionaries remember insertion order — the first key is the oldest.",
      "To mark a key as recently used, remove it and re-insert it (or use <code>collections.OrderedDict.move_to_end</code>).",
      "When over capacity, drop the oldest: <code>del d[next(iter(d))]</code> or <code>od.popitem(last=False)</code>.",
    ],
    solution: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.data = OrderedDict()\n\n    def get(self, key):\n        if key not in self.data:\n            return -1\n        self.data.move_to_end(key)\n        return self.data[key]\n\n    def put(self, key, value):\n        self.data[key] = value\n        self.data.move_to_end(key)\n        if len(self.data) > self.capacity:\n            self.data.popitem(last=False)\n`,
  },

  // ═══════════════════ CONDITIONALS PACK (if / elif / else) ═══════════════════
  // Appended after the originals so existing lesson file numbers don't shift.

  // ── Beginner ──
  {
    id: "absolute", level: "beginner", topic: "if", title: "Make It Positive", type: "function", func: "absolute",
    description: `<p>Write <code>absolute(n)</code> that returns <code>n</code> without its minus sign. If <code>n</code> is already positive (or zero), return it unchanged.</p>
<pre>absolute(-7) → 7
absolute(3)  → 3
absolute(0)  → 0</pre>
<p class="note">🎯 Practises: a plain <code>if</code> with no <code>else</code>. Don't use the built-in <code>abs()</code>.</p>`,
    starter: `def absolute(n):\n    # if n is negative, flip its sign\n    return n\n`,
    tests: [
      { args: [-7], expected: 7 },
      { args: [3], expected: 3 },
      { args: [0], expected: 0 },
      { args: [-250], expected: 250, hidden: true },
      { args: [-0.5], expected: 0.5, hidden: true },
    ],
    hints: [
      "An <code>if</code> doesn't need an <code>else</code>. When the condition is False, Python skips the indented block.",
      "The condition you want is <code>n &lt; 0</code>.",
      "Inside the <code>if</code>, write <code>n = -n</code>, then <code>return n</code> after it (not indented under the if).",
    ],
    solution: `def absolute(n):\n    if n < 0:\n        n = -n\n    return n\n`,
  },
  {
    id: "password_check", level: "beginner", topic: "if", title: "Secret Password", type: "stdout",
    description: `<p>Read a password. If it is exactly <code>python123</code>, print <code>Access granted</code>. Otherwise print <code>Access denied</code>.</p>
<p class="note">🎯 Practises: <code>if</code> / <code>else</code>, and comparing strings with <code>==</code>. Capitals count, so <code>Python123</code> is wrong.</p>`,
    starter: `password = input("Password: ")\n`,
    tests: [
      { input: ["python123"], expected: "Access granted" },
      { input: ["letmein"], expected: "Access denied" },
      { input: ["Python123"], expected: "Access denied", hidden: true },
      { input: [""], expected: "Access denied", hidden: true },
    ],
    hints: [
      "<code>==</code> compares two values. A single <code>=</code> assigns a value, so it can't go in an <code>if</code>.",
      "<code>if password == \"python123\":</code>. Don't forget the colon.",
      "Put <code>else:</code> under it, lined up with the <code>if</code>, and indent each <code>print</code>.",
    ],
    solution: `password = input("Password: ")\nif password == "python123":\n    print("Access granted")\nelse:\n    print("Access denied")\n`,
  },
  {
    id: "sign", level: "beginner", topic: "if", title: "Positive, Negative or Zero", type: "stdout",
    description: `<p>Read a whole number and print one word: <code>Positive</code>, <code>Negative</code> or <code>Zero</code>.</p>
<p class="note">🎯 Practises: your first <code>elif</code>. That's three possible outcomes, and exactly one of them runs.</p>`,
    starter: `n = int(input())\n`,
    tests: [
      { input: ["5"], expected: "Positive" },
      { input: ["-3"], expected: "Negative" },
      { input: ["0"], expected: "Zero" },
      { input: ["-1000"], expected: "Negative", hidden: true },
      { input: ["1"], expected: "Positive", hidden: true },
    ],
    hints: [
      "<code>elif</code> means \"else, if…\". Python only checks it when everything above it was False.",
      "Check <code>n &gt; 0</code> first, then <code>elif n &lt; 0</code>.",
      "Whatever is left must be zero, so a plain <code>else:</code> handles it.",
    ],
    solution: `n = int(input())\nif n > 0:\n    print("Positive")\nelif n < 0:\n    print("Negative")\nelse:\n    print("Zero")\n`,
  },
  {
    id: "bigger", level: "beginner", topic: "if", title: "Which Is Bigger?", type: "stdout",
    description: `<p>Read two whole numbers, one per line. Print the bigger one. If they're the same, print <code>Equal</code>.</p>
<pre>4, 9  → 9
12, 3 → 12
5, 5  → Equal</pre>
<p class="note">🎯 Practises: comparison operators <code>&gt;</code>, <code>&lt;</code> and <code>==</code>.</p>`,
    starter: `a = int(input())\nb = int(input())\n`,
    tests: [
      { input: ["4", "9"], expected: "9" },
      { input: ["12", "3"], expected: "12" },
      { input: ["5", "5"], expected: "Equal" },
      { input: ["-2", "-8"], expected: "-2", hidden: true },
      { input: ["0", "0"], expected: "Equal", hidden: true },
    ],
    hints: [
      "There are three cases: a is bigger, b is bigger, or they're equal.",
      "<code>if a &gt; b:</code> … <code>elif b &gt; a:</code> … <code>else:</code>",
      "In the <code>else</code> branch, <code>print(\"Equal\")</code>.",
    ],
    solution: `a = int(input())\nb = int(input())\nif a > b:\n    print(a)\nelif b > a:\n    print(b)\nelse:\n    print("Equal")\n`,
  },
  {
    id: "ticket_price", level: "beginner", topic: "if", title: "Cinema Ticket Price", type: "function", func: "ticket_price",
    description: `<p>Write <code>ticket_price(age)</code> that returns the price in pounds:</p>
<table class="mini"><tr><th>Age</th><th>Price</th></tr>
<tr><td>under 5</td><td>0</td></tr><tr><td>5 – 17</td><td>6</td></tr>
<tr><td>18 – 64</td><td>12</td></tr><tr><td>65 and over</td><td>7</td></tr></table>
<p class="note">🎯 Practises: an <code>elif</code> chain where order matters. Check the edges: ages 5, 17, 18, 64 and 65.</p>`,
    starter: `def ticket_price(age):\n    pass\n`,
    tests: [
      { args: [3], expected: 0 },
      { args: [10], expected: 6 },
      { args: [30], expected: 12 },
      { args: [70], expected: 7 },
      { args: [5], expected: 6, hidden: true },
      { args: [17], expected: 6, hidden: true },
      { args: [18], expected: 12, hidden: true },
      { args: [65], expected: 7, hidden: true },
    ],
    hints: [
      "Python checks conditions top to bottom and stops at the first True one.",
      "Go up in age: <code>if age &lt; 5:</code> → <code>elif age &lt; 18:</code> → <code>elif age &lt; 65:</code> → <code>else:</code>",
      "Because the earlier checks already ruled out younger ages, <code>elif age &lt; 18</code> on its own means 5–17.",
    ],
    solution: `def ticket_price(age):\n    if age < 5:\n        return 0\n    elif age < 18:\n        return 6\n    elif age < 65:\n        return 12\n    else:\n        return 7\n`,
  },
  {
    id: "temperature", level: "beginner", topic: "if", title: "What to Wear", type: "stdout",
    description: `<p>Read a temperature in °C (it may have a decimal point) and print advice:</p>
<table class="mini"><tr><th>Temperature</th><th>Print</th></tr>
<tr><td>below 0</td><td><code>Freezing - wear a big coat</code></td></tr>
<tr><td>0 up to 15</td><td><code>Cold - take a jumper</code></td></tr>
<tr><td>above 15 up to 25</td><td><code>Mild - a t-shirt is fine</code></td></tr>
<tr><td>above 25</td><td><code>Hot - wear sun cream</code></td></tr></table>`,
    starter: `temp = float(input())\n`,
    tests: [
      { input: ["-4"], expected: "Freezing - wear a big coat" },
      { input: ["10"], expected: "Cold - take a jumper" },
      { input: ["20"], expected: "Mild - a t-shirt is fine" },
      { input: ["31"], expected: "Hot - wear sun cream" },
      { input: ["0"], expected: "Cold - take a jumper", hidden: true },
      { input: ["15"], expected: "Cold - take a jumper", hidden: true },
      { input: ["15.5"], expected: "Mild - a t-shirt is fine", hidden: true },
      { input: ["25"], expected: "Mild - a t-shirt is fine", hidden: true },
    ],
    hints: [
      "\"Up to 15\" includes 15, so use <code>&lt;=</code> for those bands.",
      "<code>if temp &lt; 0:</code> → <code>elif temp &lt;= 15:</code> → <code>elif temp &lt;= 25:</code> → <code>else:</code>",
      "Copy the messages exactly, including the spaced hyphen <code> - </code>.",
    ],
    solution: `temp = float(input())\nif temp < 0:\n    print("Freezing - wear a big coat")\nelif temp <= 15:\n    print("Cold - take a jumper")\nelif temp <= 25:\n    print("Mild - a t-shirt is fine")\nelse:\n    print("Hot - wear sun cream")\n`,
  },
  {
    id: "traffic_light", level: "beginner", topic: "if", title: "Traffic Lights", type: "function", func: "traffic_light",
    description: `<p>Write <code>traffic_light(colour)</code>:</p>
<pre>"red"   → "Stop"
"amber" → "Get ready"
"green" → "Go"
anything else → "Invalid colour"</pre>
<p class="note">🎯 Practises: matching strings with an <code>elif</code> chain, and a catch-all <code>else</code>.</p>`,
    starter: `def traffic_light(colour):\n    pass\n`,
    tests: [
      { args: ["red"], expected: "Stop" },
      { args: ["amber"], expected: "Get ready" },
      { args: ["green"], expected: "Go" },
      { args: ["blue"], expected: "Invalid colour" },
      { args: [""], expected: "Invalid colour", hidden: true },
      { args: ["Red"], expected: "Invalid colour", hidden: true },
    ],
    hints: [
      "Compare the string with <code>==</code>: <code>if colour == \"red\":</code>",
      "Add an <code>elif</code> for amber and one for green.",
      "End with <code>else: return \"Invalid colour\"</code> to catch everything else.",
    ],
    solution: `def traffic_light(colour):\n    if colour == "red":\n        return "Stop"\n    elif colour == "amber":\n        return "Get ready"\n    elif colour == "green":\n        return "Go"\n    else:\n        return "Invalid colour"\n`,
  },
  {
    id: "day_type", level: "beginner", topic: "if", title: "Weekday or Weekend", type: "function", func: "day_type",
    description: `<p>Write <code>day_type(day)</code> that returns <code>"Weekend"</code> for Saturday or Sunday, <code>"Weekday"</code> for Monday to Friday, and <code>"Invalid day"</code> for anything else.</p>
<p>Capitals shouldn't matter: <code>"saturday"</code>, <code>"Saturday"</code> and <code>"SATURDAY"</code> are all the weekend.</p>
<p class="note">🎯 Practises: <code>or</code>, the <code>in</code> keyword, and tidying input with <code>.lower()</code> before you compare it.</p>`,
    starter: `def day_type(day):\n    day = day.lower()\n`,
    tests: [
      { args: ["Saturday"], expected: "Weekend" },
      { args: ["monday"], expected: "Weekday" },
      { args: ["Funday"], expected: "Invalid day" },
      { args: ["SUNDAY"], expected: "Weekend", hidden: true },
      { args: ["Friday"], expected: "Weekday", hidden: true },
      { args: ["wednesday"], expected: "Weekday", hidden: true },
    ],
    hints: [
      "<code>day == \"saturday\" or day == \"sunday\"</code> is True if either side is True.",
      "A neater way: <code>if day in (\"saturday\", \"sunday\"):</code>",
      "Use <code>elif day in (\"monday\", \"tuesday\", \"wednesday\", \"thursday\", \"friday\"):</code>, then <code>else</code>.",
    ],
    solution: `def day_type(day):\n    day = day.lower()\n    if day in ("saturday", "sunday"):\n        return "Weekend"\n    elif day in ("monday", "tuesday", "wednesday", "thursday", "friday"):\n        return "Weekday"\n    else:\n        return "Invalid day"\n`,
  },
  {
    id: "bmi_category", level: "beginner", topic: "if", title: "BMI Category", type: "function", func: "bmi_category",
    description: `<p>Write <code>bmi_category(bmi)</code>:</p>
<table class="mini"><tr><th>BMI</th><th>Return</th></tr>
<tr><td>below 18.5</td><td><code>"Underweight"</code></td></tr>
<tr><td>18.5 up to (not including) 25</td><td><code>"Healthy"</code></td></tr>
<tr><td>25 up to (not including) 30</td><td><code>"Overweight"</code></td></tr>
<tr><td>30 and above</td><td><code>"Obese"</code></td></tr></table>
<p class="note">🎯 Practises: <code>&lt;</code> versus <code>&lt;=</code> at the exact boundaries.</p>`,
    starter: `def bmi_category(bmi):\n    pass\n`,
    tests: [
      { args: [17], expected: "Underweight" },
      { args: [22.4], expected: "Healthy" },
      { args: [27], expected: "Overweight" },
      { args: [35], expected: "Obese" },
      { args: [18.5], expected: "Healthy", hidden: true },
      { args: [25], expected: "Overweight", hidden: true },
      { args: [30], expected: "Obese", hidden: true },
      { args: [29.9], expected: "Overweight", hidden: true },
    ],
    hints: [
      "\"Not including 25\" means 25 itself belongs to the next band up.",
      "<code>if bmi &lt; 18.5:</code> → <code>elif bmi &lt; 25:</code> → <code>elif bmi &lt; 30:</code> → <code>else:</code>",
      "Return the exact strings, with capital first letters.",
    ],
    solution: `def bmi_category(bmi):\n    if bmi < 18.5:\n        return "Underweight"\n    elif bmi < 25:\n        return "Healthy"\n    elif bmi < 30:\n        return "Overweight"\n    else:\n        return "Obese"\n`,
  },
  {
    id: "leap_year", level: "beginner", topic: "if", title: "Leap Year", type: "function", func: "is_leap",
    description: `<p>Write <code>is_leap(year)</code> that returns <code>True</code> for a leap year, otherwise <code>False</code>. The rules:</p>
<ul><li>A year divisible by 4 is a leap year…</li>
<li>…<strong>except</strong> years divisible by 100, which are not…</li>
<li>…<strong>unless</strong> they're also divisible by 400, which are.</li></ul>
<pre>is_leap(2024) → True
is_leap(2023) → False
is_leap(1900) → False
is_leap(2000) → True</pre>
<p class="note">🎯 Practises: combining conditions with <code>and</code> / <code>or</code>, or nesting <code>if</code>s.</p>`,
    starter: `def is_leap(year):\n    pass\n`,
    tests: [
      { args: [2024], expected: true },
      { args: [2023], expected: false },
      { args: [1900], expected: false },
      { args: [2000], expected: true },
      { args: [2100], expected: false, hidden: true },
      { args: [1600], expected: true, hidden: true },
      { args: [1996], expected: true, hidden: true },
    ],
    hints: [
      "<code>year % 4 == 0</code> is True when 4 divides the year exactly.",
      "Check the most specific rule first: <code>if year % 400 == 0: return True</code>, then <code>elif year % 100 == 0: return False</code>.",
      "In one line: <code>return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)</code>.",
    ],
    solution: `def is_leap(year):\n    if year % 400 == 0:\n        return True\n    elif year % 100 == 0:\n        return False\n    elif year % 4 == 0:\n        return True\n    else:\n        return False\n`,
  },

  // ── Intermediate ──
  {
    id: "triangle_type", level: "intermediate", topic: "if", title: "Triangle Type", type: "function", func: "triangle_type",
    description: `<p>Write <code>triangle_type(a, b, c)</code> that takes three side lengths and returns:</p>
<ul><li><code>"Not a triangle"</code> if any side is 0 or less, or if any two sides add up to no more than the third.</li>
<li><code>"Equilateral"</code> if all three sides are equal.</li>
<li><code>"Isosceles"</code> if exactly two sides are equal.</li>
<li><code>"Scalene"</code> if no sides are equal.</li></ul>
<p class="note">🎯 Practises: <strong>guard clauses</strong>. Rule out the bad cases first, then classify what's left.</p>`,
    starter: `def triangle_type(a, b, c):\n    pass\n`,
    tests: [
      { args: [3, 3, 3], expected: "Equilateral" },
      { args: [5, 5, 8], expected: "Isosceles" },
      { args: [3, 4, 5], expected: "Scalene" },
      { args: [1, 2, 10], expected: "Not a triangle" },
      { args: [0, 4, 4], expected: "Not a triangle", hidden: true },
      { args: [1, 2, 3], expected: "Not a triangle", hidden: true },
      { args: [8, 5, 5], expected: "Isosceles", hidden: true },
      { args: [-3, -3, -3], expected: "Not a triangle", hidden: true },
    ],
    hints: [
      "Do the \"Not a triangle\" checks first and <code>return</code> straight away, so the rest of the function only sees valid triangles.",
      "Invalid if <code>a &lt;= 0 or b &lt;= 0 or c &lt;= 0</code>, or <code>a + b &lt;= c or a + c &lt;= b or b + c &lt;= a</code>.",
      "Then: <code>if a == b == c</code> → Equilateral, <code>elif a == b or b == c or a == c</code> → Isosceles, <code>else</code> → Scalene.",
    ],
    solution: `def triangle_type(a, b, c):\n    if a <= 0 or b <= 0 or c <= 0:\n        return "Not a triangle"\n    if a + b <= c or a + c <= b or b + c <= a:\n        return "Not a triangle"\n    if a == b == c:\n        return "Equilateral"\n    elif a == b or b == c or a == c:\n        return "Isosceles"\n    else:\n        return "Scalene"\n`,
  },
  {
    id: "season", level: "intermediate", topic: "if", title: "Season Finder", type: "function", func: "season",
    description: `<p>Write <code>season(month)</code> where <code>month</code> is a number from 1 to 12 (UK seasons):</p>
<pre>12, 1, 2  → "Winter"
3, 4, 5   → "Spring"
6, 7, 8   → "Summer"
9, 10, 11 → "Autumn"
anything else → "Invalid month"</pre>
<p class="note">🎯 Practises: <code>in</code> with a list, and chained comparisons like <code>3 &lt;= month &lt;= 5</code>.</p>`,
    starter: `def season(month):\n    pass\n`,
    tests: [
      { args: [1], expected: "Winter" },
      { args: [4], expected: "Spring" },
      { args: [7], expected: "Summer" },
      { args: [10], expected: "Autumn" },
      { args: [13], expected: "Invalid month" },
      { args: [12], expected: "Winter", hidden: true },
      { args: [0], expected: "Invalid month", hidden: true },
      { args: [-5], expected: "Invalid month", hidden: true },
      { args: [9], expected: "Autumn", hidden: true },
    ],
    hints: [
      "Winter wraps around the new year, so a range check won't work. Use <code>if month in (12, 1, 2):</code>",
      "Python lets you chain comparisons: <code>elif 3 &lt;= month &lt;= 5:</code>",
      "Make sure 13, 0 and negative numbers fall through to <code>else: return \"Invalid month\"</code>.",
    ],
    solution: `def season(month):\n    if month in (12, 1, 2):\n        return "Winter"\n    elif 3 <= month <= 5:\n        return "Spring"\n    elif 6 <= month <= 8:\n        return "Summer"\n    elif 9 <= month <= 11:\n        return "Autumn"\n    else:\n        return "Invalid month"\n`,
  },
  {
    id: "rps", level: "intermediate", topic: "if", title: "Rock, Paper, Scissors", type: "function", func: "rps",
    description: `<p>Write <code>rps(p1, p2)</code>. Each player picks <code>"rock"</code>, <code>"paper"</code> or <code>"scissors"</code>. Return:</p>
<ul><li><code>"Invalid move"</code> if either choice isn't one of those three</li>
<li><code>"Draw"</code> if they picked the same</li>
<li><code>"Player 1 wins"</code> or <code>"Player 2 wins"</code> otherwise</li></ul>
<p>Rock beats scissors, scissors beats paper, paper beats rock.</p>
<p class="note">🎯 Practises: complex conditions joined with <code>and</code> / <code>or</code>, with brackets to keep them readable.</p>`,
    starter: `def rps(p1, p2):\n    pass\n`,
    tests: [
      { args: ["rock", "scissors"], expected: "Player 1 wins" },
      { args: ["rock", "paper"], expected: "Player 2 wins" },
      { args: ["paper", "paper"], expected: "Draw" },
      { args: ["rock", "lizard"], expected: "Invalid move" },
      { args: ["scissors", "paper"], expected: "Player 1 wins", hidden: true },
      { args: ["scissors", "rock"], expected: "Player 2 wins", hidden: true },
      { args: ["paper", "rock"], expected: "Player 1 wins", hidden: true },
      { args: ["spock", "spock"], expected: "Invalid move", hidden: true },
    ],
    hints: [
      "Check for invalid moves first. <code>p1 not in (\"rock\", \"paper\", \"scissors\")</code> is handy here.",
      "After the Draw check, player 1 wins in three cases: <code>(p1 == \"rock\" and p2 == \"scissors\") or (…) or (…)</code>.",
      "If player 1 didn't win and it isn't a draw, player 2 must have won, so a plain <code>else</code> covers it.",
    ],
    solution: `def rps(p1, p2):\n    moves = ("rock", "paper", "scissors")\n    if p1 not in moves or p2 not in moves:\n        return "Invalid move"\n    if p1 == p2:\n        return "Draw"\n    if (p1 == "rock" and p2 == "scissors") or (p1 == "scissors" and p2 == "paper") or (p1 == "paper" and p2 == "rock"):\n        return "Player 1 wins"\n    else:\n        return "Player 2 wins"\n`,
  },
  {
    id: "calculator", level: "intermediate", topic: "if", title: "Simple Calculator", type: "function", func: "calculate",
    description: `<p>Write <code>calculate(a, op, b)</code> where <code>op</code> is one of <code>"+"</code>, <code>"-"</code>, <code>"*"</code> or <code>"/"</code>.</p>
<pre>calculate(6, "+", 3) → 9
calculate(6, "/", 3) → 2.0
calculate(6, "/", 0) → "Cannot divide by zero"
calculate(6, "^", 3) → "Unknown operator"</pre>
<p class="note">🎯 Practises: a <strong>nested</strong> <code>if</code>, an <code>if</code> inside one branch of another.</p>`,
    starter: `def calculate(a, op, b):\n    pass\n`,
    tests: [
      { args: [6, "+", 3], expected: 9 },
      { args: [6, "-", 10], expected: -4 },
      { args: [4, "*", 2.5], expected: 10 },
      { args: [6, "/", 3], expected: 2 },
      { args: [6, "/", 0], expected: "Cannot divide by zero" },
      { args: [6, "^", 3], expected: "Unknown operator" },
      { args: [0, "/", 5], expected: 0, hidden: true },
      { args: [1, "%", 1], expected: "Unknown operator", hidden: true },
    ],
    hints: [
      "Start with <code>if op == \"+\":</code>, then add an <code>elif</code> for each other operator.",
      "Inside the <code>\"/\"</code> branch, check <code>if b == 0:</code> before dividing.",
      "Finish with <code>else: return \"Unknown operator\"</code>.",
    ],
    solution: `def calculate(a, op, b):\n    if op == "+":\n        return a + b\n    elif op == "-":\n        return a - b\n    elif op == "*":\n        return a * b\n    elif op == "/":\n        if b == 0:\n            return "Cannot divide by zero"\n        return a / b\n    else:\n        return "Unknown operator"\n`,
  },
  {
    id: "shipping", level: "intermediate", topic: "if", title: "Parcel Postage", type: "function", func: "postage",
    description: `<p>Write <code>postage(weight, express)</code>. <code>weight</code> is in kg and <code>express</code> is <code>True</code> or <code>False</code>.</p>
<table class="mini"><tr><th>Weight</th><th>Standard price</th></tr>
<tr><td>0 or less</td><td>return <code>"Invalid weight"</code></td></tr>
<tr><td>up to 1 kg</td><td>3.50</td></tr><tr><td>over 1, up to 5 kg</td><td>6.00</td></tr>
<tr><td>over 5, up to 20 kg</td><td>10.00</td></tr><tr><td>over 20 kg</td><td>return <code>"Too heavy"</code></td></tr></table>
<p>Express adds £5.00, but parcels over 10 kg <strong>can't</strong> go express. Return <code>"No express over 10kg"</code> for those.</p>
<p class="note">🎯 Practises: combining a condition on one variable with a condition on another, in the right order.</p>`,
    starter: `def postage(weight, express):\n    pass\n`,
    tests: [
      { args: [0.5, false], expected: 3.5 },
      { args: [3, true], expected: 11 },
      { args: [15, false], expected: 10 },
      { args: [15, true], expected: "No express over 10kg" },
      { args: [25, false], expected: "Too heavy" },
      { args: [0, false], expected: "Invalid weight" },
      { args: [1, false], expected: 3.5, hidden: true },
      { args: [5, true], expected: 11, hidden: true },
      { args: [10, true], expected: 15, hidden: true },
      { args: [20, false], expected: 10, hidden: true },
      { args: [25, true], expected: "Too heavy", hidden: true },
    ],
    hints: [
      "Deal with the error cases first: invalid weight, then too heavy, then express over 10 kg.",
      "Work out the standard <code>price</code> with an <code>if</code>/<code>elif</code> chain and store it in a variable.",
      "Then <code>if express: price += 5</code>, and <code>return price</code>.",
    ],
    solution: `def postage(weight, express):\n    if weight <= 0:\n        return "Invalid weight"\n    if weight > 20:\n        return "Too heavy"\n    if express and weight > 10:\n        return "No express over 10kg"\n    if weight <= 1:\n        price = 3.5\n    elif weight <= 5:\n        price = 6.0\n    else:\n        price = 10.0\n    if express:\n        price += 5\n    return price\n`,
  },
  {
    id: "valid_date", level: "intermediate", topic: "if", title: "Is It a Real Date?", type: "function", func: "is_valid_date",
    description: `<p>Write <code>is_valid_date(day, month, year)</code> that returns <code>True</code> only if the date really exists.</p>
<ul><li>Month must be 1–12, and day must be at least 1.</li>
<li>April, June, September and November have 30 days. February has 28, or 29 in a leap year. The rest have 31.</li>
<li>Leap years follow the rules from the <em>Leap Year</em> challenge.</li></ul>
<pre>is_valid_date(29, 2, 2024) → True
is_valid_date(29, 2, 2023) → False
is_valid_date(31, 4, 2024) → False</pre>
<p class="note">🎯 Practises: using one conditional to set a variable that a later conditional checks.</p>`,
    starter: `def is_valid_date(day, month, year):\n    pass\n`,
    tests: [
      { args: [29, 2, 2024], expected: true },
      { args: [29, 2, 2023], expected: false },
      { args: [31, 4, 2024], expected: false },
      { args: [31, 12, 1999], expected: true },
      { args: [1, 13, 2024], expected: false },
      { args: [0, 5, 2024], expected: false, hidden: true },
      { args: [29, 2, 1900], expected: false, hidden: true },
      { args: [29, 2, 2000], expected: true, hidden: true },
      { args: [30, 6, 2024], expected: true, hidden: true },
      { args: [32, 1, 2024], expected: false, hidden: true },
    ],
    hints: [
      "Return <code>False</code> straight away if <code>month</code> isn't 1–12 or <code>day &lt; 1</code>.",
      "Set <code>max_day</code>: <code>if month == 2:</code> → 29 or 28 (check leap year), <code>elif month in (4, 6, 9, 11):</code> → 30, <code>else</code> → 31.",
      "Finally: <code>return day &lt;= max_day</code>.",
    ],
    solution: `def is_valid_date(day, month, year):\n    if month < 1 or month > 12 or day < 1:\n        return False\n    if month == 2:\n        leap = year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)\n        if leap:\n            max_day = 29\n        else:\n            max_day = 28\n    elif month in (4, 6, 9, 11):\n        max_day = 30\n    else:\n        max_day = 31\n    return day <= max_day\n`,
  },

  // ── Advanced ──
  {
    id: "income_tax", level: "advanced", topic: "if", title: "Income Tax Bands", type: "function", func: "income_tax",
    description: `<p>Write <code>income_tax(income)</code> using these simplified UK tax bands. Each rate only applies to the part of the income <em>inside</em> its band:</p>
<table class="mini"><tr><th>Band</th><th>Income</th><th>Rate</th></tr>
<tr><td>Personal allowance</td><td>£0 – £12,570</td><td>0%</td></tr>
<tr><td>Basic</td><td>£12,571 – £50,270</td><td>20%</td></tr>
<tr><td>Higher</td><td>£50,271 – £125,140</td><td>40%</td></tr>
<tr><td>Additional</td><td>over £125,140</td><td>45%</td></tr></table>
<pre>income_tax(10000)  → 0
income_tax(30000)  → 3486.0     # (30000 − 12570) × 20%
income_tax(60000)  → 11432.0    # 7540 + (60000 − 50270) × 40%</pre>
<p class="note">🎯 Practises: if/elif with running totals. Ignore the real-world allowance taper.</p>`,
    starter: `def income_tax(income):\n    pass\n`,
    tests: [
      { args: [10000], expected: 0 },
      { args: [30000], expected: 3486 },
      { args: [60000], expected: 11432 },
      { args: [150000], expected: 48675 },
      { args: [12570], expected: 0, hidden: true },
      { args: [50270], expected: 7540, hidden: true },
      { args: [125140], expected: 37488, hidden: true },
      { args: [0], expected: 0, hidden: true },
    ],
    hints: [
      "Work out the most tax each full band can charge: the basic band is (50270 − 12570) × 0.2 = 7540.",
      "Use <code>if income &lt;= 12570</code> / <code>elif income &lt;= 50270</code> / <code>elif income &lt;= 125140</code> / <code>else</code>. In each branch, add the full lower bands plus the slice in the current band.",
      "For example, in the higher band: <code>return 7540 + (income - 50270) * 0.4</code>.",
    ],
    solution: `def income_tax(income):\n    basic_full = (50270 - 12570) * 0.2\n    higher_full = (125140 - 50270) * 0.4\n    if income <= 12570:\n        return 0\n    elif income <= 50270:\n        return (income - 12570) * 0.2\n    elif income <= 125140:\n        return basic_full + (income - 50270) * 0.4\n    else:\n        return basic_full + higher_full + (income - 125140) * 0.45\n`,
  },
  {
    id: "password_strength", level: "advanced", topic: "if", title: "Password Strength", type: "function", func: "password_strength",
    description: `<p>Write <code>password_strength(pw)</code> that returns <code>"Weak"</code>, <code>"Medium"</code> or <code>"Strong"</code>.</p>
<ul><li>Any password shorter than 8 characters is <code>"Weak"</code>.</li>
<li>Otherwise, count how many of these it has: an uppercase letter, a lowercase letter, a digit, a symbol (anything that isn't a letter or digit, so spaces count too).</li>
<li>All 4 → <code>"Strong"</code>. Exactly 3 → <code>"Medium"</code>. 2 or fewer → <code>"Weak"</code>.</li></ul>
<pre>password_strength("abc")         → "Weak"
password_strength("password1A")  → "Medium"
password_strength("Tr0ub4dor&amp;3") → "Strong"</pre>
<p class="note">🎯 Practises: <code>if</code> inside a loop, boolean flags, and adding <code>True</code> values together to count them.</p>`,
    starter: `def password_strength(pw):\n    pass\n`,
    tests: [
      { args: ["abc"], expected: "Weak" },
      { args: ["password1A"], expected: "Medium" },
      { args: ["Tr0ub4dor&3"], expected: "Strong" },
      { args: ["alllowercase"], expected: "Weak" },
      { args: ["Ab1!"], expected: "Weak", hidden: true },
      { args: ["UPPER123!"], expected: "Medium", hidden: true },
      { args: ["abcdEFGH"], expected: "Weak", hidden: true },
      { args: ["a B 3 c d"], expected: "Strong", hidden: true },
    ],
    hints: [
      "Strings have <code>.isupper()</code>, <code>.islower()</code>, <code>.isdigit()</code> and <code>.isalnum()</code>. A symbol is <code>not ch.isalnum()</code>.",
      "Set four flags to <code>False</code>, loop over each character, and set the matching flag to <code>True</code> with if/elif.",
      "<code>True</code> counts as 1, so <code>score = upper + lower + digit + symbol</code> gives the count. Then if/elif on <code>score</code>.",
    ],
    solution: `def password_strength(pw):\n    if len(pw) < 8:\n        return "Weak"\n    upper = lower = digit = symbol = False\n    for ch in pw:\n        if ch.isupper():\n            upper = True\n        elif ch.islower():\n            lower = True\n        elif ch.isdigit():\n            digit = True\n        else:\n            symbol = True\n    score = upper + lower + digit + symbol\n    if score == 4:\n        return "Strong"\n    elif score == 3:\n        return "Medium"\n    else:\n        return "Weak"\n`,
  },
  {
    id: "text_adventure", level: "advanced", topic: "if", title: "Text Adventure Commands", type: "function", func: "parse_command",
    description: `<p>Write <code>parse_command(cmd)</code> for a text adventure game. Ignore capitals and extra spaces.</p>
<table class="mini"><tr><th>Command</th><th>Return</th></tr>
<tr><td><code>look</code></td><td><code>"You look around."</code></td></tr>
<tr><td><code>go north</code> / <code>south</code> / <code>east</code> / <code>west</code></td><td><code>"You go north."</code> (etc.)</td></tr>
<tr><td><code>go</code> + anything else</td><td><code>"You can't go that way."</code></td></tr>
<tr><td><code>take &lt;item&gt;</code></td><td><code>"You take the &lt;item&gt;."</code> (the item can be several words)</td></tr>
<tr><td><code>quit</code> or <code>exit</code></td><td><code>"Goodbye!"</code></td></tr>
<tr><td>anything else</td><td><code>"I don't understand."</code></td></tr></table>
<p class="note">🎯 Stretch goal: solve it with if/elif, then try Python's <code>match</code> / <code>case</code> statement, which is built for this kind of branching.</p>`,
    starter: `def parse_command(cmd):\n    words = cmd.lower().split()\n`,
    tests: [
      { args: ["look"], expected: "You look around." },
      { args: ["go north"], expected: "You go north." },
      { args: ["go up"], expected: "You can't go that way." },
      { args: ["take lamp"], expected: "You take the lamp." },
      { args: ["quit"], expected: "Goodbye!" },
      { args: ["dance"], expected: "I don't understand." },
      { args: ["  GO   West "], expected: "You go west.", hidden: true },
      { args: ["take old key"], expected: "You take the old key.", hidden: true },
      { args: ["exit"], expected: "Goodbye!", hidden: true },
      { args: [""], expected: "I don't understand.", hidden: true },
      { args: ["take"], expected: "I don't understand.", hidden: true },
      { args: ["look around"], expected: "I don't understand.", hidden: true },
    ],
    hints: [
      "<code>cmd.lower().split()</code> gives you a list of words and drops the extra spaces. Check <code>len(words)</code> and <code>words[0]</code>.",
      "<code>take</code> needs at least one more word: <code>words[0] == \"take\" and len(words) &gt; 1</code>. Rejoin the rest with <code>\" \".join(words[1:])</code>.",
      "With match: <code>case [\"go\", (\"north\" | \"south\" | \"east\" | \"west\") as d]:</code> and <code>case [\"take\", *item] if item:</code>.",
    ],
    solution: `def parse_command(cmd):\n    match cmd.lower().split():\n        case ["look"]:\n            return "You look around."\n        case ["go", ("north" | "south" | "east" | "west") as direction]:\n            return f"You go {direction}."\n        case ["go", *_]:\n            return "You can't go that way."\n        case ["take", *item] if item:\n            return f"You take the {' '.join(item)}."\n        case ["quit"] | ["exit"]:\n            return "Goodbye!"\n        case _:\n            return "I don't understand."\n`,
  },
];
