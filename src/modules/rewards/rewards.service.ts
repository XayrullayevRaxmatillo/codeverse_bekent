import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { applyActivity, COINS, dayKey, levelForXp, Streak } from '../../lib/gamification';
import { userSummary } from '../../common/utils/serialize';
import { AnyModel, M } from '../../database/schemas';

export type RewardItem = { key: string; reason: string; xp?: number; coins?: number; stats?: Record<string, number> };

/** XP, tangalar, streak va yutuqlar — barcha hisob-kitob shu yerda, idempotent */
@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(M.User) private readonly users: AnyModel,
    @InjectModel(M.XpEvent) private readonly xpEvents: AnyModel,
    @InjectModel(M.Achievement) private readonly achievementsModel: AnyModel,
    @InjectModel(M.Course) private readonly courses: AnyModel,
    @InjectModel(M.Module) private readonly modules: AnyModel,
    @InjectModel(M.UserProgress) private readonly progress: AnyModel,
  ) {}

  /**
   * Mukofotlarni beradi (idempotent). Har bir item.key foydalanuvchi uchun faqat bir marta ishlaydi.
   * @param opts.activity — true bo'lsa streak yangilanadi
   */
  async grant(userId: unknown, items: RewardItem[] = [], { activity = true }: { activity?: boolean } = {}) {
    const before = await this.users.findById(userId).select('xp coins streak');
    if (!before) return null;
    const today = dayKey();
    const gained = { xp: 0, coins: 0, items: [] as { reason: string; xp: number; coins: number }[] };
    const inc: Record<string, number> = {};

    for (const item of items) {
      const xp = Math.max(0, Math.round(item.xp ?? 0));
      const coins = Math.max(0, Math.round(item.coins ?? 0));
      try {
        await this.xpEvents.create({ user: userId, key: item.key, reason: item.reason, amount: xp, coins, day: today });
      } catch (e: any) {
        if (e?.code === 11000) continue; // allaqachon berilgan
        throw e;
      }
      gained.xp += xp;
      gained.coins += coins;
      gained.items.push({ reason: item.reason, xp, coins });
      for (const [k, v] of Object.entries(item.stats ?? {})) inc[k] = (inc[k] ?? 0) + v;
    }

    let streakInfo: Streak | null = null;
    if (activity) {
      const { streak, firstToday, bonusXp } = applyActivity(before.streak, today);
      if (firstToday) {
        await this.users.updateOne({ _id: userId }, { $set: { streak }, $addToSet: { activityDays: today } });
        await this.users.updateOne({ _id: userId, 'activityDays.400': { $exists: true } }, { $pop: { activityDays: -1 } });
        if (bonusXp > 0) {
          try {
            await this.xpEvents.create({ user: userId, key: `streak:${today}`, reason: 'streak', amount: bonusXp, coins: 0, day: today });
            gained.xp += bonusXp;
            gained.items.push({ reason: 'streak', xp: bonusXp, coins: 0 });
          } catch (e: any) {
            if (e?.code !== 11000) throw e;
          }
        }
        streakInfo = streak;
      }
    }

    if (gained.xp || gained.coins || Object.keys(inc).length) {
      await this.users.updateOne({ _id: userId }, { $inc: { xp: gained.xp, coins: gained.coins, ...inc } });
    }

    const newAchievements = await this.checkAchievements(userId);
    const after = await this.users.findById(userId);
    const lvBefore = levelForXp(before.xp);
    const lvAfter = levelForXp(after.xp);
    return {
      gained: { xp: gained.xp, coins: gained.coins + newAchievements.reduce((s, a) => s + (a.rewardCoins ?? 0), 0), items: gained.items },
      levelUp: lvAfter.level > lvBefore.level ? lvAfter : null,
      achievements: newAchievements,
      streak: streakInfo,
      user: userSummary(after),
    };
  }

  private async courseLessonCount(userId: unknown, slug: string) {
    const course = await this.courses.findOne({ slug }).select('_id');
    if (!course) return { done: 0, complete: false, progress: null, courseId: null };
    const p = await this.progress.findOne({ user: userId, course: course._id }).select('lessons completedAt exams');
    return { done: (p?.lessons ?? []).filter((l: any) => l.completed).length, complete: !!p?.completedAt, progress: p, courseId: course._id };
  }

  /** Barcha yutuqlarni tekshiradi, yangilarini beradi */
  async checkAchievements(userId: unknown) {
    const user = await this.users.findById(userId).select('xp stats streak achievements');
    const have = new Set(user.achievements.map((a: any) => a.key));
    const all = await this.achievementsModel.find().lean<any[]>();
    const fresh: { key: string; title: unknown; description: unknown; icon: string; rarity: string; rewardCoins: number }[] = [];
    const cache = new Map<string, Awaited<ReturnType<RewardsService['courseLessonCount']>>>();
    const course = async (slug: string) => {
      if (!cache.has(slug)) cache.set(slug, await this.courseLessonCount(userId, slug));
      return cache.get(slug);
    };

    for (const a of all) {
      if (have.has(a.key)) continue;
      const c = a.condition ?? {};
      const v = c.value ?? 1;
      let ok = false;
      switch (c.type) {
        case 'lessons': ok = user.stats.lessonsCompleted >= v; break;
        case 'firstCode': ok = user.stats.codeRuns >= 1 || user.stats.challengesCompleted >= 1; break;
        case 'challenges': ok = user.stats.challengesCompleted >= v; break;
        case 'perfectQuiz': ok = user.stats.perfectQuizzes >= v; break;
        case 'exams': ok = user.stats.examsPassed >= v; break;
        case 'projects': ok = user.stats.projectsCompleted >= v; break;
        case 'battles': ok = user.stats.battlesPlayed >= v; break;
        case 'streak': ok = (user.streak?.best ?? 0) >= v; break;
        case 'xp': ok = user.xp >= v; break;
        case 'courseLessons': ok = c.course ? (await course(c.course)).done >= v : false; break;
        case 'courseComplete': ok = c.course ? (await course(c.course)).complete : false; break;
        case 'moduleExam': {
          if (!c.course || !c.module) break;
          const info = await course(c.course);
          if (!info.courseId) break;
          const mod = await this.modules.findOne({ course: info.courseId, slug: c.module }).select('_id');
          ok = !!mod && (info.progress?.exams ?? []).some((e: any) => String(e.module) === String(mod._id) && e.passed);
          break;
        }
        case 'coursesCompleted': {
          const n = await this.progress.countDocuments({ user: userId, completedAt: { $ne: null } });
          ok = n >= v;
          break;
        }
        default:
          ok = false;
      }
      if (ok) {
        const res = await this.users.updateOne(
          { _id: userId, 'achievements.key': { $ne: a.key } },
          { $push: { achievements: { key: a.key, unlockedAt: new Date() } }, $inc: { coins: a.rewardCoins ?? COINS.achievement } },
        );
        if (res.modifiedCount) fresh.push({ key: a.key, title: a.title, description: a.description, icon: a.icon, rarity: a.rarity, rewardCoins: a.rewardCoins });
      }
    }
    return fresh;
  }
}
