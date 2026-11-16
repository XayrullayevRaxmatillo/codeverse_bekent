import { Schema } from 'mongoose';
import { HEARTS } from '../../lib/gamification';

export const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 24, match: /^[a-z0-9_]+$/ },
    displayName: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    bio: { type: String, maxlength: 280, default: '' },
    isBanned: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },

    xp: { type: Number, default: 0, min: 0 },
    coins: { type: Number, default: 0, min: 0 },
    hearts: { type: Number, default: HEARTS.max, min: 0, max: HEARTS.max },
    heartsUpdatedAt: { type: Date, default: Date.now },
    streak: {
      current: { type: Number, default: 0 },
      best: { type: Number, default: 0 },
      lastDay: { type: String, default: null },
    },
    activityDays: { type: [String], default: [] },

    achievements: [{ _id: false, key: String, unlockedAt: { type: Date, default: Date.now } }],
    inventory: { type: [String], default: ['avatar-rocket', 'theme-default', 'frame-none'] },
    equipped: {
      avatar: { type: String, default: 'avatar-rocket' },
      theme: { type: String, default: 'theme-default' },
      frame: { type: String, default: 'frame-none' },
    },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    settings: {
      lang: { type: String, enum: ['uz', 'ru', 'en'], default: 'uz' },
      theme: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
    },
    stats: {
      lessonsCompleted: { type: Number, default: 0 },
      challengesCompleted: { type: Number, default: 0 },
      quizzesPassed: { type: Number, default: 0 },
      perfectQuizzes: { type: Number, default: 0 },
      examsPassed: { type: Number, default: 0 },
      projectsCompleted: { type: Number, default: 0 },
      codeRuns: { type: Number, default: 0 },
      battlesPlayed: { type: Number, default: 0 },
      gamesPlayed: { type: Number, default: 0 },
    },
    battleBest: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
      daily: { type: Number, default: 0 },
    },
    resetTokenHash: { type: String, select: false },
    resetTokenExpires: { type: Date, select: false },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

UserSchema.index({ xp: -1 });
