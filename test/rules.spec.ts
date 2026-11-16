import assert from 'node:assert/strict';
import { checkSubmission, MAX_CODE } from '../src/lib/rules';

test('statik qoidalar: majburiy, taqiqlangan, maqsadli qism', () => {
  const ch = { rules: [{ p: '<h1', f: 'i', t: 'html' }, { p: 'Math\\.max', t: 'js', not: true }] };
  assert.equal(checkSubmission(ch, { html: '<H1>x</H1>', js: '' }).ok, true);
  assert.equal(checkSubmission(ch, { html: '<p>x</p>' }).ok, false);
  assert.equal(checkSubmission(ch, { html: '<h1>', js: 'Math.max(1,2)' }).ok, false);
  assert.equal(checkSubmission(ch, { css: '<h1' }).ok, false, 'html qoidasi css da qidirilmasin');
});

test('bo\'sh va juda katta kod rad etiladi', () => {
  assert.deepEqual(checkSubmission({}, {}).errors, ['empty']);
  assert.ok(checkSubmission({}, { js: 'x'.repeat(MAX_CODE + 1) }).errors.includes('too_large'));
});
