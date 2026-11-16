import { ch } from '../../helpers';
import m1 from './m1';
import m2 from './m2';
import m3 from './m3';
import m4 from './m4';
import m5 from './m5';

export default {
  slug: 'html',
  world: 'html-island',
  order: 1,
  color: '#F97316',
  icon: 'island',
  prerequisite: null,
  guestModules: 1, // birinchi modul ro'yxatdan o'tmasdan ochiq
  title: ['HTML oroli', 'Остров HTML', 'HTML Island'],
  description: [
    "Veb-sahifalarning poydevori: teglar, havolalar, ro'yxatlar, jadvallar, formalar va semantik tuzilma.",
    'Фундамент веб-страниц: теги, ссылки, списки, таблицы, формы и семантическая структура.',
    'The foundation of web pages: tags, links, lists, tables, forms and semantic structure.',
  ],
  modules: [m1, m2, m3, m4, m5],
  project: ch({
    title: ['Yakuniy loyiha: Portfolio sahifasi', 'Итоговый проект: страница-портфолио', 'Final project: Portfolio page'],
    i: [
      "O'zingiz haqingizda **portfolio sahifasi** yarating. Talablar:\n1. `<header>` ichida `<h1>` (ismingiz) va `<nav>` (kamida 3 ta havola `#` bo'limlarga)\n2. `<main>` ichida kamida **3 ta** `<section>`, har birida `id` va `<h2>`\n3. Ko'nikmalar ro'yxati (`<ul>`, kamida 3 ta `<li>`)\n4. `alt` bilan rasm\n5. Aloqa formasi: `label` bilan bog'langan email `<input type=\"email\" required>` va `<button>`\n6. `<footer>`",
      "Создайте **страницу-портфолио** о себе. Требования:\n1. В `<header>` — `<h1>` (ваше имя) и `<nav>` (минимум 3 ссылки на разделы `#`)\n2. В `<main>` — минимум **3** `<section>`, у каждой `id` и `<h2>`\n3. Список навыков (`<ul>`, минимум 3 `<li>`)\n4. Изображение с `alt`\n5. Форма связи: email `<input type=\"email\" required>`, связанный с `label`, и `<button>`\n6. `<footer>`",
      "Build a **portfolio page** about yourself. Requirements:\n1. In `<header>`: an `<h1>` (your name) and a `<nav>` (at least 3 links to `#` sections)\n2. In `<main>`: at least **3** `<section>`s, each with an `id` and an `<h2>`\n3. A skills list (`<ul>` with at least 3 `<li>`)\n4. An image with `alt`\n5. A contact form: an email `<input type=\"email\" required>` connected to a `label`, and a `<button>`\n6. A `<footer>`",
    ],
    s: { html: '<header>\n  <h1></h1>\n</header>\n<main>\n</main>\n<footer>\n</footer>\n' },
    sol: {
      html: `<header>
  <h1>Aziza Karimova</h1>
  <nav>
    <a href="#about">Men haqimda</a>
    <a href="#skills">Ko'nikmalar</a>
    <a href="#contact">Aloqa</a>
  </nav>
</header>
<main>
  <section id="about">
    <h2>Men haqimda</h2>
    <img src="https://picsum.photos/seed/me/200/200" alt="Aziza portreti" width="200" height="200">
    <p>Men frontend dasturchiman.</p>
  </section>
  <section id="skills">
    <h2>Ko'nikmalar</h2>
    <ul><li>HTML</li><li>CSS</li><li>JavaScript</li></ul>
  </section>
  <section id="contact">
    <h2>Aloqa</h2>
    <form>
      <label for="email">Email</label>
      <input id="email" type="email" required>
      <button type="submit">Yuborish</button>
    </form>
  </section>
</main>
<footer><p>© 2026 Aziza</p></footer>
`,
    },
    tests: [
      [['header ichida h1 va nav', 'h1 и nav в header', 'h1 and nav inside header'], "exists('header h1') && text('header h1').length > 0 && exists('header nav')"],
      [['nav ichida kamida 3 ta # havola', 'Минимум 3 ссылки # в nav', 'At least 3 # links in nav'], "$$('nav a').filter(a => (a.getAttribute('href') || '').startsWith('#')).length >= 3"],
      [['main ichida 3+ section (id va h2 bilan)', '3+ section в main (с id и h2)', '3+ sections in main (with id and h2)'], "$$('main section').filter(s => s.id && s.querySelector('h2')).length >= 3"],
      [['Ko\'nikmalar ro\'yxati (3+ li)', 'Список навыков (3+ li)', 'Skills list (3+ li)'], "$$('ul').some(u => u.querySelectorAll('li').length >= 3)"],
      [['alt bilan rasm', 'Изображение с alt', 'Image with alt'], "$$('img').some(i => (i.getAttribute('alt') || '').trim().length > 0)"],
      [['label bilan bog\'langan required email input', 'Обязательный email-input с label', 'Required email input with a label'], "(() => { const i = $('input[type=email][required]'); return !!i && (!!(i.id && $('label[for=\"' + i.id + '\"]')) || !!i.closest('label')); })()"],
      [['Forma tugmasi va footer', 'Кнопка формы и footer', 'Form button and footer'], "exists('form button') && exists('footer')"],
    ],
    rules: [['<header', 'header', { t: 'html' }], ['<nav', 'nav', { t: 'html' }], ['<section', 'section', { t: 'html' }], ['type\\s*=\\s*["\']email', 'email', { t: 'html' }], ['<footer', 'footer', { t: 'html' }]],
    h: [['Bo\'limlarga havola: <a href="#about"> va <section id="about">.', 'Ссылка на раздел: <a href="#about"> и <section id="about">.', 'Section link: <a href="#about"> and <section id="about">.']],
    x: ['Siz semantik, qulay va to\'liq tuzilgan sahifa yaratdingiz — bu har qanday saytning asosi!', 'Вы создали семантичную, доступную и хорошо структурированную страницу — основу любого сайта!', 'You built a semantic, accessible, well-structured page — the basis of any website!'],
    d: 'medium',
  }),
};
