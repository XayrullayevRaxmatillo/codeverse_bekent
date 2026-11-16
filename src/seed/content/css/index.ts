import { ch } from '../../helpers';
import m1 from './m1';
import m2 from './m2';
import m3 from './m3';
import m4 from './m4';
import m5 from './m5';

const html = `<section class="pricing">
  <article class="plan">
    <h3>Bepul</h3>
    <p class="price">0 so'm</p>
    <a class="btn" href="#">Boshlash</a>
  </article>
  <article class="plan featured">
    <h3>Pro</h3>
    <p class="price">49 000 so'm</p>
    <a class="btn" href="#">Tanlash</a>
  </article>
  <article class="plan">
    <h3>Jamoa</h3>
    <p class="price">199 000 so'm</p>
    <a class="btn" href="#">Bog'lanish</a>
  </article>
</section>
`;

export default {
  slug: 'css',
  world: 'css-forest',
  order: 2,
  color: '#22C55E',
  icon: 'trees',
  prerequisite: 'html',
  title: ["CSS o'rmoni", 'Лес CSS', 'CSS Forest'],
  description: [
    "Sahifalarga hayot baxsh eting: ranglar, box model, Flexbox, Grid, animatsiyalar va moslashuvchan dizayn.",
    'Оживите страницы: цвета, блочная модель, Flexbox, Grid, анимации и адаптивный дизайн.',
    'Bring pages to life: colors, the box model, Flexbox, Grid, animations and responsive design.',
  ],
  modules: [m1, m2, m3, m4, m5],
  project: ch({
    title: ['Yakuniy loyiha: Narxlar sahifasi', 'Итоговый проект: страница тарифов', 'Final project: Pricing page'],
    i: [
      "Tayyor HTML uchun **moslashuvchan narxlar bo'limi** uslubini yozing:\n1. `:root` da kamida 2 ta CSS o'zgaruvchi (masalan `--primary`) va ulardan `var()` orqali foydalaning\n2. `.pricing` — `display: grid`, 3 ta ustun (katta ekranda) va `gap`\n3. `.plan` — `padding`, `border-radius`, `box-shadow`\n4. `.featured` boshqalardan ajralib tursin (boshqa fon yoki `transform: scale(...)`)\n5. `.btn` — `inline-block`, `transition` va `:hover` uslubi\n6. `@media (max-width: 700px)` da kartochkalar bitta ustunga tushsin",
      "Напишите стили **адаптивного блока тарифов** для готового HTML:\n1. Минимум 2 CSS-переменные в `:root` (например `--primary`) и их использование через `var()`\n2. `.pricing` — `display: grid`, 3 столбца (на большом экране) и `gap`\n3. `.plan` — `padding`, `border-radius`, `box-shadow`\n4. `.featured` выделяется (другой фон или `transform: scale(...)`)\n5. `.btn` — `inline-block`, `transition` и стиль `:hover`\n6. В `@media (max-width: 700px)` карточки идут в один столбец",
      "Style a **responsive pricing section** for the given HTML:\n1. At least 2 CSS variables in `:root` (e.g. `--primary`) used via `var()`\n2. `.pricing` — `display: grid`, 3 columns (on large screens) and a `gap`\n3. `.plan` — `padding`, `border-radius`, `box-shadow`\n4. `.featured` stands out (different background or `transform: scale(...)`)\n5. `.btn` — `inline-block`, a `transition` and a `:hover` style\n6. Under `@media (max-width: 700px)` the cards stack into one column",
    ],
    s: { html, css: ':root {\n\n}\n\n.pricing {\n\n}\n' },
    sol: {
      html,
      css: `:root {
  --primary: #7c5cfc;
  --radius: 16px;
}
.pricing {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 24px;
}
.plan {
  padding: 24px;
  border-radius: var(--radius);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  text-align: center;
  background: white;
}
.featured {
  background: var(--primary);
  color: white;
  transform: scale(1.05);
}
.btn {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 10px;
  background: #0b1020;
  color: white;
  text-decoration: none;
  transition: transform 0.2s ease;
}
.btn:hover {
  transform: translateY(-2px);
}
@media (max-width: 700px) {
  .pricing {
    grid-template-columns: 1fr;
  }
}
`,
    },
    tests: [
      [['2+ CSS o\'zgaruvchi va var()', '2+ CSS-переменные и var()', '2+ CSS variables used with var()'], "(() => { const root = [...document.styleSheets].flatMap(s => [...s.cssRules]).find(r => r.selectorText === ':root'); const vars = root ? [...root.style].filter(p => p.startsWith('--')) : []; const used = [...document.styleSheets].flatMap(s => [...s.cssRules]).some(r => r.cssText && r.selectorText !== ':root' && r.cssText.includes('var(--')); return vars.length >= 2 && used; })()"],
      [['.pricing — grid, 3 ustun, gap', '.pricing — grid, 3 столбца, gap', '.pricing — grid, 3 columns, gap'], "css('.pricing', 'display') === 'grid' && css('.pricing', 'grid-template-columns').split(' ').length === 3 && css('.pricing', 'column-gap') !== 'normal' && css('.pricing', 'column-gap') !== '0px'"],
      [['.plan — padding, radius, soya', '.plan — padding, radius, тень', '.plan — padding, radius, shadow'], "$$('.plan').every(p => css(p, 'padding-top') !== '0px' && css(p, 'border-top-left-radius') !== '0px' && css(p, 'box-shadow') !== 'none')"],
      [['.featured ajralib turadi', '.featured выделяется', '.featured stands out'], "css('.featured', 'background-color') !== css('.plan:not(.featured)', 'background-color') || css('.featured', 'transform') !== 'none'"],
      [['.btn — inline-block va transition', '.btn — inline-block и transition', '.btn — inline-block and transition'], "css('.btn', 'display') === 'inline-block' && css('.btn', 'transition-duration') !== '0s'"],
      [['.btn:hover uslubi', 'стиль .btn:hover', '.btn:hover style'], "[...document.styleSheets].flatMap(s => [...s.cssRules]).some(r => (r.selectorText || '').includes('.btn:hover'))"],
      [['700px media query da 1 ustun', '1 столбец в media 700px', '1 column in the 700px media query'], "[...document.styleSheets].flatMap(s => [...s.cssRules]).some(r => r.media && /max-width:\\s*700px/.test(r.conditionText || r.media.mediaText) && [...r.cssRules].some(x => x.selectorText === '.pricing' && x.style.gridTemplateColumns === '1fr'))"],
    ],
    rules: [['--[a-z]', 'css var', { t: 'css' }], ['display\\s*:\\s*grid', 'grid', { t: 'css' }], ['@media', '@media', { t: 'css' }], ['transition', 'transition', { t: 'css' }]],
    h: [['Mobil versiya: @media (max-width: 700px) { .pricing { grid-template-columns: 1fr; } }', 'Мобильная версия: @media (max-width: 700px) { .pricing { grid-template-columns: 1fr; } }', 'Mobile: @media (max-width: 700px) { .pricing { grid-template-columns: 1fr; } }']],
    x: ['Siz o\'zgaruvchilar, Grid, soyalar, animatsiya va moslashuvchanlikni bitta real komponentda birlashtirdingiz!', 'Вы объединили переменные, Grid, тени, анимацию и адаптивность в одном реальном компоненте!', 'You combined variables, Grid, shadows, animation and responsiveness in one real component!'],
    d: 'hard',
  }),
};
