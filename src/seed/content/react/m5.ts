import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

const rc = (o) => ch({ mode: 'react', d: 'medium', ...o });
const act = (steps, check) => `(async () => { ${steps} await tick(); return ${check}; })()`;
const type = (sel, val) => `{ const el = $('${sel}'); const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(el, ${JSON.stringify(val)}); el.dispatchEvent(new Event('input', { bubbles: true })); }`;

export default mod(
  'react-projects',
  ['Amaliy komponentlar', 'Практические компоненты', 'Real-world components'],
  ['Haqiqiy ilovalarda uchraydigan komponentlarni noldan quramiz.', 'Строим с нуля компоненты из реальных приложений.', 'Build components you find in real apps, from scratch.'],
  [
    lesson(
      'tabs',
      ['Tabs komponenti', 'Компонент вкладок', 'Tabs component'],
      [
        "Tablar — bir joyda bir nechta panel. G'oya: faol tab **indeksi** state da, tugmalar uni o'zgartiradi, faqat faol panel chiziladi. Qulaylik uchun: `role=\"tablist\"`, `role=\"tab\"`, `aria-selected`.",
        "Вкладки — несколько панелей в одном месте. Идея: **индекс** активной вкладки в state, кнопки его меняют, рисуется только активная панель. Для доступности: `role=\"tablist\"`, `role=\"tab\"`, `aria-selected`.",
        "Tabs show several panels in one place. Idea: the active tab **index** lives in state, buttons change it, and only the active panel renders. For accessibility: `role=\"tablist\"`, `role=\"tab\"`, `aria-selected`.",
      ],
      {
        ex: `const { useState } = React;
const tabs = [
  { title: "HTML", body: "Skelet" },
  { title: "CSS", body: "Kiyim" },
  { title: "JS", body: "Miya" },
];
function App() {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div role="tablist">
        {tabs.map((t, i) => (
          <button key={t.title} role="tab" aria-selected={i === active} onClick={() => setActive(i)}>{t.title}</button>
        ))}
      </div>
      <p>{tabs[active].body}</p>
    </div>
  );
}`,
        ch: rc({
          i: ['3 ta tab: `<button className="tab">` (A, B, C). Bosilganda `<p className="panel">` da mos matn (`"A paneli"`, `"B paneli"`, `"C paneli"`), faol tabda `aria-selected="true"`.', '3 вкладки: `<button className="tab">` (A, B, C). По клику в `<p className="panel">` — соответствующий текст (`"A paneli"`, `"B paneli"`, `"C paneli"`), у активной `aria-selected="true"`.', '3 tabs: `<button className="tab">` (A, B, C). Clicking shows the matching text in `<p className="panel">` (`"A paneli"`, `"B paneli"`, `"C paneli"`); the active tab has `aria-selected="true"`.'],
          s: { js: 'const { useState } = React;\nconst names = ["A", "B", "C"];\n\nfunction App() {\n  return (\n    <div>\n      {names.map((n) => <button key={n} className="tab">{n}</button>)}\n      <p className="panel"></p>\n    </div>\n  );\n}\n' },
          sol: { js: 'const { useState } = React;\nconst names = ["A", "B", "C"];\n\nfunction App() {\n  const [active, setActive] = useState(0);\n  return (\n    <div>\n      {names.map((n, i) => (\n        <button key={n} className="tab" aria-selected={i === active} onClick={() => setActive(i)}>{n}</button>\n      ))}\n      <p className="panel">{names[active]} paneli</p>\n    </div>\n  );\n}\n' },
          tests: [
            [['boshida A paneli', 'сначала A paneli', 'A paneli at first'], "text('.panel') === 'A paneli' && $$('.tab')[0].getAttribute('aria-selected') === 'true'"],
            [['C bosilsa C paneli', 'клик C → C paneli', 'click C → C paneli'], act("$$('.tab')[2].click();", "text('.panel') === 'C paneli' && $$('.tab')[2].getAttribute('aria-selected') === 'true' && $$('.tab')[0].getAttribute('aria-selected') === 'false'")],
          ],
          rules: [['aria-selected', 'aria-selected', { t: 'js' }], ['useState', 'useState', { t: 'js' }]],
        }),
        q: [
          mcq(['Faol tab qayerda saqlanadi?', 'Где хранится активная вкладка?', 'Where is the active tab stored?'], ['state', 'localStorage', 'CSS', 'props of the button'], 0, ['Faol indeks — state.', 'Активный индекс — в state.', 'The active index is state.']),
          tf(['`aria-selected` ekran o\'quvchiga qaysi tab tanlanganini bildiradi.', '`aria-selected` сообщает скринридеру, какая вкладка выбрана.', '`aria-selected` tells screen readers which tab is selected.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
        ],
      }
    ),
    lesson(
      'search-filter',
      ['Jonli qidiruv', 'Живой поиск', 'Live search'],
      [
        "Jonli qidiruv = controlled input + hosilaviy ro'yxat. Filtrlangan ro'yxatni state ga **saqlamang** — har renderda hisoblang: `items.filter(i => i.toLowerCase().includes(query.toLowerCase()))`. Natija bo'lmasa — bo'sh holat xabari ko'rsating.",
        "Живой поиск = управляемый input + производный список. **Не храните** отфильтрованный список в state — вычисляйте при каждом рендере: `items.filter(i => i.toLowerCase().includes(query.toLowerCase()))`. Если ничего не найдено — покажите сообщение пустого состояния.",
        "Live search = a controlled input + a derived list. **Don't store** the filtered list in state — compute it every render: `items.filter(i => i.toLowerCase().includes(query.toLowerCase()))`. If nothing matches, show an empty-state message.",
      ],
      {
        ex: `const { useState } = React;
const cities = ["Toshkent", "Samarqand", "Buxoro", "Xiva", "Namangan", "Andijon"];
function App() {
  const [q, setQ] = useState("");
  const list = cities.filter((c) => c.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Shahar qidiring..." />
      {list.length ? <ul>{list.map((c) => <li key={c}>{c}</li>)}</ul> : <p>Hech narsa topilmadi</p>}
    </div>
  );
}`,
        ch: rc({
          i: ['`<input className="q">` ga yozilgan matn bo\'yicha `langs` ni (katta-kichik harfga qaramay) filtrlang va `<li className="item">` larda chiqaring. Natija bo\'lmasa `<p className="empty">Topilmadi</p>`.', 'Фильтруйте `langs` по тексту из `<input className="q">` (без учёта регистра) и выводите в `<li className="item">`. Если пусто — `<p className="empty">Topilmadi</p>`.', 'Filter `langs` by the text in `<input className="q">` (case-insensitive) and render them as `<li className="item">`. If none match, show `<p className="empty">Topilmadi</p>`.'],
          s: { js: 'const { useState } = React;\nconst langs = ["JavaScript", "TypeScript", "Python", "Java", "Go"];\n\nfunction App() {\n  return (\n    <div>\n      <input className="q" />\n      <ul></ul>\n    </div>\n  );\n}\n' },
          sol: { js: 'const { useState } = React;\nconst langs = ["JavaScript", "TypeScript", "Python", "Java", "Go"];\n\nfunction App() {\n  const [q, setQ] = useState("");\n  const list = langs.filter((l) => l.toLowerCase().includes(q.toLowerCase()));\n  return (\n    <div>\n      <input className="q" value={q} onChange={(e) => setQ(e.target.value)} />\n      {list.length ? (\n        <ul>{list.map((l) => <li className="item" key={l}>{l}</li>)}</ul>\n      ) : (\n        <p className="empty">Topilmadi</p>\n      )}\n    </div>\n  );\n}\n' },
          tests: [
            [['boshida 5 ta', 'сначала 5', '5 at first'], "$$('.item').length === 5"],
            [['"script" → 2 ta', '"script" → 2', '"script" → 2'], act(type('.q', 'SCRIPT'), "$$('.item').map(l => l.textContent).join() === 'JavaScript,TypeScript'")],
            [['"rust" → Topilmadi', '"rust" → Topilmadi', '"rust" → Topilmadi'], act(type('.q', 'rust'), "text('.empty') === 'Topilmadi' && $$('.item').length === 0")],
          ],
          rules: [['toLowerCase|toUpperCase', 'case-insensitive', { t: 'js' }], ['\\.filter\\(', 'filter', { t: 'js' }]],
        }),
        q: [
          tf(['Filtrlangan ro\'yxatni alohida state da saqlash kerak.', 'Отфильтрованный список нужно хранить в отдельном state.', 'The filtered list should be kept in separate state.'], false, ['U hosilaviy qiymat — renderda hisoblanadi.', 'Это производное значение — считается в рендере.', "It's derived — compute it during render."]),
          out(['Natija?', 'Результат?', 'Result?'], '["Olma", "olcha", "Nok"].filter(f => f.toLowerCase().includes("ol")).length', ['2'], ['Olma va olcha.', 'Olma и olcha.', 'Olma and olcha.']),
        ],
      }
    ),
    lesson(
      'todo-react',
      ['React da Todo', 'Todo на React', 'Todo in React'],
      [
        "JavaScript qirolligida DOM bilan qilgan todo ilovani endi React da qayta quramiz. Farqni seziysizmi? `createElement` va qo'lda yangilash yo'q — faqat **state** va uni JSX ga aylantirish. Qo'shish, belgilash va o'chirish — hammasi immutable yangilanishlar.",
        "Todo-приложение, сделанное на DOM в Королевстве JavaScript, теперь пересобираем на React. Чувствуете разницу? Нет `createElement` и ручных обновлений — только **state** и его отображение в JSX. Добавление, отметка и удаление — иммутабельные обновления.",
        "The todo app you built with the DOM in the JavaScript Kingdom now gets rebuilt in React. Feel the difference? No `createElement`, no manual updates — just **state** and turning it into JSX. Adding, toggling and deleting are all immutable updates.",
      ],
      {
        ex: `const { useState } = React;
function App() {
  const [todos, setTodos] = useState([{ id: 1, text: "React o'rganish", done: false }]);
  const toggle = (id) => setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  return (
    <ul>
      {todos.map((t) => (
        <li key={t.id} onClick={() => toggle(t.id)} style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.text}</li>
      ))}
    </ul>
  );
}`,
        ch: rc({
          i: ['Forma (`<form className="f">` + `<input className="in">`) orqali vazifa qo\'shing; har bir `<li className="todo">` bosilganda `done` classi almashsin; `<p className="left">` da bajarilmaganlar soni.', 'Добавляйте задачи через форму (`<form className="f">` + `<input className="in">`); клик по `<li className="todo">` переключает класс `done`; в `<p className="left">` — число невыполненных.', 'Add tasks via a form (`<form className="f">` + `<input className="in">`); clicking an `<li className="todo">` toggles the `done` class; `<p className="left">` shows how many are unfinished.'],
          s: { js: 'const { useState } = React;\n\nfunction App() {\n  return (\n    <div>\n      <form className="f">\n        <input className="in" />\n        <button>+</button>\n      </form>\n      <ul></ul>\n      <p className="left">0</p>\n    </div>\n  );\n}\n' },
          sol: { js: 'const { useState } = React;\nlet uid = 1;\n\nfunction App() {\n  const [text, setText] = useState("");\n  const [todos, setTodos] = useState([]);\n  function add(e) {\n    e.preventDefault();\n    if (!text.trim()) return;\n    setTodos([...todos, { id: uid++, text: text.trim(), done: false }]);\n    setText("");\n  }\n  const toggle = (id) => setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));\n  return (\n    <div>\n      <form className="f" onSubmit={add}>\n        <input className="in" value={text} onChange={(e) => setText(e.target.value)} />\n        <button>+</button>\n      </form>\n      <ul>\n        {todos.map((t) => (\n          <li key={t.id} className={t.done ? "todo done" : "todo"} onClick={() => toggle(t.id)}>{t.text}</li>\n        ))}\n      </ul>\n      <p className="left">{todos.filter((t) => !t.done).length}</p>\n    </div>\n  );\n}\n' },
          tests: [
            [['2 ta qo\'shish', 'добавить 2', 'add 2'], act(`${type('.in', 'Kitob')} await tick(); $('.f').requestSubmit(); await tick(); ${type('.in', 'Sport')} await tick(); $('.f').requestSubmit();`, "$$('.todo').length === 2 && text('.left') === '2' && $('.in').value === ''")],
            [['birinchisini belgilash', 'отметить первую', 'toggle the first'], act("$$('.todo')[0].click();", "$$('.todo')[0].classList.contains('done') && text('.left') === '1'")],
          ],
          rules: [['onSubmit', 'onSubmit', { t: 'js' }], ['preventDefault', 'preventDefault', { t: 'js' }]],
        }),
        q: [
          fill(['Todo ni almashtirish:', 'Переключить todo:', 'Toggle a todo:'], 'todos.map(t => t.id === id ? { ...t, done: ___t.done } : t)', ['!'], ['Inkor operatori.', 'Оператор отрицания.', 'The negation operator.']),
          mcq(['React va qo\'lda DOM farqi:', 'Разница React и ручного DOM:', 'React vs manual DOM:'], [['React da UI state dan avtomatik chiziladi', 'В React UI рисуется из state автоматически', 'In React the UI is rendered from state automatically'], ['React sekinroq', 'React медленнее', 'React is slower'], ['Farq yo\'q', 'Разницы нет', 'No difference']], 0, ['Deklarativ yondashuv.', 'Декларативный подход.', 'A declarative approach.']),
        ],
      }
    ),
    lesson(
      'star-rating',
      ['Yulduzcha reyting', 'Рейтинг звёздами', 'Star rating'],
      [
        "Qayta ishlatiladigan `Rating` komponenti: `value` va `onChange` props oladi (controlled komponent). 5 ta tugma chiziladi; `i < value` bo'lsa to'liq ⭐, aks holda ☆. Har bir tugmaga `aria-label=\"3 yulduz\"` bering — klaviatura va ekran o'quvchi uchun.",
        "Переиспользуемый компонент `Rating`: принимает props `value` и `onChange` (управляемый компонент). Рисуются 5 кнопок; при `i < value` — ⭐, иначе ☆. Каждой кнопке — `aria-label=\"3 звезды\"` для клавиатуры и скринридеров.",
        "A reusable `Rating` component takes `value` and `onChange` props (a controlled component). Render 5 buttons; ⭐ when `i < value`, otherwise ☆. Give each button an `aria-label=\"3 stars\"` for keyboard and screen-reader users.",
      ],
      {
        ex: `const { useState } = React;
function Rating({ value, onChange }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} aria-label={n + " yulduz"} onClick={() => onChange(n)} style={{ fontSize: 24, background: "none", border: 0 }}>
          {n <= value ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  );
}
function App() {
  const [r, setR] = useState(3);
  return (<><Rating value={r} onChange={setR} /><p>Baho: {r}/5</p></>);
}`,
        ch: rc({
          i: ['`Rating` komponenti 5 ta `<button className="star">` chizsin: `n <= value` bo\'lsa matni `"★"`, aks holda `"☆"`. `App` dagi state `<p className="score">` da ko\'rinsin (boshida 0).', 'Компонент `Rating` рисует 5 кнопок `<button className="star">`: текст `"★"` при `n <= value`, иначе `"☆"`. State в `App` показывается в `<p className="score">` (сначала 0).', 'The `Rating` component renders 5 `<button className="star">`s: `"★"` when `n <= value`, otherwise `"☆"`. `App`’s state shows in `<p className="score">` (starting at 0).'],
          s: { js: 'const { useState } = React;\n\nfunction Rating({ value, onChange }) {\n  return <div></div>;\n}\n\nfunction App() {\n  const [score, setScore] = useState(0);\n  return (\n    <div>\n      <Rating value={score} onChange={setScore} />\n      <p className="score">{score}</p>\n    </div>\n  );\n}\n' },
          sol: { js: 'const { useState } = React;\n\nfunction Rating({ value, onChange }) {\n  return (\n    <div>\n      {[1, 2, 3, 4, 5].map((n) => (\n        <button key={n} className="star" aria-label={n + " yulduz"} onClick={() => onChange(n)}>\n          {n <= value ? "★" : "☆"}\n        </button>\n      ))}\n    </div>\n  );\n}\n\nfunction App() {\n  const [score, setScore] = useState(0);\n  return (\n    <div>\n      <Rating value={score} onChange={setScore} />\n      <p className="score">{score}</p>\n    </div>\n  );\n}\n' },
          tests: [
            [['5 ta bo\'sh yulduz', '5 пустых звёзд', '5 empty stars'], "$$('.star').map(b => b.textContent).join('') === '☆☆☆☆☆'"],
            [['4-yulduz → ★★★★☆ va 4', '4-я звезда → ★★★★☆ и 4', '4th star → ★★★★☆ and 4'], act("$$('.star')[3].click();", "$$('.star').map(b => b.textContent).join('') === '★★★★☆' && text('.score') === '4'")],
          ],
          rules: [['onChange\\(', 'onChange', { t: 'js' }]],
        }),
        q: [
          tf(['Controlled komponent o\'z qiymatini props orqali oladi.', 'Управляемый компонент получает значение через props.', 'A controlled component receives its value via props.'], true, ['value + onChange.', 'value + onChange.', 'value + onChange.']),
          out(['value=2 bo\'lsa nechta ★?', 'Сколько ★ при value=2?', 'How many ★ when value=2?'], '[1, 2, 3, 4, 5].map(n => n <= 2 ? "★" : "☆").join("")', ['★★☆☆☆'], ['1 va 2 to\'liq.', '1 и 2 полные.', '1 and 2 are filled.']),
        ],
      }
    ),
    lesson(
      'theme-toggle',
      ['Mavzu almashtirish', 'Переключение темы', 'Theme toggle'],
      [
        "Dark/light mavzu = **Context** + state + CSS o'zgaruvchilari. `ThemeProvider` state ni saqlaydi va `{ theme, toggle }` ni context orqali beradi; istalgan komponent `useTheme()` custom hook bilan uni o'qiydi. CODEVERSE ning o'zi ham aynan shunday qurilgan!",
        "Тёмная/светлая тема = **Context** + state + CSS-переменные. `ThemeProvider` хранит state и передаёт `{ theme, toggle }` через контекст; любой компонент читает его кастомным хуком `useTheme()`. Сам CODEVERSE построен именно так!",
        "Dark/light themes = **Context** + state + CSS variables. A `ThemeProvider` holds the state and shares `{ theme, toggle }` via context; any component reads it with a `useTheme()` custom hook. CODEVERSE itself is built exactly like this!",
      ],
      {
        ex: `const { createContext, useContext, useState } = React;
const ThemeCtx = createContext(null);
const useTheme = () => useContext(ThemeCtx);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}
function Card() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <div style={{ background: dark ? "#151d32" : "#fff", color: dark ? "#f8fafc" : "#0b1020", padding: 16 }}>
      <p>Mavzu: {theme}</p><button onClick={toggle}>Almashtirish</button>
    </div>
  );
}
function App() { return <ThemeProvider><Card /></ThemeProvider>; }`,
        ch: rc({
          i: ['`ThemeProvider` (context) yarating: `theme` (`"light"` dan boshlanadi) va `toggle`. Ichki `Panel` `useContext` orqali `<div className="panel">` ga `data-theme={theme}` bersin va `<button className="switch">` bilan almashtirsin.', 'Создайте `ThemeProvider` (context): `theme` (начинается с `"light"`) и `toggle`. Вложенный `Panel` через `useContext` задаёт `<div className="panel">` атрибут `data-theme={theme}` и переключает тему кнопкой `<button className="switch">`.', 'Create a `ThemeProvider` (context) with `theme` (starting at `"light"`) and `toggle`. The nested `Panel` uses `useContext` to set `data-theme={theme}` on `<div className="panel">` and toggles it with `<button className="switch">`.'],
          s: { js: 'const { createContext, useContext, useState } = React;\n\nfunction Panel() {\n  return (\n    <div className="panel">\n      <button className="switch">Mavzu</button>\n    </div>\n  );\n}\n\nfunction App() {\n  return <Panel />;\n}\n' },
          sol: { js: 'const { createContext, useContext, useState } = React;\nconst ThemeCtx = createContext(null);\n\nfunction ThemeProvider({ children }) {\n  const [theme, setTheme] = useState("light");\n  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));\n  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;\n}\n\nfunction Panel() {\n  const { theme, toggle } = useContext(ThemeCtx);\n  return (\n    <div className="panel" data-theme={theme}>\n      <button className="switch" onClick={toggle}>Mavzu</button>\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <ThemeProvider>\n      <Panel />\n    </ThemeProvider>\n  );\n}\n' },
          tests: [
            [['boshida light', 'сначала light', 'light at first'], "$('.panel').dataset.theme === 'light'"],
            [['almashtirish → dark', 'переключение → dark', 'toggle → dark'], act("$('.switch').click();", "$('.panel').dataset.theme === 'dark'")],
            [['yana → light', 'снова → light', 'again → light'], act("$('.switch').click();", "$('.panel').dataset.theme === 'light'")],
          ],
          rules: [['createContext', 'createContext', { t: 'js' }], ['useContext', 'useContext', { t: 'js' }]],
        }),
        q: [
          mcq(['Mavzu holatini butun ilovaga yetkazishning eng yaxshi usuli:', 'Лучший способ передать тему всему приложению:', 'Best way to share the theme with the whole app:'], ['Context', 'Props drilling', 'Global var', 'URL'], 0, ['Context.', 'Context.', 'Context.']),
          match(['Qism va vazifa', 'Часть и роль', 'Piece and role'], [['ThemeProvider', 'holds state'], ['useTheme', 'reads context'], ['data-theme', 'CSS hook']], ['Provider saqlaydi, hook o\'qiydi, atribut CSS ga ulanadi.', 'Provider хранит, хук читает, атрибут для CSS.', 'Provider stores, hook reads, attribute feeds CSS.'], { d: 'medium' }),
        ],
      }
    ),
  ],
  [
    mcq(['Hosilaviy ro\'yxat (filter natijasi) qayerda hisoblanadi?', 'Где вычисляется производный список (результат filter)?', 'Where is a derived (filtered) list computed?'], [['Render ichida', 'Внутри рендера', 'During render'], ['useEffect da state ga yozib', 'В useEffect с записью в state', 'In useEffect, written to state'], ['Serverda', 'На сервере', 'On the server']], 0, ['Renderda — oddiy va to\'g\'ri.', 'В рендере — просто и правильно.', 'During render — simple and correct.']),
    tf(['Tab komponentida faqat faol panel chiziladi.', 'В компоненте вкладок рисуется только активная панель.', 'A tabs component renders only the active panel.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
    fill(['Formani yuborish hodisasi:', 'Событие отправки формы:', 'Form submit event:'], '<form ___={handleSubmit}>', ['onSubmit'], ['`onSubmit`.', '`onSubmit`.', '`onSubmit`.']),
    bug(['Nega yangi todo qo\'shilmaydi?', 'Почему новая задача не добавляется?', "Why isn't the new todo added?"], 'function add() {\n  todos.push({ id: 2, text });\n  setTodos(todos);\n}', [['State to\'g\'ridan-to\'g\'ri o\'zgartirilgan', 'State изменён напрямую', 'State is mutated directly'], ['id takrorlangan', 'id повторяется', 'Duplicate id'], ['text yo\'q', 'Нет text', 'No text']], 0, ['`setTodos([...todos, newTodo])`.', '`setTodos([...todos, newTodo])`.', '`setTodos([...todos, newTodo])`.']),
    match(['Komponent va asosiy hook', 'Компонент и основной хук', 'Component and main hook'], [['Live search', 'useState'], ['Theme toggle', 'useContext'], ['Data loader', 'useEffect']], ['Qidiruv — state, mavzu — context, yuklash — effect.', 'Поиск — state, тема — context, загрузка — effect.', 'Search → state, theme → context, loading → effect.']),
  ]
);
