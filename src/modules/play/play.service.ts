import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { badRequest, conflict, notFound } from '../../common/errors';
import { sid, userSummary } from '../../common/utils/serialize';
import { AnyModel, Doc, M } from '../../database/schemas';
import { battleScore, battleXp, currentHearts, dayKey, HEARTS, XP } from '../../lib/gamification';
import { correctAnswerView, gradeQuestion, publicQuestion, seededShuffle } from '../../lib/grading';
import { CourseProgressService } from '../courses/course-progress.service';
import { RewardsService } from '../rewards/rewards.service';

export const QUESTION_TYPES = ['mcq', 'tf', 'fill', 'out', 'bug', 'order', 'match'] as const;
type Difficulty = 'easy' | 'medium' | 'hard';
const TIME: Record<Difficulty, number> = { easy: 150, medium: 120, hard: 90 };
const DAILY_TIME = 120;
const ROUND = 10;
const REFILL_COST = 30;

/** O'yin rejimi, Jang (battle) rejimi va Kunlik challenge */
@Injectable()
export class PlayService {
  constructor(
    private readonly courseProgress: CourseProgressService,
    private readonly rewards: RewardsService,
    @InjectModel(M.Battle) private readonly battles: AnyModel,
    @InjectModel(M.Course) private readonly courses: AnyModel,
    @InjectModel(M.Question) private readonly questions: AnyModel,
    @InjectModel(M.User) private readonly users: AnyModel,
    @InjectModel(M.XpEvent) private readonly xpEvents: AnyModel,
  ) {}

  // ---------- yordamchilar ----------
  private async unlockedCourseIds(user: Doc, slug?: string) {
    const courses = await this.courses.find({ isPublished: true, comingSoon: { $ne: true }, ...(slug ? { slug } : {}) }).lean<any[]>();
    const ids = [];
    for (const c of courses) if (user.role === 'admin' || (await this.courseProgress.courseUnlocked(c, user._id))) ids.push(c._id);
    return ids;
  }

  private async sample(match: Record<string, unknown>, size: number): Promise<any[]> {
    return this.questions.aggregate([{ $match: match }, { $sample: { size } }]);
  }

  private async todayXp(userId: unknown, reason: string): Promise<number> {
    const [agg] = await this.xpEvents.aggregate([
      { $match: { user: new Types.ObjectId(String(userId)), day: dayKey(), reason } },
      { $group: { _id: null, xp: { $sum: '$amount' } } },
    ]);
    return agg?.xp ?? 0;
  }

  private async heartsOf(userId: unknown) {
    const u = await this.users.findById(userId).select('hearts heartsUpdatedAt');
    return { u, ...currentHearts(u.hearts, u.heartsUpdatedAt) };
  }

  // ================= O'YIN REJIMI =================
  async startGame(user: Doc, { course, type, count }: { course?: string; type: string; count: number }) {
    const ids = await this.unlockedCourseIds(user, course);
    if (!ids.length) throw badRequest('NO_COURSES', 'Avval kursni oching');
    const match = { course: { $in: ids }, source: 'lesson', ...(type !== 'mixed' ? { type } : {}) };
    const qs = await this.sample(match, count);
    if (!qs.length) throw badRequest('NO_QUESTIONS', 'Bu turdagi savollar topilmadi');
    const game = await this.battles.create({
      user: user._id,
      mode: 'game',
      questions: qs.map((q) => q._id),
      expiresAt: new Date(Date.now() + 60 * 60_000),
      day: dayKey(),
      course: course ?? null,
    });
    const h = await this.heartsOf(user._id);
    await this.users.updateOne({ _id: user._id }, { $inc: { 'stats.gamesPlayed': 1 } });
    return { game: { id: sid(game), questions: qs.map(publicQuestion), hearts: h.hearts, heartsNextInMs: h.nextInMs } };
  }

