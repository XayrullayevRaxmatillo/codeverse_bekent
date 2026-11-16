import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

const rc = (o) => ch({ mode: 'react', ...o });
const act = (steps, check) => `(async () => { ${steps} await tick(); return ${check}; })()`;

export default mod(
  'react-effects',
  ['Effektlar va ref', 'Эффекты и ref', 'Effects and refs'],
  ['useEffect, ma\'lumot yuklash, tozalash va useRef.', 'useEffect, загрузка данных, очистка и useRef.', 'useEffect, data fetching, cleanup and useRef.'],
  [
    lesson(
      'use-effect',
      ['useEffect', 'useEffect', 'useEffect'],
      [
        "**Effekt** — render dan keyin bajariladigan \"tashqi\" ish: sarlavhani o'zgartirish, ma'lumot yuklash, taymer, obuna.\n```\nuseEffect(() => {\n  document.title = `${count} ta xabar`;\n}, [count]);\n```\nIkkinchi argument — **bog'liqliklar** massivi: effekt faqat ular o'zgarganda qayta ishlaydi. Render ichida to'g'ridan-to'g'ri yon ta'sir (side effect) qilmang — useEffect dan foydalaning.",
        "**Эффект** — «внешняя» работа после рендера: смена заголовка, загрузка данных, таймер, подписка.\n```\nuseEffect(() => {\n  document.title = `${count} сообщений`;\n}, [count]);\n```\nВторой аргумент — массив **зависимостей**: эффект перезапускается, только когда они меняются. Не делайте побочных эффектов прямо в рендере — используйте useEffect.",
        "An **effect** is \"outside\" work done after rendering: updating the title, fetching data, timers, subscriptions.\n```\nuseEffect(() => {\n  document.title = `${count} messages`;\n}, [count]);\n```\nThe second argument is the **dependency** array: the effect re-runs only when those change. Don't do side effects directly during render — use useEffect.",
      ],
      {
        ex: `const { useState, useEffect } = React;

function App() {
  const [clicks, setClicks] = useState(0);
  useEffect(() => {
    console.log("Effekt ishladi, clicks =", clicks);
  }, [clicks]);
  return <button onClick={() => setClicks(clicks + 1)}>Bosildi: {clicks}</button>;
}`,
        ch: rc({
          i: ['`useEffect` yordamida `count` o\'zgarganda `document.title` = `"Ball: COUNT"` bo\'lsin. `<button className="inc">` count ni oshiradi.', 'С помощью `useEffect` при изменении `count` устанавливайте `document.title` = `"Ball: COUNT"`. `<button className="inc">` увеличивает count.', 'Use `useEffect` to set `document.title` to `"Ball: COUNT"` whenever `count` changes. `<button className="inc">` increments count.'],
          s: { js: 'const { useState, useEffect } = React;\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  return <button className="inc" onClick={() => setCount(count + 1)}>{count}</button>;\n}\n' },
          sol: { js: 'const { useState, useEffect } = React;\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    document.title = `Ball: ${count}`;\n  }, [count]);\n  return <button className="inc" onClick={() => setCount(count + 1)}>{count}</button>;\n}\n' },
          tests: [
            [['boshida "Ball: 0"', 'сначала "Ball: 0"', 'initially "Ball: 0"'], "document.title === 'Ball: 0'"],
            [['bosilgandan keyin "Ball: 1"', 'после клика "Ball: 1"', 'after a click "Ball: 1"'], act("$('.inc').click();", "document.title === 'Ball: 1'")],
          ],
          rules: [['useEffect', 'useEffect', { t: 'js' }]],
        }),
        q: [
          mcq(['Effekt qachon ishlaydi?', 'Когда выполняется эффект?', 'When does an effect run?'], [['Render dan keyin', 'После рендера', 'After render'], ['Render dan oldin', 'До рендера', 'Before render'], ['Faqat server da', 'Только на сервере', 'Only on the server']], 0, ['useEffect DOM yangilangandan keyin ishlaydi.', 'useEffect срабатывает после обновления DOM.', 'useEffect runs after the DOM updates.']),
          tf(['Bog\'liqliklar massivi effekt qachon qayta ishlashini belgilaydi.', 'Массив зависимостей определяет, когда эффект перезапускается.', 'The dependency array controls when the effect re-runs.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
        ],
      }
    ),
    lesson(
      'effect-deps',
      ['Bog\'liqliklar', 'Зависимости', 'Dependencies'],
      [
        "Bog'liqliklar massivining uch varianti:\n- `useEffect(fn)` — **har** renderdan keyin\n- `useEffect(fn, [])` — faqat **bir marta**, komponent paydo bo'lganda (mount)\n- `useEffect(fn, [a, b])` — `a` yoki `b` o'zgarganda\n\nEffekt ichida ishlatilgan barcha state/props bog'liqliklarda bo'lishi kerak. Effekt ichida o'z bog'liqligini o'zgartirsangiz — cheksiz sikl!",
        "Три варианта массива зависимостей:\n- `useEffect(fn)` — после **каждого** рендера\n- `useEffect(fn, [])` — только **один раз**, при появлении компонента (mount)\n- `useEffect(fn, [a, b])` — когда меняется `a` или `b`\n\nВсе state/props, используемые в эффекте, должны быть в зависимостях. Если эффект меняет свою же зависимость — бесконечный цикл!",
        "Three forms of the dependency array:\n- `useEffect(fn)` — after **every** render\n- `useEffect(fn, [])` — only **once**, when the component mounts\n- `useEffect(fn, [a, b])` — when `a` or `b` changes\n\nEvery state/prop used inside the effect belongs in the dependencies. If an effect changes its own dependency — infinite loop!",
      ],
      {
        ex: `const { useState, useEffect } = React;

function App() {
  const [mounted, setMounted] = useState("");
  useEffect(() => {
    setMounted(new Date().toLocaleTimeString());
  }, []); // faqat bir marta
  return <p>Komponent yuklangan vaqt: {mounted}</p>;
}`,
        ch: rc({
          i: ['`renders` hisoblagichi: effekt faqat **bir marta** (mount) ishlab, `<p className="mounted">` ga `"Tayyor"` yozsin; `<button className="inc">` boshqa state ni o\'zgartirganda effekt qayta ishlamasin (global `effectRuns` hisoblagichini oshiring).', 'Эффект должен выполниться только **один раз** (mount) и записать `"Tayyor"` в `<p className="mounted">`; при клике `<button className="inc">` (меняет другой state) эффект не перезапускается (увеличивайте глобальный счётчик `effectRuns`).', 'The effect must run only **once** (on mount) and write `"Tayyor"` into `<p className="mounted">`; clicking `<button className="inc">` (which changes other state) must not re-run it (increment the global `effectRuns` counter).'],
          s: { js: 'const { useState, useEffect } = React;\nvar effectRuns = 0;\n\nfunction App() {\n  const [status, setStatus] = useState("");\n  const [n, setN] = useState(0);\n  useEffect(() => {\n    effectRuns++;\n    setStatus("Tayyor");\n  });\n  return (\n    <div>\n      <p className="mounted">{status}</p>\n      <button className="inc" onClick={() => setN(n + 1)}>{n}</button>\n    </div>\n  );\n}\n' },
          sol: { js: 'const { useState, useEffect } = React;\nvar effectRuns = 0;\n\nfunction App() {\n  const [status, setStatus] = useState("");\n  const [n, setN] = useState(0);\n  useEffect(() => {\n    effectRuns++;\n    setStatus("Tayyor");\n  }, []);\n  return (\n    <div>\n      <p className="mounted">{status}</p>\n      <button className="inc" onClick={() => setN(n + 1)}>{n}</button>\n    </div>\n  );\n}\n' },
          tests: [
            [['"Tayyor" ko\'rinadi', 'видно "Tayyor"', '"Tayyor" is shown'], "text('.mounted') === 'Tayyor'"],
            [['2 bosishdan keyin ham effekt 1 marta', 'после 2 кликов эффект выполнен 1 раз', 'effect ran once even after 2 clicks'], act("$('.inc').click(); await tick(); $('.inc').click();", 'effectRuns === 1')],
          ],
          rules: [['\\[\\s*\\]\\s*\\)', '[]', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          match(['Bog\'liqliklar va xatti-harakat', 'Зависимости и поведение', 'Dependencies and behavior'], [['no array', 'every render'], ['[]', 'once on mount'], ['[id]', 'when id changes']], ['Massiv yo\'q — har doim, [] — bir marta, [id] — id o\'zgarsa.', 'Без массива — всегда, [] — один раз, [id] — при смене id.', 'No array → always, [] → once, [id] → on id change.']),
          bug(['Nega cheksiz sikl?', 'Почему бесконечный цикл?', 'Why an infinite loop?'], 'useEffect(() => {\n  setCount(count + 1);\n}, [count]);', [['Effekt o\'z bog\'liqligini o\'zgartiradi', 'Эффект меняет свою зависимость', 'The effect changes its own dependency'], ['useEffect ichida setCount mumkin emas', 'setCount нельзя в useEffect', 'setCount is not allowed in useEffect'], ['[] yetishmaydi', 'Не хватает []', '[] is missing']], 0, ['count o\'zgaradi → effekt → count o\'zgaradi...', 'count меняется → эффект → count меняется...', 'count changes → effect → count changes...'], { d: 'medium' }),
        ],
      }
    ),
    lesson(
      'fetch-in-effect',
      ['Effektda ma\'lumot yuklash', 'Загрузка данных в эффекте', 'Fetching data in an effect'],
      [
        "API dan ma'lumot yuklashning odatiy namunasi — uch holat: `loading`, `error`, `data`:\n```\nuseEffect(() => {\n  fetch(url)\n    .then((r) => r.json())\n    .then(setData)\n    .catch(() => setError(\"Xato\"))\n    .finally(() => setLoading(false));\n}, []);\n```\nFoydalanuvchiga har doim yuklanish va xato holatini ko'rsating! (Katta loyihalarda React Query kabi kutubxonalar ishlatiladi — CODEVERSE ham shunday qurilgan.)",
        "Типичный шаблон загрузки данных из API — три состояния: `loading`, `error`, `data`:\n```\nuseEffect(() => {\n  fetch(url)\n    .then((r) => r.json())\n    .then(setData)\n    .catch(() => setError(\"Ошибка\"))\n    .finally(() => setLoading(false));\n}, []);\n```\nВсегда показывайте пользователю загрузку и ошибку! (В больших проектах используют библиотеки вроде React Query — так построен и CODEVERSE.)",
        "The usual pattern for loading API data has three states: `loading`, `error`, `data`:\n```\nuseEffect(() => {\n  fetch(url)\n    .then((r) => r.json())\n    .then(setData)\n    .catch(() => setError(\"Error\"))\n    .finally(() => setLoading(false));\n}, []);\n```\nAlways show loading and error states! (Big projects use libraries like React Query — CODEVERSE itself is built that way.)",
      ],
      {
        ex: `const { useState, useEffect } = React;

function App() {
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    fetch("https://api.codeverse.dev/quote")
      .then((r) => r.json())
      .then(setQuote);
  }, []);
  if (!quote) return <p>Yuklanmoqda...</p>;
  return <blockquote>“{quote.text}” — {quote.author}</blockquote>;
}`,
        ch: rc({
          i: ['`https://api.codeverse.dev/users` dan foydalanuvchilarni yuklang. Yuklanayotganda `<p className="loading">Yuklanmoqda...</p>`, keyin har birini `<li className="user">` da (ism) ko\'rsating.', 'Загрузите пользователей с `https://api.codeverse.dev/users`. Во время загрузки — `<p className="loading">Yuklanmoqda...</p>`, затем каждого в `<li className="user">` (имя).', 'Load users from `https://api.codeverse.dev/users`. While loading, show `<p className="loading">Yuklanmoqda...</p>`, then each user’s name in an `<li className="user">`.'],
          s: { js: 'const { useState, useEffect } = React;\n\nfunction App() {\n  const [users, setUsers] = useState([]);\n  return <ul></ul>;\n}\n' },
          sol: { js: 'const { useState, useEffect } = React;\n\nfunction App() {\n  const [users, setUsers] = useState(null);\n  useEffect(() => {\n    fetch("https://api.codeverse.dev/users")\n      .then((r) => r.json())\n      .then(setUsers);\n  }, []);\n  if (!users) return <p className="loading">Yuklanmoqda...</p>;\n  return (\n    <ul>\n      {users.map((u) => (\n        <li className="user" key={u.id}>{u.name}</li>\n      ))}\n    </ul>\n  );\n}\n' },
          tests: [
            [['3 ta foydalanuvchi', '3 пользователя', '3 users'], "(async () => { await tick(200); return $$('.user').map(l => l.textContent).join(',') === 'Aziza,Bekzod,Dilnoza'; })()"],
          ],
          rules: [['fetch\\(', 'fetch', { t: 'js' }], ['useEffect', 'useEffect', { t: 'js' }], ['loading', 'loading', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          order(['Yuklash zanjirini tartiblang', 'Упорядочите цепочку загрузки', 'Order the fetch chain'], ['fetch(url)', '.then((r) => r.json())', '.then(setData)', '.catch(handleError)'], ['so\'rov → json → state → xato.', 'запрос → json → state → ошибка.', 'request → json → state → error.']),
          tf(['Yuklanish va xato holatlarini ko\'rsatish shart emas.', 'Показывать загрузку и ошибку не обязательно.', 'Showing loading and error states is optional.'], false, ['Bu yaxshi UX ning asosi.', 'Это основа хорошего UX.', "It's the basis of good UX."]),
        ],
      }
    ),
    lesson(
      'cleanup',
      ['Effektni tozalash', 'Очистка эффекта', 'Effect cleanup'],
      [
        "Effekt **funksiya qaytarsa**, React uni komponent yo'qolganda (unmount) yoki effekt qayta ishlashidan oldin chaqiradi — bu **cleanup**:\n```\nuseEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);\n```\nTaymerlar, hodisa tinglovchilari (`addEventListener`) va obunalarni har doim tozalang — aks holda xotira oqadi (memory leak).",
        "Если эффект **возвращает функцию**, React вызовет её при удалении компонента (unmount) или перед повторным запуском — это **очистка** (cleanup):\n```\nuseEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);\n```\nВсегда очищайте таймеры, обработчики (`addEventListener`) и подписки — иначе утечка памяти.",
        "If an effect **returns a function**, React calls it when the component unmounts or before the effect re-runs — that's **cleanup**:\n```\nuseEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);\n```\nAlways clean up timers, event listeners (`addEventListener`) and subscriptions — otherwise you leak memory.",
      ],
      {
        ex: `const { useState, useEffect } = React;

function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);
  return <h2>🕒 {time}</h2>;
}

function App() {
  const [show, setShow] = useState(true);
  return (<><button onClick={() => setShow(!show)}>Soat</button>{show && <Clock />}</>);
}`,
        ch: rc({
          i: ['`Timer` komponenti har 50ms da `<span className="sec">` dagi sonni 1 ga oshirsin va unmount bo\'lganda `clearInterval` bilan to\'xtasin (global `cleared = true` qiling). `App` dagi `<button className="hide">` Timer ni yashiradi.', 'Компонент `Timer` каждые 50мс увеличивает число в `<span className="sec">` на 1 и останавливается через `clearInterval` при unmount (установите глобальный `cleared = true`). `<button className="hide">` в `App` скрывает Timer.', 'The `Timer` component increments the number in `<span className="sec">` every 50ms and stops with `clearInterval` on unmount (set the global `cleared = true`). The `<button className="hide">` in `App` hides the Timer.'],
          s: { js: 'const { useState, useEffect } = React;\nvar cleared = false;\n\nfunction Timer() {\n  const [sec, setSec] = useState(0);\n  useEffect(() => {\n    setInterval(() => setSec((s) => s + 1), 50);\n  }, []);\n  return <span className="sec">{sec}</span>;\n}\n\nfunction App() {\n  const [show, setShow] = useState(true);\n  return (\n    <div>\n      <button className="hide" onClick={() => setShow(false)}>Yashirish</button>\n      {show && <Timer />}\n    </div>\n  );\n}\n' },
          sol: { js: 'const { useState, useEffect } = React;\nvar cleared = false;\n\nfunction Timer() {\n  const [sec, setSec] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => setSec((s) => s + 1), 50);\n    return () => {\n      clearInterval(id);\n      cleared = true;\n    };\n  }, []);\n  return <span className="sec">{sec}</span>;\n}\n\nfunction App() {\n  const [show, setShow] = useState(true);\n  return (\n    <div>\n      <button className="hide" onClick={() => setShow(false)}>Yashirish</button>\n      {show && <Timer />}\n    </div>\n  );\n}\n' },
          tests: [
            [['taymer ishlaydi', 'таймер работает', 'the timer runs'], "(async () => { await tick(180); return Number(text('.sec')) >= 2; })()"],
            [['yashirilganda tozalanadi', 'очищается при скрытии', 'cleans up when hidden'], act("$('.hide').click();", "cleared === true && !exists('.sec')")],
          ],
          rules: [['clearInterval', 'clearInterval', { t: 'js' }], ['return\\s*\\(?\\s*\\)?\\s*=>', 'cleanup', { t: 'js' }]],
          d: 'hard',
        }),
        q: [
          mcq(['Cleanup qanday yoziladi?', 'Как пишется очистка?', 'How is cleanup written?'], [['Effektdan funksiya qaytarish', 'Вернуть функцию из эффекта', 'Return a function from the effect'], ['useCleanup hook', 'Хук useCleanup', 'A useCleanup hook'], ['finally bloki', 'Блок finally', 'A finally block']], 0, ['`return () => {...}`.', '`return () => {...}`.', '`return () => {...}`.']),
          tf(['Tozalanmagan setInterval unmount dan keyin ham ishlayveradi.', 'Неочищенный setInterval продолжает работать после unmount.', 'An uncleared setInterval keeps running after unmount.'], true, ['Shuning uchun clearInterval kerak.', 'Поэтому нужен clearInterval.', "That's why clearInterval is needed."]),
        ],
      }
    ),
    lesson(
      'use-ref',
      ['useRef', 'useRef', 'useRef'],
      [
        "`useRef` ikki maqsadda ishlatiladi:\n1. **DOM elementga murojaat**: `const inputRef = useRef(null); <input ref={inputRef} />` → `inputRef.current.focus()`\n2. Render orasida saqlanadigan, lekin o'zgarganda **qayta chizmaydigan** qiymat: `const timerId = useRef();`\n\n`ref.current` ni o'zgartirish render chaqirmaydi — ekranda ko'rinadigan ma'lumot uchun state ishlating.",
        "`useRef` используется для двух целей:\n1. **Доступ к DOM-элементу**: `const inputRef = useRef(null); <input ref={inputRef} />` → `inputRef.current.focus()`\n2. Значение, которое сохраняется между рендерами, но **не вызывает перерисовку**: `const timerId = useRef();`\n\nИзменение `ref.current` не вызывает рендер — для видимых данных используйте state.",
        "`useRef` serves two purposes:\n1. **Accessing a DOM element**: `const inputRef = useRef(null); <input ref={inputRef} />` → `inputRef.current.focus()`\n2. A value that persists between renders but **doesn't re-render** when changed: `const timerId = useRef();`\n\nChanging `ref.current` doesn't trigger a render — use state for anything shown on screen.",
      ],
      {
        ex: `const { useRef } = React;

function App() {
  const inputRef = useRef(null);
  return (
    <div>
      <input ref={inputRef} placeholder="Qidiruv..." />
      <button onClick={() => inputRef.current.focus()}>Fokus</button>
    </div>
  );
}`,
        ch: rc({
          i: ['`<button className="focus">` bosilganda `useRef` orqali `<input className="search">` ga fokus bering.', 'По клику на `<button className="focus">` через `useRef` установите фокус на `<input className="search">`.', 'When `<button className="focus">` is clicked, focus `<input className="search">` via `useRef`.'],
          s: { js: 'const { useRef } = React;\n\nfunction App() {\n  return (\n    <div>\n      <input className="search" />\n      <button className="focus">Fokus</button>\n    </div>\n  );\n}\n' },
          sol: { js: 'const { useRef } = React;\n\nfunction App() {\n  const ref = useRef(null);\n  return (\n    <div>\n      <input className="search" ref={ref} />\n      <button className="focus" onClick={() => ref.current.focus()}>Fokus</button>\n    </div>\n  );\n}\n' },
          tests: [[['input fokusda', 'input в фокусе', 'input is focused'], act("$('.focus').click();", "document.activeElement === $('.search')")]],
          rules: [['useRef', 'useRef', { t: 'js' }], ['ref=\\{', 'ref', { t: 'js' }]],
        }),
        q: [
          tf(['`ref.current` ni o\'zgartirish komponentni qayta chizadi.', 'Изменение `ref.current` перерисовывает компонент.', 'Changing `ref.current` re-renders the component.'], false, ['Ref render chaqirmaydi.', 'Ref не вызывает рендер.', 'Refs never trigger renders.']),
          fill(['DOM elementga bog\'lash:', 'Привязать к DOM-элементу:', 'Attach to a DOM element:'], '<input ___={inputRef} />', ['ref'], ['`ref` atributi.', 'Атрибут `ref`.', 'The `ref` attribute.']),
        ],
      }
    ),
  ],
  [
    mcq(['Faqat bir marta (mount) ishlaydigan effekt:', 'Эффект, выполняемый один раз (mount):', 'An effect that runs only once (mount):'], ['useEffect(fn)', 'useEffect(fn, [])', 'useEffect(fn, [x])', 'useOnce(fn)'], 1, ['Bo\'sh massiv.', 'Пустой массив.', 'An empty array.']),
    tf(['Effektdan qaytarilgan funksiya cleanup vazifasini bajaradi.', 'Функция, возвращаемая из эффекта, — это очистка.', 'The function returned from an effect is the cleanup.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
    match(['Hook va vazifa', 'Хук и назначение', 'Hook and purpose'], [['useState', 'render data'], ['useEffect', 'side effects'], ['useRef', 'DOM / no re-render']], ['state — ko\'rinadigan ma\'lumot, effect — yon ta\'sir, ref — DOM.', 'state — данные, effect — побочные эффекты, ref — DOM.', 'state → data, effect → side effects, ref → DOM.']),
    bug(['Qanday muammo bor?', 'В чём проблема?', "What's the problem?"], 'useEffect(() => {\n  window.addEventListener("resize", onResize);\n}, []);', [['Tinglovchi olib tashlanmagan (cleanup yo\'q)', 'Обработчик не удаляется (нет cleanup)', 'The listener is never removed (no cleanup)'], ['resize hodisasi yo\'q', 'Нет события resize', 'There is no resize event'], ['[] noto\'g\'ri', '[] неверно', '[] is wrong']], 0, ['`return () => window.removeEventListener("resize", onResize)`.', '`return () => window.removeEventListener("resize", onResize)`.', '`return () => window.removeEventListener("resize", onResize)`.'], { d: 'medium' }),
    fill(['Input ga fokus:', 'Фокус на input:', 'Focus the input:'], 'inputRef.___.focus();', ['current'], ['`ref.current` — DOM element.', '`ref.current` — DOM-элемент.', '`ref.current` is the DOM element.']),
  ]
);
