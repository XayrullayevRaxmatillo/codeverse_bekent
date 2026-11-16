import { ch } from '../../helpers';
import m1 from './m1';
import m2 from './m2';
import m3 from './m3';
import m4 from './m4';
import m5 from './m5';

const data = `const { useState } = React;

const PRODUCTS = [
  { id: 1, name: "Klaviatura", price: 250000 },
  { id: 2, name: "Sichqoncha", price: 120000 },
  { id: 3, name: "Monitor", price: 1900000 },
];
`;

export default {
  slug: 'react',
  world: 'react-city',
  order: 4,
  color: '#06B6D4',
  icon: 'city',
  prerequisite: 'javascript',
  title: ['React shahri', 'Город React', 'React City'],
  description: [
    "Zamonaviy interfeyslar: komponentlar, state, effektlar, hooklar va real ilovalar.",
    'Современные интерфейсы: компоненты, state, эффекты, хуки и реальные приложения.',
    'Modern interfaces: components, state, effects, hooks and real apps.',
  ],
  modules: [m1, m2, m3, m4, m5],
  project: ch({
    mode: 'react',
    title: ["Yakuniy loyiha: Mini do'kon", 'Итоговый проект: мини-магазин', 'Final project: Mini shop'],
    i: [
      "**Mini do'kon** yarating (`PRODUCTS` massivi tayyor):\n1. Har bir mahsulot `<article className=\"product\">` ichida: nomi, narxi va `<button className=\"add\">`\n2. Savat — state. Bir mahsulot qayta qo'shilsa yangi qator emas, **miqdori** oshsin\n3. `<span className=\"cart-count\">` — savatdagi jami dona soni\n4. `<span className=\"cart-total\">` — jami summa (son, formatlanmagan)\n5. Savatdagi har bir qator `<li className=\"cart-item\">` va unda `<button className=\"remove\">` (qatorni butunlay o'chiradi)\n6. Savat bo'sh bo'lsa `<p className=\"empty\">Savat bo'sh</p>`",
      "Создайте **мини-магазин** (массив `PRODUCTS` готов):\n1. Каждый товар в `<article className=\"product\">`: название, цена и `<button className=\"add\">`\n2. Корзина — state. При повторном добавлении товара не новая строка, а увеличение **количества**\n3. `<span className=\"cart-count\">` — общее число штук в корзине\n4. `<span className=\"cart-total\">` — общая сумма (число, без форматирования)\n5. Каждая строка корзины — `<li className=\"cart-item\">` с `<button className=\"remove\">` (удаляет строку целиком)\n6. Пустая корзина — `<p className=\"empty\">Savat bo'sh</p>`",
      "Build a **mini shop** (the `PRODUCTS` array is provided):\n1. Each product in an `<article className=\"product\">`: name, price and a `<button className=\"add\">`\n2. The cart is state. Adding the same product again increases its **quantity** instead of adding a row\n3. `<span className=\"cart-count\">` — total number of units in the cart\n4. `<span className=\"cart-total\">` — the total sum (a plain number)\n5. Each cart row is an `<li className=\"cart-item\">` with a `<button className=\"remove\">` (removes the whole row)\n6. When the cart is empty, show `<p className=\"empty\">Savat bo'sh</p>`",
    ],
    s: { js: data + '\nfunction App() {\n  return (\n    <main>\n      <h1>Mini do\'kon</h1>\n    </main>\n  );\n}\n' },
    sol: {
      js:
        data +
        `
function ProductCard({ product, onAdd }) {
  return (
    <article className="product">
      <h3>{product.name}</h3>
      <p>{product.price} so'm</p>
      <button className="add" onClick={() => onAdd(product)}>Savatga</button>
    </article>
  );
}

function Cart({ items, onRemove }) {
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  return (
    <aside>
      <h2>Savat (<span className="cart-count">{count}</span>)</h2>
      {items.length === 0 ? (
        <p className="empty">Savat bo'sh</p>
      ) : (
        <ul>
          {items.map((i) => (
            <li className="cart-item" key={i.id}>
              {i.name} × {i.qty}
              <button className="remove" onClick={() => onRemove(i.id)}>✕</button>
            </li>
          ))}
        </ul>
      )}
      <p>Jami: <span className="cart-total">{total}</span></p>
    </aside>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  function add(product) {
    setCart((items) => {
      const found = items.find((i) => i.id === product.id);
      if (found) return items.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...items, { ...product, qty: 1 }];
    });
  }
  const remove = (id) => setCart((items) => items.filter((i) => i.id !== id));
  return (
    <main>
      <h1>Mini do'kon</h1>
      {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} onAdd={add} />)}
      <Cart items={cart} onRemove={remove} />
    </main>
  );
}
`,
    },
    tests: [
      [['3 ta mahsulot kartochkasi', '3 карточки товаров', '3 product cards'], "$$('.product').length === 3 && $$('.product .add').length === 3"],
      [['boshida savat bo\'sh', 'сначала корзина пуста', 'cart empty at first'], "exists('.empty') && text('.cart-count') === '0' && text('.cart-total') === '0'"],
      [['qo\'shish: 2× klaviatura + 1× sichqoncha', 'добавить: 2× клавиатура + 1× мышь', 'add: 2× keyboard + 1× mouse'], "(async () => { const b = $$('.add'); b[0].click(); await tick(); b[0].click(); await tick(); b[1].click(); await tick(); return $$('.cart-item').length === 2 && text('.cart-count') === '3' && text('.cart-total') === '620000' && !exists('.empty'); })()"],
      [['o\'chirish', 'удаление', 'removing'], "(async () => { $$('.remove')[0].click(); await tick(); return $$('.cart-item').length === 1 && text('.cart-count') === '1' && text('.cart-total') === '120000'; })()"],
      [['oxirgisini o\'chirsa — bo\'sh', 'удалить последний — пусто', 'remove the last → empty'], "(async () => { $('.remove').click(); await tick(); return exists('.empty') && text('.cart-total') === '0'; })()"],
    ],
    rules: [['useState', 'useState', { t: 'js' }], ['\\.map\\(', 'map', { t: 'js' }], ['className="?\\s*cart-total|cart-total', 'cart-total', { t: 'js' }]],
    h: [['Savat elementi: { ...product, qty }. Qo\'shishda find bilan tekshiring, bor bo\'lsa map bilan qty+1.', 'Элемент корзины: { ...product, qty }. При добавлении проверьте через find; если есть — map с qty+1.', 'A cart item is { ...product, qty }. On add, check with find; if present, map with qty+1.']],
    x: ['Tabriklaymiz! Siz komponentlar, props, state, hosilaviy qiymatlar va immutable yangilanishlardan foydalanib haqiqiy React ilova yaratdingiz.', 'Поздравляем! Вы создали настоящее React-приложение с компонентами, props, state, производными значениями и иммутабельными обновлениями.', 'Congratulations! You built a real React app with components, props, state, derived values and immutable updates.'],
    d: 'hard',
  }),
};
