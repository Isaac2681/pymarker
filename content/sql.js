// PyMarker SQL problem bank.
// Each problem's `solution` and the learner's query are run against the same SQLite database
// (built from `setup`, then again from `hiddenSetup` if present) and the result sets compared.
// Column names are ignored; column count/order and row values matter. Floats compared to 2 dp.
// `ordered: true` means row order is checked too (only when the task asks for an ORDER BY).

// ───────────────────────────── DATASETS ─────────────────────────────

const LIBRARY = `CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT,
  author TEXT,
  genre TEXT,
  published_year INTEGER,
  copies INTEGER
);
INSERT INTO books VALUES
  (1, 'The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 1937, 4),
  (2, 'Pride and Prejudice', 'Jane Austen', 'Romance', 1813, 3),
  (3, '1984', 'George Orwell', 'Dystopian', 1949, 5),
  (4, 'The Gruffalo', 'Julia Donaldson', 'Children', 1999, 6),
  (5, 'Brave New World', 'Aldous Huxley', 'Dystopian', 1932, 2),
  (6, 'Matilda', 'Roald Dahl', 'Children', 1988, 3),
  (7, 'The Night Circus', 'Erin Morgenstern', 'Fantasy', 2011, 1),
  (8, 'Emma', 'Jane Austen', 'Romance', 1815, 2),
  (9, 'Animal Farm', 'George Orwell', 'Dystopian', 1945, 4);`;

const LIBRARY_HIDDEN = `CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT,
  author TEXT,
  genre TEXT,
  published_year INTEGER,
  copies INTEGER
);
INSERT INTO books VALUES
  (1, 'The Lord of the Rings', 'J.R.R. Tolkien', 'Fantasy', 1954, 3),
  (2, 'Persuasion', 'Jane Austen', 'Romance', 1817, 1),
  (3, 'Fahrenheit 451', 'Ray Bradbury', 'Dystopian', 1953, 2),
  (4, 'The BFG', 'Roald Dahl', 'Children', 1982, 5),
  (5, 'Charlotte''s Web', 'E.B. White', 'Children', 1952, 4),
  (6, 'Dracula', 'Bram Stoker', 'Horror', 1897, 2),
  (7, 'The Secret Garden', 'Frances Hodgson Burnett', 'Children', 1911, 3),
  (8, 'Rebecca', 'Daphne du Maurier', 'Romance', 1938, 2);`;

const SCHOOL = `CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT,
  year_group INTEGER,
  house TEXT
);
INSERT INTO students VALUES
  (1, 'Amara', 10, 'Oak'),
  (2, 'Ben', 11, 'Ash'),
  (3, 'Chloe', 10, 'Ash'),
  (4, 'Dev', 11, 'Oak'),
  (5, 'Ella', 11, 'Elm'),
  (6, 'Finn', 10, 'Elm'),
  (7, 'Grace', 11, 'Oak'),
  (8, 'Harry', 10, 'Oak');
CREATE TABLE grades (
  student_id INTEGER,
  subject TEXT,
  score INTEGER
);
INSERT INTO grades VALUES
  (1, 'Maths', 82), (1, 'English', 77),
  (2, 'Maths', 65), (2, 'English', 70),
  (3, 'Maths', 91), (3, 'English', 68),
  (4, 'Maths', 65), (4, 'English', 88),
  (5, 'Maths', 74), (5, 'English', 74),
  (6, 'Maths', 58), (6, 'English', 49);`;

const SCHOOL_HIDDEN = `CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT,
  year_group INTEGER,
  house TEXT
);
INSERT INTO students VALUES
  (1, 'Isla', 11, 'Ash'),
  (2, 'Jamal', 10, 'Oak'),
  (3, 'Kai', 11, 'Elm'),
  (4, 'Lily', 10, 'Ash'),
  (5, 'Mo', 11, 'Oak'),
  (6, 'Nina', 11, 'Ash'),
  (7, 'Omar', 10, 'Elm');
CREATE TABLE grades (
  student_id INTEGER,
  subject TEXT,
  score INTEGER
);
INSERT INTO grades VALUES
  (1, 'Maths', 80), (1, 'English', 66),
  (2, 'Maths', 59), (2, 'English', 81),
  (3, 'Maths', 72), (3, 'English', 60),
  (4, 'Maths', 72), (4, 'English', 91),
  (5, 'Maths', 60), (5, 'English', 45);`;

