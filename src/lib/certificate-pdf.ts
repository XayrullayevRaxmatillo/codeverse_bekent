import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';
import type { Writable } from 'node:stream';

// Unicode (o', ш, ё) uchun TTF shrift: backend/assets/fonts ichidagi DejaVuSans ishlatiladi.
// src/lib va dist/lib ikkalasidan ham ../../assets = backend/assets
const ASSETS = [path.resolve(__dirname, '../../assets/fonts'), path.resolve(process.cwd(), 'assets/fonts')];
const FONT_CANDIDATES = [
  ...ASSETS.map((d) => path.join(d, 'DejaVuSans.ttf')),
  '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
  'C:\\Windows\\Fonts\\arial.ttf',
];
const BOLD_CANDIDATES = [
  ...ASSETS.map((d) => path.join(d, 'DejaVuSans-Bold.ttf')),
  '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
  'C:\\Windows\\Fonts\\arialbd.ttf',
];
const firstExisting = (list: string[]) => list.find((p) => { try { return fs.existsSync(p); } catch { return false; } });

const LABELS: Record<string, Record<string, string>> = {
  uz: { title: 'SERTIFIKAT', sub: 'muvaffaqiyatli tamomlagani uchun beriladi', given: 'Ushbu sertifikat', course: 'kursini', date: 'Sana', id: 'Sertifikat ID', verify: 'Tekshirish' },
  ru: { title: 'СЕРТИФИКАТ', sub: 'за успешное прохождение курса', given: 'Настоящий сертификат выдан', course: '', date: 'Дата', id: 'ID сертификата', verify: 'Проверка' },
  en: { title: 'CERTIFICATE', sub: 'for successfully completing the course', given: 'This certifies that', course: '', date: 'Date', id: 'Certificate ID', verify: 'Verify at' },
};

/** Sertifikat PDF'ini stream'ga yozadi */
export function renderCertificate(
  stream: Writable,
  { name, courseTitle, issuedAt, code, verifyUrl, lang = 'uz' }: { name: string; courseTitle: string; issuedAt: Date | string; code: string; verifyUrl: string; lang?: string },
): void {
  const L = LABELS[lang] ?? LABELS.uz;
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0, info: { Title: `CODEVERSE — ${courseTitle}`, Author: 'CODEVERSE' } });
  const regular = firstExisting(FONT_CANDIDATES);
  const bold = firstExisting(BOLD_CANDIDATES);
  if (regular) doc.registerFont('R', regular);
  if (bold) doc.registerFont('B', bold);
  const R = regular ? 'R' : 'Helvetica';
  const B = bold ? 'B' : 'Helvetica-Bold';
  doc.pipe(stream);

  const W = doc.page.width;
  const H = doc.page.height;
  doc.rect(0, 0, W, H).fill('#0B1020');
  // Gradient ramka
  const grad = doc.linearGradient(0, 0, W, H);
  grad.stop(0, '#7C5CFC').stop(1, '#00D4FF');
  doc.lineWidth(6).roundedRect(24, 24, W - 48, H - 48, 18).stroke(grad as any);
  doc.lineWidth(1).roundedRect(38, 38, W - 76, H - 76, 12).stroke('#2A3555');

  doc.font(B).fontSize(22).fillColor('#F8FAFC').text('</> CODEVERSE', 0, 70, { align: 'center', width: W });
  doc.font(B).fontSize(44).fillColor('#7C5CFC').text(L.title, 0, 115, { align: 'center', width: W, characterSpacing: 6 });
  doc.font(R).fontSize(14).fillColor('#94A3B8').text(L.given, 0, 185, { align: 'center', width: W });
  doc.font(B).fontSize(36).fillColor('#F8FAFC').text(name, 60, 212, { align: 'center', width: W - 120 });
  doc.font(R).fontSize(14).fillColor('#94A3B8').text(L.sub, 0, 272, { align: 'center', width: W });
  doc.font(B).fontSize(26).fillColor('#00D4FF').text(`${courseTitle}${L.course ? ` ${L.course}` : ''}`, 60, 300, { align: 'center', width: W - 120 });

  const date = new Date(issuedAt).toISOString().slice(0, 10);
  doc.font(R).fontSize(11).fillColor('#94A3B8');
  doc.text(`${L.date}: ${date}`, 80, H - 120);
  doc.text(`${L.id}: ${code}`, 80, H - 102);
  doc.text(`${L.verify}: ${verifyUrl}`, 80, H - 84, { width: W - 160 });
  doc.font(B).fontSize(12).fillColor('#22C55E').text('✓ Verified', W - 200, H - 120, { width: 120, align: 'right' });
  doc.end();
}
