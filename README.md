# CODEVERSE — Backend (NestJS)

CODEVERSE platformasining API serveri: NestJS 11 + MongoDB (Mongoose). Frontend (**codeverse-frontend** — alohida loyiha) bilan faqat HTTP orqali ishlaydi — barcha yo'llar `/api` ostida.

## Tez boshlash

```bash
cp .env.example .env          # JWT_SECRET (32+ belgi) va MONGODB_URI ni yozing
npm install
npm run seed                  # kurslar, savollar, yutuqlar + demo akkauntlar
npm run start:dev             # http://localhost:5000/api/health
```

| Buyruq | Vazifasi |
|---|---|
| `npm run start:dev` | Development (watch) |
| `npm run build` → `npm run start:prod` | Production (`dist/`) |
| `npm run seed` / `seed:reset` | Kontentni yangilash / bazani to'liq qayta yaratish |
| `npm run seed:prod` | Build'dan keyin seed (ts-node'siz) |
| `npm test` | Jest — 36 ta test |
| `npm run typecheck` | TypeScript tekshiruvi |

## Arxitektura

```
src/
├── main.ts                    bootstrap: helmet, CORS, JSON (200kb), cookie-parser, umumiy rate limit, /api prefiks
├── app.module.ts              barcha modullar + APP_FILTER (AllExceptionsFilter)
├── config/env.ts              .env → Zod bilan tekshiriladi (xato bo'lsa server ishga tushmaydi)
├── common/
│   ├── errors.ts              AppError + badRequest / unauthorized / forbidden / notFound / conflict
│   ├── filters/               AllExceptionsFilter → { error: { code, message, details } }
│   ├── pipes/                 ZodPipe (body/query), ObjectIdPipe (:id)
│   ├── guards/                AuthGuard, OptionalAuthGuard, AdminGuard, RateLimit (Auth / AI)
│   ├── decorators/            @CurrentUser()
│   └── utils/serialize.ts     userSummary, publicProfile, courseBase, challengePublic ...
├── database/                  DatabaseModule (@Global): ulanish + 12 ta model (@InjectModel(M.User))
├── lib/                       sof funksiyalar (DB'siz, testlanadi): gamification, grading,
│                              progress-rules, rules, shop, i18n, certificate-pdf, ai/
├── modules/
│   ├── auth/      /api/auth          register, login, logout, me, parol tiklash/o'zgartirish
│   ├── mail/      (@Global)          MailService (SMTP yoki dev konsol)
│   ├── rewards/                      RewardsService — XP, tanga, streak, yutuqlar (idempotent)
│   ├── courses/   /api/courses       CourseProgressService — xarita, qulflash, progress
│   ├── lessons/   /api/lessons, /api/public, /api/progress
│   ├── exams/     /api/modules/:id/exam
│   ├── challenges/ /api/challenges
│   ├── play/      /api/play          o'yin, jang, kunlik challenge, yuraklar
│   ├── users/     /api/users         profil, statistika, do'kon, do'stlar
│   ├── leaderboard/, achievements/, certificates/ (PDF), ai/, reports/, health/
│   └── admin/     /api/admin         statistika, foydalanuvchilar, kontent CRUD, shikoyatlar
└── seed/                      seed.ts (Nest application context orqali) + content/*.ts
```

### So'rov qanday o'tadi

`express middleware (helmet, cors, json, cookie, limit)` → **Guard** (`AuthGuard` → `req.user`, `AdminGuard`, `RateLimit`) → **Pipe** (`ZodPipe` — validatsiya + tozalash) → **Controller** → **Service** → Mongoose. Har qanday xato `AllExceptionsFilter` orqali bir xil formatda qaytadi.

### API mosligi

Express versiyasidagi **80 ta endpoint** bir xil yo'l, metod, javob formati, status kod (`201` faqat yaratishda) va `cv_token` cookie bilan saqlangan — frontend o'zgarishsiz ishlaydi.

## Eslatmalar

- `RateLimit` guard'i xotirada ishlaydi (bitta server nusxasi uchun). Bir nechta nusxa bo'lsa, Redis asosidagi limiter'ga almashtiring.
- Sxemalar `new Schema(...)` ko'rinishida (Express versiyasidan to'g'ridan-to'g'ri ko'chirilgan), modellar `Model<any>` turida. Xohlasangiz keyinchalik `@Schema()/@Prop()` dekoratorli klasslarga o'tkazish mumkin.
- `SERVE_CLIENT` olib tashlandi: frontend endi alohida deploy qilinadi (Vercel/Netlify), backend faqat API.

## Frontend bilan ulash

- **Development:** frontend `npm run dev` (5173) → Vite `/api` ni shu backendga (5000) proksi qiladi. `.env` da `CLIENT_URL=http://localhost:5173`.
- **Production:** backend `.env` da `CLIENT_URL=https://<frontend-manzili>`, `COOKIE_SAMESITE=none`; frontend'da `VITE_API_URL=https://<backend-manzili>/api`.

## Deploy (Render / Railway)

- Build: `npm install && npm run build`
- Start: `npm run start:prod`
- Environment: `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `COOKIE_SAMESITE=none`, AI/SMTP kalitlari
- Birinchi deploydan keyin: `npm run seed:prod`

To'liq qo'llanma (MongoDB sozlash, AI mentor, xavfsizlik, muammolar): `GUIDE.md`.
