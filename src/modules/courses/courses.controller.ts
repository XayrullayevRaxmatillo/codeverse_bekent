import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { notFound } from '../../common/errors';
import { OptionalAuthGuard } from '../../common/guards/auth.guard';
import { courseBase, sid } from '../../common/utils/serialize';
import { AnyModel, Doc, M } from '../../database/schemas';
import { CourseProgressService } from './course-progress.service';

@Controller('courses')
@UseGuards(OptionalAuthGuard)
export class CoursesController {
  constructor(
    private readonly progress: CourseProgressService,
    @InjectModel(M.Course) private readonly courses: AnyModel,
    @InjectModel(M.Challenge) private readonly challenges: AnyModel,
    @InjectModel(M.Certificate) private readonly certificates: AnyModel,
  ) {}

  @Get()
  async list(@CurrentUser() user?: Doc) {
    const courses = await this.courses.find({ isPublished: true }).sort({ order: 1 }).lean<any[]>();
    const out = [];
    for (const c of courses) {
      if (c.comingSoon) {
        out.push({ ...courseBase(c), unlocked: false, stats: null, complete: false, moduleCount: 0 });
        continue;
      }
      const { tree, unlocked, structure } = await this.progress.getTree(c, user);
      const hasGuest = structure.lessons.some((l) => l.isGuest);
      out.push({
        ...courseBase(c),
        unlocked: user ? unlocked || user.role === 'admin' : hasGuest,
        guestAvailable: hasGuest,
        stats: tree.stats,
        complete: tree.complete,
        moduleCount: structure.modules.length,
        lessonCount: structure.lessons.length,
      });
    }
    return { courses: out };
  }

  @Get(':slug')
  async detail(@Param('slug') slug: string, @CurrentUser() user?: Doc) {
    const course = await this.courses.findOne({ slug, isPublished: true }).lean<any>();
    if (!course || course.comingSoon) throw notFound('Kurs');
    const { tree, unlocked, structure, progress } = await this.progress.getTree(course, user);
    const project = await this.challenges.findOne({ course: course._id, kind: 'project' }).select('key title difficulty').lean<any>();
    const cert = user ? await this.certificates.findOne({ user: user._id, course: course._id }).select('code').lean<any>() : null;
    const modules = structure.modules.map((m, mi) => {
      const tm = tree.modules[mi];
      return {
        id: sid(m),
        slug: m.slug,
        order: m.order,
        title: m.title,
        description: m.description,
        passScore: m.passScore,
        unlocked: tm.unlocked,
        exam: tm.exam,
        done: tm.done,
        total: tm.total,
        lessons: (structure.lessonsByModule[sid(m)] ?? []).map((l, li) => ({
          id: sid(l),
          slug: l.slug,
          order: l.order,
          title: l.title,
          minutes: l.minutes,
          isGuest: l.isGuest,
          hasChallenge: l.hasChallenge,
          quizCount: l.quizCount,
          ...tm.lessons[li],
        })),
      };
    });
    return {
      course: {
        ...courseBase(course),
        unlocked: user ? unlocked || user.role === 'admin' : false,
        modules,
        project: project ? { id: sid(project), key: project.key, title: project.title, difficulty: project.difficulty, ...tree.project } : null,
        stats: tree.stats,
        complete: tree.complete,
        certificate: cert?.code ?? null,
        lastLesson: progress?.lastLesson ? sid(progress.lastLesson) : null,
      },
    };
  }
}
