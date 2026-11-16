// Kurs xaritasi tugunlari holatini hisoblash (sof funksiya — testlanadi)
// Holatlar: locked | available | in_progress | completed | mastered

import { PASS_SCORE } from './gamification';

const sid = (v: any): string => String(v?._id ?? v);

export type LessonNode = { id: string; status: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered'; quizBest: number | null; challengeDone: boolean };
export type ModuleNode = {
  id: string;
  unlocked: boolean;
  lessons: LessonNode[];
  exam: { status: 'locked' | 'available' | 'completed'; best: number | null; attempts: number };
  done: number;
  total: number;
};
export type Tree = {
  modules: ModuleNode[];
  project: { status: 'locked' | 'available' | 'completed' };
  stats: { totalLessons: number; doneLessons: number; examsPassed: number; totalExams: number; percent: number };
  complete: boolean;
};

export function computeTree({
  modules,
  lessonsByModule,
  progress,
  courseUnlocked,
  unlockAll = false,
  guest = false,
}: {
  modules: any[];
  lessonsByModule: Record<string, any[]>;
  progress: any;
  courseUnlocked: boolean;
  unlockAll?: boolean;
  guest?: boolean;
}): Tree {
  const lp = new Map<string, any>((progress?.lessons ?? []).map((l) => [sid(l.lesson), l]));
  const ex = new Map<string, any>((progress?.exams ?? []).map((e) => [sid(e.module), e]));
  let prevModulePassed = true;
  let totalLessons = 0;
  let doneLessons = 0;
  let examsPassed = 0;

  const outModules: ModuleNode[] = modules.map((m) => {
    const lessons = lessonsByModule[sid(m)] ?? [];
    const moduleUnlocked = unlockAll || (courseUnlocked && prevModulePassed);
    let prevDone = true;
    const outLessons: LessonNode[] = lessons.map((l) => {
      const p = lp.get(sid(l));
      totalLessons++;
      let status: LessonNode['status'];
      if (p?.completed) {
        doneLessons++;
        const perfectQuiz = !l.quizCount || p.quizBest === 100;
        const ch = !l.hasChallenge || p.challengeDone;
        status = perfectQuiz && ch ? 'mastered' : 'completed';
      } else {
        const unlocked = guest ? !!l.isGuest : unlockAll || (moduleUnlocked && prevDone);
        status = !unlocked ? 'locked' : p?.started ? 'in_progress' : 'available';
      }
      prevDone = !!p?.completed;
      return { id: sid(l), status, quizBest: p?.quizBest ?? null, challengeDone: !!p?.challengeDone };
    });
    const allDone = outLessons.length > 0 && outLessons.every((l) => l.status === 'completed' || l.status === 'mastered');
    const e = ex.get(sid(m));
    const examPassed = !!e?.passed;
    if (examPassed) examsPassed++;
    const examStatus: ModuleNode['exam']['status'] = examPassed ? 'completed' : (allDone || unlockAll) && moduleUnlocked ? 'available' : 'locked';
    prevModulePassed = examPassed;
    return {
      id: sid(m),
      unlocked: moduleUnlocked,
      lessons: outLessons,
      exam: { status: examStatus, best: e?.best ?? null, attempts: e?.attempts ?? 0 },
      done: outLessons.filter((l) => l.status === 'completed' || l.status === 'mastered').length,
      total: outLessons.length,
    };
  });

  const allExams = modules.length > 0 && examsPassed === modules.length;
  const projectStatus: Tree['project']['status'] = progress?.projectDone ? 'completed' : allExams || unlockAll ? 'available' : 'locked';
  const complete = totalLessons > 0 && doneLessons === totalLessons && allExams && !!progress?.projectDone;
  return {
    modules: outModules,
    project: { status: projectStatus },
    stats: {
      totalLessons,
      doneLessons,
      examsPassed,
      totalExams: modules.length,
      percent: totalLessons ? Math.round(((doneLessons + examsPassed + (progress?.projectDone ? 1 : 0)) / (totalLessons + modules.length + 1)) * 100) : 0,
    },
    complete,
  };
}

/** Darsni tugatish talablari bajarilganmi */
export function lessonRequirementsMet({ hasChallenge, quizCount }: { hasChallenge: boolean; quizCount: number }, p: any): boolean {
  const challengeOk = !hasChallenge || !!p?.challengeDone;
  const quizOk = !quizCount || (p?.quizBest ?? 0) >= PASS_SCORE;
  return challengeOk && quizOk;
}

/** Kurs ochiqmi: prerequisite kursning birinchi moduli imtihoni topshirilgan bo'lsa */
export function isCourseUnlocked(course: { prerequisite?: string | null }, prereqProgress: any, prereqFirstModuleId: unknown): boolean {
  if (!course.prerequisite) return true;
  if (!prereqProgress || !prereqFirstModuleId) return false;
  return (prereqProgress.exams ?? []).some((e) => sid(e.module) === sid(prereqFirstModuleId) && e.passed);
}
