// Seed: kurslar, darslar, topshiriqlar, savollar, yutuqlar va (development'da) demo akkauntlar.
// Ishga tushirish:  npm run seed        — mavjud ID'larni saqlab yangilaydi (progress yo'qolmaydi)
//                   npm run seed:reset  — barcha kontent va progressni o'chirib qayta yaratadi
//                   npm run seed:prod   — build'dan keyin (dist) ishga tushirish
import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { env, isProd } from '../config/env';
import { DatabaseModule } from '../database/database.module';
import { AnyModel, M } from '../database/schemas';
import { COINS, dayKey, XP } from '../lib/gamification';
import { ACHIEVEMENTS } from './achievements';
import { flatten } from './build';
import { comingSoon, courses } from './content/index';
import { T } from './helpers';

type Models = Record<keyof typeof M, AnyModel>;

const upsert = (Model: AnyModel, filter: Record<string, unknown>, doc: Record<string, unknown>) => Model.findOneAndUpdate(filter, { $set: doc }, { upsert: true, new: true, setDefaultsOnInsert: true });

function questionDoc(q: any, refs: Record<string, unknown>) {
  return {
    key: q.key,
    ...refs,
    source: q.source,
    order: q.order,
    type: q.type,
    prompt: q.prompt,
    code: q.code ?? '',
    options: q.options ?? [],
    answer: q.answer,
    accept: q.accept ?? [],
    lines: q.lines ?? [],
    pairs: q.pairs ?? [],
    explanation: q.explanation,
    difficulty: q.difficulty ?? 'easy',
  };
}

function challengeDoc(c: any, refs: Record<string, unknown>) {
  return { key: c.key, kind: c.kind, ...refs, title: c.title, mode: c.mode, instructions: c.instructions, starter: c.starter, solution: c.solution, tests: c.tests, rules: c.rules, hints: c.hints, explanation: c.explanation, difficulty: c.difficulty };
}

async function seedContent({ Course, Module, Lesson, Challenge, Question, Achievement }: Models) {
  const data = flatten(courses);
  const counts = { courses: 0, modules: 0, lessons: 0, challenges: 0, questions: 0 };
  for (const { course, modules, project } of data) {
    const c = await upsert(Course, { slug: course.slug }, course);
    counts.courses++;
    const keepModules = [];
    for (const m of modules) {
      const mod = await upsert(Module, { course: c._id, slug: m.slug }, { course: c._id, slug: m.slug, order: m.order, title: m.title, description: m.description });
      keepModules.push(mod._id);
      counts.modules++;
      const keepLessons = [];
      for (const l of m.lessons) {
        const lesson = await upsert(Lesson, { module: mod._id, slug: l.slug }, { course: c._id, module: mod._id, slug: l.slug, order: l.order, title: l.title, content: l.content, example: l.example, exampleMode: l.exampleMode, minutes: l.minutes, isGuest: l.isGuest });
        keepLessons.push(lesson._id);
        counts.lessons++;
        if (l.challenge) {
          await upsert(Challenge, { key: l.challenge.key }, challengeDoc(l.challenge, { course: c._id, lesson: lesson._id }));
          counts.challenges++;
        } else {
          await Challenge.deleteMany({ lesson: lesson._id, kind: 'lesson' });
        }
        for (const q of l.questions) await upsert(Question, { key: q.key }, questionDoc(q, { course: c._id, module: mod._id, lesson: lesson._id }));
        await Question.deleteMany({ lesson: lesson._id, key: { $nin: l.questions.map((q) => q.key) } });
        counts.questions += l.questions.length;
      }
      await Lesson.deleteMany({ module: mod._id, _id: { $nin: keepLessons } });
      for (const q of m.exam) await upsert(Question, { key: q.key }, questionDoc(q, { course: c._id, module: mod._id, lesson: null }));
      await Question.deleteMany({ module: mod._id, source: 'exam', key: { $nin: m.exam.map((q) => q.key) } });
      counts.questions += m.exam.length;
    }
    await Module.deleteMany({ course: c._id, _id: { $nin: keepModules } });
    if (project) {
      await upsert(Challenge, { key: project.key }, challengeDoc(project, { course: c._id, lesson: null }));
      counts.challenges++;
    }
  }
  for (const cs of comingSoon) {
    await upsert(Course, { slug: cs.slug }, { ...cs, title: T(cs.title), description: T(cs.description), comingSoon: true, isPublished: true });
  }
  for (const a of ACHIEVEMENTS) await upsert(Achievement, { key: a.key }, a);
  return counts;
}

