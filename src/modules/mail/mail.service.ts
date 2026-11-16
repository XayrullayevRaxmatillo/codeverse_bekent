import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import { env, isProd } from '../../config/env';

@Injectable()
export class MailService {
  private readonly logger = new Logger('Mail');
  private readonly transporter: Transporter | null = env.SMTP_HOST
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
      })
    : null;

  get enabled(): boolean {
    return !!this.transporter;
  }

  /** SMTP sozlanmagan bo'lsa (development) xatni konsolga chiqaradi */
  async send({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string }): Promise<boolean> {
    if (!this.transporter) {
      if (!isProd) this.logger.log(`\n📧 [DEV] Email (SMTP sozlanmagan)\n   To: ${to}\n   Subject: ${subject}\n   ${text}\n`);
      return false;
    }
    await this.transporter.sendMail({ from: env.MAIL_FROM, to, subject, text, html });
    return true;
  }
}
