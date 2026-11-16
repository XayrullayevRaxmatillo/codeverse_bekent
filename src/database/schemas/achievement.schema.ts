import { Schema } from 'mongoose';
import { Tri } from './common.schema';

export const AchievementSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: Tri, required: true },
    description: { type: Tri, default: () => ({}) },
    icon: { type: String, default: 'trophy' },
    // Shart turlari: lessons, firstCode, challenges, courseLessons, courseComplete, streak, xp, perfectQuiz, battles, exams, projects, moduleExam, coursesCompleted
    condition: {
      type: { type: String, required: true },
      value: { type: Number, default: 1 },
      course: { type: String, default: null },
      module: { type: String, default: null },
    },
    rewardCoins: { type: Number, default: 20 },
    rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
  },
  { timestamps: true },
);
