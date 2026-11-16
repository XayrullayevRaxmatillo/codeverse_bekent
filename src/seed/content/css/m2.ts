import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

export default mod(
  'box-model',
  ['Box model', 'Блочная модель', 'The Box Model'],
  ['Har bir element — quti: padding, border, margin va display.', 'Каждый элемент — коробка: padding, border, margin и display.', 'Every element is a box: padding, border, margin and display.'],
  [
    lesson(
      'box-model-intro',
      ['Quti modeli', 'Модель коробки', 'The box model'],
      [
        "Brauzer har bir elementni **to'rtburchak quti** sifatida chizadi. Ichkaridan tashqariga:\n1. **content** — matn yoki rasm\n2. **padding** — kontent va chegara orasidagi ichki bo'shliq\n3. **border** — chegara chizig'i\n4. **margin** — boshqa elementlar bilan tashqi masofa\n\nQisqa yozuv: `padding: 10px 20px` — yuqori/past 10px, chap/o'ng 20px. `margin: 0 auto` — blokni gorizontal markazlaydi.",
        "Браузер рисует каждый элемент как **прямоугольную коробку**. Изнутри наружу:\n1. **content** — текст или изображение\n2. **padding** — внутренний отступ между контентом и рамкой\n3. **border** — рамка\n4. **margin** — внешний отступ до других элементов\n\nКороткая запись: `padding: 10px 20px` — сверху/снизу 10px, слева/справа 20px. `margin: 0 auto` центрирует блок по горизонтали.",
        "The browser draws every element as a **rectangular box**. From the inside out:\n1. **content** — text or image\n2. **padding** — inner space between content and border\n3. **border** — the border line\n4. **margin** — outer space to other elements\n\nShorthand: `padding: 10px 20px` means 10px top/bottom, 20px left/right. `margin: 0 auto` centers a block horizontally.",
      ],
      {
        ex: `<div class="box">Men qutiman</div>
<style>
  .box {
    width: 200px;
    padding: 20px;
    border: 4px solid #7c5cfc;
    margin: 24px auto;
    background: #00d4ff22;
  }
</style>`,
        ch: ch({
          i: ['`.card` ga `padding: 16px`, `border: 2px solid black` va `margin-bottom: 24px` bering.', 'Задайте `.card` `padding: 16px`, `border: 2px solid black` и `margin-bottom: 24px`.', 'Give `.card` `padding: 16px`, `border: 2px solid black` and `margin-bottom: 24px`.'],
          s: { html: '<div class="card">Kartochka</div>\n', css: '.card {\n\n}\n' },
          sol: { html: '<div class="card">Kartochka</div>\n', css: '.card {\n  padding: 16px;\n  border: 2px solid black;\n  margin-bottom: 24px;\n}\n' },
          tests: [
            [['padding 16px', 'padding 16px', 'padding 16px'], "css('.card', 'padding-top') === '16px' && css('.card', 'padding-left') === '16px'"],
            [['border 2px solid', 'border 2px solid', 'border 2px solid'], "css('.card', 'border-top-width') === '2px' && css('.card', 'border-top-style') === 'solid'"],
            [['margin-bottom 24px', 'margin-bottom 24px', 'margin-bottom 24px'], "css('.card', 'margin-bottom') === '24px'"],
          ],
          rules: [['padding', 'padding', { t: 'css' }]],
        }),
        q: [
          order(['Quti qatlamlari: ichkaridan tashqariga', 'Слои коробки: изнутри наружу', 'Box layers: inside out'], ['content', 'padding', 'border', 'margin'], ['content → padding → border → margin.', 'content → padding → border → margin.', 'content → padding → border → margin.']),
          mcq(['Blokni gorizontal markazlash:', 'Центрировать блок по горизонтали:', 'Center a block horizontally:'], ['margin: 0 auto', 'padding: auto', 'align: center', 'text-align: center'], 0, ['Kengligi berilgan blok `margin: 0 auto` bilan markazlanadi.', 'Блок с заданной шириной центрируется `margin: 0 auto`.', 'A block with a set width is centered with `margin: 0 auto`.']),
        ],
      }
    ),
    lesson(
      'box-sizing',
      ['Width, height va box-sizing', 'Width, height и box-sizing', 'Width, height and box-sizing'],
      [
        "Standart holatda (`box-sizing: content-box`) `width` faqat kontentga tegishli: padding va border **ustiga qo'shiladi**. `width: 200px; padding: 20px; border: 5px` → haqiqiy kenglik 250px!\n\n`box-sizing: border-box` bilan `width` padding va border ni ham o'z ichiga oladi — hisoblash ancha oson. Ko'p loyihalar shunday boshlanadi:\n`*, *::before, *::after { box-sizing: border-box; }`\n\n`max-width` — elementni ma'lum kenglikdan oshirmaydi (moslashuvchan dizayn uchun foydali).",
        "По умолчанию (`box-sizing: content-box`) `width` относится только к контенту: padding и border **прибавляются сверху**. `width: 200px; padding: 20px; border: 5px` → реальная ширина 250px!\n\nС `box-sizing: border-box` `width` включает padding и border — считать гораздо проще. Многие проекты начинаются так:\n`*, *::before, *::after { box-sizing: border-box; }`\n\n`max-width` не даёт элементу стать шире заданного (полезно для адаптивности).",
        "By default (`box-sizing: content-box`) `width` applies only to the content: padding and border are **added on top**. `width: 200px; padding: 20px; border: 5px` → the real width is 250px!\n\nWith `box-sizing: border-box`, `width` includes padding and border — much easier math. Many projects start with:\n`*, *::before, *::after { box-sizing: border-box; }`\n\n`max-width` stops an element from growing past a width (great for responsiveness).",
      ],
      {
        ex: `<div class="a">content-box</div>
<div class="b">border-box</div>
<style>
  div { width: 200px; padding: 20px; border: 5px solid #f59e0b; margin: 8px 0; }
  .a { box-sizing: content-box; } /* 250px */
  .b { box-sizing: border-box; }  /* 200px */
</style>`,
        ch: ch({
          i: ['`.panel` ning umumiy kengligi padding va border bilan birga aynan **300px** bo\'lsin (`box-sizing` dan foydalaning).', 'Сделайте полную ширину `.panel` вместе с padding и border ровно **300px** (используйте `box-sizing`).', 'Make the total width of `.panel`, including padding and border, exactly **300px** (use `box-sizing`).'],
          s: { html: '<div class="panel">Panel</div>\n', css: '.panel {\n  width: 300px;\n  padding: 24px;\n  border: 3px solid #333;\n}\n' },
          sol: { html: '<div class="panel">Panel</div>\n', css: '.panel {\n  width: 300px;\n  padding: 24px;\n  border: 3px solid #333;\n  box-sizing: border-box;\n}\n' },
          tests: [[['Umumiy kenglik 300px', 'Полная ширина 300px', 'Total width is 300px'], "$('.panel').getBoundingClientRect().width === 300"]],
          rules: [['box-sizing\\s*:\\s*border-box', 'border-box', { t: 'css' }]],
        }),
        q: [
          out(['content-box da haqiqiy kenglik?', 'Реальная ширина при content-box?', 'Real width with content-box?'], '.x { width: 100px; padding: 10px; border: 2px solid; }', ['124px', '124'], ['100 + 10×2 + 2×2 = 124px.', '100 + 10×2 + 2×2 = 124px.', '100 + 10×2 + 2×2 = 124px.'], { d: 'medium' }),
          tf(['`border-box` da padding kenglikka qo\'shilmaydi (ichiga kiradi).', 'При `border-box` padding входит в ширину, а не прибавляется.', 'With `border-box`, padding is included in the width.'], true, ['Shu sababli u qulay.', 'Поэтому он удобен.', "That's why it's convenient."]),
        ],
      }
    ),
    lesson(
      'borders-shadows',
      ['Chegara, radius va soya', 'Рамки, скругление и тени', 'Borders, radius and shadows'],
      [
        "- `border: 2px solid #ccc` — qalinlik, uslub (`solid`, `dashed`, `dotted`), rang\n- `border-radius: 12px` — burchaklarni yumaloqlash; `50%` — doira\n- `box-shadow: 0 4px 12px rgba(0,0,0,.2)` — soya: X, Y, xiralik, rang\n- `outline` — chegaraga o'xshash, lekin joy egallamaydi (fokus uchun ishlatiladi)",
        "- `border: 2px solid #ccc` — толщина, стиль (`solid`, `dashed`, `dotted`), цвет\n- `border-radius: 12px` — скругление углов; `50%` — круг\n- `box-shadow: 0 4px 12px rgba(0,0,0,.2)` — тень: X, Y, размытие, цвет\n- `outline` — похож на рамку, но не занимает места (используется для фокуса)",
        "- `border: 2px solid #ccc` — width, style (`solid`, `dashed`, `dotted`), color\n- `border-radius: 12px` — rounded corners; `50%` makes a circle\n- `box-shadow: 0 4px 12px rgba(0,0,0,.2)` — shadow: X, Y, blur, color\n- `outline` — like a border but takes no space (used for focus)",
      ],
      {
        ex: `<img class="avatar" src="https://picsum.photos/seed/av/96/96" alt="Avatar">
<div class="card">Soyali kartochka</div>
<style>
  .avatar { border-radius: 50%; border: 3px solid #7c5cfc; }
  .card { padding: 16px; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,.15); }
</style>`,
        ch: ch({
          i: ['`.avatar` ni doira qiling (`border-radius: 50%`), `.card` ga `border-radius: 12px` va istalgan `box-shadow` bering.', 'Сделайте `.avatar` круглым (`border-radius: 50%`), а `.card` задайте `border-radius: 12px` и любую `box-shadow`.', 'Make `.avatar` a circle (`border-radius: 50%`) and give `.card` `border-radius: 12px` and any `box-shadow`.'],
          s: { html: '<img class="avatar" src="https://picsum.photos/seed/a/80/80" alt="Avatar" width="80" height="80">\n<div class="card">Salom</div>\n', css: '' },
          sol: { html: '<img class="avatar" src="https://picsum.photos/seed/a/80/80" alt="Avatar" width="80" height="80">\n<div class="card">Salom</div>\n', css: '.avatar { border-radius: 50%; }\n.card { border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); }\n' },
          tests: [
            [['avatar doira', 'avatar — круг', 'avatar is a circle'], "css('.avatar', 'border-top-left-radius') === '50%'"],
            [['card radius 12px', 'card radius 12px', 'card radius 12px'], "css('.card', 'border-top-left-radius') === '12px'"],
            [['card soyasi bor', 'у card есть тень', 'card has a shadow'], "css('.card', 'box-shadow') !== 'none'"],
          ],
          rules: [['box-shadow', 'box-shadow', { t: 'css' }]],
        }),
        q: [
          mcq(['Kvadratni doiraga aylantirish:', 'Превратить квадрат в круг:', 'Turn a square into a circle:'], ['border-radius: 50%', 'border: circle', 'shape: round', 'radius: 100'], 0, ['`border-radius: 50%`.', '`border-radius: 50%`.', '`border-radius: 50%`.']),
          tf(['`outline` elementning o\'lchamiga ta\'sir qiladi.', '`outline` влияет на размер элемента.', '`outline` affects the element size.'], false, ['`outline` joy egallamaydi.', '`outline` не занимает места.', '`outline` takes no space.']),
        ],
      }
    ),
    lesson(
      'display',
      ['Display xususiyati', 'Свойство display', 'The display property'],
      [
        "`display` element qanday joylashishini belgilaydi:\n- `block` — butun kenglik, yangi qatordan (div, p)\n- `inline` — matn ichida; `width/height` ishlamaydi (span, a)\n- `inline-block` — qatorda turadi, lekin o'lcham olsa bo'ladi\n- `none` — element butunlay yashiriladi (joy ham egallamaydi)\n- `flex` va `grid` — zamonaviy layout tizimlari (keyingi modullarda!)\n\n`visibility: hidden` esa elementni ko'rinmas qiladi, lekin joyini saqlaydi.",
        "`display` определяет, как элемент располагается:\n- `block` — во всю ширину, с новой строки (div, p)\n- `inline` — внутри текста; `width/height` не работают (span, a)\n- `inline-block` — стоит в строке, но может иметь размеры\n- `none` — элемент полностью скрыт (и не занимает места)\n- `flex` и `grid` — современные системы раскладки (в следующих модулях!)\n\nА `visibility: hidden` делает элемент невидимым, но сохраняет его место.",
        "`display` defines how an element is laid out:\n- `block` — full width, starts on a new line (div, p)\n- `inline` — inside text; `width/height` don't apply (span, a)\n- `inline-block` — sits in the line but can have a size\n- `none` — the element is completely hidden (takes no space)\n- `flex` and `grid` — modern layout systems (coming next!)\n\n`visibility: hidden` hides an element but keeps its space.",
      ],
      {
        ex: `<a class="btn" href="#">Tugma 1</a>
<a class="btn" href="#">Tugma 2</a>
<p class="secret">Yashirin matn</p>
<style>
  .btn { display: inline-block; padding: 8px 16px; background: #7c5cfc; color: white; border-radius: 8px; }
  .secret { display: none; }
</style>`,
        ch: ch({
          i: ['`.tag` larni `inline-block` qilib, `width: 80px` bering. `.hidden` elementni `display: none` bilan yashiring.', 'Сделайте `.tag` `inline-block` с `width: 80px`. Скройте `.hidden` через `display: none`.', 'Make `.tag`s `inline-block` with `width: 80px`. Hide `.hidden` with `display: none`.'],
          s: { html: '<span class="tag">HTML</span>\n<span class="tag">CSS</span>\n<p class="hidden">Meni yashiring</p>\n', css: '' },
          sol: { html: '<span class="tag">HTML</span>\n<span class="tag">CSS</span>\n<p class="hidden">Meni yashiring</p>\n', css: '.tag { display: inline-block; width: 80px; }\n.hidden { display: none; }\n' },
          tests: [
            [['tag kengligi 80px', 'ширина tag 80px', 'tag width is 80px'], "$$('.tag').every(t => t.getBoundingClientRect().width === 80)"],
            [['hidden ko\'rinmaydi', 'hidden скрыт', 'hidden is not displayed'], "css('.hidden', 'display') === 'none'"],
          ],
          rules: [['inline-block', 'inline-block', { t: 'css' }]],
        }),
        q: [
          mcq(['`width` qaysi display da ishlamaydi?', 'При каком display не работает `width`?', 'With which display does `width` not apply?'], ['block', 'inline', 'inline-block', 'flex'], 1, ['Inline elementlar kontent bo\'yicha o\'lchanadi.', 'Строчные элементы имеют размер по контенту.', 'Inline elements size to their content.']),
          tf(['`display: none` va `visibility: hidden` bir xil ishlaydi.', '`display: none` и `visibility: hidden` работают одинаково.', '`display: none` and `visibility: hidden` behave the same.'], false, ['`visibility: hidden` joyni saqlaydi.', '`visibility: hidden` сохраняет место.', '`visibility: hidden` keeps the space.']),
        ],
      }
    ),
    lesson(
      'backgrounds',
      ['Fon va gradientlar', 'Фоны и градиенты', 'Backgrounds and gradients'],
      [
        "Fon xususiyatlari:\n- `background-color` — bir xil rang\n- `background-image: url(...)` — rasm\n- `background-size: cover` — rasm qutini to'liq qoplaydi\n- `background-position: center` — joylashuv\n- `linear-gradient(90deg, #7c5cfc, #00d4ff)` — chiziqli gradient (rasm sifatida ishlaydi!)\n- `radial-gradient(...)` — doiraviy gradient\n\nQisqa yozuv: `background: linear-gradient(...)`.",
        "Свойства фона:\n- `background-color` — сплошной цвет\n- `background-image: url(...)` — изображение\n- `background-size: cover` — картинка покрывает блок целиком\n- `background-position: center` — позиция\n- `linear-gradient(90deg, #7c5cfc, #00d4ff)` — линейный градиент (работает как изображение!)\n- `radial-gradient(...)` — радиальный градиент\n\nКороткая запись: `background: linear-gradient(...)`.",
        "Background properties:\n- `background-color` — a solid color\n- `background-image: url(...)` — an image\n- `background-size: cover` — the image covers the whole box\n- `background-position: center` — positioning\n- `linear-gradient(90deg, #7c5cfc, #00d4ff)` — a linear gradient (acts as an image!)\n- `radial-gradient(...)` — a radial gradient\n\nShorthand: `background: linear-gradient(...)`.",
      ],
      {
        ex: `<section class="hero">CODEVERSE</section>
<style>
  .hero {
    height: 160px;
    display: grid;
    place-items: center;
    color: white;
    font-size: 32px;
    background: linear-gradient(135deg, #7c5cfc, #00d4ff);
    border-radius: 16px;
  }
</style>`,
        ch: ch({
          i: ['`.banner` foniga `linear-gradient` bering (istalgan 2 rang) va `min-height: 120px`.', 'Задайте фону `.banner` `linear-gradient` (любые 2 цвета) и `min-height: 120px`.', 'Give `.banner` a `linear-gradient` background (any 2 colors) and `min-height: 120px`.'],
          s: { html: '<div class="banner">Chegirma!</div>\n', css: '.banner {\n\n}\n' },
          sol: { html: '<div class="banner">Chegirma!</div>\n', css: '.banner {\n  background: linear-gradient(90deg, #f59e0b, #ef4444);\n  min-height: 120px;\n}\n' },
          tests: [
            [['linear-gradient fon', 'фон linear-gradient', 'linear-gradient background'], "css('.banner', 'background-image').startsWith('linear-gradient')"],
            [['balandlik ≥ 120px', 'высота ≥ 120px', 'height ≥ 120px'], "$('.banner').getBoundingClientRect().height >= 120"],
          ],
          rules: [['linear-gradient', 'gradient', { t: 'css' }]],
        }),
        q: [
          mcq(['Rasm qutini to\'liq qoplasin:', 'Картинка должна покрыть весь блок:', 'Make the image cover the whole box:'], ['background-size: cover', 'background-fit: full', 'background: stretch', 'object: fill'], 0, ['`cover` nisbatni saqlab qoplaydi.', '`cover` покрывает, сохраняя пропорции.', '`cover` fills while keeping proportions.']),
          tf(['Gradient `background-image` sifatida ishlaydi.', 'Градиент работает как `background-image`.', 'A gradient works as a `background-image`.'], true, ['Gradient — generatsiya qilingan rasm.', 'Градиент — сгенерированное изображение.', 'A gradient is a generated image.']),
        ],
      }
    ),
  ],
  [
    mcq(['Kontent va border orasidagi bo\'shliq:', 'Пространство между контентом и рамкой:', 'Space between content and border:'], ['margin', 'padding', 'gap', 'outline'], 1, ['`padding` — ichki bo\'shliq.', '`padding` — внутренний отступ.', '`padding` is inner space.']),
    out(['border-box da kenglik?', 'Ширина при border-box?', 'Width with border-box?'], '.x { box-sizing: border-box; width: 200px; padding: 30px; border: 5px solid; }', ['200px', '200'], ['border-box da width hammasini o\'z ichiga oladi.', 'При border-box width включает всё.', 'With border-box, width includes everything.']),
    tf(['`display: none` elementni joyi bilan birga yo\'qotadi.', '`display: none` убирает элемент вместе с его местом.', '`display: none` removes the element and its space.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
    fill(['Yumaloq burchak:', 'Скругление углов:', 'Rounded corners:'], '.card { ___: 12px; }', ['border-radius'], ['`border-radius`.', '`border-radius`.', '`border-radius`.']),
    match(['Display va xatti-harakat', 'Display и поведение', 'Display and behavior'], [['block', 'new line'], ['inline', 'in text'], ['none', 'hidden']], ['block — yangi qator, inline — matn ichida, none — yashirin.', 'block — новая строка, inline — в тексте, none — скрыт.', 'block → new line, inline → in text, none → hidden.']),
    bug(['Nega span 100px bo\'lmayapti?', 'Почему span не становится 100px?', "Why isn't the span 100px wide?"], 'span { width: 100px; }', [['span — inline, width ishlamaydi', 'span — inline, width не работает', 'span is inline; width does not apply'], ['px xato', 'Ошибка в px', 'px is wrong'], ['span selektori yo\'q', 'Нет селектора span', 'No span selector']], 0, ['`display: inline-block` qo\'shing.', 'Добавьте `display: inline-block`.', 'Add `display: inline-block`.'], { d: 'medium' }),
  ]
);
