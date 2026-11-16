import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

const js = (o) => ch({ mode: 'js', ...o });

export default mod(
  'js-async',
  ['Asinxron JS va API', 'Асинхронный JS и API', 'Async JS & APIs'],
  ['Taymerlar, Promise, async/await, fetch va xatolar — serverlar bilan ishlashga ilk qadam.', 'Таймеры, Promise, async/await, fetch и ошибки — первый шаг к работе с сервером.', 'Timers, Promises, async/await, fetch and errors — your first step toward servers.'],
  [
    lesson(
      'timers-callbacks',
      ['Taymerlar va callback', 'Таймеры и колбэки', 'Timers and callbacks'],
      [
        "JavaScript **bir oqimli**, lekin uzoq vazifalarni kutib o'tirmaydi — ularni keyinroq bajaradi.\n- `setTimeout(fn, 1000)` — 1 soniyadan keyin bir marta\n- `setInterval(fn, 1000)` — har soniyada; `clearInterval(id)` bilan to'xtatiladi\n\n**Callback** — boshqa funksiyaga argument sifatida berilib, keyinroq chaqiriladigan funksiya. Diqqat: `setTimeout(..., 0)` ham hozirgi kod tugagandan **keyin** ishlaydi!",
        "JavaScript **однопоточный**, но не ждёт долгие задачи — выполняет их позже.\n- `setTimeout(fn, 1000)` — один раз через 1 секунду\n- `setInterval(fn, 1000)` — каждую секунду; останавливается `clearInterval(id)`\n\n**Колбэк** — функция, переданная аргументом и вызываемая позже. Внимание: даже `setTimeout(..., 0)` срабатывает **после** текущего кода!",
        "JavaScript is **single-threaded**, but it doesn't wait for slow tasks — it runs them later.\n- `setTimeout(fn, 1000)` — once, after 1 second\n- `setInterval(fn, 1000)` — every second; stop it with `clearInterval(id)`\n\nA **callback** is a function passed as an argument and called later. Note: even `setTimeout(..., 0)` runs **after** the current code finishes!",
      ],
      {
        ex: `console.log("1. Boshlandi");
setTimeout(() => console.log("3. Taymer"), 0);
console.log("2. Tugadi");

let n = 3;
const id = setInterval(() => {
  console.log(n--);
  if (n === 0) clearInterval(id);
}, 300);`,
        exMode: 'js',
        ch: js({
          i: ['`delayLog(text, ms)` — `ms` millisoniyadan keyin `text` ni `console.log` qilsin. Keyin `delayLog("Tayyor!", 50)` ni chaqiring.', '`delayLog(text, ms)` — через `ms` миллисекунд выводит `text` в `console.log`. Затем вызовите `delayLog("Tayyor!", 50)`.', '`delayLog(text, ms)` — after `ms` milliseconds, `console.log` the `text`. Then call `delayLog("Tayyor!", 50)`.'],
          s: { js: 'function delayLog(text, ms) {\n\n}\n' },
          sol: { js: 'function delayLog(text, ms) {\n  setTimeout(() => console.log(text), ms);\n}\ndelayLog("Tayyor!", 50);\n' },
          tests: [
            [['darhol chiqmaydi', 'не выводится сразу', 'not logged immediately'], "(() => { const before = logs.length; delayLog('X', 40); return logs.length === before; })()"],
            [['50ms dan keyin chiqadi', 'выводится через 50ms', 'logged after 50ms'], "(async () => { await tick(120); return logs.includes('Tayyor!'); })()"],
          ],
          rules: [['setTimeout', 'setTimeout', { t: 'js' }]],
        }),
        q: [
          out(['Konsol tartibi?', 'Порядок вывода?', 'Log order?'], 'setTimeout(() => console.log("B"), 0);\nconsole.log("A");', ['AB', 'A B', 'A, B'], ['Taymer joriy koddan keyin ishlaydi.', 'Таймер срабатывает после текущего кода.', 'The timer runs after the current code.'], { d: 'medium' }),
          mcq(['Takroriy taymerni to\'xtatish:', 'Остановить повторяющийся таймер:', 'Stop a repeating timer:'], ['stopInterval', 'clearInterval', 'clearTimeout', 'cancel'], 1, ['`clearInterval(id)`.', '`clearInterval(id)`.', '`clearInterval(id)`.']),
        ],
      }
    ),
    lesson(
      'promises',
      ['Promise', 'Promise', 'Promises'],
      [
        "**Promise** — kelajakda tayyor bo'ladigan natija. Uch holat: `pending` (kutilmoqda), `fulfilled` (muvaffaqiyatli), `rejected` (xato).\n```\nconst p = new Promise((resolve, reject) => {\n  setTimeout(() => resolve(\"tayyor\"), 500);\n});\np.then((v) => console.log(v)).catch((e) => console.error(e));\n```\n`then` zanjir qilinadi; `Promise.all([...])` bir nechta promise ni parallel kutadi.",
        "**Promise** — результат, который будет готов в будущем. Три состояния: `pending` (ожидание), `fulfilled` (успех), `rejected` (ошибка).\n```\nconst p = new Promise((resolve, reject) => {\n  setTimeout(() => resolve(\"готово\"), 500);\n});\np.then((v) => console.log(v)).catch((e) => console.error(e));\n```\n`then` можно соединять в цепочки; `Promise.all([...])` ждёт несколько промисов параллельно.",
        "A **Promise** is a result that will be ready in the future. Three states: `pending`, `fulfilled` (success), `rejected` (error).\n```\nconst p = new Promise((resolve, reject) => {\n  setTimeout(() => resolve(\"done\"), 500);\n});\np.then((v) => console.log(v)).catch((e) => console.error(e));\n```\n`then` calls chain; `Promise.all([...])` waits for several promises in parallel.",
      ],
      {
        ex: `function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
wait(300)
  .then(() => { console.log("300ms o'tdi"); return 42; })
  .then((n) => console.log("Javob:", n));`,
        exMode: 'js',
        ch: js({
          i: ['`checkAge(age)` Promise qaytarsin: `age >= 18` bo\'lsa `"ruxsat"` bilan resolve, aks holda `Error("kichik")` bilan reject.', '`checkAge(age)` возвращает Promise: при `age >= 18` — resolve со значением `"ruxsat"`, иначе reject с `Error("kichik")`.', '`checkAge(age)` returns a Promise: resolve with `"ruxsat"` when `age >= 18`, otherwise reject with `Error("kichik")`.'],
          s: { js: 'function checkAge(age) {\n\n}\n' },
          sol: { js: 'function checkAge(age) {\n  return new Promise((resolve, reject) => {\n    if (age >= 18) resolve("ruxsat");\n    else reject(new Error("kichik"));\n  });\n}\n' },
          tests: [
            [['20 → "ruxsat"', '20 → "ruxsat"', '20 → "ruxsat"'], "checkAge(20).then(v => v === 'ruxsat')"],
            [['10 → reject("kichik")', '10 → reject("kichik")', '10 → reject("kichik")'], "checkAge(10).then(() => false, e => e.message === 'kichik')"],
          ],
          rules: [['new\\s+Promise', 'Promise', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          match(['Promise holatlari', 'Состояния Promise', 'Promise states'], [['pending', 'waiting'], ['fulfilled', 'success'], ['rejected', 'error']], ['Kutish, muvaffaqiyat, xato.', 'Ожидание, успех, ошибка.', 'Waiting, success, error.']),
          mcq(['Xatoni ushlash:', 'Перехват ошибки:', 'Catch an error:'], ['.then()', '.catch()', '.error()', '.fail()'], 1, ['`.catch()`.', '`.catch()`.', '`.catch()`.']),
        ],
      }
    ),
    lesson(
      'async-await',
      ['async / await', 'async / await', 'async / await'],
      [
        "`async/await` — Promise lar bilan sinxron koddek yozish:\n```\nasync function load() {\n  const data = await getData();\n  console.log(data);\n}\n```\n- `async` funksiya **har doim Promise qaytaradi**\n- `await` faqat `async` funksiya ichida (yoki modulda) ishlaydi va Promise tayyor bo'lguncha kutadi\n- Xatolar `try { } catch (e) { }` bilan ushlanadi",
        "`async/await` — писать код с промисами как синхронный:\n```\nasync function load() {\n  const data = await getData();\n  console.log(data);\n}\n```\n- `async`-функция **всегда возвращает Promise**\n- `await` работает только в `async`-функции (или модуле) и ждёт готовности промиса\n- Ошибки ловятся через `try { } catch (e) { }`",
        "`async/await` lets you write promise code like synchronous code:\n```\nasync function load() {\n  const data = await getData();\n  console.log(data);\n}\n```\n- An `async` function **always returns a Promise**\n- `await` only works inside `async` functions (or modules) and waits for the promise\n- Errors are caught with `try { } catch (e) { }`",
      ],
      {
        ex: `const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function countdown() {
  for (let i = 3; i > 0; i--) {
    console.log(i);
    await wait(300);
  }
  console.log("Start! 🚀");
}
countdown();`,
        exMode: 'js',
        ch: js({
          i: ['`async function getDouble(promise)` — berilgan promise natijasini `await` qilib, uni 2 ga ko\'paytirib qaytarsin.', '`async function getDouble(promise)` — дождаться (`await`) результата промиса и вернуть его, умноженным на 2.', '`async function getDouble(promise)` — `await` the given promise and return its result times 2.'],
          s: { js: 'function getDouble(promise) {\n  return promise * 2;\n}\n' },
          sol: { js: 'async function getDouble(promise) {\n  const value = await promise;\n  return value * 2;\n}\n' },
          tests: [
            [['Promise qaytaradi', 'Возвращает Promise', 'Returns a Promise'], 'getDouble(Promise.resolve(1)) instanceof Promise'],
            [['21 → 42', '21 → 42', '21 → 42'], 'getDouble(Promise.resolve(21)).then(v => v === 42)'],
          ],
          rules: [['async', 'async', { t: 'js' }], ['await', 'await', { t: 'js' }]],
        }),
        q: [
          tf(['`async` funksiya har doim Promise qaytaradi.', '`async`-функция всегда возвращает Promise.', 'An `async` function always returns a Promise.'], true, ['`return 5` ham `Promise<5>` bo\'ladi.', 'Даже `return 5` становится `Promise<5>`.', 'Even `return 5` becomes `Promise<5>`.']),
          bug(['Xato qayerda?', 'Где ошибка?', 'Where is the bug?'], 'function load() {\n  const data = await fetch("/api");\n}', [['await async bo\'lmagan funksiyada', 'await в не-async функции', 'await inside a non-async function'], ['fetch noto\'g\'ri', 'fetch неверен', 'fetch is wrong'], ['const kerak emas', 'const не нужен', 'const is not needed']], 0, ['Funksiyaga `async` qo\'shing.', 'Добавьте `async` к функции.', 'Add `async` to the function.']),
        ],
      }
    ),
    lesson(
      'fetch-api',
      ['Fetch API', 'Fetch API', 'The Fetch API'],
      [
        "`fetch(url)` serverga HTTP so'rov yuboradi va Promise qaytaradi. Javobdan JSON olish uchun `await response.json()`:\n```\nconst res = await fetch(\"https://api.codeverse.dev/users\");\nif (!res.ok) throw new Error(\"Xato: \" + res.status);\nconst users = await res.json();\n```\nPOST so'rov: `fetch(url, { method: \"POST\", headers: { \"Content-Type\": \"application/json\" }, body: JSON.stringify(data) })`.\n\n🧪 Sandboxda `https://api.codeverse.dev` soxta API ishlaydi: `/users`, `/users/1`, `/todos`, `/posts/1`, `/quote`.",
        "`fetch(url)` отправляет HTTP-запрос на сервер и возвращает Promise. JSON из ответа — через `await response.json()`:\n```\nconst res = await fetch(\"https://api.codeverse.dev/users\");\nif (!res.ok) throw new Error(\"Ошибка: \" + res.status);\nconst users = await res.json();\n```\nPOST-запрос: `fetch(url, { method: \"POST\", headers: { \"Content-Type\": \"application/json\" }, body: JSON.stringify(data) })`.\n\n🧪 В песочнице работает тестовый API `https://api.codeverse.dev`: `/users`, `/users/1`, `/todos`, `/posts/1`, `/quote`.",
        "`fetch(url)` sends an HTTP request and returns a Promise. Get JSON from the response with `await response.json()`:\n```\nconst res = await fetch(\"https://api.codeverse.dev/users\");\nif (!res.ok) throw new Error(\"Error: \" + res.status);\nconst users = await res.json();\n```\nA POST request: `fetch(url, { method: \"POST\", headers: { \"Content-Type\": \"application/json\" }, body: JSON.stringify(data) })`.\n\n🧪 The sandbox has a fake API at `https://api.codeverse.dev`: `/users`, `/users/1`, `/todos`, `/posts/1`, `/quote`.",
      ],
      {
        ex: `async function showTodos() {
  const res = await fetch("https://api.codeverse.dev/todos");
  const todos = await res.json();
  todos.forEach((t) => console.log(t.done ? "✅" : "⬜", t.title));
}
showTodos();`,
        exMode: 'js',
        ch: js({
          i: ['`async function getUserNames()` — `https://api.codeverse.dev/users` dan foydalanuvchilarni olib, ularning **ismlari** massivini qaytarsin.', '`async function getUserNames()` — загрузить пользователей с `https://api.codeverse.dev/users` и вернуть массив их **имён**.', '`async function getUserNames()` — fetch users from `https://api.codeverse.dev/users` and return an array of their **names**.'],
          s: { js: 'async function getUserNames() {\n\n}\n' },
          sol: { js: 'async function getUserNames() {\n  const res = await fetch("https://api.codeverse.dev/users");\n  const users = await res.json();\n  return users.map((u) => u.name);\n}\n' },
          tests: [[['["Aziza", "Bekzod", "Dilnoza"]', '["Aziza", "Bekzod", "Dilnoza"]', '["Aziza", "Bekzod", "Dilnoza"]'], "getUserNames().then(n => JSON.stringify(n) === JSON.stringify(['Aziza', 'Bekzod', 'Dilnoza']))"]],
          rules: [['fetch\\(', 'fetch', { t: 'js' }], ['\\.json\\(\\)', 'json()', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          fill(['Javobni JSON ga aylantirish:', 'Преобразовать ответ в JSON:', 'Parse the response as JSON:'], 'const data = await res.___();', ['json'], ['`res.json()` ham Promise qaytaradi.', '`res.json()` тоже возвращает Promise.', '`res.json()` also returns a Promise.']),
          tf(['`fetch` 404 javobida avtomatik xato (reject) beradi.', '`fetch` автоматически отклоняется при ответе 404.', '`fetch` automatically rejects on a 404 response.'], false, ['Faqat tarmoq xatosida reject; `res.ok` ni tekshiring.', 'Reject только при сетевой ошибке; проверяйте `res.ok`.', 'It only rejects on network errors; check `res.ok`.'], { d: 'medium' }),
        ],
      }
    ),
    lesson(
      'errors-json',
      ['Xatolar va JSON', 'Ошибки и JSON', 'Errors and JSON'],
      [
        "**try/catch** xatoni ushlab, dasturni qulashdan saqlaydi:\n```\ntry {\n  riskyCode();\n} catch (error) {\n  console.error(error.message);\n} finally {\n  console.log(\"har doim ishlaydi\");\n}\n```\nO'z xatoingizni chiqarish: `throw new Error(\"Noto'g'ri qiymat\")`.\n\n**JSON** — ma'lumot almashish formati. `JSON.stringify(obj)` → satr, `JSON.parse(text)` → obyekt (noto'g'ri JSON da xato beradi — try/catch bilan o'rang!).",
        "**try/catch** перехватывает ошибку и не даёт программе упасть:\n```\ntry {\n  riskyCode();\n} catch (error) {\n  console.error(error.message);\n} finally {\n  console.log(\"выполняется всегда\");\n}\n```\nСвоя ошибка: `throw new Error(\"Неверное значение\")`.\n\n**JSON** — формат обмена данными. `JSON.stringify(obj)` → строка, `JSON.parse(text)` → объект (на неверном JSON бросает ошибку — оборачивайте в try/catch!).",
        "**try/catch** catches an error so the program doesn't crash:\n```\ntry {\n  riskyCode();\n} catch (error) {\n  console.error(error.message);\n} finally {\n  console.log(\"always runs\");\n}\n```\nThrow your own: `throw new Error(\"Invalid value\")`.\n\n**JSON** is a data-exchange format. `JSON.stringify(obj)` → string, `JSON.parse(text)` → object (throws on invalid JSON — wrap it in try/catch!).",
      ],
      {
        ex: `const text = '{"name":"Aziza","xp":120}';
const user = JSON.parse(text);
console.log(user.name);

try {
  JSON.parse("{noto'g'ri}");
} catch (e) {
  console.log("Xato ushlandi:", e.name);
}`,
        exMode: 'js',
        ch: js({
          i: ['`safeParse(text)` — JSON ni parse qilsin; xato bo\'lsa `null` qaytarsin (dastur qulamasin).', '`safeParse(text)` — парсит JSON; при ошибке возвращает `null` (без падения программы).', '`safeParse(text)` — parse JSON; on error, return `null` (no crash).'],
          s: { js: 'function safeParse(text) {\n  return JSON.parse(text);\n}\n' },
          sol: { js: 'function safeParse(text) {\n  try {\n    return JSON.parse(text);\n  } catch (error) {\n    return null;\n  }\n}\n' },
          tests: [
            [['to\'g\'ri JSON', 'верный JSON', 'valid JSON'], "safeParse('{\"a\":1}').a === 1"],
            [['noto\'g\'ri JSON → null', 'неверный JSON → null', 'invalid JSON → null'], "safeParse('{oops') === null"],
          ],
          rules: [['try', 'try', { t: 'js' }], ['catch', 'catch', { t: 'js' }]],
        }),
        q: [
          out(['Natija?', 'Результат?', 'Result?'], 'console.log(JSON.stringify({ a: 1, b: [2] }));', ['{"a":1,"b":[2]}'], ['Obyekt JSON satrga aylandi.', 'Объект превратился в JSON-строку.', 'The object became a JSON string.']),
          order(['try/catch tuzilmasini tartiblang', 'Упорядочите try/catch', 'Order the try/catch'], ['try {', '  JSON.parse(text);', '} catch (e) {', '  console.log("xato");', '}'], ['try → catch.', 'try → catch.', 'try → catch.']),
        ],
      }
    ),
  ],
  [
    out(['Natija tartibi?', 'Порядок вывода?', 'Output order?'], 'console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);', ['1432', '1 4 3 2'], ['Sinxron → microtask (Promise) → taymer.', 'Синхронный код → microtask (Promise) → таймер.', 'Sync → microtask (Promise) → timer.'], { d: 'hard' }),
    mcq(['`await` qayerda ishlaydi?', 'Где работает `await`?', 'Where does `await` work?'], [['async funksiya ichida', 'Внутри async-функции', 'Inside an async function'], ['Har qanday funksiyada', 'В любой функции', 'In any function'], ['Faqat for ichida', 'Только в for', 'Only inside for']], 0, ['`async` kerak.', 'Нужен `async`.', 'It needs `async`.']),
    tf(['`JSON.parse` noto\'g\'ri satrda xato beradi.', '`JSON.parse` бросает ошибку на неверной строке.', '`JSON.parse` throws on an invalid string.'], true, ['try/catch bilan o\'rang.', 'Оборачивайте в try/catch.', 'Wrap it in try/catch.']),
    fill(['POST so\'rov:', 'POST-запрос:', 'A POST request:'], 'fetch(url, { ___: "POST" })', ['method'], ['`method`.', '`method`.', '`method`.']),
    match(['Moslang', 'Сопоставьте', 'Match'], [['JSON.stringify', 'object → text'], ['JSON.parse', 'text → object'], ['res.json()', 'response → data']], ['stringify — satrga, parse — obyektga, res.json — javobdan.', 'stringify — в строку, parse — в объект, res.json — из ответа.', 'stringify → text, parse → object, res.json → from response.']),
    bug(['Nega `users` Promise bo\'lib qoldi?', 'Почему `users` остался Promise?', 'Why is `users` still a Promise?'], 'async function load() {\n  const res = await fetch(url);\n  const users = res.json();\n  console.log(users.length);\n}', [['res.json() oldidan await yo\'q', 'Нет await перед res.json()', 'Missing await before res.json()'], ['fetch oldidan await ortiqcha', 'Лишний await перед fetch', 'Extra await before fetch'], ['async kerak emas', 'async не нужен', 'async is not needed']], 0, ['`res.json()` ham Promise — `await` kerak.', '`res.json()` тоже Promise — нужен `await`.', '`res.json()` is a Promise too — needs `await`.'], { d: 'medium' }),
  ]
);
