import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { badRequest, forbidden, notFound } from '../../common/errors';
import { challengePublic, courseBase, lessonEntryPublic, sid } from '../../common/utils/serialize';
import { AnyModel, Doc, M } from '../../database/schemas';
import { COINS, XP } from '../../lib/gamification';
import { checkSubmission } from '../../lib/rules';
import { CourseProgressService } from '../courses/course-progress.service';
import { RewardItem, RewardsService } from '../rewards/rewards.service';

type Code = { html: string; css: string; js: string };

@Injectable()
export class ChallengesService {
  constructor(
    private readonly courseProgress: CourseProgressService,
    private readonly rewards: RewardsService,
    @InjectModel(M.Challenge) private readonly challenges: AnyModel,
    @InjectModel(M.Course) private readonly courses: AnyModel,
    @InjectModel(M.Lesson) private readonly lessons: AnyModel,
    @InjectModel(M.UserProgress) private readonly progress: AnyModel,
  ) {}

  /** Loyihalar ro'yxati (har bir kursning yakuniy loyihasi) yoki amaliyot topshiriqlari */
  async list(kind: 'project' | 'practice', user: Doc) {
    const list = await this.challenges.find({ kind }).populate('course', 'slug title color world order prerequisite comingSoon').lean<any[]>();
    const out = [];
    for (const ch of list.sort((a, b) => (a.course?.order ?? 0) - (b.course?.order ?? 0))) {
      let status = 'available';
      if (ch.kind === 'project' && ch.course) {
        const { tree } = await this.courseProgress.getTree(ch.course, user);
        status = tree.project.status;
      }
      out.push({ ...challengePublic(ch), course: ch.course ? courseBase(ch.course) : null, status });
    }
    return { challenges: out };
  }

  private async projectStatus(ch: any, user: Doc) {
    const course = await this.courses.findById(ch.course).lean();
    const { tree } = await this.courseProgress.getTree(course, user);
    return tree.project.status;
  }

  async get(id: string, user: Doc) {
    const ch = await this.challenges.findById(id).lean<any>();
    if (!ch) throw notFound('Topshiriq');
    let status = 'available';
    let saved = null;
    if (ch.kind === 'project') {
      status = await this.projectStatus(ch, user);
      const p = await this.progress.findOne({ user: user._id, course: ch.course }).select('projectCode').lean<any>();
      saved = p?.projectCode?.html || p?.projectCode?.css || p?.projectCode?.js ? p.projectCode : null;
    }
    if (ch.kind === 'lesson') {
      const lesson = await this.lessons.findById(ch.lesson).lean();
      if (!lesson || !(await this.courseProgress.canAccessLesson(lesson, user))) status = 'locked';
    }
    const course = ch.course ? await this.courses.findById(ch.course).lean() : null;
    return { challenge: { ...challengePublic(ch), course: course ? courseBase(course) : null, status, savedCode: saved } };
  }

  async submit(id: string, user: Doc, code: Code) {
    const ch = await this.challenges.findById(id).select('+rules').lean<any>();
    if (!ch) throw notFound('Topshiriq');
    const check = checkSubmission(ch, code);
    if (!check.ok) {
      const failed = (ch.rules ?? []).filter((rule: any) => check.errors.includes(rule.p)).map((rule: any) => rule.d);
      throw badRequest('RULES_FAILED', 'Server tekshiruvi o\'tmadi: kod talablarga to\'liq mos emas', {
        failed,
        errors: check.errors.filter((e) => e === 'empty' || e === 'too_large'),
      });
    }

    const items: RewardItem[] = [];
    let lessonProgress = null;
    let lessonCompleted = false;
    if (ch.kind === 'lesson') {
      const lesson = await this.lessons.findById(ch.lesson).lean<any>();
      if (!lesson || !(await this.courseProgress.canAccessLesson(lesson, user))) throw forbidden('Bu dars hali qulflangan');
      const progress = await this.courseProgress.ensureProgress(user._id, lesson.course);
      const entry = this.courseProgress.lessonEntry(progress, lesson._id);
      entry.challengeDone = true;
      entry.savedCode = code;
      items.push({ key: `ch:${sid(ch)}`, reason: 'challenge', xp: XP.challenge, coins: COINS.challenge, stats: { 'stats.challengesCompleted': 1 } });
      if (await this.courseProgress.maybeCompleteLesson(progress, lesson)) {
        items.push({ key: `lesson:${sid(lesson)}`, reason: 'lesson', xp: XP.lesson, coins: COINS.lesson, stats: { 'stats.lessonsCompleted': 1 } });
      }
      await this.courseProgress.refreshCourseCompletion(progress);
      await progress.save();
      lessonProgress = lessonEntryPublic(entry);
      lessonCompleted = entry.completed;
    } else if (ch.kind === 'project') {
      const status = await this.projectStatus(ch, user);
      if (status === 'locked') throw forbidden('Loyiha uchun avval barcha modul imtihonlarini topshiring');
      const progress = await this.courseProgress.ensureProgress(user._id, ch.course);
      progress.projectDone = true;
      progress.projectCode = code;
      await this.courseProgress.refreshCourseCompletion(progress);
      await progress.save();
      items.push({ key: `project:${sid(ch)}`, reason: 'project', xp: XP.project, coins: COINS.project, stats: { 'stats.projectsCompleted': 1, 'stats.challengesCompleted': 1 } });
    } else {
      items.push({ key: `ch:${sid(ch)}`, reason: 'challenge', xp: XP.challenge, coins: COINS.challenge, stats: { 'stats.challengesCompleted': 1 } });
    }
    const reward = await this.rewards.grant(user._id, items);
    return { ok: true, explanation: ch.explanation, lessonCompleted, progress: lessonProgress, reward };
  }

  async saveProjectCode(id: string, user: Doc, code: Code) {
    const ch = await this.challenges.findById(id).select('kind course').lean<any>();
    if (!ch) throw notFound('Topshiriq');
    if (ch.kind !== 'project') throw badRequest('NOT_PROJECT', 'Faqat loyiha kodi saqlanadi');
    await this.progress.updateOne({ user: user._id, course: ch.course }, { $set: { projectCode: code } }, { upsert: true });
    return { ok: true };
  }
}
