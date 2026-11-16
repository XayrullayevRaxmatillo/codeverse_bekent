import { z } from 'zod';
import { objectId as id } from '../../common/pipes/zod-validation.pipe';

export const tri = z.object({ uz: z.string().max(20_000).default(''), ru: z.string().max(20_000).default(''), en: z.string().max(20_000).default('') });
const triReq = tri.refine((v) => v.uz || v.ru || v.en, 'Kamida bitta tilda matn kiriting');
const code = z.object({ html: z.string().max(30_000).default(''), css: z.string().max(30_000).default(''), js: z.string().max(30_000).default('') });
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(2)
  .max(60)
  .regex(/^[a-z0-9-]+$/, 'Slug: faqat a-z, 0-9 va -');

// ---- Foydalanuvchilar ----
export const usersQuery = z.object({ q: z.string().max(60).default(''), page: z.coerce.number().int().min(1).default(1) });
export const userPatch = z.object({ role: z.enum(['user', 'admin']).optional(), isBanned: z.boolean().optional() });

// ---- Kurslar ----
export const courseBody = z.object({
  slug,
  world: z.string().trim().min(2).max(40),
  order: z.number().int().min(0).max(1000).default(0),
  title: triReq,
  description: tri.default({}),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default('#7C5CFC'),
  icon: z.string().max(30).default('code'),
  prerequisite: z.string().max(60).nullable().default(null),
  comingSoon: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});
export const coursePatch = courseBody.partial();

// ---- Modullar ----
export const moduleBody = z.object({
  course: id,
  slug,
  order: z.number().int().min(0).max(1000).default(0),
  title: triReq,
  description: tri.default({}),
  passScore: z.number().int().min(1).max(100).default(70),
});
export const modulePatch = moduleBody.omit({ course: true }).partial();
export const modulesQuery = z.object({ course: id });

// ---- Darslar ----
export const lessonBody = z.object({
  module: id,
  slug,
  order: z.number().int().min(0).max(1000).default(0),
  title: triReq,
  content: tri.default({}),
  example: z.string().max(20_000).default(''),
  exampleMode: z.enum(['web', 'js', 'react']).default('web'),
  isGuest: z.boolean().default(false),
  minutes: z.number().int().min(1).max(120).default(8),
});
export const lessonPatch = lessonBody.omit({ module: true }).partial();

// ---- Topshiriqlar ----
export const challengeBody = z.object({
  key: z.string().trim().min(3).max(80),
  kind: z.enum(['lesson', 'project', 'practice']).default('lesson'),
  course: id.optional(),
  lesson: id.optional(),
  title: triReq,
  mode: z.enum(['web', 'js', 'react']).default('web'),
  instructions: triReq,
  starter: code.default({}),
  solution: code.default({}),
  tests: z
    .array(z.object({ d: tri, e: z.string().min(1).max(2000) }))
    .max(20)
    .default([]),
  rules: z
    .array(
      z.object({
        p: z.string().min(1).max(500),
        f: z.string().max(5).optional(),
        t: z.enum(['html', 'css', 'js', 'all']).optional(),
        not: z.boolean().optional(),
        d: tri.default({}),
      }),
    )
    .max(20)
    .default([]),
  hints: z.array(tri).max(5).default([]),
  explanation: tri.default({}),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('easy'),
});
export const challengePatch = challengeBody.partial();
export const challengesQuery = z.object({ kind: z.enum(['lesson', 'project', 'practice']).optional() });

// ---- Savollar ----
export const questionBody = z
  .object({
    key: z.string().trim().min(3).max(80),
    lesson: id.optional(),
    module: id.optional(),
    source: z.enum(['lesson', 'exam']).default('lesson'),
    order: z.number().int().min(0).max(1000).default(0),
    type: z.enum(['mcq', 'tf', 'fill', 'out', 'bug', 'order', 'match']),
    prompt: triReq,
    code: z.string().max(5000).default(''),
    options: z.array(tri).max(8).default([]),
    answer: z.union([z.number().int(), z.boolean()]).optional(),
    accept: z.array(z.string().max(500)).max(10).default([]),
    ci: z.boolean().optional(),
    lines: z.array(z.string().max(300)).max(12).default([]),
    pairs: z
      .array(z.object({ left: z.string().max(200), right: z.string().max(200) }))
      .max(8)
      .default([]),
    explanation: tri.default({}),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('easy'),
  })
  .superRefine((q, ctx) => {
    const err = (message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    const idx = q.answer as number;
    if ((q.type === 'mcq' || q.type === 'bug') && (q.options.length < 2 || !Number.isInteger(idx) || idx < 0 || idx >= q.options.length))
      err('Variantlar (≥2) va to\'g\'ri javob indeksi kerak');
    if (q.type === 'tf' && typeof q.answer !== 'boolean') err('To\'g\'ri/noto\'g\'ri javob (boolean) kerak');
    if ((q.type === 'fill' || q.type === 'out') && !q.accept.length) err('Qabul qilinadigan javoblar kerak');
    if (q.type === 'order' && q.lines.length < 2) err('Kamida 2 qator kerak');
    if (q.type === 'match' && q.pairs.length < 2) err('Kamida 2 juftlik kerak');
    if (!q.lesson && !q.module) err('lesson yoki module ko\'rsatilishi kerak');
  });
export type QuestionDto = z.infer<typeof questionBody>;
export const questionsQuery = z.object({ lesson: id.optional(), module: id.optional() });

// ---- Yutuqlar ----
export const achievementBody = z.object({
  key: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9_-]+$/),
  title: triReq,
  description: tri.default({}),
  icon: z.string().max(30).default('trophy'),
  condition: z.object({
    type: z.string().min(2).max(30),
    value: z.number().int().min(0).default(1),
    course: z.string().max(60).nullable().optional(),
    module: z.string().max(60).optional(),
  }),
  rewardCoins: z.number().int().min(0).max(10_000).default(20),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary']).default('common'),
});
export const achievementPatch = achievementBody.partial();

// ---- Shikoyatlar ----
export const reportsQuery = z.object({ status: z.enum(['open', 'resolved', 'dismissed', 'all']).default('open') });
export const reportPatch = z.object({ status: z.enum(['open', 'resolved', 'dismissed']), adminNote: z.string().max(1000).optional() });
