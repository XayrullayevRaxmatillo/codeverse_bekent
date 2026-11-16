import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

const rc = (o) => ch({ mode: 'react', ...o });
const click = (sel, check) => `(async () => { $('${sel}').click(); await tick(); return ${check}; })()`;
export { click };

export default mod(
  'react-basics',
  ['React asoslari', 'Основы React', 'React Basics'],
  ['Komponentlar, JSX, props, ro\'yxatlar va shartli render.', 'Компоненты, JSX, props, списки и условный рендер.', 'Components, JSX, props, lists and conditional rendering.'],
  [
    lesson(
      'what-is-react',
      ['React nima?', 'Что такое React?', 'What is React?'],
      [
        "**React** — foydalanuvchi interfeysini **komponentlardan** quradigan JavaScript kutubxonasi. Komponent — UI ni qaytaradigan oddiy funksiya:\n```\nfunction Hello() {\n  return <h1>Salom!</h1>;\n}\n```\nKomponent nomi **katta harf** bilan boshlanadi. React ma'lumot o'zgarganda sahifani o'zi samarali yangilaydi — DOM ni qo'lda boshqarish shart emas.\n\n🧪 CODEVERSE playgroundida `App` komponenti avtomatik `#root` ga chiziladi, `React` esa global. Haqiqiy loyihada: `import { useState } from \"react\"`.",
        "**React** — библиотека JavaScript, которая строит интерфейс из **компонентов**. Компонент — обычная функция, возвращающая UI:\n```\nfunction Hello() {\n  return <h1>Привет!</h1>;\n}\n```\nИмя компонента начинается с **заглавной** буквы. React сам эффективно обновляет страницу при изменении данных — управлять DOM вручную не нужно.\n\n🧪 В песочнице CODEVERSE компонент `App` автоматически рендерится в `#root`, а `React` — глобальный. В реальном проекте: `import { useState } from \"react\"`.",
        "**React** is a JavaScript library that builds user interfaces from **components**. A component is a plain function that returns UI:\n```\nfunction Hello() {\n  return <h1>Hello!</h1>;\n}\n```\nComponent names start with a **capital** letter. React efficiently updates the page when data changes — no manual DOM work.\n\n🧪 In the CODEVERSE playground, the `App` component is rendered into `#root` automatically and `React` is global. In a real project: `import { useState } from \"react\"`.",
      ],
      {
        ex: `function Welcome() {
  return <p>CODEVERSE ga xush kelibsiz!</p>;
}

function App() {
  return (
    <div>
      <h1>Salom, React! ⚛️</h1>
      <Welcome />
      <Welcome />
    </div>
  );
}`,
        ch: rc({
          i: ['`App` komponenti `<h1>Salom, React!</h1>` qaytarsin.', 'Компонент `App` должен вернуть `<h1>Salom, React!</h1>`.', 'The `App` component should return `<h1>Salom, React!</h1>`.'],
          s: { js: 'function App() {\n  return null;\n}\n' },
          sol: { js: 'function App() {\n  return <h1>Salom, React!</h1>;\n}\n' },
          tests: [[['h1: Salom, React!', 'h1: Salom, React!', 'h1: Salom, React!'], "text('#root h1') === 'Salom, React!'"]],
          rules: [['function\\s+App', 'App', { t: 'js' }], ['<h1', 'h1', { t: 'js' }]],
        }),
        q: [
          mcq(['React komponenti nima?', 'Что такое компонент React?', 'What is a React component?'], [['UI qaytaradigan funksiya', 'Функция, возвращающая UI', 'A function that returns UI'], ['CSS fayl', 'CSS-файл', 'A CSS file'], ['Ma\'lumotlar bazasi', 'База данных', 'A database']], 0, ['Komponent — JSX qaytaradigan funksiya.', 'Компонент — функция, возвращающая JSX.', 'A component is a function returning JSX.']),
          tf(['Komponent nomi kichik harf bilan boshlanishi mumkin: `function card()`.', 'Имя компонента может начинаться с маленькой буквы: `function card()`.', 'A component name may start lowercase: `function card()`.'], false, ['Kichik harfli teglar HTML elementi deb tushuniladi.', 'Теги с маленькой буквы считаются HTML-элементами.', 'Lowercase tags are treated as HTML elements.']),
        ],
      }
    ),
    lesson(
      'jsx',
      ['JSX qoidalari', 'Правила JSX', 'JSX rules'],
      [
        "**JSX** — JavaScript ichida HTML ga o'xshash sintaksis. Qoidalar:\n- Bitta **ildiz** element qaytariladi (yoki `<>...</>` fragment)\n- `class` o'rniga `className`, `for` o'rniga `htmlFor`\n- Barcha teglar yopiladi: `<img />`, `<br />`\n- `{ }` ichida istalgan JS **ifoda**: `{name}`, `{2 + 2}`, `{user.isPro ? \"Pro\" : \"Free\"}`\n- `style` obyekt bilan: `style={{ color: \"red\", fontSize: 20 }}`",
        "**JSX** — HTML-подобный синтаксис внутри JavaScript. Правила:\n- Возвращается один **корневой** элемент (или фрагмент `<>...</>`)\n- `className` вместо `class`, `htmlFor` вместо `for`\n- Все теги закрываются: `<img />`, `<br />`\n- Внутри `{ }` — любое JS-**выражение**: `{name}`, `{2 + 2}`, `{user.isPro ? \"Pro\" : \"Free\"}`\n- `style` задаётся объектом: `style={{ color: \"red\", fontSize: 20 }}`",
        "**JSX** is HTML-like syntax inside JavaScript. Rules:\n- Return a single **root** element (or a `<>...</>` fragment)\n- `className` instead of `class`, `htmlFor` instead of `for`\n- Every tag is closed: `<img />`, `<br />`\n- Any JS **expression** goes inside `{ }`: `{name}`, `{2 + 2}`, `{user.isPro ? \"Pro\" : \"Free\"}`\n- `style` takes an object: `style={{ color: \"red\", fontSize: 20 }}`",
      ],
      {
        ex: `const user = { name: "Dilnoza", xp: 1240 };

function App() {
  return (
    <>
      <h2 className="title">{user.name}</h2>
      <p style={{ color: "#7c5cfc" }}>XP: {user.xp}</p>
      <p>Daraja: {user.xp > 1000 ? "Developer" : "Coder"}</p>
    </>
  );
}`,
        ch: rc({
          i: ['`name = "Aziza"` va `xp = 250` o\'zgaruvchilarini `<h2 className="name">` va `<p className="xp">` ichida `{}` orqali ko\'rsating (`<p>` da: `XP: 250`).', 'Выведите переменные `name = "Aziza"` и `xp = 250` через `{}` в `<h2 className="name">` и `<p className="xp">` (в `<p>`: `XP: 250`).', 'Show the variables `name = "Aziza"` and `xp = 250` via `{}` in `<h2 className="name">` and `<p className="xp">` (the `<p>` reads `XP: 250`).'],
          s: { js: 'const name = "Aziza";\nconst xp = 250;\n\nfunction App() {\n  return <div></div>;\n}\n' },
          sol: { js: 'const name = "Aziza";\nconst xp = 250;\n\nfunction App() {\n  return (\n    <div>\n      <h2 className="name">{name}</h2>\n      <p className="xp">XP: {xp}</p>\n    </div>\n  );\n}\n' },
          tests: [
            [['h2.name = Aziza', 'h2.name = Aziza', 'h2.name = Aziza'], "text('h2.name') === 'Aziza'"],
            [['p.xp = XP: 250', 'p.xp = XP: 250', 'p.xp = XP: 250'], "text('p.xp') === 'XP: 250'"],
          ],
          rules: [['className', 'className', { t: 'js' }], ['\\{\\s*name\\s*\\}', '{name}', { t: 'js' }]],
        }),
        q: [
          mcq(['JSX da CSS class qanday yoziladi?', 'Как в JSX пишется CSS-класс?', 'How is a CSS class written in JSX?'], ['class', 'className', 'cssClass', 'styleClass'], 1, ['`class` — JS kalit so\'zi, shuning uchun `className`.', '`class` — ключевое слово JS, поэтому `className`.', '`class` is a JS keyword, so `className`.']),
          bug(['Nega xato?', 'Почему ошибка?', 'Why the error?'], 'function App() {\n  return (\n    <h1>Bir</h1>\n    <h2>Ikki</h2>\n  );\n}', [['Bitta ildiz element kerak', 'Нужен один корневой элемент', 'A single root element is required'], ['h2 mumkin emas', 'h2 нельзя', 'h2 is not allowed'], ['return ortiqcha', 'return лишний', 'return is extra']], 0, ['`<>...</>` bilan o\'rang.', 'Оберните в `<>...</>`.', 'Wrap them in `<>...</>`.']),
        ],
      }
    ),
    lesson(
      'props',
      ['Props', 'Props', 'Props'],
      [
        "**Props** — komponentga tashqaridan beriladigan ma'lumot (HTML atributlariga o'xshash):\n```\nfunction Badge({ label, color = \"gray\" }) {\n  return <span style={{ background: color }}>{label}</span>;\n}\n<Badge label=\"Yangi\" color=\"green\" />\n```\nProps **faqat o'qish uchun** — komponent ularni o'zgartirmaydi. Maxsus prop `children` — teg ichidagi kontent: `<Card>Matn</Card>`.",
        "**Props** — данные, передаваемые компоненту снаружи (похоже на HTML-атрибуты):\n```\nfunction Badge({ label, color = \"gray\" }) {\n  return <span style={{ background: color }}>{label}</span>;\n}\n<Badge label=\"Новое\" color=\"green\" />\n```\nProps **только для чтения** — компонент их не меняет. Особый prop `children` — содержимое между тегами: `<Card>Текст</Card>`.",
        "**Props** are data passed into a component from outside (like HTML attributes):\n```\nfunction Badge({ label, color = \"gray\" }) {\n  return <span style={{ background: color }}>{label}</span>;\n}\n<Badge label=\"New\" color=\"green\" />\n```\nProps are **read-only** — the component never changes them. The special `children` prop is the content between tags: `<Card>Text</Card>`.",
      ],
      {
        ex: `function UserCard({ name, level }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 8, marginBottom: 8 }}>
      <b>{name}</b> — {level}-daraja
    </div>
  );
}

function App() {
  return (
    <>
      <UserCard name="Aziza" level={5} />
      <UserCard name="Bekzod" level={3} />
    </>
  );
}`,
        ch: rc({
          i: ['`Greeting` komponentini yozing: `name` prop qabul qilib, `<p className="greet">Salom, {name}!</p>` qaytarsin. `App` da uni `name="Ali"` va `name="Vali"` bilan ikki marta ishlating.', 'Напишите `Greeting`: принимает prop `name` и возвращает `<p className="greet">Salom, {name}!</p>`. В `App` используйте его дважды: с `name="Ali"` и `name="Vali"`.', 'Write `Greeting`: take a `name` prop and return `<p className="greet">Salom, {name}!</p>`. Use it twice in `App` with `name="Ali"` and `name="Vali"`.'],
          s: { js: 'function Greeting() {\n  return null;\n}\n\nfunction App() {\n  return <div></div>;\n}\n' },
          sol: { js: 'function Greeting({ name }) {\n  return <p className="greet">Salom, {name}!</p>;\n}\n\nfunction App() {\n  return (\n    <div>\n      <Greeting name="Ali" />\n      <Greeting name="Vali" />\n    </div>\n  );\n}\n' },
          tests: [[['2 ta salomlashuv', '2 приветствия', '2 greetings'], "$$('.greet').map(p => p.textContent).join('|') === 'Salom, Ali!|Salom, Vali!'"]],
          rules: [['<Greeting', 'Greeting', { t: 'js' }]],
        }),
        q: [
          tf(['Komponent o\'z props larini o\'zgartirishi mumkin.', 'Компонент может изменять свои props.', 'A component may modify its own props.'], false, ['Props faqat o\'qish uchun.', 'Props только для чтения.', 'Props are read-only.']),
          fill(['Ichki kontent prop nomi:', 'Имя prop для вложенного контента:', 'Prop name for nested content:'], 'function Card({ ___ }) { return <div>{___}</div>; }', ['children'], ['`children`.', '`children`.', '`children`.']),
        ],
      }
    ),
    lesson(
      'lists-keys',
      ['Ro\'yxatlar va key', 'Списки и key', 'Lists and keys'],
      [
        "Massivni `map` bilan JSX ga aylantiramiz:\n```\n<ul>\n  {fruits.map((f) => <li key={f.id}>{f.name}</li>)}\n</ul>\n```\nHar bir elementga **noyob `key`** kerak — React qaysi element o'zgarganini shu orqali biladi. Eng yaxshisi — ma'lumotdagi `id`. Indeksni (`key={i}`) faqat ro'yxat hech qachon o'zgarmasa ishlating.",
        "Массив превращаем в JSX через `map`:\n```\n<ul>\n  {fruits.map((f) => <li key={f.id}>{f.name}</li>)}\n</ul>\n```\nКаждому элементу нужен **уникальный `key`** — по нему React понимает, какой элемент изменился. Лучше всего — `id` из данных. Индекс (`key={i}`) используйте, только если список никогда не меняется.",
        "Turn an array into JSX with `map`:\n```\n<ul>\n  {fruits.map((f) => <li key={f.id}>{f.name}</li>)}\n</ul>\n```\nEach item needs a **unique `key`** — React uses it to know which item changed. Prefer an `id` from your data. Use the index (`key={i}`) only if the list never changes.",
      ],
      {
        ex: `const courses = [
  { id: 1, title: "HTML", lessons: 25 },
  { id: 2, title: "CSS", lessons: 25 },
  { id: 3, title: "JavaScript", lessons: 25 },
];

function App() {
  return (
    <ul>
      {courses.map((c) => (
        <li key={c.id}>{c.title} — {c.lessons} dars</li>
      ))}
    </ul>
  );
}`,
        ch: rc({
          i: ['`products` massividagi har bir mahsulotni `<li key={p.id}>` ichida `NOMI — NARX` ko\'rinishida chiqaring (masalan `Non — 4000`).', 'Выведите каждый товар из `products` в `<li key={p.id}>` в виде `НАЗВАНИЕ — ЦЕНА` (например, `Non — 4000`).', 'Render each product from `products` in an `<li key={p.id}>` as `NAME — PRICE` (e.g. `Non — 4000`).'],
          s: { js: 'const products = [\n  { id: 1, name: "Non", price: 4000 },\n  { id: 2, name: "Sut", price: 12000 },\n  { id: 3, name: "Choy", price: 15000 },\n];\n\nfunction App() {\n  return <ul></ul>;\n}\n' },
          sol: { js: 'const products = [\n  { id: 1, name: "Non", price: 4000 },\n  { id: 2, name: "Sut", price: 12000 },\n  { id: 3, name: "Choy", price: 15000 },\n];\n\nfunction App() {\n  return (\n    <ul>\n      {products.map((p) => (\n        <li key={p.id}>{p.name} — {p.price}</li>\n      ))}\n    </ul>\n  );\n}\n' },
          tests: [[['3 ta li to\'g\'ri matn bilan', '3 li с верным текстом', '3 li with the right text'], "$$('#root li').map(l => l.textContent).join('|') === 'Non — 4000|Sut — 12000|Choy — 15000'"]],
          rules: [['\\.map\\(', 'map', { t: 'js' }], ['key=', 'key', { t: 'js' }]],
        }),
        q: [
          mcq(['`key` uchun eng yaxshi qiymat:', 'Лучшее значение для `key`:', 'Best value for `key`:'], [['Ma\'lumotdagi noyob id', 'Уникальный id из данных', 'A unique id from the data'], ['Math.random()', 'Math.random()', 'Math.random()'], ['Har doim 1', 'Всегда 1', 'Always 1']], 0, ['Barqaror va noyob bo\'lishi kerak.', 'Должен быть стабильным и уникальным.', 'It must be stable and unique.']),
          tf(['Ro\'yxat elementlarida `key` bo\'lmasa React ogohlantirish beradi.', 'Без `key` у элементов списка React выдаёт предупреждение.', 'React warns when list items lack a `key`.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
        ],
      }
    ),
    lesson(
      'conditional-rendering',
      ['Shartli render', 'Условный рендер', 'Conditional rendering'],
      [
        "JSX da shart qo'yishning usullari:\n- Ternar: `{isLoggedIn ? <Profile /> : <Login />}`\n- `&&`: `{hasError && <p>Xato!</p>}` — shart `true` bo'lsa chiziladi\n- Erta qaytarish: `if (!user) return <p>Yuklanmoqda...</p>;`\n\n⚠️ `{count && <p>...</p>}` da `count` `0` bo'lsa ekranda `0` chiqadi — `{count > 0 && ...}` yozing.",
        "Способы условий в JSX:\n- Тернарный: `{isLoggedIn ? <Profile /> : <Login />}`\n- `&&`: `{hasError && <p>Ошибка!</p>}` — рисуется, если условие `true`\n- Ранний возврат: `if (!user) return <p>Загрузка...</p>;`\n\n⚠️ В `{count && <p>...</p>}` при `count` = `0` на экране появится `0` — пишите `{count > 0 && ...}`.",
        "Ways to add conditions in JSX:\n- Ternary: `{isLoggedIn ? <Profile /> : <Login />}`\n- `&&`: `{hasError && <p>Error!</p>}` — renders when the condition is `true`\n- Early return: `if (!user) return <p>Loading...</p>;`\n\n⚠️ With `{count && <p>...</p>}`, a `count` of `0` prints `0` — write `{count > 0 && ...}`.",
      ],
      {
        ex: `function Status({ online, messages }) {
  return (
    <div>
      <p>{online ? "🟢 Online" : "⚪ Offline"}</p>
      {messages > 0 && <p>📩 {messages} ta yangi xabar</p>}
    </div>
  );
}

function App() {
  return (
    <>
      <Status online={true} messages={3} />
      <Status online={false} messages={0} />
    </>
  );
}`,
        ch: rc({
          i: ['`Hearts` komponenti: `count > 0` bo\'lsa `<p className="hearts">❤ {count}</p>`, aks holda `<p className="empty">Yuraklar tugadi</p>`. `App` da `<Hearts count={3} />` va `<Hearts count={0} />`.', 'Компонент `Hearts`: при `count > 0` — `<p className="hearts">❤ {count}</p>`, иначе `<p className="empty">Yuraklar tugadi</p>`. В `App`: `<Hearts count={3} />` и `<Hearts count={0} />`.', '`Hearts` component: if `count > 0` render `<p className="hearts">❤ {count}</p>`, otherwise `<p className="empty">Yuraklar tugadi</p>`. In `App`: `<Hearts count={3} />` and `<Hearts count={0} />`.'],
          s: { js: 'function Hearts({ count }) {\n  return null;\n}\n\nfunction App() {\n  return (\n    <div>\n      <Hearts count={3} />\n      <Hearts count={0} />\n    </div>\n  );\n}\n' },
          sol: { js: 'function Hearts({ count }) {\n  return count > 0 ? <p className="hearts">❤ {count}</p> : <p className="empty">Yuraklar tugadi</p>;\n}\n\nfunction App() {\n  return (\n    <div>\n      <Hearts count={3} />\n      <Hearts count={0} />\n    </div>\n  );\n}\n' },
          tests: [
            [['❤ 3', '❤ 3', '❤ 3'], "text('.hearts') === '❤ 3'"],
            [['0 da xabar', 'сообщение при 0', 'message at 0'], "text('.empty') === 'Yuraklar tugadi' && $$('.hearts').length === 1"],
          ],
          rules: [['\\?|&&|if', 'condition', { t: 'js' }]],
        }),
        q: [
          out(['Ekranda nima chiqadi?', 'Что появится на экране?', 'What appears on screen?'], 'const count = 0;\nreturn <div>{count && <p>Bor</p>}</div>;', ['0'], ['`0 && ...` → `0`, React uni chizadi.', '`0 && ...` → `0`, и React его рисует.', '`0 && ...` → `0`, which React renders.'], { d: 'medium' }),
          mcq(['Shart `true` bo\'lsagina chizish:', 'Рендерить только если условие `true`:', 'Render only if the condition is `true`:'], ['{ok || <A />}', '{ok && <A />}', '{ok ?? <A />}', '{if ok <A />}'], 1, ['`&&`.', '`&&`.', '`&&`.']),
        ],
      }
    ),
  ],
  [
    mcq(['JSX ichida JS ifodasi qayerda yoziladi?', 'Где пишется JS-выражение в JSX?', 'Where do JS expressions go in JSX?'], ['( )', '{ }', '[ ]', '" "'], 1, ['`{ }`.', '`{ }`.', '`{ }`.']),
    tf(['Fragment `<>...</>` qo\'shimcha DOM elementi yaratmaydi.', 'Фрагмент `<>...</>` не создаёт лишний DOM-элемент.', 'A fragment `<>...</>` adds no extra DOM element.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
    match(['HTML → JSX', 'HTML → JSX', 'HTML → JSX'], [['class', 'className'], ['for', 'htmlFor'], ['onclick', 'onClick']], ['JSX camelCase nomlardan foydalanadi.', 'JSX использует camelCase-имена.', 'JSX uses camelCase names.']),
    bug(['Nega ogohlantirish chiqadi?', 'Почему появляется предупреждение?', 'Why is there a warning?'], '{users.map(u => <li>{u.name}</li>)}', [['key yo\'q', 'Нет key', 'Missing key'], ['map xato', 'Ошибка в map', 'map is wrong'], ['li kerak emas', 'li не нужен', 'li is not needed']], 0, ['`<li key={u.id}>`.', '`<li key={u.id}>`.', '`<li key={u.id}>`.']),
    fill(['Default prop qiymati:', 'Значение prop по умолчанию:', 'Default prop value:'], 'function Btn({ size ___ "md" }) { }', ['='], ['Destrukturizatsiyada default.', 'Значение по умолчанию в деструктуризации.', 'A destructuring default.']),
    mcq(['Komponent nomi qanday boshlanadi?', 'С чего начинается имя компонента?', 'How does a component name start?'], [['Katta harf', 'Заглавная буква', 'Uppercase letter'], ['Kichik harf', 'Строчная буква', 'Lowercase letter'], ['_ belgisi', 'Символ _', 'An underscore']], 0, ['`UserCard`, `App`.', '`UserCard`, `App`.', '`UserCard`, `App`.']),
  ]
);