  async answerGame(gameId: string, user: Doc, questionId: string, answer: unknown) {
    const game = await this.battles.findOne({ _id: gameId, user: user._id, mode: 'game' });
    if (!game) throw notFound('O\'yin');
    if (!game.questions.some((q: any) => sid(q) === questionId)) throw badRequest('NOT_IN_GAME', 'Savol bu o\'yinda yo\'q');
    if (game.answered.includes(questionId)) throw conflict('ALREADY_ANSWERED', 'Bu savolga javob berilgan');
    const q = await this.questions.findById(questionId).lean<any>();
    const correct = gradeQuestion(q, answer);
    game.answered.push(questionId);
    game.correct = (game.correct ?? 0) + (correct ? 1 : 0);
    if (game.answered.length >= game.questions.length) game.finishedAt = new Date();
    await game.save();

    const h = await this.heartsOf(user._id);
    let hearts = h.hearts;
    let reward = null;
    if (correct) {
      // Yuraklar tugagan bo'lsa ham o'ynash mumkin — faqat XP berilmaydi (jazolamaydigan tizim)
      if (hearts > 0 && (await this.todayXp(user._id, 'game')) < XP.gameDailyCap) {
        reward = await this.rewards.grant(user._id, [{ key: `game:${sid(game)}:${questionId}`, reason: 'game', xp: XP.gameCorrect, coins: 1 }]);
      }
    } else if (hearts > 0) {
      hearts -= 1;
      await this.users.updateOne({ _id: user._id }, { $set: { hearts, heartsUpdatedAt: hearts === HEARTS.max - 1 ? new Date() : h.updatedAt } });
    }
    const after = await this.heartsOf(user._id);
    return {
      correct,
      explanation: q.explanation,
      answer: correctAnswerView(q),
      hearts: after.hearts,
      heartsNextInMs: after.nextInMs,
      reward,
      finished: !!game.finishedAt,
      score: game.correct,
    };
  }

  async refillHearts(user: Doc) {
    const h = await this.heartsOf(user._id);
    if (h.hearts >= HEARTS.max) throw badRequest('FULL', 'Yuraklar to\'la');
    const upd = await this.users.updateOne(
      { _id: user._id, coins: { $gte: REFILL_COST } },
      { $inc: { coins: -REFILL_COST }, $set: { hearts: HEARTS.max, heartsUpdatedAt: new Date() } },
    );
    if (!upd.modifiedCount) throw badRequest('NO_COINS', `Tanga yetarli emas (${REFILL_COST} kerak)`);
    return { user: userSummary(await this.users.findById(user._id)) };
  }

  // ================= JANG REJIMI =================
  private comboMax(questions: any[], answers: Record<string, unknown>) {
    let cur = 0;
    let best = 0;
    for (const q of questions) {
      if (gradeQuestion(q, answers[sid(q)])) best = Math.max(best, ++cur);
      else cur = 0;
    }
    return best;
  }

  async startBattle(user: Doc, { difficulty, course }: { difficulty: Difficulty; course?: string }) {
    const ids = await this.unlockedCourseIds(user, course);
    if (!ids.length) throw badRequest('NO_COURSES', 'Avval kursni oching');
    let qs = await this.sample({ course: { $in: ids }, source: 'lesson', difficulty }, ROUND);
    if (qs.length < ROUND) {
      const more = await this.sample({ course: { $in: ids }, source: 'lesson', _id: { $nin: qs.map((q) => q._id) } }, ROUND - qs.length);
      qs = [...qs, ...more];
    }
    const battle = await this.battles.create({
      user: user._id,
      mode: 'battle',
      difficulty,
      questions: qs.map((q) => q._id),
      timeLimitSec: TIME[difficulty],
      expiresAt: new Date(Date.now() + (TIME[difficulty] + 15) * 1000),
      day: dayKey(),
      course: course ?? null,
    });
    return { battle: { id: sid(battle), difficulty, timeLimitSec: TIME[difficulty], questions: qs.map(publicQuestion), best: user.battleBest?.[difficulty] ?? 0 } };
  }