const SHOP = `CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT,
  city TEXT
);
INSERT INTO customers VALUES
  (1, 'Priya', 'London'),
  (2, 'Tom', 'Leeds'),
  (3, 'Sofia', 'London'),
  (4, 'Jack', 'Bristol'),
  (5, 'Mei', 'Leeds'),
  (6, 'Oscar', 'York'),
  (7, 'Lucy', 'Bristol');
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT,
  category TEXT,
  price REAL
);
INSERT INTO products VALUES
  (1, 'Notebook', 'Stationery', 3.50),
  (2, 'Gel Pen', 'Stationery', 1.20),
  (3, 'Headphones', 'Electronics', 45.00),
  (4, 'USB Cable', 'Electronics', 6.99),
  (5, 'Desk Lamp', 'Electronics', 29.99),
  (6, 'Water Bottle', 'Bags', 12.50),
  (7, 'Backpack', 'Bags', 29.99),
  (8, 'Highlighters', 'Stationery', 2.75);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  order_date TEXT
);
INSERT INTO orders VALUES
  (1, 1, 3, 1, '2026-01-05'),
  (2, 1, 1, 4, '2026-01-05'),
  (3, 2, 5, 1, '2026-01-12'),
  (4, 3, 2, 10, '2026-02-02'),
  (5, 3, 6, 3, '2026-02-14'),
  (6, 4, 7, 1, '2026-02-20'),
  (7, 5, 4, 3, '2026-03-01'),
  (8, 2, 8, 2, '2026-03-03'),
  (9, 1, 6, 1, '2026-03-10');`;

const SHOP_HIDDEN = `CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT,
  city TEXT
);
INSERT INTO customers VALUES
  (1, 'Aisha', 'Manchester'),
  (2, 'Noah', 'Leeds'),
  (3, 'Zara', 'Manchester'),
  (4, 'Leo', 'Cardiff'),
  (5, 'Ruby', 'Glasgow'),
  (6, 'Sam', 'Cardiff');
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT,
  category TEXT,
  price REAL
);
INSERT INTO products VALUES
  (1, 'Pencil Case', 'Stationery', 4.00),
  (2, 'Ruler', 'Stationery', 0.90),
  (3, 'Keyboard', 'Electronics', 35.00),
  (4, 'Mouse', 'Electronics', 15.00),
  (5, 'Tote Bag', 'Bags', 8.00),
  (6, 'Lunch Box', 'Bags', 8.00),
  (7, 'Eraser', 'Stationery', 0.90),
  (8, 'Calculator', 'Electronics', 12.00);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  order_date TEXT
);
INSERT INTO orders VALUES
  (1, 1, 3, 1, '2026-04-02'),
  (2, 2, 1, 2, '2026-04-03'),
  (3, 2, 2, 5, '2026-04-03'),
  (4, 3, 4, 2, '2026-04-10'),
  (5, 4, 8, 1, '2026-04-18'),
  (6, 6, 5, 3, '2026-05-01'),
  (7, 1, 7, 4, '2026-05-06'),
  (8, 3, 3, 1, '2026-05-09');`;

const STARTER = `-- Write your query below\nSELECT `;

// ───────────────────────────── PROBLEMS ─────────────────────────────

