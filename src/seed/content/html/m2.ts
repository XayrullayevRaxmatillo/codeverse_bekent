import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

export default mod(
  'html-structure',
  ["Tuzilma: ro'yxatlar, jadvallar, semantika", 'Структура: списки, таблицы, семантика', 'Structure: lists, tables, semantics'],
  ["Ma'lumotni tartibli va ma'noli joylashtirishni o'rganamiz.", 'Учимся размещать информацию упорядоченно и осмысленно.', 'Learn to organize content in a clear, meaningful way.'],
  [
    lesson(
      'lists',
      ["Ro'yxatlar", 'Списки', 'Lists'],
      [
        "Ikki asosiy ro'yxat turi bor:\n- `<ul>` — **tartibsiz** ro'yxat (nuqtalar bilan)\n- `<ol>` — **tartibli** ro'yxat (raqamlar bilan)\n\nHar bir band `<li>` (list item) ichida yoziladi. Ro'yxatlar menyular, qadamlar va xususiyatlar uchun ishlatiladi. Ro'yxat ichiga yana ro'yxat joylash mumkin.",
        "Есть два основных вида списков:\n- `<ul>` — **неупорядоченный** список (с точками)\n- `<ol>` — **упорядоченный** список (с номерами)\n\nКаждый пункт пишется в `<li>` (list item). Списки используют для меню, шагов и перечней. Списки можно вкладывать друг в друга.",
        "There are two main list types:\n- `<ul>` — an **unordered** list (bullets)\n- `<ol>` — an **ordered** list (numbers)\n\nEach item goes inside `<li>` (list item). Lists are used for menus, steps and features. Lists can be nested.",
      ],
      {
        ex: `<h3>Xarid ro'yxati</h3>
<ul>
  <li>Non</li>
  <li>Sut</li>
  <li>Olma</li>
</ul>

<h3>Choy damlash</h3>
<ol>
  <li>Suvni qaynating</li>
  <li>Choynakka choy soling</li>
  <li>5 daqiqa kuting</li>
</ol>`,
        ch: ch({
          i: ["Kamida **3 ta** bandli tartibli ro'yxat (`<ol>`) yarating — ertalabki ishlaringiz.", 'Создайте упорядоченный список (`<ol>`) минимум из **3** пунктов — ваши утренние дела.', 'Create an ordered list (`<ol>`) with at least **3** items — your morning routine.'],
          s: { html: '' },
          sol: { html: '<ol>\n  <li>Uyg\'onish</li>\n  <li>Nonushta</li>\n  <li>Kod yozish</li>\n</ol>\n' },
          tests: [
            [['<ol> mavjud', 'Есть <ol>', 'There is an <ol>'], "exists('ol')"],
            [['Kamida 3 ta <li>', 'Минимум 3 <li>', 'At least 3 <li>'], "$$('ol > li').length >= 3"],
          ],
          rules: [['<ol', 'ol', { t: 'html' }]],
        }),
        q: [
          mcq(['Raqamlangan ro\'yxat qaysi teg?', 'Какой тег создаёт нумерованный список?', 'Which tag makes a numbered list?'], ['<ul>', '<ol>', '<li>', '<dl>'], 1, ['`<ol>` — ordered list.', '`<ol>` — ordered list.', '`<ol>` means ordered list.']),
          out(['Nechta band ko\'rinadi?', 'Сколько пунктов будет видно?', 'How many items will be shown?'], '<ul>\n  <li>A</li>\n  <li>B</li>\n</ul>\n<ul>\n  <li>C</li>\n</ul>', ['3'], ['Ikki ro\'yxatda jami 3 ta `<li>`.', 'В двух списках всего 3 `<li>`.', 'Two lists, 3 `<li>` in total.']),
        ],
      }
    ),
    lesson(
      'tables',
      ['Jadvallar', 'Таблицы', 'Tables'],
      [
        "Jadval **tabular** ma'lumot uchun: dars jadvali, narxlar, natijalar.\n- `<table>` — jadval\n- `<tr>` — qator (table row)\n- `<th>` — sarlavha katakchasi (header)\n- `<td>` — oddiy katakcha (data)\n- `<caption>` — jadval nomi\n\nSarlavhalarni `<thead>`, ma'lumotlarni `<tbody>` ichiga olish tuzilmani aniqroq qiladi. Jadvalni sahifa joylashuvi (layout) uchun ishlatmang!",
        "Таблица — для **табличных** данных: расписание, цены, результаты.\n- `<table>` — таблица\n- `<tr>` — строка (table row)\n- `<th>` — ячейка-заголовок (header)\n- `<td>` — обычная ячейка (data)\n- `<caption>` — название таблицы\n\nЗаголовки удобно помещать в `<thead>`, данные — в `<tbody>`. Не используйте таблицы для вёрстки страницы!",
        "A table is for **tabular** data: schedules, prices, results.\n- `<table>` — the table\n- `<tr>` — a row (table row)\n- `<th>` — a header cell\n- `<td>` — a data cell\n- `<caption>` — the table title\n\nPut headers in `<thead>` and data in `<tbody>` for clearer structure. Don't use tables for page layout!",
      ],
      {
        ex: `<table border="1">
  <caption>Dars jadvali</caption>
  <thead>
    <tr><th>Kun</th><th>Fan</th></tr>
  </thead>
  <tbody>
    <tr><td>Dushanba</td><td>HTML</td></tr>
    <tr><td>Seshanba</td><td>CSS</td></tr>
  </tbody>
</table>`,
        ch: ch({
          i: ["Jadval yarating: sarlavha qatorida 2 ta `<th>` (**Mahsulot**, **Narx**) va kamida 2 ta ma'lumot qatori (`<td>`).", 'Создайте таблицу: в строке заголовков 2 `<th>` (**Mahsulot**, **Narx**) и минимум 2 строки данных (`<td>`).', 'Create a table: a header row with 2 `<th>` (**Mahsulot**, **Narx**) and at least 2 data rows (`<td>`).'],
          s: { html: '<table>\n</table>\n' },
          sol: { html: '<table>\n  <tr><th>Mahsulot</th><th>Narx</th></tr>\n  <tr><td>Non</td><td>4000</td></tr>\n  <tr><td>Sut</td><td>12000</td></tr>\n</table>\n' },
          tests: [
            [['2 ta <th>: Mahsulot, Narx', '2 <th>: Mahsulot, Narx', '2 <th>: Mahsulot, Narx'], "$$('th').map(t => t.textContent.trim()).join('|') === 'Mahsulot|Narx'"],
            [['Kamida 2 ta ma\'lumot qatori', 'Минимум 2 строки данных', 'At least 2 data rows'], "$$('tr').filter(r => r.querySelectorAll('td').length >= 2).length >= 2"],
          ],
          rules: [['<th', 'th', { t: 'html' }], ['<td', 'td', { t: 'html' }]],
        }),
        q: [
          match(['Teg va vazifasi', 'Тег и назначение', 'Tag and role'], [['<tr>', 'row'], ['<td>', 'cell'], ['<th>', 'header cell']], ['tr — qator, td — katakcha, th — sarlavha katakchasi.', 'tr — строка, td — ячейка, th — ячейка-заголовок.', 'tr is a row, td a cell, th a header cell.']),
          tf(['Jadvallar sahifa joylashuvi (layout) uchun eng yaxshi tanlov.', 'Таблицы — лучший выбор для вёрстки страницы.', 'Tables are the best choice for page layout.'], false, ['Layout uchun CSS (Flexbox/Grid) ishlatiladi.', 'Для вёрстки используют CSS (Flexbox/Grid).', 'Use CSS (Flexbox/Grid) for layout.']),
        ],
      }
    ),
    lesson(
      'semantic-html',
      ['Semantik HTML', 'Семантический HTML', 'Semantic HTML'],
      [
        "Semantik teglar kontentning **ma'nosini** bildiradi:\n- `<header>` — sahifa yoki bo'lim boshi\n- `<nav>` — navigatsiya havolalari\n- `<main>` — asosiy kontent (sahifada bitta)\n- `<section>` — mavzuli bo'lim\n- `<article>` — mustaqil maqola, post\n- `<aside>` — yon ma'lumot\n- `<footer>` — pastki qism\n\nSemantika qidiruv tizimlari (SEO) va ekran o'quvchilar uchun juda muhim. Hamma narsani `<div>` bilan qurish — yomon odat.",
        "Семантические теги выражают **смысл** контента:\n- `<header>` — шапка страницы или раздела\n- `<nav>` — навигационные ссылки\n- `<main>` — основной контент (один на странице)\n- `<section>` — тематический раздел\n- `<article>` — самостоятельная статья, пост\n- `<aside>` — боковая информация\n- `<footer>` — подвал\n\nСемантика важна для поисковиков (SEO) и скринридеров. Строить всё из `<div>` — плохая привычка.",
        "Semantic tags express the **meaning** of content:\n- `<header>` — the top of a page or section\n- `<nav>` — navigation links\n- `<main>` — the main content (one per page)\n- `<section>` — a thematic section\n- `<article>` — a self-contained article or post\n- `<aside>` — side information\n- `<footer>` — the bottom part\n\nSemantics matter for search engines (SEO) and screen readers. Building everything from `<div>` is a bad habit.",
      ],
      {
        ex: `<header>
  <h1>Mening blogim</h1>
  <nav>
    <a href="#">Bosh sahifa</a>
    <a href="#">Maqolalar</a>
  </nav>
</header>
<main>
  <article>
    <h2>HTML nega muhim?</h2>
    <p>Chunki u har bir saytning asosi.</p>
  </article>
</main>
<footer>© 2026</footer>`,
        ch: ch({
          i: ['Sahifa skeletini yarating: `<header>` (ichida `<nav>`), `<main>` (ichida kamida bitta `<article>`) va `<footer>`.', 'Создайте каркас страницы: `<header>` (внутри `<nav>`), `<main>` (внутри минимум один `<article>`) и `<footer>`.', 'Build a page skeleton: `<header>` (with a `<nav>` inside), `<main>` (with at least one `<article>`) and `<footer>`.'],
          s: { html: '<div class="header"></div>\n<div class="content"></div>\n<div class="footer"></div>\n' },
          sol: { html: '<header>\n  <nav><a href="#">Bosh sahifa</a></nav>\n</header>\n<main>\n  <article><h2>Post</h2><p>Matn</p></article>\n</main>\n<footer>© 2026</footer>\n' },
          tests: [
            [['header > nav', 'header > nav', 'header > nav'], "exists('header nav')"],
            [['main > article', 'main > article', 'main > article'], "exists('main article')"],
            [['footer mavjud', 'Есть footer', 'footer exists'], "exists('footer')"],
          ],
          rules: [['<header', 'header', { t: 'html' }], ['<main', 'main', { t: 'html' }], ['<footer', 'footer', { t: 'html' }]],
        }),
        q: [
          mcq(['Asosiy kontent uchun teg (sahifada bitta):', 'Тег основного контента (один на странице):', 'The main content tag (one per page):'], ['<section>', '<main>', '<body>', '<article>'], 1, ['`<main>` — asosiy kontent.', '`<main>` — основной контент.', '`<main>` holds the main content.']),
          mcq(['Blog posti uchun eng mos teg:', 'Самый подходящий тег для поста блога:', 'Best tag for a blog post:'], ['<div>', '<aside>', '<article>', '<nav>'], 2, ['`<article>` — mustaqil kontent.', '`<article>` — самостоятельный контент.', '`<article>` is self-contained content.']),
        ],
      }
    ),
    lesson(
      'attributes-class-id',
      ['div, span, class va id', 'div, span, class и id', 'div, span, class and id'],
      [
        "`<div>` — blok konteyner (yangi qatordan boshlanadi), `<span>` — qator ichidagi konteyner. Ularning o'z ma'nosi yo'q — semantik teg mos kelmaganda ishlatiladi.\n\nIkki universal atribut:\n- `class` — elementlar **guruhi** nomi (bir nechta elementda takrorlanadi, bir elementda bir nechta class bo'lishi mumkin: `class=\"card big\"`)\n- `id` — **noyob** nom (sahifada faqat bitta)\n\nCSS va JavaScript elementlarni aynan shu nomlar orqali topadi.",
        "`<div>` — блочный контейнер (с новой строки), `<span>` — строчный контейнер. Своего смысла у них нет — их используют, когда семантический тег не подходит.\n\nДва универсальных атрибута:\n- `class` — имя **группы** элементов (повторяется, у элемента может быть несколько классов: `class=\"card big\"`)\n- `id` — **уникальное** имя (одно на странице)\n\nCSS и JavaScript находят элементы именно по этим именам.",
        "`<div>` is a block container (starts on a new line), `<span>` is an inline container. They have no meaning of their own — use them when no semantic tag fits.\n\nTwo universal attributes:\n- `class` — a **group** name (reusable; an element can have several: `class=\"card big\"`)\n- `id` — a **unique** name (only one per page)\n\nCSS and JavaScript find elements by these names.",
      ],
      {
        ex: `<div class="card" id="user-1">
  <h3>Aziza</h3>
  <p>Daraja: <span class="badge">Coder</span></p>
</div>
<div class="card">
  <h3>Bekzod</h3>
  <p>Daraja: <span class="badge">Explorer</span></p>
</div>`,
        ch: ch({
          i: ['`id="profile"` va `class="card"` bo\'lgan `<div>` yarating. Ichida `class="name"` bo\'lgan `<span>` bo\'lsin.', 'Создайте `<div>` с `id="profile"` и `class="card"`. Внутри — `<span>` с `class="name"`.', 'Create a `<div>` with `id="profile"` and `class="card"`. Inside, add a `<span>` with `class="name"`.'],
          s: { html: '<div>\n</div>\n' },
          sol: { html: '<div id="profile" class="card">\n  <span class="name">Aziza</span>\n</div>\n' },
          tests: [
            [['div#profile.card', 'div#profile.card', 'div#profile.card'], "exists('div#profile.card')"],
            [['ichida span.name', 'внутри span.name', 'span.name inside'], "exists('#profile span.name')"],
          ],
          rules: [['id\\s*=\\s*["\']profile', 'id', { t: 'html' }], ['class\\s*=\\s*["\'][^"\']*card', 'class', { t: 'html' }]],
        }),
        q: [
          tf(['Bitta sahifada bir xil `id` bir nechta elementda bo\'lishi mumkin.', 'Один и тот же `id` может быть у нескольких элементов на странице.', 'The same `id` can be used on several elements of a page.'], false, ['`id` noyob bo\'lishi shart; guruh uchun `class`.', '`id` должен быть уникальным; для группы — `class`.', '`id` must be unique; use `class` for groups.']),
          mcq(['Qaysi biri qator ichidagi (inline) konteyner?', 'Какой из них — строчный (inline) контейнер?', 'Which is an inline container?'], ['<div>', '<span>', '<section>', '<p>'], 1, ['`<span>` qator ichida qoladi.', '`<span>` остаётся внутри строки.', '`<span>` stays within the line.']),
        ],
      }
    ),
    lesson(
      'media',
      ['Audio va video', 'Аудио и видео', 'Audio and video'],
      [
        "HTML5 da media fayllar uchun maxsus teglar bor:\n- `<video src=\"...\" controls>` — video pleer\n- `<audio src=\"...\" controls>` — audio pleer\n\n`controls` atributi o'ynatish tugmalarini ko'rsatadi. Boshqa foydali atributlar: `autoplay`, `muted`, `loop`, `poster` (video muqovasi).\n\nAgar brauzer formatni qo'llamasa, teg ichidagi matn ko'rsatiladi.",
        "В HTML5 есть специальные теги для медиа:\n- `<video src=\"...\" controls>` — видеоплеер\n- `<audio src=\"...\" controls>` — аудиоплеер\n\nАтрибут `controls` показывает кнопки управления. Другие полезные атрибуты: `autoplay`, `muted`, `loop`, `poster` (обложка видео).\n\nЕсли браузер не поддерживает формат, показывается текст внутри тега.",
        "HTML5 has dedicated media tags:\n- `<video src=\"...\" controls>` — a video player\n- `<audio src=\"...\" controls>` — an audio player\n\nThe `controls` attribute shows playback buttons. Other useful attributes: `autoplay`, `muted`, `loop`, `poster` (video cover).\n\nIf the browser can't play the format, the text inside the tag is shown.",
      ],
      {
        ex: `<video
  src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  controls
  width="320"
  poster="https://picsum.photos/seed/flower/320/180"
>
  Brauzeringiz videoni qo'llamaydi.
</video>`,
        ch: ch({
          i: ['`controls` va `muted` atributlari bo\'lgan `<video>` qo\'shing (`src` istalgan .mp4 manzil).', 'Добавьте `<video>` с атрибутами `controls` и `muted` (`src` — любой адрес .mp4).', 'Add a `<video>` with the `controls` and `muted` attributes (`src` can be any .mp4 URL).'],
          s: { html: '' },
          sol: { html: '<video src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" controls muted width="320"></video>\n' },
          tests: [
            [['<video> mavjud', 'Есть <video>', 'There is a <video>'], "exists('video')"],
            [['controls atributi', 'Атрибут controls', 'controls attribute'], "$('video').hasAttribute('controls')"],
            [['muted atributi', 'Атрибут muted', 'muted attribute'], "$('video').hasAttribute('muted')"],
          ],
          rules: [['<video[^>]*controls', 'controls', { t: 'html' }]],
        }),
        q: [
          mcq(['Pleer tugmalarini qaysi atribut ko\'rsatadi?', 'Какой атрибут показывает кнопки плеера?', 'Which attribute shows the player buttons?'], ['buttons', 'controls', 'player', 'show'], 1, ['`controls` — boshqaruv tugmalari.', '`controls` — кнопки управления.', '`controls` shows the controls.']),
          fill(['Audio teg:', 'Тег аудио:', 'The audio tag:'], '<___ src="qo\'shiq.mp3" controls></___>', ['audio'], ['`<audio>` — audio pleer.', '`<audio>` — аудиоплеер.', '`<audio>` is the audio player.']),
        ],
      }
    ),
  ],
  [
    mcq(['Tartibsiz ro\'yxat teg:', 'Тег маркированного списка:', 'Unordered list tag:'], ['<ol>', '<ul>', '<list>', '<li>'], 1, ['`<ul>` — unordered list.', '`<ul>` — unordered list.', '`<ul>` — unordered list.']),
    mcq(['Jadval qatori qaysi teg?', 'Какой тег — строка таблицы?', 'Which tag is a table row?'], ['<td>', '<th>', '<tr>', '<row>'], 2, ['`<tr>` — table row.', '`<tr>` — table row.', '`<tr>` — table row.']),
    tf(['`<main>` tegi sahifada faqat bitta bo\'lishi kerak.', 'Тег `<main>` должен быть один на странице.', 'There should be only one `<main>` per page.'], true, ['Asosiy kontent bitta bo\'ladi.', 'Основной контент один.', 'There is one main content.']),
    match(['Moslang', 'Сопоставьте', 'Match'], [['<nav>', 'links'], ['<footer>', 'bottom'], ['<header>', 'top']], ['nav — havolalar, footer — pastki qism, header — yuqori qism.', 'nav — ссылки, footer — низ, header — верх.', 'nav holds links, footer is the bottom, header the top.']),
    bug(['Xato qayerda?', 'Где ошибка?', 'Where is the bug?'], '<div id="box"></div>\n<div id="box"></div>', [['id takrorlangan', 'id повторяется', 'The id is duplicated'], ['div yopilmagan', 'div не закрыт', 'div is not closed'], ['Xato yo\'q', 'Ошибки нет', 'No bug']], 0, ['`id` noyob bo\'lishi kerak — `class` ishlating.', '`id` должен быть уникальным — используйте `class`.', '`id` must be unique — use `class`.'], { d: 'medium' }),
    order(['Jadvalni tartiblang', 'Упорядочите таблицу', 'Order the table'], ['<table>', '<tr>', '<td>Olma</td>', '</tr>', '</table>'], ['table → tr → td.', 'table → tr → td.', 'table → tr → td.'], { d: 'medium' }),
  ]
);
