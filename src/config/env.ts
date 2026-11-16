import 'dotenv/config';
import { z } from 'zod';

const bool = (def: 'true' | 'false') =>
  z
    .string()
    .default(def)
    .transform((v) => v === 'true');

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  // Bir yoki bir nechta manzil (vergul bilan). Birinchisi email/sertifikat havolalari uchun.
  CLIENT_URL: z
    .string()
    .default('http://localhost:5173')
    .refine((v) => v.split(',').every((s) => z.string().url().safeParse(s.trim()).success), 'CLIENT_URL to\'g\'ri URL bo\'lishi kerak'),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/codeverse'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET kamida 32 belgi bo\'lishi kerak'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  AI_PROVIDER: z.enum(['', 'anthropic', 'openai']).default(''),
  ANTHROPIC_API_KEY: z.string().default(''),
  ANTHROPIC_MODEL: z.string().default('claude-sonnet-5-5'),
  OPENAI_API_KEY: z.string().default(''),
  OPENAI_MODEL: z.string().default('gpt-4.1-mini'),
  SMTP_HOST: z.string().default(''),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  MAIL_FROM: z.string().default('CODEVERSE <no-reply@codeverse.local>'),
  SEED_DEMO: bool('true'),
  DEMO_EMAIL: z.string().email().default('demo@codeverse.dev'),
  DEMO_PASSWORD: z.string().min(8).default('Demo12345!'),
  ADMIN_EMAIL: z.string().email().default('admin@codeverse.dev'),
  ADMIN_PASSWORD: z.string().min(8).default('Admin12345!'),
});

export type Env = z.infer<typeof schema>;

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ .env sozlamalarida xato:');
  for (const issue of parsed.error.issues) console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  console.error('backend/.env.example faylidan nusxa olib, backend/.env yarating.');
  process.exit(1);
}

export const env: Env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
/** CORS uchun barcha ruxsat etilgan manzillar */
export const CLIENT_ORIGINS = env.CLIENT_URL.split(',').map((s) => s.trim().replace(/\/$/, ''));
/** Havolalar (email, sertifikat) uchun asosiy frontend manzili */
export const CLIENT_ORIGIN = CLIENT_ORIGINS[0];
