import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { computeTree, isCourseUnlocked, lessonRequirementsMet } from '../../lib/progress-rules';
import { AnyModel, Doc, M } from '../../database/schemas';

/** Kurs tuzilmasi, xarita holati va progress bilan ishlash */
@Injectable()
export class CourseProgressService {
  constructor(
    @InjectModel(M.Course) private readonly courses: AnyModel,
    @InjectModel(M.Module) private readonly modules: AnyModel,
    @InjectModel(M.Lesson) private readonly lessons: AnyModel,
    @InjectModel(M.Challenge) private readonly challenges: AnyModel,
    @InjectModel(M.Question) private readonly questions: AnyModel,
    @InjectModel(M.UserProgress) private readonly progress: AnyModel,
  ) {}

  /** Kurs tuzilmasi: modullar + darslar (challenge bor/yo'q, savollar soni bilan) */
  async loadStructure(courseId: any) {
    const [modules, lessons, challenges, quizCounts] = await Promise.all([
      this.modules.find({ course: courseId }).sort({ order: 1 }).lean<any[]>(),
      this.lessons.find({ course: courseId }).sort({ order: 1 }).select('-content -example').lean<any[]>(),
      this.challenges.find({ course: courseId, kind: 'lesson' }).select('lesson').lean<any[]>(),
      this.questions.aggregate([{ $match: { course: courseId, source: 'lesson' } }, { $group: { _id: '$lesson', n: { $sum: 1 } } }]),
    ]);
    const withChallenge = new Set(challenges.map((c) => String(c.lesson)));
    const qc = new Map(quizCounts.map((q) => [String(q._id), q.n]));
    const lessonsByModule: Record<string, any[]> = {};
    for (const l of lessons) {
      l.hasChallenge = withChallenge.has(String(l._id));
      l.quizCount = qc.get(String(l._id)) ?? 0;
      (lessonsByModule[String(l.module)] ??= []).push(l);
    }
    return { modules, lessonsByModule, lessons };
  }

  async courseUnlocked(course: any, userId: unknown): Promise<boolean> {
    if (!course.prerequisite) return true;
    if (!userId) return false;
    const pre = await this.courses.findOne({ slug: course.prerequisite }).select('_id');
    if (!pre) return true;
    const [firstModule, prog] = await Promise.all([
      this.modules.findOne({ course: pre._id }).sort({ order: 1 }).select('_id'),
      this.progress.findOne({ user: userId, course: pre._id }).select('exams').lean(),
    ]);
    return isCourseUnlocked(course, prog, firstModule?._id);
  }

  async getTree(course: any, user: { _id: unknown; role?: string } | null | undefined) {
    const structure = await this.loadStructure(course._id);
    const progress = user ? await this.progress.findOne({ user: user._id, course: course._id }).lean<any>() : null;
    const unlocked = user ? await this.courseUnlocked(course, user._id) : false;
    const tree = computeTree({
      modules: structure.modules,
      lessonsByModule: structure.lessonsByModule,
      progress,
      courseUnlocked: unlocked,
      unlockAll: user?.role === 'admin',
      guest: !user,
    });
    return { structure, progress, unlocked, tree };
  }

  async ensureProgress(userId: unknown, courseId: unknown): Promise<Doc> {
    return this.progress.findOneAndUpdate(
      { user: userId, course: courseId },
      { $setOnInsert: { user: userId, course: courseId } },
      { upsert: true, new: true },
    );
  }

  /** Progress ichidagi dars yozuvi (yo'q bo'lsa yaratadi) */
  lessonEntry(progress: Doc, lessonId: unknown) {
    let entry = progress.lessons.find((l: any) => String(l.lesson) === String(lessonId));
    if (!entry) {
      progress.lessons.push({ lesson: lessonId, started: true });
      entry = progress.lessons[progress.lessons.length - 1];
    }
    return entry;
  }

  /** Talablar bajarilgan bo'lsa darsni tugallangan deb belgilaydi. true — hozir tugallandi */
  async maybeCompleteLesson(progress: Doc, lesson: any): Promise<boolean> {
    const entry = this.lessonEntry(progress, lesson._id);
    if (entry.completed) return false;
    const [hasChallenge, quizCount] = await Promise.all([
      this.challenges.exists({ lesson: lesson._id, kind: 'lesson' }),
      this.questions.countDocuments({ lesson: lesson._id, source: 'lesson' }),
    ]);
    if (!lessonRequirementsMet({ hasChallenge: !!hasChallenge, quizCount }, entry)) return false;
    entry.completed = true;
    entry.completedAt = new Date();
    return true;
  }

  /** Kurs to'liq tugallanganmi (darslar + imtihonlar + loyiha) — completedAt ni belgilaydi */
  async refreshCourseCompletion(progress: Doc): Promise<boolean> {
    if (progress.completedAt) return false;
    const structure = await this.loadStructure(progress.course);
    const tree = computeTree({ modules: structure.modules, lessonsByModule: structure.lessonsByModule, progress, courseUnlocked: true });
    if (tree.complete) {
      progress.completedAt = new Date();
      return true;
    }
    return false;
  }

  /** Foydalanuvchi bu darsga kira oladimi (yopiq bo'lsa false) */
  async canAccessLesson(lesson: any, user: Doc | null | undefined): Promise<boolean> {
    if (lesson.isGuest) return true;
    if (!user) return false;
    if (user.role === 'admin') return true;
    const course = await this.courses.findById(lesson.course);
    const { tree } = await this.getTree(course, user);
    const node = tree.modules.flatMap((m) => m.lessons).find((l) => l.id === String(lesson._id));
    return !!node && node.status !== 'locked';
  }
}