globalThis.SQL_PROBLEMS = [
  // ───────────────────────────── BEGINNER ─────────────────────────────
  {
    id: "sql_select_all", level: "beginner", title: "Select Everything",
    description: `<p>Welcome to SQL! The school library keeps its books in a table called <code>books</code>.</p>
<p>Write a query that returns <strong>every column</strong> and <strong>every row</strong> of the <code>books</code> table.</p>
<p class="note">🎯 Practises: <code>SELECT *</code>, <code>FROM</code></p>`,
    setup: LIBRARY,
    hiddenSetup: LIBRARY_HIDDEN,
    starter: STARTER,
    solution: `SELECT * FROM books;`,
    ordered: false,
    hints: [
      "Every query starts with <code>SELECT</code> (what you want) and <code>FROM</code> (which table).",
      "The star <code>*</code> is shorthand for \"all the columns\".",
      "Put it together: <code>SELECT * FROM books;</code>",
    ],
  },
  {
    id: "sql_where", level: "beginner", title: "Old Classics",
    description: `<p>The librarian wants a list of older books. Return the <code>title</code> and <code>published_year</code>
(in that order) of every book published <strong>before 1950</strong>.</p>
<p class="note">🎯 Practises: choosing columns, <code>WHERE</code>, comparison operators</p>`,
    setup: LIBRARY,
    hiddenSetup: LIBRARY_HIDDEN,
    starter: STARTER,
    solution: `SELECT title, published_year FROM books WHERE published_year < 1950;`,
    ordered: false,
    hints: [
      "List the columns you want after <code>SELECT</code>, separated by commas.",
      "<code>WHERE</code> comes after <code>FROM</code> and keeps only the rows where the condition is true.",
      "<code>SELECT title, published_year FROM books WHERE published_year &lt; 1950;</code>",
    ],
  },
  {
    id: "sql_and_or", level: "beginner", title: "House Captains Shortlist",
    description: `<p>The head of Year 11 needs the students who could be house captain for <strong>Oak</strong> or <strong>Ash</strong>.</p>
<p>Return the <code>name</code> of every student in <strong>year 11</strong> who is in house <code>'Oak'</code>
<strong>or</strong> house <code>'Ash'</code>.</p>
<p class="note">⚠ Careful: <code>AND</code> is worked out before <code>OR</code>, just like × before + in maths.</p>
<p class="note">🎯 Practises: <code>AND</code>, <code>OR</code>, brackets</p>`,
    setup: SCHOOL,
    hiddenSetup: SCHOOL_HIDDEN,
    starter: STARTER,
    solution: `SELECT name FROM students WHERE year_group = 11 AND (house = 'Oak' OR house = 'Ash');`,
    ordered: false,
    hints: [
      "You need two conditions joined together: one about <code>year_group</code> and one about <code>house</code>.",
      "Text values go in single quotes: <code>house = 'Oak'</code>. Without brackets, <code>A AND B OR C</code> means <code>(A AND B) OR C</code> — is that what you want?",
      "<code>WHERE year_group = 11 AND (house = 'Oak' OR house = 'Ash')</code>. (<code>house IN ('Oak', 'Ash')</code> works too!)",
    ],
  },
  {
    id: "sql_order_by", level: "beginner", title: "Priciest First",
    description: `<p>The shop wants its price list sorted. Return the <code>name</code> and <code>price</code> of every product,
sorted by <strong>price, highest first</strong>.</p>
<p>If two products cost the same, sort those ones by <strong>name A–Z</strong>.</p>
<p class="note">✅ Row order is marked for this one.</p>
<p class="note">🎯 Practises: <code>ORDER BY</code>, <code>DESC</code>, sorting by two columns</p>`,
    setup: SHOP,
    hiddenSetup: SHOP_HIDDEN,
    starter: STARTER,
    solution: `SELECT name, price FROM products ORDER BY price DESC, name ASC;`,
    ordered: true,
    hints: [
      "<code>ORDER BY</code> goes at the end of the query. It sorts smallest-first unless you say otherwise.",
      "Add <code>DESC</code> after a column to sort it biggest-first. You can list a second column after a comma as a tiebreak.",
      "<code>SELECT name, price FROM products ORDER BY price DESC, name;</code>",
    ],
  },
  {
    id: "sql_limit", level: "beginner", title: "Pocket Money Picks",
    description: `<p>Return the <code>name</code> and <code>price</code> of the <strong>3 cheapest</strong> products,
cheapest first.</p>
<p>If two products cost the same, the one whose name comes first <strong>A–Z</strong> goes first.</p>
<p class="note">✅ Row order is marked for this one.</p>
<p class="note">🎯 Practises: <code>ORDER BY</code> with <code>LIMIT</code></p>`,
    setup: SHOP,
    hiddenSetup: SHOP_HIDDEN,
    starter: STARTER,
    solution: `SELECT name, price FROM products ORDER BY price ASC, name ASC LIMIT 3;`,
    ordered: true,
    hints: [
      "First sort the products so the cheapest are at the top.",
      "<code>LIMIT n</code> at the very end keeps only the first <em>n</em> rows. Don't forget the name tiebreak.",
      "<code>SELECT name, price FROM products ORDER BY price, name LIMIT 3;</code>",
    ],
  },
  {
    id: "sql_distinct", level: "beginner", title: "Where Are Our Customers?",
    description: `<p>Marketing wants to know which cities the shop's customers live in.</p>
<p>Return each <code>city</code> from the <code>customers</code> table <strong>once only</strong> — no repeats.</p>
<p class="note">🎯 Practises: <code>DISTINCT</code></p>`,
    setup: SHOP,
    hiddenSetup: SHOP_HIDDEN,
    starter: STARTER,
    solution: `SELECT DISTINCT city FROM customers;`,
    ordered: false,
    hints: [
      "Try <code>SELECT city FROM customers;</code> first — notice some cities appear more than once.",
      "The keyword <code>DISTINCT</code> removes duplicate rows from the result.",
      "<code>SELECT DISTINCT city FROM customers;</code>",
    ],
  },
  {
    id: "sql_like", level: "beginner", title: "The Title Hunt",
    description: `<p>A pupil remembers that the book they want \"starts with <em>The</em>\".</p>
<p>Return the <code>title</code> and <code>author</code> (in that order) of every book whose title <strong>starts with</strong> <code>The</code>.</p>
<p class="note">🎯 Practises: <code>LIKE</code> and the <code>%</code> wildcard</p>`,
    setup: LIBRARY,
    hiddenSetup: LIBRARY_HIDDEN,
    starter: STARTER,
    solution: `SELECT title, author FROM books WHERE title LIKE 'The %';`,
    ordered: false,
    hints: [
      "<code>=</code> only matches exact text. For patterns, use <code>LIKE</code>.",
      "In a <code>LIKE</code> pattern, <code>%</code> means \"any characters (or none)\". So <code>'%cat'</code> means \"ends with cat\".",
      "<code>SELECT title, author FROM books WHERE title LIKE 'The %';</code>",
    ],
  },

  // ───────────────────────────── INTERMEDIATE ─────────────────────────────
  {
    id: "sql_aggregates", level: "intermediate", title: "Stock Take Summary",
    description: `<p>The shop manager wants a one-line summary of the <code>products</code> table.</p>
<p>Return <strong>one row</strong> with three columns, in this order:</p>
<ol><li>how many products there are</li><li>the average price</li><li>the highest price</li></ol>
<p class="note">🎯 Practises: <code>COUNT</code>, <code>AVG</code>, <code>MAX</code></p>`,
    setup: SHOP,
    hiddenSetup: SHOP_HIDDEN,
    starter: STARTER,
    solution: `SELECT COUNT(*), AVG(price), MAX(price) FROM products;`,
    ordered: false,
    hints: [
      "Aggregate functions squash many rows into one value: <code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code>.",
      "<code>COUNT(*)</code> counts rows. You can put several aggregates in one <code>SELECT</code>, separated by commas.",
      "<code>SELECT COUNT(*), AVG(price), MAX(price) FROM products;</code>",
    ],
  },
  {
    id: "sql_group_by", level: "intermediate", title: "Books per Genre",
    description: `<p>How big is each section of the library? Return each <code>genre</code> and the <strong>number of books</strong>
in that genre (two columns, in that order).</p>
<p class="note">🎯 Practises: <code>GROUP BY</code> with <code>COUNT</code></p>`,
    setup: LIBRARY,
    hiddenSetup: LIBRARY_HIDDEN,
    starter: STARTER,
    solution: `SELECT genre, COUNT(*) FROM books GROUP BY genre;`,
    ordered: false,
    hints: [
      "<code>GROUP BY genre</code> puts all the rows with the same genre into one bucket.",
      "An aggregate like <code>COUNT(*)</code> is then worked out once per bucket.",
      "<code>SELECT genre, COUNT(*) FROM books GROUP BY genre;</code>",
    ],
  },
  {
    id: "sql_having", level: "intermediate", title: "Merit List",
    description: `<p>Students whose <strong>average score across all their subjects is 70 or more</strong> get a merit certificate.</p>
<p>Using the <code>grades</code> table, return the <code>student_id</code> and their <strong>average score</strong>
(two columns, in that order) for every student who qualifies.</p>
<p class="note">🎯 Practises: <code>GROUP BY</code> with <code>HAVING</code></p>`,
    setup: SCHOOL,
    hiddenSetup: SCHOOL_HIDDEN,
    starter: STARTER,
    solution: `SELECT student_id, AVG(score) FROM grades GROUP BY student_id HAVING AVG(score) >= 70;`,
    ordered: false,
    hints: [
      "Start by grouping the grades by <code>student_id</code> and selecting <code>AVG(score)</code>.",
      "<code>WHERE</code> filters rows <em>before</em> grouping, so it can't see averages. <code>HAVING</code> filters the groups <em>after</em>.",
      "<code>SELECT student_id, AVG(score) FROM grades GROUP BY student_id HAVING AVG(score) &gt;= 70;</code>",
    ],
  },
  {
    id: "sql_inner_join", level: "intermediate", title: "Who Bought What?",
    description: `<p>The <code>orders</code> table only stores ID numbers, which aren't very friendly. For every order, return:</p>
<ol><li>the customer's <code>name</code></li><li>the product's <code>name</code></li><li>the <code>quantity</code></li></ol>
<p>(three columns, in that order).</p>
<p class="note">🎯 Practises: <code>INNER JOIN</code> across three tables, table aliases</p>`,
    setup: SHOP,
    hiddenSetup: SHOP_HIDDEN,
    starter: STARTER,
    solution: `SELECT c.name, p.name, o.quantity
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN products p ON p.id = o.product_id;`,
    ordered: false,
    hints: [
      "<code>orders.customer_id</code> matches <code>customers.id</code>, and <code>orders.product_id</code> matches <code>products.id</code>.",
      "Both tables have a <code>name</code> column, so say which you mean. Short aliases help: <code>FROM orders o JOIN customers c ON c.id = o.customer_id</code>.",
      "<code>SELECT c.name, p.name, o.quantity FROM orders o JOIN customers c ON c.id = o.customer_id JOIN products p ON p.id = o.product_id;</code>",
    ],
  },
  {
    id: "sql_left_join", level: "intermediate", title: "Never Ordered",
    description: `<p>Some customers signed up but never bought anything. Return the <code>name</code> of every customer
who has <strong>no orders at all</strong>.</p>
<p class="note">🎯 Practises: <code>LEFT JOIN</code> and <code>IS NULL</code></p>`,
    setup: SHOP,
    hiddenSetup: SHOP_HIDDEN,
    starter: STARTER,
    solution: `SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;`,
    ordered: false,
    hints: [
      "An ordinary <code>JOIN</code> drops customers with no matching order. A <code>LEFT JOIN</code> keeps every customer.",
      "When a customer has no match, the order columns come back as <code>NULL</code>. Test for it with <code>IS NULL</code> (not <code>= NULL</code>).",
      "<code>SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;</code>",
    ],
  },
  {
    id: "sql_case_when", level: "intermediate", title: "Report Card Labels",
    description: `<p>Turn raw scores into report-card labels. For every row in <code>grades</code>, return
<code>student_id</code>, <code>subject</code>, <code>score</code> and a fourth column holding:</p>
<table class="mini"><tr><th>Score</th><th>Label</th></tr>
<tr><td>80 or more</td><td><code>Distinction</code></td></tr>
<tr><td>60 to 79</td><td><code>Pass</code></td></tr>
<tr><td>below 60</td><td><code>Fail</code></td></tr></table>
<p class="note">🎯 Practises: <code>CASE WHEN … THEN … ELSE … END</code></p>`,
    setup: SCHOOL,
    hiddenSetup: SCHOOL_HIDDEN,
    starter: STARTER,
    solution: `SELECT student_id, subject, score,
  CASE
    WHEN score >= 80 THEN 'Distinction'
    WHEN score >= 60 THEN 'Pass'
    ELSE 'Fail'
  END
FROM grades;`,
    ordered: false,
    hints: [
      "<code>CASE</code> is SQL's version of <code>if / elif / else</code>, and it produces a value you can put in <code>SELECT</code>.",
      "The <code>WHEN</code>s are checked top to bottom and the first true one wins — so check the highest band first. Labels must match exactly, capitals included.",
      "<code>CASE WHEN score &gt;= 80 THEN 'Distinction' WHEN score &gt;= 60 THEN 'Pass' ELSE 'Fail' END</code>",
    ],
  },

  // ───────────────────────────── ADVANCED ─────────────────────────────
  {
    id: "sql_subquery", level: "advanced", title: "Above Average",
    description: `<p>Return the <code>name</code> and <code>price</code> of every product that costs <strong>more than the
average price</strong> of all products.</p>
<p class="note">⚠ Don't type the average in by hand — a hidden test uses different products!</p>
<p class="note">🎯 Practises: a subquery inside <code>WHERE</code></p>`,
    setup: SHOP,
    hiddenSetup: SHOP_HIDDEN,
    starter: STARTER,
    solution: `SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);`,
    ordered: false,
    hints: [
      "<code>SELECT AVG(price) FROM products</code> works out the average on its own.",
      "You can put a whole query inside brackets and use it as a value: <code>WHERE price &gt; ( … )</code>.",
      "<code>SELECT name, price FROM products WHERE price &gt; (SELECT AVG(price) FROM products);</code>",
    ],
  },
  {
    id: "sql_window_rank", level: "advanced", title: "Subject Leaderboards",
    description: `<p>Build a leaderboard for each subject. Return four columns, in this order:</p>
<ol><li><code>subject</code></li><li>the student's <code>name</code></li><li><code>score</code></li>
<li>their <strong>rank within that subject</strong> — 1 for the highest score</li></ol>
<p>Students with equal scores in a subject share the same rank, and the next rank is skipped
(e.g. 1, 2, 2, 4).</p>
<p class="note">🎯 Practises: window functions — <code>RANK() OVER (PARTITION BY … ORDER BY …)</code>, plus a join</p>`,
    setup: SCHOOL,
    hiddenSetup: SCHOOL_HIDDEN,
    starter: STARTER,
    solution: `SELECT g.subject, s.name, g.score,
  RANK() OVER (PARTITION BY g.subject ORDER BY g.score DESC)
FROM grades g
JOIN students s ON s.id = g.student_id;`,
    ordered: false,
    hints: [
      "Join <code>grades</code> to <code>students</code> to get names. A window function then adds a value to each row <em>without</em> squashing rows like <code>GROUP BY</code> does.",
      "<code>PARTITION BY subject</code> restarts the ranking for each subject; <code>ORDER BY score DESC</code> puts the top score first. <code>RANK()</code> gives ties the same number (<code>ROW_NUMBER()</code> wouldn't).",
      "<code>RANK() OVER (PARTITION BY g.subject ORDER BY g.score DESC)</code> as the fourth column, after <code>g.subject, s.name, g.score</code>.",
    ],
  },
  {
    id: "sql_cte", level: "advanced", title: "Big Spenders",
    description: `<p>Work out how much each customer has spent: the total of <code>quantity × price</code> across all their orders.</p>
<p>Then return the <code>name</code> and <strong>total spent</strong> (two columns, in that order) of every customer whose total
is <strong>higher than the average total</strong> of customers who have ordered.</p>
<p class="note">Customers with no orders shouldn't count towards the average.</p>
<p class="note">🎯 Practises: a CTE — <code>WITH name AS ( … )</code> — reused in a subquery</p>`,
    setup: SHOP,
    hiddenSetup: SHOP_HIDDEN,
    starter: `-- Write your query below\nWITH spend AS (\n  SELECT \n)\nSELECT `,
    solution: `WITH spend AS (
  SELECT c.name, SUM(o.quantity * p.price) AS total
  FROM orders o
  JOIN customers c ON c.id = o.customer_id
  JOIN products p ON p.id = o.product_id
  GROUP BY c.id, c.name
)
SELECT name, total FROM spend WHERE total > (SELECT AVG(total) FROM spend);`,
    ordered: false,
    hints: [
      "Break it into two steps. Step 1: a query giving each customer's name and total spend (join all three tables, <code>GROUP BY</code> the customer).",
      "Wrap step 1 in a CTE: <code>WITH spend AS ( …step 1… )</code>. Now <code>spend</code> behaves like a table you can query — even twice.",
      "<code>… SELECT name, total FROM spend WHERE total &gt; (SELECT AVG(total) FROM spend);</code>",
    ],
  },
];