/** Demo foydalanuvchi: HTML 1-modul tugatilgan, bir necha kunlik faollik bilan */
async function seedDemoUsers({ User, Course, Module, Lesson, Challenge, XpEvent, UserProgress }: Models) {
  const adminExists = await User.findOne({ email: env.ADMIN_EMAIL });
  if (!adminExists) {
    await User.create({ username: 'admin', displayName: 'CODEVERSE Admin', email: env.ADMIN_EMAIL, passwordHash: await bcrypt.hash(env.ADMIN_PASSWORD, 12), role: 'admin', inventory: ['avatar-rocket', 'avatar-robot', 'theme-default', 'frame-none'], equipped: { avatar: 'avatar-robot', theme: 'theme-default', frame: 'frame-none' } });
  }
  let demo = await User.findOne({ email: env.DEMO_EMAIL });
  if (demo) return { created: false };

  demo = await User.create({ username: 'demo', displayName: 'Demo Talaba', email: env.DEMO_EMAIL, passwordHash: await bcrypt.hash(env.DEMO_PASSWORD, 12), inventory: ['avatar-rocket', 'avatar-cat', 'theme-default', 'theme-ocean', 'frame-none'], equipped: { avatar: 'avatar-cat', theme: 'theme-default', frame: 'frame-none' } });

  const html = await Course.findOne({ slug: 'html' });
  const firstModule = await Module.findOne({ course: html._id }).sort({ order: 1 });
  const lessons = await Lesson.find({ module: firstModule._id }).sort({ order: 1 });
  const events: Record<string, unknown>[] = [];
  const days = [4, 3, 2, 1, 0].map((d) => dayKey(new Date(Date.now() - d * 86_400_000)));
  const lessonEntries: Record<string, unknown>[] = [];
  let xp = 0;
  let coins = 0;
  lessons.forEach((l: any, i: number) => {
    const day = days[Math.min(i, days.length - 1)];
    lessonEntries.push({ lesson: l._id, started: true, quizBest: 100, challengeDone: true, completed: true, completedAt: new Date() });
    for (const [key, reason, amount, c] of <[string, string, number, number][]>[
      [`lesson:${l._id}`, 'lesson', XP.lesson, COINS.lesson],
      [`quiz:${l._id}`, 'quiz', XP.quiz, COINS.quiz],
    ]) {
      events.push({ user: demo._id, key, reason, amount, coins: c, day });
      xp += amount;
      coins += c;
    }
  });
  const challenges = await Challenge.find({ lesson: { $in: lessons.map((l: any) => l._id) } });
  for (const ch of challenges) {
    events.push({ user: demo._id, key: `ch:${ch._id}`, reason: 'challenge', amount: XP.challenge, coins: COINS.challenge, day: days[2] });
    xp += XP.challenge;
    coins += COINS.challenge;
  }
  events.push({ user: demo._id, key: `exam:${firstModule._id}`, reason: 'exam', amount: XP.exam, coins: COINS.exam, day: days[4] });
  xp += XP.exam;
  coins += COINS.exam;
  await XpEvent.insertMany(events);
  await UserProgress.create({ user: demo._id, course: html._id, lessons: lessonEntries, exams: [{ module: firstModule._id, best: 86, passed: true, passedAt: new Date(), attempts: 1 }], lastLesson: lessons[lessons.length - 1]._id });
  const achievementKeys = ['first-lesson', 'first-code', 'perfect-quiz', 'first-exam'];
  await User.updateOne(
    { _id: demo._id },
    {
      $set: {
        xp,
        coins: coins + 100,
        streak: { current: 5, best: 5, lastDay: days[4] },
        activityDays: days,
        achievements: achievementKeys.map((key) => ({ key, unlockedAt: new Date() })),
        stats: { lessonsCompleted: lessons.length, challengesCompleted: challenges.length, quizzesPassed: lessons.length, perfectQuizzes: lessons.length, examsPassed: 1, projectsCompleted: 0, codeRuns: 12, battlesPlayed: 0, gamesPlayed: 0 },
      },
    }
  );

  // Reyting bo'sh ko'rinmasligi uchun bir nechta namunaviy o'quvchilar
  const sample: [string, string, number, string][] = [
    ['aziza', 'Aziza', 640, 'avatar-fox'],
    ['bekzod', 'Bekzod', 420, 'avatar-robot'],
    ['dilnoza', 'Dilnoza', 910, 'avatar-wizard'],
    ['timur', 'Timur', 260, 'avatar-ninja'],
  ];
  for (const [username, displayName, sxp, avatar] of sample) {
    if (await User.exists({ username })) continue;
    const u = await User.create({ username, displayName, email: `${username}@example.com`, passwordHash: await bcrypt.hash(`${username}-${Math.random()}`, 10), xp: sxp, inventory: [avatar, 'theme-default', 'frame-none'], equipped: { avatar, theme: 'theme-default', frame: 'frame-none' } });
    await XpEvent.insertMany(days.map((day, i) => ({ user: u._id, key: `seed:${day}`, reason: 'seed', amount: Math.round(sxp / 10) + i * 5, day })));
  }
  return { created: true };
}

