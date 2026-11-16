import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

const rc = (o) => ch({ mode: 'react', ...o });
const act = (steps, check) => `(async () => { ${steps} await tick(); return ${check}; })()`;

export default mod(
  'react-patterns',
  ['Professional naqshlar', 'Профессиональные паттерны', 'Professional patterns'],
  ['Kompozitsiya, custom hook, useMemo, useReducer va Context.', 'Композиция, кастомные хуки, useMemo, useReducer и Context.', 'Composition, custom hooks, useMemo, useReducer and Context.'],
  [
    lesson(
      'composition',
      ['Kompozitsiya va children', 'Композиция и children', 'Composition and children'],
      [
        "Katta UI kichik komponentlardan **yig'iladi**. `children` yordamida \"o'ram\" (wrapper) komponentlar yaratiladi:\n```\nfunction Card({ title, children }) {\n  return <section className=\"card\"><h3>{title}</h3>{children}</section>;\n}\n<Card title=\"Profil\"><p>Matn</p></Card>\n```\nShunday qilib `Card`, `Modal`, `Layout` kabi qayta ishlatiladigan bloklar quriladi — meros (inheritance) o'rniga kompozitsiya!",
        "Большой UI **собирается** из маленьких компонентов. С помощью `children` создаются компоненты-«обёртки»:\n```\nfunction Card({ title, children }) {\n  return <section className=\"card\"><h3>{title}</h3>{children}</section>;\n}\n<Card title=\"Профиль\"><p>Текст</p></Card>\n```\nТак строятся переиспользуемые блоки `Card`, `Modal`, `Layout` — композиция вместо наследования!",
        "Big UIs are **assembled** from small components. `children` lets you build wrapper components:\n```\nfunction Card({ title, children }) {\n  return <section className=\"card\"><h3>{title}</h3>{children}</section>;\n}\n<Card title=\"Profile\"><p>Text</p></Card>\n```\nThat's how reusable `Card`, `Modal` and `Layout` blocks are built — composition over inheritance!",
      ],
      {
        ex: `function Panel({ title, children }) {
  return (
    <section style={{ border: "2px solid #7c5cfc", borderRadius: 12, padding: 12, marginBottom: 8 }}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}
function App() {
  return (
    <>
      <Panel title="Yangiliklar"><p>React 19 chiqdi!</p></Panel>
      <Panel title="Statistika"><ul><li>XP: 1200</li></ul></Panel>
    </>
  );
}`,
        ch: rc({
          i: ['`Box` komponenti `<div className="box">` ichida `children` ni chizsin. `App` da `<Box><p className="inside">Ichkarida</p></Box>` ishlating.', 'Компонент `Box` рендерит `children` внутри `<div className="box">`. В `App` используйте `<Box><p className="inside">Ichkarida</p></Box>`.', 'The `Box` component renders `children` inside `<div className="box">`. In `App`, use `<Box><p className="inside">Ichkarida</p></Box>`.'],
          s: { js: 'function Box() {\n  return <div className="box"></div>;\n}\n\nfunction App() {\n  return (\n    <Box>\n      <p className="inside">Ichkarida</p>\n    </Box>\n  );\n}\n' },
          sol: { js: 'function Box({ children }) {\n  return <div className="box">{children}</div>;\n}\n\nfunction App() {\n  return (\n    <Box>\n      <p className="inside">Ichkarida</p>\n    </Box>\n  );\n}\n' },
          tests: [[['.box ichida .inside', '.inside внутри .box', '.inside inside .box'], "text('.box .inside') === 'Ichkarida'"]],
          rules: [['children', 'children', { t: 'js' }]],
        }),
        q: [
          tf(['`children` — teglar orasidagi kontent.', '`children` — содержимое между тегами.', '`children` is the content between the tags.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
          mcq(['React qaysi yondashuvni tavsiya qiladi?', 'Какой подход рекомендует React?', 'Which approach does React recommend?'], [['Kompozitsiya', 'Композиция', 'Composition'], ['Meros (inheritance)', 'Наследование', 'Inheritance'], ['Global o\'zgaruvchilar', 'Глобальные переменные', 'Global variables']], 0, ['Kompozitsiya.', 'Композиция.', 'Composition.']),
        ],
      }
    ),
    lesson(
      'custom-hooks',
      ['Custom hook', 'Кастомные хуки', 'Custom hooks'],
      [
        "Takrorlanadigan holat mantiqini **o'z hook** ingizga chiqaring. Hook nomi `use` bilan boshlanadi va ichida boshqa hooklarni ishlatishi mumkin:\n```\nfunction useToggle(initial = false) {\n  const [on, setOn] = useState(initial);\n  const toggle = () => setOn((v) => !v);\n  return [on, toggle];\n}\n```\n**Hooklar qoidalari:** faqat komponent yoki boshqa hook ning yuqori darajasida chaqiriladi — `if`, sikl yoki oddiy funksiya ichida emas.",
        "Вынесите повторяющуюся логику состояния в **свой хук**. Имя хука начинается с `use`, внутри можно вызывать другие хуки:\n```\nfunction useToggle(initial = false) {\n  const [on, setOn] = useState(initial);\n  const toggle = () => setOn((v) => !v);\n  return [on, toggle];\n}\n```\n**Правила хуков:** вызываются только на верхнем уровне компонента или другого хука — не внутри `if`, циклов или обычных функций.",
        "Extract repeated stateful logic into **your own hook**. A hook's name starts with `use`, and it can call other hooks:\n```\nfunction useToggle(initial = false) {\n  const [on, setOn] = useState(initial);\n  const toggle = () => setOn((v) => !v);\n  return [on, toggle];\n}\n```\n**Rules of hooks:** call them only at the top level of a component or another hook — never inside `if`, loops or plain functions.",
      ],
      {
        ex: `const { useState } = React;

function useCounter(start = 0, step = 1) {
  const [value, setValue] = useState(start);
  return { value, inc: () => setValue((v) => v + step), reset: () => setValue(start) };
}

function App() {
  const xp = useCounter(0, 10);
  return (<div><p>XP: {xp.value}</p><button onClick={xp.inc}>+10</button><button onClick={xp.reset}>0</button></div>);
}`,
        ch: rc({
          i: ['`useToggle(initial)` hook yozing: `[on, toggle]` qaytarsin. `App` da `<button className="t">` matni `on` bo\'lsa `"ON"`, aks holda `"OFF"`.', 'Напишите хук `useToggle(initial)`, возвращающий `[on, toggle]`. В `App` текст `<button className="t">` — `"ON"` при `on`, иначе `"OFF"`.', 'Write a `useToggle(initial)` hook returning `[on, toggle]`. In `App`, `<button className="t">` shows `"ON"` when `on`, otherwise `"OFF"`.'],
          s: { js: 'const { useState } = React;\n\nfunction useToggle(initial) {\n\n}\n\nfunction App() {\n  return <button className="t">OFF</button>;\n}\n' },
          sol: { js: 'const { useState } = React;\n\nfunction useToggle(initial = false) {\n  const [on, setOn] = useState(initial);\n  const toggle = () => setOn((v) => !v);\n  return [on, toggle];\n}\n\nfunction App() {\n  const [on, toggle] = useToggle(false);\n  return <button className="t" onClick={toggle}>{on ? "ON" : "OFF"}</button>;\n}\n' },
          tests: [
            [['boshida OFF', 'сначала OFF', 'OFF at first'], "text('.t') === 'OFF'"],
            [['bosilsa ON', 'после клика ON', 'ON after a click'], act("$('.t').click();", "text('.t') === 'ON'")],
          ],
          rules: [['function\\s+useToggle', 'useToggle', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          mcq(['Custom hook nomi qanday boshlanadi?', 'С чего начинается имя кастомного хука?', 'How does a custom hook name start?'], ['hook', 'use', 'with', 'get'], 1, ['`use...`.', '`use...`.', '`use...`.']),
          bug(['Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule is broken?'], 'function App({ show }) {\n  if (show) {\n    const [x, setX] = useState(0);\n  }\n}', [['Hook shart ichida chaqirilgan', 'Хук вызван внутри условия', 'A hook is called inside a condition'], ['useState noto\'g\'ri import', 'Неверный импорт useState', 'Wrong useState import'], ['Xato yo\'q', 'Ошибки нет', 'No bug']], 0, ['Hooklar har doim bir xil tartibda chaqirilishi kerak.', 'Хуки должны вызываться всегда в одном порядке.', 'Hooks must always be called in the same order.']),
        ],
      }
    ),
    lesson(
      'use-memo',
      ['useMemo va hosilaviy qiymatlar', 'useMemo и производные значения', 'useMemo and derived values'],
      [
        "Boshqa state/props dan **hisoblanadigan** qiymatni alohida state ga saqlamang — renderda hisoblang:\n```\nconst visible = items.filter((i) => i.title.includes(query));\n```\nHisoblash juda og'ir bo'lsa `useMemo` natijani eslab qoladi va bog'liqliklar o'zgargandagina qayta hisoblaydi:\n```\nconst total = useMemo(() => expensiveSum(items), [items]);\n```\nFunksiyalar uchun xuddi shunday `useCallback` bor.",
        "Не храните в отдельном state значение, которое **вычисляется** из других state/props, — считайте его в рендере:\n```\nconst visible = items.filter((i) => i.title.includes(query));\n```\nЕсли вычисление тяжёлое, `useMemo` запоминает результат и пересчитывает только при смене зависимостей:\n```\nconst total = useMemo(() => expensiveSum(items), [items]);\n```\nДля функций есть аналогичный `useCallback`.",
        "Don't store a value **derived** from other state/props in its own state — compute it during render:\n```\nconst visible = items.filter((i) => i.title.includes(query));\n```\nIf the computation is expensive, `useMemo` remembers the result and recomputes only when dependencies change:\n```\nconst total = useMemo(() => expensiveSum(items), [items]);\n```\nFor functions there's the similar `useCallback`.",
      ],
      {
        ex: `const { useState, useMemo } = React;
const nums = Array.from({ length: 5000 }, (_, i) => i);

function App() {
  const [min, setMin] = useState(4990);
  const [dark, setDark] = useState(false);
  const filtered = useMemo(() => nums.filter((n) => n >= min), [min]);
  return (
    <div style={{ background: dark ? "#0b1020" : "white", color: dark ? "white" : "black" }}>
      <button onClick={() => setDark(!dark)}>Mavzu</button>
      <input type="number" value={min} onChange={(e) => setMin(+e.target.value)} />
      <p>{filtered.length} ta son</p>
    </div>
  );
}`,
        ch: rc({
          i: ['Savat: `items` massividan `useMemo` bilan umumiy summani hisoblang va `<p className="total">Jami: SUMMA</p>` da chiqaring.', 'Корзина: посчитайте общую сумму из `items` через `useMemo` и выведите в `<p className="total">Jami: СУММА</p>`.', 'Cart: compute the total from `items` with `useMemo` and show it in `<p className="total">Jami: SUM</p>`.'],
          s: { js: 'const { useState, useMemo } = React;\nconst items = [\n  { name: "Kitob", price: 45000 },\n  { name: "Daftar", price: 8000 },\n  { name: "Ruchka", price: 3000 },\n];\n\nfunction App() {\n  return <p className="total">Jami: 0</p>;\n}\n' },
          sol: { js: 'const { useState, useMemo } = React;\nconst items = [\n  { name: "Kitob", price: 45000 },\n  { name: "Daftar", price: 8000 },\n  { name: "Ruchka", price: 3000 },\n];\n\nfunction App() {\n  const total = useMemo(() => items.reduce((s, i) => s + i.price, 0), []);\n  return <p className="total">Jami: {total}</p>;\n}\n' },
          tests: [[['Jami: 56000', 'Jami: 56000', 'Jami: 56000'], "text('.total') === 'Jami: 56000'"]],
          rules: [['useMemo', 'useMemo', { t: 'js' }]],
        }),
        q: [
          tf(['Hosilaviy qiymatni alohida state da saqlash tavsiya etiladi.', 'Производное значение рекомендуется хранить в отдельном state.', 'Storing a derived value in separate state is recommended.'], false, ['Render da hisoblang.', 'Вычисляйте в рендере.', 'Compute it during render.']),
          mcq(['Funksiyani eslab qoladigan hook:', 'Хук, запоминающий функцию:', 'The hook that memoizes a function:'], ['useMemo', 'useCallback', 'useRef', 'useFunction'], 1, ['`useCallback`.', '`useCallback`.', '`useCallback`.']),
        ],
      }
    ),
    lesson(
      'use-reducer',
      ['useReducer', 'useReducer', 'useReducer'],
      [
        "State murakkablashganda (ko'p maydon, ko'p amal) `useReducer` qulay. Barcha o'zgarishlar bitta **reducer** funksiyasida:\n```\nfunction reducer(state, action) {\n  switch (action.type) {\n    case \"add\": return { ...state, count: state.count + 1 };\n    case \"reset\": return { count: 0 };\n    default: return state;\n  }\n}\nconst [state, dispatch] = useReducer(reducer, { count: 0 });\ndispatch({ type: \"add\" });\n```\nReducer **sof funksiya**: yangi state qaytaradi, eskisini o'zgartirmaydi.",
        "Когда state усложняется (много полей и действий), удобен `useReducer`. Все изменения — в одной функции-**редьюсере**:\n```\nfunction reducer(state, action) {\n  switch (action.type) {\n    case \"add\": return { ...state, count: state.count + 1 };\n    case \"reset\": return { count: 0 };\n    default: return state;\n  }\n}\nconst [state, dispatch] = useReducer(reducer, { count: 0 });\ndispatch({ type: \"add\" });\n```\nРедьюсер — **чистая функция**: возвращает новый state, не меняя старый.",
        "When state gets complex (many fields, many actions), `useReducer` helps. All changes live in one **reducer** function:\n```\nfunction reducer(state, action) {\n  switch (action.type) {\n    case \"add\": return { ...state, count: state.count + 1 };\n    case \"reset\": return { count: 0 };\n    default: return state;\n  }\n}\nconst [state, dispatch] = useReducer(reducer, { count: 0 });\ndispatch({ type: \"add\" });\n```\nA reducer is a **pure function**: it returns new state without mutating the old one.",
      ],
      {
        ex: `const { useReducer } = React;

function reducer(state, action) {
  switch (action.type) {
    case "correct": return { ...state, score: state.score + 10, streak: state.streak + 1 };
    case "wrong": return { ...state, streak: 0 };
    default: return state;
  }
}
function App() {
  const [s, dispatch] = useReducer(reducer, { score: 0, streak: 0 });
  return (<div><p>Ball: {s.score} · Combo: {s.streak}</p>
    <button onClick={() => dispatch({ type: "correct" })}>✅</button>
    <button onClick={() => dispatch({ type: "wrong" })}>❌</button></div>);
}`,
        ch: rc({
          i: ['`reducer` yozing: `"inc"` → count+1, `"dec"` → count-1, `"reset"` → 0. `App` dagi `.inc`, `.dec`, `.reset` tugmalari `dispatch` qilsin, son `<span className="v">` da.', 'Напишите `reducer`: `"inc"` → count+1, `"dec"` → count-1, `"reset"` → 0. Кнопки `.inc`, `.dec`, `.reset` в `App` вызывают `dispatch`, число — в `<span className="v">`.', 'Write a `reducer`: `"inc"` → count+1, `"dec"` → count-1, `"reset"` → 0. The `.inc`, `.dec`, `.reset` buttons in `App` call `dispatch`; the number is in `<span className="v">`.'],
          s: { js: 'const { useReducer } = React;\n\nfunction reducer(state, action) {\n  return state;\n}\n\nfunction App() {\n  const [state, dispatch] = useReducer(reducer, { count: 0 });\n  return (\n    <div>\n      <span className="v">{state.count}</span>\n      <button className="inc">+</button>\n      <button className="dec">-</button>\n      <button className="reset">0</button>\n    </div>\n  );\n}\n' },
          sol: { js: 'const { useReducer } = React;\n\nfunction reducer(state, action) {\n  switch (action.type) {\n    case "inc":\n      return { count: state.count + 1 };\n    case "dec":\n      return { count: state.count - 1 };\n    case "reset":\n      return { count: 0 };\n    default:\n      return state;\n  }\n}\n\nfunction App() {\n  const [state, dispatch] = useReducer(reducer, { count: 0 });\n  return (\n    <div>\n      <span className="v">{state.count}</span>\n      <button className="inc" onClick={() => dispatch({ type: "inc" })}>+</button>\n      <button className="dec" onClick={() => dispatch({ type: "dec" })}>-</button>\n      <button className="reset" onClick={() => dispatch({ type: "reset" })}>0</button>\n    </div>\n  );\n}\n' },
          tests: [
            [['reducer sof: inc', 'чистый reducer: inc', 'pure reducer: inc'], "(() => { const s = { count: 1 }; const n = reducer(s, { type: 'inc' }); return n.count === 2 && s.count === 1; })()"],
            [['+ + - → 1', '+ + - → 1', '+ + - → 1'], act("$('.inc').click(); await tick(); $('.inc').click(); await tick(); $('.dec').click();", "text('.v') === '1'")],
            [['reset → 0', 'reset → 0', 'reset → 0'], act("$('.reset').click();", "text('.v') === '0'")],
          ],
          rules: [['useReducer', 'useReducer', { t: 'js' }], ['dispatch\\(', 'dispatch', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          tf(['Reducer eski state ni o\'zgartirishi kerak.', 'Редьюсер должен изменять старый state.', 'A reducer should mutate the old state.'], false, ['Yangi state qaytaradi.', 'Возвращает новый state.', 'It returns new state.']),
          fill(['Amal yuborish:', 'Отправить действие:', 'Send an action:'], '___({ type: "add" });', ['dispatch'], ['`dispatch`.', '`dispatch`.', '`dispatch`.']),
        ],
      }
    ),
    lesson(
      'context',
      ['Context', 'Context', 'Context'],
      [
        "**Context** ma'lumotni props ni har darajadan o'tkazmasdan (\"prop drilling\"siz) chuqur komponentlarga yetkazadi. Mavzu (theme), til, foydalanuvchi uchun ideal:\n```\nconst ThemeContext = React.createContext(\"light\");\n<ThemeContext.Provider value=\"dark\">\n  <Page />\n</ThemeContext.Provider>\n// istalgan ichki komponentda:\nconst theme = useContext(ThemeContext);\n```\nContext qiymati o'zgarsa, uni ishlatgan barcha komponentlar qayta chiziladi.",
        "**Context** доставляет данные в глубокие компоненты без передачи props через каждый уровень (без «prop drilling»). Идеален для темы, языка, пользователя:\n```\nconst ThemeContext = React.createContext(\"light\");\n<ThemeContext.Provider value=\"dark\">\n  <Page />\n</ThemeContext.Provider>\n// в любом вложенном компоненте:\nconst theme = useContext(ThemeContext);\n```\nПри смене значения перерисовываются все компоненты, использующие контекст.",
        "**Context** delivers data to deep components without passing props through every level (no \"prop drilling\"). Perfect for theme, language, the current user:\n```\nconst ThemeContext = React.createContext(\"light\");\n<ThemeContext.Provider value=\"dark\">\n  <Page />\n</ThemeContext.Provider>\n// in any nested component:\nconst theme = useContext(ThemeContext);\n```\nWhen the value changes, every component using it re-renders.",
      ],
      {
        ex: `const { createContext, useContext, useState } = React;
const LangContext = createContext("uz");

function Greeting() {
  const lang = useContext(LangContext);
  return <h2>{{ uz: "Salom!", ru: "Привет!", en: "Hello!" }[lang]}</h2>;
}
function App() {
  const [lang, setLang] = useState("uz");
  return (
    <LangContext.Provider value={lang}>
      {["uz", "ru", "en"].map((l) => <button key={l} onClick={() => setLang(l)}>{l}</button>)}
      <Greeting />
    </LangContext.Provider>
  );
}`,
        ch: rc({
          i: ['`UserContext` yarating. `App` uni `value="Aziza"` bilan Provider qilsin; ichki `Header` komponenti `useContext` orqali `<p className="user">Aziza</p>` chizsin (props ishlatmang).', 'Создайте `UserContext`. `App` оборачивает его в Provider с `value="Aziza"`; вложенный `Header` через `useContext` рендерит `<p className="user">Aziza</p>` (без props).', 'Create a `UserContext`. `App` provides it with `value="Aziza"`; the nested `Header` uses `useContext` to render `<p className="user">Aziza</p>` (no props).'],
          s: { js: 'const { createContext, useContext } = React;\n\nfunction Header() {\n  return <p className="user"></p>;\n}\n\nfunction App() {\n  return <Header />;\n}\n' },
          sol: { js: 'const { createContext, useContext } = React;\nconst UserContext = createContext(null);\n\nfunction Header() {\n  const user = useContext(UserContext);\n  return <p className="user">{user}</p>;\n}\n\nfunction App() {\n  return (\n    <UserContext.Provider value="Aziza">\n      <Header />\n    </UserContext.Provider>\n  );\n}\n' },
          tests: [[['Header Aziza ni ko\'rsatadi', 'Header показывает Aziza', 'Header shows Aziza'], "text('.user') === 'Aziza'"]],
          rules: [['createContext', 'createContext', { t: 'js' }], ['useContext', 'useContext', { t: 'js' }], ['<Header\\s+\\w+=', 'no props', { t: 'js', not: true }]],
          d: 'medium',
        }),
        q: [
          mcq(['Context qaysi muammoni hal qiladi?', 'Какую проблему решает Context?', 'What problem does Context solve?'], ['Prop drilling', 'CSS', 'SEO', 'Routing'], 0, ['Props ni ko\'p darajadan o\'tkazish.', 'Передача props через много уровней.', 'Passing props through many levels.']),
          order(['Context ishlatish tartibi', 'Порядок использования Context', 'Order of using Context'], ['const Ctx = createContext(null);', '<Ctx.Provider value={data}>', 'const data = useContext(Ctx);'], ['Yaratish → taqdim etish → o\'qish.', 'Создать → предоставить → прочитать.', 'Create → provide → consume.']),
        ],
      }
    ),
  ],
  [
    match(['Hook va vazifa', 'Хук и назначение', 'Hook and purpose'], [['useReducer', 'complex state'], ['useContext', 'shared data'], ['useMemo', 'cached value']], ['reducer — murakkab state, context — umumiy, memo — kesh.', 'reducer — сложный state, context — общие данные, memo — кэш.', 'reducer → complex state, context → shared data, memo → cache.']),
    tf(['Hooklarni sikl ichida chaqirish mumkin.', 'Хуки можно вызывать в цикле.', 'Hooks may be called inside loops.'], false, ['Faqat yuqori darajada.', 'Только на верхнем уровне.', 'Top level only.']),
    mcq(['Reducer qaytaradi:', 'Редьюсер возвращает:', 'A reducer returns:'], [['Yangi state', 'Новый state', 'New state'], ['undefined', 'undefined', 'undefined'], ['JSX', 'JSX', 'JSX']], 0, ['Yangi state.', 'Новый state.', 'New state.']),
    fill(['Context yaratish:', 'Создание Context:', 'Creating a Context:'], 'const Theme = React.___("light");', ['createContext'], ['`createContext`.', '`createContext`.', '`createContext`.']),
    bug(['Nega Header da qiymat undefined?', 'Почему в Header значение undefined?', 'Why is the value undefined in Header?'], 'const Ctx = createContext();\nfunction App() {\n  return <><Ctx.Provider value="dark" /><Header /></>;\n}', [['Header Provider ichida emas', 'Header не внутри Provider', 'Header is not inside the Provider'], ['value noto\'g\'ri', 'Неверный value', 'Wrong value'], ['createContext argumentsiz bo\'lmaydi', 'createContext нельзя без аргумента', 'createContext needs an argument']], 0, ['Iste\'molchi Provider ichida bo\'lishi kerak.', 'Потребитель должен быть внутри Provider.', 'Consumers must be inside the Provider.'], { d: 'medium' }),
  ]
);
