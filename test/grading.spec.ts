import assert from 'node:assert/strict';
import { gradeQuestion, gradeSet, normalizeCode, permutation, publicQuestion } from '../src/lib/grading';

const q = (o) => ({ _id: 'q-' + Math.random().toString(36).slice(2), prompt: {}, explanation: {}, ...o });

test('permutation deterministik va asl tartibni qaytarmaydi', () => {
  for (let n = 2; n < 8; n++) {
    const a = permutation(n, 'seed' + n);
    assert.deepEqual(a, permutation(n, 'seed' + n));
    assert.deepEqual([...a].sort(), Array.from({ length: n }, (_, i) => i));
    assert.ok(a.some((v, i) => v !== i));
  }
});

test('mcq / tf', () => {
  const m = q({ type: 'mcq', options: [{}, {}, {}], answer: 2 });
  assert.equal(gradeQuestion(m, 2), true);
  assert.equal(gradeQuestion(m, '2'), false);
  const t = q({ type: 'tf', answer: false });
  assert.equal(gradeQuestion(t, false), true);
  assert.equal(gradeQuestion(t, 'false'), false);
});

test('fill / out normalizatsiya', () => {
  assert.equal(normalizeCode(' display : flex ; '), "display:flex");
  const f = q({ type: 'fill', accept: ['"hello"'] });
  assert.equal(gradeQuestion(f, "'hello'"), true);
  assert.equal(gradeQuestion(f, 'Hello'), false);
  const ci = q({ type: 'out', accept: ['True'], ci: true });
  assert.equal(gradeQuestion(ci, 'true'), true);
  assert.equal(gradeQuestion(f, 'x'.repeat(5000)), false);
});

test('order: faqat to\'g\'ri tartib qabul qilinadi', () => {
  const o = q({ type: 'order', lines: ['a', 'b', 'c', 'd'] });
  const pub = publicQuestion(o);
  const answer = o.lines.map((line) => pub.lines.indexOf(line));
  assert.equal(gradeQuestion(o, answer), true);
  assert.equal(gradeQuestion(o, [0, 1, 2, 3].filter((x) => true).reverse()), gradeQuestion(o, [3, 2, 1, 0]));
  assert.equal(gradeQuestion(o, [0, 0, 1, 2]), false);
  assert.equal(gradeQuestion(o, [0, 1]), false);
});

test('match', () => {
  const m = q({ type: 'match', pairs: [{ left: 'a', right: '1' }, { left: 'b', right: '2' }, { left: 'c', right: '3' }] });
  const pub = publicQuestion(m);
  const answer = m.pairs.map((p) => pub.right.indexOf(p.right));
  assert.equal(gradeQuestion(m, answer), true);
  assert.equal(gradeQuestion(m, [answer[1], answer[0], answer[2]]), false);
});

test('publicQuestion javoblarni oshkor qilmaydi', () => {
  for (const o of [q({ type: 'mcq', options: [{}, {}], answer: 1 }), q({ type: 'fill', accept: ['x'] }), q({ type: 'tf', answer: true })]) {
    const p = publicQuestion(o);
    assert.equal(p.answer, undefined);
    assert.equal(p.accept, undefined);
  }
});

test('gradeSet foiz va reveal', () => {
  const qs = [q({ type: 'tf', answer: true }), q({ type: 'tf', answer: false })];
  const r = gradeSet(qs, { [qs[0]._id]: true, [qs[1]._id]: true });
  assert.equal(r.score, 1);
  assert.equal(r.percent, 50);
  assert.ok(r.results[0].answer);
  assert.equal(gradeSet(qs, {}, { reveal: false }).results[0].answer, undefined);
});