async function main() {
  const reset = process.argv.includes('--reset');
  const log = new Logger('Seed');
  // Faqat DatabaseModule — HTTP server ishga tushmaydi
  const app = await NestFactory.createApplicationContext(DatabaseModule, { logger: ['error', 'warn', 'log'] });
  const models = Object.fromEntries(Object.keys(M).map((k) => [k, app.get<AnyModel>(getModelToken(k))])) as Models;
  try {
    if (reset) {
      log.log('🧹 Kontent va progress o\'chirilmoqda...');
      const { Course, Module, Lesson, Challenge, Question, Achievement, UserProgress, XpEvent, Battle, Certificate, Report, User } = models;
      await Promise.all([Course, Module, Lesson, Challenge, Question, Achievement, UserProgress, XpEvent, Battle, Certificate, Report].map((Model) => Model.deleteMany({})));
      if (!isProd) await User.deleteMany({ email: { $in: [env.DEMO_EMAIL, env.ADMIN_EMAIL] } });
    }
    const counts = await seedContent(models);
    log.log(`✅ Kontent: ${counts.courses} kurs, ${counts.modules} modul, ${counts.lessons} dars, ${counts.challenges} topshiriq, ${counts.questions} savol`);
    if (env.SEED_DEMO && !isProd) {
      const r = await seedDemoUsers(models);
      log.log(r.created ? '👤 Demo akkauntlar yaratildi' : '👤 Demo akkauntlar allaqachon mavjud');
      log.log(`   Demo:  ${env.DEMO_EMAIL} / ${env.DEMO_PASSWORD}`);
      log.log(`   Admin: ${env.ADMIN_EMAIL} / ${env.ADMIN_PASSWORD}`);
    } else if (isProd) {
      log.log('ℹ️  Production: demo akkauntlar yaratilmadi. Admin yaratish: README → "Admin tayinlash".');
    }
  } finally {
    await app.close();
  }
}

main().catch((e) => {
  console.error('❌ Seed xatosi:', e);
  process.exit(1);
});
