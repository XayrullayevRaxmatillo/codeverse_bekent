import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

export default mod(
  'html-basics',
  ['HTML asoslari', 'Основы HTML', 'HTML Basics'],
  ['Veb-sahifa qanday tuzilishini va birinchi teglarni o\'rganamiz.', 'Узнаём, как устроена веб-страница, и пишем первые теги.', 'Learn how a web page is built and write your first tags.'],
  [
    lesson(
      'what-is-html',
      ['HTML nima?', 'Что такое HTML?', 'What is HTML?'],
      [
        "**HTML** (HyperText Markup Language) — veb-sahifaning *skeleti*. U dasturlash tili emas, balki **belgilash tili**: matnga teglar yordamida ma'no beramiz.\n\nTeg burchakli qavslarda yoziladi: `<p>` ochiladi, `</p>` yopiladi. Ular orasidagi hamma narsa — **element**.\n\nHar bir HTML hujjat quyidagi tuzilishga ega:\n- `<!DOCTYPE html>` — brauzerga bu HTML5 ekanini aytadi\n- `<html>` — ildiz element\n- `<head>` — sahifa haqida ma'lumot (sarlavha, kodlash)\n- `<body>` — ekranda ko'rinadigan barcha narsa",
        "**HTML** (HyperText Markup Language) — *скелет* веб-страницы. Это не язык программирования, а **язык разметки**: с помощью тегов мы придаём тексту смысл.\n\nТег пишется в угловых скобках: `<p>` открывает, `</p>` закрывает. Всё между ними — **элемент**.\n\nУ каждого HTML-документа есть структура:\n- `<!DOCTYPE html>` — сообщает браузеру, что это HTML5\n- `<html>` — корневой элемент\n- `<head>` — сведения о странице (заголовок, кодировка)\n- `<body>` — всё, что видно на экране",
        "**HTML** (HyperText Markup Language) is the *skeleton* of a web page. It is not a programming language but a **markup language**: tags give meaning to text.\n\nA tag is written in angle brackets: `<p>` opens, `</p>` closes. Everything between them is an **element**.\n\nEvery HTML document has this structure:\n- `<!DOCTYPE html>` — tells the browser this is HTML5\n- `<html>` — the root element\n- `<head>` — information about the page (title, encoding)\n- `<body>` — everything visible on the screen",
      ],
      {
        min: 6,
        ex: `<!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="UTF-8">
    <title>Mening sahifam</title>
  </head>
  <body>
    <h1>Salom, dunyo!</h1>
    <p>Bu mening birinchi veb-sahifam.</p>
  </body>
</html>`,
        ch: ch({
          i: [
            "`<body>` ichiga `<h1>` sarlavha qo'shing va unga **Salom, CODEVERSE!** deb yozing.",
            "Добавьте в `<body>` заголовок `<h1>` с текстом **Salom, CODEVERSE!**.",
            "Add an `<h1>` heading inside `<body>` with the text **Salom, CODEVERSE!**.",
          ],
          s: { html: '<!-- h1 tegini shu yerga yozing -->\n' },
          sol: { html: '<h1>Salom, CODEVERSE!</h1>\n' },
          tests: [
            [['Sahifada <h1> bor', 'На странице есть <h1>', 'The page has an <h1>'], "exists('h1')"],
            [['Matn to\'g\'ri', 'Текст верный', 'The text is correct'], "text('h1') === 'Salom, CODEVERSE!'"],
          ],
          rules: [['<h1[\\s>]', ['h1 tegi', 'тег h1', 'h1 tag'], { t: 'html' }]],
          h: [['Teg ochiladi va yopiladi: <h1>...</h1>', 'Тег открывается и закрывается: <h1>...</h1>', 'A tag opens and closes: <h1>...</h1>']],
          x: ["`<h1>` — sahifadagi eng muhim sarlavha. Har bir sahifada odatda bitta bo'ladi.", '`<h1>` — главный заголовок страницы. Обычно он один на странице.', '`<h1>` is the most important heading. A page usually has exactly one.'],
        }),
        q: [
          mcq(['HTML qanday til?', 'Каким языком является HTML?', 'What kind of language is HTML?'], [['Dasturlash tili', 'Язык программирования', 'Programming language'], ['Belgilash tili', 'Язык разметки', 'Markup language'], ['Ma\'lumotlar bazasi tili', 'Язык баз данных', 'Database language']], 1, ['HTML matnni teglar bilan belgilaydi — u belgilash tili.', 'HTML размечает текст тегами — это язык разметки.', 'HTML marks up text with tags — it is a markup language.']),
          mcq(['Ekranda ko\'rinadigan kontent qaysi teg ichida bo\'ladi?', 'Внутри какого тега находится видимый контент?', 'Which tag contains the visible content?'], ['<head>', '<body>', '<title>', '<meta>'], 1, ['`<body>` — sahifaning ko\'rinadigan qismi.', '`<body>` — видимая часть страницы.', '`<body>` is the visible part of the page.']),
          tf(['`</p>` — yopuvchi teg.', '`</p>` — закрывающий тег.', '`</p>` is a closing tag.'], true, ['Yopuvchi teg nomidan oldin `/` belgisi bo\'ladi.', 'У закрывающего тега перед именем стоит `/`.', 'A closing tag has `/` before its name.']),
        ],
      }
    ),
    lesson(
      'headings-paragraphs',
      ['Sarlavhalar va paragraflar', 'Заголовки и абзацы', 'Headings and paragraphs'],
      [
        "HTMLda 6 darajali sarlavha bor: `<h1>` (eng muhim) dan `<h6>` gacha. Sarlavhalar sahifa tuzilishini ko'rsatadi — kitobdagi bob va bo'limlar kabi.\n\nOddiy matn `<p>` (paragraph) tegiga yoziladi. Brauzer har bir paragraf orasida avtomatik bo'sh joy qoldiradi.\n\n**Qoida:** sarlavhalarni tartib bilan ishlating — `<h1>` dan keyin `<h2>`, so'ng `<h3>`. Darajalarni sakrab o'tmang.",
        "В HTML 6 уровней заголовков: от `<h1>` (самый важный) до `<h6>`. Заголовки показывают структуру страницы — как главы и разделы в книге.\n\nОбычный текст пишется в теге `<p>` (paragraph). Браузер автоматически добавляет отступ между абзацами.\n\n**Правило:** используйте заголовки по порядку — после `<h1>` идёт `<h2>`, затем `<h3>`. Не перескакивайте уровни.",
        "HTML has 6 heading levels: from `<h1>` (most important) to `<h6>`. Headings show the page structure — like chapters and sections in a book.\n\nRegular text goes into the `<p>` (paragraph) tag. The browser automatically adds space between paragraphs.\n\n**Rule:** use headings in order — `<h1>`, then `<h2>`, then `<h3>`. Don't skip levels.",
      ],
      {
        ex: `<h1>Mening sevimli mevalarim</h1>
<p>Men mevalarni juda yaxshi ko'raman.</p>

<h2>Olma</h2>
<p>Olma — eng foydali mevalardan biri.</p>

<h2>Uzum</h2>
<p>O'zbekiston uzumi butun dunyoga mashhur.</p>`,
        ch: ch({
          i: [
            "Sahifa yarating: bitta `<h1>` sarlavha (**Mening hobbim**), bitta `<h2>` va kamida **ikkita** `<p>` paragraf.",
            "Создайте страницу: один заголовок `<h1>` (**Mening hobbim**), один `<h2>` и минимум **два** абзаца `<p>`.",
            "Build a page: one `<h1>` heading (**Mening hobbim**), one `<h2>` and at least **two** `<p>` paragraphs.",
          ],
          s: { html: '<h1></h1>\n' },
          sol: { html: "<h1>Mening hobbim</h1>\n<p>Men dasturlashni yaxshi ko'raman.</p>\n<h2>Nega?</h2>\n<p>Chunki kod bilan har narsa yaratish mumkin.</p>\n" },
          tests: [
            [['<h1> matni: Mening hobbim', 'Текст <h1>: Mening hobbim', '<h1> text: Mening hobbim'], "text('h1') === 'Mening hobbim'"],
            [['<h2> mavjud', 'Есть <h2>', 'There is an <h2>'], "exists('h2') && text('h2').length > 0"],
            [['Kamida 2 ta paragraf', 'Минимум 2 абзаца', 'At least 2 paragraphs'], "$$('p').filter(p => p.textContent.trim()).length >= 2"],
          ],
          rules: [['<h2[\\s>]', 'h2', { t: 'html' }], ['<p[\\s>][\\s\\S]*<p[\\s>]', ['2 ta p', '2 p', '2 p'], { t: 'html' }]],
          h: [['Har bir paragraf alohida <p>...</p> ichida bo\'lsin.', 'Каждый абзац — в отдельном <p>...</p>.', 'Each paragraph goes in its own <p>...</p>.']],
          x: ['Sarlavhalar ierarxiyasi qidiruv tizimlari va ekran o\'quvchilarga sahifani tushunishga yordam beradi.', 'Иерархия заголовков помогает поисковикам и скринридерам понять страницу.', 'Heading hierarchy helps search engines and screen readers understand the page.'],
        }),
        q: [
          mcq(['Eng muhim sarlavha qaysi?', 'Какой заголовок самый важный?', 'Which heading is the most important?'], ['<h6>', '<h1>', '<head>', '<header>'], 1, ['`<h1>` — birinchi darajali, eng muhim sarlavha.', '`<h1>` — заголовок первого уровня, самый важный.', '`<h1>` is the first-level, most important heading.']),
          fill(['Bo\'sh joyni to\'ldiring: paragraf tegi', 'Заполните пропуск: тег абзаца', 'Fill the blank: the paragraph tag'], '<___>Bu paragraf.</___>', ['p'], ['Paragraf — `<p>`.', 'Абзац — `<p>`.', 'Paragraph is `<p>`.']),
          tf(['`<h1>` dan keyin to\'g\'ridan-to\'g\'ri `<h4>` ishlatish yaxshi amaliyot.', 'Использовать `<h4>` сразу после `<h1>` — хорошая практика.', 'Using `<h4>` right after `<h1>` is good practice.'], false, ['Darajalarni sakrab o\'tmaslik kerak: h1 → h2 → h3.', 'Уровни не стоит пропускать: h1 → h2 → h3.', "Don't skip levels: h1 → h2 → h3."]),
        ],
      }
    ),
    lesson(
      'text-formatting',
      ['Matnni formatlash', 'Форматирование текста', 'Text formatting'],
      [
        "Matndagi muhim so'zlarni ajratish uchun maxsus teglar bor:\n- `<strong>` — **muhim** matn (qalin ko'rinadi)\n- `<em>` — *urg'u* berilgan matn (qiya ko'rinadi)\n- `<mark>` — belgilangan matn\n- `<br>` — yangi qatorga o'tish (yopuvchi tegi yo'q)\n- `<hr>` — gorizontal chiziq, mavzu almashishi\n\n`<strong>` va `<em>` faqat ko'rinish emas, **ma'no** ham beradi: ekran o'quvchi dasturlar ularni ovoz ohangi bilan ajratadi.",
        "Для выделения важных слов есть специальные теги:\n- `<strong>` — **важный** текст (жирный)\n- `<em>` — текст с *ударением* (курсив)\n- `<mark>` — выделенный текст\n- `<br>` — перенос строки (без закрывающего тега)\n- `<hr>` — горизонтальная линия, смена темы\n\n`<strong>` и `<em>` дают не только вид, но и **смысл**: скринридеры выделяют их интонацией.",
        "There are special tags to highlight important words:\n- `<strong>` — **important** text (bold)\n- `<em>` — *emphasized* text (italic)\n- `<mark>` — highlighted text\n- `<br>` — line break (no closing tag)\n- `<hr>` — horizontal rule, a change of topic\n\n`<strong>` and `<em>` add **meaning**, not just looks: screen readers voice them differently.",
      ],
      {
        ex: `<p>Bu <strong>juda muhim</strong> qoida!</p>
<p>Men <em>haqiqatan ham</em> HTMLni yaxshi ko'raman.</p>
<p>Bugun <mark>imtihon</mark> bor.</p>
<p>Birinchi qator<br>Ikkinchi qator</p>
<hr>
<p>Yangi mavzu</p>`,
        ch: ch({
          i: [
            "Paragraf yozing va undagi **xavfsizlik** so'zini `<strong>`, **har doim** so'zini `<em>` ichiga oling.",
            "Напишите абзац, где слово **xavfsizlik** обёрнуто в `<strong>`, а слова **har doim** — в `<em>`.",
            "Write a paragraph where the word **xavfsizlik** is wrapped in `<strong>` and **har doim** in `<em>`.",
          ],
          s: { html: "<p>Parolda xavfsizlik har doim birinchi o'rinda.</p>\n" },
          sol: { html: "<p>Parolda <strong>xavfsizlik</strong> <em>har doim</em> birinchi o'rinda.</p>\n" },
          tests: [
            [['<strong> ichida "xavfsizlik"', '"xavfsizlik" в <strong>', '"xavfsizlik" inside <strong>'], "text('p strong') === 'xavfsizlik'"],
            [['<em> ichida "har doim"', '"har doim" в <em>', '"har doim" inside <em>'], "text('p em') === 'har doim'"],
          ],
          rules: [['<strong>', 'strong', { t: 'html' }], ['<em>', 'em', { t: 'html' }]],
          x: ['Teglar bir-birining ichida joylashishi mumkin (nesting) — asosiysi, to\'g\'ri tartibda yopish.', 'Теги можно вкладывать друг в друга — главное, закрывать в правильном порядке.', 'Tags can be nested — just close them in the right order.'],
        }),
        q: [
          mcq(['Qaysi teg matnni "muhim" deb belgilaydi?', 'Какой тег помечает текст как «важный»?', 'Which tag marks text as "important"?'], ['<b>', '<strong>', '<i>', '<big>'], 1, ['`<strong>` ma\'no beradi; `<b>` faqat ko\'rinish.', '`<strong>` несёт смысл; `<b>` — только вид.', '`<strong>` carries meaning; `<b>` is only visual.']),
          tf(['`<br>` tegining yopuvchi juftligi bor.', 'У тега `<br>` есть закрывающая пара.', 'The `<br>` tag has a closing pair.'], false, ['`<br>` — bo\'sh (void) element, yopilmaydi.', '`<br>` — пустой (void) элемент, не закрывается.', '`<br>` is a void element; it is not closed.']),
          bug(['Xatoni toping:', 'Найдите ошибку:', 'Find the bug:'], '<p>Bu <strong>muhim <em>gap</strong></em></p>', [['Teglar noto\'g\'ri tartibda yopilgan', 'Теги закрыты в неправильном порядке', 'Tags are closed in the wrong order'], ['<p> ichida <strong> bo\'lmaydi', 'Внутри <p> нельзя <strong>', '<strong> is not allowed in <p>'], ['Xato yo\'q', 'Ошибки нет', 'No bug']], 0, ['Oxirgi ochilgan birinchi yopiladi: `</em></strong>`.', 'Последний открытый закрывается первым: `</em></strong>`.', 'Last opened, first closed: `</em></strong>`.'], { d: 'medium' }),
        ],
      }
    ),
    lesson(
      'links',
      ['Havolalar', 'Ссылки', 'Links'],
      [
        "Havola `<a>` (anchor) tegi bilan yaratiladi. Qayerga olib borishi `href` **atributida** yoziladi:\n\n`<a href=\"https://example.com\">Saytga o'tish</a>`\n\nAtribut — tegga qo'shimcha ma'lumot beradi va ochuvchi teg ichida `nom=\"qiymat\"` ko'rinishida yoziladi.\n\nFoydali atributlar:\n- `target=\"_blank\"` — havolani yangi oynada ochadi\n- `href=\"#bo'lim\"` — sahifadagi `id` li elementga o'tadi\n- `href=\"mailto:...\"` — email yozish",
        "Ссылка создаётся тегом `<a>` (anchor). Куда она ведёт, указывается в **атрибуте** `href`:\n\n`<a href=\"https://example.com\">Перейти на сайт</a>`\n\nАтрибут — дополнительная информация о теге, пишется в открывающем теге как `имя=\"значение\"`.\n\nПолезные атрибуты:\n- `target=\"_blank\"` — открыть в новой вкладке\n- `href=\"#раздел\"` — переход к элементу с `id` на странице\n- `href=\"mailto:...\"` — написать email",
        "A link is created with the `<a>` (anchor) tag. Where it goes is set in the `href` **attribute**:\n\n`<a href=\"https://example.com\">Go to the site</a>`\n\nAn attribute adds information to a tag and is written in the opening tag as `name=\"value\"`.\n\nUseful attributes:\n- `target=\"_blank\"` — open in a new tab\n- `href=\"#section\"` — jump to an element with that `id`\n- `href=\"mailto:...\"` — write an email",
      ],
      {
        ex: `<p>
  <a href="https://developer.mozilla.org" target="_blank">MDN — veb hujjatlari</a>
</p>
<p><a href="#aloqa">Aloqa bo'limiga o'tish</a></p>
<p><a href="mailto:info@codeverse.dev">Bizga yozing</a></p>

<h2 id="aloqa">Aloqa</h2>`,
        ch: ch({
          i: [
            "`https://codeverse.dev` manziliga olib boradigan, **yangi oynada** ochiladigan havola yarating. Havola matni: **CODEVERSE**.",
            "Создайте ссылку на `https://codeverse.dev`, которая открывается **в новой вкладке**. Текст ссылки: **CODEVERSE**.",
            "Create a link to `https://codeverse.dev` that opens **in a new tab**. Link text: **CODEVERSE**.",
          ],
          s: { html: '' },
          sol: { html: '<a href="https://codeverse.dev" target="_blank">CODEVERSE</a>\n' },
          tests: [
            [['Havola mavjud', 'Ссылка есть', 'A link exists'], "exists('a')"],
            [['href to\'g\'ri', 'Верный href', 'Correct href'], "$('a').getAttribute('href') === 'https://codeverse.dev'"],
            [['Yangi oynada ochiladi', 'Открывается в новой вкладке', 'Opens in a new tab'], "$('a').getAttribute('target') === '_blank'"],
            [['Matn: CODEVERSE', 'Текст: CODEVERSE', 'Text: CODEVERSE'], "text('a') === 'CODEVERSE'"],
          ],
          rules: [['href\\s*=\\s*["\']https://codeverse\\.dev', 'href', { t: 'html' }], ['target\\s*=\\s*["\']_blank', 'target', { t: 'html' }]],
          h: [['Ikkita atribut kerak: href va target.', 'Нужны два атрибута: href и target.', 'You need two attributes: href and target.']],
        }),
        q: [
          mcq(['Havola manzili qaysi atributda yoziladi?', 'В каком атрибуте указывается адрес ссылки?', 'Which attribute holds the link address?'], ['src', 'link', 'href', 'url'], 2, ['`href` — hypertext reference.', '`href` — hypertext reference.', '`href` stands for hypertext reference.']),
          mcq(['Havolani yangi oynada ochish uchun:', 'Чтобы открыть ссылку в новой вкладке:', 'To open a link in a new tab:'], ['target="_new"', 'target="_blank"', 'open="new"', 'window="blank"'], 1, ['`target="_blank"` — yangi oyna/vkladka.', '`target="_blank"` — новая вкладка.', '`target="_blank"` opens a new tab.']),
          fill(['id="narx" bo\'limiga havola:', 'Ссылка на раздел id="narx":', 'Link to the section id="narx":'], '<a href="___">Narxlar</a>', ['#narx'], ['Sahifa ichidagi havola `#` bilan boshlanadi.', 'Ссылка внутри страницы начинается с `#`.', 'In-page links start with `#`.'], { d: 'medium' }),
        ],
      }
    ),
    lesson(
      'images',
      ['Rasmlar', 'Изображения', 'Images'],
      [
        "Rasm `<img>` tegi bilan qo'shiladi. U bo'sh element — yopuvchi tegi yo'q.\n\nIkki muhim atribut:\n- `src` — rasm manzili (fayl yoki URL)\n- `alt` — rasm tavsifi. Rasm yuklanmasa yoki foydalanuvchi ekran o'quvchidan foydalansa, shu matn ko'rsatiladi/o'qiladi\n\n`alt` — **majburiy** odat: u qulaylik (accessibility) va SEO uchun muhim. Bezak rasmlari uchun `alt=\"\"` (bo'sh) yoziladi.\n\n`width` va `height` atributlari sahifa yuklanayotganda \"sakrash\"ning oldini oladi.",
        "Изображение добавляется тегом `<img>`. Это пустой элемент — без закрывающего тега.\n\nДва важных атрибута:\n- `src` — адрес изображения (файл или URL)\n- `alt` — описание изображения. Оно показывается, если картинка не загрузилась, и читается скринридером\n\n`alt` — **обязательная** привычка: важна для доступности и SEO. Для декоративных картинок пишут `alt=\"\"` (пусто).\n\nАтрибуты `width` и `height` предотвращают «прыжки» страницы при загрузке.",
        "An image is added with the `<img>` tag. It is a void element — no closing tag.\n\nTwo important attributes:\n- `src` — the image address (file or URL)\n- `alt` — a description. It is shown if the image fails to load and read aloud by screen readers\n\n`alt` is a **must**: it matters for accessibility and SEO. Decorative images get `alt=\"\"` (empty).\n\n`width` and `height` prevent the page from \"jumping\" while loading.",
      ],
      {
        ex: `<h1>Samarqand</h1>
<img
  src="https://picsum.photos/seed/samarqand/400/240"
  alt="Registon maydoni kechqurun"
  width="400"
  height="240"
>
<p>Registon — Samarqandning yuragi.</p>`,
        ch: ch({
          i: [
            "`https://picsum.photos/seed/cv/300/200` manzilidagi rasmni qo'shing. `alt` atributida rasmni tavsiflang (kamida 5 belgi) va `width=\"300\"` bering.",
            "Добавьте изображение `https://picsum.photos/seed/cv/300/200`. В `alt` опишите картинку (минимум 5 символов) и задайте `width=\"300\"`.",
            "Add the image `https://picsum.photos/seed/cv/300/200`. Describe it in `alt` (at least 5 characters) and set `width=\"300\"`.",
          ],
          s: { html: '' },
          sol: { html: '<img src="https://picsum.photos/seed/cv/300/200" alt="Tasodifiy manzara" width="300">\n' },
          tests: [
            [['<img> mavjud', 'Есть <img>', 'There is an <img>'], "exists('img')"],
            [['src to\'g\'ri', 'Верный src', 'Correct src'], "$('img').getAttribute('src') === 'https://picsum.photos/seed/cv/300/200'"],
            [['alt kamida 5 belgi', 'alt минимум 5 символов', 'alt is at least 5 characters'], "($('img').getAttribute('alt') || '').trim().length >= 5"],
            [['width=300', 'width=300', 'width=300'], "$('img').getAttribute('width') === '300'"],
          ],
          rules: [['<img[^>]+alt\\s*=\\s*["\'][^"\']{5,}', 'alt', { t: 'html' }]],
          x: ['Yaxshi `alt` rasmni ko\'rmaydigan odamga uning mazmunini yetkazadi.', 'Хороший `alt` передаёт смысл картинки тому, кто её не видит.', 'A good `alt` conveys the picture to someone who cannot see it.'],
        }),
        q: [
          mcq(['Rasm manzili qaysi atributda?', 'В каком атрибуте адрес картинки?', 'Which attribute holds the image address?'], ['href', 'src', 'alt', 'link'], 1, ['`src` — source (manba).', '`src` — source (источник).', '`src` means source.']),
          tf(['`alt` atributi faqat SEO uchun kerak.', 'Атрибут `alt` нужен только для SEO.', 'The `alt` attribute is only for SEO.'], false, ['`alt` avvalo qulaylik uchun: ekran o\'quvchilar uni o\'qiydi.', '`alt` прежде всего для доступности: его читают скринридеры.', '`alt` is mainly for accessibility: screen readers read it.']),
          match(['Teg va uning asosiy atributini moslang', 'Сопоставьте тег и его главный атрибут', 'Match each tag to its key attribute'], [['<img>', 'src'], ['<a>', 'href'], ['<html>', 'lang']], ['img → src, a → href, html → lang.', 'img → src, a → href, html → lang.', 'img → src, a → href, html → lang.'], { d: 'medium' }),
        ],
      }
    ),
  ],
  [
    mcq(['HTML hujjatining ildiz elementi qaysi?', 'Какой элемент корневой в HTML-документе?', 'What is the root element of an HTML document?'], ['<body>', '<head>', '<html>', '<!DOCTYPE>'], 2, ['Barcha elementlar `<html>` ichida joylashadi.', 'Все элементы находятся внутри `<html>`.', 'All elements live inside `<html>`.']),
    mcq(['Qaysi teg sahifa sarlavhasini (brauzer vkladkasida) belgilaydi?', 'Какой тег задаёт заголовок вкладки браузера?', 'Which tag sets the browser tab title?'], ['<h1>', '<title>', '<header>', '<caption>'], 1, ['`<title>` `<head>` ichida yoziladi.', '`<title>` пишется внутри `<head>`.', '`<title>` goes inside `<head>`.']),
    tf(['`<img>` tegini `</img>` bilan yopish shart.', 'Тег `<img>` нужно закрывать `</img>`.', '`<img>` must be closed with `</img>`.'], false, ['`<img>` — bo\'sh element.', '`<img>` — пустой элемент.', '`<img>` is a void element.']),
    out(['Brauzer qancha paragraf ko\'rsatadi?', 'Сколько абзацев покажет браузер?', 'How many paragraphs will the browser show?'], '<p>Bir</p>\n<p>Ikki</p>\n<h2>Uch</h2>\n<p>To\'rt</p>', ['3'], ['`<h2>` paragraf emas — 3 ta `<p>`.', '`<h2>` — не абзац, `<p>` всего 3.', '`<h2>` is not a paragraph — there are 3 `<p>`.'], { d: 'medium' }),
    order(['HTML hujjatini to\'g\'ri tartibda joylang', 'Расставьте HTML-документ по порядку', 'Put the HTML document in order'], ['<!DOCTYPE html>', '<html>', '<head><title>Sahifa</title></head>', '<body><h1>Salom</h1></body>', '</html>'], ['Avval DOCTYPE, keyin html, head, body.', 'Сначала DOCTYPE, затем html, head, body.', 'DOCTYPE first, then html, head, body.'], { d: 'medium' }),
    fill(['Yangi oynada ochiladigan havola:', 'Ссылка в новой вкладке:', 'A link that opens in a new tab:'], '<a href="https://uz" target="___">uz</a>', ['_blank'], ['`_blank` — yangi oyna.', '`_blank` — новая вкладка.', '`_blank` — a new tab.']),
    bug(['Bu kodda nima yetishmaydi?', 'Чего не хватает в этом коде?', 'What is missing in this code?'], '<img src="kot.jpg">', [['alt atributi', 'атрибут alt', 'the alt attribute'], ['Yopuvchi teg', 'Закрывающий тег', 'A closing tag'], ['href atributi', 'атрибут href', 'the href attribute']], 0, ['Har bir mazmunli rasmga `alt` kerak.', 'Каждой содержательной картинке нужен `alt`.', 'Every meaningful image needs `alt`.']),
  ]
);