  async finish(battleId: string, user: Doc, answers: Record<string, unknown>, mode: 'battle' | 'daily') {
    const battle = await this.battles.findOne({ _id: battleId, user: user._id, mode });
    if (!battle) throw notFound('Jang');
    if (battle.finishedAt) throw conflict('FINISHED', 'Bu jang allaqachon yakunlangan');
    const questions = await this.questions.find({ _id: { $in: battle.questions } }).lean<any[]>();
    const ordered = battle.questions.map((id: any) => questions.find((q) => sid(q) === sid(id))).filter(Boolean);
    const now = Date.now();
    const elapsedMs = now - battle.startedAt.getTime();
    const limitMs = battle.timeLimitSec * 1000;
    const late = elapsedMs > limitMs + 10_000;
    const results = ordered.map((q: any) => ({ id: sid(q), correct: !late && gradeQuestion(q, answers[sid(q)]), explanation: q.explanation, answer: correctAnswerView(q) }));
    const correct = results.filter((x: any) => x.correct).length;
    const score = late
      ? 0
      : battleScore({ correct, total: ordered.length, timeLeftMs: Math.max(0, limitMs - elapsedMs), difficulty: battle.difficulty, streakMax: this.comboMax(ordered, answers) });
    battle.finishedAt = new Date();
    battle.correct = correct;
    battle.score = score;
    const bestKey = mode === 'daily' ? 'daily' : battle.difficulty;
    const prevBest = user.battleBest?.[bestKey] ?? 0;
    const newBest = score > prevBest;
    if (newBest) await this.users.updateOne({ _id: user._id }, { $set: { [`battleBest.${bestKey}`]: score } });
    const cap = XP.battleDailyCap - (await this.todayXp(user._id, 'battle'));
    const xp = Math.max(0, Math.min(cap, battleXp({ correct, total: ordered.length, difficulty: battle.difficulty }) + (mode === 'daily' && correct > 0 ? 25 : 0)));
    battle.xpAwarded = xp;
    await battle.save();
    const reward = await this.rewards.grant(user._id, [{ key: `battle:${sid(battle)}`, reason: 'battle', xp, coins: Math.floor(correct / 2), stats: { 'stats.battlesPlayed': 1 } }]);
    return { result: { results, correct, total: ordered.length, score, late, elapsedMs, best: Math.max(prevBest, score), newBest }, reward };
  }

  // ================= KUNLIK CHALLENGE =================
  private async dailyQuestions(day: string) {
    const all = await this.questions.find({ source: 'lesson', difficulty: { $in: ['easy', 'medium'] } }).select('_id').sort({ _id: 1 }).lean<any[]>();
    const picked = seededShuffle(all.map((q) => sid(q)), `daily:${day}`).slice(0, ROUND);
    const qs = await this.questions.find({ _id: { $in: picked } }).lean<any[]>();
    return picked.map((id) => qs.find((q) => sid(q) === id)).filter(Boolean);
  }

  async daily(user: Doc) {
    const day = dayKey();
    const mine = await this.battles.findOne({ user: user._id, mode: 'daily', day }).lean<any>();
    const top = await this.battles
      .find({ mode: 'daily', day, finishedAt: { $ne: null } })
      .sort({ score: -1, finishedAt: 1 })
      .limit(10)
      .populate('user', 'username displayName equipped xp')
      .lean<any[]>();
    return {
      daily: {
        day,
        played: !!mine?.finishedAt,
        inProgress: !!mine && !mine.finishedAt && mine.expiresAt > new Date(),
        score: mine?.score ?? null,
        correct: mine?.correct ?? null,
        best: user.battleBest?.daily ?? 0,
        top: top
          .filter((b) => b.user)
          .map((b) => ({ username: b.user.username, displayName: b.user.displayName, avatar: b.user.equipped?.avatar, score: b.score, correct: b.correct })),
      },
    };
  }

  async startDaily(user: Doc) {
    const day = dayKey();
    const existing = await this.battles.findOne({ user: user._id, mode: 'daily', day });
    if (existing?.finishedAt || (existing && existing.expiresAt < new Date())) throw conflict('ALREADY_PLAYED', 'Bugungi challenge bajarilgan. Ertaga yangisi!');
    const qs = await this.dailyQuestions(day);
    if (!qs.length) throw badRequest('NO_QUESTIONS', 'Savollar topilmadi');
    const battle =
      existing ??
      (await this.battles.create({
        user: user._id,
        mode: 'daily',
        difficulty: 'medium',
        questions: qs.map((q) => q._id),
        timeLimitSec: DAILY_TIME,
        expiresAt: new Date(Date.now() + (DAILY_TIME + 15) * 1000),
        day,
      }));
    const remaining = Math.max(0, battle.timeLimitSec - Math.floor((Date.now() - battle.startedAt.getTime()) / 1000));
    return { battle: { id: sid(battle), difficulty: 'medium', timeLimitSec: remaining, questions: qs.map(publicQuestion), best: user.battleBest?.daily ?? 0 } };
  }
}
