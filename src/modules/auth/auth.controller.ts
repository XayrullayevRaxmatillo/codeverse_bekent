import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthGuard, OptionalAuthGuard } from '../../common/guards/auth.guard';
import { AuthRateLimit } from '../../common/guards/rate-limit.guard';
import { ZodPipe } from '../../common/pipes/zod-validation.pipe';
import { userSummary } from '../../common/utils/serialize';
import type { Doc } from '../../database/schemas';
import { changePasswordSchema, forgotSchema, loginSchema, registerSchema, resetSchema } from './auth.schemas';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @UseGuards(AuthRateLimit)
  async register(@Body(new ZodPipe(registerSchema)) body, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.register(body);
    this.auth.setAuthCookie(res, user);
    return { user: userSummary(user) }; // 201
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(AuthRateLimit)
  async login(@Body(new ZodPipe(loginSchema)) body, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.login(body);
    this.auth.setAuthCookie(res, user);
    return { user: userSummary(user) };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    this.auth.clearAuthCookie(res);
    return { ok: true };
  }

  @Get('me')
  @UseGuards(OptionalAuthGuard)
  me(@CurrentUser() user?: Doc) {
    return { user: user ? userSummary(user) : null };
  }

  @Post('forgot-password')
  @HttpCode(200)
  @UseGuards(AuthRateLimit)
  async forgotPassword(@Body(new ZodPipe(forgotSchema)) body) {
    await this.auth.forgotPassword(body.email);
    // Email mavjudligini oshkor qilmaslik uchun javob har doim bir xil
    return { ok: true };
  }

  @Post('reset-password')
  @HttpCode(200)
  @UseGuards(AuthRateLimit)
  async resetPassword(@Body(new ZodPipe(resetSchema)) body, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.resetPassword(body.token, body.password);
    this.auth.setAuthCookie(res, user);
    return { user: userSummary(user) };
  }

  @Post('change-password')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async changePassword(@CurrentUser() me: Doc, @Body(new ZodPipe(changePasswordSchema)) body, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.changePassword(me._id, body.current, body.next);
    this.auth.setAuthCookie(res, user);
    return { ok: true };
  }
}
