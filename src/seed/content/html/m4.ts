import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

export default mod(
  'html-advanced',
  ['Professional HTML', 'Профессиональный HTML', 'Professional HTML'],
  ['Meta teglar, qulaylik, SEO va foydali elementlar.', 'Мета-теги, доступность, SEO и полезные элементы.', 'Meta tags, accessibility, SEO and handy elements.'],
  [
    lesson(
      'head-meta',
      ['Head va meta teglar', 'Head и мета-теги', 'Head and meta tags'],
      [
        "`<head>` ichidagi teglar ekranda ko'rinmaydi, lekin juda muhim:\n- `<meta charset=\"UTF-8\">` — o'zbek/rus harflari to'g'ri chiqishi uchun\n- `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` — mobil moslashuv\n- `<title>` — vkladka nomi va qidiruv natijasidagi sarlavha\n- `<meta name=\"description\">` — qidiruvdagi qisqa tavsif\n- `<link rel=\"stylesheet\">` — CSS fayl ulash",
        "Теги в `<head>` не видны на экране, но очень важны:\n- `<meta charset=\"UTF-8\">` — чтобы кириллица и узбекские буквы отображались верно\n- `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` — мобильная адаптация\n- `<title>` — название вкладки и заголовок в поиске\n- `<meta name=\"description\">` — краткое описание в поиске\n- `<link rel=\"stylesheet\">` — подключение CSS",
        "Tags inside `<head>` aren't visible, but they matter a lot:\n- `<meta charset=\"UTF-8\">` — so all alphabets render correctly\n- `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` — mobile responsiveness\n- `<title>` — the tab name and search result title\n- `<meta name=\"description\">` — the short search snippet\n- `<link rel=\"stylesheet\">` — attaches a CSS file",
      ],
      {
        ex: `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CODEVERSE — dasturlashni o'yin orqali o'rganing</title>
  <meta name="description" content="HTML, CSS, JavaScript va React bo'yicha interaktiv kurslar.">
  <link rel="stylesheet" href="style.css">
</head>
<body>...</body>
</html>`,
        ch: ch({
          i: ['Sahifaga `name="description"` li meta teg qo\'shing (`content` kamida 20 belgi). *Eslatma: sandboxda teg body ichida ham tekshiriladi.*', 'Добавьте meta-тег с `name="description"` (`content` минимум 20 символов). *В песочнице тег проверяется и внутри body.*', 'Add a meta tag with `name="description"` (`content` at least 20 characters). *In the sandbox it is checked even inside body.*'],
          s: { html: '' },
          sol: { html: '<meta name="description" content="Mening shaxsiy blogim: kod, kitoblar va sayohatlar.">\n' },
          tests: [[['meta description (20+ belgi)', 'meta description (20+ символов)', 'meta description (20+ chars)'], "($('meta[name=description]')?.getAttribute('content') || '').length >= 20"]],
          rules: [['name\\s*=\\s*["\']description', 'description', { t: 'html' }]],
        }),
        q: [
          mcq(['Mobil moslashuv uchun meta:', 'Meta для мобильной адаптации:', 'Meta for mobile responsiveness:'], ['charset', 'viewport', 'description', 'mobile'], 1, ['`viewport` sahifa kengligini qurilmaga moslaydi.', '`viewport` подстраивает ширину под устройство.', '`viewport` matches the page width to the device.']),
          tf(['`<title>` ekranda sahifa ichida ko\'rinadi.', '`<title>` отображается внутри страницы.', '`<title>` is shown inside the page body.'], false, ['U vkladkada va qidiruvda ko\'rinadi.', 'Он виден на вкладке и в поиске.', 'It appears on the tab and in search results.']),
        ],
      }
    ),
    lesson(
      'accessibility',
      ['Qulaylik (a11y)', 'Доступность (a11y)', 'Accessibility (a11y)'],
      [
        "Sayt hamma uchun — ko'zi ojiz, faqat klaviaturadan foydalanuvchi odamlar uchun ham bo'lishi kerak.\n- Mazmunli `alt` matnlar\n- Tugmalar uchun `<button>`, havolalar uchun `<a>` (div ga click qo'ymang!)\n- Ikonkali tugmaga `aria-label`: `<button aria-label=\"Yopish\">✕</button>`\n- `<html lang=\"uz\">` — ekran o'quvchi to'g'ri talaffuz qiladi\n- Rang kontrasti yetarli bo'lsin",
        "Сайт должен быть для всех — в том числе для незрячих и тех, кто пользуется только клавиатурой.\n- Осмысленные `alt`\n- `<button>` для кнопок, `<a>` для ссылок (не вешайте click на div!)\n- Кнопке-иконке — `aria-label`: `<button aria-label=\"Закрыть\">✕</button>`\n- `<html lang=\"ru\">` — скринридер правильно произносит\n- Достаточный цветовой контраст",
        "A site should work for everyone — including blind users and keyboard-only users.\n- Meaningful `alt` text\n- `<button>` for buttons, `<a>` for links (don't put click handlers on divs!)\n- Icon buttons need `aria-label`: `<button aria-label=\"Close\">✕</button>`\n- `<html lang=\"en\">` — screen readers pronounce correctly\n- Enough color contrast",
      ],
      {
        ex: `<button aria-label="Menyuni ochish">☰</button>
<button aria-label="Qidirish">🔍</button>
<img src="https://picsum.photos/seed/team/240/120" alt="Jamoa a'zolari ofisda kulmoqda">
<a href="/kurslar">Barcha kurslar</a>`,
        ch: ch({
          i: ['Faqat `✕` belgisidan iborat yopish tugmasini yarating va unga `aria-label="Yopish"` bering.', 'Создайте кнопку закрытия только с символом `✕` и задайте ей `aria-label="Yopish"`.', 'Create a close button containing only `✕` and give it `aria-label="Yopish"`.'],
          s: { html: '<div onclick="close()">✕</div>\n' },
          sol: { html: '<button type="button" aria-label="Yopish">✕</button>\n' },
          tests: [
            [['<button> ishlatilgan', 'Используется <button>', 'Uses <button>'], "exists('button')"],
            [['aria-label="Yopish"', 'aria-label="Yopish"', 'aria-label="Yopish"'], "$('button').getAttribute('aria-label') === 'Yopish'"],
          ],
          rules: [['aria-label', 'aria-label', { t: 'html' }]],
        }),
        q: [
          bug(['Qulaylik muammosi qayerda?', 'Где проблема доступности?', 'Where is the accessibility problem?'], '<div class="btn" onclick="buy()">Sotib olish</div>', [['div tugma sifatida ishlatilgan', 'div используется как кнопка', 'A div is used as a button'], ['class nomi noto\'g\'ri', 'Неверный class', 'Wrong class name'], ['Muammo yo\'q', 'Проблем нет', 'No problem']], 0, ['`<div>` klaviatura bilan fokuslanmaydi — `<button>` ishlating.', '`<div>` не фокусируется с клавиатуры — используйте `<button>`.', 'A `<div>` is not keyboard-focusable — use `<button>`.']),
          mcq(['Ikonkali tugmaga nom berish:', 'Как назвать кнопку-иконку:', 'How to name an icon-only button:'], ['title', 'aria-label', 'name', 'alt'], 1, ['`aria-label` ekran o\'quvchi uchun nom beradi.', '`aria-label` даёт имя для скринридера.', '`aria-label` gives a name for screen readers.']),
        ],
      }
    ),
    lesson(
      'seo-basics',
      ['SEO asoslari', 'Основы SEO', 'SEO basics'],
      [
        "SEO — saytni qidiruv tizimlarida yuqoriga chiqarish. HTML tomonidan:\n- Har sahifada noyob `<title>` va `description`\n- Bitta `<h1>` va mantiqiy sarlavhalar ierarxiyasi\n- Semantik teglar\n- Havola matni mazmunli bo'lsin: \"bu yerga bosing\" emas, \"CSS kursini ko'rish\"\n- Rasmlarda `alt`",
        "SEO — продвижение сайта в поисковиках. Со стороны HTML:\n- Уникальные `<title>` и `description` на каждой странице\n- Один `<h1>` и логичная иерархия заголовков\n- Семантические теги\n- Осмысленный текст ссылок: не «нажмите сюда», а «смотреть курс CSS»\n- `alt` у изображений",
        "SEO means ranking higher in search engines. On the HTML side:\n- A unique `<title>` and `description` on every page\n- One `<h1>` and a logical heading hierarchy\n- Semantic tags\n- Meaningful link text: not \"click here\" but \"view the CSS course\"\n- `alt` on images",
      ],
      {
        ex: `<!-- Yomon -->
<a href="/css">Bu yerga bosing</a>

<!-- Yaxshi -->
<a href="/css">CSS kursini boshlash</a>`,
        ch: ch({
          i: ["Havola matnini yaxshilang: \"bu yerga\" o'rniga mazmunli matn yozing (kamida 3 so'z), `href` o'zgarmasin.", 'Улучшите текст ссылки: вместо «bu yerga» напишите осмысленный текст (минимум 3 слова), `href` не меняйте.', 'Improve the link text: replace "bu yerga" with meaningful text (at least 3 words); keep the `href`.'],
          s: { html: '<p>Kurslarni ko\'rish uchun <a href="/courses">bu yerga</a> bosing.</p>\n' },
          sol: { html: '<p><a href="/courses">Barcha kurslarni ko\'rish</a></p>\n' },
          tests: [
            [['href="/courses"', 'href="/courses"', 'href="/courses"'], "$('a').getAttribute('href') === '/courses'"],
            [['Matn mazmunli (3+ so\'z, "bu yerga" emas)', 'Текст осмысленный (3+ слова, не «bu yerga»)', 'Meaningful text (3+ words, not "bu yerga")'], "text('a').split(' ').length >= 3 && !/bu yerga/i.test(text('a'))"],
          ],
          rules: [['href\\s*=\\s*["\']/courses', 'href', { t: 'html' }]],
        }),
        q: [
          tf(['Sahifada bir nechta `<h1>` bo\'lishi SEO uchun eng yaxshi.', 'Несколько `<h1>` на странице — лучше всего для SEO.', 'Several `<h1>`s per page is best for SEO.'], false, ['Odatda bitta `<h1>` tavsiya etiladi.', 'Обычно рекомендуется один `<h1>`.', 'One `<h1>` is usually recommended.']),
          mcq(['Qaysi havola matni eng yaxshi?', 'Какой текст ссылки лучше?', 'Which link text is best?'], [['Bu yerga bosing', 'Нажмите сюда', 'Click here'], ['Batafsil', 'Подробнее', 'More'], ['React kursi dasturi', 'Программа курса React', 'React course syllabus']], 2, ['Mazmunli matn qayerga olib borishini aytadi.', 'Осмысленный текст говорит, куда ведёт ссылка.', 'Meaningful text tells where the link goes.']),
        ],
      }
    ),
    lesson(
      'figure-details',
      ['figure, details, summary', 'figure, details, summary', 'figure, details, summary'],
      [
        "Foydali semantik elementlar:\n- `<figure>` + `<figcaption>` — rasm (yoki kod, diagramma) va uning izohi\n- `<details>` + `<summary>` — JavaScriptsiz ochilib-yopiladigan blok (FAQ uchun ideal). `open` atributi uni ochiq holda boshlaydi\n- `<time datetime=\"2026-09-01\">` — mashina tushunadigan sana\n- `<blockquote>` — iqtibos",
        "Полезные семантические элементы:\n- `<figure>` + `<figcaption>` — изображение (или код, диаграмма) и подпись\n- `<details>` + `<summary>` — раскрывающийся блок без JavaScript (идеально для FAQ). Атрибут `open` делает его открытым\n- `<time datetime=\"2026-09-01\">` — дата, понятная машинам\n- `<blockquote>` — цитата",
        "Handy semantic elements:\n- `<figure>` + `<figcaption>` — an image (or code, diagram) with its caption\n- `<details>` + `<summary>` — a collapsible block without JavaScript (great for FAQs). The `open` attribute starts it expanded\n- `<time datetime=\"2026-09-01\">` — a machine-readable date\n- `<blockquote>` — a quotation",
      ],
      {
        ex: `<figure>
  <img src="https://picsum.photos/seed/code/300/160" alt="Ekranda kod">
  <figcaption>1-rasm. Birinchi dasturim</figcaption>
</figure>

<details>
  <summary>CODEVERSE bepulmi?</summary>
  <p>Ha, barcha asosiy kurslar bepul.</p>
</details>`,
        ch: ch({
          i: ['FAQ yarating: kamida **2 ta** `<details>`, har birida `<summary>` (savol) va `<p>` (javob).', 'Создайте FAQ: минимум **2** `<details>`, в каждом `<summary>` (вопрос) и `<p>` (ответ).', 'Build an FAQ: at least **2** `<details>`, each with a `<summary>` (question) and a `<p>` (answer).'],
          s: { html: '' },
          sol: { html: '<details>\n  <summary>Kurs qancha davom etadi?</summary>\n  <p>Taxminan 4 hafta.</p>\n</details>\n<details>\n  <summary>Sertifikat beriladimi?</summary>\n  <p>Ha, PDF sertifikat.</p>\n</details>\n' },
          tests: [[['2+ details (summary va p bilan)', '2+ details (с summary и p)', '2+ details (with summary and p)'], "$$('details').filter(d => d.querySelector('summary') && d.querySelector('p')).length >= 2"]],
          rules: [['<details[\\s\\S]*<details', 'details x2', { t: 'html' }]],
        }),
        q: [
          mcq(['Rasm izohi uchun teg:', 'Тег подписи к изображению:', 'Tag for an image caption:'], ['<caption>', '<figcaption>', '<label>', '<alt>'], 1, ['`<figure>` ichida `<figcaption>`.', '`<figcaption>` внутри `<figure>`.', '`<figcaption>` inside `<figure>`.']),
          tf(['`<details>` ishlashi uchun JavaScript kerak.', 'Для работы `<details>` нужен JavaScript.', '`<details>` needs JavaScript to work.'], false, ['Brauzer uni o\'zi boshqaradi.', 'Браузер управляет им сам.', 'The browser handles it natively.']),
        ],
      }
    ),
    lesson(
      'block-inline-data',
      ['Blok/qator elementlar va data-atributlar', 'Блочные/строчные элементы и data-атрибуты', 'Block/inline elements and data attributes'],
      [
        "**Blok** elementlar (`div`, `p`, `h1`, `section`, `ul`) butun kenglikni egallaydi va yangi qatordan boshlanadi. **Qator** (inline) elementlar (`span`, `a`, `strong`, `img`) matn oqimida qoladi.\n\n`data-*` atributlari elementga o'z ma'lumotingizni bog'laydi: `data-price=\"9000\"`. JavaScript ularni `element.dataset.price` orqali o'qiydi.",
        "**Блочные** элементы (`div`, `p`, `h1`, `section`, `ul`) занимают всю ширину и начинаются с новой строки. **Строчные** (`span`, `a`, `strong`, `img`) остаются в потоке текста.\n\nАтрибуты `data-*` хранят ваши данные в элементе: `data-price=\"9000\"`. JavaScript читает их через `element.dataset.price`.",
        "**Block** elements (`div`, `p`, `h1`, `section`, `ul`) take the full width and start on a new line. **Inline** elements (`span`, `a`, `strong`, `img`) stay in the text flow.\n\n`data-*` attributes attach your own data to an element: `data-price=\"9000\"`. JavaScript reads them via `element.dataset.price`.",
      ],
      {
        ex: `<ul>
  <li data-id="1" data-price="12000">Kitob</li>
  <li data-id="2" data-price="3000">Ruchka</li>
</ul>
<p>Bu <span>qator ichidagi</span> element.</p>`,
        ch: ch({
          i: ['Uchta `<li>` dan iborat ro\'yxat yarating, har biriga `data-price` atributi bering (son).', 'Создайте список из трёх `<li>`, у каждого атрибут `data-price` (число).', 'Create a list of three `<li>`s, each with a numeric `data-price` attribute.'],
          s: { html: '<ul>\n  <li>Olma</li>\n</ul>\n' },
          sol: { html: '<ul>\n  <li data-price="5000">Olma</li>\n  <li data-price="8000">Anor</li>\n  <li data-price="3000">Banan</li>\n</ul>\n' },
          tests: [[['3+ li va har birida son data-price', '3+ li, у каждого числовой data-price', '3+ li, each with a numeric data-price'], "(() => { const l = $$('li'); return l.length >= 3 && l.every(x => x.dataset.price !== undefined && !isNaN(Number(x.dataset.price)) && x.dataset.price !== ''); })()"]],
          rules: [['data-price', 'data-price', { t: 'html' }]],
        }),
        q: [
          mcq(['Qaysi biri blok element?', 'Какой элемент блочный?', 'Which one is a block element?'], ['<span>', '<a>', '<section>', '<strong>'], 2, ['`<section>` — blok.', '`<section>` — блочный.', '`<section>` is block-level.']),
          out(['`el.dataset.userName` nimani qaytaradi?', 'Что вернёт `el.dataset.userName`?', 'What does `el.dataset.userName` return?'], '<div id="el" data-user-name="Ali"></div>', ['Ali'], ['`data-user-name` → `dataset.userName` (camelCase).', '`data-user-name` → `dataset.userName` (camelCase).', '`data-user-name` → `dataset.userName` (camelCase).'], { d: 'medium' }),
        ],
      }
    ),
  ],
  [
    mcq(['Kodlash (UTF-8) qayerda belgilanadi?', 'Где задаётся кодировка (UTF-8)?', 'Where is the encoding (UTF-8) set?'], ['<meta charset>', '<title>', '<html encoding>', '<body charset>'], 0, ['`<meta charset="UTF-8">`.', '`<meta charset="UTF-8">`.', '`<meta charset="UTF-8">`.']),
    tf(['`aria-label` ekran o\'quvchilar uchun element nomini beradi.', '`aria-label` задаёт имя элемента для скринридеров.', '`aria-label` gives an element a name for screen readers.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
    match(['Moslang', 'Сопоставьте', 'Match'], [['<summary>', '<details>'], ['<figcaption>', '<figure>'], ['<legend>', '<fieldset>']], ['Har bir sarlavha o\'z konteyneri ichida.', 'Каждый заголовок — внутри своего контейнера.', 'Each caption lives in its container.'], { d: 'medium' }),
    mcq(['SEO uchun eng yomon havola matni:', 'Худший текст ссылки для SEO:', 'The worst link text for SEO:'], [['Narxlar jadvali', 'Таблица цен', 'Pricing table'], ['Bu yerga bosing', 'Нажмите сюда', 'Click here'], ['Kurs dasturi', 'Программа курса', 'Course syllabus']], 1, ['"Bu yerga bosing" hech narsa demaydi.', '«Нажмите сюда» ничего не сообщает.', '"Click here" says nothing.']),
    fill(['data-atributni JS da o\'qish:', 'Чтение data-атрибута в JS:', 'Reading a data attribute in JS:'], 'el.___.price', ['dataset'], ['`dataset`.', '`dataset`.', '`dataset`.']),
  ]
);
