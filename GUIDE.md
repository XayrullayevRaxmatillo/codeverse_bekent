# CODEVERSE — dasturlashni o'yin orqali o'rganish platformasi

HTML orolidan React shahrigacha: interaktiv darslar, jonli kod muharriri, avtomatik tekshiriladigan topshiriqlar, o'yin va jang rejimlari, AI mentor, XP/darajalar/yutuqlar, reyting va PDF sertifikatlar. Interfeys va **barcha dars kontenti uch tilda**: o'zbek, rus, ingliz.

---

## Mundarija
1. [Imkoniyatlar](#imkoniyatlar)
2. [Texnologiyalar](#texnologiyalar)
3. [Loyiha tuzilmasi](#loyiha-tuzilmasi)
4. [Windows'da o'rnatish (bosqichma-bosqich)](#windowsda-ornatish)
5. [MongoDB sozlash](#mongodb-sozlash)
6. [.env sozlamalari](#env-sozlamalari)
7. [Ishga tushirish](#ishga-tushirish)
8. [Demo akkauntlar](#demo-akkauntlar)
9. [AI mentor (Anthropic yoki OpenAI)](#ai-mentor)
10. [Testlar](#testlar)
11. [Deploy (internetga chiqarish)](#deploy)
12. [Xavfsizlik](#xavfsizlik)
13. [Kontent qo'shish va admin panel](#kontent)
14. [Muammolarni hal qilish](#muammolar)

---

## Imkoniyatlar

| Bo'lim | Nima bor |
|---|---|
| **Kurslar (dunyolar)** | HTML oroli, CSS o'rmoni, JavaScript qirolligi, React shahri — har biri **5 modul × 5 dars** (jami 100 dars), har darsda nazariya, misol, amaliy topshiriq va mini-test. TypeScript tog'lari, Backend galaktikasi, Full Stack koinoti — "tez orada" sifatida xaritada |
| **Xarita** | Tugun holatlari: qulflangan / ochiq / jarayonda / tugallangan / mukammal. Oldingi dars tugamaguncha keyingisi yopiq, modul imtihoni (70%+) keyingi modulni ochadi, kurslar zanjiri HTML → CSS → JS → React |
| **Kod muharriri** | CodeMirror 6 (sintaksis rangi, qator raqamlari, avtoyopish), HTML/CSS/JS tablari, Ishga tushirish / Asliga qaytarish / Konsolni tozalash, Mobil/Planshet/Desktop ko'rinish, xatolar konsolda, Ctrl+Enter |
| **Xavfsiz sandbox** | Foydalanuvchi kodi faqat brauzerda `sandbox="allow-scripts allow-forms"` iframe'da (opaque origin) bajariladi; cheksiz sikl himoyasi; serverda kod **hech qachon** bajarilmaydi |
| **Topshiriqlar** | 104 ta (100 dars + 4 yakuniy loyiha) avtomatik testlanadigan topshiriq, muvaffaqiyat animatsiyasi, XP, izoh, keyingi missiya |
| **Testlar (quiz)** | 7 tur: test (MCQ), to'g'ri/noto'g'ri, bo'sh joy, natijani bashorat qilish, xatoni topish, kodni tartiblash (drag & drop + klaviatura), juftlash. Baholash **faqat serverda** |
| **Imtihonlar** | Har modul uchun taymerli imtihon, o'tish bali 70%, to'g'ri javoblar oshkor qilinmaydi |
| **O'yin rejimi** | Savol turini tanlab o'ynash, combo, yuraklar (jazolamaydigan: darslar hech qachon bloklanmaydi, yuraklar 20 daqiqada tiklanadi) |
| **Jang rejimi** | Vaqtga qarshi 10 savol, 3 qiyinlik, shaxsiy rekord, **kunlik challenge** (har kuni bir xil savollar, bitta urinish, TOP-10) |
| **Amaliyot** | Erkin playground (Veb / JS / React) |
| **Gamifikatsiya** | XP (dars +20, test +30, topshiriq +50, loyiha +150, imtihon +100, streak bonusi), 9 daraja (Boshlovchi → Afsonaviy dasturchi), daraja oshish animatsiyasi, streak taqvimi, tangalar, 14 yutuq, do'kon (avatarlar, mavzu ranglari, ramkalar) |
| **Reyting** | Kun/hafta/oy/barcha vaqt, global va do'stlar; faqat ommaviy ma'lumot (email ko'rsatilmaydi) |
| **CODE AI mentor** | Kodni tushuntirish, xatoni izohlash, maslahat (yechimni bermasdan), kod tahlili, yangi mashq yaratish; uz/ru/en; daraja bo'yicha moslashadi; Anthropic **yoki** OpenAI |
| **Sertifikat** | Barcha darslar + imtihonlar + yakuniy loyihadan keyin; PDF (ism, kurs, sana, noyob ID, brending) va ommaviy tekshirish sahifasi `/verify/:id` |
| **Admin panel** | Statistika, foydalanuvchilar (rol, bloklash), kontent CRUD (kurs/modul/dars/topshiriq/savol — JSON muharrir, server Zod bilan tekshiradi), yutuqlar CRUD, shikoyatlar |
| **Auth** | Ro'yxatdan o'tish, kirish/chiqish, bcrypt, JWT (httpOnly cookie), himoyalangan sahifalar, parolni tiklash (email), parolni o'zgartirish, **mehmon rejimi** (HTML 1-modul ro'yxatsiz ochiq, ro'yxatdan o'tganda progress ko'chiriladi) |
| **Dizayn** | Qorong'i/yorug'/tizim mavzusi, desktopda sidebar, mobilda pastki navigatsiya, skeletonlar, bo'sh/xato holatlar, toastlar, `prefers-reduced-motion` |

## Texnologiyalar

- **Frontend:** React 18, TypeScript, Vite 6, React Router 7, Tailwind CSS 4, Framer Motion, Lucide, CodeMirror 6, Axios, TanStack React Query 5, Recharts, marked + DOMPurify + highlight.js
- **Backend:** Node.js 20+, **NestJS 11** (TypeScript), MongoDB + Mongoose 8 (`@nestjs/mongoose`), JWT, bcryptjs, Zod (validatsiya pipe), helmet, rate limit (guard + express-rate-limit), nodemailer, pdfkit, Jest

## Loyiha tuzilmasi

Frontend va backend — **ikkita mustaqil loyiha** (har birining o'z `package.json`, `.env` va deploy'i bor). Ular faqat HTTP API (`/api/...`) orqali gaplashadi.

```
codeverse/
├── frontend/                  # React + Vite + TypeScript (o'zgarmagan)
│   ├── src/
│   │   ├── components/        # layout, ui, editor (Playground, ChallengePanel), quiz, game
│   │   ├── context/           # Settings (til/mavzu), Auth, Toast, Reward (XP, level up)
│   │   ├── hooks/api.ts       # React Query hook'lari
│   │   ├── i18n/              # uz.ts, ru.ts, en.ts — interfeys tarjimalari
│   │   ├── lib/sandbox.ts     # xavfsiz kod bajarish + testlar
│   │   ├── pages/             # barcha sahifalar (+ admin/)
│   │   └── types.ts
│   └── .env.example
├── backend/                   # NestJS + MongoDB (TypeScript)
│   ├── src/
│   │   ├── main.ts            # bootstrap: helmet, CORS, JSON limit, cookie, rate limit, /api prefiks
│   │   ├── app.module.ts      # barcha modullar + global exception filter
│   │   ├── config/env.ts      # .env — Zod bilan tekshiriladi
│   │   ├── common/            # AppError, AllExceptionsFilter, ZodPipe, Auth/Admin/RateLimit guard'lar,
│   │   │                      # @CurrentUser() dekoratori, serializatorlar
│   │   ├── database/          # DatabaseModule (@Global) + 12 ta Mongoose sxema
│   │   ├── lib/               # sof mantiq: gamification, grading, progress-rules, rules, shop, ai/, PDF
│   │   ├── modules/           # auth, mail, rewards, courses, lessons, exams, challenges, play,
│   │   │                      # users, leaderboard, achievements, certificates, ai, reports, admin, health
│   │   └── seed/              # 4 kurs kontenti (uz/ru/en), yutuqlar, demo akkauntlar
│   ├── test/                  # Jest — 36 ta test
│   ├── assets/fonts/          # DejaVu (sertifikatdagi o'zbek/rus harflari uchun)
│   └── .env.example
└── .gitignore
```

## Windows'da o'rnatish (bosqichma-bosqich)

### 1. Kerakli dasturlar
1. **Node.js 20 LTS yoki yangiroq** — https://nodejs.org (o'rnatishda "Add to PATH" belgilangan bo'lsin). Tekshirish:
   ```powershell
   node -v
   npm -v
   ```
2. **MongoDB** — ikki variant (pastda batafsil): MongoDB Atlas (bulut, bepul) **yoki** lokal MongoDB Community Server.
3. (Ixtiyoriy) **Git** — https://git-scm.com va **VS Code**.

### 2. Arxivni ochish
`codeverse.zip` ni masalan `C:\projects\codeverse` ga oching va PowerShell'da shu papkaga o'ting:
```powershell
cd C:\projects\codeverse
```

### 3. Backend paketlari (NestJS)
```powershell
cd backend
npm install
copy .env.example .env
```
`.env` ni Notepad yoki VS Code'da oching va kamida `MONGODB_URI` hamda `JWT_SECRET` ni to'ldiring (pastga qarang). Tasodifiy `JWT_SECRET` yaratish:
```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 4. Bazani kontent bilan to'ldirish (seed)
```powershell
npm run seed
```
Natija: `✅ Kontent: 4 kurs, 20 modul, 100 dars, 104 topshiriq, ... savol` va demo akkauntlar.

### 5. Frontend paketlari
Yangi PowerShell oynasida:
```powershell
cd C:\projects\codeverse\frontend
npm install
copy .env.example .env
```
(Development'da `frontend/.env` o'zgartirish shart emas — Vite `/api` so'rovlarini backendga o'zi yo'naltiradi.)

<a id="mongodb-sozlash"></a>
## MongoDB sozlash

### Variant A — MongoDB Atlas (tavsiya etiladi, bepul)
1. https://www.mongodb.com/cloud/atlas ga kiring → **Create** → bepul **M0** klaster.
2. **Database Access** → *Add New Database User* → login va parol (parolda `@ : / ?` belgilari bo'lmasin yoki URL-encode qiling).
3. **Network Access** → *Add IP Address* → o'z IP'ingiz (yoki sinov uchun `0.0.0.0/0`).
4. **Connect → Drivers** → ulanish satrini nusxalang va oxiriga baza nomini qo'shing:
   ```
   MONGODB_URI=mongodb+srv://USER:PAROL@cluster0.xxxxx.mongodb.net/codeverse?retryWrites=true&w=majority
   ```

### Variant B — Lokal MongoDB (Windows)
1. https://www.mongodb.com/try/download/community → **MongoDB Community Server** (MSI) → "Install MongoDB as a Service" belgilangan holda o'rnating.
2. `.env`:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/codeverse
   ```
3. Xizmat ishlayotganini tekshirish: `services.msc` → **MongoDB Server** → *Running*.

<a id="env-sozlamalari"></a>
## .env sozlamalari

`backend/.env` (to'liq ro'yxat `backend/.env.example` da):

| O'zgaruvchi | Tavsif |
|---|---|
| `PORT` | Backend porti (standart 5000) |
| `CLIENT_URL` | Frontend manzili (CORS, email havolalari, sertifikat tekshirish havolasi). Bir nechta bo'lsa vergul bilan — havolalarda birinchisi ishlatiladi |
| `MONGODB_URI` | MongoDB ulanish satri |
| `JWT_SECRET` | **Kamida 32 belgi**, tasodifiy. Hech kimga bermang |
| `JWT_EXPIRES_IN` | Sessiya muddati (`7d`) |
| `COOKIE_SAMESITE` | `lax` (bitta domen) yoki `none` (frontend va backend turli domenlarda, HTTPS shart) |
| `AI_PROVIDER` | `anthropic` yoki `openai` (bo'sh — AI o'chiq) |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | Claude uchun (standart model: `claude-sonnet-5-5`) |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | OpenAI uchun (standart: `gpt-4.1-mini` — hisobingizda mavjud modelni yozing) |
| `SMTP_*`, `MAIL_FROM` | Parolni tiklash xatlari. Bo'sh bo'lsa (development) havola server konsoliga chiqadi |
| `SEED_DEMO`, `DEMO_*`, `ADMIN_*` | Development'dagi demo akkauntlar |

`frontend/.env`: faqat `VITE_API_URL` — frontend backenddan alohida domenda bo'lsa (masalan `https://codeverse-api.onrender.com/api`).

## Ishga tushirish

Ikki terminal:
```powershell
# 1-terminal — backend (NestJS, watch rejimi)
cd C:\projects\codeverse\backend
npm run start:dev    # http://localhost:5000/api/health

# 2-terminal — frontend
cd C:\projects\codeverse\frontend
npm run dev          # http://localhost:5173
```
Brauzerda **http://localhost:5173** ni oching.

Production build:
```powershell
cd frontend
npm run build        # TypeScript tekshiruvi + frontend/dist (istalgan statik hostingga)
cd ..\backend
npm run build        # NestJS → backend/dist
npm run start:prod   # node dist/main
```

## Demo akkauntlar

`npm run seed` (development, `SEED_DEMO=true`) quyidagilarni yaratadi:

| Rol | Email | Parol | Holat |
|---|---|---|---|
| O'quvchi | `demo@codeverse.dev` | `Demo12345!` | HTML 1-modul tugatilgan, imtihon topshirilgan, 5 kunlik streak, yutuqlar, XP — dashboard bo'sh ko'rinmaydi |
| Admin | `admin@codeverse.dev` | `Admin12345!` | Admin panel, barcha kurslar ochiq |

Reyting bo'sh ko'rinmasligi uchun bir nechta namunaviy o'quvchilar ham qo'shiladi. **Production'da demo akkauntlar yaratilmaydi.**

Bazani to'liq qayta yaratish (barcha progress o'chadi!): `npm run seed:reset`.
Kontentni yangilash (progress saqlanadi): `npm run seed`.

<a id="ai-mentor"></a>
## AI mentor (Anthropic yoki OpenAI)

`backend/.env`:
```env
# Claude (Anthropic)
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-5-5

# yoki OpenAI
# AI_PROVIDER=openai
# OPENAI_API_KEY=sk-...
# OPENAI_MODEL=gpt-4.1-mini
```
Serverni qayta ishga tushiring. Kalitlar faqat serverda saqlanadi, brauzerga hech qachon yuborilmaydi. Kalit bo'lmasa sayt to'liq ishlaydi, mentor sahifasida esa sozlash bo'yicha aniq xabar ko'rinadi. Limit: foydalanuvchiga soatiga 30 so'rov. "Maslahat" rejimida mentor yechimni to'liq bermaydi.

Kalit olish: Anthropic — https://console.anthropic.com, OpenAI — https://platform.openai.com/api-keys.

## Testlar

```powershell
cd backend
npm test
```
36 ta test (Jest): XP/daraja/streak/yuraklar qoidalari, savollarni baholash (7 tur), javoblar klientga sizib chiqmasligi, progress/qulflash qoidalari, server statik qoidalari, AI provayderlar (soxta fetch bilan), hamda **kontent yaxlitligi** — har bir dars uch tilda, har bir savolning to'g'ri javobi qabul qilinadi, har bir topshiriq yechimi server qoidalaridan o'tadi.

Frontend tiplarini tekshirish: `cd frontend && npm run typecheck`. Backend: `cd backend && npm run typecheck`.

<a id="deploy"></a>
## Deploy (internetga chiqarish)

Frontend va backend alohida deploy qilinadi.

### Backend — Render / Railway (Web Service)
1. Kodni GitHub'ga yuklang (`.env` fayllar `.gitignore` da — yuklanmaydi).
2. Render → **New Web Service** → repo:
   - Root directory: `backend`
   - Build command: `npm install && npm run build`
   - Start command: `npm run start:prod`
3. Environment: `NODE_ENV=production`, `MONGODB_URI` (Atlas), `JWT_SECRET`, `CLIENT_URL=https://codeverse.vercel.app`, `COOKIE_SAMESITE=none` (HTTPS majburiy), AI va SMTP kalitlari.
4. Birinchi deploydan keyin Render **Shell**'da: `npm run seed:prod` (development'da `npm run seed`).

### Frontend — Vercel / Netlify
- Root `frontend`, build `npm run build`, output `dist`, env `VITE_API_URL=https://codeverse-api.onrender.com/api`. SPA yo'naltirish `frontend/vercel.json` da tayyor.

### Admin tayinlash (production)
Ro'yxatdan o'ting, so'ng MongoDB Atlas → *Browse Collections* → `users` → hujjatingizda `role` ni `"admin"` qiling (yoki mongosh: `db.users.updateOne({email:"siz@mail.uz"},{$set:{role:"admin"}})`).

## Xavfsizlik

- Parollar **bcrypt** (12 raund); JWT **httpOnly** cookie'da; parol o'zgarganda/bloklanganda barcha sessiyalar bekor qilinadi (`tokenVersion`).
- Barcha kiruvchi ma'lumotlar **Zod** bilan tekshiriladi; xatolar bir xil formatda (`{ error: { code, message } }`).
- **XP, tangalar, darajalar, yutuqlar faqat serverda** hisoblanadi; har bir mukofot `XpEvent (user, key)` noyob indeksi bilan — ikki marta berilmaydi.
- Test javoblari klientga yuborilmaydi (`publicQuestion`); `order`/`match` savollari deterministik aralashtiriladi va serverda tekshiriladi.
- Foydalanuvchi kodi **serverda bajarilmaydi**. Brauzerda opaque-origin sandbox iframe'da ishlaydi (sayt cookie/localStorage/API'ga kira olmaydi), cheksiz sikllardan himoyalangan. Server topshiriqni qabul qilishda kodni statik qoidalar bilan qo'shimcha tekshiradi.
- Helmet, CORS (faqat `CLIENT_URL`), rate limit (umumiy, auth, AI), JSON hajmi cheklovi, markdown DOMPurify bilan tozalanadi, reytingda email ko'rsatilmaydi, parolni tiklash email mavjudligini oshkor qilmaydi.
- Maxfiy kalitlar faqat `.env` da; repo'da `.env.example` (haqiqiy kalitlarsiz).

> ⚠️ Halol cheklov: brauzerdagi testlar klientda bajariladi, shuning uchun juda tajribali foydalanuvchi API'ga qo'lda "o'tdi" deb yuborishi mumkin; server statik qoidalari buni qiyinlashtiradi, lekin to'liq kafolat bermaydi. XP'ning boshqa manbalari (testlar, imtihonlar, janglar) to'liq serverda baholanadi.

<a id="kontent"></a>
## Kontent qo'shish va admin panel

- **Admin panel** (`/admin`): kurs → modul → dars daraxti; har birini JSON muharririda tahrirlash/yaratish/o'chirish; topshiriqlar va savollar; yutuqlar; shikoyatlar ("Xato haqida xabar berish" tugmasi orqali keladi).
- **Kod orqali**: `backend/src/seed/content/<kurs>/m1.ts ... m5.ts`. Uch tilli matn: `['uz', 'ru', 'en']`. Savol yordamchilari: `mcq`, `tf`, `fill`, `out`, `bug`, `order`, `match`. Topshiriq testlari — brauzerda bajariladigan ifodalar, yordamchilar: `$`, `$$`, `css(sel, prop)`, `text(sel)`, `exists(sel)`, `logs`, `fn(name)`, `tick(ms)`. O'zgartirgach `npm run seed` va `npm test`.
- Sandbox'dagi soxta API (Fetch darslari uchun): `https://api.codeverse.dev` — `/users`, `/users/1`, `/todos`, `/posts/1`, `/quote`.

<a id="muammolar"></a>
## Muammolarni hal qilish

| Belgi | Yechim |
|---|---|
| `❌ .env sozlamalarida xato: JWT_SECRET ...` | `backend/.env` yarating va 32+ belgili `JWT_SECRET` yozing |
| `MongoDB'ga ulanib bo'lmadi` | `MONGODB_URI` ni, Atlas'da IP ruxsatini (Network Access) va parolni tekshiring |
| `npm` buyrug'i topilmadi | Node.js'ni qayta o'rnating, PowerShell'ni yoping/oching |
| PowerShell'da skript bloklangan (`running scripts is disabled`) | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| 5000 port band | `.env` da `PORT=5001` va `frontend/vite.config.ts` dagi proxy `target` ni o'zgartiring |
| React darslarida "React/Babel yuklanmadi" | Sandbox React 18 va Babel'ni unpkg.com CDN'dan yuklaydi — internet aloqasi kerak |
| Login'dan keyin darhol chiqib ketadi (deploy) | Turli domenlarda `COOKIE_SAMESITE=none` va HTTPS; `CLIENT_URL` aniq frontend manzili bo'lsin |
| Parolni tiklash xati kelmadi | SMTP sozlanmagan bo'lsa havola server konsolida chiqadi (development) |
