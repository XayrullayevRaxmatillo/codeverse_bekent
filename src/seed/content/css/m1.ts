import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

export default mod(
  'css-basics',
  ['CSS asoslari', 'Основы CSS', 'CSS Basics'],
  ['Selektorlar, ranglar, matn va o\'lchov birliklari.', 'Селекторы, цвета, текст и единицы измерения.', 'Selectors, colors, text and units.'],
  [
    lesson(
      'what-is-css',
      ['CSS nima?', 'Что такое CSS?', 'What is CSS?'],
      [
        "**CSS** (Cascading Style Sheets) — sahifaning *ko'rinishi*: ranglar, shriftlar, joylashuv. HTML — skelet, CSS — kiyim.\n\nCSS qoidasi: **selektor** + **deklaratsiyalar bloki**.\n`h1 { color: red; }` — bu yerda `h1` selektor, `color` xususiyat (property), `red` qiymat (value). Har bir deklaratsiya `;` bilan tugaydi.\n\nCSS ni ulashning eng yaxshi usuli — alohida fayl: `<link rel=\"stylesheet\" href=\"style.css\">`.",
        "**CSS** (Cascading Style Sheets) — *внешний вид* страницы: цвета, шрифты, расположение. HTML — скелет, CSS — одежда.\n\nПравило CSS: **селектор** + **блок объявлений**.\n`h1 { color: red; }` — `h1` селектор, `color` свойство, `red` значение. Каждое объявление заканчивается `;`.\n\nЛучший способ подключить CSS — отдельный файл: `<link rel=\"stylesheet\" href=\"style.css\">`.",
        "**CSS** (Cascading Style Sheets) is the *look* of a page: colors, fonts, layout. HTML is the skeleton, CSS is the clothing.\n\nA CSS rule is a **selector** + a **declaration block**.\n`h1 { color: red; }` — `h1` is the selector, `color` the property, `red` the value. Each declaration ends with `;`.\n\nThe best way to attach CSS is a separate file: `<link rel=\"stylesheet\" href=\"style.css\">`.",
      ],
      {
        ex: `<h1>Salom, CSS!</h1>
<p>Endi sahifa chiroyli bo'ladi.</p>

<style>
  h1 {
    color: #7c5cfc;
    font-size: 40px;
  }
  p {
    color: gray;
  }
</style>`,
        ch: ch({
          i: ['`h1` rangini **tomato** (`color: tomato`), `p` ni esa **navy** qiling.', 'Сделайте цвет `h1` **tomato** (`color: tomato`), а `p` — **navy**.', 'Make the `h1` color **tomato** (`color: tomato`) and the `p` **navy**.'],
          s: { html: '<h1>CSS o\'rmoni</h1>\n<p>Daraxtlar orasida kod yashiringan.</p>\n', css: '/* qoidalarni shu yerga yozing */\n' },
          sol: { html: '<h1>CSS o\'rmoni</h1>\n<p>Daraxtlar orasida kod yashiringan.</p>\n', css: 'h1 { color: tomato; }\np { color: navy; }\n' },
          tests: [
            [['h1 — tomato', 'h1 — tomato', 'h1 is tomato'], "css('h1', 'color') === 'rgb(255, 99, 71)'"],
            [['p — navy', 'p — navy', 'p is navy'], "css('p', 'color') === 'rgb(0, 0, 128)'"],
          ],
          rules: [['color\\s*:', 'color', { t: 'css' }]],
        }),
        q: [
          match(['Qoidaning qismlari: `p { color: red; }`', 'Части правила: `p { color: red; }`', 'Parts of the rule `p { color: red; }`'], [['p', 'selector'], ['color', 'property'], ['red', 'value']], ['Selektor → xususiyat → qiymat.', 'Селектор → свойство → значение.', 'Selector → property → value.']),
          fill(['CSS faylni ulash:', 'Подключение CSS-файла:', 'Attaching a CSS file:'], '<link rel="___" href="style.css">', ['stylesheet'], ['`rel="stylesheet"`.', '`rel="stylesheet"`.', '`rel="stylesheet"`.']),
        ],
      }
    ),
    lesson(
      'colors',
      ['Ranglar', 'Цвета', 'Colors'],
      [
        "CSS da rangni bir necha usulda yozish mumkin:\n- Nom: `red`, `tomato`, `navy`\n- HEX: `#ff0000`, qisqa `#f00`\n- RGB: `rgb(255, 0, 0)`; shaffoflik bilan `rgb(255 0 0 / 50%)`\n- HSL: `hsl(0, 100%, 50%)` — rang tusi, to'yinganlik, yorqinlik\n\n`color` — matn rangi, `background-color` — fon rangi. Matn va fon orasida yetarli **kontrast** bo'lsin!",
        "Цвет в CSS можно записать разными способами:\n- Имя: `red`, `tomato`, `navy`\n- HEX: `#ff0000`, коротко `#f00`\n- RGB: `rgb(255, 0, 0)`; с прозрачностью `rgb(255 0 0 / 50%)`\n- HSL: `hsl(0, 100%, 50%)` — тон, насыщенность, светлота\n\n`color` — цвет текста, `background-color` — цвет фона. Между текстом и фоном нужен достаточный **контраст**!",
        "Colors can be written in several ways:\n- Name: `red`, `tomato`, `navy`\n- HEX: `#ff0000`, short `#f00`\n- RGB: `rgb(255, 0, 0)`; with transparency `rgb(255 0 0 / 50%)`\n- HSL: `hsl(0, 100%, 50%)` — hue, saturation, lightness\n\n`color` is text color, `background-color` is background color. Keep enough **contrast** between them!",
      ],
      {
        ex: `<div class="card">Kosmik karta</div>
<style>
  .card {
    background-color: #151d32;
    color: #f8fafc;
    padding: 16px;
    border-left: 4px solid rgb(0, 212, 255);
  }
</style>`,
        ch: ch({
          i: ['`.badge` elementining fonini `#22c55e`, matn rangini `white` qiling.', 'Сделайте фон `.badge` цветом `#22c55e`, а текст — `white`.', 'Set the `.badge` background to `#22c55e` and its text color to `white`.'],
          s: { html: '<span class="badge">Yangi</span>\n', css: '.badge {\n\n}\n' },
          sol: { html: '<span class="badge">Yangi</span>\n', css: '.badge {\n  background-color: #22c55e;\n  color: white;\n}\n' },
          tests: [
            [['fon #22c55e', 'фон #22c55e', 'background #22c55e'], "css('.badge', 'background-color') === 'rgb(34, 197, 94)'"],
            [['matn oq', 'текст белый', 'text is white'], "css('.badge', 'color') === 'rgb(255, 255, 255)'"],
          ],
          rules: [['background', 'background', { t: 'css' }]],
        }),
        q: [
          mcq(['`#fff` qaysi rang?', 'Какой цвет `#fff`?', 'What color is `#fff`?'], [['Qora', 'Чёрный', 'Black'], ['Oq', 'Белый', 'White'], ['Qizil', 'Красный', 'Red']], 1, ['`#fff` = `#ffffff` = oq.', '`#fff` = `#ffffff` = белый.', '`#fff` = `#ffffff` = white.']),
          tf(['`color` xususiyati fon rangini o\'zgartiradi.', 'Свойство `color` меняет цвет фона.', 'The `color` property changes the background.'], false, ['Fon — `background-color`.', 'Фон — `background-color`.', 'Background is `background-color`.']),
        ],
      }
    ),
    lesson(
      'text-fonts',
      ['Matn va shriftlar', 'Текст и шрифты', 'Text and fonts'],
      [
        "Matnni bezash xususiyatlari:\n- `font-family` — shrift (zaxira bilan: `'Inter', sans-serif`)\n- `font-size` — o'lcham\n- `font-weight` — qalinlik (`400` oddiy, `700` qalin)\n- `line-height` — qatorlar oralig'i (o'qish uchun `1.5` yaxshi)\n- `text-align` — tekislash (`left`, `center`, `right`)\n- `text-transform` — `uppercase`, `lowercase`\n- `text-decoration` — `underline`, `none`",
        "Свойства оформления текста:\n- `font-family` — шрифт (с запасным: `'Inter', sans-serif`)\n- `font-size` — размер\n- `font-weight` — насыщенность (`400` обычный, `700` жирный)\n- `line-height` — межстрочный интервал (для чтения хорош `1.5`)\n- `text-align` — выравнивание (`left`, `center`, `right`)\n- `text-transform` — `uppercase`, `lowercase`\n- `text-decoration` — `underline`, `none`",
        "Text styling properties:\n- `font-family` — the font (with a fallback: `'Inter', sans-serif`)\n- `font-size` — size\n- `font-weight` — boldness (`400` normal, `700` bold)\n- `line-height` — line spacing (`1.5` reads well)\n- `text-align` — alignment (`left`, `center`, `right`)\n- `text-transform` — `uppercase`, `lowercase`\n- `text-decoration` — `underline`, `none`",
      ],
      {
        ex: `<h2 class="title">Yangiliklar</h2>
<p class="lead">CSS bilan matn ancha o'qishli bo'ladi.</p>
<style>
  .title { font-family: Georgia, serif; text-transform: uppercase; text-align: center; }
  .lead { font-size: 18px; line-height: 1.6; font-weight: 300; }
</style>`,
        ch: ch({
          i: ['`.title` ni markazga tekislang, `font-weight: 700` va `font-size: 32px` bering.', 'Выровняйте `.title` по центру, задайте `font-weight: 700` и `font-size: 32px`.', 'Center `.title`, and give it `font-weight: 700` and `font-size: 32px`.'],
          s: { html: '<h2 class="title">Kurslar</h2>\n', css: '.title {\n\n}\n' },
          sol: { html: '<h2 class="title">Kurslar</h2>\n', css: '.title {\n  text-align: center;\n  font-weight: 700;\n  font-size: 32px;\n}\n' },
          tests: [
            [['markazda', 'по центру', 'centered'], "css('.title', 'text-align') === 'center'"],
            [['font-weight 700', 'font-weight 700', 'font-weight 700'], "css('.title', 'font-weight') === '700'"],
            [['font-size 32px', 'font-size 32px', 'font-size 32px'], "css('.title', 'font-size') === '32px'"],
          ],
          rules: [['text-align', 'text-align', { t: 'css' }]],
        }),
        q: [
          mcq(['Matnni katta harflarga aylantirish:', 'Сделать текст заглавными буквами:', 'Make text uppercase:'], ['font-case: upper', 'text-transform: uppercase', 'text-style: caps', 'font-variant: big'], 1, ['`text-transform: uppercase`.', '`text-transform: uppercase`.', '`text-transform: uppercase`.']),
          tf(['`font-family` ga zaxira shrift yozish yaxshi amaliyot.', 'Указывать запасной шрифт в `font-family` — хорошая практика.', 'Adding a fallback font in `font-family` is good practice.'], true, ['Asosiy shrift yuklanmasa zaxirasi ishlaydi.', 'Если основной шрифт не загрузится, сработает запасной.', 'If the main font fails, the fallback is used.']),
        ],
      }
    ),
    lesson(
      'selectors',
      ['Selektorlar', 'Селекторы', 'Selectors'],
      [
        "Selektor — qaysi elementlarga uslub berishni aytadi:\n- `p` — teg bo'yicha\n- `.card` — class bo'yicha\n- `#logo` — id bo'yicha\n- `nav a` — avlod (nav ichidagi barcha `a`)\n- `ul > li` — bevosita farzand\n- `h1, h2` — guruh\n- `[type=\"email\"]` — atribut bo'yicha\n\n**Specifiklik:** id > class > teg. Bir xil kuchda keyingi yozilgan qoida g'olib (kaskad).",
        "Селектор указывает, к каким элементам применить стиль:\n- `p` — по тегу\n- `.card` — по классу\n- `#logo` — по id\n- `nav a` — потомки (все `a` внутри nav)\n- `ul > li` — прямые дочерние\n- `h1, h2` — группа\n- `[type=\"email\"]` — по атрибуту\n\n**Специфичность:** id > класс > тег. При равной силе побеждает правило, написанное позже (каскад).",
        "A selector says which elements to style:\n- `p` — by tag\n- `.card` — by class\n- `#logo` — by id\n- `nav a` — descendants (every `a` inside nav)\n- `ul > li` — direct children\n- `h1, h2` — a group\n- `[type=\"email\"]` — by attribute\n\n**Specificity:** id > class > tag. With equal strength, the later rule wins (the cascade).",
      ],
      {
        ex: `<nav><a href="#">Bosh</a><a href="#" class="active">Kurslar</a></nav>
<style>
  nav a { color: gray; margin-right: 12px; }
  nav a.active { color: #7c5cfc; font-weight: bold; }
</style>`,
        ch: ch({
          i: ['Faqat `.menu` ichidagi havolalarni `color: orange` qiling (tashqaridagi havola o\'zgarmasin).', 'Сделайте `color: orange` только для ссылок внутри `.menu` (внешняя ссылка не меняется).', 'Make only the links inside `.menu` `color: orange` (the outside link must not change).'],
          s: { html: '<div class="menu">\n  <a href="#">Bir</a>\n  <a href="#">Ikki</a>\n</div>\n<a href="#" id="out">Tashqarida</a>\n', css: '' },
          sol: { html: '<div class="menu">\n  <a href="#">Bir</a>\n  <a href="#">Ikki</a>\n</div>\n<a href="#" id="out">Tashqarida</a>\n', css: '.menu a { color: orange; }\n' },
          tests: [
            [['.menu a — orange', '.menu a — orange', '.menu a is orange'], "$$('.menu a').every(a => css(a, 'color') === 'rgb(255, 165, 0)')"],
            [['tashqi havola o\'zgarmagan', 'внешняя ссылка не изменилась', 'outside link unchanged'], "css('#out', 'color') !== 'rgb(255, 165, 0)'"],
          ],
          rules: [['\\.menu\\s+a', '.menu a', { t: 'css' }]],
        }),
        q: [
          mcq(['Eng kuchli (specifik) selektor:', 'Самый специфичный селектор:', 'The most specific selector:'], ['p', '.text', '#main', 'div p'], 2, ['id > class > teg.', 'id > класс > тег.', 'id > class > tag.']),
          out(['Matn qaysi rangda bo\'ladi?', 'Каким будет цвет текста?', 'What color will the text be?'], '<p class="x">Salom</p>\n<style>\n  p { color: red; }\n  .x { color: blue; }\n  p { color: green; }\n</style>', ['blue'], ['`.x` (class) teg selektorlaridan kuchliroq.', '`.x` (класс) сильнее селекторов тегов.', '`.x` (class) beats tag selectors.'], { d: 'medium' }),
        ],
      }
    ),
    lesson(
      'units',
      ["O'lchov birliklari", 'Единицы измерения', 'Units'],
      [
        "CSS dagi asosiy birliklar:\n- `px` — piksel, qat'iy o'lcham\n- `%` — ota elementga nisbatan\n- `em` — joriy shrift o'lchamiga nisbatan\n- `rem` — ildiz (`html`) shrift o'lchamiga nisbatan (odatda 16px) — **matn uchun eng yaxshi**\n- `vw` / `vh` — ekran kengligi/balandligining 1%\n\nMoslashuvchan (responsive) dizayn uchun `rem`, `%` va `vw` dan ko'proq foydalaning.",
        "Основные единицы CSS:\n- `px` — пиксели, фиксированный размер\n- `%` — относительно родителя\n- `em` — относительно текущего размера шрифта\n- `rem` — относительно корневого (`html`) шрифта (обычно 16px) — **лучше всего для текста**\n- `vw` / `vh` — 1% ширины/высоты экрана\n\nДля адаптивного дизайна чаще используйте `rem`, `%` и `vw`.",
        "Main CSS units:\n- `px` — pixels, a fixed size\n- `%` — relative to the parent\n- `em` — relative to the current font size\n- `rem` — relative to the root (`html`) font size (usually 16px) — **best for text**\n- `vw` / `vh` — 1% of the viewport width/height\n\nFor responsive design, prefer `rem`, `%` and `vw`.",
      ],
      {
        ex: `<div class="box">50% kenglik, 2rem matn</div>
<style>
  .box {
    width: 50%;
    font-size: 2rem;   /* 32px */
    padding: 1rem;     /* 16px */
    background: #00d4ff33;
  }
</style>`,
        ch: ch({
          i: ['`.box` ga `width: 50%` va `font-size: 1.5rem` bering (1rem = 16px).', 'Задайте `.box` `width: 50%` и `font-size: 1.5rem` (1rem = 16px).', 'Give `.box` `width: 50%` and `font-size: 1.5rem` (1rem = 16px).'],
          s: { html: '<div class="wrap" style="width: 400px">\n  <div class="box">Quti</div>\n</div>\n', css: '.box {\n\n}\n' },
          sol: { html: '<div class="wrap" style="width: 400px">\n  <div class="box">Quti</div>\n</div>\n', css: '.box {\n  width: 50%;\n  font-size: 1.5rem;\n}\n' },
          tests: [
            [['kenglik 200px (400 ning 50%)', 'ширина 200px (50% от 400)', 'width 200px (50% of 400)'], "$('.box').getBoundingClientRect().width === 200"],
            [['font-size 24px', 'font-size 24px', 'font-size 24px'], "css('.box', 'font-size') === '24px'"],
          ],
          rules: [['rem', 'rem', { t: 'css' }], ['%', '%', { t: 'css' }]],
        }),
        q: [
          out(['`html { font-size: 16px }` bo\'lsa, `2rem` necha piksel?', 'Если `html { font-size: 16px }`, сколько пикселей `2rem`?', 'If `html { font-size: 16px }`, how many pixels is `2rem`?'], '.title { font-size: 2rem; }', ['32px', '32'], ['2 × 16 = 32px.', '2 × 16 = 32px.', '2 × 16 = 32px.']),
          mcq(['Ekran kengligining 100% i:', '100% ширины экрана:', '100% of the viewport width:'], ['100%', '100vw', '100vh', '100rem'], 1, ['`vw` — viewport width.', '`vw` — viewport width.', '`vw` = viewport width.']),
        ],
      }
    ),
  ],
  [
    mcq(['CSS qoidasi qaysi belgilar ichida yoziladi?', 'В каких скобках пишется блок CSS-правила?', 'Which brackets wrap a CSS declaration block?'], ['( )', '[ ]', '{ }', '< >'], 2, ['`selektor { ... }`.', '`селектор { ... }`.', '`selector { ... }`.']),
    fill(['class selektori:', 'Селектор класса:', 'Class selector:'], '___card { padding: 8px; }', ['.'], ['Class oldidan nuqta.', 'Перед классом точка.', 'A dot before the class name.']),
    mcq(['`ul > li` nimani tanlaydi?', 'Что выбирает `ul > li`?', 'What does `ul > li` select?'], [['ul ning bevosita farzand li lari', 'Прямые дочерние li у ul', 'li that are direct children of ul'], ['Barcha li lar', 'Все li', 'All li'], ['li dan keyingi ul', 'ul после li', 'ul after li']], 0, ['`>` — bevosita farzand.', '`>` — прямой потомок.', '`>` means direct child.']),
    tf(['`rem` ota element shriftiga nisbatan hisoblanadi.', '`rem` считается от шрифта родителя.', '`rem` is relative to the parent font size.'], false, ['`rem` — ildiz (html) ga nisbatan; ota-ona — `em`.', '`rem` — от корня (html); от родителя — `em`.', '`rem` is relative to the root (html); `em` to the parent.'], { d: 'medium' }),
    bug(['Nega uslub ishlamayapti?', 'Почему стиль не работает?', "Why doesn't the style work?"], 'h1 {\n  color: red\n  font-size: 40px;\n}', [['color dan keyin ; yo\'q', 'Нет ; после color', 'Missing ; after color'], ['h1 selektori xato', 'Ошибка в селекторе h1', 'Wrong h1 selector'], ['px yozilmaydi', 'px не пишется', 'px is not allowed']], 0, ['Deklaratsiyalar `;` bilan ajratiladi.', 'Объявления разделяются `;`.', 'Declarations are separated by `;`.']),
    match(['Birlik va asos', 'Единица и основа', 'Unit and basis'], [['rem', 'root font'], ['%', 'parent'], ['vw', 'viewport']], ['rem — html shrifti, % — ota, vw — ekran.', 'rem — шрифт html, % — родитель, vw — экран.', 'rem → root font, % → parent, vw → viewport.'], { d: 'medium' }),
  ]
);
