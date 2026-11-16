import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

export default mod(
  'html-practice',
  ['Amaliyot: real sahifalar', 'Практика: реальные страницы', 'Practice: real pages'],
  ["O'rganganlarimizni birlashtirib, haqiqiy sahifa qismlarini quramiz.", 'Объединяем знания и строим части реальных страниц.', 'Combine everything to build real page parts.'],
  [
    lesson(
      'profile-card',
      ['Profil kartochkasi', 'Карточка профиля', 'Profile card'],
      [
        "Profil kartochkasi — ijtimoiy tarmoq va jamoa sahifalarining asosiy qismi. U odatda `<article>` ichida rasm, ism (`<h2>`), qisqa ma'lumot va havolalardan iborat.\n\nQoidalar: rasmda `alt`, ism — sarlavha, havolalar mazmunli.",
        "Карточка профиля — основа соцсетей и страниц команды. Обычно это `<article>` с фото, именем (`<h2>`), кратким описанием и ссылками.\n\nПравила: у фото `alt`, имя — заголовок, ссылки осмысленные.",
        "A profile card is a core part of social and team pages. It's usually an `<article>` with a photo, a name (`<h2>`), a short bio and links.\n\nRules: the photo has `alt`, the name is a heading, links are meaningful.",
      ],
      {
        ex: `<article class="profile">
  <img src="https://picsum.photos/seed/p1/96/96" alt="Bekzodning surati" width="96" height="96">
  <h2>Bekzod Rahimov</h2>
  <p>Frontend dasturchi, Toshkent</p>
  <a href="https://github.com">GitHub profilim</a>
</article>`,
        ch: ch({
          i: ['`<article class="profile">` yarating: ichida `alt` li `<img>`, `<h2>` (ism), `<p>` (kasb) va kamida bitta `<a>`.', 'Создайте `<article class="profile">`: внутри `<img>` с `alt`, `<h2>` (имя), `<p>` (профессия) и минимум один `<a>`.', 'Create an `<article class="profile">` containing an `<img>` with `alt`, an `<h2>` (name), a `<p>` (job) and at least one `<a>`.'],
          s: { html: '<article class="profile">\n</article>\n' },
          sol: { html: '<article class="profile">\n  <img src="https://picsum.photos/seed/p/96/96" alt="Mening suratim">\n  <h2>Aziza</h2>\n  <p>Dizayner</p>\n  <a href="https://github.com">GitHub</a>\n</article>\n' },
          tests: [
            [['img alt bilan', 'img с alt', 'img with alt'], "($('.profile img')?.getAttribute('alt') || '').length > 0"],
            [['h2 va p', 'h2 и p', 'h2 and p'], "text('.profile h2')?.length > 0 && text('.profile p')?.length > 0"],
            [['havola', 'ссылка', 'a link'], "exists('.profile a[href]')"],
          ],
          rules: [['class\\s*=\\s*["\']profile', 'profile', { t: 'html' }]],
          d: 'medium',
        }),
        q: [
          mcq(['Profil kartochkasi uchun eng mos konteyner:', 'Лучший контейнер для карточки профиля:', 'Best container for a profile card:'], ['<article>', '<span>', '<table>', '<b>'], 0, ['Kartochka — mustaqil kontent bo\'lagi.', 'Карточка — самостоятельный блок контента.', 'A card is a self-contained piece of content.']),
          tf(['Ism uchun `<h2>` ishlatish ma\'noli.', 'Использовать `<h2>` для имени — осмысленно.', 'Using `<h2>` for the name is meaningful.'], true, ['Ism kartochkaning sarlavhasi.', 'Имя — заголовок карточки.', 'The name is the card heading.']),
        ],
      }
    ),
    lesson(
      'nav-menu',
      ['Navigatsiya menyusi', 'Навигационное меню', 'Navigation menu'],
      [
        "Professional menyu `<nav>` ichidagi `<ul>` ro'yxatdan quriladi — chunki menyu bu havolalar ro'yxati. Joriy sahifa havolasiga `aria-current=\"page\"` qo'yiladi: ekran o'quvchi \"joriy sahifa\" deb aytadi, CSS esa uni ajratib ko'rsatadi.",
        "Профессиональное меню строится как `<ul>` внутри `<nav>` — ведь меню это список ссылок. Ссылке текущей страницы ставят `aria-current=\"page\"`: скринридер скажет «текущая страница», а CSS её выделит.",
        "A professional menu is a `<ul>` inside `<nav>` — a menu is a list of links. The current page link gets `aria-current=\"page\"`: screen readers announce \"current page\" and CSS can highlight it.",
      ],
      {
        ex: `<nav aria-label="Asosiy menyu">
  <ul>
    <li><a href="/" aria-current="page">Bosh sahifa</a></li>
    <li><a href="/courses">Kurslar</a></li>
    <li><a href="/about">Biz haqimizda</a></li>
  </ul>
</nav>`,
        ch: ch({
          i: ['`<nav>` > `<ul>` > `<li>` > `<a>` tuzilmasida kamida 3 ta havola yarating. Birinchi havolaga `aria-current="page"` qo\'ying.', 'Создайте минимум 3 ссылки в структуре `<nav>` > `<ul>` > `<li>` > `<a>`. Первой ссылке задайте `aria-current="page"`.', 'Create at least 3 links in a `<nav>` > `<ul>` > `<li>` > `<a>` structure. Give the first link `aria-current="page"`.'],
          s: { html: '<nav>\n  <a href="/">Bosh sahifa</a> | <a href="/blog">Blog</a> | <a href="/contact">Aloqa</a>\n</nav>\n' },
          sol: { html: '<nav>\n  <ul>\n    <li><a href="/" aria-current="page">Bosh sahifa</a></li>\n    <li><a href="/blog">Blog</a></li>\n    <li><a href="/contact">Aloqa</a></li>\n  </ul>\n</nav>\n' },
          tests: [
            [['nav ul li a — 3+', 'nav ul li a — 3+', 'nav ul li a — 3+'], "$$('nav ul li a').length >= 3"],
            [['birinchi havolada aria-current', 'aria-current у первой ссылки', 'aria-current on the first link'], "$('nav ul li a').getAttribute('aria-current') === 'page'"],
          ],
          rules: [['aria-current', 'aria-current', { t: 'html' }], ['<ul', 'ul', { t: 'html' }]],
        }),
        q: [
          mcq(['Joriy sahifa havolasini belgilash:', 'Как отметить ссылку текущей страницы:', 'How to mark the current page link:'], ['class="now"', 'aria-current="page"', 'active="true"', 'current'], 1, ['`aria-current="page"` — standart.', '`aria-current="page"` — стандарт.', '`aria-current="page"` is the standard.']),
          order(['Menyu tuzilmasini tartiblang (tashqaridan ichkariga)', 'Упорядочите структуру меню (снаружи внутрь)', 'Order the menu structure (outside in)'], ['<nav>', '<ul>', '<li>', '<a>'], ['nav → ul → li → a.', 'nav → ul → li → a.', 'nav → ul → li → a.']),
        ],
      }
    ),
    lesson(
      'blog-post',
      ['Blog maqolasi', 'Статья блога', 'Blog post'],
      [
        "Maqola sahifasi: `<article>` ichida `<header>` (sarlavha, muallif, `<time>`), matn paragraflari, ichki sarlavhalar (`<h2>`), iqtibos (`<blockquote>`) va izohli rasm (`<figure>`). Bunday tuzilma qidiruv tizimlariga maqolani to'g'ri tushunishga yordam beradi.",
        "Страница статьи: `<article>` с `<header>` (заголовок, автор, `<time>`), абзацы текста, подзаголовки (`<h2>`), цитата (`<blockquote>`) и изображение с подписью (`<figure>`). Такая структура помогает поисковикам понять статью.",
        "An article page: an `<article>` with a `<header>` (title, author, `<time>`), text paragraphs, subheadings (`<h2>`), a quote (`<blockquote>`) and a captioned image (`<figure>`). This structure helps search engines understand the post.",
      ],
      {
        ex: `<article>
  <header>
    <h1>Nega har kuni kod yozish kerak?</h1>
    <p>Muallif: Dilnoza · <time datetime="2026-09-01">1-sentabr, 2026</time></p>
  </header>
  <p>Odat — muvaffaqiyat kaliti.</p>
  <blockquote>Kichik qadamlar katta natija beradi.</blockquote>
</article>`,
        ch: ch({
          i: ['`<article>` yarating: ichida `<header>` (`<h1>` va `datetime` atributli `<time>`), kamida 2 ta `<p>` va `<blockquote>`.', 'Создайте `<article>`: внутри `<header>` (`<h1>` и `<time>` с атрибутом `datetime`), минимум 2 `<p>` и `<blockquote>`.', 'Create an `<article>` with a `<header>` (an `<h1>` and a `<time>` with a `datetime` attribute), at least 2 `<p>`s and a `<blockquote>`.'],
          s: { html: '<article>\n</article>\n' },
          sol: { html: '<article>\n  <header>\n    <h1>Birinchi postim</h1>\n    <time datetime="2026-10-01">1-oktabr</time>\n  </header>\n  <p>Salom!</p>\n  <p>Bugun HTML o\'rgandim.</p>\n  <blockquote>Bilim — kuch.</blockquote>\n</article>\n' },
          tests: [
            [['article header h1', 'article header h1', 'article header h1'], "exists('article header h1')"],
            [['time[datetime]', 'time[datetime]', 'time[datetime]'], "exists('article time[datetime]')"],
            [['2+ p va blockquote', '2+ p и blockquote', '2+ p and blockquote'], "$$('article p').length >= 2 && exists('article blockquote')"],
          ],
          rules: [['<time[^>]+datetime', 'time', { t: 'html' }]],
          d: 'medium',
        }),
        q: [
          mcq(['Iqtibos uchun teg:', 'Тег для цитаты:', 'Tag for a quotation:'], ['<quote>', '<blockquote>', '<cite-block>', '<q-block>'], 1, ['`<blockquote>` — blok iqtibos.', '`<blockquote>` — блочная цитата.', '`<blockquote>` is a block quote.']),
          fill(['Mashina o\'qiy oladigan sana:', 'Дата, понятная машине:', 'Machine-readable date:'], '<time ___="2026-01-15">15-yanvar</time>', ['datetime'], ['`datetime` atributi.', 'Атрибут `datetime`.', 'The `datetime` attribute.']),
        ],
      }
    ),
    lesson(
      'contact-form',
      ['Aloqa formasi', 'Форма обратной связи', 'Contact form'],
      [
        "Yaxshi aloqa formasi: har bir maydonda `label`, to'g'ri `type`, `required`, tushunarli tugma matni. Maydonlar `<fieldset>` bilan guruhlanadi. Forma ma'lumotni qayerga yuborishini `action` va `method` atributlari belgilaydi (`method=\"post\"` — maxfiy ma'lumotlar uchun).",
        "Хорошая форма связи: `label` у каждого поля, правильный `type`, `required`, понятный текст кнопки. Поля группируются через `<fieldset>`. Куда отправлять данные, задают атрибуты `action` и `method` (`method=\"post\"` — для приватных данных).",
        "A good contact form: a `label` for every field, the right `type`, `required`, and clear button text. Group fields with `<fieldset>`. The `action` and `method` attributes set where data goes (`method=\"post\"` for private data).",
      ],
      {
        ex: `<form action="/contact" method="post">
  <label for="n">Ism</label>
  <input id="n" name="name" required>
  <label for="e">Email</label>
  <input id="e" name="email" type="email" required>
  <label for="m">Xabar</label>
  <textarea id="m" name="message" rows="4" required></textarea>
  <button type="submit">Xabar yuborish</button>
</form>`,
        ch: ch({
          i: ['`method="post"` li forma: `name`, `email` (type=email) va `message` (textarea) maydonlari — hammasi `required` va `label` bilan bog\'langan.', 'Форма с `method="post"`: поля `name`, `email` (type=email) и `message` (textarea) — все `required` и связаны с `label`.', 'A form with `method="post"`: fields `name`, `email` (type=email) and `message` (textarea) — all `required` and linked to a `label`.'],
          s: { html: '<form>\n</form>\n' },
          sol: { html: '<form method="post">\n  <label for="n">Ism</label>\n  <input id="n" name="name" required>\n  <label for="e">Email</label>\n  <input id="e" name="email" type="email" required>\n  <label for="m">Xabar</label>\n  <textarea id="m" name="message" required></textarea>\n  <button type="submit">Yuborish</button>\n</form>\n' },
          tests: [
            [['method=post', 'method=post', 'method=post'], "$('form').getAttribute('method')?.toLowerCase() === 'post'"],
            [['3 ta majburiy maydon', '3 обязательных поля', '3 required fields'], "['name','email','message'].every(n => $('[name=' + n + ']')?.required)"],
            [['email turi', 'Тип email', 'Email type'], "$('[name=email]').type === 'email' && $('[name=message]').tagName === 'TEXTAREA'"],
            [['har bir maydonda label', 'label у каждого поля', 'Every field has a label'], "['name','email','message'].every(n => { const el = $('[name=' + n + ']'); return (el.id && exists('label[for=\"' + el.id + '\"]')) || !!el.closest('label'); })"],
          ],
          rules: [['method\\s*=\\s*["\']post', 'post', { t: 'html' }]],
          d: 'medium',
        }),
        q: [
          mcq(['Maxfiy ma\'lumot yuborish usuli:', 'Метод для отправки приватных данных:', 'Method for sending private data:'], ['get', 'post', 'send', 'put-url'], 1, ['GET ma\'lumotni URL ga qo\'shadi; POST — so\'rov tanasida.', 'GET добавляет данные в URL; POST — в тело запроса.', 'GET puts data in the URL; POST in the request body.']),
          tf(['`action` atributi forma qayerga yuborilishini belgilaydi.', 'Атрибут `action` задаёт, куда отправляется форма.', 'The `action` attribute sets where the form is sent.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
        ],
      }
    ),
    lesson(
      'landing-skeleton',
      ['Landing sahifa skeleti', 'Каркас лендинга', 'Landing page skeleton'],
      [
        "Landing — bitta mahsulotni taqdim etuvchi sahifa. Odatdagi bo'limlar: **hero** (katta sarlavha + asosiy tugma), **xususiyatlar** (3 ta kartochka), **narxlar**, **FAQ** va **footer**. Avval HTML skeleti quriladi, keyin CSS bilan bezatiladi — bu modulning yakuni va CSS o'rmoniga ko'prik!",
        "Лендинг — страница, представляющая один продукт. Типичные блоки: **hero** (большой заголовок + главная кнопка), **преимущества** (3 карточки), **цены**, **FAQ** и **footer**. Сначала строится HTML-каркас, потом его оформляют CSS — это финал модуля и мост в лес CSS!",
        "A landing page presents a single product. Typical sections: **hero** (big headline + main button), **features** (3 cards), **pricing**, **FAQ** and a **footer**. First build the HTML skeleton, then style it with CSS — the finale of this module and a bridge to the CSS Forest!",
      ],
      {
        ex: `<header><nav>...</nav></header>
<main>
  <section id="hero">
    <h1>Kod yozishni o'yin orqali o'rganing</h1>
    <a href="/register">Bepul boshlash</a>
  </section>
  <section id="features">
    <h2>Nega CODEVERSE?</h2>
    <article><h3>Interaktiv</h3></article>
  </section>
</main>
<footer>...</footer>`,
        ch: ch({
          i: ['`<main>` ichida `id="hero"` (ichida `<h1>` va havola), `id="features"` (ichida `<h2>` va kamida **3 ta** `<article>`) bo\'limlarini yarating.', 'Внутри `<main>` создайте разделы `id="hero"` (с `<h1>` и ссылкой) и `id="features"` (с `<h2>` и минимум **3** `<article>`).', 'Inside `<main>`, create sections `id="hero"` (with an `<h1>` and a link) and `id="features"` (with an `<h2>` and at least **3** `<article>`s).'],
          s: { html: '<main>\n</main>\n' },
          sol: { html: '<main>\n  <section id="hero">\n    <h1>CODEVERSE</h1>\n    <a href="/register">Boshlash</a>\n  </section>\n  <section id="features">\n    <h2>Afzalliklar</h2>\n    <article><h3>O\'yin</h3></article>\n    <article><h3>AI mentor</h3></article>\n    <article><h3>Sertifikat</h3></article>\n  </section>\n</main>\n' },
          tests: [
            [['#hero: h1 va a', '#hero: h1 и a', '#hero: h1 and a'], "exists('main #hero h1') && exists('#hero a[href]')"],
            [['#features: h2 va 3+ article', '#features: h2 и 3+ article', '#features: h2 and 3+ articles'], "exists('#features h2') && $$('#features article').length >= 3"],
          ],
          rules: [['id\\s*=\\s*["\']hero', 'hero', { t: 'html' }], ['id\\s*=\\s*["\']features', 'features', { t: 'html' }]],
          d: 'medium',
        }),
        q: [
          tf(['Avval HTML skeleti, keyin CSS — yaxshi ish tartibi.', 'Сначала HTML-каркас, потом CSS — хороший порядок работы.', 'HTML skeleton first, then CSS — a good workflow.'], true, ['Tuzilma birinchi, ko\'rinish keyin.', 'Сначала структура, потом вид.', 'Structure first, looks later.']),
          mcq(['Hero bo\'limida odatda nima bo\'ladi?', 'Что обычно есть в блоке hero?', 'What does a hero section usually contain?'], [['Katta sarlavha va asosiy tugma', 'Большой заголовок и главная кнопка', 'A big headline and a main button'], ['Faqat footer', 'Только footer', 'Only a footer'], ['Jadval', 'Таблица', 'A table']], 0, ['Hero — birinchi taassurot.', 'Hero — первое впечатление.', 'The hero is the first impression.']),
        ],
      }
    ),
  ],
  [
    mcq(['Menyu uchun eng to\'g\'ri tuzilma:', 'Лучшая структура меню:', 'Best structure for a menu:'], ['nav > ul > li > a', 'div > a', 'table > tr > a', 'p > a'], 0, ['Menyu — havolalar ro\'yxati.', 'Меню — список ссылок.', 'A menu is a list of links.']),
    tf(['`<time datetime>` qidiruv tizimlariga sanani tushunishga yordam beradi.', '`<time datetime>` помогает поисковикам понять дату.', '`<time datetime>` helps search engines understand dates.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
    bug(['Bu formada nima noto\'g\'ri?', 'Что не так с этой формой?', "What's wrong with this form?"], '<form method="post">\n  Email: <input name="email">\n  <button>OK</button>\n</form>', [['label va type="email" yo\'q', 'Нет label и type="email"', 'No label and no type="email"'], ['method noto\'g\'ri', 'Неверный method', 'Wrong method'], ['button forma ichida bo\'lmaydi', 'button не может быть в форме', 'button is not allowed in a form']], 0, ['Maydonga label va to\'g\'ri tur kerak.', 'Полю нужны label и правильный тип.', 'The field needs a label and the correct type.']),
    match(['Bo\'lim va teg', 'Раздел и тег', 'Section and tag'], [['FAQ', '<details>'], ['Menu', '<nav>'], ['Post', '<article>']], ['FAQ — details, menyu — nav, post — article.', 'FAQ — details, меню — nav, пост — article.', 'FAQ → details, menu → nav, post → article.']),
    mcq(['Landingdagi asosiy chaqiriq (CTA) odatda:', 'Главный призыв (CTA) на лендинге — это обычно:', 'The main CTA on a landing page is usually:'], [['Ko\'zga tashlanadigan tugma/havola', 'Заметная кнопка/ссылка', 'A prominent button/link'], ['Kichik izoh', 'Мелкая сноска', 'A small footnote'], ['Rasm alt matni', 'alt изображения', 'An image alt text']], 0, ['CTA — foydalanuvchini harakatga undaydi.', 'CTA побуждает к действию.', 'A CTA drives action.']),
  ]
);
