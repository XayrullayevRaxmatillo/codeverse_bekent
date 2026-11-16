// AI provayderlari: Anthropic (Claude) va OpenAI. Kalit faqat serverda saqlanadi.
import { env, Env } from '../../config/env';
import { AppError } from '../../common/errors';

const TIMEOUT_MS = 45_000;

type AiConfig = Pick<Env, 'AI_PROVIDER' | 'ANTHROPIC_API_KEY' | 'ANTHROPIC_MODEL' | 'OPENAI_API_KEY' | 'OPENAI_MODEL'>;
type FetchLike = (url: string, init: any) => Promise<{ ok: boolean; status: number; statusText: string; text: () => Promise<string> }>;
export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export function aiStatus(config: AiConfig = env): { enabled: boolean; provider: string | null; model?: string; setup?: string } {
  const provider = config.AI_PROVIDER;
  if (provider === 'anthropic' && config.ANTHROPIC_API_KEY) return { enabled: true, provider, model: config.ANTHROPIC_MODEL };
  if (provider === 'openai' && config.OPENAI_API_KEY) return { enabled: true, provider, model: config.OPENAI_MODEL };
  return {
    enabled: false,
    provider: provider || null,
    setup: provider
      ? `AI_PROVIDER=${provider} tanlangan, lekin ${provider === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY'} kiritilmagan.`
      : 'AI mentor sozlanmagan: backend/.env faylida AI_PROVIDER=anthropic (yoki openai) va tegishli API kalitni kiriting, so\'ng serverni qayta ishga tushiring.',
  };
}

async function postJson(url: string, headers: Record<string, string>, body: unknown, fetchImpl: FetchLike): Promise<any> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetchImpl(url, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body), signal: ctrl.signal });
    const text = await res.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      /* matn */
    }
    if (!res.ok) {
      const msg = data?.error?.message || text.slice(0, 200) || res.statusText;
      const status = res.status === 429 ? 429 : 502;
      throw new AppError(status, res.status === 429 ? 'AI_RATE_LIMIT' : 'AI_PROVIDER_ERROR', `AI xizmati xatosi (${res.status}): ${msg}`);
    }
    return data;
  } catch (e: any) {
    if (e instanceof AppError) throw e;
    if (e?.name === 'AbortError') throw new AppError(504, 'AI_TIMEOUT', 'AI xizmati javob bermadi (timeout)');
    throw new AppError(502, 'AI_NETWORK', `AI xizmatiga ulanib bo'lmadi: ${e?.message ?? e}`);
  } finally {
    clearTimeout(timer);
  }
}

/** Tanlangan provayderga so'rov yuboradi va matnli javobni qaytaradi */
export async function complete(
  { system, messages, maxTokens = 1200 }: { system: string; messages: ChatMessage[]; maxTokens?: number },
  { fetchImpl = globalThis.fetch as unknown as FetchLike, config = env as AiConfig }: { fetchImpl?: FetchLike; config?: AiConfig } = {},
): Promise<string> {
  if (config.AI_PROVIDER === 'anthropic' && config.ANTHROPIC_API_KEY) {
    const data = await postJson(
      'https://api.anthropic.com/v1/messages',
      { 'x-api-key': config.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      { model: config.ANTHROPIC_MODEL, max_tokens: maxTokens, system, messages },
      fetchImpl,
    );
    return (data?.content ?? [])
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('\n')
      .trim();
  }
  if (config.AI_PROVIDER === 'openai' && config.OPENAI_API_KEY) {
    const data = await postJson(
      'https://api.openai.com/v1/chat/completions',
      { authorization: `Bearer ${config.OPENAI_API_KEY}` },
      { model: config.OPENAI_MODEL, max_completion_tokens: maxTokens, messages: [{ role: 'system', content: system }, ...messages] },
      fetchImpl,
    );
    return String(data?.choices?.[0]?.message?.content ?? '').trim();
  }
  throw new AppError(503, 'AI_NOT_CONFIGURED', aiStatus(config).setup);
}
