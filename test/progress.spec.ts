import assert from 'node:assert/strict';
import { computeTree, isCourseUnlocked, lessonRequirementsMet } from '../src/lib/progress-rules';

const modules = [{ _id: 'm1', order: 1 }, { _id: 'm2', order: 2 }];
const L = (id, extra = {}) => ({ _id: id, hasChallenge: true, quizCount: 2, ...extra });
const lessonsByModule = { m1: [L('a', { isGuest: true }), L('b', { isGuest: true })], m2: [L('c'), L('d')] };

test('yangi foydalanuvchi: faqat birinchi dars ochiq', () => {
  const t = computeTree({ modules, lessonsByModule, progress: null, courseUnlocked: true });
  assert.deepEqual(t.modules[0].lessons.map((l) => l.status), ['available', 'locked']);
  assert.deepEqual(t.modules[1].lessons.map((l) => l.status), ['locked', 'locked']);
  assert.equal(t.modules[0].exam.status, 'locked');
  assert.equal(t.project.status, 'locked');
});

test('dars tugasa keyingisi ochiladi; imtihonsiz keyingi modul yopiq', () => {
  const progress = { lessons: [{ lesson: 'a', completed: true, quizBest: 100, challengeDone: true }, { lesson: 'b', completed: true, quizBest: 80, challengeDone: true }], exams: [] };
  const t = computeTree({ modules, lessonsByModule, progress, courseUnlocked: true });
  assert.deepEqual(t.modules[0].lessons.map((l) => l.status), ['mastered', 'completed']);
  assert.equal(t.modules[0].exam.status, 'available');
  assert.equal(t.modules[1].lessons[0].status, 'locked');
});

test('imtihon (70%+) keyingi modulni ochadi; hammasi + loyiha = complete', () => {
  const progress = {
    lessons: ['a', 'b', 'c', 'd'].map((id) => ({ lesson: id, completed: true, quizBest: 100, challengeDone: true })),
    exams: [{ module: 'm1', passed: true, best: 80 }, { module: 'm2', passed: true, best: 90 }],
    projectDone: false,
  };
  let t = computeTree({ modules, lessonsByModule, progress, courseUnlocked: true });
  assert.equal(t.project.status, 'available');
  assert.equal(t.complete, false);
  t = computeTree({ modules, lessonsByModule, progress: { ...progress, projectDone: true }, courseUnlocked: true });
  assert.equal(t.complete, true);
  assert.equal(t.stats.percent, 100);
});

test('in_progress holati va qulflangan kurs', () => {
  const t = computeTree({ modules, lessonsByModule, progress: { lessons: [{ lesson: 'a', started: true }] }, courseUnlocked: true });
  assert.equal(t.modules[0].lessons[0].status, 'in_progress');
  const locked = computeTree({ modules, lessonsByModule, progress: null, courseUnlocked: false });
  assert.equal(locked.modules[0].lessons[0].status, 'locked');
});

test('mehmon faqat isGuest darslarni ko\'radi', () => {
  const t = computeTree({ modules, lessonsByModule, progress: null, courseUnlocked: false, guest: true });
  assert.deepEqual(t.modules[0].lessons.map((l) => l.status), ['available', 'available']);
  assert.equal(t.modules[1].lessons[0].status, 'locked');
});

test('dars talablari', () => {
  assert.equal(lessonRequirementsMet({ hasChallenge: true, quizCount: 2 }, { challengeDone: true, quizBest: 69 }), false);
  assert.equal(lessonRequirementsMet({ hasChallenge: true, quizCount: 2 }, { challengeDone: true, quizBest: 70 }), true);
  assert.equal(lessonRequirementsMet({ hasChallenge: false, quizCount: 0 }, null), true);
});

test('kurs prerequisite: oldingi kursning 1-modul imtihoni', () => {
  assert.equal(isCourseUnlocked({ prerequisite: null }, null, null), true);
  assert.equal(isCourseUnlocked({ prerequisite: 'html' }, { exams: [] }, 'm1'), false);
  assert.equal(isCourseUnlocked({ prerequisite: 'html' }, { exams: [{ module: 'm1', passed: true }] }, 'm1'), true);
});
