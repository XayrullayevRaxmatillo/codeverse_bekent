import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import type { Response } from 'express';
import { AppError } from '../errors';
import type { AuthedRequest } from '../types';

type Options = {
  windowMs: number;
  limit: number;
  message: string;
  /** Kalit: IP bo'yicha yoki foydalanuvchi bo'yicha (AuthGuard'dan keyin) */
  by: 'ip' | 'user';
};

/**
 * Oddiy xotiradagi (in-memory) rate limiter guard. Bitta server nusxasi uchun yetarli;
 * bir nechta nusxa bo'lsa Redis asosidagi yechimga almashtiring.
 * Bitta RateLimit(...) natijasini ishlatgan barcha route'lar umumiy hisoblagichga ega.
 */
export function RateLimit(opts: Options): Type<CanActivate> {
  const hits = new Map<string, { count: number; resetAt: number }>();
  let lastSweep = Date.now();

  class RateLimitGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
      const http = ctx.switchToHttp();
      const req = http.getRequest<AuthedRequest>();
      const res = http.getResponse<Response>();
      const now = Date.now();
      if (now - lastSweep > opts.windowMs) {
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
        lastSweep = now;
      }
      const key = opts.by === 'user' ? `u:${req.user?._id ?? 'anon'}` : `ip:${req.ip}`;
      let entry = hits.get(key);
      if (!entry || entry.resetAt <= now) {
        entry = { count: 0, resetAt: now + opts.windowMs };
        hits.set(key, entry);
      }
      entry.count++;
      const resetSec = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('RateLimit', `limit=${opts.limit}, remaining=${Math.max(0, opts.limit - entry.count)}, reset=${resetSec}`);
      if (entry.count > opts.limit) {
        res.setHeader('Retry-After', String(resetSec));
        throw new AppError(429, 'RATE_LIMIT', opts.message);
      }
      return true;
    }
  }
  return mixin(RateLimitGuard);
}

/** Auth (register/login/parol tiklash): 15 daqiqada 30 ta urinish, IP bo'yicha */
export const AuthRateLimit = RateLimit({
  windowMs: 15 * 60_000,
  limit: 30,
  by: 'ip',
  message: 'Juda ko\'p urinish. 15 daqiqadan keyin qayta urinib ko\'ring.',
});

/** AI mentor: soatiga 30 ta so'rov, foydalanuvchi bo'yicha */
export const AiRateLimit = RateLimit({
  windowMs: 60 * 60_000,
  limit: 30,
  by: 'user',
  message: 'AI mentor limiti tugadi (soatiga 30 ta so\'rov). Keyinroq urinib ko\'ring.',
});
