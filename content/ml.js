// PyMarker: Machine Learning fundamentals + "Build your own tiny GPT".
// Same schema as challenges.js, plus `track` ("ml" or "gpt").
// Everything runs on plain Python lists: standard library only (no numpy).

globalThis.ML_PROBLEMS = [
  // ───────────────────────── ML FUNDAMENTALS ─────────────────────────
  {
    id: "ml_describe", track: "ml", level: "beginner", title: "Mean, Median and Mode", type: "function", func: "describe",
    description: `<p><strong>Why it matters:</strong> before training any model, data scientists <em>describe</em> their data. The mean, median and mode are the three classic "averages" and tell you where the middle of your data sits.</p>
<p>Write <code>describe(nums)</code> that returns a list <code>[mean, median, mode]</code>:</p>
<ul><li><strong>mean</strong>: the sum divided by the count, rounded to 2 decimal places</li>
<li><strong>median</strong>: the middle value once sorted; with an even count, the average of the two middle values</li>
<li><strong>mode</strong>: the most common value; if there's a tie, the <em>smallest</em> of the tied values</li></ul>
<pre>describe([3, 1, 3, 2])  → [2.25, 2.5, 3]</pre>`,
    starter: `def describe(nums):
    pass
`,
    tests: [
      { args: [[1, 2, 3, 4]], expected: [2.5, 2.5, 1] },
      { args: [[3, 1, 3, 2]], expected: [2.25, 2.5, 3] },
      { args: [[5]], expected: [5, 5, 5] },
      { args: [[2, 2, 8, 8, 1]], expected: [4.2, 2, 2], hidden: true },
      { args: [[10, 20, 30]], expected: [20, 20, 10], hidden: true },
    ],
    hints: [
      "Mean is <code>sum(nums) / len(nums)</code>. For the median, start with <code>s = sorted(nums)</code>.",
      "If <code>len(s)</code> is odd the median is <code>s[len(s) // 2]</code>; if even, average <code>s[n // 2 - 1]</code> and <code>s[n // 2]</code>.",
      "For the mode, count with a dict (or <code>collections.Counter</code>), find the highest count, then take <code>min()</code> of the values that have it.",
    ],
    solution: `def describe(nums):
    mean = round(sum(nums) / len(nums), 2)
    s = sorted(nums)
    n = len(s)
    if n % 2 == 1:
        median = s[n // 2]
    else:
        median = (s[n // 2 - 1] + s[n // 2]) / 2
    counts = {}
    for x in nums:
        counts[x] = counts.get(x, 0) + 1
    best = max(counts.values())
    mode = min(x for x in counts if counts[x] == best)
    return [mean, median, mode]
`,
  },
  {
    id: "ml_spread", track: "ml", level: "beginner", title: "Variance and Standard Deviation", type: "function", func: "variance_std",
    description: `<p><strong>Why it matters:</strong> averages hide how <em>spread out</em> data is. Variance and standard deviation measure spread, and they're used everywhere in ML: scaling features, spotting outliers, and measuring how noisy a model's errors are.</p>
<p>Write <code>variance_std(nums)</code> returning <code>[variance, std]</code>, both rounded to 4 decimal places. Use the <em>population</em> formulas:</p>
<ul><li>variance = the mean of <code>(x - mean)²</code> over every value</li>
<li>standard deviation = the square root of the variance</li></ul>
<pre>variance_std([2, 4, 4, 4, 5, 5, 7, 9])  → [4.0, 2.0]</pre>`,
    starter: `def variance_std(nums):
    pass
`,
    tests: [
      { args: [[2, 4, 4, 4, 5, 5, 7, 9]], expected: [4.0, 2.0] },
      { args: [[1, 2, 3, 4]], expected: [1.25, 1.118] },
      { args: [[5, 5, 5]], expected: [0.0, 0.0] },
      { args: [[1, 10]], expected: [20.25, 4.5], hidden: true },
      { args: [[0, 1, 2]], expected: [0.6667, 0.8165], hidden: true },
    ],
    hints: [
      "Work out the mean first: <code>m = sum(nums) / len(nums)</code>.",
      "Variance: <code>sum((x - m) ** 2 for x in nums) / len(nums)</code>.",
      "<code>import math</code> and use <code>math.sqrt(var)</code>, then <code>round(..., 4)</code> both values.",
    ],
    solution: `import math

def variance_std(nums):
    m = sum(nums) / len(nums)
    var = sum((x - m) ** 2 for x in nums) / len(nums)
    return [round(var, 4), round(math.sqrt(var), 4)]
`,
  },
  {
    id: "ml_normalise", track: "ml", level: "beginner", title: "Min-Max Normalisation", type: "function", func: "normalise",
    description: `<p><strong>Why it matters:</strong> if one feature is "house size in m²" (hundreds) and another is "number of bedrooms" (single digits), many models will think size matters far more just because its numbers are bigger. <em>Min-max normalisation</em> rescales every feature to the range 0 to 1 so they're on a level playing field.</p>
<p>Write <code>normalise(nums)</code> that maps each value with <code>(x - min) / (max - min)</code>, rounded to 3 decimal places.</p>
<ul><li>If every value is the same (so <code>max - min</code> is 0), return a list of <code>0.0</code>s of the same length.</li></ul>
<pre>normalise([10, 20, 30])  → [0.0, 0.5, 1.0]</pre>`,
    starter: `def normalise(nums):
    pass
`,
    tests: [
      { args: [[10, 20, 30]], expected: [0.0, 0.5, 1.0] },
      { args: [[5, 1, 3]], expected: [1.0, 0.0, 0.5] },
      { args: [[7, 7]], expected: [0.0, 0.0] },
      { args: [[-2, 0, 2, 6]], expected: [0.0, 0.25, 0.5, 1.0], hidden: true },
      { args: [[1, 2, 4]], expected: [0.0, 0.333, 1.0], hidden: true },
    ],
    hints: [
      "Find <code>lo = min(nums)</code> and <code>hi = max(nums)</code> once, before the loop.",
      "Guard against dividing by zero: <code>if hi == lo: return [0.0] * len(nums)</code>.",
      "A list comprehension does the rest: <code>[round((x - lo) / (hi - lo), 3) for x in nums]</code>.",
    ],
    solution: `def normalise(nums):
    lo, hi = min(nums), max(nums)
    if hi == lo:
        return [0.0] * len(nums)
    return [round((x - lo) / (hi - lo), 3) for x in nums]
`,
  },
  {
    id: "ml_split", track: "ml", level: "beginner", title: "Train/Test Split", type: "function", func: "train_test_split",
    description: `<p><strong>Why it matters:</strong> you can't judge a model on the same data it learned from: it might just have memorised the answers. So we hold back a <em>test set</em> it never sees during training, then measure it on that.</p>
<p>Write <code>train_test_split(data, test_ratio)</code> returning <code>[train, test]</code>:</p>
<ul><li>The number of test items is <code>int(len(data) * test_ratio)</code> (rounded down).</li>
<li>The test set is the <strong>last</strong> that-many items; the training set is everything before them. Keep the original order.</li></ul>
<pre>train_test_split([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0.2)
→ [[1, 2, 3, 4, 5, 6, 7, 8], [9, 10]]</pre>
<p class="note">Real libraries shuffle the data first. We skip shuffling so the answers are predictable.</p>`,
    starter: `def train_test_split(data, test_ratio):
    pass
`,
    tests: [
      { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0.2], expected: [[1, 2, 3, 4, 5, 6, 7, 8], [9, 10]] },
      { args: [["a", "b", "c", "d"], 0.5], expected: [["a", "b"], ["c", "d"]] },
      { args: [[1, 2, 3], 0.5], expected: [[1, 2], [3]] },
      { args: [[1, 2, 3, 4, 5], 0], expected: [[1, 2, 3, 4, 5], []], hidden: true },
      { args: [[1, 2, 3, 4, 5, 6, 7], 0.3], expected: [[1, 2, 3, 4, 5], [6, 7]], hidden: true },
    ],
    hints: [
      "Work out how many go in the test set: <code>n_test = int(len(data) * test_ratio)</code>.",
      "The split point is <code>cut = len(data) - n_test</code>.",
      "Slicing does the rest: <code>[data[:cut], data[cut:]]</code>. (Careful: <code>data[-0:]</code> is the whole list, which is why <code>cut</code> is safer.)",
    ],
    solution: `def train_test_split(data, test_ratio):
    n_test = int(len(data) * test_ratio)
    cut = len(data) - n_test
    return [data[:cut], data[cut:]]
`,
  },
  {
    id: "ml_distance", track: "ml", level: "intermediate", title: "Euclidean Distance", type: "function", func: "euclidean",
    description: `<p><strong>Why it matters:</strong> in ML, each example is a list of numbers (a <em>vector</em>), so it's a point in space. "How similar are two examples?" becomes "how far apart are the points?". Euclidean distance is the straight-line distance, and it powers k-nearest-neighbours, clustering and more.</p>
<p>Write <code>euclidean(a, b)</code> for two equal-length lists: the square root of the sum of squared differences, rounded to 4 decimal places.</p>
<pre>euclidean([0, 0], [3, 4])  → 5.0
euclidean([1, 1], [2, 2])  → 1.4142</pre>`,
    starter: `def euclidean(a, b):
    pass
`,
    tests: [
      { args: [[0, 0], [3, 4]], expected: 5.0 },
      { args: [[1, 2, 3], [4, 6, 3]], expected: 5.0 },
      { args: [[1, 1], [2, 2]], expected: 1.4142 },
      { args: [[0, 0, 0, 0], [1, 1, 1, 1]], expected: 2.0, hidden: true },
      { args: [[-1, 5], [2, 1]], expected: 5.0, hidden: true },
      { args: [[0.5], [0.25]], expected: 0.25, hidden: true },
    ],
    hints: [
      "<code>zip(a, b)</code> pairs up matching positions: <code>for x, y in zip(a, b):</code>.",
      "Add up <code>(x - y) ** 2</code> for every pair.",
      "Finish with <code>round(math.sqrt(total), 4)</code> (remember <code>import math</code>).",
    ],
    solution: `import math

def euclidean(a, b):
    total = sum((x - y) ** 2 for x, y in zip(a, b))
    return round(math.sqrt(total), 4)
`,
  },
  {
    id: "ml_mse", track: "ml", level: "intermediate", title: "Mean Squared Error", type: "function", func: "mse",
    description: `<p><strong>Why it matters:</strong> a model needs a single number that says "how wrong am I?". That number is the <em>loss</em>. Mean squared error (MSE) is the standard loss for predicting numbers: square each error (so negatives don't cancel and big mistakes hurt more), then average.</p>
<p>Write <code>mse(y_true, y_pred)</code> returning the mean of <code>(true - pred)²</code>, rounded to 4 decimal places.</p>
<pre>mse([1, 2, 3], [2, 2, 4])  → 0.6667</pre>`,
    starter: `def mse(y_true, y_pred):
    pass
`,
    tests: [
      { args: [[1, 2, 3], [1, 2, 3]], expected: 0.0 },
      { args: [[1, 2, 3], [2, 2, 4]], expected: 0.6667 },
      { args: [[0, 0], [3, 4]], expected: 12.5 },
      { args: [[2.5, 0.0, 2, 8], [3, -0.5, 2, 7]], expected: 0.375, hidden: true },
      { args: [[10], [7]], expected: 9.0, hidden: true },
    ],
    hints: [
      "Pair each true value with its prediction using <code>zip(y_true, y_pred)</code>.",
      "Square each difference: <code>(t - p) ** 2</code>, and add them up.",
      "Divide by <code>len(y_true)</code> and <code>round(..., 4)</code>.",
    ],
    solution: `def mse(y_true, y_pred):
    total = sum((t - p) ** 2 for t, p in zip(y_true, y_pred))
    return round(total / len(y_true), 4)
`,
  },
  {
    id: "ml_metrics", track: "ml", level: "intermediate", title: "Accuracy, Precision and Recall", type: "function", func: "metrics",
    description: `<p><strong>Why it matters:</strong> for a yes/no classifier (spam or not, fraud or not), accuracy alone can mislead: if only 1% of emails are spam, a model that always says "not spam" is 99% accurate and useless. <em>Precision</em> asks "when I said yes, how often was I right?" and <em>recall</em> asks "of all the real yeses, how many did I catch?".</p>
<p>Labels are <code>1</code> (positive) or <code>0</code> (negative). Count:</p>
<ul><li><strong>TP</strong>: true 1, predicted 1 &nbsp; <strong>FP</strong>: true 0, predicted 1 &nbsp; <strong>FN</strong>: true 1, predicted 0</li></ul>
<p>Write <code>metrics(y_true, y_pred)</code> returning <code>[accuracy, precision, recall]</code>, each rounded to 3 decimal places:</p>
<ul><li>accuracy = correct predictions / total</li>
<li>precision = TP / (TP + FP), or <code>0.0</code> if the model never predicted 1</li>
<li>recall = TP / (TP + FN), or <code>0.0</code> if there are no real 1s</li></ul>
<pre>metrics([1, 0, 1, 1, 0], [1, 0, 0, 1, 1])  → [0.6, 0.667, 0.667]</pre>`,
    starter: `def metrics(y_true, y_pred):
    pass
`,
    tests: [
      { args: [[1, 0, 1, 1, 0], [1, 0, 0, 1, 1]], expected: [0.6, 0.667, 0.667] },
      { args: [[1, 1, 0, 0], [1, 1, 0, 0]], expected: [1.0, 1.0, 1.0] },
      { args: [[0, 0, 1], [0, 0, 0]], expected: [0.667, 0.0, 0.0] },
      { args: [[1, 0, 1, 0], [1, 1, 1, 1]], expected: [0.5, 0.5, 1.0], hidden: true },
      { args: [[0, 0], [0, 0]], expected: [1.0, 0.0, 0.0], hidden: true },
      { args: [[1, 1, 1, 0], [1, 0, 0, 0]], expected: [0.5, 1.0, 0.333], hidden: true },
    ],
    hints: [
      "Loop over <code>zip(y_true, y_pred)</code> and keep counters for TP, FP and FN (and correct answers).",
      "Accuracy is <code>correct / len(y_true)</code>. Check <code>tp + fp &gt; 0</code> before dividing for precision.",
      "Likewise check <code>tp + fn &gt; 0</code> for recall, and round all three to 3 places.",
    ],
    solution: `def metrics(y_true, y_pred):
    tp = fp = fn = correct = 0
    for t, p in zip(y_true, y_pred):
        if t == p:
            correct += 1
        if t == 1 and p == 1:
            tp += 1
        elif t == 0 and p == 1:
            fp += 1
        elif t == 1 and p == 0:
            fn += 1
    accuracy = correct / len(y_true)
    precision = tp / (tp + fp) if tp + fp > 0 else 0.0
    recall = tp / (tp + fn) if tp + fn > 0 else 0.0
    return [round(accuracy, 3), round(precision, 3), round(recall, 3)]
`,
  },
  {
    id: "ml_gradient_step", track: "ml", level: "advanced", title: "One Step of Gradient Descent", type: "function", func: "gradient_step",
    description: `<p><strong>Why it matters:</strong> this is how almost every model learns, from a straight line to GPT. Work out which direction makes the loss smaller (the <em>gradient</em>), then nudge the parameters a small step that way. Repeat thousands of times.</p>
<p>Our model is a line, <code>y = w*x + b</code>, and the loss is mean squared error. For <code>n</code> points, with <code>error = (w*x + b) - y</code>:</p>
<ul><li><code>grad_w = (2/n) × Σ error × x</code></li>
<li><code>grad_b = (2/n) × Σ error</code></li>
<li><code>new_w = w - lr × grad_w</code>, &nbsp; <code>new_b = b - lr × grad_b</code></li></ul>
<p>Write <code>gradient_step(xs, ys, w, b, lr)</code> returning <code>[new_w, new_b]</code>, each rounded to 4 decimal places. <code>lr</code> is the <em>learning rate</em> (step size).</p>
<pre>gradient_step([1, 2, 3], [2, 4, 6], 0, 0, 0.1)  → [1.8667, 0.8]</pre>`,
    starter: `def gradient_step(xs, ys, w, b, lr):
    pass
`,
    tests: [
      { args: [[1, 2, 3], [2, 4, 6], 0, 0, 0.1], expected: [1.8667, 0.8] },
      { args: [[1, 2], [3, 5], 2, 1, 0.5], expected: [2.0, 1.0] },
      { args: [[0, 1], [1, 1], 0, 0, 0.25], expected: [0.25, 0.5] },
      { args: [[1, 2, 3, 4], [1, 1, 1, 1], 1, 0, 0.01], expected: [0.9, -0.03], hidden: true },
      { args: [[2], [10], 1, 1, 0.1], expected: [3.8, 2.4], hidden: true },
    ],
    hints: [
      "Loop over <code>zip(xs, ys)</code>, compute <code>error = (w * x + b) - y</code>, and add up <code>error * x</code> and <code>error</code> separately.",
      "Multiply both totals by <code>2 / n</code> to get <code>grad_w</code> and <code>grad_b</code>.",
      "Step <em>against</em> the gradient: <code>w - lr * grad_w</code> (minus, not plus), then round.",
    ],
    solution: `def gradient_step(xs, ys, w, b, lr):
    n = len(xs)
    sum_ex = 0
    sum_e = 0
    for x, y in zip(xs, ys):
        error = (w * x + b) - y
        sum_ex += error * x
        sum_e += error
    grad_w = 2 / n * sum_ex
    grad_b = 2 / n * sum_e
    return [round(w - lr * grad_w, 4), round(b - lr * grad_b, 4)]
`,
  },
  {
    id: "ml_linear_regression", track: "ml", level: "advanced", title: "Simple Linear Regression", type: "function", func: "fit_line",
    description: `<p><strong>Why it matters:</strong> linear regression is the "hello world" of machine learning: find the straight line that best fits some data, then use it to predict. For a single feature there's an exact formula (<em>least squares</em>), so no gradient descent is needed.</p>
<p>With <code>mx</code> and <code>my</code> the means of the xs and ys:</p>
<ul><li><code>w = Σ (x - mx)(y - my) / Σ (x - mx)²</code></li>
<li><code>b = my - w × mx</code></li></ul>
<p>Write <code>fit_line(xs, ys)</code> returning <code>[w, b]</code>, each rounded to 4 decimal places. You can assume the xs are not all the same.</p>
<pre>fit_line([1, 2, 3, 4], [2, 3, 5, 4])  → [0.8, 1.5]</pre>`,
    starter: `def fit_line(xs, ys):
    pass
`,
    tests: [
      { args: [[1, 2, 3], [2, 4, 6]], expected: [2.0, 0.0] },
      { args: [[0, 1, 2, 3], [1, 3, 5, 7]], expected: [2.0, 1.0] },
      { args: [[1, 2, 3, 4], [2, 3, 5, 4]], expected: [0.8, 1.5] },
      { args: [[1, 2, 3], [5, 5, 5]], expected: [0.0, 5.0], hidden: true },
      { args: [[2, 4, 6, 8], [1, 2, 2, 3]], expected: [0.3, 0.5], hidden: true },
    ],
    hints: [
      "Start with the means: <code>mx = sum(xs) / len(xs)</code>, and the same for <code>my</code>.",
      "Build the top and bottom of the fraction in one loop over <code>zip(xs, ys)</code>: <code>num += (x - mx) * (y - my)</code>, <code>den += (x - mx) ** 2</code>.",
      "<code>w = num / den</code>, then <code>b = my - w * mx</code>. Round both at the very end.",
    ],
    solution: `def fit_line(xs, ys):
    mx = sum(xs) / len(xs)
    my = sum(ys) / len(ys)
    num = 0
    den = 0
    for x, y in zip(xs, ys):
        num += (x - mx) * (y - my)
        den += (x - mx) ** 2
    w = num / den
    b = my - w * mx
    return [round(w, 4), round(b, 4)]
`,
  },
  {
    id: "ml_knn", track: "ml", level: "advanced", title: "k-Nearest Neighbours", type: "function", func: "knn_classify",
    description: `<p><strong>Why it matters:</strong> k-NN is the simplest classifier there is: to label a new point, find the <code>k</code> training points closest to it and let them vote. No training step at all, just distances.</p>
<p>Write <code>knn_classify(points, labels, query, k)</code>:</p>
<ul><li><code>points</code> is a list of vectors, <code>labels[i]</code> is the label of <code>points[i]</code>, <code>query</code> is the new vector.</li>
<li>Use Euclidean distance. Sort neighbours by distance; if two are exactly as far away, the one with the <strong>lower index</strong> comes first.</li>
<li>Take the first <code>k</code> and return the most common label. If labels tie on votes, return the tied label whose neighbour appears <strong>first</strong> in the sorted list (i.e. the closest one).</li></ul>
<pre>points = [[0, 0], [1, 0], [0, 1], [5, 5], [6, 5]]
labels = ["a", "a", "a", "b", "b"]
knn_classify(points, labels, [0.5, 0.5], 3)  → "a"</pre>`,
    starter: `def knn_classify(points, labels, query, k):
    pass
`,
    tests: [
      { args: [[[0, 0], [1, 0], [0, 1], [5, 5], [6, 5]], ["a", "a", "a", "b", "b"], [0.5, 0.5], 3], expected: "a" },
      { args: [[[0, 0], [1, 0], [0, 1], [5, 5], [6, 5]], ["a", "a", "a", "b", "b"], [5, 6], 3], expected: "b" },
      { args: [[[0, 0], [1, 0], [0, 1], [5, 5], [6, 5]], ["a", "a", "a", "b", "b"], [4, 4], 1], expected: "b" },
      { args: [[[0], [3], [10]], ["x", "y", "z"], [1], 2], expected: "x", hidden: true },
      { args: [[[0], [3], [10]], ["x", "y", "z"], [2], 2], expected: "y", hidden: true },
      { args: [[[1], [3]], ["p", "q"], [2], 1], expected: "p", hidden: true },
    ],
    hints: [
      "Build a list of <code>(distance, index)</code> tuples. <code>math.dist(p, query)</code> gives Euclidean distance.",
      "Sorting tuples sorts by distance first, then by index, which is exactly the tiebreak you need. Take the first <code>k</code>.",
      "Count votes with a dict, find the top count, then walk the <em>sorted</em> neighbours and return the first label with that count.",
    ],
    solution: `import math

def knn_classify(points, labels, query, k):
    dists = []
    for i, p in enumerate(points):
        dists.append((math.dist(p, query), i))
    dists.sort()
    nearest = [labels[i] for d, i in dists[:k]]
    votes = {}
    for lab in nearest:
        votes[lab] = votes.get(lab, 0) + 1
    best = max(votes.values())
    for lab in nearest:
        if votes[lab] == best:
            return lab
`,
  },

  // ───────────────────── BUILD YOUR OWN TINY GPT ─────────────────────
  {
    id: "ml_gpt_tokenizer", track: "gpt", level: "intermediate", title: "Tiny GPT 1: Character Tokenizer", type: "script",
    description: `<p><strong>Where this fits:</strong> a GPT can't read letters, only numbers. A <em>tokenizer</em> turns text into a list of integer ids before it goes into the model, and turns the model's ids back into text afterwards. Real GPTs use sub-word tokens; we'll use single characters, which works the same way.</p>
<p>Write three functions:</p>
<ul><li><code>build_vocab(text)</code>: a <strong>sorted</strong> list of the unique characters in <code>text</code>. A character's id is its position in this list.</li>
<li><code>encode(text, vocab)</code>: the list of ids for each character of <code>text</code>.</li>
<li><code>decode(ids, vocab)</code>: the string those ids stand for.</li></ul>
<pre>vocab = build_vocab("hello")     → ['e', 'h', 'l', 'o']
encode("hello", vocab)           → [1, 0, 2, 2, 3]
decode([1, 0, 2, 2, 3], vocab)   → 'hello'</pre>`,
    starter: `def build_vocab(text):
    pass


def encode(text, vocab):
    pass


def decode(ids, vocab):
    pass
`,
    tests: [
      { code: `build_vocab("hello")`, expected: ["e", "h", "l", "o"] },
      { code: `encode("hello", build_vocab("hello"))`, expected: [1, 0, 2, 2, 3] },
      { code: `decode([1, 0, 2, 2, 3], ["e", "h", "l", "o"])`, expected: "hello" },
      { code: `v = build_vocab("to be or not")\ndecode(encode("be not", v), v)`, expected: "be not", hidden: true },
      { code: `build_vocab("banana")`, expected: ["a", "b", "n"], hidden: true },
      { code: `encode("", ["a"])`, expected: [], hidden: true },
    ],
    hints: [
      "<code>set(text)</code> gives the unique characters; wrap it in <code>sorted()</code> to get a list in a fixed order.",
      "For encoding, a lookup dict is fast: <code>stoi = {ch: i for i, ch in enumerate(vocab)}</code> (\"string to integer\").",
      "Decoding is indexing: <code>\"\".join(vocab[i] for i in ids)</code>.",
    ],
    solution: `def build_vocab(text):
    return sorted(set(text))


def encode(text, vocab):
    stoi = {ch: i for i, ch in enumerate(vocab)}
    return [stoi[ch] for ch in text]


def decode(ids, vocab):
    return "".join(vocab[i] for i in ids)
`,
  },
  {
    id: "ml_gpt_bigrams", track: "gpt", level: "intermediate", title: "Tiny GPT 2: Bigram Counts", type: "function", func: "bigram_counts",
    description: `<p><strong>Where this fits:</strong> a language model's whole job is to predict "what comes next?". The simplest possible model only looks at the <em>current</em> character and asks which characters followed it in the training text. That's a <em>bigram</em> model. A GPT does the same job, just looking at far more context.</p>
<p>Write <code>bigram_counts(text)</code> returning a nested dict: <code>counts[a][b]</code> is how many times character <code>b</code> came straight after character <code>a</code>. Only include pairs that actually occur.</p>
<pre>bigram_counts("hello")
→ {'h': {'e': 1}, 'e': {'l': 1}, 'l': {'l': 1, 'o': 1}}</pre>`,
    starter: `def bigram_counts(text):
    pass
`,
    tests: [
      { args: ["hello"], expected: { h: { e: 1 }, e: { l: 1 }, l: { l: 1, o: 1 } } },
      { args: ["abab"], expected: { a: { b: 2 }, b: { a: 1 } } },
      { args: ["a"], expected: {} },
      { args: ["aaa"], expected: { a: { a: 2 } }, hidden: true },
      { args: ["the cat"], expected: { t: { h: 1 }, h: { e: 1 }, e: { " ": 1 }, " ": { c: 1 }, c: { a: 1 }, a: { t: 1 } }, hidden: true },
    ],
    hints: [
      "Pairs of neighbours: <code>zip(text, text[1:])</code> gives <code>(a, b)</code> for every adjacent pair.",
      "Create the inner dict the first time you see <code>a</code>: <code>counts.setdefault(a, {})</code>.",
      "Then add one: <code>inner[b] = inner.get(b, 0) + 1</code>.",
    ],
    solution: `def bigram_counts(text):
    counts = {}
    for a, b in zip(text, text[1:]):
        inner = counts.setdefault(a, {})
        inner[b] = inner.get(b, 0) + 1
    return counts
`,
  },
  {
    id: "ml_gpt_probs", track: "gpt", level: "intermediate", title: "Tiny GPT 3: Next-Character Probabilities", type: "function", func: "next_char_probs",
    description: `<p><strong>Where this fits:</strong> counts aren't predictions yet. A GPT's final output is a <em>probability distribution</em> over its whole vocabulary: "40% chance the next token is 'e', 25% it's 'a'…". Here we turn bigram counts into those probabilities by dividing each count by the total.</p>
<p>Write <code>next_char_probs(text, ch)</code> returning a dict mapping each character that followed <code>ch</code> in <code>text</code> to its probability, rounded to 4 decimal places. If <code>ch</code> is never followed by anything, return <code>{}</code>.</p>
<pre>next_char_probs("hello", "l")  → {'l': 0.5, 'o': 0.5}</pre>`,
    starter: `def next_char_probs(text, ch):
    pass
`,
    tests: [
      { args: ["hello", "l"], expected: { l: 0.5, o: 0.5 } },
      { args: ["abacad", "a"], expected: { b: 0.3333, c: 0.3333, d: 0.3333 } },
      { args: ["hello", "o"], expected: {} },
      { args: ["abbbc", "b"], expected: { b: 0.6667, c: 0.3333 }, hidden: true },
      { args: ["banana", "n"], expected: { a: 1.0 }, hidden: true },
      { args: ["aab", "a"], expected: { a: 0.5, b: 0.5 }, hidden: true },
    ],
    hints: [
      "Count only the pairs that start with <code>ch</code>: loop over <code>zip(text, text[1:])</code> and skip the rest.",
      "The total is <code>sum(counts.values())</code>. If there are no counts, return <code>{}</code> straight away.",
      "Build the answer with <code>{c: round(n / total, 4) for c, n in counts.items()}</code>.",
    ],
    solution: `def next_char_probs(text, ch):
    counts = {}
    for a, b in zip(text, text[1:]):
        if a == ch:
            counts[b] = counts.get(b, 0) + 1
    total = sum(counts.values())
    if total == 0:
        return {}
    return {c: round(n / total, 4) for c, n in counts.items()}
`,
  },
  {
    id: "ml_gpt_generate", track: "gpt", level: "advanced", title: "Tiny GPT 4: Greedy Text Generation", type: "function", func: "generate",
    description: `<p><strong>Where this fits:</strong> generating text is a loop: predict the next token, append it, feed the result back in, repeat. That's exactly what ChatGPT does when it "types" an answer. Choosing the single most likely token each time is called <em>greedy decoding</em>. (Real models usually <em>sample</em> instead, because greedy decoding tends to get stuck in loops, as you'll see.)</p>
<p>Write <code>generate(text, start, length)</code>:</p>
<ul><li>Learn bigram counts from <code>text</code>.</li>
<li>Begin with the one-character string <code>start</code>, then add up to <code>length</code> more characters.</li>
<li>Each new character is the one that most often followed the <strong>current last character</strong>. If several tie, pick the alphabetically smallest.</li>
<li>If the last character was never followed by anything, stop early.</li></ul>
<pre>generate("abab", "a", 3)   → "abab"
generate("hello", "h", 4)  → "helll"   (stuck in a loop!)</pre>`,
    starter: `def generate(text, start, length):
    pass
`,
    tests: [
      { args: ["abab", "a", 3], expected: "abab" },
      { args: ["hello", "h", 4], expected: "helll" },
      { args: ["hello", "o", 3], expected: "o" },
      { args: ["the then there", "t", 5], expected: "the th", hidden: true },
      { args: ["abc", "a", 0], expected: "a", hidden: true },
    ],
    hints: [
      "Reuse your bigram counting from step 2 to build <code>counts[a][b]</code>.",
      "Loop <code>length</code> times; look up <code>counts.get(out[-1])</code> and <code>break</code> if it's missing.",
      "For the tiebreak, sort the options by <em>highest count, then letter</em>: <code>min(options, key=lambda c: (-options[c], c))</code>.",
    ],
    solution: `def generate(text, start, length):
    counts = {}
    for a, b in zip(text, text[1:]):
        inner = counts.setdefault(a, {})
        inner[b] = inner.get(b, 0) + 1
    out = start
    for _ in range(length):
        options = counts.get(out[-1])
        if not options:
            break
        out += min(options, key=lambda c: (-options[c], c))
    return out
`,
  },
  {
    id: "ml_gpt_softmax", track: "gpt", level: "intermediate", title: "Tiny GPT 5: Stable Softmax", type: "function", func: "softmax",
    description: `<p><strong>Where this fits:</strong> a neural network outputs raw scores called <em>logits</em>, which can be any size and any sign. <em>Softmax</em> turns them into probabilities that are all positive and add up to 1. GPT uses it twice: inside every attention layer, and at the very end to pick the next token.</p>
<p>The formula is <code>softmax(x)ᵢ = exp(xᵢ) / Σ exp(xⱼ)</code>. But <code>math.exp(1000)</code> overflows! The trick: subtract the largest logit from every logit first. This gives exactly the same answer but keeps the numbers small.</p>
<p>Write <code>softmax(logits)</code> returning a list of probabilities, each rounded to 4 decimal places.</p>
<pre>softmax([1, 2, 3])        → [0.09, 0.2447, 0.6652]
softmax([1000, 1000])     → [0.5, 0.5]</pre>`,
    starter: `import math

def softmax(logits):
    pass
`,
    tests: [
      { args: [[1, 2, 3]], expected: [0.09, 0.2447, 0.6652] },
      { args: [[0, 0]], expected: [0.5, 0.5] },
      { args: [[1000, 1000]], expected: [0.5, 0.5] },
      { args: [[1000, 1001, 1002]], expected: [0.09, 0.2447, 0.6652], hidden: true },
      { args: [[-5]], expected: [1.0], hidden: true },
      { args: [[2, 2, 2, 2]], expected: [0.25, 0.25, 0.25, 0.25], hidden: true },
    ],
    hints: [
      "Find <code>m = max(logits)</code> first.",
      "Exponentiate the shifted values: <code>exps = [math.exp(x - m) for x in logits]</code>. The biggest becomes <code>exp(0) = 1</code>, so nothing overflows.",
      "Divide each by <code>sum(exps)</code> and round to 4 places.",
    ],
    solution: `import math

def softmax(logits):
    m = max(logits)
    exps = [math.exp(x - m) for x in logits]
    total = sum(exps)
    return [round(e / total, 4) for e in exps]
`,
  },
  {
    id: "ml_gpt_attention", track: "gpt", level: "advanced", title: "Tiny GPT 6: Scaled Dot-Product Attention", type: "function", func: "attention",
    description: `<p><strong>Where this fits:</strong> attention is the "T" in GPT (Transformer), and it's what lets the model look back over <em>all</em> previous tokens instead of just the last one, unlike our bigram model. Each token makes a <em>query</em> ("what am I looking for?"); every earlier token offers a <em>key</em> ("what do I contain?") and a <em>value</em> ("what I'll pass on"). Query-key matches decide how much of each value to blend in.</p>
<p>Write <code>attention(query, keys, values)</code>:</p>
<ol><li>For each key, score = dot product of <code>query</code> and the key, divided by <code>√d</code> where <code>d = len(query)</code> (this scaling stops scores growing too large).</li>
<li>Turn the scores into weights with a (stable) softmax.</li>
<li>Return the weighted sum of the value vectors: element <code>j</code> is <code>Σ weightᵢ × values[i][j]</code>, rounded to 4 decimal places.</li></ol>
<pre>attention([1, 0], [[1, 0], [0, 1]], [[10, 0], [0, 10]])
→ [6.6976, 3.3024]   (the first key matches best, so its value dominates)</pre>
<p class="note">Don't round the softmax weights: only round the final answer.</p>`,
    starter: `import math

def attention(query, keys, values):
    pass
`,
    tests: [
      { args: [[1, 0], [[1, 0], [0, 1]], [[10, 0], [0, 10]]], expected: [6.6976, 3.3024] },
      { args: [[0, 0], [[1, 2], [3, 4]], [[2, 4], [4, 8]]], expected: [3.0, 6.0] },
      { args: [[1, 1], [[5, 5]], [[1, 2, 3]]], expected: [1.0, 2.0, 3.0] },
      { args: [[1, 2, 3], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [[1, 0], [0, 1], [1, 1]]], expected: [0.7008, 0.8321], hidden: true },
      { args: [[10, 10], [[1, 1], [-1, -1]], [[1], [0]]], expected: [1.0], hidden: true },
    ],
    hints: [
      "Scores: <code>[sum(q * k for q, k in zip(query, key)) / math.sqrt(len(query)) for key in keys]</code>.",
      "Softmax them the stable way (subtract the max), but <em>don't</em> round the weights yet.",
      "For each column <code>j</code> in <code>range(len(values[0]))</code>, add up <code>weights[i] * values[i][j]</code> over every <code>i</code>, then round.",
    ],
    solution: `import math

def attention(query, keys, values):
    d = len(query)
    scores = [sum(q * k for q, k in zip(query, key)) / math.sqrt(d) for key in keys]
    m = max(scores)
    exps = [math.exp(s - m) for s in scores]
    total = sum(exps)
    weights = [e / total for e in exps]
    out = []
    for j in range(len(values[0])):
        out.append(round(sum(weights[i] * values[i][j] for i in range(len(values))), 4))
    return out
`,
  },
];
