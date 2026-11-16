/**
 * Ilova xatosi. Global filter (AllExceptionsFilter) uni quyidagi formatga aylantiradi:
 *   { error: { code, message, details } }  — frontend aynan shu formatni kutadi.
 */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message?: string,
    public readonly details?: unknown,
  ) {
    super(message || code);
  }
}

export const badRequest = (code: string, msg?: string, details?: unknown) => new AppError(400, code, msg, details);
export const unauthorized = (msg = 'Avtorizatsiya talab qilinadi') => new AppError(401, 'UNAUTHORIZED', msg);
export const forbidden = (msg = 'Ruxsat yo\'q') => new AppError(403, 'FORBIDDEN', msg);
export const notFound = (what = 'Resurs') => new AppError(404, 'NOT_FOUND', `${what} topilmadi`);
export const conflict = (code: string, msg?: string) => new AppError(409, code, msg);
