// Kontent yozish uchun ixcham yordamchilar. Uch tilli matn: [uz, ru, en] yoki bitta satr (barcha tillar uchun).

type TriInput = string | string[] | { uz?: string; ru?: string; en?: string } | null | undefined;
export type TriText = { uz: string; ru: string; en: string };

export const T = (v: TriInput | any): TriText => {
  if (v == null) return { uz: '', ru: '', en: '' };
  if (Array.isArray(v)) return { uz: v[0] ?? '', ru: v[1] ?? v[0] ?? '', en: v[2] ?? v[0] ?? '' };
  if (typeof v === 'object') return { uz: v.uz ?? '', ru: v.ru ?? '', en: v.en ?? '' };
  return { uz: String(v), ru: String(v), en: String(v) };
};

/** Markdown matnidagi umumiy chekinishni olib tashlaydi */
export const md = (s: string): string => {
  const lines = String(s).replace(/^\n/, '').replace(/\s+$/, '').split('\n');
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(indent)).join('\n');
};
export const M = (uz: string, ru: string, en: string) => [md(uz), md(ru), md(en)];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type X = any;

const q = (type: string, prompt: X, rest: X, extra: X = {}) => ({ type, prompt: T(prompt), difficulty: extra.d ?? 'easy', code: extra.code ?? '', ...rest, explanation: T(rest.explanation) });

export const mcq = (prompt: X, options: X[], answer: number, explanation: X, extra?: X) => q('mcq', prompt, { options: options.map(T), answer, explanation }, extra);
export const tf = (prompt: X, answer: boolean, explanation: X, extra?: X) => q('tf', prompt, { answer, explanation }, extra);
export const fill = (prompt: X, code: string, accept: string[], explanation: X, extra?: X) => q('fill', prompt, { accept, explanation }, { ...extra, code });
export const out = (prompt: X, code: string, accept: string[], explanation: X, extra?: X) => q('out', prompt, { accept, explanation }, { ...extra, code });
export const bug = (prompt: X, code: string, options: X[], answer: number, explanation: X, extra?: X) => q('bug', prompt, { options: options.map(T), answer, explanation }, { ...extra, code });
export const order = (prompt: X, lines: string[], explanation: X, extra?: X) => q('order', prompt, { lines, explanation }, extra);
export const match = (prompt: X, pairs: [string, string][], explanation: X, extra?: X) => q('match', prompt, { pairs: pairs.map(([left, right]) => ({ left, right })), explanation }, extra);

/**
 * Amaliy topshiriq.
 * c — { i: instructions, s: starter {html,css,js}, sol: solution, tests: [[desc, expr]], rules: [[regex, desc, {t,f,not}]], h: hints[], x: explanation, d: difficulty, mode, title }
 */
export const ch = (c: X) => ({
  mode: c.mode ?? 'web',
  title: c.title ? T(c.title) : null,
  instructions: T(c.i),
  starter: { html: c.s?.html ?? '', css: c.s?.css ?? '', js: c.s?.js ?? '' },
  solution: { html: c.sol?.html ?? '', css: c.sol?.css ?? '', js: c.sol?.js ?? '' },
  tests: (c.tests ?? []).map(([d, e]: X) => ({ d: T(d), e })),
  rules: (c.rules ?? []).map(([p, d, o = {}]: X) => ({ p, d: T(d), f: o.f ?? 'i', t: o.t ?? 'all', not: !!o.not })),
  hints: (c.h ?? []).map(T),
  explanation: T(c.x),
  difficulty: c.d ?? 'easy',
});

export const lesson = (slug: string, title: X, content: X, extra: X = {}) => ({
  slug,
  title: T(title),
  content: T(content),
  example: extra.ex ?? '',
  exampleMode: extra.exMode ?? 'web',
  minutes: extra.min ?? 8,
  challenge: extra.ch ?? null,
  quiz: extra.q ?? [],
});

export const mod = (slug: string, title: X, description: X, lessons: X[], exam: X[]) => ({ slug, title: T(title), description: T(description), lessons, exam });
