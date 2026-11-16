import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Parol kamida 8 belgidan iborat bo\'lsin')
  .max(100)
  .regex(/[A-Za-z]/, 'Parolda kamida bitta harf bo\'lsin')
  .regex(/\d/, 'Parolda kamida bitta raqam bo\'lsin');

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Login kamida 3 belgi')
    .max(24)
    .regex(/^[a-z0-9_]+$/, 'Login faqat lotin harflari, raqam va _ dan iborat bo\'lsin'),
  displayName: z.string().trim().min(2, 'Ism kamida 2 belgi').max(50),
  email: z.string().trim().toLowerCase().email('Email noto\'g\'ri'),
  password: passwordSchema,
  lang: z.enum(['uz', 'ru', 'en']).optional(),
});
export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({ login: z.string().trim().toLowerCase().min(3).max(100), password: z.string().min(1).max(100) });
export type LoginDto = z.infer<typeof loginSchema>;

export const forgotSchema = z.object({ email: z.string().trim().toLowerCase().email() });
export const resetSchema = z.object({ token: z.string().length(64), password: passwordSchema });
export const changePasswordSchema = z.object({ current: z.string().min(1), next: passwordSchema });
