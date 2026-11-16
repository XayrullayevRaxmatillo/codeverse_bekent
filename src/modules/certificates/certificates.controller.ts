import { Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Response } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import { CLIENT_ORIGIN } from '../../config/env';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { badRequest, notFound } from '../../common/errors';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ZodPipe } from '../../common/pipes/zod-validation.pipe';
import { AnyModel, Doc, M } from '../../database/schemas';
import { renderCertificate } from '../../lib/certificate-pdf';
import { pickLang, tx } from '../../lib/i18n';
import { CourseProgressService } from '../courses/course-progress.service';

const newCode = () => `CV-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
const view = (c: any) => ({ code: c.code, name: c.name, courseTitle: c.courseTitle, course: c.course?.slug ?? null, color: c.course?.color ?? null, issuedAt: c.issuedAt });
const pdfQuery = z.object({ lang: z.string().optional() });

@Controller('certificates')
export class CertificatesController {
  constructor(
    private readonly courseProgress: CourseProgressService,
    @InjectModel(M.Certificate) private readonly certificates: AnyModel,
    @InjectModel(M.Course) private readonly courses: AnyModel,
    @InjectModel(M.User) private readonly users: AnyModel,
  ) {}

  /** Ommaviy tekshirish: faqat ism, kurs va sana */
  @Get('verify/:code')
  async verify(@Param('code') code: string) {
    const c = await this.certificates.findOne({ code: String(code).toUpperCase() }).populate('course', 'slug color').lean();
    if (!c) throw notFound('Sertifikat');
    return { certificate: view(c) };
  }

  @Get()
  @UseGuards(AuthGuard)
  async mine(@CurrentUser() user: Doc) {
    const list = await this.certificates.find({ user: user._id }).populate('course', 'slug color').sort({ issuedAt: -1 }).lean<any[]>();
    return { certificates: list.map(view) };
  }

  /** Sertifikat faqat barcha darslar, imtihonlar va yakuniy loyiha tugagandan keyin beriladi */
  @Post('claim/:slug')
  @UseGuards(AuthGuard)
  async claim(@Param('slug') slug: string, @CurrentUser() user: Doc, @Res() res: Response) {
    const course = await this.courses.findOne({ slug }).lean<any>();
    if (!course) throw notFound('Kurs');
    const existing = await this.certificates.findOne({ user: user._id, course: course._id }).populate('course', 'slug color').lean();
    // Avval olingan bo'lsa — 200, yangi berilsa — 201
    if (existing) return res.status(200).json({ certificate: view(existing) });
    const { tree } = await this.courseProgress.getTree(course, { _id: user._id, role: 'user' });
    if (!tree.complete) throw badRequest('NOT_COMPLETE', 'Sertifikat uchun barcha darslar, modul imtihonlari va yakuniy loyiha bajarilishi kerak');
    let cert = null;
    for (let i = 0; i < 5 && !cert; i++) {
      try {
        cert = await this.certificates.create({ code: newCode(), user: user._id, course: course._id, name: user.displayName, courseTitle: course.title });
      } catch (e: any) {
        if (e?.code !== 11000) throw e;
        if (await this.certificates.exists({ user: user._id, course: course._id })) break;
      }
    }
    const saved = await this.certificates.findOne({ user: user._id, course: course._id }).populate('course', 'slug color').lean();
    return res.status(201).json({ certificate: view(saved) });
  }

  @Get(':code/pdf')
  async pdf(@Param('code') code: string, @Query(new ZodPipe(pdfQuery)) query, @Res() res: Response) {
    const c = await this.certificates.findOne({ code: String(code).toUpperCase() }).lean<any>();
    if (!c) throw notFound('Sertifikat');
    const owner = await this.users.findById(c.user).select('settings').lean<any>();
    const lang = pickLang(query.lang ?? owner?.settings?.lang);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="codeverse-${c.code}.pdf"`);
    renderCertificate(res, { name: c.name, courseTitle: tx(c.courseTitle, lang), issuedAt: c.issuedAt, code: c.code, verifyUrl: `${CLIENT_ORIGIN}/verify/${c.code}`, lang });
  }
}
