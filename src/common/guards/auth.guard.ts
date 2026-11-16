import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { forbidden, unauthorized } from '../errors';
import type { AuthedRequest } from '../types';

/** Majburiy avtorizatsiya: JWT (cookie yoki Bearer) bo'lmasa 401, bloklangan bo'lsa 403 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    const user = await this.auth.resolveUser(req);
    if (!user) throw unauthorized();
    if (user.isBanned) throw forbidden('Akkaunt bloklangan');
    req.user = user;
    return true;
  }
}

/** Ixtiyoriy avtorizatsiya: token bo'lsa req.user o'rnatiladi, bo'lmasa mehmon sifatida davom etadi */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    const user = await this.auth.resolveUser(req);
    if (user && !user.isBanned) req.user = user;
    return true;
  }
}

/** Faqat admin (AuthGuard'dan keyin ishlatiladi) */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    if (req.user?.role !== 'admin') throw forbidden('Faqat admin uchun');
    return true;
  }
}
