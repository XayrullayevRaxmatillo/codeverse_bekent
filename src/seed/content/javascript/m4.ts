import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

export default mod(
  'js-dom',
  ['DOM bilan ishlash', 'Работа с DOM', 'Working with the DOM'],
  ['JavaScript orqali sahifani boshqarish va hodisalarga javob berish.', 'Управление страницей из JavaScript и обработка событий.', 'Control the page with JavaScript and respond to events.'],
  [
    lesson(
      'select-elements',
      ['Elementlarni tanlash', 'Выбор элементов', 'Selecting elements'],
      [
        "**DOM** (Document Object Model) — brauzer HTML dan yaratgan obyektlar daraxti. JavaScript u orqali sahifani o'qiydi va o'zgartiradi.\n\nElementlarni topish:\n- `document.querySelector(\".card\")` — CSS selektor bo'yicha **birinchi** element\n- `document.querySelectorAll(\"li\")` — **barchasi** (NodeList, `forEach` bor)\n- `document.getElementById(\"logo\")` — id bo'yicha\n\nTopilmasa `querySelector` `null` qaytaradi.",
        "**DOM** (Document Object Model) — дерево объектов, которое браузер строит из HTML. Через него JavaScript читает и меняет страницу.\n\nПоиск элементов:\n- `document.querySelector(\".card\")` — **первый** элемент по CSS-селектору\n- `document.querySelectorAll(\"li\")` — **все** (NodeList, есть `forEach`)\n- `document.getElementById(\"logo\")` — по id\n\nЕсли ничего не найдено, `querySelector` вернёт `null`.",
        "The **DOM** (Document Object Model) is the tree of objects the browser builds from HTML. JavaScript reads and changes the page through it.\n\nFinding elements:\n- `document.querySelector(\".card\")` — the **first** element matching a CSS selector\n- `document.querySelectorAll(\"li\")` — **all** of them (a NodeList with `forEach`)\n- `document.getElementById(\"logo\")` — by id\n\nIf nothing matches, `querySelector` returns `null`.",
      ],
      {
        ex: `<h1 id="title">Salom</h1>
<ul><li>Bir</li><li>Ikki</li><li>Uch</li></ul>
<script>
  const title = document.getElementById("title");
  console.log(title.textContent);
  const items = document.querySelectorAll("li");
  console.log(items.length); // 3
</script>`,
        ch: ch({
          i: ['`countItems()` funksiyasini yozing — sahifadagi `.task` elementlar sonini qaytarsin.', 'Напишите `countItems()`, возвращающую количество элементов `.task` на странице.', 'Write `countItems()` that returns the number of `.task` elements on the page.'],
          s: { html: '<ul>\n  <li class="task">Kod yozish</li>\n  <li class="task">Test topshirish</li>\n  <li class="task">Dam olish</li>\n</ul>\n', js: 'function countItems() {\n\n}\n' },
          sol: { html: '<ul>\n  <li class="task">Kod yozish</li>\n  <li class="task">Test topshirish</li>\n  <li class="task">Dam olish</li>\n</ul>\n', js: 'function countItems() {\n  return document.querySelectorAll(".task").length;\n}\n' },
          tests: [
            [['3 qaytaradi', 'возвращает 3', 'returns 3'], 'countItems() === 3'],
            [['yangi element qo\'shilsa 4', '4 после добавления', '4 after adding one'], "(() => { const li = document.createElement('li'); li.className = 'task'; $('ul').append(li); const r = countItems() === 4; li.remove(); return r; })()"],
          ],
          rules: [['querySelectorAll|getElementsByClassName', 'querySelectorAll', { t: 'js' }]],
        }),
        q: [
          mcq(['Selektorga mos BARCHA elementlar:', 'ВСЕ элементы по селектору:', 'ALL elements matching a selector:'], ['querySelector', 'querySelectorAll', 'getElementById', 'getElement'], 1, ['`querySelectorAll`.', '`querySelectorAll`.', '`querySelectorAll`.']),
          out(['Element topilmasa nima qaytadi?', 'Что вернётся, если элемент не найден?', 'What is returned if nothing matches?'], 'console.log(document.querySelector(".yoq"));', ['null'], ['`querySelector` → `null`.', '`querySelector` → `null`.', '`querySelector` → `null`.']),
        ],
      }
    ),
    lesson(
      'change-content',
      ['Kontent va uslubni o\'zgartirish', 'Изменение контента и стилей', 'Changing content and styles'],
      [
        "Element topilgach:\n- `el.textContent = \"Yangi matn\"` — matnni o'zgartirish (xavfsiz)\n- `el.innerHTML = \"<b>...</b>\"` — HTML qo'yish (⚠️ foydalanuvchi kiritgan matn bilan **ishlatmang** — XSS xavfi!)\n- `el.classList.add(\"active\")`, `.remove()`, `.toggle()`, `.contains()` — classlar\n- `el.style.color = \"red\"` — inline uslub (classlar afzal)\n- `el.setAttribute(\"src\", \"...\")` — atributlar",
        "Когда элемент найден:\n- `el.textContent = \"Новый текст\"` — изменить текст (безопасно)\n- `el.innerHTML = \"<b>...</b>\"` — вставить HTML (⚠️ **не используйте** с вводом пользователя — риск XSS!)\n- `el.classList.add(\"active\")`, `.remove()`, `.toggle()`, `.contains()` — классы\n- `el.style.color = \"red\"` — inline-стиль (классы предпочтительнее)\n- `el.setAttribute(\"src\", \"...\")` — атрибуты",
        "Once you have an element:\n- `el.textContent = \"New text\"` — change text (safe)\n- `el.innerHTML = \"<b>...</b>\"` — insert HTML (⚠️ **never** with user input — XSS risk!)\n- `el.classList.add(\"active\")`, `.remove()`, `.toggle()`, `.contains()` — classes\n- `el.style.color = \"red\"` — inline style (prefer classes)\n- `el.setAttribute(\"src\", \"...\")` — attributes",
      ],
      {
        ex: `<p id="msg">Kutilmoqda...</p>
<style>.ok { color: #22c55e; font-weight: bold; }</style>
<script>
  const msg = document.querySelector("#msg");
  msg.textContent = "Muvaffaqiyatli saqlandi!";
  msg.classList.add("ok");
</script>`,
        ch: ch({
          i: ['`#status` elementining matnini `"Online"` qiling va unga `online` classini qo\'shing.', 'Сделайте текст `#status` равным `"Online"` и добавьте ему класс `online`.', 'Set the text of `#status` to `"Online"` and add the `online` class.'],
          s: { html: '<span id="status">Offline</span>\n', css: '.online { color: green; }\n', js: '' },
          sol: { html: '<span id="status">Offline</span>\n', css: '.online { color: green; }\n', js: 'const status = document.querySelector("#status");\nstatus.textContent = "Online";\nstatus.classList.add("online");\n' },
          tests: [
            [['matn Online', 'текст Online', 'text is Online'], "text('#status') === 'Online'"],
            [['online classi', 'класс online', 'online class'], "$('#status').classList.contains('online')"],
          ],
          rules: [['textContent|innerText', 'textContent', { t: 'js' }], ['classList', 'classList', { t: 'js' }]],
        }),
        q: [
          tf(['Foydalanuvchi kiritgan matnni `innerHTML` ga qo\'yish xavfsiz.', 'Вставлять ввод пользователя в `innerHTML` безопасно.', 'Putting user input into `innerHTML` is safe.'], false, ['XSS hujumi xavfi — `textContent` ishlating.', 'Риск XSS — используйте `textContent`.', 'XSS risk — use `textContent`.']),
          mcq(['Class bor bo\'lsa olib tashlaydi, yo\'q bo\'lsa qo\'shadi:', 'Удаляет класс, если есть, иначе добавляет:', 'Removes the class if present, otherwise adds it:'], ['add', 'toggle', 'switch', 'replace'], 1, ['`classList.toggle`.', '`classList.toggle`.', '`classList.toggle`.']),
        ],
      }
    ),
    lesson(
      'events',
      ['Hodisalar (events)', 'События (events)', 'Events'],
      [
        "Hodisa — foydalanuvchi harakati: bosish, yozish, sichqoncha harakati. Unga javob:\n```\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Bosildi!\");\n});\n```\nMashhur hodisalar: `click`, `input`, `change`, `submit`, `keydown`, `mouseenter`.\n\nHandler `event` obyektini oladi: `event.target` — hodisa yuz bergan element, `event.key` — bosilgan tugma, `event.preventDefault()` — standart xatti-harakatni to'xtatish.",
        "Событие — действие пользователя: клик, ввод, движение мыши. Реакция на него:\n```\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Нажато!\");\n});\n```\nПопулярные события: `click`, `input`, `change`, `submit`, `keydown`, `mouseenter`.\n\nОбработчик получает объект `event`: `event.target` — элемент события, `event.key` — нажатая клавиша, `event.preventDefault()` — отменить стандартное поведение.",
        "An event is a user action: a click, typing, mouse movement. Responding to one:\n```\nbutton.addEventListener(\"click\", () => {\n  console.log(\"Clicked!\");\n});\n```\nCommon events: `click`, `input`, `change`, `submit`, `keydown`, `mouseenter`.\n\nThe handler receives an `event` object: `event.target` is the element, `event.key` the pressed key, and `event.preventDefault()` cancels the default behavior.",
      ],
      {
        ex: `<button id="like">❤ 0</button>
<script>
  let likes = 0;
  const btn = document.querySelector("#like");
  btn.addEventListener("click", () => {
    likes++;
    btn.textContent = "❤ " + likes;
  });
</script>`,
        ch: ch({
          i: ['Hisoblagich yarating: `#plus` bosilganda `#count` dagi son 1 ga oshsin.', 'Создайте счётчик: при клике на `#plus` число в `#count` увеличивается на 1.', 'Build a counter: clicking `#plus` increases the number in `#count` by 1.'],
          s: { html: '<span id="count">0</span>\n<button id="plus">+</button>\n', js: '' },
          sol: { html: '<span id="count">0</span>\n<button id="plus">+</button>\n', js: 'let count = 0;\nconst countEl = document.querySelector("#count");\ndocument.querySelector("#plus").addEventListener("click", () => {\n  count++;\n  countEl.textContent = count;\n});\n' },
          tests: [
            [['1 marta bosish → 1', '1 клик → 1', '1 click → 1'], "($('#plus').click(), text('#count') === '1')"],
            [['yana 2 marta → 3', 'ещё 2 клика → 3', '2 more clicks → 3'], "($('#plus').click(), $('#plus').click(), text('#count') === '3')"],
          ],
          rules: [['addEventListener|onclick', 'event', { t: 'js' }]],
        }),
        q: [
          fill(['Bosish hodisasi:', 'Событие клика:', 'Click event:'], 'btn.addEventListener("___", handler);', ['click'], ['`click`.', '`click`.', '`click`.']),
          mcq(['Formaning sahifani qayta yuklashini to\'xtatish:', 'Остановить перезагрузку страницы формой:', 'Stop a form from reloading the page:'], ['event.stop()', 'event.preventDefault()', 'return false()', 'event.cancel'], 1, ['`preventDefault()`.', '`preventDefault()`.', '`preventDefault()`.']),
        ],
      }
    ),
    lesson(
      'create-elements',
      ['Element yaratish', 'Создание элементов', 'Creating elements'],
      [
        "Yangi element yaratish va sahifaga qo'shish:\n```\nconst li = document.createElement(\"li\");\nli.textContent = \"Yangi vazifa\";\nlist.append(li);\n```\n- `append()` — oxiriga, `prepend()` — boshiga\n- `el.remove()` — o'chirish\n- Ro'yxatni ma'lumotdan chizish: massiv ustida `forEach` + `createElement`\n\nKo'p elementli ro'yxatlarda **event delegation** qulay: bitta listener ota-onaga qo'yiladi va `event.target` tekshiriladi.",
        "Создание нового элемента и добавление на страницу:\n```\nconst li = document.createElement(\"li\");\nli.textContent = \"Новая задача\";\nlist.append(li);\n```\n- `append()` — в конец, `prepend()` — в начало\n- `el.remove()` — удалить\n- Отрисовка списка из данных: `forEach` по массиву + `createElement`\n\nДля больших списков удобно **делегирование событий**: один обработчик на родителе и проверка `event.target`.",
        "Create a new element and add it to the page:\n```\nconst li = document.createElement(\"li\");\nli.textContent = \"New task\";\nlist.append(li);\n```\n- `append()` adds to the end, `prepend()` to the start\n- `el.remove()` deletes\n- Render a list from data: `forEach` over an array + `createElement`\n\nFor long lists, **event delegation** is handy: one listener on the parent, then check `event.target`.",
      ],
      {
        ex: `<ul id="list"></ul>
<script>
  const fruits = ["Olma", "Anor", "Uzum"];
  const list = document.querySelector("#list");
  fruits.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    list.append(li);
  });
</script>`,
        ch: ch({
          i: ['`renderList(items)` — `#list` ni tozalab, har bir satr uchun `<li>` yaratsin. Sahifa ochilganda `renderList(["HTML", "CSS", "JS"])` chaqiring.', '`renderList(items)` — очищает `#list` и создаёт `<li>` для каждой строки. При загрузке вызовите `renderList(["HTML", "CSS", "JS"])`.', '`renderList(items)` — clear `#list` and create an `<li>` for each string. Call `renderList(["HTML", "CSS", "JS"])` on load.'],
          s: { html: '<ul id="list"></ul>\n', js: 'function renderList(items) {\n\n}\n' },
          sol: { html: '<ul id="list"></ul>\n', js: 'function renderList(items) {\n  const list = document.querySelector("#list");\n  list.innerHTML = "";\n  items.forEach((text) => {\n    const li = document.createElement("li");\n    li.textContent = text;\n    list.append(li);\n  });\n}\nrenderList(["HTML", "CSS", "JS"]);\n' },
          tests: [
            [['3 ta li', '3 li', '3 li items'], "$$('#list li').map(l => l.textContent).join(',') === 'HTML,CSS,JS'"],
            [['qayta chizishda eski elementlar o\'chadi', 'при перерисовке старые удаляются', 'old items are cleared on re-render'], "(renderList(['A', 'B']), $$('#list li').length === 2)"],
          ],
          rules: [['createElement', 'createElement', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          order(['Element qo\'shish qadamlarini tartiblang', 'Упорядочите шаги добавления элемента', 'Order the steps to add an element'], ['const p = document.createElement("p");', 'p.textContent = "Salom";', 'document.body.append(p);'], ['Yaratish → to\'ldirish → qo\'shish.', 'Создать → заполнить → добавить.', 'Create → fill → append.']),
          tf(['`el.remove()` elementni DOM dan o\'chiradi.', '`el.remove()` удаляет элемент из DOM.', '`el.remove()` removes the element from the DOM.'], true, ['To\'g\'ri.', 'Верно.', 'Correct.']),
        ],
      }
    ),
    lesson(
      'forms-input',
      ['Formalar va input hodisalari', 'Формы и события ввода', 'Forms and input events'],
      [
        "Input qiymatini o'qish: `input.value` (har doim **satr**!). Hodisalar:\n- `input` — har bir harf yozilganda\n- `change` — qiymat o'zgarib, fokus ketganda\n- `submit` — formada (har doim `event.preventDefault()` bilan boshqariladi)\n\nJonli qidiruv, belgilar hisoblagichi va forma validatsiyasi shular asosida quriladi.",
        "Чтение значения поля: `input.value` (всегда **строка**!). События:\n- `input` — при каждом вводе символа\n- `change` — после изменения и потери фокуса\n- `submit` — у формы (обычно с `event.preventDefault()`)\n\nНа них строятся живой поиск, счётчик символов и валидация форм.",
        "Read a field's value with `input.value` (always a **string**!). Events:\n- `input` — on every keystroke\n- `change` — after the value changes and focus leaves\n- `submit` — on a form (usually handled with `event.preventDefault()`)\n\nLive search, character counters and form validation are built on these.",
      ],
      {
        ex: `<textarea id="bio" maxlength="100"></textarea>
<p><span id="left">100</span> belgi qoldi</p>
<script>
  const bio = document.querySelector("#bio");
  bio.addEventListener("input", () => {
    document.querySelector("#left").textContent = 100 - bio.value.length;
  });
</script>`,
        ch: ch({
          i: ['Forma yuborilganda (`submit`) sahifa qayta yuklanmasin, `#name` dagi ism bilan `#greeting` ga `"Salom, ISM!"` yozilsin.', 'При отправке формы (`submit`) страница не перезагружается, а в `#greeting` пишется `"Salom, ИМЯ!"` с именем из `#name`.', 'On form `submit`, prevent the reload and write `"Salom, NAME!"` into `#greeting` using the name from `#name`.'],
          s: { html: '<form id="form">\n  <input id="name" placeholder="Ism">\n  <button>OK</button>\n</form>\n<p id="greeting"></p>\n', js: '' },
          sol: { html: '<form id="form">\n  <input id="name" placeholder="Ism">\n  <button>OK</button>\n</form>\n<p id="greeting"></p>\n', js: 'document.querySelector("#form").addEventListener("submit", (event) => {\n  event.preventDefault();\n  const name = document.querySelector("#name").value.trim();\n  document.querySelector("#greeting").textContent = `Salom, ${name}!`;\n});\n' },
          tests: [[['submit → "Salom, Ali!"', 'submit → "Salom, Ali!"', 'submit → "Salom, Ali!"'], "($('#name').value = 'Ali', $('#form').requestSubmit(), text('#greeting') === 'Salom, Ali!')"]],
          rules: [['preventDefault', 'preventDefault', { t: 'js' }], ['submit', 'submit', { t: 'js' }]],
          d: 'medium',
        }),
        q: [
          out(['`typeof input.value` (input type="number")?', '`typeof input.value` (input type="number")?', '`typeof input.value` (input type="number")?'], '<input type="number" value="5">', ['string'], ['`value` har doim satr.', '`value` всегда строка.', '`value` is always a string.'], { d: 'medium' }),
          mcq(['Har bir harf yozilganda ishlaydigan hodisa:', 'Событие на каждый введённый символ:', 'The event that fires on every keystroke:'], ['change', 'input', 'submit', 'blur'], 1, ['`input`.', '`input`.', '`input`.']),
        ],
      }
    ),
  ],
  [
    mcq(['DOM nima?', 'Что такое DOM?', 'What is the DOM?'], [['HTML dan qurilgan obyektlar daraxti', 'Дерево объектов из HTML', 'A tree of objects built from HTML'], ['CSS fayl', 'CSS-файл', 'A CSS file'], ['Server', 'Сервер', 'A server']], 0, ['Brauzer HTML ni DOM daraxtiga aylantiradi.', 'Браузер превращает HTML в дерево DOM.', 'The browser turns HTML into the DOM tree.']),
    fill(['id bo\'yicha topish:', 'Поиск по id:', 'Find by id:'], 'document.getElement___("app")', ['ById'], ['`getElementById`.', '`getElementById`.', '`getElementById`.']),
    tf(['`textContent` HTML teglarni matn sifatida ko\'rsatadi (bajarmaydi).', '`textContent` показывает HTML-теги как текст (не выполняет).', '`textContent` shows HTML tags as text (does not render them).'], true, ['Shuning uchun u xavfsiz.', 'Поэтому он безопасен.', "That's why it's safe."]),
    bug(['Nega tugma ishlamayapti?', 'Почему кнопка не работает?', "Why doesn't the button work?"], 'const btn = document.querySelector("#save");\nbtn.addEventListener("click", save());', [['Funksiya darhol chaqirilgan: save() o\'rniga save', 'Функция вызвана сразу: нужно save вместо save()', 'The function is called immediately: pass save, not save()'], ['click xato', 'Ошибка в click', 'click is wrong'], ['querySelector xato', 'Ошибка в querySelector', 'querySelector is wrong']], 0, ['Handler sifatida funksiyaning o\'zi beriladi.', 'Обработчиком передаётся сама функция.', 'Pass the function itself as the handler.'], { d: 'medium' }),
    match(['Hodisa va holat', 'Событие и ситуация', 'Event and situation'], [['click', 'button press'], ['input', 'typing'], ['submit', 'form send']], ['click — bosish, input — yozish, submit — yuborish.', 'click — нажатие, input — ввод, submit — отправка.', 'click → press, input → typing, submit → send.']),
    mcq(['Yangi elementni oxiriga qo\'shish:', 'Добавить элемент в конец:', 'Append an element to the end:'], ['parent.append(el)', 'parent.push(el)', 'parent.add(el)', 'el.insert()'], 0, ['`append`.', '`append`.', '`append`.']),
  ]
);
