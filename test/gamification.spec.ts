import assert from 'node:assert/strict';
import { applyActivity, battleScore, currentHearts, dayKey, displayStreak, HEARTS, LEVELS, levelForXp, XP } from '../src/lib/gamification';

test('XP qoidalari prompt bo\'yicha', () => {
  assert.equal(XP.lesson, 20);
  assert.equal(XP.quiz, 30);
  assert.equal(XP.challenge, 50);
  assert.equal(XP.project, 150);
});

test('9 ta daraja: Beginner → Legendary Developer', () => {
  assert.equal(LEVELS.length, 9);
  assert.equal(LEVELS[0].name.en, 'Beginner');
  assert.equal(LEVELS[8].name.en, 'Legendary Developer');
  assert.equal(levelForXp(0).level, 1);
  assert.equal(levelForXp(99).level, 1);
  assert.equal(levelForXp(100).level, 2);
  assert.equal(levelForXp(8500).level, 9);
  assert.equal(levelForXp(999999).progress, 1);
  assert.equal(levelForXp(-50).xp, 0);
  const mid = levelForXp(200);
  assert.ok(mid.progress > 0 && mid.progress < 1);
});

test('streak: ketma-ket kunlar, uzilish, bir kunda takror', () => {
  let r = applyActivity(null, '2026-01-01');
  assert.deepEqual([r.streak.current, r.firstToday, r.bonusXp], [1, true, 0]);
  r = applyActivity(r.streak, '2026-01-01');
  assert.equal(r.firstToday, false);
  r = applyActivity(r.streak, '2026-01-02');
  assert.equal(r.streak.current, 2);
  assert.equal(r.bonusXp, 10);
  r = applyActivity(r.streak, '2026-01-05');
  assert.equal(r.streak.current, 1);
  assert.equal(r.streak.best, 2);
  assert.equal(displayStreak({ current: 4, lastDay: '2026-01-05' }, '2026-01-06'), 4);
  assert.equal(displayStreak({ current: 4, lastDay: '2026-01-05' }, '2026-01-08'), 0);
});

test('streak bonusi 10 kundan oshmaydi', () => {
  const r = applyActivity({ current: 30, best: 30, lastDay: '2026-03-01' }, '2026-03-02');
  assert.equal(r.bonusXp, XP.streakPerDay * XP.streakMaxDays);
});

test('dayKey Toshkent vaqti bilan (UTC+5)', () => {
  assert.equal(dayKey(new Date('2026-01-01T20:00:00Z')), '2026-01-02');
  assert.equal(dayKey(new Date('2026-01-01T18:59:00Z')), '2026-01-01');
});

test('yuraklar vaqt bilan tiklanadi va maksimumdan oshmaydi', () => {
  const t0 = new Date('2026-01-01T00:00:00Z');
  const step = HEARTS.regenMinutes * 60_000;
  assert.equal(currentHearts(2, t0, new Date(t0.getTime() + step * 2 + 1000)).hearts, 4);
  assert.equal(currentHearts(2, t0, new Date(t0.getTime() + step * 50)).hearts, HEARTS.max);
  const partial = currentHearts(0, t0, new Date(t0.getTime() + step / 2));
  assert.equal(partial.hearts, 0);
  assert.ok(partial.nextInMs > 0 && partial.nextInMs <= step);
});

test('jang balli: qiyinlik ko\'paytiruvchisi', () => {
  const easy = battleScore({ correct: 5, total: 10, timeLeftMs: 10_000, difficulty: 'easy', streakMax: 2 });
  const hard = battleScore({ correct: 5, total: 10, timeLeftMs: 10_000, difficulty: 'hard', streakMax: 2 });
  assert.equal(hard, easy * 2);
  assert.equal(battleScore({ correct: 0, total: 0, timeLeftMs: 0, difficulty: 'easy' }), 0);
});
