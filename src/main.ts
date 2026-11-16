import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { CLIENT_ORIGINS, env, isProd } from './config/env';
import { AppModule } from './app.module';
import { aiStatus } from './lib/ai/providers';

async function bootstrap() {
  mongoose.set('strictQuery', true);
  // bodyParser: false — JSON parserni o'zimiz ulaymiz, uning xatolarini ham bir xil formatda qaytarish uchun
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  const log = new Logger('Bootstrap');

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(
    helmet({
      contentSecurityPolicy: false, // API — CSP frontend hostingida sozlanadi
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.enableCors({ origin: CLIENT_ORIGINS, credentials: true });

  app.use(express.json({ limit: '200kb' }));
  // JSON parser xatolari: { error: { code, message } }
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err?.type === 'entity.too.large') return res.status(413).json({ error: { code: 'TOO_LARGE', message: 'So\'rov hajmi juda katta' } });
    if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: { code: 'BAD_JSON', message: 'JSON formati noto\'g\'ri' } });
    next(err);
  });
  app.use(cookieParser());
  if (!isProd && env.NODE_ENV !== 'test') app.use(morgan('dev'));

  // Umumiy limit: daqiqasiga 300 so'rov (health tekshiruvidan tashqari)
  app.use(
    '/api',
    rateLimit({
      windowMs: 60_000,
      limit: 300,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      skip: (req) => req.path === '/health',
      message: { error: { code: 'RATE_LIMIT', message: 'Juda ko\'p so\'rov. Birozdan keyin urinib ko\'ring.' } },
    }),
  );

  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  await app.listen(env.PORT);
  log.log(`🚀 CODEVERSE API: http://localhost:${env.PORT}/api/health`);
  log.log(`🌐 CORS: ${CLIENT_ORIGINS.join(', ')}`);
  const ai = aiStatus();
  log.log(ai.enabled ? `🤖 AI mentor: ${ai.provider} (${ai.model})` : `🤖 AI mentor o'chiq — ${ai.setup}`);
}

bootstrap().catch((e) => {
  new Logger('Bootstrap').error(e?.message ?? e);
  process.exit(1);
});
