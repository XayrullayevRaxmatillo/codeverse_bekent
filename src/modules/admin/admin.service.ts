import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { badRequest, notFound } from '../../common/errors';
import { sid } from '../../common/utils/serialize';
import { AnyModel, M } from '../../database/schemas';
import { dayKey, levelForXp } from '../../lib/gamification';
import type { QuestionDto } from './admin.schemas';

const withId = (x: any) => ({ ...x, id: sid(x) });

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(M.User) readonly users: AnyModel,
    @InjectModel(M.Course) readonly courses: AnyModel,
    @InjectModel(M.Module) readonly modules: AnyModel,
    @InjectModel(M.Lesson) readonly lessons: AnyModel,
    @InjectModel(M.Challenge) readonly challenges: AnyModel,
    @InjectModel(M.Question) readonly questions: AnyModel,
    @InjectModel(M.UserProgress) readonly progress: AnyModel,
    @InjectModel(M.Achievement) readonly achievements: AnyModel,
    @InjectModel(M.Certificate) readonly certificates: AnyModel,
    @InjectModel(M.XpEvent) readonly xpEvents: AnyModel,
    @InjectModel(M.Battle) readonly battles: AnyModel,
    @InjectModel(M.Report) readonly reports: AnyModel,
  ) {}

  // ================= STATISTIKA =================
  async stats() {
    const since = dayKey(new Date(Date.now() - 13 * 86_400_000));
    const [users, courses, lessons, challenges, questions, openReports, certificates, battles, activeToday, xpDaily, signups, admins] = await Promise.all([
      this.users.countDocuments(),
      this.courses.countDocuments(),
      this.lessons.countDocuments(),
      this.challenges.countDocuments(),
      this.questions.countDocuments(),
      this.reports.countDocuments({ status: 'open' }),
      this.certificates.countDocuments(),
      this.battles.countDocuments({ finishedAt: { $ne: null } }),
      this.xpEvents.distinct('user', { day: dayKey() }).then((a) => a.length),
      this.xpEvents.aggregate([{ $match: { day: { $gte: since } } }, { $group: { _id: '$day', xp: { $sum: '$amount' }, users: { $addToSet: '$user' } } }, { $sort: { _id: 1 } }]),
      this.users.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 14 * 86_400_000) } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, n: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      this.users.countDocuments({ role: 'admin' }),
    ]);
    const courseProgress = await this.progress.aggregate([
      { $group: { _id: '$course', learners: { $sum: 1 }, completed: { $sum: { $cond: [{ $ifNull: ['$completedAt', false] }, 1, 0] } } } },
    ]);
    const courseDocs = await this.courses.find().select('slug title color').lean<any[]>();
    return {
      totals: { users, admins, courses, lessons, challenges, questions, openReports, certificates, battles, activeToday },
      xpDaily: xpDaily.map((d) => ({ day: d._id, xp: d.xp, users: d.users.length })),
      signups: signups.map((s) => ({ day: s._id, count: s.n })),
      courses: courseDocs.map((c) => {
        const p = courseProgress.find((x) => sid(x._id) === sid(c));
        return { slug: c.slug, title: c.title, color: c.color, learners: p?.learners ?? 0, completed: p?.completed ?? 0 };
      }),
    };
  }

  // ================= FOYDALANUVCHILAR =================
  async listUsers(q: string, page: number) {
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const filter = q ? { $or: [{ username: new RegExp(esc, 'i') }, { email: new RegExp(esc, 'i') }, { displayName: new RegExp(esc, 'i') }] } : {};
    const [items, total] = await Promise.all([
      this.users
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * 20)
        .limit(20)
        .lean<any[]>(),
      this.users.countDocuments(filter),
    ]);
    return {
      total,
      page,
      pages: Math.max(1, Math.ceil(total / 20)),
      users: items.map((u) => ({
        id: sid(u),
        username: u.username,
        displayName: u.displayName,
        email: u.email,
        role: u.role,
        isBanned: u.isBanned,
        xp: u.xp,
        level: levelForXp(u.xp).level,
        coins: u.coins,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
      })),
    };
  }

  async updateUser(id: string, meId: string, body: { role?: string; isBanned?: boolean }) {
    if (id === meId) throw badRequest('SELF', 'O\'z rolingiz yoki holatingizni o\'zgartira olmaysiz');
    const update: Record<string, unknown> = { $set: { ...body } };
    if (body.isBanned) update.$inc = { tokenVersion: 1 }; // sessiyalarni yopish
    const u = await this.users.findByIdAndUpdate(id, update, { new: true });
    if (!u) throw notFound('Foydalanuvchi');
    return { ok: true };
  }

  // ================= KURSLAR =================
  async listCourses() {
    return { courses: (await this.courses.find().sort({ order: 1 }).lean<any[]>()).map(withId) };
  }

  async createCourse(body: unknown) {
    return { course: await this.courses.create(body) };
  }

  async updateCourse(id: string, body: unknown) {
    const c = await this.courses.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!c) throw notFound('Kurs');
    return { course: c };
  }

  async deleteCourse(id: string) {
    const c = await this.courses.findByIdAndDelete(id);
    if (!c) throw notFound('Kurs');
    await Promise.all([
      this.modules.deleteMany({ course: c._id }),
      this.lessons.deleteMany({ course: c._id }),
      this.challenges.deleteMany({ course: c._id }),
      this.questions.deleteMany({ course: c._id }),
      this.progress.deleteMany({ course: c._id }),
    ]);
    return { ok: true };
  }

  // ================= MODULLAR =================
  async listModules(courseId: string) {
    const modules = await this.modules.find({ course: courseId }).sort({ order: 1 }).lean<any[]>();
    const lessons = await this.lessons.find({ course: courseId }).sort({ order: 1 }).select('title slug order module isGuest').lean<any[]>();
    return { modules: modules.map((m) => ({ ...withId(m), lessons: lessons.filter((l) => sid(l.module) === sid(m)).map(withId) })) };
  }

  async createModule(body: unknown) {
    return { module: await this.modules.create(body) };
  }

  async updateModule(id: string, body: unknown) {
    const m = await this.modules.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!m) throw notFound('Modul');
    return { module: m };
  }

  async deleteModule(id: string) {
    const m = await this.modules.findByIdAndDelete(id);
    if (!m) throw notFound('Modul');
    const lessons = await this.lessons.find({ module: m._id }).select('_id');
    const ids = lessons.map((l: any) => l._id);
    await Promise.all([
      this.lessons.deleteMany({ module: m._id }),
      this.challenges.deleteMany({ lesson: { $in: ids } }),
      this.questions.deleteMany({ $or: [{ module: m._id }, { lesson: { $in: ids } }] }),
    ]);
    return { ok: true };
  }

  // ================= DARSLAR =================
  async getLesson(id: string) {
    const lesson = await this.lessons.findById(id).lean<any>();
    if (!lesson) throw notFound('Dars');
    const [challenge, questions] = await Promise.all([
      this.challenges.findOne({ lesson: lesson._id }).select('+solution +rules').lean<any>(),
      this.questions.find({ lesson: lesson._id }).sort({ order: 1 }).lean<any[]>(),
    ]);
    return { lesson: withId(lesson), challenge: challenge ? withId(challenge) : null, questions: questions.map(withId) };
  }

  async createLesson(body: { module: string } & Record<string, unknown>) {
    const mod = await this.modules.findById(body.module).lean<any>();
    if (!mod) throw notFound('Modul');
    return { lesson: await this.lessons.create({ ...body, course: mod.course }) };
  }

  async updateLesson(id: string, body: unknown) {
    const l = await this.lessons.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!l) throw notFound('Dars');
    return { lesson: l };
  }

  async deleteLesson(id: string) {
    const l = await this.lessons.findByIdAndDelete(id);
    if (!l) throw notFound('Dars');
    await Promise.all([this.challenges.deleteMany({ lesson: l._id }), this.questions.deleteMany({ lesson: l._id })]);
    return { ok: true };
  }

  // ================= TOPSHIRIQLAR =================
  private checkRegexes(rules: { p: string; f?: string }[] = []) {
    for (const rule of rules) {
      try {
        new RegExp(rule.p, rule.f ?? '');
      } catch {
        throw badRequest('BAD_REGEX', `Noto'g'ri regex: ${rule.p}`);
      }
    }
  }

  async listChallenges(kind?: string) {
    const list = await this.challenges
      .find(kind ? { kind } : {})
      .select('+solution +rules')
      .sort({ createdAt: 1 })
      .limit(500)
      .lean<any[]>();
    return { challenges: list.map(withId) };
  }

  async createChallenge(body: any) {
    this.checkRegexes(body.rules);
    if (body.lesson && !body.course) body.course = (await this.lessons.findById(body.lesson).select('course').lean<any>())?.course;
    return { challenge: await this.challenges.create(body) };
  }

  async updateChallenge(id: string, body: any) {
    this.checkRegexes(body.rules);
    const c = await this.challenges.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!c) throw notFound('Topshiriq');
    return { challenge: c };
  }

  async deleteChallenge(id: string) {
    if (!(await this.challenges.findByIdAndDelete(id))) throw notFound('Topshiriq');
    return { ok: true };
  }

  // ================= SAVOLLAR =================
  private async resolveQuestionRefs(body: QuestionDto) {
    if (body.lesson) {
      const l = await this.lessons.findById(body.lesson).select('course module').lean<any>();
      if (!l) throw notFound('Dars');
      return { ...body, course: l.course, module: l.module, source: 'lesson' };
    }
    const m = await this.modules.findById(body.module).select('course').lean<any>();
    if (!m) throw notFound('Modul');
    return { ...body, course: m.course, source: 'exam' };
  }

  async listQuestions(lesson?: string, module?: string) {
    const filter = lesson ? { lesson } : module ? { module, source: 'exam' } : {};
    const list = await this.questions.find(filter).sort({ order: 1 }).limit(300).lean<any[]>();
    return { questions: list.map(withId) };
  }

  async createQuestion(body: QuestionDto) {
    return { question: await this.questions.create(await this.resolveQuestionRefs(body)) };
  }

  async updateQuestion(id: string, body: QuestionDto) {
    const q = await this.questions.findByIdAndUpdate(id, { $set: await this.resolveQuestionRefs(body) }, { new: true, runValidators: true });
    if (!q) throw notFound('Savol');
    return { question: q };
  }

  async deleteQuestion(id: string) {
    if (!(await this.questions.findByIdAndDelete(id))) throw notFound('Savol');
    return { ok: true };
  }

  // ================= YUTUQLAR =================
  async listAchievements() {
    return { achievements: (await this.achievements.find().sort({ createdAt: 1 }).lean<any[]>()).map(withId) };
  }

  async createAchievement(body: unknown) {
    return { achievement: await this.achievements.create(body) };
  }

  async updateAchievement(id: string, body: unknown) {
    const a = await this.achievements.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!a) throw notFound('Yutuq');
    return { achievement: a };
  }

  async deleteAchievement(id: string) {
    if (!(await this.achievements.findByIdAndDelete(id))) throw notFound('Yutuq');
    return { ok: true };
  }

  // ================= SHIKOYATLAR =================
  async listReports(status: string) {
    const list = await this.reports
      .find(status === 'all' ? {} : { status })
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('user', 'username displayName')
      .lean<any[]>();
    return { reports: list.map((x) => ({ ...withId(x), user: x.user ? { username: x.user.username, displayName: x.user.displayName } : null })) };
  }

  async updateReport(id: string, body: unknown) {
    const x = await this.reports.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!x) throw notFound('Shikoyat');
    return { ok: true };
  }
}
