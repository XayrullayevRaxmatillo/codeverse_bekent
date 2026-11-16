import type { HydratedDocument, Model } from 'mongoose';
import { AchievementSchema } from './achievement.schema';
import { BattleSchema } from './battle.schema';
import { CertificateSchema } from './certificate.schema';
import { ChallengeSchema } from './challenge.schema';
import { CourseSchema } from './course.schema';
import { LessonSchema } from './lesson.schema';
import { ModuleSchema } from './module.schema';
import { QuestionSchema } from './question.schema';
import { ReportSchema } from './report.schema';
import { UserProgressSchema } from './user-progress.schema';
import { UserSchema } from './user.schema';
import { XpEventSchema } from './xp-event.schema';

/** Model nomlari — @InjectModel(M.User) kabi ishlatiladi */
export const M = {
  User: 'User',
  Course: 'Course',
  Module: 'Module',
  Lesson: 'Lesson',
  Challenge: 'Challenge',
  Question: 'Question',
  UserProgress: 'UserProgress',
  Achievement: 'Achievement',
  Certificate: 'Certificate',
  XpEvent: 'XpEvent',
  Battle: 'Battle',
  Report: 'Report',
} as const;

export const MODEL_DEFINITIONS = [
  { name: M.User, schema: UserSchema },
  { name: M.Course, schema: CourseSchema },
  { name: M.Module, schema: ModuleSchema },
  { name: M.Lesson, schema: LessonSchema },
  { name: M.Challenge, schema: ChallengeSchema },
  { name: M.Question, schema: QuestionSchema },
  { name: M.UserProgress, schema: UserProgressSchema },
  { name: M.Achievement, schema: AchievementSchema },
  { name: M.Certificate, schema: CertificateSchema },
  { name: M.XpEvent, schema: XpEventSchema },
  { name: M.Battle, schema: BattleSchema },
  { name: M.Report, schema: ReportSchema },
];

/**
 * Sxemalar dinamik (Schema obyektlari) bo'lgani uchun modellar umumiy turda.
 * Kerak bo'lsa keyinchalik har biriga aniq interfeys yozish mumkin.
 */
export type AnyModel = Model<any>;
export type Doc = HydratedDocument<any>;
