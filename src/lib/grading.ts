// Savollarni serverda baholash. To'g'ri javoblar hech qachon klientga oldindan yuborilmaydi.

/** Satrdan barqaror 32-bit seed (FNV-1a) */
export function hashSeed(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministik aralashtirish: perm[shownIndex] = originalIndex. Hech qachon asl tartibni qaytarmaydi (n>1). */
export function permutation(n: number, seedStr: string): number[] {
  const rand = mulberry32(hashSeed(seedStr));
  const perm = Array.from({ length: n }, (_, i) => i);
  for (let tries = 0; tries < 5; tries++) {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    if (n < 2 || perm.some((v, i) => v !== i)) return perm;
  }
  // baribir asl tartib chiqsa — bitta siljitamiz
  return perm.map((_, i) => (i + 1) % n);
}

export function seededShuffle<T>(arr: T[], seedStr: string): T[] {
  const rand = mulberry32(hashSeed(seedStr));
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function normalizeCode(s: unknown, { ci = false }: { ci?: boolean } = {}): string {
  let v = String(s ?? '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/;+$/, '')
    .replace(/"/g, "'")
    .replace(/`/g, "'");
  if (ci) v = v.toLowerCase();
  return v;
}

const qid = (q: any): string => String(q._id ?? q.id ?? q.key ?? '');

/** Klientga yuboriladigan xavfsiz ko'rinish */
export function publicQuestion(q: any): Record<string, any> {
  const id = qid(q);
  const base = {
    id,
    type: q.type,
    prompt: q.prompt,
    code: q.code || undefined,
    difficulty: q.difficulty || 'easy',
  };
  switch (q.type) {
    case 'mcq':
    case 'bug':
      return { ...base, options: q.options };
    case 'tf':
      return base;
    case 'fill':
    case 'out':
      return base;
    case 'order': {
      const perm = permutation(q.lines.length, id);
      return { ...base, lines: perm.map((i) => q.lines[i]) };
    }
    case 'match': {
      const perm = permutation(q.pairs.length, `${id}:m`);
      return { ...base, left: q.pairs.map((p) => p.left), right: perm.map((i) => q.pairs[i].right) };
    }
    default:
      return base;
  }
}

/** To'g'ri javobni ko'rsatish uchun (urinishdan keyin) */
export function correctAnswerView(q: any): Record<string, unknown> | null {
  switch (q.type) {
    case 'mcq':
    case 'bug':
      return { index: q.answer };
    case 'tf':
      return { value: q.answer };
    case 'fill':
    case 'out':
      return { text: q.accept?.[0] ?? '' };
    case 'order':
      return { lines: q.lines };
    case 'match':
      return { pairs: q.pairs };
    default:
      return null;
  }
}

/** Bitta savolni baholash. answer — klient yuborgan qiymat. */
export function gradeQuestion(q: any, answer: any): boolean {
  const id = qid(q);
  try {
    switch (q.type) {
      case 'mcq':
      case 'bug':
        return Number.isInteger(answer) && answer === q.answer;
      case 'tf':
        return typeof answer === 'boolean' && answer === q.answer;
      case 'fill':
      case 'out': {
        if (typeof answer !== 'string' || answer.length > 2000) return false;
        const got = normalizeCode(answer, { ci: !!q.ci });
        return (q.accept ?? []).some((a) => normalizeCode(a, { ci: !!q.ci }) === got);
      }
      case 'order': {
        const n = q.lines.length;
        if (!Array.isArray(answer) || answer.length !== n) return false;
        const perm = permutation(n, id);
        if (new Set(answer).size !== n || answer.some((i) => !Number.isInteger(i) || i < 0 || i >= n)) return false;
        // answer[k] = ko'rsatilgan indeks; asl indeks perm[answer[k]] bo'lishi kerak === k (yoki bir xil matn)
        return answer.every((shown, k) => q.lines[perm[shown]] === q.lines[k]);
      }
      case 'match': {
        const n = q.pairs.length;
        if (!Array.isArray(answer) || answer.length !== n) return false;
        const perm = permutation(n, `${id}:m`);
        return answer.every((shown, i) => Number.isInteger(shown) && shown >= 0 && shown < n && q.pairs[perm[shown]].right === q.pairs[i].right);
      }
      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * Bir nechta savolni baholaydi.
 * @param questions — DB savollari
 * @param answers — { [questionId]: answer }
 * @param opts.reveal — true bo'lsa to'g'ri javob ham qaytariladi
 */
export function gradeSet(questions: any[], answers: Record<string, unknown> | undefined, { reveal = true }: { reveal?: boolean } = {}) {
  const results = questions.map((q): { id: string; correct: boolean; explanation: unknown; answer?: unknown } => {
    const id = qid(q);
    const correct = gradeQuestion(q, answers?.[id]);
    return {
      id,
      correct,
      explanation: q.explanation,
      ...(reveal ? { answer: correctAnswerView(q) } : {}),
    };
  });
  const score = results.filter((r) => r.correct).length;
  const total = questions.length;
  return { results, score, total, percent: total ? Math.round((score / total) * 100) : 0 };
}
