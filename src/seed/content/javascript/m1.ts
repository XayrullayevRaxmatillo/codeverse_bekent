import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

const js = (o) => ch({ mode: 'js', ...o });

export default mod(
  'js-basics',
  ['JavaScript asoslari', 'Основы JavaScript', 'JavaScript Basics'],
  ["O'zgaruvchilar, turlar, operatorlar, satrlar va shartlar.", 'Переменные, типы, операторы, строки и условия.', 'Variables, types, operators, strings and conditions.'],
  [
    lesson(
      'variables',
      ["O'zgaruvchilar", 'Переменные', 'Variables'],
      [
        "**JavaScript** — sahifani *jonlantiruvchi* dasturlash tili. Dastur ma'lumotlarni **o'zgaruvchilarda** saqlaydi:\n- `let` — qiymati o'zgarishi mumkin\n- `const` — qayta tayinlanmaydi (doimiy)\n- `var` — eski usul, ishlatmang\n\nNatijani ko'rish uchun `console.log(...)` dan foydalanamiz — u konsolga chiqaradi. Nomlar `camelCase` da yoziladi: `userName`, `totalPrice`.",
        "**JavaScript** — язык программирования, который *оживляет* страницу. Программа хранит данные в **переменных**:\n- `let` — значение может меняться\n- `const` — нельзя переназначить (константа)\n- `var` — устаревший способ, не используйте\n\nЧтобы увидеть результат, используем `console.log(...)` — вывод в консоль. Имена пишутся в `camelCase`: `userName`, `totalPrice`.",
        "**JavaScript** is the programming language that *brings pages to life*. Programs store data in **variables**:\n- `let` — the value can change\n- `const` — cannot be reassigned (a constant)\n- `var` — the old way, avoid it\n\nTo see results we use `console.log(...)`, which prints to the console. Names use `camelCase`: `userName`, `totalPrice`.",
      ],
      {
        ex: `const name = "Aziza";
let level = 1;
console.log("Salom,", name);

level = level + 1;
console.log("Yangi daraja:", level);`,
        exMode: 'js',
        ch: js({
          i: ['`const` bilan `city` o\'zgaruvchisi (`"Toshkent"`), `let` bilan `age` (`20`) yarating va ikkalasini `console.log` qiling.', 'Создайте `const city` (`"Toshkent"`) и `let age` (`20`) и выведите обе через `console.log`.', 'Create `const city` (`"Toshkent"`) and `let age` (`20`) and `console.log` both.'],
          s: { js: '// o\'zgaruvchilarni shu yerda yarating\n' },
          sol: { js: 'const city = "Toshkent";\nlet age = 20;\nconsole.log(city);\nconsole.log(age);\n' },
          tests: [
            [['city = "Toshkent"', 'city = "Toshkent"', 'city = "Toshkent"'], "city === 'Toshkent'"],
            [['age = 20', 'age = 20', 'age = 20'], 'age === 20'],
            [['ikkalasi konsolga chiqarilgan', 'обе выведены в консоль', 'both are logged'], "logs.includes('Toshkent') && logs.includes('20')"],
          ],
          rules: [['const\\s+city', 'const city', { t: 'js' }], ['let\\s+age', 'let age', { t: 'js' }]],
        }),
        q: [
          mcq(['Qayta tayinlab bo\'lmaydigan o\'zgaruvchi:', 'Переменная, которую нельзя переназначить:', 'A variable that cannot be reassigned:'], ['let', 'var', 'const', 'static'], 2, ['`const` — doimiy bog\'lanish.', '`const` — неизменяемая привязка.', '`const` is a constant binding.']),
          bug(['Xato qayerda?', 'Где ошибка?', 'Where is the bug?'], 'const score = 10;\nscore = 20;', [['const ga qayta qiymat berilgan', 'Переназначение const', 'Reassigning a const'], ['10 son emas', '10 не число', '10 is not a number'], ['Xato yo\'q', 'Ошибки нет', 'No bug']], 0, ['TypeError: Assignment to constant variable — `let` ishlating.', 'TypeError: Assignment to constant variable — используйте `let`.', 'TypeError: Assignment to constant variable — use `let`.']),
        ],
      }
    ),
    lesson(
      'data-types',
      ["Ma'lumot turlari", 'Типы данных', 'Data types'],
      [
        "JavaScriptdagi asosiy turlar:\n- `string` — matn: `\"salom\"`\n- `number` — son: `42`, `3.14`\n- `boolean` — `true` / `false`\n- `undefined` — qiymat berilmagan\n- `null` — ataylab \"bo'sh\"\n- `object` va `array` — murakkab tuzilmalar\n\n`typeof` operatori turni aytadi: `typeof 42` → `\"number\"`. Diqqat: `\"5\" + 1` → `\"51\"` (satr birlashtirish!), `Number(\"5\") + 1` → `6`.",
        "Основные типы JavaScript:\n- `string` — текст: `\"привет\"`\n- `number` — число: `42`, `3.14`\n- `boolean` — `true` / `false`\n- `undefined` — значение не задано\n- `null` — намеренно «пусто»\n- `object` и `array` — сложные структуры\n\nОператор `typeof` сообщает тип: `typeof 42` → `\"number\"`. Внимание: `\"5\" + 1` → `\"51\"` (склейка строк!), `Number(\"5\") + 1` → `6`.",
        "JavaScript's main types:\n- `string` — text: `\"hello\"`\n- `number` — numbers: `42`, `3.14`\n- `boolean` — `true` / `false`\n- `undefined` — no value assigned\n- `null` — intentionally \"empty\"\n- `object` and `array` — complex structures\n\nThe `typeof` operator tells the type: `typeof 42` → `\"number\"`. Careful: `\"5\" + 1` → `\"51\"` (string concatenation!), `Number(\"5\") + 1` → `6`.",
      ],
      {
        ex: `console.log(typeof "CODEVERSE"); // string
console.log(typeof 2026);        // number
console.log(typeof true);        // boolean
console.log("5" + 1);            // "51"
console.log(Number("5") + 1);    // 6`,
        exMode: 'js',
        ch: js({
          i: ['`toNumber(text)` funksiyasini yozing: satrni songa aylantirib, unga `1` qo\'shib qaytarsin. `toNumber("41")` → `42`.', 'Напишите функцию `toNumber(text)`: преобразует строку в число и возвращает его плюс `1`. `toNumber("41")` → `42`.', 'Write `toNumber(text)`: convert the string to a number and return it plus `1`. `toNumber("41")` → `42`.'],
          s: { js: 'function toNumber(text) {\n  return text + 1;\n}\n' },
          sol: { js: 'function toNumber(text) {\n  return Number(text) + 1;\n}\n' },
          tests: [
            [['toNumber("41") === 42', 'toNumber("41") === 42', 'toNumber("41") === 42'], "toNumber('41') === 42"],
            [['natija number turida', 'результат типа number', 'returns a number'], "typeof toNumber('1') === 'number'"],
          ],
          rules: [['function\\s+toNumber', 'toNumber', { t: 'js' }]],
        }),
        q: [
          out(['Konsolda nima chiqadi?', 'Что выведется в консоль?', 'What is logged?'], 'console.log("2" + 2);', ['22'], ['Satr + son = satr birlashishi.', 'Строка + число = склейка строк.', 'String + number = concatenation.']),
          mcq(['`typeof true` natijasi:', 'Результат `typeof true`:', 'Result of `typeof true`:'], ['"true"', '"boolean"', '"bool"', '"string"'], 1, ['`"boolean"`.', '`"boolean"`.', '`"boolean"`.']),
        ],
      }
    ),
    lesson(
      'operators',
      ['Operatorlar', 'Операторы', 'Operators'],
      [
        "**Arifmetik:** `+ - * /`, `%` (qoldiq), `**` (daraja).\n**Taqqoslash:** `>`, `<`, `>=`, `<=`, `===` (qat'iy teng), `!==` (qat'iy teng emas). Har doim `===` ishlating: `\"5\" == 5` → `true` (tur o'zgaradi!), `\"5\" === 5` → `false`.\n**Mantiqiy:** `&&` (va), `||` (yoki), `!` (inkor).\n**Qisqartmalar:** `x += 5`, `count++`.",
        "**Арифметические:** `+ - * /`, `%` (остаток), `**` (степень).\n**Сравнения:** `>`, `<`, `>=`, `<=`, `===` (строгое равенство), `!==` (строгое неравенство). Всегда используйте `===`: `\"5\" == 5` → `true` (тип приводится!), `\"5\" === 5` → `false`.\n**Логические:** `&&` (и), `||` (или), `!` (не).\n**Сокращения:** `x += 5`, `count++`.",
        "**Arithmetic:** `+ - * /`, `%` (remainder), `**` (power).\n**Comparison:** `>`, `<`, `>=`, `<=`, `===` (strict equality), `!==` (strict inequality). Always use `===`: `\"5\" == 5` → `true` (type coercion!), `\"5\" === 5` → `false`.\n**Logical:** `&&` (and), `||` (or), `!` (not).\n**Shortcuts:** `x += 5`, `count++`.",
      ],
      {
        ex: `console.log(10 % 3);        // 1
console.log(2 ** 3);        // 8
console.log(5 === "5");     // false
const age = 20;
console.log(age >= 18 && age < 65); // true`,
        exMode: 'js',
        ch: js({
          i: ['`isEven(n)` funksiyasini yozing: son juft bo\'lsa `true`, aks holda `false` qaytarsin (`%` operatoridan foydalaning).', 'Напишите `isEven(n)`: возвращает `true` для чётного числа и `false` иначе (используйте `%`).', 'Write `isEven(n)`: return `true` if the number is even, otherwise `false` (use `%`).'],
          s: { js: 'function isEven(n) {\n  // ...\n}\n' },
          sol: { js: 'function isEven(n) {\n  return n % 2 === 0;\n}\n' },
          tests: [
            [['isEven(4) → true', 'isEven(4) → true', 'isEven(4) → true'], 'isEven(4) === true'],
            [['isEven(7) → false', 'isEven(7) → false', 'isEven(7) → false'], 'isEven(7) === false'],
            [['isEven(0) → true', 'isEven(0) → true', 'isEven(0) → true'], 'isEven(0) === true'],
          ],
          rules: [['%', '%', { t: 'js' }]],
        }),
        q: [
          out(['Natija?', 'Результат?', 'Result?'], 'console.log(17 % 5);', ['2'], ['17 = 5×3 + 2.', '17 = 5×3 + 2.', '17 = 5×3 + 2.']),
          tf(['`"5" === 5` → `true`.', '`"5" === 5` → `true`.', '`"5" === 5` is `true`.'], false, ['`===` turni ham tekshiradi.', '`===` проверяет и тип.', '`===` also compares types.']),
        ],
      }
    ),
    lesson(
      'strings',
      ['Satrlar', 'Строки', 'Strings'],
      [
        "Satrlar qo'shtirnoq (`\"...\"`, `'...'`) yoki **backtick** bilan yoziladi. Backtick — **template literal**: ichiga `${ifoda}` qo'yish mumkin.\n\nFoydali metodlar:\n- `.length` — uzunlik\n- `.toUpperCase()`, `.toLowerCase()`\n- `.trim()` — chetdagi bo'shliqlarni olib tashlaydi\n- `.includes(\"x\")` — tarkibida bormi\n- `.slice(0, 3)` — qism kesib olish\n- `.split(\" \")` — massivga bo'lish\n- `.replace(\"a\", \"b\")`",
        "Строки пишутся в кавычках (`\"...\"`, `'...'`) или в **обратных кавычках**. Обратные кавычки — это **шаблонная строка**: внутрь можно вставить `${выражение}`.\n\nПолезные методы:\n- `.length` — длина\n- `.toUpperCase()`, `.toLowerCase()`\n- `.trim()` — убирает пробелы по краям\n- `.includes(\"x\")` — содержит ли\n- `.slice(0, 3)` — вырезать часть\n- `.split(\" \")` — разбить в массив\n- `.replace(\"a\", \"b\")`",
        "Strings are written in quotes (`\"...\"`, `'...'`) or **backticks**. Backticks make a **template literal**: you can embed `${expression}`.\n\nUseful methods:\n- `.length` — length\n- `.toUpperCase()`, `.toLowerCase()`\n- `.trim()` — removes surrounding spaces\n- `.includes(\"x\")` — contains?\n- `.slice(0, 3)` — cut a part\n- `.split(\" \")` — split into an array\n- `.replace(\"a\", \"b\")`",
      ],
      {
        ex: `const name = "  Aziza  ";
const clean = name.trim();
console.log(clean.length);          // 5
console.log(clean.toUpperCase());   // AZIZA
console.log(\`Salom, \${clean}! Sizda \${3 * 10} XP bor.\`);`,
        exMode: 'js',
        ch: js({
          i: ['`greet(name)` funksiyasi template literal yordamida `"Salom, NAME!"` qaytarsin, bunda ism **katta harflarda**. `greet("ali")` → `"Salom, ALI!"`.', 'Функция `greet(name)` с помощью шаблонной строки возвращает `"Salom, NAME!"`, где имя **заглавными буквами**. `greet("ali")` → `"Salom, ALI!"`.', '`greet(name)` should use a template literal to return `"Salom, NAME!"` with the name in **uppercase**. `greet("ali")` → `"Salom, ALI!"`.'],
          s: { js: 'function greet(name) {\n  return "Salom, " + name;\n}\n' },
          sol: { js: 'function greet(name) {\n  return `Salom, ${name.toUpperCase()}!`;\n}\n' },
          tests: [
            [['greet("ali")', 'greet("ali")', 'greet("ali")'], "greet('ali') === 'Salom, ALI!'"],
            [['greet("Zuhra")', 'greet("Zuhra")', 'greet("Zuhra")'], "greet('Zuhra') === 'Salom, ZUHRA!'"],
          ],
          rules: [['`', 'template literal', { t: 'js' }], ['toUpperCase', 'toUpperCase', { t: 'js' }]],
        }),
        q: [
          out(['Natija?', 'Результат?', 'Result?'], 'console.log("CODEVERSE".slice(0, 4));', ['CODE'], ['0 dan 4 gacha (4 kirmaydi).', 'С 0 до 4 (4 не входит).', 'From 0 up to (not including) 4.']),
          fill(['Ifodani satrga qo\'yish:', 'Вставка выражения в строку:', 'Embedding an expression:'], 'const msg = `Ball: ___{score}`;', ['$'], ['`${...}` sintaksisi.', 'Синтаксис `${...}`.', 'The `${...}` syntax.']),
        ],
      }
    ),
    lesson(
      'conditionals',
      ['Shartlar', 'Условия', 'Conditionals'],
      [
        "`if` sharti `true` bo'lsa kod bajariladi:\n```\nif (score >= 90) {\n  grade = \"A\";\n} else if (score >= 70) {\n  grade = \"B\";\n} else {\n  grade = \"C\";\n}\n```\n**Ternar operator** — qisqa `if`: `const status = age >= 18 ? \"katta\" : \"kichik\";`\n\n**Falsy** qiymatlar (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) shartda `false` sifatida ishlaydi.",
        "`if` выполняет код, если условие `true`:\n```\nif (score >= 90) {\n  grade = \"A\";\n} else if (score >= 70) {\n  grade = \"B\";\n} else {\n  grade = \"C\";\n}\n```\n**Тернарный оператор** — короткий `if`: `const status = age >= 18 ? \"взрослый\" : \"ребёнок\";`\n\n**Falsy**-значения (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) в условии работают как `false`.",
        "`if` runs code when the condition is `true`:\n```\nif (score >= 90) {\n  grade = \"A\";\n} else if (score >= 70) {\n  grade = \"B\";\n} else {\n  grade = \"C\";\n}\n```\nThe **ternary operator** is a short `if`: `const status = age >= 18 ? \"adult\" : \"minor\";`\n\n**Falsy** values (`false`, `0`, `\"\"`, `null`, `undefined`, `NaN`) act as `false` in conditions.",
      ],
      {
        ex: `const xp = 750;
if (xp >= 1000) {
  console.log("Developer");
} else if (xp >= 500) {
  console.log("Coder");
} else {
  console.log("Beginner");
}
const hearts = 0;
console.log(hearts ? "O'ynash mumkin" : "Kuting...");`,
        exMode: 'js',
        ch: js({
          i: ['`grade(score)`: 90+ → `"A"`, 70–89 → `"B"`, 50–69 → `"C"`, qolganlari → `"F"`.', '`grade(score)`: 90+ → `"A"`, 70–89 → `"B"`, 50–69 → `"C"`, иначе → `"F"`.', '`grade(score)`: 90+ → `"A"`, 70–89 → `"B"`, 50–69 → `"C"`, otherwise → `"F"`.'],
          s: { js: 'function grade(score) {\n  // if / else if / else\n}\n' },
          sol: { js: 'function grade(score) {\n  if (score >= 90) return "A";\n  else if (score >= 70) return "B";\n  else if (score >= 50) return "C";\n  else return "F";\n}\n' },
          tests: [
            [['95 → A', '95 → A', '95 → A'], "grade(95) === 'A'"],
            [['70 → B', '70 → B', '70 → B'], "grade(70) === 'B'"],
            [['50 → C', '50 → C', '50 → C'], "grade(50) === 'C'"],
            [['12 → F', '12 → F', '12 → F'], "grade(12) === 'F'"],
          ],
          rules: [['if', 'if', { t: 'js' }]],
        }),
        q: [
          out(['Natija?', 'Результат?', 'Result?'], 'const n = 0;\nconsole.log(n ? "ha" : "yo\'q");', ["yo'q"], ['`0` — falsy qiymat.', '`0` — falsy-значение.', '`0` is falsy.']),
          mcq(['Qaysi biri falsy EMAS?', 'Что из этого НЕ falsy?', 'Which is NOT falsy?'], ['0', '""', '"0"', 'null'], 2, ['`"0"` — bo\'sh bo\'lmagan satr, demak truthy.', '`"0"` — непустая строка, значит truthy.', '`"0"` is a non-empty string, so truthy.'], { d: 'medium' }),
        ],
      }
    ),
  ],
  [
    mcq(['O\'zgaruvchi e\'lon qilishning zamonaviy usullari:', 'Современные способы объявить переменную:', 'Modern ways to declare variables:'], ['var va function', 'let va const', 'int va string', 'def va val'].map((x, i) => (i === 1 ? 'let / const' : x.replace(' va ', ' / '))), 1, ['`let` va `const`.', '`let` и `const`.', '`let` and `const`.']),
    out(['Natija?', 'Результат?', 'Result?'], 'console.log(typeof "42");', ['string'], ['Qo\'shtirnoqdagi son — satr.', 'Число в кавычках — строка.', 'A number in quotes is a string.']),
    tf(['`===` qiymat va turni tekshiradi.', '`===` проверяет значение и тип.', '`===` checks value and type.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
    fill(['Satr uzunligi:', 'Длина строки:', 'String length:'], 'const n = "salom".___;', ['length'], ['`.length` — xususiyat, metod emas.', '`.length` — свойство, не метод.', '`.length` is a property, not a method.']),
    out(['Natija?', 'Результат?', 'Result?'], 'const a = 10;\nconsole.log(a > 5 && a < 8);', ['false'], ['10 < 8 — false.', '10 < 8 — false.', '10 < 8 is false.'], { d: 'medium' }),
    order(['if-else tuzilmasini tartiblang', 'Упорядочите конструкцию if-else', 'Order the if-else structure'], ['if (x > 0) {', '  console.log("musbat");', '} else {', '  console.log("musbat emas");', '}'], ['if → blok → else → blok.', 'if → блок → else → блок.', 'if → block → else → block.']),
  ]
);
