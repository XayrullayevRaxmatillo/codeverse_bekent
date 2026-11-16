import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { forbidden, notFound } from '../../common/errors';
import { sid } from '../../common/utils/serialize';
import { AnyModel, Doc, M } from '../../database/schemas';
import { COINS, XP } from '../../lib/gamification';
import { gradeSet, publicQuestion } from '../../lib/grading';
import { CourseProgressService } from '../courses/course-progress.service';
import { RewardItem, RewardsService } from '../rewards/rewards.service';

/** Modul imtihonlari */
@Injectable()
export class ExamsService {
  constructor(
    private readonly courseProgress: CourseProgressService,
    private readonly rewards: RewardsService,
    @InjectModel(M.Module) private readonly modules: AnyModel,
    @InjectModel(M.Course) private readonly courses: AnyModel,
    @InjectModel(M.Question) private readonly questions: AnyModel,
  ) {}

  private async context(moduleId: string, user: Doc) {
    const mod = await this.modules.findById(moduleId).lean<any>();
    if (!mod) throw notFound('Modul');
    const course = await this.courses.findById(mod.course).lean<any>();
    const { tree } = await this.courseProgress.getTree(course, user);
    const node = tree.modules.find((m) => m.id === sid(mod));
    return { mod, course, node };
  }

  private examQuestions(moduleId: unknown) {
    return this.questions.find({ module: moduleId, source: 'exam' }).sort({ order: 1 }).lean<any[]>();
  }

  async get(moduleId: string, user: Doc) {
    const { mod, course, node } = await this.context(moduleId, user);
    if (!node || node.exam.status === 'locked') throw forbidden('Imtihon uchun avval moduldagi barcha darslarni tugating');
    const questions = await this.examQuestions(mod._id);
    return {
      exam: {
        module: { id: sid(mod), title: mod.title, slug: mod.slug, passScore: mod.passScore },
        course: { slug: course.slug, title: course.title, color: course.color },
        status: node.exam.status,
        best: node.exam.best,
        attempts: node.exam.attempts,
        timeLimitSec: Math.max(300, questions.length * 60),
        questions: questions.map(publicQuestion),
      },
    };
  }

  async submit(moduleId: string, user: Doc, answers: Record<string, unknown>) {
    const { mod, course, node } = await this.context(moduleId, user);
    if (!node || node.exam.status === 'locked') throw forbidden('Imtihon hali ochilmagan');
    const questions = await this.examQuestions(mod._id);
    // Imtihonda to'g'ri javoblar ochilmaydi — faqat to'g'ri/noto'g'ri va izoh
    const result = gradeSet(questions, answers, { reveal: false });
    const passed = result.percent >= mod.passScore;
    const progress = await this.courseProgress.ensureProgress(user._id, course._id);
    let e = progress.exams.find((x: any) => sid(x.module) === sid(mod));
    if (!e) {
      progress.exams.push({ module: mod._id, attempts: 0 });
      e = progress.exams[progress.exams.length - 1];
    }
    e.attempts = (e.attempts ?? 0) + 1;
    e.best = Math.max(e.best ?? 0, result.percent);
    const items: RewardItem[] = [];
    if (passed && !e.passed) {
      e.passed = true;
      e.passedAt = new Date();
    }
    if (passed) items.push({ key: `exam:${sid(mod)}`, reason: 'exam', xp: XP.exam, coins: COINS.exam, stats: { 'stats.examsPassed': 1 } });
    await this.courseProgress.refreshCourseCompletion(progress);
    await progress.save();
    const reward = await this.rewards.grant(user._id, items);
    return { result, passed, passScore: mod.passScore, best: e.best, reward };
  }
}
