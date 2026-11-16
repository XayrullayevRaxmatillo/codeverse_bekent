import { currentHearts, dayKey, displayStreak, levelForXp } from '../../lib/gamification';

/** ObjectId / hujjat / satr → string id */
export const sid = (v: any): string | null => (v ? String(v._id ?? v) : null);

export function courseBase(c: any) {
  return {
    id: sid(c),
    slug: c.slug,
    world: c.world,
    order: c.order,
    title: c.title,
    description: c.description,
    color: c.color,
    icon: c.icon,
    prerequisite: c.prerequisite,
    comingSoon: !!c.comingSoon,
  };
}

export function challengePublic(ch: any) {
  if (!ch) return null;
  return {
    id: sid(ch),
    key: ch.key,
    kind: ch.kind,
    title: ch.title,
    mode: ch.mode,
    instructions: ch.instructions,
    starter: ch.starter ?? { html: '', css: '', js: '' },
    tests: (ch.tests ?? []).map((t: any) => ({ d: t.d, e: t.e })),
    hints: ch.hints ?? [],
    explanation: ch.explanation,
    difficulty: ch.difficulty,
  };
}

export function lessonEntryPublic(e: any) {
  if (!e) return { started: false, completed: false, quizBest: null, challengeDone: false, savedCode: null };
  return {
    started: !!e.started,
    completed: !!e.completed,
    quizBest: e.quizBest ?? null,
    challengeDone: !!e.challengeDone,
    savedCode: e.savedCode && (e.savedCode.html || e.savedCode.css || e.savedCode.js) ? { html: e.savedCode.html ?? '', css: e.savedCode.css ?? '', js: e.savedCode.js ?? '' } : null,
  };
}

/** Klient uchun foydalanuvchi qisqacha ma'lumoti (shaxsiy maydonlarsiz) */
export function userSummary(u: any) {
  const today = dayKey();
  const h = currentHearts(u.hearts, u.heartsUpdatedAt);
  return {
    id: String(u._id),
    username: u.username,
    displayName: u.displayName,
    email: u.email,
    role: u.role,
    bio: u.bio,
    xp: u.xp,
    coins: u.coins,
    level: levelForXp(u.xp),
    hearts: h.hearts,
    heartsNextInMs: h.nextInMs,
    streak: { current: displayStreak(u.streak, today), best: u.streak?.best ?? 0, todayDone: u.streak?.lastDay === today },
    activityDays: (u.activityDays ?? []).slice(-120),
    achievements: (u.achievements ?? []).map((a: any) => ({ key: a.key, unlockedAt: a.unlockedAt })),
    inventory: u.inventory,
    equipped: u.equipped,
    settings: u.settings,
    stats: u.stats,
    battleBest: u.battleBest,
    friends: (u.friends ?? []).map(String),
    createdAt: u.createdAt,
  };
}

/** Ommaviy profil — email va boshqa shaxsiy ma'lumotlarsiz */
export function publicProfile(u: any) {
  return {
    id: String(u._id),
    username: u.username,
    displayName: u.displayName,
    bio: u.bio,
    xp: u.xp,
    level: levelForXp(u.xp),
    streak: { current: displayStreak(u.streak, dayKey()), best: u.streak?.best ?? 0 },
    achievements: (u.achievements ?? []).map((a: any) => ({ key: a.key, unlockedAt: a.unlockedAt })),
    equipped: u.equipped,
    stats: u.stats,
    activityDays: (u.activityDays ?? []).slice(-120),
    createdAt: u.createdAt,
  };
}
