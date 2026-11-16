import assert from 'node:assert/strict';
import { complete } from '../src/lib/ai/providers';
import { buildSystemPrompt } from '../src/lib/ai/prompts';
import { levelForXp } from '../src/lib/gamification';

const base: any = { AI_PROVIDER: '', ANTHROPIC_API_KEY: '', ANTHROPIC_MODEL: 'claude-sonnet-5-5', OPENAI_API_KEY: '', OPENAI_MODEL: 'gpt-4.1-mini' };
const fakeFetch = (status: number, body: unknown, sink: any) => async (url: string, init: any) => {
  sink.url = url;
  sink.init = init;
  return { ok: status < 400, status, statusText: 'x', text: async () => JSON.stringify(body) };
};

test('kalit bo\'lmasa AI_NOT_CONFIGURED (503)', async () => {
  await assert.rejects(complete({ system: 's', messages: [{ role: 'user', content: 'hi' }] }, { config: base }), (e: any) => e.status === 503 && e.code === 'AI_NOT_CONFIGURED');
});

test('Anthropic: to\'g\'ri endpoint, sarlavhalar va javob', async () => {
  const sink: any = {};
  const text = await complete(
    { system: 'sys', messages: [{ role: 'user', content: 'hi' }] },
    { config: { ...base, AI_PROVIDER: 'anthropic', ANTHROPIC_API_KEY: 'k1' }, fetchImpl: fakeFetch(200, { content: [{ type: 'text', text: 'Salom!' }] }, sink) }
  );
  assert.equal(text, 'Salom!');
  assert.equal(sink.url, 'https://api.anthropic.com/v1/messages');
  assert.equal(sink.init.headers['x-api-key'], 'k1');
  assert.equal(sink.init.headers['anthropic-version'], '2023-06-01');
  const body = JSON.parse(sink.init.body);
  assert.equal(body.model, 'claude-sonnet-5-5');
  assert.equal(body.system, 'sys');
});

test('OpenAI: to\'g\'ri endpoint va javob', async () => {
  const sink: any = {};
  const text = await complete(
    { system: 'sys', messages: [{ role: 'user', content: 'hi' }] },
    { config: { ...base, AI_PROVIDER: 'openai', OPENAI_API_KEY: 'k2' }, fetchImpl: fakeFetch(200, { choices: [{ message: { content: 'Hello' } }] }, sink) }
  );
  assert.equal(text, 'Hello');
  assert.equal(sink.url, 'https://api.openai.com/v1/chat/completions');
  assert.equal(sink.init.headers.authorization, 'Bearer k2');
  assert.equal(JSON.parse(sink.init.body).messages[0].role, 'system');
});

test('provayder xatosi tushunarli xabar bilan', async () => {
  await assert.rejects(
    complete({ system: 's', messages: [] }, { config: { ...base, AI_PROVIDER: 'openai', OPENAI_API_KEY: 'x' }, fetchImpl: fakeFetch(429, { error: { message: 'slow down' } }, {}) }),
    (e: any) => e.status === 429 && /slow down/.test(e.message)
  );
});

test('tizim prompti tilga va darajaga moslashadi; hint rejimida yechim berilmaydi', () => {
  const p = buildSystemPrompt({ mode: 'hint', lang: 'ru', level: levelForXp(0) });
  assert.match(p, /русский/);
  assert.match(p, /beginner/i);
  assert.match(p, /NEVER give the full solution/);
});
