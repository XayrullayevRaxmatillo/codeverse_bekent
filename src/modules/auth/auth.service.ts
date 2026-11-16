import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import type { CookieOptions, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { CLIENT_ORIGIN, env, isProd } from '../../config/env';
import { badRequest, conflict, unauthorized } from '../../common/errors';
import { AnyModel, Doc, M } from '../../database/schemas';
import { MailService } from '../mail/mail.service';
import type { LoginDto, RegisterDto } from './auth.schemas';

export const AUTH_COOKIE = 'cv_token';
const hashToken = (t: string) => crypto.createHash('sha256').update(t).digest('hex');

@Injectable()
export class AuthService {
  private dummyHash: string | null = null;

  constructor(
    @InjectModel(M.User) private readonly users: AnyModel,
    private readonly mail: MailService,
  ) {}

  // ---------- Token va cookie ----------
  signToken(user: Doc): string {
    return jwt.sign({ sub: String(user._id), v: user.tokenVersion ?? 0 }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
  }

  cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: isProd || env.COOKIE_SAMESITE === 'none',
      sameSite: env.COOKIE_SAMESITE,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    };
  }

  setAuthCookie(res: Response, user: Doc): string {
    const token = this.signToken(user);
    res.cookie(AUTH_COOKIE, token, this.cookieOptions());
    return token;
  }

  clearAuthCookie(res: Response): void {
    const { maxAge, ...opts } = this.cookieOptions();
    res.clearCookie(AUTH_COOKIE, opts);
  }

  private readToken(req: Request): string | null {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) return header.slice(7);
    return (req as any).cookies?.[AUTH_COOKIE] ?? null;
  }

  /** So'rovdagi token bo'yicha foydalanuvchini topadi (yaroqsiz bo'lsa null) */
  async resolveUser(req: Request): Promise<Doc | null> {
    const token = this.readToken(req);
    if (!token) return null;
    let payload: any;
    try {
      payload = jwt.verify(token, env.JWT_SECRET);
    } catch {
      return null;
    }
    const user = await this.users.findById(payload.sub);
    if (!user || (user.tokenVersion ?? 0) !== payload.v) return null;
    return user;
  }

  // ---------- Biznes mantiq ----------
  async register({ username, displayName, email, password, lang }: RegisterDto): Promise<Doc> {
    const exists = await this.users.findOne({ $or: [{ email }, { username }] }).select('email username');
    if (exists) {
      const byEmail = exists.email === email;
      throw conflict(byEmail ? 'EMAIL_TAKEN' : 'USERNAME_TAKEN', byEmail ? 'Bu email band' : 'Bu login band');
    }
    return this.users.create({ username, displayName, email, passwordHash: await bcrypt.hash(password, 12), settings: { lang: lang ?? 'uz', theme: 'dark' } });
  }

  async login({ login, password }: LoginDto): Promise<Doc> {
    const user = await this.users.findOne(login.includes('@') ? { email: login } : { username: login }).select('+passwordHash');
    // Vaqt bo'yicha farqni kamaytirish uchun foydalanuvchi bo'lmasa ham hash solishtiramiz
    const ok = await bcrypt.compare(password, user?.passwordHash ?? (this.dummyHash ??= await bcrypt.hash('codeverse-dummy', 12)));
    if (!user || !ok) throw unauthorized('Login yoki parol noto\'g\'ri');
    if (user.isBanned) throw badRequest('BANNED', 'Akkaunt bloklangan');
    user.lastLoginAt = new Date();
    await user.save();
    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.users.findOne({ email });
    if (!user) return; // email mavjudligini oshkor qilmaymiz
    const token = crypto.randomBytes(32).toString('hex');
    user.resetTokenHash = hashToken(token);
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    const link = `${CLIENT_ORIGIN}/reset-password?token=${token}`;
    await this.mail.send({
      to: user.email,
      subject: 'CODEVERSE — parolni tiklash',
      text: `Salom, ${user.displayName}! Parolni tiklash uchun havola (1 soat amal qiladi): ${link}`,
      html: `<p>Salom, ${String(user.displayName).replace(/[<>&]/g, '')}!</p><p>Parolni tiklash uchun havola (1 soat amal qiladi):</p><p><a href="${link}">${link}</a></p>`,
    });
  }

  async resetPassword(token: string, password: string): Promise<Doc> {
    const user = await this.users
      .findOne({ resetTokenHash: hashToken(token), resetTokenExpires: { $gt: new Date() } })
      .select('+resetTokenHash +resetTokenExpires');
    if (!user) throw badRequest('TOKEN_INVALID', 'Havola yaroqsiz yoki muddati o\'tgan');
    user.passwordHash = await bcrypt.hash(password, 12);
    user.resetTokenHash = undefined;
    user.resetTokenExpires = undefined;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1; // boshqa qurilmalardagi sessiyalar yopiladi
    await user.save();
    return user;
  }

  async changePassword(userId: unknown, current: string, next: string): Promise<Doc> {
    const user = await this.users.findById(userId).select('+passwordHash');
    if (!(await bcrypt.compare(current, user.passwordHash))) throw badRequest('WRONG_PASSWORD', 'Joriy parol noto\'g\'ri');
    user.passwordHash = await bcrypt.hash(next, 12);
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await user.save();
    return user;
  }
}
