import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

const js = (o) => ch({ mode: 'js', ...o });

export default mod(
  'js-data',
  ["Massivlar va obyektlar", 'Массивы и объекты', 'Arrays and objects'],
  ["Ma'lumotlar to'plamlari bilan ishlash.", 'Работа с наборами данных.', 'Working with collections of data.'],
  [
    lesson(
      'arrays',
      ['Massivlar', 'Массивы', 'Arrays'],
      [
        "Massiv — tartiblangan qiymatlar ro'yxati: `const fruits = [\"olma\", \"anor\", \"uzum\"];`\n- Indeks 0 dan boshlanadi: `fruits[0]` → `\"olma\"`\n- `fruits.length` — elementlar soni; oxirgisi `fruits[fruits.length - 1]` yoki `fruits.at(-1)`\n- `push()` oxiriga qo'shadi, `pop()` oxiridan oladi\n- `unshift()` / `shift()` — boshidan\n- `includes()`, `indexOf()` — qidirish\n- `join(\", \")` — satrga aylantirish",
        "Массив — упорядоченный список значений: `const fruits = [\"яблоко\", \"гранат\", \"виноград\"];`\n- Индексы с 0: `fruits[0]` → `\"яблоко\"`\n- `fruits.length` — количество; последний — `fruits[fruits.length - 1]` или `fruits.at(-1)`\n- `push()` добавляет в конец, `pop()` забирает с конца\n- `unshift()` / `shift()` — с начала\n- `includes()`, `indexOf()` — поиск\n- `join(\", \")` — превратить в строку",
        "An array is an ordered list of values: `const fruits = [\"apple\", \"pomegranate\", \"grape\"];`\n- Indexes start at 0: `fruits[0]` → `\"apple\"`\n- `fruits.length` is the count; the last item is `fruits[fruits.length - 1]` or `fruits.at(-1)`\n- `push()` adds to the end, `pop()` removes from the end\n- `unshift()` / `shift()` work at the start\n- `includes()`, `indexOf()` — searching\n- `join(\", \")` — turn into a string",
      ],
      {
        ex: `const skills = ["HTML", "CSS"];
skills.push("JavaScript");
console.log(skills.length);        // 3
console.log(skills[0]);            // HTML
console.log(skills.at(-1));        // JavaScript
console.log(skills.includes("CSS")); // true
console.log(skills.join(" → "));`,
        exMode: 'js',
        ch: js({
          i: ['`addSkill(list, skill)` — agar ko\'nikma massivda **bo\'lmasa** oxiriga qo\'shsin va massivni qaytarsin (takrorlanmasin).', '`addSkill(list, skill)` — если навыка **нет** в массиве, добавить в конец и вернуть массив (без повторов).', '`addSkill(list, skill)` — if the skill is **not** in the array, push it and return the array (no duplicates).'],
          s: { js: 'function addSkill(list, skill) {\n  return list;\n}\n' },
          sol: { js: 'function addSkill(list, skill) {\n  if (!list.includes(skill)) list.push(skill);\n  return list;\n}\n' },
          tests: [
            [['yangisini qo\'shadi', 'добавляет новый', 'adds a new one'], "addSkill(['HTML'], 'CSS').join() === 'HTML,CSS'"],
            [['takrorlamaydi', 'не дублирует', 'no duplicates'], "addSkill(['HTML', 'CSS'], 'CSS').length === 2"],
          ],
          rules: [['includes|indexOf', 'includes', { t: 'js' }]],
        }),
        q: [
          out(['Natija?', 'Результат?', 'Result?'], 'const a = [10, 20, 30];\nconsole.log(a[a.length - 1]);', ['30'], ['Oxirgi element.', 'Последний элемент.', 'The last item.']),
          mcq(['Massiv oxiriga qo\'shish:', 'Добавить в конец массива:', 'Add to the end of an array:'], ['push()', 'pop()', 'shift()', 'add()'], 0, ['`push()`.', '`push()`.', '`push()`.']),
        ],
      }
    ),
    lesson(
      'map-filter',
      ['map va filter', 'map и filter', 'map and filter'],
      [
        "Massiv metodlari sikllarni qisqa va tushunarli qiladi:\n- `map(fn)` — har bir elementni **o'zgartirib**, xuddi shu uzunlikdagi **yangi** massiv qaytaradi\n- `filter(fn)` — shartga mos elementlardan yangi massiv qaytaradi\n- `forEach(fn)` — faqat aylanadi, hech narsa qaytarmaydi\n\nAsl massiv o'zgarmaydi (immutability) — bu React da juda muhim!",
        "Методы массивов делают циклы короче и понятнее:\n- `map(fn)` — **преобразует** каждый элемент и возвращает **новый** массив той же длины\n- `filter(fn)` — возвращает новый массив из элементов, прошедших условие\n- `forEach(fn)` — просто перебирает, ничего не возвращает\n\nИсходный массив не меняется (иммутабельность) — это очень важно в React!",
        "Array methods make loops shorter and clearer:\n- `map(fn)` — **transforms** each item and returns a **new** array of the same length\n- `filter(fn)` — returns a new array of items that pass a condition\n- `forEach(fn)` — just iterates, returns nothing\n\nThe original array is unchanged (immutability) — very important in React!",
      ],
      {
        ex: `const prices = [12000, 5000, 30000, 800];
const withTax = prices.map((p) => p * 1.12);
const cheap = prices.filter((p) => p < 10000);
console.log(withTax);
console.log(cheap);   // [5000, 800]
console.log(prices);  // o'zgarmagan`,
        exMode: 'js',
        ch: js({
          i: ['`getPassedNames(students)` — `score >= 60` bo\'lgan talabalarning faqat **ismlari** massivini qaytarsin (`filter` + `map`).', '`getPassedNames(students)` — вернуть массив только **имён** студентов с `score >= 60` (`filter` + `map`).', '`getPassedNames(students)` — return an array of just the **names** of students with `score >= 60` (`filter` + `map`).'],
          s: { js: 'function getPassedNames(students) {\n\n}\n\nconst list = [\n  { name: "Ali", score: 75 },\n  { name: "Vali", score: 40 },\n  { name: "Gani", score: 60 },\n];\nconsole.log(getPassedNames(list));\n' },
          sol: { js: 'function getPassedNames(students) {\n  return students.filter((s) => s.score >= 60).map((s) => s.name);\n}\n\nconst list = [\n  { name: "Ali", score: 75 },\n  { name: "Vali", score: 40 },\n  { name: "Gani", score: 60 },\n];\nconsole.log(getPassedNames(list));\n' },
          tests: [
            [['["Ali", "Gani"]', '["Ali", "Gani"]', '["Ali", "Gani"]'], "JSON.stringify(getPassedNames([{ name: 'Ali', score: 75 }, { name: 'Vali', score: 40 }, { name: 'Gani', score: 60 }])) === '[\"Ali\",\"Gani\"]'"],
            [['bo\'sh massiv → []', 'пустой массив → []', 'empty array → []'], 'getPassedNames([]).length === 0'],
          ],
          rules: [['\\.filter\\(', 'filter', { t: 'js' }], ['\\.map\\(', 'map', { t: 'js' }]],
        }),
        q: [
          out(['Natija?', 'Результат?', 'Result?'], 'console.log([1, 2, 3].map(n => n * 10).join(","));', ['10,20,30'], ['Har biri 10 ga ko\'paytirildi.', 'Каждое умножено на 10.', 'Each multiplied by 10.']),
          tf(['`filter` asl massivni o\'zgartiradi.', '`filter` изменяет исходный массив.', '`filter` changes the original array.'], false, ['Yangi massiv qaytaradi.', 'Возвращает новый массив.', 'It returns a new array.']),
        ],
      }
    ),
    lesson(
      'reduce-find',
      ['reduce, find, some, every', 'reduce, find, some, every', 'reduce, find, some, every'],
      [
        "- `reduce((acc, x) => ..., start)` — massivni **bitta qiymatga** keltiradi (yig'indi, maksimum, obyekt)\n- `find(fn)` — shartga mos **birinchi** elementni (yoki `undefined`) qaytaradi\n- `findIndex(fn)` — uning indeksini\n- `some(fn)` — kamida bittasi mosmi? (`true`/`false`)\n- `every(fn)` — hammasi mosmi?\n- `sort((a, b) => a - b)` — sonlarni o'sish tartibida (diqqat: asl massivni o'zgartiradi)",
        "- `reduce((acc, x) => ..., start)` — сводит массив к **одному значению** (сумма, максимум, объект)\n- `find(fn)` — возвращает **первый** подходящий элемент (или `undefined`)\n- `findIndex(fn)` — его индекс\n- `some(fn)` — подходит ли хотя бы один? (`true`/`false`)\n- `every(fn)` — подходят ли все?\n- `sort((a, b) => a - b)` — сортировка чисел по возрастанию (внимание: меняет исходный массив)",
        "- `reduce((acc, x) => ..., start)` — reduces an array to **one value** (sum, max, an object)\n- `find(fn)` — returns the **first** matching item (or `undefined`)\n- `findIndex(fn)` — its index\n- `some(fn)` — does at least one match? (`true`/`false`)\n- `every(fn)` — do all match?\n- `sort((a, b) => a - b)` — sorts numbers ascending (careful: mutates the array)",
      ],
      {
        ex: `const cart = [
  { name: "Kitob", price: 45000, qty: 2 },
  { name: "Ruchka", price: 3000, qty: 5 },
];
const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
console.log(total); // 105000
console.log(cart.find((i) => i.price < 10000).name); // Ruchka
console.log(cart.every((i) => i.qty > 0));           // true`,
        exMode: 'js',
        ch: js({
          i: ['`cartTotal(items)` — `reduce` bilan barcha `price * qty` yig\'indisini qaytarsin. Bo\'sh savat → `0`.', '`cartTotal(items)` — через `reduce` вернуть сумму всех `price * qty`. Пустая корзина → `0`.', '`cartTotal(items)` — use `reduce` to return the sum of all `price * qty`. Empty cart → `0`.'],
          s: { js: 'function cartTotal(items) {\n\n}\n' },
          sol: { js: 'function cartTotal(items) {\n  return items.reduce((sum, item) => sum + item.price * item.qty, 0);\n}\n' },
          tests: [
            [['105000', '105000', '105000'], 'cartTotal([{ price: 45000, qty: 2 }, { price: 3000, qty: 5 }]) === 105000'],
            [['bo\'sh → 0', 'пусто → 0', 'empty → 0'], 'cartTotal([]) === 0'],
          ],
          rules: [['\\.reduce\\(', 'reduce', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          out(['Natija?', 'Результат?', 'Result?'], 'console.log([3, 7, 2].reduce((a, b) => a + b, 0));', ['12'], ['3 + 7 + 2.', '3 + 7 + 2.', '3 + 7 + 2.']),
          match(['Metod va natija turi', 'Метод и тип результата', 'Method and result type'], [['find', 'item or undefined'], ['some', 'boolean'], ['filter', 'new array']], ['find — element, some — boolean, filter — massiv.', 'find — элемент, some — boolean, filter — массив.', 'find → item, some → boolean, filter → array.']),
        ],
      }
    ),
    lesson(
      'objects',
      ['Obyektlar', 'Объекты', 'Objects'],
      [
        "Obyekt — **kalit: qiymat** juftliklari to'plami:\n```\nconst user = { name: \"Aziza\", level: 3, isPro: false };\n```\n- O'qish: `user.name` yoki `user[\"name\"]` (kalit o'zgaruvchida bo'lsa — qavs)\n- O'zgartirish/qo'shish: `user.level = 4; user.city = \"Toshkent\";`\n- O'chirish: `delete user.isPro`\n- `Object.keys(user)`, `Object.values(user)`, `Object.entries(user)`\n- Obyekt ichida funksiya — **metod**: `greet() { return \"Salom\"; }`",
        "Объект — набор пар **ключ: значение**:\n```\nconst user = { name: \"Aziza\", level: 3, isPro: false };\n```\n- Чтение: `user.name` или `user[\"name\"]` (если ключ в переменной — скобки)\n- Изменение/добавление: `user.level = 4; user.city = \"Toshkent\";`\n- Удаление: `delete user.isPro`\n- `Object.keys(user)`, `Object.values(user)`, `Object.entries(user)`\n- Функция в объекте — **метод**: `greet() { return \"Привет\"; }`",
        "An object is a collection of **key: value** pairs:\n```\nconst user = { name: \"Aziza\", level: 3, isPro: false };\n```\n- Read: `user.name` or `user[\"name\"]` (use brackets when the key is in a variable)\n- Change/add: `user.level = 4; user.city = \"Toshkent\";`\n- Delete: `delete user.isPro`\n- `Object.keys(user)`, `Object.values(user)`, `Object.entries(user)`\n- A function inside an object is a **method**: `greet() { return \"Hi\"; }`",
      ],
      {
        ex: `const hero = {
  name: "Koder",
  xp: 120,
  skills: ["HTML", "CSS"],
  levelUp() {
    this.xp += 100;
  },
};
hero.levelUp();
console.log(hero.xp);               // 220
console.log(Object.keys(hero));     // ["name", "xp", "skills", "levelUp"]`,
        exMode: 'js',
        ch: js({
          i: ['`createUser(name, age)` obyekt qaytarsin: `{ name, age, isAdult }` — bu yerda `isAdult` = `age >= 18`.', '`createUser(name, age)` возвращает объект `{ name, age, isAdult }`, где `isAdult` = `age >= 18`.', '`createUser(name, age)` returns an object `{ name, age, isAdult }` where `isAdult` = `age >= 18`.'],
          s: { js: 'function createUser(name, age) {\n\n}\n' },
          sol: { js: 'function createUser(name, age) {\n  return { name, age, isAdult: age >= 18 };\n}\n' },
          tests: [
            [['createUser("Ali", 20)', 'createUser("Ali", 20)', 'createUser("Ali", 20)'], "(() => { const u = createUser('Ali', 20); return u.name === 'Ali' && u.age === 20 && u.isAdult === true; })()"],
            [['16 yosh → isAdult false', '16 лет → isAdult false', 'age 16 → isAdult false'], "createUser('Vali', 16).isAdult === false"],
          ],
          rules: [['isAdult', 'isAdult', { t: 'js' }]],
        }),
        q: [
          out(['Natija?', 'Результат?', 'Result?'], 'const key = "color";\nconst car = { color: "oq" };\nconsole.log(car[key]);', ['oq'], ['Kalit o\'zgaruvchida — kvadrat qavs.', 'Ключ в переменной — квадратные скобки.', 'Key in a variable → square brackets.']),
          mcq(['Obyekt kalitlari massivi:', 'Массив ключей объекта:', 'Array of an object’s keys:'], ['Object.keys(obj)', 'obj.keys()', 'Object.list(obj)', 'keys(obj)'], 0, ['`Object.keys`.', '`Object.keys`.', '`Object.keys`.']),
        ],
      }
    ),
    lesson(
      'destructuring-spread',
      ['Destrukturizatsiya va spread', 'Деструктуризация и spread', 'Destructuring and spread'],
      [
        "**Destrukturizatsiya** — massiv yoki obyektdan qiymatlarni qisqa olish:\n- `const { name, level } = user;`\n- `const [first, second] = list;`\n- Funksiya parametrida: `function show({ name }) { ... }`\n\n**Spread** (`...`) — nusxa olish va birlashtirish:\n- `const copy = [...list, 4];`\n- `const updated = { ...user, level: 5 };` — asl obyekt o'zgarmaydi!\n\n**Rest**: `function sum(...nums) { }` — barcha argumentlar massivga yig'iladi.",
        "**Деструктуризация** — короткое извлечение значений:\n- `const { name, level } = user;`\n- `const [first, second] = list;`\n- В параметрах функции: `function show({ name }) { ... }`\n\n**Spread** (`...`) — копирование и объединение:\n- `const copy = [...list, 4];`\n- `const updated = { ...user, level: 5 };` — исходный объект не меняется!\n\n**Rest**: `function sum(...nums) { }` — все аргументы собираются в массив.",
        "**Destructuring** pulls values out concisely:\n- `const { name, level } = user;`\n- `const [first, second] = list;`\n- In function parameters: `function show({ name }) { ... }`\n\n**Spread** (`...`) copies and merges:\n- `const copy = [...list, 4];`\n- `const updated = { ...user, level: 5 };` — the original stays unchanged!\n\n**Rest**: `function sum(...nums) { }` — collects all arguments into an array.",
      ],
      {
        ex: `const user = { name: "Bekzod", level: 2, city: "Samarqand" };
const { name, ...rest } = user;
console.log(name, rest);

const updated = { ...user, level: 3 };
console.log(user.level, updated.level); // 2 3

const [a, b] = [10, 20];
console.log(a + b); // 30`,
        exMode: 'js',
        ch: js({
          i: ['`levelUp(user)` — asl obyektni **o\'zgartirmasdan**, `level` 1 ga oshgan **yangi** obyekt qaytarsin (spread `...`).', '`levelUp(user)` — **не меняя** исходный объект, вернуть **новый** с `level` на 1 больше (spread `...`).', '`levelUp(user)` — **without mutating** the original, return a **new** object with `level` increased by 1 (spread `...`).'],
          s: { js: 'function levelUp(user) {\n  user.level++;\n  return user;\n}\n' },
          sol: { js: 'function levelUp(user) {\n  return { ...user, level: user.level + 1 };\n}\n' },
          tests: [
            [['level oshgan', 'level увеличен', 'level increased'], "levelUp({ name: 'A', level: 1 }).level === 2"],
            [['asl obyekt o\'zgarmagan', 'исходный объект не изменён', 'original unchanged'], "(() => { const u = { name: 'A', level: 1 }; const n = levelUp(u); return u.level === 1 && n !== u && n.name === 'A'; })()"],
          ],
          rules: [['\\.\\.\\.', 'spread', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          out(['Natija?', 'Результат?', 'Result?'], 'const { x, y = 5 } = { x: 1 };\nconsole.log(x + y);', ['6'], ['y default 5 → 1 + 5.', 'y по умолчанию 5 → 1 + 5.', 'y defaults to 5 → 1 + 5.'], { d: 'medium' }),
          fill(['Massivlarni birlashtirish:', 'Объединение массивов:', 'Merging arrays:'], 'const all = [___a, ...b];', ['...'], ['Spread operator.', 'Оператор spread.', 'The spread operator.']),
        ],
      }
    ),
  ],
  [
    out(['Natija?', 'Результат?', 'Result?'], 'const a = ["x", "y", "z"];\nconsole.log(a.length);', ['3'], ['3 element.', '3 элемента.', '3 items.']),
    mcq(['Shartga mos birinchi elementni topish:', 'Найти первый подходящий элемент:', 'Find the first matching item:'], ['filter', 'find', 'map', 'some'], 1, ['`find`.', '`find`.', '`find`.']),
    tf(['`map` har doim xuddi shu uzunlikdagi massiv qaytaradi.', '`map` всегда возвращает массив той же длины.', '`map` always returns an array of the same length.'], true, ['Har bir element uchun bitta natija.', 'По одному результату на элемент.', 'One result per item.']),
    out(['Natija?', 'Результат?', 'Result?'], 'const u = { a: 1 };\nconst v = { ...u, a: 2 };\nconsole.log(u.a);', ['1'], ['Spread nusxa yaratadi.', 'Spread создаёт копию.', 'Spread creates a copy.'], { d: 'medium' }),
    bug(['Nega yig\'indi noto\'g\'ri chiqadi?', 'Почему сумма неверна?', 'Why is the sum wrong?'], 'const sum = [1, 2, 3].reduce((acc, n) => { acc + n; }, 0);', [['Blokda return yo\'q', 'В блоке нет return', 'No return inside the block'], ['0 kerak emas', '0 не нужен', '0 is not needed'], ['reduce massivda ishlamaydi', 'reduce не работает с массивом', 'reduce does not work on arrays']], 0, ['`{ }` bo\'lsa `return` yozish shart.', 'С `{ }` нужен `return`.', 'With `{ }` you must `return`.']),
    match(['Moslang', 'Сопоставьте', 'Match'], [['push', 'add to end'], ['pop', 'remove last'], ['shift', 'remove first']], ['push — qo\'shish, pop — oxirgisini, shift — birinchisini olish.', 'push — добавить, pop — убрать последний, shift — первый.', 'push adds, pop removes last, shift removes first.']),
  ]
);
