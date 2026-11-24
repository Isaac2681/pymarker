// PyMarker: Low Level Design (object-oriented design) exercises.
// Same schema as challenges.js, plus `track: "lld"`. All are "script" type:
// each test builds objects after your code runs and checks the last expression.

const _lldRaises = (setup, call, exc) =>
  `${setup}\ntry:\n    ${call}\n    r = 'no error'\nexcept ${exc}:\n    r = '${exc}'\nr`;

globalThis.LLD_PROBLEMS = [
  {
    id: "lld_shapes", track: "lld", level: "intermediate", title: "Shapes: Abstract Base Class", type: "script",
    description: `<p><strong>Design idea:</strong> <em>inheritance and polymorphism</em>. Code that works with "any shape" shouldn't care which shape it has. An <em>abstract base class</em> defines the contract every shape must meet, and Python refuses to create a shape that doesn't meet it.</p>
<ul><li><code>Shape</code>: an abstract base class (inherit from <code>abc.ABC</code>) with an abstract method <code>area()</code>. <code>Shape()</code> must raise <code>TypeError</code>, as must any subclass that doesn't define <code>area()</code>.</li>
<li><code>Shape.describe()</code>: written <strong>once</strong> in the base class, returns <code>"&lt;ClassName&gt; with area &lt;area to 2 dp&gt;"</code>.</li>
<li><code>Circle(radius)</code>: area is <code>π × r²</code> (use <code>math.pi</code>).</li>
<li><code>Rectangle(width, height)</code>: area is width × height.</li>
<li><code>Square(side)</code>: a <strong>subclass of <code>Rectangle</code></strong>.</li></ul>
<pre>Square(5).describe()   → 'Square with area 25.00'
Circle(2).describe()   → 'Circle with area 12.57'</pre>`,
    starter: `from abc import ABC, abstractmethod
import math


class Shape:
    def area(self):
        pass

    def describe(self):
        pass


class Circle(Shape):
    def __init__(self, radius):
        pass


class Rectangle(Shape):
    pass


class Square:
    pass
`,
    tests: [
      { code: `round(Circle(1).area(), 4)`, expected: 3.1416 },
      { code: `Rectangle(3, 4).area()`, expected: 12 },
      { code: `Square(5).describe()`, expected: "Square with area 25.00" },
      { code: `Circle(2).describe()`, expected: "Circle with area 12.57" },
      { code: _lldRaises("", "Shape()", "TypeError"), expected: "TypeError", hidden: true },
      { code: `isinstance(Square(2), Rectangle)`, expected: true, hidden: true },
      { code: `shapes = [Rectangle(1, 2), Square(3)]\nsum(s.area() for s in shapes)`, expected: 11, hidden: true },
      { code: _lldRaises("class Blob(Shape):\n    pass", "Blob()", "TypeError"), expected: "TypeError", hidden: true },
    ],
    hints: [
      "<code>class Shape(ABC):</code> and put <code>@abstractmethod</code> on the line above <code>def area(self):</code>. Python then blocks <code>Shape()</code> for you.",
      "In <code>describe</code>, <code>type(self).__name__</code> gives the real class name, and <code>f\"{self.area():.2f}\"</code> formats to 2 places.",
      "<code>Square</code> only needs an <code>__init__</code>: <code>super().__init__(side, side)</code>. It inherits <code>area()</code> from <code>Rectangle</code>.",
    ],
    solution: `from abc import ABC, abstractmethod
import math


class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    def describe(self):
        return f"{type(self).__name__} with area {self.area():.2f}"


class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2


class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height


class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)
`,
  },
  {
    id: "lld_library", track: "lld", level: "intermediate", title: "Library Lending System", type: "script",
    description: `<p><strong>Design idea:</strong> <em>encapsulation and invariants</em>. The <code>Library</code> object owns its data and enforces the rules, so outside code can never get it into an impossible state (like one book lent to two people).</p>
<p>Create a class <code>Library</code>:</p>
<ul><li><code>Library(max_loans=2)</code>: the most books one member may hold at once.</li>
<li><code>add_book(title)</code>: one copy per title. Adding a title that already exists raises <code>ValueError</code>.</li>
<li><code>add_member(name)</code>: registers a member.</li>
<li><code>borrow(name, title)</code>: raise <code>KeyError</code> if the member or the book is unknown; raise <code>ValueError</code> if the book is already on loan or the member already holds <code>max_loans</code> books. A failed borrow must change nothing.</li>
<li><code>return_book(name, title)</code>: raise <code>ValueError</code> if that member doesn't have that book.</li>
<li><code>available()</code>: sorted list of titles not on loan.</li>
<li><code>loans(name)</code>: sorted list of titles that member holds.</li></ul>
<pre>lib = Library()
lib.add_book("Dune"); lib.add_member("ann")
lib.borrow("ann", "Dune")
lib.loans("ann")    → ['Dune']</pre>`,
    starter: `class Library:
    def __init__(self, max_loans=2):
        pass

    def add_book(self, title):
        pass

    def add_member(self, name):
        pass

    def borrow(self, name, title):
        pass

    def return_book(self, name, title):
        pass

    def available(self):
        pass

    def loans(self, name):
        pass
`,
    tests: [
      { code: `lib = Library()\nlib.add_book("Emma")\nlib.add_book("Dune")\nlib.available()`, expected: ["Dune", "Emma"] },
      { code: `lib = Library()\nlib.add_book("Dune")\nlib.add_book("Emma")\nlib.add_member("ann")\nlib.borrow("ann", "Dune")\n[lib.available(), lib.loans("ann")]`, expected: [["Emma"], ["Dune"]] },
      { code: _lldRaises(`lib = Library()\nlib.add_book("Dune")\nlib.add_member("ann")\nlib.add_member("bob")\nlib.borrow("ann", "Dune")`, `lib.borrow("bob", "Dune")`, "ValueError"), expected: "ValueError" },
      { code: _lldRaises(`lib = Library(max_loans=1)\nlib.add_book("A")\nlib.add_book("B")\nlib.add_member("ann")\nlib.borrow("ann", "A")`, `lib.borrow("ann", "B")`, "ValueError"), expected: "ValueError" },
      { code: `lib = Library()\nlib.add_book("Dune")\nlib.add_member("ann")\nlib.borrow("ann", "Dune")\nlib.return_book("ann", "Dune")\n[lib.available(), lib.loans("ann")]`, expected: [["Dune"], []] },
      { code: _lldRaises(`lib = Library()\nlib.add_book("Dune")`, `lib.borrow("zed", "Dune")`, "KeyError"), expected: "KeyError", hidden: true },
      { code: _lldRaises(`lib = Library()\nlib.add_member("ann")`, `lib.borrow("ann", "Nope")`, "KeyError"), expected: "KeyError", hidden: true },
      { code: _lldRaises(`lib = Library()\nlib.add_book("Dune")\nlib.add_member("ann")`, `lib.return_book("ann", "Dune")`, "ValueError"), expected: "ValueError", hidden: true },
      { code: _lldRaises(`lib = Library()\nlib.add_book("Dune")`, `lib.add_book("Dune")`, "ValueError"), expected: "ValueError", hidden: true },
      { code: `lib = Library(max_loans=1)\nlib.add_book("A")\nlib.add_book("B")\nlib.add_member("ann")\nlib.borrow("ann", "A")\ntry:\n    lib.borrow("ann", "B")\nexcept ValueError:\n    pass\n[lib.available(), lib.loans("ann")]`, expected: [["B"], ["A"]], hidden: true },
    ],
    hints: [
      "Two dicts make this easy: <code>self.on_loan = {}</code> (title → member name, or <code>None</code> if free) and <code>self.members = {}</code> (name → set of titles).",
      "In <code>borrow</code>, do <em>all</em> the checks first, in order: unknown member/book (<code>KeyError</code>), already on loan, then at the limit (<code>ValueError</code>). Only change data once every check has passed.",
      "<code>available()</code> is <code>sorted(t for t, who in self.on_loan.items() if who is None)</code>.",
    ],
    solution: `class Library:
    def __init__(self, max_loans=2):
        self.max_loans = max_loans
        self.on_loan = {}
        self.members = {}

    def add_book(self, title):
        if title in self.on_loan:
            raise ValueError(f"{title} already exists")
        self.on_loan[title] = None

    def add_member(self, name):
        self.members.setdefault(name, set())

    def borrow(self, name, title):
        if name not in self.members:
            raise KeyError(name)
        if title not in self.on_loan:
            raise KeyError(title)
        if self.on_loan[title] is not None:
            raise ValueError(f"{title} is already on loan")
        if len(self.members[name]) >= self.max_loans:
            raise ValueError(f"{name} has reached the loan limit")
        self.on_loan[title] = name
        self.members[name].add(title)

    def return_book(self, name, title):
        if title not in self.members.get(name, set()):
            raise ValueError(f"{name} does not have {title}")
        self.members[name].remove(title)
        self.on_loan[title] = None

    def available(self):
        return sorted(t for t, who in self.on_loan.items() if who is None)

    def loans(self, name):
        return sorted(self.members[name])
`,
  },
  {
    id: "lld_parking", track: "lld", level: "intermediate", title: "Parking Lot", type: "script",
    description: `<p><strong>Design idea:</strong> <em>modelling a real system and custom exceptions</em>. A classic interview question: turn a real-world set of rules into a clean class, and signal "the lot is full" with your own exception type so callers can handle it specifically.</p>
<ul><li><code>class LotFullError(Exception)</code>: your own exception.</li>
<li><code>ParkingLot(small, medium, large)</code>: how many spots of each size.</li>
<li><code>park(plate, size)</code>: <code>size</code> is <code>"small"</code>, <code>"medium"</code> or <code>"large"</code> (anything else: <code>ValueError</code>). A vehicle fits a spot of its own size <strong>or bigger</strong>; always use the <strong>smallest</strong> free spot that fits. Return the spot size used. Raise <code>ValueError</code> if that plate is already parked, and <code>LotFullError</code> if nothing fits.</li>
<li><code>leave(plate)</code>: frees the spot and returns its size. <code>KeyError</code> if the plate isn't parked.</li>
<li><code>free(size)</code>: number of free spots of that size.</li></ul>
<pre>lot = ParkingLot(1, 1, 1)
lot.park("AB12", "small")   → 'small'
lot.park("CD34", "small")   → 'medium'   (small is full, so go up a size)</pre>`,
    starter: `class LotFullError(Exception):
    pass


class ParkingLot:
    def __init__(self, small, medium, large):
        pass

    def park(self, plate, size):
        pass

    def leave(self, plate):
        pass

    def free(self, size):
        pass
`,
    tests: [
      { code: `lot = ParkingLot(1, 1, 1)\nlot.park("AB12", "small")`, expected: "small" },
      { code: `lot = ParkingLot(1, 1, 1)\nlot.park("AB12", "small")\nlot.park("CD34", "small")`, expected: "medium" },
      { code: `lot = ParkingLot(2, 1, 0)\nlot.park("X1", "medium")\n[lot.free("small"), lot.free("medium"), lot.free("large")]`, expected: [2, 0, 0] },
      { code: _lldRaises(`lot = ParkingLot(1, 0, 0)\nlot.park("A", "small")`, `lot.park("B", "small")`, "LotFullError"), expected: "LotFullError" },
      { code: `lot = ParkingLot(0, 0, 1)\nlot.park("A", "small")\n[lot.leave("A"), lot.free("large")]`, expected: ["large", 1] },
      { code: _lldRaises(`lot = ParkingLot(5, 5, 0)`, `lot.park("BUS", "large")`, "LotFullError"), expected: "LotFullError", hidden: true },
      { code: _lldRaises(`lot = ParkingLot(2, 2, 2)\nlot.park("A", "small")`, `lot.park("A", "large")`, "ValueError"), expected: "ValueError", hidden: true },
      { code: _lldRaises(`lot = ParkingLot(1, 1, 1)`, `lot.leave("GHOST")`, "KeyError"), expected: "KeyError", hidden: true },
      { code: _lldRaises(`lot = ParkingLot(1, 1, 1)`, `lot.park("A", "huge")`, "ValueError"), expected: "ValueError", hidden: true },
      { code: `issubclass(LotFullError, Exception)`, expected: true, hidden: true },
    ],
    hints: [
      "Keep a fixed order <code>SIZES = [\"small\", \"medium\", \"large\"]</code>, a dict of free counts, and a dict <code>plate → spot size</code>.",
      "To find a spot, loop over <code>SIZES[SIZES.index(size):]</code> (its own size and bigger) and take the first with a free count above 0.",
      "If the loop finishes without finding one, <code>raise LotFullError(...)</code>. In <code>leave</code>, <code>self.parked.pop(plate)</code> raises <code>KeyError</code> for you.",
    ],
    solution: `SIZES = ["small", "medium", "large"]


class LotFullError(Exception):
    pass


class ParkingLot:
    def __init__(self, small, medium, large):
        self.spaces = {"small": small, "medium": medium, "large": large}
        self.parked = {}

    def park(self, plate, size):
        if size not in SIZES:
            raise ValueError(f"Unknown size: {size}")
        if plate in self.parked:
            raise ValueError(f"{plate} is already parked")
        for spot in SIZES[SIZES.index(size):]:
            if self.spaces[spot] > 0:
                self.spaces[spot] -= 1
                self.parked[plate] = spot
                return spot
        raise LotFullError(f"No space for a {size} vehicle")

    def leave(self, plate):
        spot = self.parked.pop(plate)
        self.spaces[spot] += 1
        return spot

    def free(self, size):
        return self.spaces[size]
`,
  },
  {
    id: "lld_observer", track: "lld", level: "intermediate", title: "Event Notifier (Observer Pattern)", type: "script",
    description: `<p><strong>Design idea:</strong> the <em>Observer pattern</em>. The thing that fires an event shouldn't need to know who cares about it. Listeners <em>subscribe</em>; the publisher just announces, and everyone subscribed gets told. It's how button clicks, webhooks and notifications work.</p>
<p>Create a class <code>EventBus</code>:</p>
<ul><li><code>subscribe(event, callback)</code>: register a function for an event name. Subscribing the same callback to the same event twice has no extra effect.</li>
<li><code>unsubscribe(event, callback)</code>: remove it. Raise <code>ValueError</code> if it wasn't subscribed.</li>
<li><code>publish(event, data)</code>: call every callback for that event as <code>callback(data)</code>, <strong>in the order they subscribed</strong>, and return how many were called (0 if none).</li></ul>
<pre>bus = EventBus()
log = []
bus.subscribe("order", log.append)
bus.publish("order", 42)   → 1
log                        → [42]</pre>`,
    starter: `class EventBus:
    def __init__(self):
        pass

    def subscribe(self, event, callback):
        pass

    def unsubscribe(self, event, callback):
        pass

    def publish(self, event, data):
        pass
`,
    tests: [
      { code: `bus = EventBus()\nlog = []\nbus.subscribe("order", log.append)\nbus.publish("order", 42)\nlog`, expected: [42] },
      { code: `bus = EventBus()\nbus.publish("nobody", 1)`, expected: 0 },
      { code: `bus = EventBus()\nlog = []\nbus.subscribe("e", lambda d: log.append("first " + d))\nbus.subscribe("e", lambda d: log.append("second " + d))\nn = bus.publish("e", "hi")\n[n, log]`, expected: [2, ["first hi", "second hi"]] },
      { code: `bus = EventBus()\nlog = []\nbus.subscribe("a", log.append)\nbus.publish("b", 1)\nlog`, expected: [] },
      { code: `bus = EventBus()\nlog = []\nbus.subscribe("e", log.append)\nbus.unsubscribe("e", log.append)\n[bus.publish("e", 1), log]`, expected: [0, []], hidden: true },
      { code: `bus = EventBus()\nlog = []\nbus.subscribe("e", log.append)\nbus.subscribe("e", log.append)\nbus.publish("e", 7)\nlog`, expected: [7], hidden: true },
      { code: _lldRaises(`bus = EventBus()\ndef f(d):\n    pass`, `bus.unsubscribe("e", f)`, "ValueError"), expected: "ValueError", hidden: true },
    ],
    hints: [
      "Store <code>self.subscribers = {}</code> mapping each event name to a <em>list</em> of callbacks (lists keep subscription order).",
      "In <code>subscribe</code>, only append if <code>callback not in</code> the list already. In <code>unsubscribe</code>, check membership and raise <code>ValueError</code> if missing.",
      "<code>publish</code>: <code>callbacks = self.subscribers.get(event, [])</code>, call each with <code>data</code>, then <code>return len(callbacks)</code>.",
    ],
    solution: `class EventBus:
    def __init__(self):
        self.subscribers = {}

    def subscribe(self, event, callback):
        callbacks = self.subscribers.setdefault(event, [])
        if callback not in callbacks:
            callbacks.append(callback)

    def unsubscribe(self, event, callback):
        callbacks = self.subscribers.get(event, [])
        if callback not in callbacks:
            raise ValueError("Callback was not subscribed")
        callbacks.remove(callback)

    def publish(self, event, data):
        callbacks = list(self.subscribers.get(event, []))
        for callback in callbacks:
            callback(data)
        return len(callbacks)
`,
  },
  {
    id: "lld_cart", track: "lld", level: "intermediate", title: "Shopping Cart with Discount Strategies", type: "script",
    description: `<p><strong>Design idea:</strong> the <em>Strategy pattern</em>. Instead of a growing <code>if</code>/<code>elif</code> for every kind of promotion, each discount is its own small object with the same method. The cart just calls <code>apply()</code> and doesn't care which strategy it has, so new promotions need no changes to <code>Cart</code>.</p>
<p>Discount strategies, each with <code>apply(subtotal)</code> returning the new amount:</p>
<ul><li><code>NoDiscount()</code>: unchanged.</li>
<li><code>PercentOff(percent)</code>: e.g. <code>PercentOff(10)</code> takes 10% off.</li>
<li><code>AmountOff(amount)</code>: takes a fixed amount off, but never below 0.</li></ul>
<p>Class <code>Cart(discount=None)</code> (use <code>NoDiscount()</code> when none is given):</p>
<ul><li><code>add(name, price, qty=1)</code>: adding an existing item increases its quantity. Raise <code>ValueError</code> if <code>qty &lt; 1</code> or <code>price &lt; 0</code>.</li>
<li><code>remove(name)</code>: removes the item completely; <code>KeyError</code> if it isn't there.</li>
<li><code>subtotal()</code>: sum of price × qty. &nbsp; <code>set_discount(strategy)</code>: swap the strategy.</li>
<li><code>total()</code>: the strategy applied to the subtotal, rounded to 2 dp.</li></ul>
<pre>cart = Cart(PercentOff(10))
cart.add("tea", 2.50, 2)
cart.total()   → 4.5</pre>`,
    starter: `class NoDiscount:
    def apply(self, subtotal):
        pass


class PercentOff:
    pass


class AmountOff:
    pass


class Cart:
    def __init__(self, discount=None):
        pass
`,
    tests: [
      { code: `cart = Cart()\ncart.add("tea", 2.5, 2)\ncart.add("milk", 1.2)\ncart.subtotal()`, expected: 6.2 },
      { code: `cart = Cart(PercentOff(10))\ncart.add("tea", 2.5, 2)\ncart.total()`, expected: 4.5 },
      { code: `cart = Cart(AmountOff(3))\ncart.add("pen", 1.0, 2)\ncart.total()`, expected: 0 },
      { code: `cart = Cart()\ncart.add("tea", 2.5)\ncart.add("tea", 2.5, 3)\ncart.subtotal()`, expected: 10.0 },
      { code: `cart = Cart()\ncart.add("a", 10)\ncart.set_discount(AmountOff(2.5))\ncart.total()`, expected: 7.5 },
      { code: `cart = Cart()\ncart.add("a", 3)\ncart.add("b", 4)\ncart.remove("a")\ncart.total()`, expected: 4, hidden: true },
      { code: _lldRaises(`cart = Cart()`, `cart.remove("ghost")`, "KeyError"), expected: "KeyError", hidden: true },
      { code: _lldRaises(`cart = Cart()`, `cart.add("a", 1, 0)`, "ValueError"), expected: "ValueError", hidden: true },
      { code: `class BuyTwoGetFiverOff:\n    def apply(self, subtotal):\n        return subtotal - 5 if subtotal >= 20 else subtotal\ncart = Cart(BuyTwoGetFiverOff())\ncart.add("game", 12.99, 2)\ncart.total()`, expected: 20.98, hidden: true },
      { code: `cart = Cart(PercentOff(33))\ncart.add("x", 9.99, 3)\ncart.total()`, expected: 20.08, hidden: true },
    ],
    hints: [
      "Each strategy is a tiny class: store the setting in <code>__init__</code>, and <code>apply</code> returns e.g. <code>subtotal * (1 - self.percent / 100)</code> or <code>max(0, subtotal - self.amount)</code>.",
      "In <code>Cart</code>, keep <code>self.items = {}</code> mapping name → <code>[price, qty]</code>, and <code>self.discount = discount or NoDiscount()</code>.",
      "<code>total()</code> should just be <code>round(self.discount.apply(self.subtotal()), 2)</code>. The cart never needs to know which strategy it has.",
    ],
    solution: `class NoDiscount:
    def apply(self, subtotal):
        return subtotal


class PercentOff:
    def __init__(self, percent):
        self.percent = percent

    def apply(self, subtotal):
        return subtotal * (1 - self.percent / 100)


class AmountOff:
    def __init__(self, amount):
        self.amount = amount

    def apply(self, subtotal):
        return max(0, subtotal - self.amount)


class Cart:
    def __init__(self, discount=None):
        self.items = {}
        self.discount = discount or NoDiscount()

    def add(self, name, price, qty=1):
        if qty < 1 or price < 0:
            raise ValueError("Invalid price or quantity")
        if name in self.items:
            self.items[name][1] += qty
        else:
            self.items[name] = [price, qty]

    def remove(self, name):
        del self.items[name]

    def subtotal(self):
        return sum(price * qty for price, qty in self.items.values())

    def set_discount(self, strategy):
        self.discount = strategy

    def total(self):
        return round(self.discount.apply(self.subtotal()), 2)
`,
  },
  {
    id: "lld_vending", track: "lld", level: "advanced", title: "Vending Machine", type: "script",
    description: `<p><strong>Design idea:</strong> <em>state and invariants</em>. A vending machine behaves differently depending on its state (waiting, or holding your money), and it must never lose or invent money. Every method either fully succeeds or leaves things exactly as they were.</p>
<p>All money is in <strong>pence</strong> (whole numbers). Create a class <code>VendingMachine</code>:</p>
<ul><li><code>stock(code, name, price, qty)</code>: add a product under a slot code like <code>"A1"</code>. Stocking an existing code adds to its quantity.</li>
<li><code>insert(coin)</code>: accept only <code>1, 2, 5, 10, 20, 50, 100, 200</code> (otherwise <code>ValueError</code>). Returns the new balance.</li>
<li><code>balance</code>: attribute with the money currently inserted.</li>
<li><code>state</code>: <code>"idle"</code> when the balance is 0, otherwise <code>"has_money"</code>.</li>
<li><code>select(code)</code>: <code>KeyError</code> for an unknown code; <code>ValueError</code> if it's sold out or the balance is too low (balance kept). On success, reduce the stock, reset the balance to 0 and return <code>(name, change)</code>, where <code>change</code> is a list of coins, <strong>largest first</strong>, using as few coins as possible.</li>
<li><code>cancel()</code>: return the balance as a coin list (same rules) and reset to 0.</li></ul>
<pre>vm = VendingMachine()
vm.stock("A1", "Crisps", 65, 2)
vm.insert(50); vm.insert(20)
vm.select("A1")   → ('Crisps', [5])</pre>`,
    starter: `COINS = [200, 100, 50, 20, 10, 5, 2, 1]


class VendingMachine:
    def __init__(self):
        pass

    def stock(self, code, name, price, qty):
        pass

    def insert(self, coin):
        pass

    def select(self, code):
        pass

    def cancel(self):
        pass
`,
    tests: [
      { code: `vm = VendingMachine()\nvm.stock("A1", "Crisps", 65, 2)\nvm.insert(50)\nvm.insert(20)\nvm.select("A1")`, expected: ["Crisps", [5]] },
      { code: `vm = VendingMachine()\nvm.stock("B2", "Water", 65, 1)\nvm.insert(200)\nvm.select("B2")`, expected: ["Water", [100, 20, 10, 5]] },
      { code: `vm = VendingMachine()\n[vm.state, vm.insert(20), vm.insert(5), vm.state]`, expected: ["idle", 20, 25, "has_money"] },
      { code: `vm = VendingMachine()\nvm.insert(100)\nvm.insert(20)\nvm.insert(2)\n[vm.cancel(), vm.balance, vm.state]`, expected: [[100, 20, 2], 0, "idle"] },
      { code: _lldRaises(`vm = VendingMachine()`, `vm.insert(3)`, "ValueError"), expected: "ValueError" },
      { code: _lldRaises(`vm = VendingMachine()\nvm.stock("A1", "Crisps", 65, 1)\nvm.insert(50)`, `vm.select("A1")`, "ValueError"), expected: "ValueError", hidden: true },
      { code: `vm = VendingMachine()\nvm.stock("A1", "Crisps", 65, 1)\nvm.insert(50)\ntry:\n    vm.select("A1")\nexcept ValueError:\n    pass\nvm.balance`, expected: 50, hidden: true },
      { code: _lldRaises(`vm = VendingMachine()\nvm.stock("A1", "Crisps", 50, 1)\nvm.insert(50)\nvm.select("A1")\nvm.insert(50)`, `vm.select("A1")`, "ValueError"), expected: "ValueError", hidden: true },
      { code: _lldRaises(`vm = VendingMachine()\nvm.insert(50)`, `vm.select("Z9")`, "KeyError"), expected: "KeyError", hidden: true },
      { code: `vm = VendingMachine()\nvm.stock("A1", "Gum", 10, 1)\nvm.stock("A1", "Gum", 10, 1)\nvm.insert(10)\nvm.select("A1")\nvm.insert(20)\n[vm.select("A1"), vm.state]`, expected: [["Gum", [10]], "idle"], hidden: true },
    ],
    hints: [
      "Store products in a dict: <code>code → [name, price, qty]</code>. Make <code>state</code> a <code>@property</code> that checks <code>self.balance</code>.",
      "Write a helper <code>_make_change(amount)</code>: loop over <code>COINS</code> (largest first) and, while the coin fits into what's left, append it and subtract it.",
      "In <code>select</code>, run every check (unknown → <code>KeyError</code>, sold out, too little money → <code>ValueError</code>) <em>before</em> touching stock or balance.",
    ],
    solution: `COINS = [200, 100, 50, 20, 10, 5, 2, 1]


class VendingMachine:
    def __init__(self):
        self.products = {}
        self.balance = 0

    @property
    def state(self):
        return "idle" if self.balance == 0 else "has_money"

    def stock(self, code, name, price, qty):
        if code in self.products:
            self.products[code][2] += qty
        else:
            self.products[code] = [name, price, qty]

    def insert(self, coin):
        if coin not in COINS:
            raise ValueError(f"Coin not accepted: {coin}")
        self.balance += coin
        return self.balance

    def _make_change(self, amount):
        change = []
        for coin in COINS:
            while amount >= coin:
                change.append(coin)
                amount -= coin
        return change

    def select(self, code):
        if code not in self.products:
            raise KeyError(code)
        name, price, qty = self.products[code]
        if qty == 0:
            raise ValueError(f"{name} is sold out")
        if self.balance < price:
            raise ValueError("Not enough money")
        self.products[code][2] -= 1
        change = self._make_change(self.balance - price)
        self.balance = 0
        return (name, change)

    def cancel(self):
        change = self._make_change(self.balance)
        self.balance = 0
        return change
`,
  },
  {
    id: "lld_elevator", track: "lld", level: "advanced", title: "Elevator Request Scheduler", type: "script",
    description: `<p><strong>Design idea:</strong> <em>separating requests from scheduling</em>. Requests can arrive in any order; the elevator decides the order to serve them. Real lifts use the "SCAN" algorithm: keep going in the current direction while anyone needs you that way, then turn round. That's fairer and faster than serving requests in arrival order.</p>
<p>Create a class <code>Elevator</code>:</p>
<ul><li><code>Elevator(top_floor)</code>: floors run from 0 to <code>top_floor</code>. Starts with <code>floor = 0</code> and <code>direction = "up"</code> (both attributes).</li>
<li><code>request(floor)</code>: <code>ValueError</code> if the floor is outside 0..top_floor. Requests for the current floor, and duplicates, are ignored.</li>
<li><code>pending()</code>: sorted list of floors still requested.</li>
<li><code>run()</code>: serve every pending request and return the list of floors stopped at, in order. Rule: if any request lies in the current direction, go to the <strong>nearest</strong> one that way; otherwise flip <code>direction</code>. Update <code>floor</code> as you go.</li></ul>
<pre>e = Elevator(10)
e.request(5); e.request(2); e.request(8)
e.run()       → [2, 5, 8]
e.request(3); e.request(9)
e.run()       → [9, 3]     (finish going up first, then come down)</pre>`,
    starter: `class Elevator:
    def __init__(self, top_floor):
        pass

    def request(self, floor):
        pass

    def pending(self):
        pass

    def run(self):
        pass
`,
    tests: [
      { code: `e = Elevator(10)\ne.request(5)\ne.request(2)\ne.request(8)\ne.run()`, expected: [2, 5, 8] },
      { code: `e = Elevator(10)\ne.request(5)\ne.request(2)\ne.request(8)\ne.run()\n[e.floor, e.direction]`, expected: [8, "up"] },
      { code: `e = Elevator(10)\ne.request(5)\ne.request(8)\ne.run()\ne.request(3)\ne.request(9)\n[e.run(), e.direction]`, expected: [[9, 3], "down"] },
      { code: _lldRaises(`e = Elevator(10)`, `e.request(11)`, "ValueError"), expected: "ValueError" },
      { code: `e = Elevator(10)\ne.request(4)\ne.request(4)\ne.request(0)\n[e.pending(), e.run(), e.pending()]`, expected: [[4], [4], []], hidden: true },
      { code: `e = Elevator(10)\ne.request(6)\ne.run()\ne.request(2)\ne.request(7)\ne.request(9)\n[e.run(), e.floor, e.direction]`, expected: [[7, 9, 2], 2, "down"], hidden: true },
      { code: `e = Elevator(5)\ne.run()`, expected: [], hidden: true },
      { code: _lldRaises(`e = Elevator(3)`, `e.request(-1)`, "ValueError"), expected: "ValueError", hidden: true },
      { code: `e = Elevator(10)\ne.request(9)\ne.run()\ne.request(4)\ne.run()\ne.request(1)\ne.request(6)\ne.run()`, expected: [1, 6], hidden: true },
    ],
    hints: [
      "Store pending floors in a <code>set</code>, which gives you duplicate-ignoring for free.",
      "In <code>run</code>, loop <code>while self.requests:</code>. Work out <code>ahead = [f for f in self.requests if f &gt; self.floor]</code> when going up (or <code>&lt;</code> when going down).",
      "If <code>ahead</code> is empty, flip the direction and <code>continue</code>. Otherwise go to <code>min(ahead)</code> going up (or <code>max(ahead)</code> going down), remove it, and record the stop.",
    ],
    solution: `class Elevator:
    def __init__(self, top_floor):
        self.top_floor = top_floor
        self.floor = 0
        self.direction = "up"
        self.requests = set()

    def request(self, floor):
        if floor < 0 or floor > self.top_floor:
            raise ValueError(f"No floor {floor}")
        if floor != self.floor:
            self.requests.add(floor)

    def pending(self):
        return sorted(self.requests)

    def run(self):
        stops = []
        while self.requests:
            if self.direction == "up":
                ahead = [f for f in self.requests if f > self.floor]
            else:
                ahead = [f for f in self.requests if f < self.floor]
            if not ahead:
                self.direction = "down" if self.direction == "up" else "up"
                continue
            target = min(ahead) if self.direction == "up" else max(ahead)
            self.requests.remove(target)
            self.floor = target
            stops.append(target)
        return stops
`,
  },
  {
    id: "lld_rate_limiter", track: "lld", level: "advanced", title: "Fixed-Window Rate Limiter", type: "script",
    description: `<p><strong>Design idea:</strong> <em>dependency injection for testability</em>. APIs limit how often each user can call them. A rate limiter that reads the clock itself is hard to test; by passing the time <em>in</em> as an argument, the class is fully predictable, and the caller (or a test) controls time.</p>
<p>Create a class <code>RateLimiter</code> using a <em>fixed window</em>:</p>
<ul><li><code>RateLimiter(limit, window)</code>: each user may make <code>limit</code> requests per window of <code>window</code> seconds. Raise <code>ValueError</code> if <code>limit &lt; 1</code> or <code>window &lt;= 0</code>.</li>
<li>Windows are fixed blocks of time: the window number is <code>now // window</code>. So with <code>window=10</code>, times 0–9.99 are window 0, 10–19.99 are window 1, and so on.</li>
<li><code>allow(user, now)</code>: returns <code>True</code> and records the request if the user is under the limit in the current window, otherwise <code>False</code>. Rejected requests don't count. Each user is tracked separately.</li>
<li><code>remaining(user, now)</code>: how many requests that user has left in the window containing <code>now</code>.</li></ul>
<pre>rl = RateLimiter(2, 10)
rl.allow("ann", 0)    → True
rl.allow("ann", 5)    → True
rl.allow("ann", 9)    → False
rl.allow("ann", 10)   → True   (new window)</pre>`,
    starter: `class RateLimiter:
    def __init__(self, limit, window):
        pass

    def allow(self, user, now):
        pass

    def remaining(self, user, now):
        pass
`,
    tests: [
      { code: `rl = RateLimiter(2, 10)\n[rl.allow("ann", 0), rl.allow("ann", 5), rl.allow("ann", 9)]`, expected: [true, true, false] },
      { code: `rl = RateLimiter(2, 10)\nrl.allow("ann", 0)\nrl.allow("ann", 1)\nrl.allow("ann", 10)`, expected: true },
      { code: `rl = RateLimiter(1, 60)\n[rl.allow("ann", 0), rl.allow("bob", 0), rl.allow("ann", 30)]`, expected: [true, true, false] },
      { code: `rl = RateLimiter(3, 10)\nrl.allow("ann", 2)\n[rl.remaining("ann", 4), rl.remaining("bob", 4)]`, expected: [2, 3] },
      { code: _lldRaises("", "RateLimiter(0, 10)", "ValueError"), expected: "ValueError" },
      { code: `rl = RateLimiter(2, 10)\nfor t in range(5):\n    rl.allow("ann", 3)\nrl.remaining("ann", 3)`, expected: 0, hidden: true },
      { code: `rl = RateLimiter(2, 10)\nrl.allow("ann", 8)\nrl.allow("ann", 9)\n[rl.remaining("ann", 9.5), rl.remaining("ann", 10)]`, expected: [0, 2], hidden: true },
      { code: _lldRaises("", "RateLimiter(5, 0)", "ValueError"), expected: "ValueError", hidden: true },
      { code: `rl = RateLimiter(1, 5)\n[rl.allow("u", t) for t in [0, 1, 5, 9.9, 10, 14]]`, expected: [true, false, true, false, true, false], hidden: true },
    ],
    hints: [
      "Track each user with a dict: <code>user → (window_number, count)</code>.",
      "Work out <code>win = now // self.window</code>. If the stored window number differs (or the user is new), treat their count as 0.",
      "<code>remaining</code> is <code>self.limit - count</code> for the current window. <code>allow</code> can use it: if it's above 0, save <code>(win, count + 1)</code> and return <code>True</code>.",
    ],
    solution: `class RateLimiter:
    def __init__(self, limit, window):
        if limit < 1 or window <= 0:
            raise ValueError("limit must be >= 1 and window > 0")
        self.limit = limit
        self.window = window
        self.usage = {}

    def _count(self, user, now):
        win = now // self.window
        stored_win, count = self.usage.get(user, (None, 0))
        if stored_win != win:
            count = 0
        return win, count

    def remaining(self, user, now):
        _, count = self._count(user, now)
        return self.limit - count

    def allow(self, user, now):
        win, count = self._count(user, now)
        if count >= self.limit:
            return False
        self.usage[user] = (win, count + 1)
        return True
`,
  },
];
