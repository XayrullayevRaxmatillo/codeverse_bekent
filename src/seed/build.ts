// Kontentni DB hujjatlariga aylantirish (sof funksiya — seed va testlar uchun umumiy)
import { T } from './helpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function flatten(courseDefs: any[]) {
  const out: { course: any; modules: any[]; project: any }[] = [];
  for (const c of courseDefs) {
    const course = { slug: c.slug, world: c.world, order: c.order, color: c.color, icon: c.icon, prerequisite: c.prerequisite ?? null, title: T(c.title), description: T(c.description), comingSoon: false, isPublished: true };
    const modules = c.modules.map((m: any, mi: number) => ({
      slug: m.slug,
      order: mi + 1,
      title: m.title,
      description: m.description,
      lessons: m.lessons.map((l: any, li: number) => {
        const base = `${c.slug}.${m.slug}.${l.slug}`;
        return {
          slug: l.slug,
          order: li + 1,
          title: l.title,
          content: l.content,
          example: l.example,
          exampleMode: l.exampleMode !== 'web' ? l.exampleMode : l.challenge?.mode ?? 'web',
          minutes: l.minutes,
          isGuest: mi < (c.guestModules ?? 0),
          challenge: l.challenge ? { ...l.challenge, key: base, kind: 'lesson', title: l.challenge.title ?? l.title } : null,
          questions: l.quiz.map((q: any, qi: number) => ({ ...q, key: `${base}.q${qi + 1}`, order: qi + 1, source: 'lesson' })),
        };
      }),
      exam: m.exam.map((q: any, qi: number) => ({ ...q, key: `${c.slug}.${m.slug}.exam.q${qi + 1}`, order: qi + 1, source: 'exam' })),
    }));
    const project = c.project ? { ...c.project, key: `${c.slug}.project`, kind: 'project', title: c.project.title ?? T(['Yakuniy loyiha', 'Итоговый проект', 'Final project']) } : null;
    out.push({ course, modules, project });
  }
  return out;
}
