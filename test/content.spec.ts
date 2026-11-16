// Kontent yaxlitligi: uch til, kalitlar, savollar to'g'riligi, server qoidalari yechimga mos kelishi
import assert from 'node:assert/strict';
import { courses } from '../src/seed/content/index';
import { flatten } from '../src/seed/build';
import { checkSubmission } from '../src/lib/rules';
import { gradeQuestion, publicQuestion, permutation } from '../src/lib/grading';
import { ACHIEVEMENTS } from '../src/seed/achievements';

const LANGS = ['uz', 'ru', 'en'];
const data = flatten(courses);

function triOk(t, where) {
  for (const l of LANGS) assert.ok(typeof t?.[l] === 'string' && t[l].trim().length > 0, `${where}: '${l}' matni bo'sh`);
}

/** Har bir savol uchun to'g'ri javobni klient formatida yasaymiz va baholaymiz */
function correctAnswerFor(q) {
  const id = q.key;
  switch (q.type) {
    case 'mcq':
    case 'bug':
      return q.answer;
    case 'tf':
      return q.answer;
    case 'fill':
    case 'out':
      return q.accept[0];
    case 'order': {
      const perm = permutation(q.lines.length, id);
      return q.lines.map((_, k) => perm.indexOf(k));
    }
    case 'match': {
      const perm = permutation(q.pairs.length, `${id}:m`);
      return q.pairs.map((_, i) => perm.indexOf(i));
    }
  }
}

function checkQuestion(q) {
  const where = q.key;
  triOk(q.prompt, `${where}.prompt`);
  triOk(q.explanation, `${where}.explanation`);
  switch (q.type) {
    case 'mcq':
    case 'bug':
      assert.ok(q.options.length >= 2, `${where}: variantlar kam`);
      q.options.forEach((o, i) => triOk(o, `${where}.options[${i}]`));
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, `${where}: answer indeksi noto'g'ri`);
      if (q.type === 'bug') assert.ok(q.code, `${where}: bug savolida kod yo'q`);
      break;
    case 'tf':
      assert.equal(typeof q.answer, 'boolean', `${where}: tf javobi boolean emas`);
      break;
    case 'fill':
    case 'out':
      assert.ok(q.accept.length > 0, `${where}: accept bo'sh`);
      assert.ok(q.code, `${where}: kod yo'q`);
      break;
    case 'order':
      assert.ok(q.lines.length >= 2, `${where}: qatorlar kam`);
      break;
    case 'match':
      assert.ok(q.pairs.length >= 2, `${where}: juftliklar kam`);
      assert.equal(new Set(q.pairs.map((p) => p.right)).size, q.pairs.length, `${where}: o'ng tomonlar takrorlanmasin`);
      break;
    default:
      assert.fail(`${where}: noma'lum tur ${q.type}`);
  }
  const doc = { ...q, _id: q.key };
  assert.ok(gradeQuestion(doc, correctAnswerFor(q)), `${where}: to'g'ri javob baholanmadi`);
  const pub = publicQuestion(doc);
  assert.ok(!('answer' in pub) && !('accept' in pub) && !('pairs' in pub), `${where}: javob klientga sizib chiqmoqda`);
}

test('4 ta kurs, har birida ≥5 modul va har modulda ≥5 dars', () => {
  assert.equal(data.length, 4);
  for (const c of data) {
    assert.ok(c.modules.length >= 5, `${c.course.slug}: modullar kam`);
    for (const m of c.modules) assert.ok(m.lessons.length >= 5, `${c.course.slug}.${m.slug}: darslar kam`);
  }
});

test('kalitlar noyob', () => {
  const keys = new Set();
  for (const c of data)
    for (const m of c.modules) {
      for (const l of m.lessons) for (const k of [l.challenge?.key, ...l.questions.map((q) => q.key)].filter(Boolean)) {
        assert.ok(!keys.has(k), `takror kalit: ${k}`);
        keys.add(k);
      }
      for (const q of m.exam) {
        assert.ok(!keys.has(q.key), `takror kalit: ${q.key}`);
        keys.add(q.key);
      }
    }
});

