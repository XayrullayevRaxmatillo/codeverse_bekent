import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** Joriy foydalanuvchi (AuthGuard / OptionalAuthGuard o'rnatadi). Mehmon bo'lsa undefined. */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user);
