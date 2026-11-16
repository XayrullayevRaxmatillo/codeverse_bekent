import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

const six = '<div class="grid">\n' + [1, 2, 3, 4, 5, 6].map((n) => `  <div class="cell">${n}</div>`).join('\n') + '\n</div>\n';
const cellCss = '.cell { background: #00d4ff; padding: 12px; }\n';

export default mod(
  'grid-layout',
  ['Grid va pozitsiyalash', 'Grid и позиционирование', 'Grid and positioning'],
  ['Ikki o\'lchamli layout va elementlarni aniq joylashtirish.', 'Двумерная раскладка и точное позиционирование.', 'Two-dimensional layout and precise positioning.'],
  [
    lesson(
      'grid-basics',
      ['Grid asoslari', 'Основы Grid', 'Grid basics'],
      [
        "**CSS Grid** — ikki o'lchamli (qator **va** ustun) layout tizimi. Flexbox bir o'q uchun, Grid butun sahifa setkasi uchun.\n\n`display: grid` + `grid-template-columns` ustunlarni belgilaydi:\n`grid-template-columns: 200px 200px 200px` — uchta 200px ustun. Elementlar avtomatik katakchalarga joylashadi. `grid-template-rows` qatorlarni belgilaydi.",
        "**CSS Grid** — двумерная (строки **и** столбцы) система раскладки. Flexbox — для одной оси, Grid — для сетки всей страницы.\n\n`display: grid` + `grid-template-columns` задаёт столбцы:\n`grid-template-columns: 200px 200px 200px` — три столбца по 200px. Элементы автоматически раскладываются по ячейкам. `grid-template-rows` задаёт строки.",
        "**CSS Grid** is a two-dimensional (rows **and** columns) layout system. Flexbox is for one axis; Grid is for whole-page grids.\n\n`display: grid` + `grid-template-columns` defines columns:\n`grid-template-columns: 200px 200px 200px` makes three 200px columns. Items flow into cells automatically. `grid-template-rows` defines rows.",
      ],
      {
        ex: `<div class="g">
  <div>1</div><div>2</div><div>3</div><div>4</div>
</div>
<style>
  .g { display: grid; grid-template-columns: 100px 100px; gap: 8px; }
  .g div { background: #7c5cfc; color: white; padding: 16px; }
</style>`,
        ch: ch({
          i: ['`.grid` ni har biri `100px` bo\'lgan **3 ustunli** grid qiling.', 'Сделайте `.grid` сеткой из **3 столбцов** по `100px`.', 'Make `.grid` a **3-column** grid with each column `100px` wide.'],
          s: { html: six, css: cellCss + '.grid {\n\n}\n' },
          sol: { html: six, css: cellCss + '.grid {\n  display: grid;\n  grid-template-columns: 100px 100px 100px;\n}\n' },
          tests: [
            [['display: grid', 'display: grid', 'display: grid'], "css('.grid', 'display') === 'grid'"],
            [['3 ta 100px ustun', '3 столбца по 100px', 'three 100px columns'], "css('.grid', 'grid-template-columns') === '100px 100px 100px'"],
          ],
          rules: [['grid-template-columns', 'columns', { t: 'css' }]],
        }),
        q: [
          tf(['Grid ikki o\'lchamli layout tizimi.', 'Grid — двумерная система раскладки.', 'Grid is a two-dimensional layout system.'], true, ['Qatorlar va ustunlar birga.', 'Строки и столбцы вместе.', 'Rows and columns together.']),
          mcq(['Ustunlarni belgilovchi xususiyat:', 'Свойство, задающее столбцы:', 'Property that defines columns:'], ['grid-columns', 'grid-template-columns', 'columns-template', 'grid-cols'], 1, ['`grid-template-columns`.', '`grid-template-columns`.', '`grid-template-columns`.']),
        ],
      }
    ),
    lesson(
      'fr-repeat',
      ['fr birligi va repeat()', 'Единица fr и repeat()', 'The fr unit and repeat()'],
      [
        "`fr` — bo'sh joyning **ulushi** (fraction). `1fr 2fr` — ikkinchi ustun birinchisidan 2 baravar keng.\n\n`repeat(4, 1fr)` = `1fr 1fr 1fr 1fr`.\n\nEng foydali moslashuvchan formula:\n`grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));` — media querysiz kartochkalar ekranga qarab ustunlarga bo'linadi!",
        "`fr` — **доля** свободного места (fraction). `1fr 2fr` — второй столбец вдвое шире первого.\n\n`repeat(4, 1fr)` = `1fr 1fr 1fr 1fr`.\n\nСамая полезная адаптивная формула:\n`grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));` — карточки делятся на столбцы по ширине экрана без media query!",
        "`fr` is a **fraction** of free space. `1fr 2fr` makes the second column twice as wide as the first.\n\n`repeat(4, 1fr)` = `1fr 1fr 1fr 1fr`.\n\nThe most useful responsive formula:\n`grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));` — cards split into columns by screen width, no media queries!",
      ],
      {
        ex: `<div class="cards">
  <div>A</div><div>B</div><div>C</div><div>D</div><div>E</div>
</div>
<style>
  .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; }
  .cards div { background: #22c55e; padding: 24px; border-radius: 12px; }
</style>`,
        ch: ch({
          i: ['`.grid` (kengligi 600px) ni `repeat()` yordamida **3 ta teng** `1fr` ustunga bo\'ling.', 'Разделите `.grid` (ширина 600px) на **3 равных** столбца `1fr` с помощью `repeat()`.', 'Split `.grid` (600px wide) into **3 equal** `1fr` columns using `repeat()`.'],
          s: { html: six, css: cellCss + '.grid {\n  width: 600px;\n  display: grid;\n}\n' },
          sol: { html: six, css: cellCss + '.grid {\n  width: 600px;\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}\n' },
          tests: [[['3 ta 200px ustun', '3 столбца по 200px', 'three 200px columns'], "css('.grid', 'grid-template-columns') === '200px 200px 200px'"]],
          rules: [['repeat\\(\\s*3\\s*,\\s*1fr\\s*\\)', 'repeat(3, 1fr)', { t: 'css' }]],
        }),
        q: [
          out(['Ustunlar kengligi (konteyner 300px)?', 'Ширины столбцов (контейнер 300px)?', 'Column widths (container 300px)?'], '.g { display: grid; width: 300px; grid-template-columns: 1fr 2fr; }', ['100px 200px'], ['1:2 → 100px va 200px.', '1:2 → 100px и 200px.', '1:2 → 100px and 200px.'], { d: 'medium' }),
          fill(['4 ta teng ustun:', '4 равных столбца:', '4 equal columns:'], 'grid-template-columns: ___(4, 1fr);', ['repeat'], ['`repeat(4, 1fr)`.', '`repeat(4, 1fr)`.', '`repeat(4, 1fr)`.']),
        ],
      }
    ),
    lesson(
      'grid-placement',
      ['Elementlarni joylashtirish', 'Размещение элементов', 'Placing items'],
      [
        "Grid elementini bir nechta katakka cho'zish mumkin:\n- `grid-column: span 2` — 2 ustun egallaydi\n- `grid-column: 1 / 3` — 1-chiziqdan 3-chiziqqacha\n- `grid-row: span 2` — 2 qator\n- `grid-column: 1 / -1` — butun kenglik\n\nChiziqlar ustunlar orasidagi chegaralar: 3 ustunli gridda 4 ta chiziq bor.",
        "Grid-элемент можно растянуть на несколько ячеек:\n- `grid-column: span 2` — занимает 2 столбца\n- `grid-column: 1 / 3` — от 1-й линии до 3-й\n- `grid-row: span 2` — 2 строки\n- `grid-column: 1 / -1` — на всю ширину\n\nЛинии — это границы между столбцами: в сетке из 3 столбцов 4 линии.",
        "A grid item can span several cells:\n- `grid-column: span 2` — takes 2 columns\n- `grid-column: 1 / 3` — from line 1 to line 3\n- `grid-row: span 2` — 2 rows\n- `grid-column: 1 / -1` — full width\n\nLines are the boundaries between columns: a 3-column grid has 4 lines.",
      ],
      {
        ex: `<div class="g">
  <div class="wide">Keng</div><div>B</div><div>C</div><div>D</div>
</div>
<style>
  .g { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .g div { background: #f59e0b; padding: 12px; }
  .wide { grid-column: span 2; }
</style>`,
        ch: ch({
          i: ['Birinchi `.cell` (class `first`) butun qatorni egallasin: `grid-column: 1 / -1`.', 'Первая `.cell` (класс `first`) должна занять всю строку: `grid-column: 1 / -1`.', 'Make the first `.cell` (class `first`) span the whole row: `grid-column: 1 / -1`.'],
          s: { html: six.replace('<div class="cell">1</div>', '<div class="cell first">1</div>'), css: cellCss + '.grid { display: grid; grid-template-columns: repeat(3, 100px); gap: 10px; }\n.first {\n\n}\n' },
          sol: { html: six.replace('<div class="cell">1</div>', '<div class="cell first">1</div>'), css: cellCss + '.grid { display: grid; grid-template-columns: repeat(3, 100px); gap: 10px; }\n.first {\n  grid-column: 1 / -1;\n}\n' },
          tests: [[['first kengligi 320px', 'ширина first 320px', 'first is 320px wide'], "Math.round($('.first').getBoundingClientRect().width) === 320"]],
          rules: [['grid-column', 'grid-column', { t: 'css' }]],
        }),
        q: [
          mcq(['3 ustunli gridda nechta vertikal chiziq bor?', 'Сколько вертикальных линий в сетке из 3 столбцов?', 'How many vertical lines does a 3-column grid have?'], ['2', '3', '4', '6'], 2, ['n ustun → n+1 chiziq.', 'n столбцов → n+1 линия.', 'n columns → n+1 lines.']),
          tf(['`grid-column: span 2` element 2 ustun egallashini bildiradi.', '`grid-column: span 2` значит, что элемент займёт 2 столбца.', '`grid-column: span 2` means the item takes 2 columns.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
        ],
      }
    ),
    lesson(
      'grid-areas',
      ['grid-template-areas', 'grid-template-areas', 'grid-template-areas'],
      [
        "Sahifa layoutini \"rasm\" kabi chizish mumkin:\n```\ngrid-template-areas:\n  \"header header\"\n  \"side   main\"\n  \"footer footer\";\n```\nKeyin har bir elementga nom beriladi: `header { grid-area: header; }`. Bu usul layoutni o'qishni juda oson qiladi.",
        "Раскладку страницы можно «нарисовать»:\n```\ngrid-template-areas:\n  \"header header\"\n  \"side   main\"\n  \"footer footer\";\n```\nЗатем каждому элементу задаётся имя: `header { grid-area: header; }`. Так раскладку очень легко читать.",
        "You can \"draw\" a page layout:\n```\ngrid-template-areas:\n  \"header header\"\n  \"side   main\"\n  \"footer footer\";\n```\nThen name each element: `header { grid-area: header; }`. This makes layouts very easy to read.",
      ],
      {
        ex: `<div class="page">
  <header>Header</header><aside>Side</aside><main>Main</main><footer>Footer</footer>
</div>
<style>
  .page { display: grid; grid-template-columns: 120px 1fr; gap: 6px;
    grid-template-areas: "header header" "side main" "footer footer"; }
  header { grid-area: header; } aside { grid-area: side; }
  main { grid-area: main; } footer { grid-area: footer; }
  .page > * { background: #7c5cfc33; padding: 12px; }
</style>`,
        ch: ch({
          i: ['`.page` uchun area lar yozilgan. `header`, `aside`, `main` elementlariga mos `grid-area` bering, shunda header butun kenglikda bo\'ladi.', 'Области для `.page` уже заданы. Назначьте `grid-area` элементам `header`, `aside`, `main`, чтобы header занял всю ширину.', 'The areas for `.page` are defined. Assign `grid-area` to `header`, `aside` and `main` so the header spans the full width.'],
          s: { html: '<div class="page">\n  <header>Header</header>\n  <aside>Side</aside>\n  <main>Main</main>\n</div>\n', css: '.page {\n  display: grid;\n  width: 400px;\n  grid-template-columns: 100px 1fr;\n  grid-template-areas:\n    "head head"\n    "side main";\n}\n' },
          sol: { html: '<div class="page">\n  <header>Header</header>\n  <aside>Side</aside>\n  <main>Main</main>\n</div>\n', css: '.page {\n  display: grid;\n  width: 400px;\n  grid-template-columns: 100px 1fr;\n  grid-template-areas:\n    "head head"\n    "side main";\n}\nheader { grid-area: head; }\naside { grid-area: side; }\nmain { grid-area: main; }\n' },
          tests: [
            [['header 400px kenglikda', 'header шириной 400px', 'header is 400px wide'], "Math.round($('header').getBoundingClientRect().width) === 400"],
            [['main 300px va aside yonida', 'main 300px рядом с aside', 'main is 300px next to aside'], "Math.round($('main').getBoundingClientRect().width) === 300 && Math.round($('main').getBoundingClientRect().top) === Math.round($('aside').getBoundingClientRect().top)"],
          ],
          rules: [['grid-area', 'grid-area', { t: 'css' }]],
          d: 'medium',
        }),
        q: [
          fill(['Elementni "main" maydoniga joylash:', 'Поместить элемент в область "main":', 'Place an item in the "main" area:'], 'main { ___: main; }', ['grid-area'], ['`grid-area`.', '`grid-area`.', '`grid-area`.']),
          tf(['Area nomlari qo\'shtirnoqli satrlarda yoziladi.', 'Имена областей пишутся в строках в кавычках.', 'Area names are written in quoted strings.'], true, ['Har bir qator — alohida satr.', 'Каждая строка сетки — отдельная строка в кавычках.', 'Each row is its own quoted string.']),
        ],
      }
    ),
    lesson(
      'position',
      ['Position', 'Position', 'Position'],
      [
        "`position` elementni oddiy oqimdan chiqarib aniq joylashtiradi:\n- `static` — standart\n- `relative` — o'z joyiga nisbatan siljiydi (`top`, `left`...); farzandlar uchun **tayanch** bo'ladi\n- `absolute` — eng yaqin `relative` ota-onaga nisbatan; oqimdan chiqadi\n- `fixed` — ekranga nisbatan (scrollda ham qimirlamaydi)\n- `sticky` — scroll qilinganda yopishib qoladi\n\n`z-index` — ustma-ust tushganda qaysi biri yuqorida.",
        "`position` выводит элемент из обычного потока для точного размещения:\n- `static` — по умолчанию\n- `relative` — сдвиг относительно своего места (`top`, `left`...); становится **опорой** для потомков\n- `absolute` — относительно ближайшего `relative`-родителя; выпадает из потока\n- `fixed` — относительно экрана (не двигается при прокрутке)\n- `sticky` — «прилипает» при прокрутке\n\n`z-index` — кто сверху при наложении.",
        "`position` takes an element out of normal flow for precise placement:\n- `static` — the default\n- `relative` — offset from its own spot (`top`, `left`...); becomes the **anchor** for children\n- `absolute` — relative to the nearest `relative` parent; leaves the flow\n- `fixed` — relative to the viewport (stays put on scroll)\n- `sticky` — sticks while scrolling\n\n`z-index` decides which overlaps on top.",
      ],
      {
        ex: `<div class="card">
  Kartochka
  <span class="badge">YANGI</span>
</div>
<style>
  .card { position: relative; width: 180px; padding: 24px; background: #151d32; color: white; border-radius: 12px; }
  .badge { position: absolute; top: -8px; right: -8px; background: #ef4444; padding: 2px 8px; border-radius: 99px; font-size: 12px; }
</style>`,
        ch: ch({
          i: ['`.badge` ni `.card` ning **yuqori o\'ng** burchagiga joylang: kartaga `position: relative`, badge ga `position: absolute; top: 0; right: 0`.', 'Поместите `.badge` в **правый верхний** угол `.card`: карточке `position: relative`, бейджу `position: absolute; top: 0; right: 0`.', 'Pin `.badge` to the **top-right** corner of `.card`: `position: relative` on the card, `position: absolute; top: 0; right: 0` on the badge.'],
          s: { html: '<div class="card">\n  Kartochka\n  <span class="badge">1</span>\n</div>\n', css: '.card { width: 200px; height: 100px; background: #eee; }\n.badge { background: red; color: white; }\n' },
          sol: { html: '<div class="card">\n  Kartochka\n  <span class="badge">1</span>\n</div>\n', css: '.card { width: 200px; height: 100px; background: #eee; position: relative; }\n.badge { background: red; color: white; position: absolute; top: 0; right: 0; }\n' },
          tests: [[['badge yuqori o\'ng burchakda', 'badge в правом верхнем углу', 'badge is at the top-right'], "(() => { const c = $('.card').getBoundingClientRect(); const b = $('.badge').getBoundingClientRect(); return Math.abs(b.top - c.top) <= 1 && Math.abs(b.right - c.right) <= 1; })()"]],
          rules: [['absolute', 'absolute', { t: 'css' }], ['relative', 'relative', { t: 'css' }]],
          d: 'medium',
        }),
        q: [
          mcq(['Scrollda ham ekranda qotib turadi:', 'Остаётся на месте при прокрутке:', 'Stays in place while scrolling:'], ['absolute', 'relative', 'fixed', 'static'], 2, ['`fixed` — ekranga nisbatan.', '`fixed` — относительно экрана.', '`fixed` is relative to the viewport.']),
          mcq(['`absolute` element nimaga nisbatan joylashadi?', 'Относительно чего позиционируется `absolute`?', 'What is an `absolute` element positioned relative to?'], [['Eng yaqin pozitsiyalangan ota-onaga', 'Ближайшего позиционированного предка', 'The nearest positioned ancestor'], ['Har doim body ga', 'Всегда body', 'Always body'], ['O\'z joyiga', 'Своего места', 'Its own spot']], 0, ['`relative`/`absolute`/`fixed` ota-ona tayanch bo\'ladi.', 'Опорой становится предок с relative/absolute/fixed.', 'An ancestor with relative/absolute/fixed is the anchor.'], { d: 'medium' }),
        ],
      }
    ),
  ],
  [
    mcq(['Grid ni yoqish:', 'Включить Grid:', 'Enable Grid:'], ['display: grid', 'grid: on', 'layout: grid', 'display: table'], 0, ['`display: grid`.', '`display: grid`.', '`display: grid`.']),
    out(['Ustunlar (konteyner 400px)?', 'Столбцы (контейнер 400px)?', 'Columns (400px container)?'], 'grid-template-columns: 100px 1fr;', ['100px 300px'], ['1fr qolgan 300px ni oladi.', '1fr забирает оставшиеся 300px.', '1fr takes the remaining 300px.'], { d: 'medium' }),
    match(['Position va tayanch', 'Position и опора', 'Position and reference'], [['fixed', 'viewport'], ['absolute', 'positioned parent'], ['relative', 'own place']], ['fixed — ekran, absolute — ota, relative — o\'z joyi.', 'fixed — экран, absolute — родитель, relative — своё место.', 'fixed → viewport, absolute → parent, relative → itself.']),
    tf(['`fr` birligi Flexboxda ham ishlaydi.', 'Единица `fr` работает и во Flexbox.', 'The `fr` unit also works in Flexbox.'], false, ['`fr` — faqat Grid uchun.', '`fr` — только для Grid.', '`fr` is Grid-only.'], { d: 'medium' }),
    fill(['Butun qatorni egallash:', 'Занять всю строку:', 'Span the full row:'], 'grid-column: 1 / ___;', ['-1'], ['`-1` — oxirgi chiziq.', '`-1` — последняя линия.', '`-1` is the last line.']),
    bug(['Nega badge kartochka burchagida emas, sahifa burchagida?', 'Почему badge в углу страницы, а не карточки?', 'Why is the badge in the page corner, not the card corner?'], '.card { width: 200px; }\n.badge { position: absolute; top: 0; right: 0; }', [['.card da position: relative yo\'q', 'У .card нет position: relative', '.card lacks position: relative'], ['top xato', 'Ошибка в top', 'top is wrong'], ['absolute o\'rniga fixed kerak', 'Нужен fixed вместо absolute', 'Should be fixed instead']], 0, ['Tayanch uchun ota-onaga `position: relative` kerak.', 'Родителю нужен `position: relative` как опора.', 'The parent needs `position: relative` as the anchor.']),
  ]
);
