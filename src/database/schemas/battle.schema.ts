import { Schema } from 'mongoose';

export const BattleSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mode: { type: String, enum: ['battle', 'daily', 'game'], default: 'battle' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    timeLimitSec: Number,
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    finishedAt: Date,
    correct: Number,
    score: Number,
    xpAwarded: Number,
    day: String,
    answered: { type: [String], default: [] },
    course: { type: String, default: null },
  },
  { timestamps: true },
);
BattleSchema.index({ user: 1, mode: 1, day: 1 });
