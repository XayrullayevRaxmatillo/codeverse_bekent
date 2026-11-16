// Yuborilgan kodni serverda STATIK tekshirish (kod hech qachon serverda ishga tushirilmaydi).
// Haqiqiy testlar brauzerdagi sandbox iframe'da bajariladi; bu yerda soxta yuborishlarni kamaytiramiz.

export const MAX_CODE = 50_000;

export type Code = { html?: string; css?: string; js?: string };
export type Rule = { p: string; f?: string; t?: 'html' | 'css' | 'js' | 'all' | string; not?: boolean; d?: unknown };

export function checkSubmission(challenge: { rules?: Rule[] }, code: Code | null | undefined): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const parts = { html: String(code?.html ?? ''), css: String(code?.css ?? ''), js: String(code?.js ?? '') };
  const total = parts.html.length + parts.css.length + parts.js.length;
  if (total === 0) errors.push('empty');
  if (total > MAX_CODE) errors.push('too_large');
  for (const rule of challenge.rules ?? []) {
    const target = rule.t ?? 'all';
    const text = target === 'all' ? `${parts.html}\n${parts.css}\n${parts.js}` : parts[target] ?? '';
    let re: RegExp;
    try {
      re = new RegExp(rule.p, rule.f ?? '');
    } catch {
      continue;
    }
    const matched = re.test(text);
    if (rule.not ? matched : !matched) errors.push(rule.p);
  }
  return { ok: errors.length === 0, errors };
}
