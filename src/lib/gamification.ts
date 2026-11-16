// Gamifikatsiya qoidalari — barcha hisob-kitob faqat serverda (sof funksiyalar, testlanadi)

export const XP = Object.freeze({
  lesson: 20,
  quiz: 30,
  challenge: 50,
  project: 150,
  exam: 100,
  streakPerDay: 5,
  streakMaxDays: 10,
  gameCorrect: 3,
  gameDailyCap: 120,
  battleDailyCap: 200,
});

export const COINS = Object.freeze({
  lesson: 5,
  quiz: 5,
  challenge: 10,
  project: 50,
  exam: 25,
  achievement: 20,
});

export const LEVELS = Object.freeze([
  { level: 1, key: 'beginner', minXp: 0, name: { uz: 'Boshlovchi', ru: 'Новичок', en: 'Beginner' } },
  { level: 2, key: 'explorer', minXp: 100, name: { uz: 'Izlanuvchi', ru: 'Исследователь', en: 'Explorer' } },
  { level: 3, key: 'apprentice', minXp: 300, name: { uz: 'Shogird', ru: 'Ученик', en: 'Apprentice' } },
  { level: 4, key: 'coder', minXp: 700, name: { uz: 'Koder', ru: 'Кодер', en: 'Coder' } },
  { level: 5, key: 'developer', minXp: 1300, name: { uz: 'Dasturchi', ru: 'Разработчик', en: 'Developer' } },
  { level: 6, key: 'engineer', minXp: 2200, name: { uz: 'Muhandis', ru: 'Инженер', en: 'Engineer' } },
  { level: 7, key: 'expert', minXp: 3500, name: { uz: 'Ekspert', ru: 'Эксперт', en: 'Expert' } },
  { level: 8, key: 'master', minXp: 5500, name: { uz: 'Usta', ru: 'Мастер', en: 'Master' } },
  { level: 9, key: 'legend', minXp: 8500, name: { uz: 'Afsonaviy dasturchi', ru: 'Легендарный разработчик', en: 'Legendary Developer' } },
]);

export type Tri = { uz: string; ru: string; en: string };
export type Level = { level: number; key: string; name: Tri; xp: number; currentMin: number; nextMin: number | null; progress: number };
export type Streak = { current: number; best: number; lastDay: string | null };

export function levelForXp(xp: unknown): Level {
  const safe = Math.max(0, Math.floor(Number(xp) || 0));
  let current = LEVELS[0];
  for (const l of LEVELS) if (safe >= l.minXp) current = l;
  const next = LEVELS.find((l) => l.level === current.level + 1) ?? null;
  const span = next ? next.minXp - current.minXp : 1;
  const into = safe - current.minXp;
  return {
    level: current.level,
    key: current.key,
    name: current.name,
    xp: safe,
    currentMin: current.minXp,
    nextMin: next ? next.minXp : null,
    progress: next ? Math.min(1, into / span) : 1,
  };
}

/** UTC+5 (Toshkent) bo'yicha kun kaliti — streak shu kalit bilan hisoblanadi */
export const TZ_OFFSET_MIN = 5 * 60;
export function dayKey(date: Date = new Date(), offsetMin = TZ_OFFSET_MIN): string {
  const d = new Date(date.getTime() + offsetMin * 60_000);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  const ms = Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

/**
 * Faollik qayd etilganda streak'ni yangilaydi.
 */
export function applyActivity(streak: Partial<Streak> | null | undefined, today: string): { streak: Streak; firstToday: boolean; bonusXp: number } {
  const s: Streak = { current: streak?.current ?? 0, best: streak?.best ?? 0, lastDay: streak?.lastDay ?? null };
  if (s.lastDay === today) return { streak: s, firstToday: false, bonusXp: 0 };
  const gap = s.lastDay ? daysBetween(s.lastDay, today) : null;
  if (gap === 1) s.current += 1;
  else s.current = 1;
  s.best = Math.max(s.best, s.current);
  s.lastDay = today;
  const bonusXp = s.current > 1 ? XP.streakPerDay * Math.min(s.current, XP.streakMaxDays) : 0;
  return { streak: s, firstToday: true, bonusXp };
}

/** Streak bugun yoki kecha faol bo'lmasa — ko'rsatishda 0 */
export function displayStreak(streak: Partial<Streak> | null | undefined, today: string): number {
  if (!streak?.lastDay) return 0;
  const gap = daysBetween(streak.lastDay, today);
  return gap <= 1 ? streak.current : 0;
}

// ---- Yuraklar: jazolamaydigan tizim. Faqat o'yin/jang rejimida sarflanadi, darslar hech qachon bloklanmaydi ----
export const HEARTS = Object.freeze({ max: 5, regenMinutes: 20 });

export function currentHearts(hearts: number | null | undefined, updatedAt: Date | string | null | undefined, now: Date = new Date()): { hearts: number; updatedAt: Date; nextInMs: number | null } {
  const h = Math.max(0, Math.min(HEARTS.max, hearts ?? HEARTS.max));
  if (h >= HEARTS.max || !updatedAt) return { hearts: Math.min(h, HEARTS.max), updatedAt: updatedAt ? new Date(updatedAt) : now, nextInMs: null };
  const elapsed = now.getTime() - new Date(updatedAt).getTime();
  const step = HEARTS.regenMinutes * 60_000;
  const gained = Math.floor(Math.max(0, elapsed) / step);
  const total = Math.min(HEARTS.max, h + gained);
  const newUpdated = total >= HEARTS.max ? now : new Date(new Date(updatedAt).getTime() + gained * step);
  return {
    hearts: total,
    updatedAt: newUpdated,
    nextInMs: total >= HEARTS.max ? null : step - (now.getTime() - newUpdated.getTime()),
  };
}

/** Jang (battle) natijasi uchun XP: to'g'ri javoblar va tezlik, kunlik limit bilan */
export function battleXp({ correct, total, difficulty }: { correct: number; total: number; difficulty: string }): number {
  const mult = { easy: 1, medium: 1.5, hard: 2 }[difficulty] ?? 1;
  if (!total) return 0;
  return Math.round(correct * 4 * mult);
}

export function battleScore({ correct, total, timeLeftMs, difficulty, streakMax }: { correct: number; total: number; timeLeftMs?: number; difficulty: string; streakMax?: number }): number {
  const mult = { easy: 1, medium: 1.5, hard: 2 }[difficulty] ?? 1;
  const base = correct * 100;
  const speed = Math.max(0, Math.round((timeLeftMs || 0) / 1000)) * 2;
  const combo = (streakMax || 0) * 15;
  return total ? Math.round((base + speed + combo) * mult) : 0;
}

export function pct(score: number, total: number): number {
  return total ? Math.round((score / total) * 100) : 0;
}

export const PASS_SCORE = 70;
