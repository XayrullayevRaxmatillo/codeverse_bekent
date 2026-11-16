import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { badRequest, forbidden, notFound } from '../../common/errors';
import { challengePublic, lessonEntryPublic, sid } from '../../common/utils/serialize';
import { AnyModel, Doc, M } from '../../database/schemas';
import { COINS, PASS_SCORE, XP } from '../../lib/gamification';
import { gradeSet, publicQuestion } from '../../lib/grading';
import { CourseProgressService } from '../courses/course-progress.service';
import { RewardItem, RewardsService } from '../rewards/rewards.service';

@Injectable()
export class LessonsService {
  constructor(
    private readonly courseProgress: CourseProgressService,
    private readonly rewards: RewardsService,
    @InjectModel(M.Lesson) private readonly lessons: AnyModel,
    @InjectModel(M.Course) private readonly courses: AnyModel,
    @InjectModel(M.Module) private readonly modules: AnyModel,
    @InjectModel(M.Challenge) private readonly challenges: AnyModel,
    @InjectModel(M.Question) private readonly questions: AnyModel,
    @InjectModel(M.UserProgress) private readonly progress: AnyModel,
  ) {}

  async load(id: string) {
    const lesson = await this.lessons.findById(id).lean<any>();
    if (!lesson) throw notFound('Dars');
    return lesson;
  }

  lessonQuestions(lessonId: unknown) {
    return this.questions.find({ lesson: lessonId, source: 'lesson' }).sort({ order: 1 }).lean<any[]>();
  }

  /** Dars ko'rinishi (mehmon va foydalanuvchi uchun umumiy) */
  async payload(lesson: any, user: Doc | null | undefined) {
    const [course, module, siblings, challenge, questions] = await Promise.all([
      this.courses.findById(lesson.course).select('slug title color world').lean<any>(),
      this.modules.findById(lesson.module).select('slug title order').lean<any>(),
      this.lessons.find({ course: lesson.course }).select('_id module order isGuest').lean<any[]>(),
      this.challenges.findOne({ lesson: lesson._id, kind: 'lesson' }).lean<any>(),
      this.lessonQuestions(lesson._id),
    ]);
    // Kurs ichidagi tartib: modul tartibi → dars tartibi
    const modules = await this.modules.find({ course: lesson.course }).select('_id order').lean<any[]>();
    const mOrder = new Map(modules.map((m) => [sid(m), m.order]));
    const ordered = siblings.sort((a, b) => (mOrder.get(sid(a.module)) ?? 0) - (mOrder.get(sid(b.module)) ?? 0) || a.order - b.order);
    const idx = ordered.findIndex((l) => sid(l) === sid(lesson));
    const nextInModule = ordered[idx + 1] && sid(ordered[idx + 1].module) === sid(lesson.module) ? sid(ordered[idx + 1]) : null;
    const inModule = ordered.filter((l) => sid(l.module) === sid(lesson.module));
    let entry = null;
    if (user) {
      const progress = await this.progress.findOne({ user: user._id, course: lesson.course });
      entry = progress?.lessons.find((l: any) => sid(l.lesson) === sid(lesson)) ?? null;
    }
    return {
      lesson: {
        id: sid(lesson),
        slug: lesson.slug,
        title: lesson.title,
        content: lesson.content,
        example: lesson.example,
        exampleMode: lesson.exampleMode,
        minutes: lesson.minutes,
        isGuest: lesson.isGuest,
        course: { id: sid(course), slug: course.slug, title: course.title, color: course.color, world: course.world },
        module: { id: sid(module), slug: module.slug, title: module.title, order: module.order },
        prevId: idx > 0 ? sid(ordered[idx - 1]) : null,
        nextId: nextInModule,
        isLastInModule: !nextInModule,
        position: { index: inModule.findIndex((l) => sid(l) === sid(lesson)) + 1, total: inModule.length },
      },
      challenge: challengePublic(challenge),
      quiz: questions.map(publicQuestion),
      progress: lessonEntryPublic(entry),
    };
  }

  // ---------- Mehmon ----------
  async guestLessons() {
    const lessons = await this.lessons.find({ isGuest: true }).sort({ order: 1 }).select('_id title slug order module course minutes').lean<any[]>();
    return { lessons: lessons.map((l) => ({ id: sid(l), title: l.title, slug: l.slug, order: l.order, minutes: l.minutes, module: sid(l.module), course: sid(l.course) })) };
  }

  async guestLesson(id: string) {
    const lesson = await this.load(id);
    if (!lesson.isGuest) throw forbidden('Bu dars uchun ro\'yxatdan o\'ting');
    return this.payload(lesson, null);
  }

  async guestQuiz(id: string, answers: Record<string, unknown>) {
    const lesson = await this.load(id);
    if (!lesson.isGuest) throw forbidden('Bu dars uchun ro\'yxatdan o\'ting');
    const questions = await this.lessonQuestions(lesson._id);
    return { result: gradeSet(questions, answers), guest: true };
  }

