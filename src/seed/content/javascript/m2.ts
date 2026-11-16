import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

const js = (o) => ch({ mode: 'js', ...o });

export default mod(
  'js-functions-loops',
  ['Funksiyalar va sikllar', 'Функции и циклы', 'Functions and loops'],
  ['Kodni qayta ishlatish va takrorlash.', 'Повторное использование кода и повторения.', 'Reusing code and repeating actions.'],
  [
    lesson(
      'functions',
      ['Funksiyalar', 'Функции', 'Functions'],
      [
        "Funksiya — nomlangan, qayta ishlatiladigan kod bloki. U **parametrlar** qabul qiladi va `return` bilan natija qaytaradi:\n```\nfunction add(a, b) {\n  return a + b;\n}\nadd(2, 3); // 5\n```\n`return` dan keyingi kod bajarilmaydi. `return` bo'lmasa funksiya `undefined` qaytaradi. Yaxshi funksiya **bitta ish** qiladi va nomi fe'l bilan boshlanadi: `calculateTotal`, `showMessage`.",
        "Функция — именованный блок кода для повторного использования. Она принимает **параметры** и возвращает результат через `return`:\n```\nfunction add(a, b) {\n  return a + b;\n}\nadd(2, 3); // 5\n```\nКод после `return` не выполняется. Без `return` функция возвращает `undefined`. Хорошая функция делает **одно дело**, а её имя начинается с глагола: `calculateTotal`, `showMessage`.",
        "A function is a named, reusable block of code. It takes **parameters** and returns a result with `return`:\n```\nfunction add(a, b) {\n  return a + b;\n}\nadd(2, 3); // 5\n```\nCode after `return` doesn't run. Without `return`, a function returns `undefined`. A good function does **one thing** and its name starts with a verb: `calculateTotal`, `showMessage`.",
      ],
      {
        ex: `function area(width, height) {
  return width * height;
}
console.log(area(4, 5));   // 20

function sayHi(name) {
  console.log("Salom, " + name);
}
const result = sayHi("Ali"); // return yo'q
console.log(result);         // undefined`,
        exMode: 'js',
        ch: js({
          i: ['`max(a, b)` funksiyasini yozing — ikki sondan kattasini qaytarsin (`Math.max` ishlatmang).', 'Напишите функцию `max(a, b)`, возвращающую большее из двух чисел (без `Math.max`).', 'Write `max(a, b)` that returns the larger of two numbers (without `Math.max`).'],
          s: { js: 'function max(a, b) {\n\n}\n' },
          sol: { js: 'function max(a, b) {\n  if (a > b) return a;\n  return b;\n}\n' },
          tests: [
            [['max(3, 9) → 9', 'max(3, 9) → 9', 'max(3, 9) → 9'], 'max(3, 9) === 9'],
            [['max(10, -2) → 10', 'max(10, -2) → 10', 'max(10, -2) → 10'], 'max(10, -2) === 10'],
            [['max(5, 5) → 5', 'max(5, 5) → 5', 'max(5, 5) → 5'], 'max(5, 5) === 5'],
          ],
          rules: [['Math\\.max', 'Math.max', { t: 'js', not: true }], ['return', 'return', { t: 'js' }]],
        }),
        q: [
          out(['Natija?', 'Результат?', 'Result?'], 'function f() {\n  return 1;\n  console.log("salom");\n}\nconsole.log(f());', ['1'], ['`return` dan keyingi qator bajarilmaydi.', 'Строка после `return` не выполняется.', 'The line after `return` never runs.']),
          tf(['`return` siz funksiya `null` qaytaradi.', 'Функция без `return` возвращает `null`.', 'A function without `return` returns `null`.'], false, ['U `undefined` qaytaradi.', 'Она возвращает `undefined`.', 'It returns `undefined`.']),
        ],
      }
    ),
    lesson(
      'arrow-functions',
      ['Arrow funksiyalar', 'Стрелочные функции', 'Arrow functions'],
      [
        "Arrow funksiya — qisqa sintaksis:\n```\nconst double = (n) => n * 2;\nconst greet = (name = \"mehmon\") => `Salom, ${name}`;\n```\nAgar tana bitta ifoda bo'lsa, `{}` va `return` shart emas. **Default parametr** (`name = \"mehmon\"`) argument berilmaganda ishlatiladi. Arrow funksiyalar callback lar uchun juda qulay (massiv metodlarida ko'p uchraydi).",
        "Стрелочная функция — короткий синтаксис:\n```\nconst double = (n) => n * 2;\nconst greet = (name = \"гость\") => `Привет, ${name}`;\n```\nЕсли тело — одно выражение, `{}` и `return` не нужны. **Параметр по умолчанию** (`name = \"гость\"`) используется, когда аргумент не передан. Стрелочные функции очень удобны как колбэки (часто в методах массивов).",
        "An arrow function is a short syntax:\n```\nconst double = (n) => n * 2;\nconst greet = (name = \"guest\") => `Hi, ${name}`;\n```\nIf the body is a single expression, `{}` and `return` are optional. A **default parameter** (`name = \"guest\"`) is used when no argument is passed. Arrow functions are great as callbacks (common with array methods).",
      ],
      {
        ex: `const square = (x) => x * x;
const sum = (a, b = 10) => a + b;
console.log(square(7));  // 49
console.log(sum(5));     // 15
console.log(sum(5, 1));  // 6`,
        exMode: 'js',
        ch: js({
          i: ['`const discount = (price, percent = 10) => ...` arrow funksiyasini yozing: chegirmadan keyingi narxni qaytarsin. `discount(200)` → `180`, `discount(200, 50)` → `100`.', 'Напишите стрелочную функцию `const discount = (price, percent = 10) => ...`: цена после скидки. `discount(200)` → `180`, `discount(200, 50)` → `100`.', 'Write an arrow function `const discount = (price, percent = 10) => ...` returning the price after the discount. `discount(200)` → `180`, `discount(200, 50)` → `100`.'],
          s: { js: 'const discount = () => {};\n' },
          sol: { js: 'const discount = (price, percent = 10) => price - (price * percent) / 100;\n' },
          tests: [
            [['discount(200) → 180', 'discount(200) → 180', 'discount(200) → 180'], 'discount(200) === 180'],
            [['discount(200, 50) → 100', 'discount(200, 50) → 100', 'discount(200, 50) → 100'], 'discount(200, 50) === 100'],
          ],
          rules: [['=>', 'arrow', { t: 'js' }], ['=\\s*10', 'default 10', { t: 'js' }]],
        }),
        q: [
          out(['Natija?', 'Результат?', 'Result?'], 'const f = (a, b = 3) => a * b;\nconsole.log(f(4));', ['12'], ['b = 3 (default) → 4 × 3.', 'b = 3 (по умолчанию) → 4 × 3.', 'b = 3 (default) → 4 × 3.']),
          fill(['Arrow funksiyani yakunlang:', 'Завершите стрелочную функцию:', 'Complete the arrow function:'], 'const triple = n ___ n * 3;', ['=>'], ['`=>` — arrow.', '`=>` — стрелка.', '`=>` is the arrow.']),
        ],
      }
    ),
    lesson(
      'for-loops',
      ['for sikli', 'Цикл for', 'The for loop'],
      [
        "Sikl kodni takrorlaydi. `for` uch qismdan iborat:\n```\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n```\n1. boshlanish (`let i = 1`)\n2. shart (`i <= 5`) — `false` bo'lsa to'xtaydi\n3. qadam (`i++`)\n\nMassiv elementlarini aylanish uchun qulay `for...of`: `for (const fruit of fruits) { ... }`.",
        "Цикл повторяет код. `for` состоит из трёх частей:\n```\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n```\n1. начало (`let i = 1`)\n2. условие (`i <= 5`) — при `false` цикл останавливается\n3. шаг (`i++`)\n\nДля перебора массива удобен `for...of`: `for (const fruit of fruits) { ... }`.",
        "A loop repeats code. `for` has three parts:\n```\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n```\n1. start (`let i = 1`)\n2. condition (`i <= 5`) — stops when `false`\n3. step (`i++`)\n\nTo iterate an array, `for...of` is handy: `for (const fruit of fruits) { ... }`.",
      ],
      {
        ex: `for (let i = 1; i <= 3; i++) {
  console.log("Qadam", i);
}
const langs = ["HTML", "CSS", "JS"];
for (const lang of langs) {
  console.log(lang);
}`,
        exMode: 'js',
        ch: js({
          i: ['`sumTo(n)` — 1 dan n gacha bo\'lgan sonlar yig\'indisini `for` sikli bilan hisoblasin. `sumTo(5)` → `15`.', '`sumTo(n)` — сумма чисел от 1 до n через цикл `for`. `sumTo(5)` → `15`.', '`sumTo(n)` — sum the numbers from 1 to n with a `for` loop. `sumTo(5)` → `15`.'],
          s: { js: 'function sumTo(n) {\n  let total = 0;\n  // for sikli\n  return total;\n}\n' },
          sol: { js: 'function sumTo(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) {\n    total += i;\n  }\n  return total;\n}\n' },
          tests: [
            [['sumTo(5) → 15', 'sumTo(5) → 15', 'sumTo(5) → 15'], 'sumTo(5) === 15'],
            [['sumTo(100) → 5050', 'sumTo(100) → 5050', 'sumTo(100) → 5050'], 'sumTo(100) === 5050'],
            [['sumTo(1) → 1', 'sumTo(1) → 1', 'sumTo(1) → 1'], 'sumTo(1) === 1'],
          ],
          rules: [['for\\s*\\(', 'for', { t: 'js' }]],
        }),
        q: [
          out(['Necha marta "Hi" chiqadi?', 'Сколько раз выведется "Hi"?', 'How many times is "Hi" logged?'], 'for (let i = 0; i < 4; i++) {\n  console.log("Hi");\n}', ['4'], ['i = 0, 1, 2, 3.', 'i = 0, 1, 2, 3.', 'i = 0, 1, 2, 3.']),
          order(['for siklini tuzing', 'Соберите цикл for', 'Assemble the for loop'], ['for (let i = 0; i < 3; i++) {', '  console.log(i);', '}'], ['Sarlavha → tana → yopilish.', 'Заголовок → тело → закрытие.', 'Header → body → closing.']),
        ],
      }
    ),
    lesson(
      'while-break',
      ['while, break va continue', 'while, break и continue', 'while, break and continue'],
      [
        "`while` — shart `true` ekan takrorlaydi. Takrorlar soni oldindan noma'lum bo'lganda qulay:\n```\nlet hp = 100;\nwhile (hp > 0) {\n  hp -= 30;\n}\n```\n- `break` — siklni darhol to'xtatadi\n- `continue` — joriy qadamni o'tkazib, keyingisiga o'tadi\n\n⚠️ Shart hech qachon `false` bo'lmasa — **cheksiz sikl**! CODEVERSE sandboxi sizni bundan himoya qiladi.",
        "`while` повторяет, пока условие `true`. Удобен, когда число повторов заранее неизвестно:\n```\nlet hp = 100;\nwhile (hp > 0) {\n  hp -= 30;\n}\n```\n- `break` — сразу останавливает цикл\n- `continue` — пропускает текущий шаг и переходит к следующему\n\n⚠️ Если условие никогда не станет `false` — **бесконечный цикл**! Песочница CODEVERSE защищает от этого.",
        "`while` repeats as long as the condition is `true`. Handy when the number of repetitions is unknown:\n```\nlet hp = 100;\nwhile (hp > 0) {\n  hp -= 30;\n}\n```\n- `break` — stops the loop immediately\n- `continue` — skips the current step and moves on\n\n⚠️ If the condition never becomes `false` — an **infinite loop**! The CODEVERSE sandbox protects you from that.",
      ],
      {
        ex: `let n = 1;
while (n < 100) {
  n *= 2;
}
console.log(n); // 128

for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) continue; // juftlarni o'tkazish
  if (i > 7) break;          // 7 dan keyin to'xtash
  console.log(i);            // 1 3 5 7
}`,
        exMode: 'js',
        ch: js({
          i: ['`firstOver(list, limit)` — massivdagi `limit` dan katta birinchi sonni qaytarsin (`break` bilan). Topilmasa `null`.', '`firstOver(list, limit)` — вернуть первое число массива больше `limit` (с `break`). Если нет — `null`.', '`firstOver(list, limit)` — return the first number in the array greater than `limit` (use `break`). If none, return `null`.'],
          s: { js: 'function firstOver(list, limit) {\n  let found = null;\n  // ...\n  return found;\n}\n' },
          sol: { js: 'function firstOver(list, limit) {\n  let found = null;\n  for (const n of list) {\n    if (n > limit) {\n      found = n;\n      break;\n    }\n  }\n  return found;\n}\n' },
          tests: [
            [['[1, 5, 8, 12], 6 → 8', '[1, 5, 8, 12], 6 → 8', '[1, 5, 8, 12], 6 → 8'], 'firstOver([1, 5, 8, 12], 6) === 8'],
            [['[1, 2], 10 → null', '[1, 2], 10 → null', '[1, 2], 10 → null'], 'firstOver([1, 2], 10) === null'],
          ],
          rules: [['break', 'break', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          out(['Natija?', 'Результат?', 'Result?'], 'let i = 0;\nwhile (i < 10) {\n  i += 4;\n}\nconsole.log(i);', ['12'], ['0 → 4 → 8 → 12 (12 < 10 emas).', '0 → 4 → 8 → 12 (12 < 10 ложь).', '0 → 4 → 8 → 12 (12 < 10 is false).']),
          mcq(['Joriy qadamni o\'tkazib yuborish:', 'Пропустить текущую итерацию:', 'Skip the current iteration:'], ['break', 'continue', 'return', 'skip'], 1, ['`continue`.', '`continue`.', '`continue`.']),
        ],
      }
    ),
    lesson(
      'scope',
      ['Ko\'rinish sohasi (scope)', 'Область видимости (scope)', 'Scope'],
      [
        "**Scope** — o'zgaruvchi qayerda ko'rinishi:\n- **Global** — hamma joyda\n- **Funksiya** scope — faqat funksiya ichida\n- **Blok** scope — `let`/`const` faqat `{ }` ichida ko'rinadi\n\nIchki funksiya tashqi o'zgaruvchilarni ko'radi — bu **closure** (yopilish) deyiladi. Closure yordamida \"xususiy\" holat saqlash mumkin (masalan, hisoblagich).",
        "**Scope** — где видна переменная:\n- **Глобальная** — везде\n- **Функциональная** — только внутри функции\n- **Блочная** — `let`/`const` видны только внутри `{ }`\n\nВнутренняя функция видит внешние переменные — это **замыкание** (closure). С его помощью можно хранить «приватное» состояние (например, счётчик).",
        "**Scope** is where a variable is visible:\n- **Global** — everywhere\n- **Function** scope — only inside the function\n- **Block** scope — `let`/`const` are visible only inside `{ }`\n\nAn inner function can see outer variables — this is a **closure**. Closures let you keep \"private\" state (e.g. a counter).",
      ],
      {
        ex: `function makeCounter() {
  let count = 0;           // tashqaridan ko'rinmaydi
  return () => {
    count++;
    return count;
  };
}
const next = makeCounter();
console.log(next()); // 1
console.log(next()); // 2`,
        exMode: 'js',
        ch: js({
          i: ['`makeCounter(start)` funksiyasi closure qaytarsin: har chaqirilganda `start` dan boshlab 1 ga oshgan qiymatni qaytaradi. `const c = makeCounter(10); c()` → `11`, `c()` → `12`.', '`makeCounter(start)` возвращает замыкание: при каждом вызове возвращает значение, увеличенное на 1, начиная со `start`. `const c = makeCounter(10); c()` → `11`, `c()` → `12`.', '`makeCounter(start)` returns a closure that, each time it is called, returns the value increased by 1 starting from `start`. `const c = makeCounter(10); c()` → `11`, `c()` → `12`.'],
          s: { js: 'function makeCounter(start) {\n\n}\n' },
          sol: { js: 'function makeCounter(start) {\n  let value = start;\n  return () => {\n    value++;\n    return value;\n  };\n}\n' },
          tests: [
            [['c() → 11, c() → 12', 'c() → 11, c() → 12', 'c() → 11, c() → 12'], '(() => { const c = makeCounter(10); return c() === 11 && c() === 12; })()'],
            [['hisoblagichlar mustaqil', 'счётчики независимы', 'counters are independent'], '(() => { const a = makeCounter(0); const b = makeCounter(0); a(); a(); return b() === 1; })()'],
          ],
          rules: [['return', 'return', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          bug(['Nega xato chiqadi?', 'Почему возникает ошибка?', 'Why is there an error?'], 'if (true) {\n  let secret = 42;\n}\nconsole.log(secret);', [['let blok scope ga ega', 'У let блочная область видимости', 'let is block-scoped'], ['42 satr emas', '42 не строка', '42 is not a string'], ['if (true) mumkin emas', 'if (true) нельзя', 'if (true) is not allowed']], 0, ['`secret` faqat `{}` ichida mavjud.', '`secret` существует только внутри `{}`.', '`secret` exists only inside `{}`.']),
          tf(['Ichki funksiya tashqi funksiyaning o\'zgaruvchilarini ko\'ra oladi.', 'Внутренняя функция видит переменные внешней.', 'An inner function can see the outer function’s variables.'], true, ['Bu closure.', 'Это замыкание.', "That's a closure."]),
        ],
      }
    ),
  ],
  [
    out(['Natija?', 'Результат?', 'Result?'], 'const add = (a, b) => a + b;\nconsole.log(add(2, add(3, 4)));', ['9'], ['3+4=7, 2+7=9.', '3+4=7, 2+7=9.', '3+4=7, 2+7=9.']),
    mcq(['Siklni darhol to\'xtatish:', 'Немедленно остановить цикл:', 'Stop a loop immediately:'], ['continue', 'stop', 'break', 'exit'], 2, ['`break`.', '`break`.', '`break`.']),
    tf(['Arrow funksiyada bitta ifoda bo\'lsa `return` yozish shart emas.', 'В стрелочной функции с одним выражением `return` не обязателен.', 'An arrow function with a single expression needs no `return`.'], true, ['Yashirin qaytarish.', 'Неявный возврат.', 'Implicit return.']),
    fill(['Massiv elementlarini aylanish:', 'Перебор элементов массива:', 'Iterate array items:'], 'for (const item ___ items) { }', ['of'], ['`for...of`.', '`for...of`.', '`for...of`.']),
    match(['Moslang', 'Сопоставьте', 'Match'], [['for', 'known count'], ['while', 'until condition'], ['return', 'give result']], ['for — aniq son, while — shartgacha, return — natija.', 'for — известное число, while — до условия, return — результат.', 'for → known count, while → until condition, return → result.']),
    out(['Natija?', 'Результат?', 'Result?'], 'let s = "";\nfor (let i = 3; i > 0; i--) s += i;\nconsole.log(s);', ['321'], ['3, 2, 1 satrga qo\'shiladi.', '3, 2, 1 добавляются в строку.', '3, 2, 1 are appended.'], { d: 'medium' }),
  ]
);