test('barcha matnlar uch tilda', () => {
  for (const c of data) {
    triOk(c.course.title, `${c.course.slug}.title`);
    triOk(c.course.description, `${c.course.slug}.description`);
    for (const m of c.modules) {
      triOk(m.title, `${m.slug}.title`);
      triOk(m.description, `${m.slug}.description`);
      for (const l of m.lessons) {
        triOk(l.title, `${m.slug}.${l.slug}.title`);
        triOk(l.content, `${m.slug}.${l.slug}.content`);
        if (l.challenge) {
          triOk(l.challenge.instructions, `${l.challenge.key}.instructions`);
          l.challenge.tests.forEach((t, i) => triOk(t.d, `${l.challenge.key}.tests[${i}]`));
          l.challenge.hints.forEach((h, i) => triOk(h, `${l.challenge.key}.hints[${i}]`));
        }
      }
    }
  }
});

test('har bir dars: topshiriq (≥1 test) va ≥2 savol; imtihon ≥5 savol', () => {
  for (const c of data)
    for (const m of c.modules) {
      assert.ok(m.exam.length >= 5, `${m.slug}: imtihon savollari kam`);
      for (const l of m.lessons) {
        assert.ok(l.challenge && l.challenge.tests.length >= 1, `${m.slug}.${l.slug}: topshiriq yo'q`);
        assert.ok(l.questions.length >= 2, `${m.slug}.${l.slug}: savollar kam`);
      }
    }
});

test('savollar to\'g\'ri tuzilgan va to\'g\'ri javob qabul qilinadi', () => {
  for (const c of data)
    for (const m of c.modules) {
      for (const l of m.lessons) l.questions.forEach(checkQuestion);
      m.exam.forEach(checkQuestion);
    }
});

test('server qoidalari yechimni qabul qiladi, bo\'sh kodni rad etadi', () => {
  const all = data.flatMap((c) => [...c.modules.flatMap((m) => m.lessons.map((l) => l.challenge)), c.project]).filter(Boolean);
  for (const chl of all) {
    for (const r of chl.rules) assert.doesNotThrow(() => new RegExp(r.p, r.f), `${chl.key}: regex xato ${r.p}`);
    const res = checkSubmission(chl, chl.solution);
    assert.ok(res.ok, `${chl.key}: yechim server qoidalaridan o'tmadi: ${res.errors.join(', ')}`);
    assert.equal(checkSubmission(chl, { html: '', css: '', js: '' }).ok, false, `${chl.key}: bo'sh kod qabul qilindi`);
  }
});

test('har bir kursda yakuniy loyiha bor', () => {
  for (const c of data) {
    assert.ok(c.project, `${c.course.slug}: loyiha yo'q`);
    assert.ok(c.project.tests.length >= 3);
    triOk(c.project.instructions, `${c.project.key}.instructions`);
  }
});

test('majburiy yutuqlar mavjud', () => {
  const keys = ACHIEVEMENTS.map((a) => a.key);
  for (const k of ['first-lesson', 'first-code', 'ten-challenges', 'js-explorer', 'css-master', 'react-beginner', 'backend-builder', 'full-stack-hero']) assert.ok(keys.includes(k), k);
  for (const a of ACHIEVEMENTS) {
    triOk(a.title, a.key);
    triOk(a.description, a.key);
  }
  // Yutuq shartlaridagi kurs/modul slug'lari haqiqiy bo'lsin
  for (const a of ACHIEVEMENTS) {
    if (a.condition.course) {
      const c = data.find((x) => x.course.slug === a.condition.course);
      assert.ok(c, `${a.key}: kurs topilmadi`);
      if (a.condition.module) assert.ok(c.modules.some((m) => m.slug === a.condition.module), `${a.key}: modul topilmadi`);
    }
  }
});
