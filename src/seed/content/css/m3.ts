import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

const items3 = '<div class="row">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>\n';
const baseItem = '.item { width: 60px; height: 60px; background: #7c5cfc; color: white; }\n';

export default mod(
  'flexbox',
  ['Flexbox', 'Flexbox', 'Flexbox'],
  ['Elementlarni bir o\'q bo\'ylab joylashtirishning eng qulay usuli.', 'Самый удобный способ расположить элементы вдоль одной оси.', 'The easiest way to lay out items along one axis.'],
  [
    lesson(
      'flex-container',
      ['Flex konteyner', 'Flex-контейнер', 'The flex container'],
      [
        "`display: flex` elementni **flex konteyner** qiladi, uning bevosita farzandlari esa **flex elementlar** bo'ladi. Ular avtomatik ravishda bir qatorga tiziladi.\n\nFlexboxda ikki o'q bor: **asosiy o'q** (main axis, standart — gorizontal) va **ko'ndalang o'q** (cross axis). Keyingi darslardagi barcha xususiyatlar shu o'qlar bilan ishlaydi.",
        "`display: flex` делает элемент **flex-контейнером**, а его прямые потомки становятся **flex-элементами**. Они автоматически выстраиваются в ряд.\n\nВо Flexbox две оси: **главная** (main axis, по умолчанию — горизонтальная) и **поперечная** (cross axis). Все свойства следующих уроков работают с этими осями.",
        "`display: flex` turns an element into a **flex container**, and its direct children become **flex items**. They line up in a row automatically.\n\nFlexbox has two axes: the **main axis** (horizontal by default) and the **cross axis**. Every property in the next lessons works with these axes.",
      ],
      {
        ex: `<div class="row">
  <div>A</div><div>B</div><div>C</div>
</div>
<style>
  .row { display: flex; gap: 8px; }
  .row div { padding: 16px; background: #00d4ff; }
</style>`,
        ch: ch({
          i: ['`.row` ni flex konteyner qiling — 3 ta element bir qatorga tizilsin.', 'Сделайте `.row` flex-контейнером — 3 элемента должны встать в ряд.', 'Make `.row` a flex container so the 3 items line up in a row.'],
          s: { html: items3, css: baseItem + '.row {\n\n}\n' },
          sol: { html: items3, css: baseItem + '.row {\n  display: flex;\n}\n' },
          tests: [
            [['display: flex', 'display: flex', 'display: flex'], "css('.row', 'display') === 'flex'"],
            [['elementlar bir qatorda', 'элементы в одном ряду', 'items in one row'], "new Set($$('.item').map(i => Math.round(i.getBoundingClientRect().top))).size === 1"],
          ],
          rules: [['display\\s*:\\s*flex', 'flex', { t: 'css' }]],
        }),
        q: [
          tf(['Flex xususiyatlari konteynerning nevaralariga ham ta\'sir qiladi.', 'Flex влияет и на «внуков» контейнера.', 'Flex affects the container’s grandchildren too.'], false, ['Faqat bevosita farzandlar flex element bo\'ladi.', 'Flex-элементами становятся только прямые потомки.', 'Only direct children become flex items.']),
          mcq(['Standart asosiy o\'q yo\'nalishi:', 'Направление главной оси по умолчанию:', 'Default main axis direction:'], [['Gorizontal (chapdan o\'ngga)', 'Горизонтальное (слева направо)', 'Horizontal (left to right)'], ['Vertikal', 'Вертикальное', 'Vertical'], ['Diagonal', 'Диагональное', 'Diagonal']], 0, ['`flex-direction: row` — standart.', '`flex-direction: row` — по умолчанию.', '`flex-direction: row` is the default.']),
        ],
      }
    ),
    lesson(
      'justify-content',
      ['justify-content', 'justify-content', 'justify-content'],
      [
        "`justify-content` elementlarni **asosiy o'q** bo'ylab taqsimlaydi:\n- `flex-start` (standart), `flex-end`, `center`\n- `space-between` — chetlar yopishgan, oraliqlar teng\n- `space-around` — har element atrofida teng bo'shliq\n- `space-evenly` — barcha bo'shliqlar teng\n\nNavbar uchun klassika: logotip chapda, menyu o'ngda → `justify-content: space-between`.",
        "`justify-content` распределяет элементы вдоль **главной оси**:\n- `flex-start` (по умолчанию), `flex-end`, `center`\n- `space-between` — крайние у краёв, промежутки равны\n- `space-around` — равные отступы вокруг каждого\n- `space-evenly` — все промежутки равны\n\nКлассика для навбара: логотип слева, меню справа → `justify-content: space-between`.",
        "`justify-content` distributes items along the **main axis**:\n- `flex-start` (default), `flex-end`, `center`\n- `space-between` — edges stick to the sides, equal gaps between\n- `space-around` — equal space around each item\n- `space-evenly` — all gaps are equal\n\nA navbar classic: logo left, menu right → `justify-content: space-between`.",
      ],
      {
        ex: `<nav class="bar"><b>LOGO</b><span>Menyu</span></nav>
<style>
  .bar { display: flex; justify-content: space-between; padding: 12px; background: #151d32; color: white; }
</style>`,
        ch: ch({
          i: ['`.row` dagi elementlarni **markazga** joylang.', 'Расположите элементы `.row` **по центру**.', 'Place the `.row` items in the **center**.'],
          s: { html: items3, css: baseItem + '.row {\n  display: flex;\n  width: 400px;\n}\n' },
          sol: { html: items3, css: baseItem + '.row {\n  display: flex;\n  width: 400px;\n  justify-content: center;\n}\n' },
          tests: [[['elementlar markazda', 'элементы по центру', 'items are centered'], "(() => { const r = $('.row').getBoundingClientRect(); const a = $$('.item')[0].getBoundingClientRect(); const c = $$('.item')[2].getBoundingClientRect(); return Math.abs((a.left - r.left) - (r.right - c.right)) <= 1 && a.left - r.left > 50; })()"]],
          rules: [['justify-content\\s*:\\s*center', 'center', { t: 'css' }]],
        }),
        q: [
          mcq(['Chetdagilar yopishib, oraliqlar teng:', 'Крайние у краёв, промежутки равны:', 'Edges stick to the sides, equal gaps:'], ['space-around', 'space-between', 'center', 'stretch'], 1, ['`space-between`.', '`space-between`.', '`space-between`.']),
          tf(['`justify-content` ko\'ndalang o\'q bo\'yicha ishlaydi.', '`justify-content` работает по поперечной оси.', '`justify-content` works on the cross axis.'], false, ['U asosiy o\'q bo\'yicha ishlaydi.', 'Он работает по главной оси.', 'It works on the main axis.']),
        ],
      }
    ),
    lesson(
      'align-items',
      ['align-items', 'align-items', 'align-items'],
      [
        "`align-items` elementlarni **ko'ndalang o'q** bo'yicha tekislaydi (standart holatda — vertikal):\n- `stretch` (standart) — balandlikni to'ldiradi\n- `flex-start`, `flex-end`, `center`\n- `baseline` — matn tayanch chizig'i bo'yicha\n\n**Mukammal markazlash:** `display: flex; justify-content: center; align-items: center;` — eng mashhur CSS sehri!",
        "`align-items` выравнивает элементы по **поперечной оси** (по умолчанию — вертикально):\n- `stretch` (по умолчанию) — растягивает по высоте\n- `flex-start`, `flex-end`, `center`\n- `baseline` — по базовой линии текста\n\n**Идеальное центрирование:** `display: flex; justify-content: center; align-items: center;` — самая известная магия CSS!",
        "`align-items` aligns items on the **cross axis** (vertical by default):\n- `stretch` (default) — fills the height\n- `flex-start`, `flex-end`, `center`\n- `baseline` — along the text baseline\n\n**Perfect centering:** `display: flex; justify-content: center; align-items: center;` — the most famous CSS trick!",
      ],
      {
        ex: `<div class="stage"><div class="dot"></div></div>
<style>
  .stage { display: flex; justify-content: center; align-items: center; height: 160px; background: #0b1020; }
  .dot { width: 40px; height: 40px; border-radius: 50%; background: #22c55e; }
</style>`,
        ch: ch({
          i: ['`.box` ichidagi `.ball` ni gorizontal va vertikal **markazga** qo\'ying.', 'Поставьте `.ball` внутри `.box` **в центр** по горизонтали и вертикали.', 'Put `.ball` in the exact **center** of `.box`, horizontally and vertically.'],
          s: { html: '<div class="box">\n  <div class="ball"></div>\n</div>\n', css: '.box { width: 300px; height: 200px; background: #eee; }\n.ball { width: 50px; height: 50px; border-radius: 50%; background: tomato; }\n' },
          sol: { html: '<div class="box">\n  <div class="ball"></div>\n</div>\n', css: '.box { width: 300px; height: 200px; background: #eee; display: flex; justify-content: center; align-items: center; }\n.ball { width: 50px; height: 50px; border-radius: 50%; background: tomato; }\n' },
          tests: [[['to\'p markazda', 'мяч по центру', 'ball is centered'], "(() => { const b = $('.box').getBoundingClientRect(); const c = $('.ball').getBoundingClientRect(); return Math.abs(c.left - b.left - 125) <= 1 && Math.abs(c.top - b.top - 75) <= 1; })()"]],
          rules: [['align-items', 'align-items', { t: 'css' }]],
        }),
        q: [
          mcq(['Ko\'ndalang o\'q bo\'yicha markazlash:', 'Центрирование по поперечной оси:', 'Center along the cross axis:'], ['justify-content: center', 'align-items: center', 'text-align: center', 'margin: center'], 1, ['`align-items` — ko\'ndalang o\'q.', '`align-items` — поперечная ось.', '`align-items` = cross axis.']),
          order(['To\'liq markazlash kodini tuzing', 'Соберите код полного центрирования', 'Assemble the full-centering code'], ['.box {', 'display: flex;', 'justify-content: center;', 'align-items: center;', '}'], ['Avval flex, keyin ikki o\'q.', 'Сначала flex, потом обе оси.', 'flex first, then both axes.']),
        ],
      }
    ),
    lesson(
      'direction-wrap-gap',
      ['flex-direction, wrap va gap', 'flex-direction, wrap и gap', 'flex-direction, wrap and gap'],
      [
        "- `flex-direction: column` — asosiy o'qni vertikal qiladi (endi `justify-content` vertikal ishlaydi!). Boshqa qiymatlar: `row-reverse`, `column-reverse`\n- `flex-wrap: wrap` — joy yetmasa elementlar keyingi qatorga o'tadi\n- `gap: 16px` — elementlar orasidagi masofa (margin dan ancha qulay)",
        "- `flex-direction: column` — делает главную ось вертикальной (теперь `justify-content` работает по вертикали!). Другие значения: `row-reverse`, `column-reverse`\n- `flex-wrap: wrap` — при нехватке места элементы переносятся на новую строку\n- `gap: 16px` — расстояние между элементами (гораздо удобнее margin)",
        "- `flex-direction: column` makes the main axis vertical (now `justify-content` works vertically!). Other values: `row-reverse`, `column-reverse`\n- `flex-wrap: wrap` — items move to the next line when space runs out\n- `gap: 16px` — space between items (far easier than margins)",
      ],
      {
        ex: `<div class="tags">
  <span>HTML</span><span>CSS</span><span>JS</span><span>React</span><span>Node</span>
</div>
<style>
  .tags { display: flex; flex-wrap: wrap; gap: 8px; width: 180px; }
  .tags span { padding: 4px 10px; background: #7c5cfc33; border-radius: 99px; }
</style>`,
        ch: ch({
          i: ['`.row` dagi elementlarni **ustun** (column) bo\'lib joylashtiring va oraliq `gap: 12px` bo\'lsin.', 'Расположите элементы `.row` **столбцом** (column) с промежутком `gap: 12px`.', 'Stack the `.row` items in a **column** with `gap: 12px` between them.'],
          s: { html: items3, css: baseItem + '.row {\n  display: flex;\n}\n' },
          sol: { html: items3, css: baseItem + '.row {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n' },
          tests: [
            [['ustun bo\'lib', 'столбцом', 'in a column'], "css('.row', 'flex-direction') === 'column'"],
            [['oraliq 12px', 'промежуток 12px', 'gap is 12px'], "(() => { const [a, b] = $$('.item').map(i => i.getBoundingClientRect()); return b.top - a.bottom === 12; })()"],
          ],
          rules: [['column', 'column', { t: 'css' }], ['gap', 'gap', { t: 'css' }]],
        }),
        q: [
          mcq(['Elementlar keyingi qatorga o\'tishi uchun:', 'Чтобы элементы переносились на новую строку:', 'To let items wrap to a new line:'], ['flex-wrap: wrap', 'flex-flow: next', 'wrap: true', 'overflow: wrap'], 0, ['`flex-wrap: wrap`.', '`flex-wrap: wrap`.', '`flex-wrap: wrap`.']),
          tf(['`flex-direction: column` da `justify-content` vertikal ishlaydi.', 'При `flex-direction: column` `justify-content` работает по вертикали.', 'With `flex-direction: column`, `justify-content` works vertically.'], true, ['Asosiy o\'q vertikal bo\'ladi.', 'Главная ось становится вертикальной.', 'The main axis becomes vertical.'], { d: 'medium' }),
        ],
      }
    ),
    lesson(
      'flex-grow',
      ['flex-grow, shrink va basis', 'flex-grow, shrink и basis', 'flex-grow, shrink and basis'],
      [
        "Bu xususiyatlar **flex elementga** beriladi:\n- `flex-grow: 1` — bo'sh joyni egallaydi (raqam — ulush)\n- `flex-shrink` — joy yetmasa qanchalik qisqarishi\n- `flex-basis` — boshlang'ich o'lcham\n- Qisqa yozuv: `flex: 1` = `1 1 0` — barcha elementlar teng bo'linadi\n\nMisol: sidebar 200px, kontent qolgan hamma joy → `.content { flex: 1 }`.",
        "Эти свойства задаются **flex-элементу**:\n- `flex-grow: 1` — занимает свободное место (число — доля)\n- `flex-shrink` — насколько сжиматься при нехватке места\n- `flex-basis` — исходный размер\n- Короткая запись: `flex: 1` = `1 1 0` — все элементы делят место поровну\n\nПример: сайдбар 200px, контент — всё остальное → `.content { flex: 1 }`.",
        "These properties go on the **flex item**:\n- `flex-grow: 1` — takes free space (the number is a share)\n- `flex-shrink` — how much it shrinks when space is tight\n- `flex-basis` — the starting size\n- Shorthand: `flex: 1` = `1 1 0` — items share space equally\n\nExample: a 200px sidebar and content taking the rest → `.content { flex: 1 }`.",
      ],
      {
        ex: `<div class="layout">
  <aside>Sidebar</aside>
  <main>Kontent</main>
</div>
<style>
  .layout { display: flex; gap: 8px; }
  aside { width: 120px; background: #f59e0b55; }
  main { flex: 1; background: #22c55e55; }
</style>`,
        ch: ch({
          i: ['`.side` 100px kenglikda qolsin, `.main` esa qolgan barcha joyni egallasin (`flex: 1`).', '`.side` остаётся шириной 100px, а `.main` занимает всё оставшееся место (`flex: 1`).', 'Keep `.side` at 100px and make `.main` take all remaining space (`flex: 1`).'],
          s: { html: '<div class="layout">\n  <div class="side">Side</div>\n  <div class="main">Main</div>\n</div>\n', css: '.layout { display: flex; width: 500px; }\n.side { width: 100px; }\n.main {\n\n}\n' },
          sol: { html: '<div class="layout">\n  <div class="side">Side</div>\n  <div class="main">Main</div>\n</div>\n', css: '.layout { display: flex; width: 500px; }\n.side { width: 100px; }\n.main {\n  flex: 1;\n}\n' },
          tests: [[['main kengligi 400px', 'ширина main 400px', 'main is 400px wide'], "Math.round($('.main').getBoundingClientRect().width) === 400"]],
          rules: [['flex(-grow)?\\s*:\\s*1', 'flex: 1', { t: 'css' }]],
        }),
        q: [
          out(['`.b` qancha joy oladi?', 'Какую ширину займёт `.b`?', 'How wide will `.b` be?'], '.row { display: flex; width: 300px; }\n.a { flex: 1; }\n.b { flex: 2; }', ['200px', '200'], ['Ulushlar 1:2 → 100px va 200px.', 'Доли 1:2 → 100px и 200px.', 'Shares 1:2 → 100px and 200px.'], { d: 'medium' }),
          mcq(['Bu xususiyatlar kimga beriladi: flex-grow?', 'Кому задаётся flex-grow?', 'Where does flex-grow go?'], [['Flex elementga', 'Flex-элементу', 'On the flex item'], ['Konteynerga', 'Контейнеру', 'On the container'], ['body ga', 'body', 'On body']], 0, ['`flex-grow` — elementning xususiyati.', '`flex-grow` — свойство элемента.', '`flex-grow` is an item property.']),
        ],
      }
    ),
  ],
  [
    mcq(['Flexbox ni yoqish:', 'Включить Flexbox:', 'Enable Flexbox:'], ['display: flex', 'flex: on', 'layout: flex', 'position: flex'], 0, ['`display: flex`.', '`display: flex`.', '`display: flex`.']),
    match(['Xususiyat va o\'q', 'Свойство и ось', 'Property and axis'], [['justify-content', 'main axis'], ['align-items', 'cross axis'], ['gap', 'between items']], ['justify — asosiy, align — ko\'ndalang, gap — oraliq.', 'justify — главная, align — поперечная, gap — промежутки.', 'justify → main, align → cross, gap → between.']),
    tf(['`gap` flex konteynerda ishlaydi.', '`gap` работает во flex-контейнере.', '`gap` works in a flex container.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
    bug(['Nega elementlar vertikal markazlashmayapti?', 'Почему элементы не центрируются по вертикали?', "Why aren't the items vertically centered?"], '.box {\n  justify-content: center;\n  align-items: center;\n  height: 200px;\n}', [['display: flex yo\'q', 'Нет display: flex', 'Missing display: flex'], ['height xato', 'Ошибка в height', 'height is wrong'], ['center noto\'g\'ri', 'center неверно', 'center is wrong']], 0, ['Flex xususiyatlari faqat flex konteynerda ishlaydi.', 'Flex-свойства работают только во flex-контейнере.', 'Flex properties only work in a flex container.']),
    fill(['Elementlarni ustun qilish:', 'Расположить элементы столбцом:', 'Stack items in a column:'], '.list { display: flex; flex-direction: ___; }', ['column'], ['`column`.', '`column`.', '`column`.']),
    out(['Uch element `flex: 1` bilan, konteyner 600px. Har biri?', 'Три элемента с `flex: 1`, контейнер 600px. Ширина каждого?', 'Three items with `flex: 1` in a 600px container. Each width?'], '.row { display: flex; width: 600px; }\n.row > * { flex: 1; }', ['200px', '200'], ['600 / 3 = 200px.', '600 / 3 = 200px.', '600 / 3 = 200px.'], { d: 'medium' }),
  ]
);
