import { Schema } from 'mongoose';

const lessonProgress = new Schema(
  {
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    started: { type: Boolean, default: true },
    quizBest: { type: Number, default: null }, // foiz
    challengeDone: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    completedAt: Date,
    savedCode: { html: String, css: String, js: String },
  },
  { _id: false },
);

export const UserProgressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    lessons: [lessonProgress],
    exams: [
      {
        _id: false,
        module: { type: Schema.Types.ObjectId, ref: 'Module' },
        best: Number,
        passed: Boolean,
        passedAt: Date,
        attempts: { type: Number, default: 0 },
      },
    ],
    projectDone: { type: Boolean, default: false },
    projectCode: { html: String, css: String, js: String },
    completedAt: Date,
    lastLesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
  },
  { timestamps: true },
);
UserProgressSchema.index({ user: 1, course: 1 }, { unique: true });