  // ---------- Foydalanuvchi ----------
  async open(id: string, user: Doc | undefined) {
    const lesson = await this.load(id);
    if (!(await this.courseProgress.canAccessLesson(lesson, user))) throw forbidden(user ? 'Bu dars hali qulflangan' : 'Bu dars uchun ro\'yxatdan o\'ting');
    if (user) {
      const progress = await this.courseProgress.ensureProgress(user._id, lesson.course);
      this.courseProgress.lessonEntry(progress, lesson._id);
      progress.lastLesson = lesson._id;
      await progress.save();
    }
    return this.payload(lesson, user);
  }

  /** Dars tugaganda XP berish (ikki marta berilmaydi) */
  private async completionRewards(lesson: any, progress: Doc) {
    const items: RewardItem[] = [];
    const justCompleted = await this.courseProgress.maybeCompleteLesson(progress, lesson);
    if (justCompleted) items.push({ key: `lesson:${sid(lesson)}`, reason: 'lesson', xp: XP.lesson, coins: COINS.lesson, stats: { 'stats.lessonsCompleted': 1 } });
    await this.courseProgress.refreshCourseCompletion(progress);
    return { items, justCompleted };
  }

  async submitQuiz(id: string, user: Doc, answers: Record<string, unknown>) {
    const lesson = await this.load(id);
    if (!(await this.courseProgress.canAccessLesson(lesson, user))) throw forbidden('Bu dars hali qulflangan');
    const questions = await this.lessonQuestions(lesson._id);
    if (!questions.length) throw badRequest('NO_QUIZ', 'Bu darsda test yo\'q');
    const result = gradeSet(questions, answers);
    const progress = await this.courseProgress.ensureProgress(user._id, lesson.course);
    const entry = this.courseProgress.lessonEntry(progress, lesson._id);
    entry.quizBest = Math.max(entry.quizBest ?? 0, result.percent);
    const items: RewardItem[] = [];
    if (result.percent >= PASS_SCORE) items.push({ key: `quiz:${sid(lesson)}`, reason: 'quiz', xp: XP.quiz, coins: COINS.quiz, stats: { 'stats.quizzesPassed': 1 } });
    if (result.percent === 100) items.push({ key: `perfect:${sid(lesson)}`, reason: 'perfect', xp: 0, stats: { 'stats.perfectQuizzes': 1 } });
    const done = await this.completionRewards(lesson, progress);
    await progress.save();
    const reward = await this.rewards.grant(user._id, [...items, ...done.items]);
    const after = this.courseProgress.lessonEntry(progress, lesson._id);
    return { result, passed: result.percent >= PASS_SCORE, lessonCompleted: after.completed, progress: lessonEntryPublic(after), reward };
  }

  async complete(id: string, user: Doc) {
    const lesson = await this.load(id);
    if (!(await this.courseProgress.canAccessLesson(lesson, user))) throw forbidden('Bu dars hali qulflangan');
    const progress = await this.courseProgress.ensureProgress(user._id, lesson.course);
    const done = await this.completionRewards(lesson, progress);
    await progress.save();
    const entry = this.courseProgress.lessonEntry(progress, lesson._id);
    if (!entry.completed) throw badRequest('REQUIREMENTS', 'Avval amaliy topshiriq va testni bajaring');
    const reward = await this.rewards.grant(user._id, done.items);
    return { lessonCompleted: true, progress: lessonEntryPublic(entry), reward };
  }

  async saveCode(id: string, user: Doc, code: { html: string; css: string; js: string }) {
    const lesson = await this.load(id);
    const progress = await this.courseProgress.ensureProgress(user._id, lesson.course);
    const entry = this.courseProgress.lessonEntry(progress, lesson._id);
    entry.savedCode = code;
    await progress.save();
    return { ok: true };
  }

  /** Mehmon progressini akkauntga ko'chirish (XP berilmaydi — faqat yo'l ochiladi) */
  async importGuest(user: Doc, lessonIds: string[]) {
    const lessons = await this.lessons.find({ _id: { $in: lessonIds }, isGuest: true }).select('_id course').lean<any[]>();
    let imported = 0;
    for (const l of lessons) {
      const progress = await this.courseProgress.ensureProgress(user._id, l.course);
      const entry = this.courseProgress.lessonEntry(progress, l._id);
      if (!entry.completed) {
        entry.completed = true;
        entry.completedAt = new Date();
        entry.quizBest = Math.max(entry.quizBest ?? 0, PASS_SCORE);
        entry.challengeDone = true;
        imported++;
      }
      await progress.save();
    }
    return { imported };
  }

  /** Kod ishga tushirildi (birinchi marta — "Birinchi kod" yutug'i tekshiriladi) */
  async codeRun(user: Doc) {
    const first = (user.stats?.codeRuns ?? 0) === 0;
    await user.updateOne({ $inc: { 'stats.codeRuns': 1 } });
    const reward = first ? await this.rewards.grant(user._id, [], { activity: false }) : null;
    return { ok: true, reward };
  }
}
