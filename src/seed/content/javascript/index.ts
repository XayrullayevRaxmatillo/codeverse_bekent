import { ch } from '../../helpers';
import m1 from './m1';
import m2 from './m2';
import m3 from './m3';
import m4 from './m4';
import m5 from './m5';

const html = `<main class="app">
  <h1>Vazifalar</h1>
  <form id="todo-form">
    <input id="todo-input" placeholder="Yangi vazifa..." autocomplete="off">
    <button type="submit">Qo'shish</button>
  </form>
  <ul id="todo-list"></ul>
  <p><span id="todo-count">0</span> ta bajarilmagan</p>
</main>
`;
const css = `.app { max-width: 420px; font-family: system-ui; }
#todo-list { list-style: none; padding: 0; }
#todo-list li { display: flex; gap: 8px; align-items: center; padding: 6px 0; }
#todo-list li.done span { text-decoration: line-through; opacity: .6; }
`;

export default {
  slug: 'javascript',
  world: 'javascript-kingdom',
  order: 3,
  color: '#EAB308',
  icon: 'castle',
  prerequisite: 'css',
  title: ['JavaScript qirolligi', 'Королевство JavaScript', 'JavaScript Kingdom'],
  description: [
    "Dasturlash mantiqi: o'zgaruvchilar, funksiyalar, massivlar, DOM, hodisalar va API bilan ishlash.",
    'Логика программирования: переменные, функции, массивы, DOM, события и работа с API.',
    'Programming logic: variables, functions, arrays, the DOM, events and working with APIs.',
  ],
  modules: [m1, m2, m3, m4, m5],
  project: ch({
    title: ['Yakuniy loyiha: Todo ilova', 'Итоговый проект: Todo-приложение', 'Final project: Todo app'],
    i: [
      "To'liq ishlaydigan **vazifalar ilovasini** yarating (HTML/CSS tayyor):\n1. Forma yuborilganda (`submit`, sahifa qayta yuklanmasin) inputdagi matn bilan `#todo-list` ga yangi `<li>` qo'shilsin; bo'sh matn qo'shilmasin; input tozalansin\n2. Har bir `<li>` ichida: `<input type=\"checkbox\">`, `<span>` (matn) va `class=\"delete\"` tugma\n3. Checkbox bosilganda `<li>` ga `done` classi qo'shilsin/olib tashlansin\n4. `.delete` bosilganda vazifa o'chirilsin\n5. `#todo-count` doim **bajarilmagan** vazifalar sonini ko'rsatsin\n\n💡 Ma'lumotni massivda saqlab, har o'zgarishda ro'yxatni qayta chizish — eng toza usul.",
      "Создайте полностью рабочее **приложение задач** (HTML/CSS готовы):\n1. При `submit` формы (без перезагрузки) в `#todo-list` добавляется `<li>` с текстом из поля; пустой текст не добавляется; поле очищается\n2. В каждом `<li>`: `<input type=\"checkbox\">`, `<span>` (текст) и кнопка `class=\"delete\"`\n3. Клик по checkbox добавляет/убирает у `<li>` класс `done`\n4. Клик по `.delete` удаляет задачу\n5. `#todo-count` всегда показывает число **невыполненных** задач\n\n💡 Самый чистый способ — хранить данные в массиве и перерисовывать список при каждом изменении.",
      "Build a fully working **todo app** (HTML/CSS are provided):\n1. On form `submit` (no reload), add an `<li>` with the input text to `#todo-list`; ignore empty text; clear the input\n2. Each `<li>` contains an `<input type=\"checkbox\">`, a `<span>` (the text) and a `class=\"delete\"` button\n3. Clicking the checkbox toggles the `done` class on the `<li>`\n4. Clicking `.delete` removes the task\n5. `#todo-count` always shows the number of **unfinished** tasks\n\n💡 The cleanest approach: keep data in an array and re-render the list on every change.",
    ],
    s: { html, css, js: 'const form = document.querySelector("#todo-form");\nconst input = document.querySelector("#todo-input");\nconst list = document.querySelector("#todo-list");\nconst count = document.querySelector("#todo-count");\n\nlet todos = [];\n\n// render() funksiyasini yozing\n' },
    sol: {
      html,
      css,
      js: `const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const count = document.querySelector("#todo-count");

let todos = [];
let nextId = 1;

function render() {
  list.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    if (todo.done) li.classList.add("done");

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = todo.done;
    box.addEventListener("change", () => {
      todo.done = box.checked;
      render();
    });

    const span = document.createElement("span");
    span.textContent = todo.text;

    const del = document.createElement("button");
    del.className = "delete";
    del.type = "button";
    del.textContent = "✕";
    del.addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== todo.id);
      render();
    });

    li.append(box, span, del);
    list.append(li);
  });
  count.textContent = todos.filter((t) => !t.done).length;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: nextId++, text, done: false });
  input.value = "";
  render();
});

render();
`,
    },
    tests: [
      [['submit li qo\'shadi va input tozalanadi', 'submit добавляет li и очищает поле', 'submit adds an li and clears the input'], "($('#todo-input').value = 'Kitob o\\'qish', $('#todo-form').requestSubmit(), $$('#todo-list li').length === 1 && $('#todo-input').value === '' && text('#todo-list li span') === 'Kitob o\\'qish')"],
      [['bo\'sh matn qo\'shilmaydi', 'пустой текст не добавляется', 'empty text is ignored'], "($('#todo-input').value = '   ', $('#todo-form').requestSubmit(), $$('#todo-list li').length === 1)"],
      [['li tarkibi: checkbox, span, .delete', 'состав li: checkbox, span, .delete', 'li contains checkbox, span, .delete'], "exists('#todo-list li input[type=checkbox]') && exists('#todo-list li span') && exists('#todo-list li .delete')"],
      [['hisoblagich: 2 ta bajarilmagan', 'счётчик: 2 невыполненных', 'counter: 2 unfinished'], "($('#todo-input').value = 'Sport', $('#todo-form').requestSubmit(), text('#todo-count') === '2')"],
      [['checkbox → done classi va hisoblagich 1', 'checkbox → класс done и счётчик 1', 'checkbox → done class and counter 1'], "($$('#todo-list li input[type=checkbox]')[0].click(), $$('#todo-list li')[0].classList.contains('done') && text('#todo-count') === '1')"],
      [['.delete vazifani o\'chiradi', '.delete удаляет задачу', '.delete removes the task'], "($$('#todo-list li .delete')[1].click(), $$('#todo-list li').length === 1 && text('#todo-count') === '0')"],
    ],
    rules: [['addEventListener', 'events', { t: 'js' }], ['preventDefault', 'preventDefault', { t: 'js' }], ['createElement|innerHTML|insertAdjacentHTML', 'render', { t: 'js' }]],
    h: [['Har bir o\'zgarishdan keyin render() ni chaqiring va hisoblagichni todos.filter(t => !t.done).length bilan yangilang.', 'После каждого изменения вызывайте render() и обновляйте счётчик через todos.filter(t => !t.done).length.', 'Call render() after every change and update the counter with todos.filter(t => !t.done).length.']],
    x: ['Siz holat (state), hodisalar va DOM ni birlashtirgan haqiqiy ilova yaratdingiz — React ham aynan shu g\'oyaga asoslangan!', 'Вы создали настоящее приложение, объединив состояние, события и DOM, — React построен на той же идее!', "You built a real app combining state, events and the DOM — React is built on exactly this idea!"],
    d: 'hard',
  }),
};
