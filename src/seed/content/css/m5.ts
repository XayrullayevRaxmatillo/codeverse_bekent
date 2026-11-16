import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

export default mod(
  'css-advanced',
  ['Zamonaviy CSS', 'Современный CSS', 'Modern CSS'],
  ['Psevdo-klasslar, animatsiyalar, moslashuvchanlik va o\'zgaruvchilar.', 'Псевдоклассы, анимации, адаптивность и переменные.', 'Pseudo-classes, animations, responsiveness and variables.'],
  [
    lesson(
      'pseudo-classes',
      ['Psevdo-klasslar', 'Псевдоклассы', 'Pseudo-classes'],
      [
        "Psevdo-klass elementning **holatini** yoki **o'rnini** tanlaydi:\n- `:hover` — sichqoncha ustida\n- `:focus-visible` — klaviatura fokusi (qulaylik uchun muhim!)\n- `:active` — bosilgan payt\n- `:first-child`, `:last-child`\n- `:nth-child(2)`, `:nth-child(odd)`, `:nth-child(even)` — tartib bo'yicha\n- `:not(.x)` — inkor\n\nPsevdo-elementlar ikki nuqta bilan: `::before`, `::after` (`content` xususiyati kerak).",
        "Псевдокласс выбирает **состояние** или **положение** элемента:\n- `:hover` — под курсором\n- `:focus-visible` — фокус с клавиатуры (важно для доступности!)\n- `:active` — в момент нажатия\n- `:first-child`, `:last-child`\n- `:nth-child(2)`, `:nth-child(odd)`, `:nth-child(even)` — по порядку\n- `:not(.x)` — отрицание\n\nПсевдоэлементы пишутся с двумя двоеточиями: `::before`, `::after` (нужно свойство `content`).",
        "A pseudo-class selects an element's **state** or **position**:\n- `:hover` — under the mouse\n- `:focus-visible` — keyboard focus (important for accessibility!)\n- `:active` — while pressed\n- `:first-child`, `:last-child`\n- `:nth-child(2)`, `:nth-child(odd)`, `:nth-child(even)` — by order\n- `:not(.x)` — negation\n\nPseudo-elements use two colons: `::before`, `::after` (they need `content`).",
      ],
      {
        ex: `<ul class="zebra"><li>Bir</li><li>Ikki</li><li>Uch</li><li>To'rt</li></ul>
<button class="btn">Hover qiling</button>
<style>
  .zebra li:nth-child(even) { background: #7c5cfc22; }
  .btn:hover { background: #7c5cfc; color: white; }
  .btn:focus-visible { outline: 3px solid #00d4ff; }
</style>`,
        ch: ch({
          i: ['Jadvalning **juft** qatorlari (`tr:nth-child(even)`) foniga `#eeeeee` bering.', 'Задайте **чётным** строкам таблицы (`tr:nth-child(even)`) фон `#eeeeee`.', 'Give the **even** table rows (`tr:nth-child(even)`) a `#eeeeee` background.'],
          s: { html: '<table>\n  <tr><td>1</td></tr>\n  <tr><td>2</td></tr>\n  <tr><td>3</td></tr>\n  <tr><td>4</td></tr>\n</table>\n', css: '' },
          sol: { html: '<table>\n  <tr><td>1</td></tr>\n  <tr><td>2</td></tr>\n  <tr><td>3</td></tr>\n  <tr><td>4</td></tr>\n</table>\n', css: 'tr:nth-child(even) { background: #eeeeee; }\n' },
          tests: [
            [['juft qatorlar kulrang', 'чётные строки серые', 'even rows are gray'], "$$('tr').filter((_, i) => i % 2 === 1).every(r => css(r, 'background-color') === 'rgb(238, 238, 238)')"],
            [['toq qatorlar o\'zgarmagan', 'нечётные не изменились', 'odd rows unchanged'], "$$('tr').filter((_, i) => i % 2 === 0).every(r => css(r, 'background-color') !== 'rgb(238, 238, 238)')"],
          ],
          rules: [['nth-child', 'nth-child', { t: 'css' }]],
        }),
        q: [
          mcq(['Klaviatura fokusini ko\'rsatish uchun eng yaxshi:', 'Лучший способ показать фокус с клавиатуры:', 'Best for showing keyboard focus:'], [':hover', ':focus-visible', ':active', ':visited'], 1, ['`:focus-visible` faqat klaviatura fokusida ishlaydi.', '`:focus-visible` срабатывает при фокусе с клавиатуры.', '`:focus-visible` targets keyboard focus.']),
          fill(['Har bir uchinchi element:', 'Каждый третий элемент:', 'Every third item:'], 'li:nth-child(___) { color: red; }', ['3n'], ['`3n` — 3, 6, 9...', '`3n` — 3, 6, 9...', '`3n` = 3, 6, 9...'], { d: 'medium' }),
        ],
      }
    ),
    lesson(
      'transitions',
      ['Transition', 'Переходы (transition)', 'Transitions'],
      [
        "`transition` xususiyat o'zgarishini **silliq** qiladi:\n`transition: background-color 0.3s ease;`\n— qaysi xususiyat, davomiyligi, tezlik egri chizig'i (`ease`, `linear`, `ease-in-out`).\n\n`transform` bilan birga ajoyib ishlaydi: `transform: translateY(-4px)` yoki `scale(1.05)`. `transform` va `opacity` ni animatsiya qilish eng tez (GPU).",
        "`transition` делает изменение свойства **плавным**:\n`transition: background-color 0.3s ease;`\n— какое свойство, длительность, кривая скорости (`ease`, `linear`, `ease-in-out`).\n\nОтлично работает с `transform`: `transform: translateY(-4px)` или `scale(1.05)`. Анимировать `transform` и `opacity` быстрее всего (GPU).",
        "`transition` makes property changes **smooth**:\n`transition: background-color 0.3s ease;`\n— which property, duration, timing curve (`ease`, `linear`, `ease-in-out`).\n\nIt pairs great with `transform`: `transform: translateY(-4px)` or `scale(1.05)`. Animating `transform` and `opacity` is fastest (GPU).",
      ],
      {
        ex: `<button class="btn">Bosing</button>
<style>
  .btn { padding: 12px 20px; border: 0; border-radius: 10px; background: #7c5cfc; color: white;
         transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px #7c5cfc66; }
</style>`,
        ch: ch({
          i: ['`.btn` ga `transition: transform 0.3s ease` bering va `:hover` da `transform: scale(1.1)` qiling.', 'Задайте `.btn` `transition: transform 0.3s ease`, а при `:hover` — `transform: scale(1.1)`.', 'Give `.btn` `transition: transform 0.3s ease` and `transform: scale(1.1)` on `:hover`.'],
          s: { html: '<button class="btn">Kattalash</button>\n', css: '.btn {\n\n}\n' },
          sol: { html: '<button class="btn">Kattalash</button>\n', css: '.btn {\n  transition: transform 0.3s ease;\n}\n.btn:hover {\n  transform: scale(1.1);\n}\n' },
          tests: [
            [['transition 0.3s transform', 'transition 0.3s transform', 'transition 0.3s on transform'], "css('.btn', 'transition-duration') === '0.3s' && css('.btn', 'transition-property') === 'transform'"],
            [[':hover da scale(1.1)', 'scale(1.1) при :hover', 'scale(1.1) on :hover'], "[...document.styleSheets].some(s => [...s.cssRules].some(r => r.selectorText === '.btn:hover' && /scale\\(1\\.1\\)/.test(r.style.transform)))"],
          ],
          rules: [['transition', 'transition', { t: 'css' }], [':hover', ':hover', { t: 'css' }]],
        }),
        q: [
          mcq(['Eng samarali animatsiya qilinadigan xususiyatlar:', 'Самые эффективные для анимации свойства:', 'The most efficient properties to animate:'], ['width + height', 'transform + opacity', 'margin + padding', 'top + left'], 1, ['Ular layoutni qayta hisoblatmaydi.', 'Они не вызывают пересчёт раскладки.', "They don't trigger layout recalculation."]),
          tf(['`transition` animatsiyani avtomatik takrorlaydi.', '`transition` автоматически повторяет анимацию.', '`transition` repeats the animation automatically.'], false, ['Transition faqat holat o\'zgarganda ishlaydi; takror — `animation`.', 'Transition срабатывает при смене состояния; повтор — `animation`.', 'Transitions run on state change; loops need `animation`.']),
        ],
      }
    ),
    lesson(
      'animations',
      ['Keyframe animatsiyalar', 'Анимации keyframes', 'Keyframe animations'],
      [
        "`@keyframes` bilan ko'p bosqichli animatsiya yaratiladi:\n```\n@keyframes pulse {\n  0%   { transform: scale(1); }\n  50%  { transform: scale(1.2); }\n  100% { transform: scale(1); }\n}\n```\nKeyin elementga ulanadi: `animation: pulse 1s ease-in-out infinite;` — nomi, davomiyligi, egri chiziq, takrorlar soni.\n\n**Qulaylik:** harakatdan bezovta bo'ladiganlar uchun `@media (prefers-reduced-motion: reduce)` da animatsiyani o'chiring.",
        "`@keyframes` создаёт многошаговую анимацию:\n```\n@keyframes pulse {\n  0%   { transform: scale(1); }\n  50%  { transform: scale(1.2); }\n  100% { transform: scale(1); }\n}\n```\nЗатем она подключается к элементу: `animation: pulse 1s ease-in-out infinite;` — имя, длительность, кривая, число повторов.\n\n**Доступность:** для чувствительных к движению отключайте анимацию в `@media (prefers-reduced-motion: reduce)`.",
        "`@keyframes` defines a multi-step animation:\n```\n@keyframes pulse {\n  0%   { transform: scale(1); }\n  50%  { transform: scale(1.2); }\n  100% { transform: scale(1); }\n}\n```\nThen attach it: `animation: pulse 1s ease-in-out infinite;` — name, duration, curve, iteration count.\n\n**Accessibility:** turn animations off under `@media (prefers-reduced-motion: reduce)` for motion-sensitive users.",
      ],
      {
        ex: `<div class="heart">❤</div>
<style>
  @keyframes beat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }
  .heart { font-size: 48px; display: inline-block; animation: beat 0.8s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) { .heart { animation: none; } }
</style>`,
        ch: ch({
          i: ['`spin` nomli keyframes yarating (0% → `rotate(0deg)`, 100% → `rotate(360deg)`) va `.loader` ga `animation: spin 1s linear infinite` bering.', 'Создайте keyframes `spin` (0% → `rotate(0deg)`, 100% → `rotate(360deg)`) и задайте `.loader` `animation: spin 1s linear infinite`.', 'Create a `spin` keyframes (0% → `rotate(0deg)`, 100% → `rotate(360deg)`) and give `.loader` `animation: spin 1s linear infinite`.'],
          s: { html: '<div class="loader"></div>\n', css: '.loader { width: 40px; height: 40px; border: 4px solid #ddd; border-top-color: #7c5cfc; border-radius: 50%; }\n' },
          sol: { html: '<div class="loader"></div>\n', css: '.loader { width: 40px; height: 40px; border: 4px solid #ddd; border-top-color: #7c5cfc; border-radius: 50%; animation: spin 1s linear infinite; }\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n' },
          tests: [
            [['animation-name: spin', 'animation-name: spin', 'animation-name: spin'], "css('.loader', 'animation-name') === 'spin'"],
            [['cheksiz takror', 'бесконечный повтор', 'infinite loop'], "css('.loader', 'animation-iteration-count') === 'infinite'"],
            [['@keyframes spin mavjud', 'есть @keyframes spin', '@keyframes spin exists'], "[...document.styleSheets].some(s => [...s.cssRules].some(r => r.type === 7 && r.name === 'spin'))"],
          ],
          rules: [['@keyframes\\s+spin', '@keyframes', { t: 'css' }]],
          d: 'medium',
        }),
        q: [
          fill(['Cheksiz takrorlash:', 'Бесконечное повторение:', 'Repeat forever:'], 'animation: pulse 1s ___;', ['infinite'], ['`infinite`.', '`infinite`.', '`infinite`.']),
          mcq(['Harakatni kamaytirishni xohlovchilar uchun media:', 'Media для тех, кто просит меньше движения:', 'Media query for reduced-motion users:'], ['(prefers-reduced-motion: reduce)', '(motion: off)', '(animation: none)', '(reduce-motion)'], 0, ['`prefers-reduced-motion`.', '`prefers-reduced-motion`.', '`prefers-reduced-motion`.']),
        ],
      }
    ),
    lesson(
      'media-queries',
      ['Media query va moslashuvchanlik', 'Media query и адаптивность', 'Media queries and responsiveness'],
      [
        "Media query ekran o'lchamiga qarab boshqa uslub beradi:\n```\n@media (max-width: 600px) {\n  .cards { grid-template-columns: 1fr; }\n}\n```\n**Mobile-first** yondashuvi: avval mobil uchun oddiy uslub yoziladi, keyin `@media (min-width: 768px)` bilan katta ekranlar uchun kengaytiriladi.\n\nUnutmang: `<meta name=\"viewport\">` bo'lmasa mobil brauzer media querylarni to'g'ri qo'llamaydi.",
        "Media query задаёт другой стиль в зависимости от размера экрана:\n```\n@media (max-width: 600px) {\n  .cards { grid-template-columns: 1fr; }\n}\n```\nПодход **mobile-first**: сначала простой стиль для телефона, затем расширение для больших экранов через `@media (min-width: 768px)`.\n\nНе забудьте: без `<meta name=\"viewport\">` мобильный браузер неверно применяет media query.",
        "A media query applies different styles by screen size:\n```\n@media (max-width: 600px) {\n  .cards { grid-template-columns: 1fr; }\n}\n```\nThe **mobile-first** approach: write simple phone styles first, then enhance for larger screens with `@media (min-width: 768px)`.\n\nRemember: without `<meta name=\"viewport\">` mobile browsers won't apply media queries correctly.",
      ],
      {
        ex: `<div class="cards"><div>1</div><div>2</div><div>3</div></div>
<style>
  .cards { display: grid; gap: 8px; grid-template-columns: 1fr; }
  .cards div { background: #22c55e; padding: 20px; }
  @media (min-width: 500px) {
    .cards { grid-template-columns: repeat(3, 1fr); }
  }
</style>
<!-- Ko'rish rejimini Mobil/Desktop qilib almashtirib ko'ring -->`,
        ch: ch({
          i: ['`@media (max-width: 600px)` ichida `.cards` ni **bitta ustunli** qiling (`grid-template-columns: 1fr`). Katta ekranda 3 ustun qolsin.', 'Внутри `@media (max-width: 600px)` сделайте `.cards` **одноколоночным** (`grid-template-columns: 1fr`). На большом экране остаются 3 столбца.', 'Inside `@media (max-width: 600px)`, make `.cards` **single-column** (`grid-template-columns: 1fr`). Keep 3 columns on large screens.'],
          s: { html: '<div class="cards"><div>A</div><div>B</div><div>C</div></div>\n', css: '.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\n' },
          sol: { html: '<div class="cards"><div>A</div><div>B</div><div>C</div></div>\n', css: '.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\n@media (max-width: 600px) {\n  .cards { grid-template-columns: 1fr; }\n}\n' },
          tests: [
            [['katta ekranda 3 ustun', '3 столбца на большом экране', '3 columns on a large screen'], "css('.cards', 'grid-template-columns').split(' ').length === 3"],
            [['600px media query ichida 1fr', '1fr внутри media 600px', '1fr inside the 600px media query'], "[...document.styleSheets].some(s => [...s.cssRules].some(r => r.media && /max-width:\\s*600px/.test(r.conditionText || r.media.mediaText) && [...r.cssRules].some(x => x.selectorText === '.cards' && x.style.gridTemplateColumns === '1fr')))"],
          ],
          rules: [['@media', '@media', { t: 'css' }]],
          d: 'medium',
        }),
        q: [
          mcq(['Mobile-first da qaysi shart ko\'proq ishlatiladi?', 'Какое условие чаще в mobile-first?', 'Which condition is typical for mobile-first?'], ['max-width', 'min-width', 'device-width', 'orientation'], 1, ['Kichikdan boshlab, `min-width` bilan kengaytiramiz.', 'Начинаем с малого и расширяем через `min-width`.', 'Start small, enhance with `min-width`.']),
          tf(['viewport meta tegisiz ham mobil moslashuv to\'g\'ri ishlaydi.', 'Без мета-тега viewport мобильная адаптация работает правильно.', 'Mobile responsiveness works fine without the viewport meta tag.'], false, ['Viewport meta shart.', 'Мета-тег viewport обязателен.', 'The viewport meta tag is required.']),
        ],
      }
    ),
    lesson(
      'css-variables',
      ["CSS o'zgaruvchilari", 'CSS-переменные', 'CSS variables'],
      [
        "CSS o'zgaruvchilari (custom properties) qiymatlarni bir joyda saqlaydi:\n```\n:root {\n  --primary: #7c5cfc;\n  --radius: 12px;\n}\n.btn { background: var(--primary); border-radius: var(--radius); }\n```\nZaxira qiymat: `var(--accent, orange)`. O'zgaruvchilar meros qilinadi va JavaScriptdan o'zgartirilishi mumkin — **dark/light mavzular** shunday quriladi!",
        "CSS-переменные (custom properties) хранят значения в одном месте:\n```\n:root {\n  --primary: #7c5cfc;\n  --radius: 12px;\n}\n.btn { background: var(--primary); border-radius: var(--radius); }\n```\nЗапасное значение: `var(--accent, orange)`. Переменные наследуются и меняются из JavaScript — так строят **тёмную/светлую темы**!",
        "CSS variables (custom properties) keep values in one place:\n```\n:root {\n  --primary: #7c5cfc;\n  --radius: 12px;\n}\n.btn { background: var(--primary); border-radius: var(--radius); }\n```\nFallback: `var(--accent, orange)`. Variables inherit and can be changed from JavaScript — that's how **dark/light themes** are built!",
      ],
      {
        ex: `<div class="theme-dark"><button class="btn">Tugma</button></div>
<style>
  :root { --bg: white; --text: #0b1020; --primary: #7c5cfc; }
  .theme-dark { --bg: #0b1020; --text: #f8fafc; background: var(--bg); color: var(--text); padding: 16px; }
  .btn { background: var(--primary); color: white; border: 0; padding: 8px 14px; border-radius: 8px; }
</style>`,
        ch: ch({
          i: ['`:root` da `--brand: #22c55e` o\'zgaruvchisini yarating va `.title` rangida `var(--brand)` dan foydalaning.', 'Создайте в `:root` переменную `--brand: #22c55e` и используйте `var(--brand)` для цвета `.title`.', 'Create `--brand: #22c55e` in `:root` and use `var(--brand)` for the `.title` color.'],
          s: { html: '<h1 class="title">CODEVERSE</h1>\n', css: '' },
          sol: { html: '<h1 class="title">CODEVERSE</h1>\n', css: ':root {\n  --brand: #22c55e;\n}\n.title {\n  color: var(--brand);\n}\n' },
          tests: [
            [['--brand :root da', '--brand в :root', '--brand on :root'], "getComputedStyle(document.documentElement).getPropertyValue('--brand').trim().toLowerCase() === '#22c55e'"],
            [['title rangi yashil', 'цвет title зелёный', 'title is green'], "css('.title', 'color') === 'rgb(34, 197, 94)'"],
          ],
          rules: [['var\\(\\s*--brand', 'var(--brand)', { t: 'css' }]],
        }),
        q: [
          fill(['O\'zgaruvchidan foydalanish:', 'Использование переменной:', 'Using a variable:'], 'color: ___(--primary);', ['var'], ['`var(--primary)`.', '`var(--primary)`.', '`var(--primary)`.']),
          out(['Matn rangi?', 'Цвет текста?', 'Text color?'], ':root { --c: red; }\n.box { --c: blue; }\n.box p { color: var(--c); }', ['blue'], ['Eng yaqin ota-onadagi qiymat meros qilinadi.', 'Наследуется значение ближайшего предка.', 'The nearest ancestor value is inherited.'], { d: 'medium' }),
        ],
      }
    ),
  ],
  [
    mcq(['Juft elementlarni tanlash:', 'Выбрать чётные элементы:', 'Select even items:'], [':nth-child(odd)', ':nth-child(even)', ':even', ':nth(2)'], 1, ['`:nth-child(even)`.', '`:nth-child(even)`.', '`:nth-child(even)`.']),
    tf(['`@keyframes` animatsiyasi elementga `animation` xususiyati orqali ulanadi.', 'Анимация `@keyframes` подключается через свойство `animation`.', '`@keyframes` are attached via the `animation` property.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
    match(['Moslang', 'Сопоставьте', 'Match'], [['transition', 'state change'], ['animation', 'keyframes'], ['@media', 'screen size']], ['transition — holat, animation — keyframes, @media — ekran.', 'transition — состояние, animation — keyframes, @media — экран.', 'transition → state, animation → keyframes, @media → screen.']),
    fill(['O\'zgaruvchi e\'loni:', 'Объявление переменной:', 'Declaring a variable:'], ':root { ___main: #000; }', ['--'], ['O\'zgaruvchi `--` bilan boshlanadi.', 'Переменная начинается с `--`.', 'Variables start with `--`.']),
    bug(['Nega animatsiya ishlamayapti?', 'Почему анимация не работает?', "Why doesn't the animation run?"], '@keyframes fade { from { opacity: 0 } to { opacity: 1 } }\n.box { animation: fadeIn 1s; }', [['Nom mos emas: fade va fadeIn', 'Имена не совпадают: fade и fadeIn', 'Names differ: fade vs fadeIn'], ['opacity xato', 'Ошибка в opacity', 'opacity is wrong'], ['1s yetarli emas', '1s мало', '1s is too short']], 0, ['animation nomi keyframes nomiga teng bo\'lishi kerak.', 'Имя в animation должно совпадать с keyframes.', 'The animation name must match the keyframes name.']),
    mcq(['600px dan kichik ekranlar uchun:', 'Для экранов уже 600px:', 'For screens narrower than 600px:'], ['@media (min-width: 600px)', '@media (max-width: 600px)', '@screen 600', '@media (width < 600)'], 1, ['`max-width: 600px` — 600px gacha.', '`max-width: 600px` — до 600px.', '`max-width: 600px` = up to 600px.']),
  ]
);
