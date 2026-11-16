import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

const rc = (o) => ch({ mode: 'react', ...o });
const act = (steps, check) => `(async () => { ${steps} await tick(); return ${check}; })()`;
const type = (sel, val) => `{ const el = $('${sel}'); const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(el, ${JSON.stringify(val)}); el.dispatchEvent(new Event('input', { bubbles: true })); }`;

export default mod(
  'react-state',
  ['State va hodisalar', 'State и события', 'State and events'],
  ['useState, hodisalar, formalar va holatni ko\'tarish.', 'useState, события, формы и подъём состояния.', 'useState, events, forms and lifting state up.'],
  [
    lesson(
      'use-state',
      ['useState', 'useState', 'useState'],
      [
        "**State** — komponentning o'zgaruvchan xotirasi. U o'zgarganda React komponentni **qayta chizadi**:\n```\nconst [count, setCount] = React.useState(0);\n```\n- `count` — joriy qiymat\n- `setCount(yangi)` — yangilash funksiyasi\n- `0` — boshlang'ich qiymat\n\nOddiy `let` o'zgaruvchi qayta chizishni chaqirmaydi! Oldingi qiymatga tayanganda funksiya shaklidan foydalaning: `setCount(c => c + 1)`.",
        "**State** — изменяемая память компонента. При её изменении React **перерисовывает** компонент:\n```\nconst [count, setCount] = React.useState(0);\n```\n- `count` — текущее значение\n- `setCount(новое)` — функция обновления\n- `0` — начальное значение\n\nОбычная переменная `let` не вызывает перерисовку! Если новое значение зависит от старого, используйте функцию: `setCount(c => c + 1)`.",
        "**State** is a component's changeable memory. When it changes, React **re-renders** the component:\n```\nconst [count, setCount] = React.useState(0);\n```\n- `count` — the current value\n- `setCount(newValue)` — the updater\n- `0` — the initial value\n\nA plain `let` variable won't trigger a re-render! When the new value depends on the old one, use the function form: `setCount(c => c + 1)`.",
      ],
      {
        ex: `const { useState } = React;

function App() {
  const [likes, setLikes] = useState(0);
  return (
    <button onClick={() => setLikes((l) => l + 1)}>
      ❤ {likes}
    </button>
  );
}`,
        ch: rc({
          i: ['Hisoblagich: `<span className="count">` da son, `<button className="inc">+</button>` 1 ga oshiradi, `<button className="dec">-</button>` 1 ga kamaytiradi.', 'Счётчик: число в `<span className="count">`, `<button className="inc">+</button>` увеличивает на 1, `<button className="dec">-</button>` уменьшает на 1.', 'Counter: a number in `<span className="count">`, `<button className="inc">+</button>` adds 1, `<button className="dec">-</button>` subtracts 1.'],
          s: { js: 'const { useState } = React;\n\nfunction App() {\n  let count = 0;\n  return (\n    <div>\n      <button className="dec">-</button>\n      <span className="count">{count}</span>\n      <button className="inc" onClick={() => count++}>+</button>\n    </div>\n  );\n}\n' },
          sol: { js: 'const { useState } = React;\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <button className="dec" onClick={() => setCount((c) => c - 1)}>-</button>\n      <span className="count">{count}</span>\n      <button className="inc" onClick={() => setCount((c) => c + 1)}>+</button>\n    </div>\n  );\n}\n' },
          tests: [
            [['+ ikki marta → 2', '+ дважды → 2', '+ twice → 2'], act("$('.inc').click(); await tick(); $('.inc').click();", "text('.count') === '2'")],
            [['- bir marta → 1', '- один раз → 1', '- once → 1'], act("$('.dec').click();", "text('.count') === '1'")],
          ],
          rules: [['useState', 'useState', { t: 'js' }]],
        }),
        q: [
          tf(['Oddiy `let` o\'zgaruvchini o\'zgartirish komponentni qayta chizadi.', 'Изменение обычной `let` перерисовывает компонент.', 'Changing a plain `let` variable re-renders the component.'], false, ['Faqat state o\'zgarishi qayta chizadi.', 'Перерисовку вызывает только изменение state.', 'Only state changes trigger re-renders.']),
          fill(['useState ni to\'ldiring:', 'Дополните useState:', 'Complete useState:'], 'const [name, ___] = useState("");', ['setName'], ['Odatda `set` + nom.', 'Обычно `set` + имя.', 'Conventionally `set` + name.']),
        ],
      }
    ),
    lesson(
      'events',
      ['Hodisalar', 'События', 'Events'],
      [
        "React da hodisalar camelCase bilan: `onClick`, `onChange`, `onSubmit`, `onKeyDown`. Ularga **funksiya** beriladi:\n- To'g'ri: `onClick={handleClick}` yoki `onClick={() => remove(id)}`\n- Noto'g'ri: `onClick={handleClick()}` — render vaqtida darhol chaqiriladi!\n\nHandler `event` obyektini oladi: `e.target.value`, `e.preventDefault()`.",
        "События в React пишутся в camelCase: `onClick`, `onChange`, `onSubmit`, `onKeyDown`. Им передаётся **функция**:\n- Верно: `onClick={handleClick}` или `onClick={() => remove(id)}`\n- Неверно: `onClick={handleClick()}` — вызовется сразу при рендере!\n\nОбработчик получает `event`: `e.target.value`, `e.preventDefault()`.",
        "React events use camelCase: `onClick`, `onChange`, `onSubmit`, `onKeyDown`. Pass them a **function**:\n- Right: `onClick={handleClick}` or `onClick={() => remove(id)}`\n- Wrong: `onClick={handleClick()}` — it runs immediately during render!\n\nHandlers receive an `event`: `e.target.value`, `e.preventDefault()`.",
      ],
      {
        ex: `const { useState } = React;

function App() {
  const [on, setOn] = useState(false);
  function toggle() {
    setOn(!on);
  }
  return (
    <button onClick={toggle} style={{ background: on ? "#22c55e" : "#64748b", color: "white" }}>
      {on ? "Yoqilgan" : "O'chirilgan"}
    </button>
  );
}`,
        ch: rc({
          i: ['`<button className="toggle">` bosilganda `<p className="secret">Maxfiy matn</p>` ko\'rinsin/yashirinsin (boshida yashirin).', 'По клику на `<button className="toggle">` показывать/скрывать `<p className="secret">Maxfiy matn</p>` (сначала скрыт).', 'Clicking `<button className="toggle">` shows/hides `<p className="secret">Maxfiy matn</p>` (hidden at first).'],
          s: { js: 'const { useState } = React;\n\nfunction App() {\n  return (\n    <div>\n      <button className="toggle">Ko\'rsatish</button>\n    </div>\n  );\n}\n' },
          sol: { js: 'const { useState } = React;\n\nfunction App() {\n  const [show, setShow] = useState(false);\n  return (\n    <div>\n      <button className="toggle" onClick={() => setShow(!show)}>Ko\'rsatish</button>\n      {show && <p className="secret">Maxfiy matn</p>}\n    </div>\n  );\n}\n' },
          tests: [
            [['boshida yashirin', 'сначала скрыт', 'hidden at first'], "!exists('.secret')"],
            [['1-bosish → ko\'rinadi', '1-й клик → виден', '1st click → visible'], act("$('.toggle').click();", "text('.secret') === 'Maxfiy matn'")],
            [['2-bosish → yashirin', '2-й клик → скрыт', '2nd click → hidden'], act("$('.toggle').click();", "!exists('.secret')")],
          ],
          rules: [['onClick', 'onClick', { t: 'js' }]],
        }),
        q: [
          bug(['Nega cheksiz render bo\'ladi?', 'Почему бесконечный рендер?', 'Why an infinite render loop?'], '<button onClick={setCount(count + 1)}>+</button>', [['Funksiya render paytida chaqirilgan', 'Функция вызвана во время рендера', 'The function is called during render'], ['onClick kichik harf bilan', 'onClick с маленькой буквы', 'onClick is lowercase'], ['count noto\'g\'ri', 'count неверен', 'count is wrong']], 0, ['`onClick={() => setCount(count + 1)}`.', '`onClick={() => setCount(count + 1)}`.', '`onClick={() => setCount(count + 1)}`.'], { d: 'medium' }),
          mcq(['React da input o\'zgarishi hodisasi:', 'Событие изменения input в React:', 'The input change event in React:'], ['onInput', 'onChange', 'onchange', 'onType'], 1, ['React da `onChange` har bir harfda ishlaydi.', 'В React `onChange` срабатывает на каждый символ.', 'In React, `onChange` fires on every keystroke.']),
        ],
      }
    ),
    lesson(
      'controlled-forms',
      ['Boshqariladigan formalar', 'Управляемые формы', 'Controlled forms'],
      [
        "**Controlled input** — qiymati state da saqlanadigan input:\n```\nconst [name, setName] = useState(\"\");\n<input value={name} onChange={(e) => setName(e.target.value)} />\n```\nEndi state — yagona haqiqat manbai: qiymatni tekshirish, tozalash, boshqa joyda ko'rsatish oson. Forma `onSubmit` da `e.preventDefault()` bilan boshqariladi.",
        "**Управляемый input** — поле, значение которого хранится в state:\n```\nconst [name, setName] = useState(\"\");\n<input value={name} onChange={(e) => setName(e.target.value)} />\n```\nТеперь state — единственный источник истины: легко проверить, очистить или показать значение в другом месте. Форма обрабатывается в `onSubmit` с `e.preventDefault()`.",
        "A **controlled input** keeps its value in state:\n```\nconst [name, setName] = useState(\"\");\n<input value={name} onChange={(e) => setName(e.target.value)} />\n```\nState is now the single source of truth: validating, clearing or showing the value elsewhere is easy. Handle the form in `onSubmit` with `e.preventDefault()`.",
      ],
      {
        ex: `const { useState } = React;

function App() {
  const [text, setText] = useState("");
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Yozing..." />
      <p>Siz yozdingiz: {text}</p>
      <p>{text.length} / 50</p>
    </div>
  );
}`,
        ch: rc({
          i: ['Controlled `<input className="name">` yarating; `<p className="preview">` da `Salom, {name}!` jonli ko\'rinsin.', 'Создайте управляемый `<input className="name">`; в `<p className="preview">` живо показывайте `Salom, {name}!`.', 'Create a controlled `<input className="name">`; show `Salom, {name}!` live in `<p className="preview">`.'],
          s: { js: 'const { useState } = React;\n\nfunction App() {\n  return (\n    <div>\n      <input className="name" />\n      <p className="preview"></p>\n    </div>\n  );\n}\n' },
          sol: { js: 'const { useState } = React;\n\nfunction App() {\n  const [name, setName] = useState("");\n  return (\n    <div>\n      <input className="name" value={name} onChange={(e) => setName(e.target.value)} />\n      <p className="preview">Salom, {name}!</p>\n    </div>\n  );\n}\n' },
          tests: [[['"Zarina" yozilsa → Salom, Zarina!', 'ввод "Zarina" → Salom, Zarina!', 'typing "Zarina" → Salom, Zarina!'], act(type('.name', 'Zarina'), "text('.preview') === 'Salom, Zarina!'")]],
          rules: [['value=\\{', 'value', { t: 'js' }], ['onChange', 'onChange', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          mcq(['Inputning yangi qiymati:', 'Новое значение input:', 'The new input value:'], ['e.value', 'e.target.value', 'this.value', 'input.text'], 1, ['`e.target.value`.', '`e.target.value`.', '`e.target.value`.']),
          tf(['Controlled input da qiymat state da saqlanadi.', 'У управляемого input значение хранится в state.', 'A controlled input stores its value in state.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
        ],
      }
    ),
    lesson(
      'state-arrays',
      ['Massiv state', 'State-массивы', 'Arrays in state'],
      [
        "State ni **hech qachon to'g'ridan-to'g'ri o'zgartirmang** (`items.push(x)` ❌). Doim yangi massiv/obyekt yarating:\n- Qo'shish: `setItems([...items, newItem])`\n- O'chirish: `setItems(items.filter((i) => i.id !== id))`\n- Yangilash: `setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))`\n\nReact o'zgarishni **havola** (reference) o'zgargani orqali sezadi.",
        "**Никогда не меняйте state напрямую** (`items.push(x)` ❌). Всегда создавайте новый массив/объект:\n- Добавить: `setItems([...items, newItem])`\n- Удалить: `setItems(items.filter((i) => i.id !== id))`\n- Обновить: `setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))`\n\nReact замечает изменение по смене **ссылки** (reference).",
        "**Never mutate state directly** (`items.push(x)` ❌). Always create a new array/object:\n- Add: `setItems([...items, newItem])`\n- Remove: `setItems(items.filter((i) => i.id !== id))`\n- Update: `setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))`\n\nReact detects changes when the **reference** changes.",
      ],
      {
        ex: `const { useState } = React;

function App() {
  const [tags, setTags] = useState(["react"]);
  return (
    <div>
      <button onClick={() => setTags([...tags, "tag" + tags.length])}>Qo'shish</button>
      {tags.map((t) => (
        <span key={t} onClick={() => setTags(tags.filter((x) => x !== t))} style={{ margin: 4 }}>#{t} ✕</span>
      ))}
    </div>
  );
}`,
        ch: rc({
          i: ['`<button className="add">` bosilganda ro\'yxatga `"Yangi"` matnli `<li>` qo\'shilsin; har bir `<li>` ichidagi `<button className="del">` uni o\'chirsin.', 'По клику на `<button className="add">` в список добавляется `<li>` с текстом `"Yangi"`; `<button className="del">` внутри каждого `<li>` удаляет его.', 'Clicking `<button className="add">` adds an `<li>` with the text `"Yangi"`; a `<button className="del">` inside each `<li>` removes it.'],
          s: { js: 'const { useState } = React;\n\nfunction App() {\n  const [items, setItems] = useState([]);\n  function add() {\n    items.push("Yangi");\n  }\n  return (\n    <div>\n      <button className="add" onClick={add}>Qo\'shish</button>\n      <ul></ul>\n    </div>\n  );\n}\n' },
          sol: { js: 'const { useState } = React;\nlet nextId = 1;\n\nfunction App() {\n  const [items, setItems] = useState([]);\n  function add() {\n    setItems([...items, { id: nextId++, text: "Yangi" }]);\n  }\n  function remove(id) {\n    setItems(items.filter((i) => i.id !== id));\n  }\n  return (\n    <div>\n      <button className="add" onClick={add}>Qo\'shish</button>\n      <ul>\n        {items.map((i) => (\n          <li key={i.id}>\n            <span>{i.text}</span>\n            <button className="del" onClick={() => remove(i.id)}>✕</button>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n' },
          tests: [
            [['2 marta qo\'shish → 2 li', '2 добавления → 2 li', 'add twice → 2 li'], act("$('.add').click(); await tick(); $('.add').click();", "$$('#root li').length === 2")],
            [['o\'chirish → 1 li', 'удаление → 1 li', 'delete → 1 li'], act("$('.del').click();", "$$('#root li').length === 1")],
          ],
          rules: [['\\.\\.\\.', 'spread', { t: 'js' }], ['\\.filter\\(', 'filter', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          bug(['Nega ekran yangilanmaydi?', 'Почему экран не обновляется?', "Why doesn't the screen update?"], 'items.push(newItem);\nsetItems(items);', [['Bir xil massiv havolasi', 'Та же ссылка на массив', 'Same array reference'], ['push yo\'q', 'Нет push', 'No push'], ['setItems noto\'g\'ri nom', 'Неверное имя setItems', 'Wrong setItems name']], 0, ['`setItems([...items, newItem])`.', '`setItems([...items, newItem])`.', '`setItems([...items, newItem])`.']),
          fill(['id=3 ni o\'chirish:', 'Удалить id=3:', 'Remove id=3:'], 'setItems(items.___((i) => i.id !== 3));', ['filter'], ['`filter`.', '`filter`.', '`filter`.']),
        ],
      }
    ),
    lesson(
      'lifting-state',
      ['Holatni yuqoriga ko\'tarish', 'Подъём состояния', 'Lifting state up'],
      [
        "Ikki komponent bir xil ma'lumotdan foydalanishi kerak bo'lsa, state ularning **umumiy ota-onasiga** ko'chiriladi. Ota-ona qiymatni **props** orqali, o'zgartirish funksiyasini esa **callback prop** orqali beradi:\n```\n<SearchBox value={query} onChange={setQuery} />\n<Results query={query} />\n```\nMa'lumot pastga (props), hodisalar yuqoriga (callback) oqadi — **bir tomonlama oqim**.",
        "Если двум компонентам нужны одни данные, state переносят в их **общего родителя**. Родитель передаёт значение через **props**, а функцию изменения — через **callback-prop**:\n```\n<SearchBox value={query} onChange={setQuery} />\n<Results query={query} />\n```\nДанные текут вниз (props), события — вверх (callback) — **однонаправленный поток**.",
        "When two components need the same data, move the state to their **common parent**. The parent passes the value down via **props** and the setter via a **callback prop**:\n```\n<SearchBox value={query} onChange={setQuery} />\n<Results query={query} />\n```\nData flows down (props), events flow up (callbacks) — **one-way data flow**.",
      ],
      {
        ex: `const { useState } = React;

function Temperature({ value, onChange }) {
  return <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />;
}
function Verdict({ celsius }) {
  return <p>{celsius >= 100 ? "Suv qaynaydi 🔥" : "Hali qaynamaydi"}</p>;
}
function App() {
  const [c, setC] = useState(20);
  return (<><Temperature value={c} onChange={setC} /><Verdict celsius={c} /></>);
}`,
        ch: rc({
          i: ['`Child` komponenti `onAdd` prop oladi va `<button className="child-btn">` bosilganda uni chaqiradi. `App` dagi `count` state `<p className="total">` da ko\'rinsin va har bosishda 1 ga oshsin.', 'Компонент `Child` получает prop `onAdd` и вызывает его по клику на `<button className="child-btn">`. State `count` в `App` показывается в `<p className="total">` и растёт на 1 при каждом клике.', 'The `Child` component takes an `onAdd` prop and calls it when `<button className="child-btn">` is clicked. `App`’s `count` state is shown in `<p className="total">` and grows by 1 per click.'],
          s: { js: 'const { useState } = React;\n\nfunction Child() {\n  return <button className="child-btn">+1</button>;\n}\n\nfunction App() {\n  return (\n    <div>\n      <p className="total">0</p>\n      <Child />\n    </div>\n  );\n}\n' },
          sol: { js: 'const { useState } = React;\n\nfunction Child({ onAdd }) {\n  return <button className="child-btn" onClick={onAdd}>+1</button>;\n}\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p className="total">{count}</p>\n      <Child onAdd={() => setCount((c) => c + 1)} />\n    </div>\n  );\n}\n' },
          tests: [[['3 bosish → 3', '3 клика → 3', '3 clicks → 3'], act("$('.child-btn').click(); await tick(); $('.child-btn').click(); await tick(); $('.child-btn').click();", "text('.total') === '3'")]],
          rules: [['onAdd', 'onAdd', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          mcq(['Bir tomonlama oqimda ma\'lumot qayerga oqadi?', 'Куда текут данные в однонаправленном потоке?', 'Where does data flow in one-way flow?'], [['Ota-onadan farzandga (props)', 'От родителя к ребёнку (props)', 'Parent to child (props)'], ['Farzanddan ota-onaga (props)', 'От ребёнка к родителю (props)', 'Child to parent (props)'], ['Har tomonga', 'Во все стороны', 'Every direction']], 0, ['Props pastga, callbacklar yuqoriga.', 'Props вниз, колбэки вверх.', 'Props down, callbacks up.']),
          tf(['Umumiy state ni ikkala farzandga alohida yozish yaxshi amaliyot.', 'Дублировать общий state в каждом ребёнке — хорошая практика.', 'Duplicating shared state in both children is good practice.'], false, ['Ota-onaga ko\'taring — bitta haqiqat manbai.', 'Поднимите в родителя — один источник истины.', 'Lift it to the parent — a single source of truth.']),
        ],
      }
    ),
  ],
  [
    mcq(['State o\'zgarganda nima bo\'ladi?', 'Что происходит при изменении state?', 'What happens when state changes?'], [['Komponent qayta chiziladi', 'Компонент перерисовывается', 'The component re-renders'], ['Sahifa qayta yuklanadi', 'Страница перезагружается', 'The page reloads'], ['Hech narsa', 'Ничего', 'Nothing']], 0, ['React qayta render qiladi.', 'React перерисовывает.', 'React re-renders.']),
    out(['Bosishdan keyin count?', 'count после клика?', 'count after the click?'], 'const [count, setCount] = useState(0);\n// tugma bosildi:\nsetCount(count + 1);\nsetCount(count + 1);', ['1'], ['Ikkalasi ham eski `count` (0) dan foydalanadi; `c => c + 1` ishlating.', 'Оба используют старый `count` (0); используйте `c => c + 1`.', 'Both use the stale `count` (0); use `c => c + 1`.'], { d: 'hard' }),
    tf(['State massivini `push` bilan o\'zgartirish to\'g\'ri.', 'Менять state-массив через `push` правильно.', 'Mutating a state array with `push` is correct.'], false, ['Yangi massiv yarating.', 'Создайте новый массив.', 'Create a new array.']),
    match(['Amal va usul', 'Действие и способ', 'Action and approach'], [['add', '[...items, x]'], ['remove', 'items.filter(...)'], ['update', 'items.map(...)']], ['Har doim yangi massiv.', 'Всегда новый массив.', 'Always a new array.'], { d: 'medium' }),
    fill(['Formani yuborishda qayta yuklashni to\'xtatish:', 'Отменить перезагрузку при отправке формы:', 'Prevent reload on form submit:'], 'function onSubmit(e) { e.___(); }', ['preventDefault'], ['`preventDefault`.', '`preventDefault`.', '`preventDefault`.']),
    mcq(['Ota-onadagi state ni farzand qanday o\'zgartiradi?', 'Как ребёнок меняет state родителя?', 'How does a child change parent state?'], [['Callback prop orqali', 'Через callback-prop', 'Via a callback prop'], ['Props ni o\'zgartirib', 'Изменяя props', 'By mutating props'], ['Global o\'zgaruvchi bilan', 'Через глобальную переменную', 'With a global variable']], 0, ['`onChange={setValue}` kabi.', 'Например, `onChange={setValue}`.', 'Like `onChange={setValue}`.']),
  ]
);
