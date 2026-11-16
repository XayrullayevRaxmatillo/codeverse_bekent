import { lesson, mod, ch, mcq, tf, fill, out, bug, order, match } from '../../helpers';

export default mod(
  'html-forms',
  ['Formalar', 'Формы', 'Forms'],
  ["Foydalanuvchidan ma'lumot qabul qiluvchi formalar yaratamiz.", 'Создаём формы для получения данных от пользователя.', 'Build forms that collect user input.'],
  [
    lesson(
      'form-input',
      ['Forma va input', 'Форма и input', 'Form and input'],
      [
        "`<form>` — foydalanuvchi ma'lumotlarini yuboruvchi konteyner. Uning ichida maydonlar bo'ladi.\n\n`<input>` — eng ko'p ishlatiladigan maydon (bo'sh element). Muhim atributlar:\n- `type` — maydon turi (`text`, `email`, `password`...)\n- `name` — serverga yuboriladigan nom\n- `placeholder` — maydon bo'shligida ko'rinadigan maslahat matn\n\nForma `<button type=\"submit\">` bilan yuboriladi.",
        "`<form>` — контейнер, отправляющий данные пользователя. Внутри находятся поля.\n\n`<input>` — самое частое поле (пустой элемент). Важные атрибуты:\n- `type` — тип поля (`text`, `email`, `password`...)\n- `name` — имя, которое уходит на сервер\n- `placeholder` — подсказка, видимая в пустом поле\n\nФорма отправляется кнопкой `<button type=\"submit\">`.",
        "`<form>` is a container that submits user data. Fields live inside it.\n\n`<input>` is the most common field (a void element). Key attributes:\n- `type` — the field type (`text`, `email`, `password`...)\n- `name` — the name sent to the server\n- `placeholder` — hint text shown while empty\n\nA form is submitted with `<button type=\"submit\">`.",
      ],
      {
        ex: `<form>
  <input type="text" name="ism" placeholder="Ismingiz">
  <input type="password" name="parol" placeholder="Parol">
  <button type="submit">Kirish</button>
</form>`,
        ch: ch({
          i: ['`<form>` ichida `name="username"` va `placeholder` bo\'lgan matn maydoni hamda **submit** tugmasi yarating.', 'Внутри `<form>` создайте текстовое поле с `name="username"` и `placeholder`, а также кнопку **submit**.', 'Inside a `<form>`, create a text field with `name="username"` and a `placeholder`, plus a **submit** button.'],
          s: { html: '<form>\n</form>\n' },
          sol: { html: '<form>\n  <input type="text" name="username" placeholder="Login">\n  <button type="submit">Yuborish</button>\n</form>\n' },
          tests: [
            [['input[name=username]', 'input[name=username]', 'input[name=username]'], "exists('form input[name=username]')"],
            [['placeholder bor', 'Есть placeholder', 'Has a placeholder'], "($('input[name=username]').getAttribute('placeholder') || '').length > 0"],
            [['submit tugmasi', 'Кнопка submit', 'Submit button'], "exists('form button[type=submit]') || exists('form input[type=submit]')"],
          ],
          rules: [['name\\s*=\\s*["\']username', 'name', { t: 'html' }]],
        }),
        q: [
          mcq(['Parol maydoni uchun `type`:', '`type` для поля пароля:', '`type` for a password field:'], ['text', 'secret', 'password', 'hidden'], 2, ['`type="password"` belgilarni yashiradi.', '`type="password"` скрывает символы.', '`type="password"` hides characters.']),
          tf(['`placeholder` — `label` ning to\'liq o\'rnini bosadi.', '`placeholder` полностью заменяет `label`.', '`placeholder` fully replaces a `label`.'], false, ['Placeholder yozishda yo\'qoladi; `label` doimiy kerak.', 'Placeholder исчезает при вводе; `label` нужен всегда.', 'Placeholder disappears on typing; a `label` is still needed.']),
        ],
      }
    ),
    lesson(
      'input-types',
      ['Input turlari', 'Типы input', 'Input types'],
      [
        "HTML5 ko'plab maxsus `type` qiymatlarini beradi. Ular mobil qurilmada mos klaviaturani ochadi va oddiy tekshiruvni bajaradi:\n- `email`, `tel`, `url` — aloqa ma'lumotlari\n- `number` (`min`, `max`, `step` bilan) — sonlar\n- `date`, `time` — sana va vaqt\n- `checkbox` — bir nechta tanlov, `radio` — bittasini tanlash (bir xil `name`)\n- `color`, `range`, `file` — rang, slayder, fayl",
        "HTML5 даёт много специальных значений `type`. Они открывают нужную клавиатуру на телефоне и делают простую проверку:\n- `email`, `tel`, `url` — контакты\n- `number` (с `min`, `max`, `step`) — числа\n- `date`, `time` — дата и время\n- `checkbox` — множественный выбор, `radio` — выбор одного (одинаковый `name`)\n- `color`, `range`, `file` — цвет, ползунок, файл",
        "HTML5 offers many special `type` values. They open the right keyboard on phones and do basic validation:\n- `email`, `tel`, `url` — contact info\n- `number` (with `min`, `max`, `step`) — numbers\n- `date`, `time` — date and time\n- `checkbox` — multiple choice, `radio` — pick one (same `name`)\n- `color`, `range`, `file` — color, slider, file",
      ],
      {
        ex: `<form>
  <input type="email" placeholder="Email"><br>
  <input type="number" min="1" max="10" value="5"><br>
  <input type="date"><br>
  <label><input type="radio" name="lang" value="uz" checked> O'zbek</label>
  <label><input type="radio" name="lang" value="ru"> Русский</label><br>
  <label><input type="checkbox" checked> Yangiliklarga obuna</label><br>
  <input type="color" value="#7c5cfc">
</form>`,
        ch: ch({
          i: ['Formaga qo\'shing: `type="email"` maydon, `min="1"` va `max="100"` bo\'lgan `type="number"` maydon hamda bir xil `name` li **ikkita** radio tugma.', 'Добавьте в форму: поле `type="email"`, поле `type="number"` с `min="1"` и `max="100"`, и **две** radio-кнопки с одинаковым `name`.', 'Add to a form: a `type="email"` field, a `type="number"` field with `min="1"` and `max="100"`, and **two** radio buttons with the same `name`.'],
          s: { html: '<form>\n</form>\n' },
          sol: { html: '<form>\n  <input type="email" name="email">\n  <input type="number" name="age" min="1" max="100">\n  <label><input type="radio" name="plan" value="free"> Bepul</label>\n  <label><input type="radio" name="plan" value="pro"> Pro</label>\n</form>\n' },
          tests: [
            [['email maydoni', 'Поле email', 'Email field'], "exists('input[type=email]')"],
            [['number: min=1, max=100', 'number: min=1, max=100', 'number: min=1, max=100'], "exists('input[type=number][min=\"1\"][max=\"100\"]')"],
            [['bir xil name li 2 ta radio', '2 radio с одинаковым name', '2 radios sharing a name'], "(() => { const r = $$('input[type=radio]'); return r.length >= 2 && r.every(x => x.name && x.name === r[0].name); })()"],
          ],
          rules: [['type\\s*=\\s*["\']radio', 'radio', { t: 'html' }]],
        }),
        q: [
          mcq(['Faqat bitta variant tanlash uchun:', 'Для выбора только одного варианта:', 'To pick exactly one option:'], ['checkbox', 'radio', 'select-one', 'option'], 1, ['Radio guruhida bittasi tanlanadi.', 'В группе radio выбирается один.', 'Only one radio in a group can be selected.']),
          tf(['Radio tugmalar guruhga birlashishi uchun bir xil `name` kerak.', 'Чтобы radio-кнопки были одной группой, нужен одинаковый `name`.', 'Radio buttons need the same `name` to form a group.'], true, ['Guruh `name` orqali aniqlanadi.', 'Группа определяется через `name`.', 'The group is defined by `name`.']),
        ],
      }
    ),
    lesson(
      'labels',
      ['Label va qulaylik', 'Label и доступность', 'Labels and accessibility'],
      [
        "Har bir maydonning `<label>` (yorlig'i) bo'lishi kerak. Ikki usul bor:\n1. `for` atributi maydonning `id` siga teng: `<label for=\"email\">` + `<input id=\"email\">`\n2. Maydonni label ichiga olish: `<label>Email <input></label>`\n\nLabel bosilganda maydon fokuslanadi (checkbox ga bosish osonlashadi), ekran o'quvchi esa maydon nomini o'qiydi. Maydonlarni guruhlash uchun `<fieldset>` va `<legend>` ishlatiladi.",
        "У каждого поля должен быть `<label>` (подпись). Есть два способа:\n1. Атрибут `for` равен `id` поля: `<label for=\"email\">` + `<input id=\"email\">`\n2. Поместить поле внутрь label: `<label>Email <input></label>`\n\nКлик по label фокусирует поле (по checkbox легче попасть), а скринридер читает название поля. Для группировки полей используют `<fieldset>` и `<legend>`.",
        "Every field needs a `<label>`. There are two ways:\n1. The `for` attribute equals the field's `id`: `<label for=\"email\">` + `<input id=\"email\">`\n2. Wrap the field inside the label: `<label>Email <input></label>`\n\nClicking the label focuses the field (checkboxes become easier to hit), and screen readers announce the field name. Group fields with `<fieldset>` and `<legend>`.",
      ],
      {
        ex: `<form>
  <fieldset>
    <legend>Ro'yxatdan o'tish</legend>
    <label for="name">Ism</label>
    <input id="name" type="text">

    <label>
      <input type="checkbox"> Shartlarga roziman
    </label>
  </fieldset>
</form>`,
        ch: ch({
          i: ['`id="phone"` li `type="tel"` maydon yarating va uni `for` atributi orqali `<label>` bilan bog\'lang.', 'Создайте поле `type="tel"` с `id="phone"` и свяжите его с `<label>` через атрибут `for`.', 'Create a `type="tel"` field with `id="phone"` and connect it to a `<label>` using the `for` attribute.'],
          s: { html: '<form>\n  <input type="tel">\n</form>\n' },
          sol: { html: '<form>\n  <label for="phone">Telefon</label>\n  <input id="phone" type="tel">\n</form>\n' },
          tests: [
            [['input#phone[type=tel]', 'input#phone[type=tel]', 'input#phone[type=tel]'], "exists('input#phone[type=tel]')"],
            [['label[for=phone] bor va matni bor', 'Есть label[for=phone] с текстом', 'label[for=phone] with text'], "exists('label[for=phone]') && text('label[for=phone]').length > 0"],
          ],
          rules: [['for\\s*=\\s*["\']phone', 'for', { t: 'html' }]],
        }),
        q: [
          fill(['Label va input ni bog\'lang:', 'Свяжите label и input:', 'Connect the label and input:'], '<label ___="mail">Email</label>\n<input id="mail">', ['for'], ['`for` maydonning `id` siga ishora qiladi.', '`for` указывает на `id` поля.', '`for` points to the field id.']),
          mcq(['Maydonlar guruhining sarlavhasi:', 'Заголовок группы полей:', 'The title of a field group:'], ['<caption>', '<legend>', '<label>', '<title>'], 1, ['`<fieldset>` ichida `<legend>`.', '`<legend>` внутри `<fieldset>`.', '`<legend>` inside `<fieldset>`.']),
        ],
      }
    ),
    lesson(
      'select-textarea',
      ['Select va textarea', 'Select и textarea', 'Select and textarea'],
      [
        "`<select>` — ochiladigan ro'yxat. Variantlar `<option>` bilan yoziladi, `value` serverga yuboriladi, `selected` boshlang'ich tanlovni bildiradi.\n\n`<textarea>` — ko'p qatorli matn maydoni (izoh, xabar). U yopuvchi tegga ega, o'lchami `rows` va `cols` bilan beriladi. `maxlength` belgilar sonini cheklaydi.",
        "`<select>` — выпадающий список. Варианты пишутся в `<option>`, `value` уходит на сервер, `selected` задаёт выбор по умолчанию.\n\n`<textarea>` — многострочное текстовое поле (комментарий, сообщение). У него есть закрывающий тег, размер задают `rows` и `cols`. `maxlength` ограничивает число символов.",
        "`<select>` is a dropdown. Options are written with `<option>`, the `value` is sent to the server, and `selected` sets the default choice.\n\n`<textarea>` is a multi-line text field (comment, message). It has a closing tag; its size is set with `rows` and `cols`. `maxlength` limits the number of characters.",
      ],
      {
        ex: `<label for="city">Shahar</label>
<select id="city" name="city">
  <option value="tas" selected>Toshkent</option>
  <option value="sam">Samarqand</option>
  <option value="bux">Buxoro</option>
</select>

<label for="msg">Xabar</label>
<textarea id="msg" rows="4" maxlength="200"></textarea>`,
        ch: ch({
          i: ['`name="course"` li `<select>` yarating: kamida 3 ta `<option>` (HTML, CSS, JavaScript). Shuningdek `rows="3"` bo\'lgan `<textarea>` qo\'shing.', 'Создайте `<select>` с `name="course"`: минимум 3 `<option>` (HTML, CSS, JavaScript). Также добавьте `<textarea>` с `rows="3"`.', 'Create a `<select>` with `name="course"` and at least 3 `<option>`s (HTML, CSS, JavaScript). Also add a `<textarea>` with `rows="3"`.'],
          s: { html: '' },
          sol: { html: '<select name="course">\n  <option value="html">HTML</option>\n  <option value="css">CSS</option>\n  <option value="js">JavaScript</option>\n</select>\n<textarea rows="3"></textarea>\n' },
          tests: [
            [['select[name=course] va 3+ option', 'select[name=course] и 3+ option', 'select[name=course] with 3+ options'], "exists('select[name=course]') && $$('select[name=course] option').length >= 3"],
            [['textarea rows=3', 'textarea rows=3', 'textarea rows=3'], "exists('textarea[rows=\"3\"]')"],
          ],
          rules: [['<select', 'select', { t: 'html' }], ['<textarea', 'textarea', { t: 'html' }]],
        }),
        q: [
          mcq(['Boshlang\'ich tanlangan variant atributi:', 'Атрибут варианта по умолчанию:', 'Attribute for the default option:'], ['checked', 'default', 'selected', 'active'], 2, ['`<option selected>`.', '`<option selected>`.', '`<option selected>`.']),
          tf(['`<textarea>` bo\'sh element (yopuvchi tegsiz).', '`<textarea>` — пустой элемент (без закрывающего тега).', '`<textarea>` is a void element (no closing tag).'], false, ['`<textarea></textarea>` — yopiladi.', '`<textarea></textarea>` — закрывается.', '`<textarea></textarea>` is closed.']),
        ],
      }
    ),
    lesson(
      'validation',
      ['Tugmalar va validatsiya', 'Кнопки и валидация', 'Buttons and validation'],
      [
        "Brauzer formani yuborishdan oldin o'zi tekshira oladi:\n- `required` — maydon to'ldirilishi shart\n- `minlength` / `maxlength` — matn uzunligi\n- `min` / `max` — son chegarasi\n- `pattern` — muntazam ifoda (regex) bo'yicha tekshiruv\n\nTugma turlari: `type=\"submit\"` (yuboradi), `type=\"reset\"` (tozalaydi), `type=\"button\"` (hech narsa qilmaydi — JavaScript uchun). **Muhim:** brauzer tekshiruvi qulaylik uchun; xavfsizlik uchun server ham tekshirishi shart!",
        "Браузер может проверить форму перед отправкой:\n- `required` — поле обязательно\n- `minlength` / `maxlength` — длина текста\n- `min` / `max` — границы числа\n- `pattern` — проверка регулярным выражением\n\nТипы кнопок: `type=\"submit\"` (отправляет), `type=\"reset\"` (очищает), `type=\"button\"` (ничего не делает — для JavaScript). **Важно:** проверка в браузере — для удобства; для безопасности сервер тоже обязан проверять!",
        "The browser can validate a form before submitting:\n- `required` — the field must be filled\n- `minlength` / `maxlength` — text length\n- `min` / `max` — number limits\n- `pattern` — a regular-expression check\n\nButton types: `type=\"submit\"` (submits), `type=\"reset\"` (clears), `type=\"button\"` (does nothing — for JavaScript). **Important:** browser validation is for convenience; the server must validate too for security!",
      ],
      {
        ex: `<form>
  <label>Login
    <input name="login" required minlength="3" maxlength="20">
  </label>
  <label>Pochta indeksi
    <input name="zip" pattern="[0-9]{6}" title="6 ta raqam">
  </label>
  <button type="submit">Yuborish</button>
  <button type="reset">Tozalash</button>
</form>`,
        ch: ch({
          i: ['`name="password"` li parol maydonini yarating: u **majburiy** va kamida **8** belgidan iborat bo\'lishi kerak.', 'Создайте поле пароля с `name="password"`: оно **обязательно** и не короче **8** символов.', 'Create a password field with `name="password"`: it must be **required** and at least **8** characters long.'],
          s: { html: '<form>\n  <input type="password" name="password">\n  <button>Kirish</button>\n</form>\n' },
          sol: { html: '<form>\n  <input type="password" name="password" required minlength="8">\n  <button>Kirish</button>\n</form>\n' },
          tests: [
            [['required', 'required', 'required'], "$('input[name=password]').required === true"],
            [['minlength=8', 'minlength=8', 'minlength=8'], "$('input[name=password]').minLength === 8"],
          ],
          rules: [['required', 'required', { t: 'html' }], ['minlength\\s*=\\s*["\']?8', 'minlength', { t: 'html' }]],
        }),
        q: [
          mcq(['Maydonni majburiy qiluvchi atribut:', 'Атрибут обязательного поля:', 'The attribute that makes a field mandatory:'], ['must', 'required', 'needed', 'validate'], 1, ['`required`.', '`required`.', '`required`.']),
          tf(['Brauzer validatsiyasi bo\'lsa, serverda tekshirish shart emas.', 'Если есть проверка в браузере, на сервере проверять не нужно.', 'With browser validation, server-side checks are unnecessary.'], false, ['Brauzer tekshiruvini chetlab o\'tish oson — server doim tekshiradi.', 'Браузерную проверку легко обойти — сервер проверяет всегда.', 'Browser checks are easy to bypass — the server must always validate.'], { d: 'medium' }),
        ],
      }
    ),
  ],
  [
    mcq(['Email maydoni uchun eng to\'g\'ri tanlov:', 'Лучший вариант для поля email:', 'Best choice for an email field:'], ['<input type="text">', '<input type="email">', '<input type="mail">', '<email>'], 1, ['`type="email"` formatni tekshiradi.', '`type="email"` проверяет формат.', '`type="email"` validates the format.']),
    tf(['Label bosilganda bog\'langan maydon fokuslanadi.', 'Клик по label фокусирует связанное поле.', 'Clicking a label focuses its field.'], true, ['Bu label ning foydali xususiyati.', 'Это полезное свойство label.', "That's a useful label feature."]),
    fill(['Maydon kamida 3 belgi:', 'Поле минимум 3 символа:', 'Field must be at least 3 characters:'], '<input ___="3">', ['minlength'], ['`minlength`.', '`minlength`.', '`minlength`.']),
    bug(['Nega radio tugmalarning ikkalasi ham tanlanib qoladi?', 'Почему можно выбрать обе radio-кнопки?', 'Why can both radio buttons be selected?'], '<input type="radio" name="a"> Ha\n<input type="radio" name="b"> Yo\'q', [['name lar har xil', 'Разные name', 'The names differ'], ['value yo\'q', 'Нет value', 'No value'], ['label yo\'q', 'Нет label', 'No label']], 0, ['Guruh uchun bir xil `name` kerak.', 'Для группы нужен одинаковый `name`.', 'A group needs the same `name`.'], { d: 'medium' }),
    match(['Tugma turi va vazifasi', 'Тип кнопки и действие', 'Button type and action'], [['submit', 'send'], ['reset', 'clear'], ['button', 'JS only']], ['submit yuboradi, reset tozalaydi, button — JS uchun.', 'submit отправляет, reset очищает, button — для JS.', 'submit sends, reset clears, button is for JS.']),
    mcq(['Ko\'p qatorli matn uchun:', 'Для многострочного текста:', 'For multi-line text:'], ['<input type="multiline">', '<textarea>', '<text>', '<p contenteditable>'], 1, ['`<textarea>`.', '`<textarea>`.', '`<textarea>`.']),
  ]
);
