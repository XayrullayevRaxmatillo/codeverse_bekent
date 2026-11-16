import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../errors';
import { isProd } from '../../config/env';

type ErrorBody = { error: { code: string; message: string; details?: unknown } };

/** Barcha xatolarni yagona formatga keltiradi: { error: { code, message, details } } */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(err: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    if (res.headersSent) return;
    const [status, body] = this.toResponse(err, req);
    res.status(status).json(body);
  }

  private toResponse(err: any, req: Request): [number, ErrorBody] {
    if (err instanceof AppError) {
      return [err.status, { error: { code: err.code, message: err.message, details: err.details } }];
    }
    if (err instanceof mongoose.Error.CastError) {
      return [400, { error: { code: 'BAD_ID', message: 'Noto\'g\'ri identifikator' } }];
    }
    if (err instanceof mongoose.Error.ValidationError) {
      const first = Object.values(err.errors)[0] as { message?: string } | undefined;
      return [400, { error: { code: 'VALIDATION', message: first?.message ?? 'Validatsiya xatosi' } }];
    }
    if (err?.code === 11000) {
      return [409, { error: { code: 'DUPLICATE', message: 'Bunday qiymat allaqachon mavjud', details: err.keyValue ? Object.keys(err.keyValue) : undefined } }];
    }
    if (err instanceof NotFoundException && String((err.getResponse() as any)?.message ?? '').startsWith('Cannot ')) {
      // Nest'ning "Cannot GET /api/xyz" xatosi — mavjud bo'lmagan yo'l
      return [404, { error: { code: 'NOT_FOUND', message: `Yo'l topilmadi: ${req.method} ${req.originalUrl}` } }];
    }
    if (err instanceof HttpException) {
      const status = err.getStatus();
      const r = err.getResponse() as any;
      const message = Array.isArray(r?.message) ? r.message[0] : (r?.message ?? err.message);
      const code = HttpStatus[status] ?? 'ERROR';
      return [status, { error: { code, message: String(message) } }];
    }
    this.logger.error(err?.stack ?? err);
    return [500, { error: { code: 'SERVER_ERROR', message: isProd ? 'Serverda xatolik' : String(err?.message || err) } }];
  }
}
