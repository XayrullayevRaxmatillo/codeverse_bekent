import { Schema } from 'mongoose';
import { Tri } from './common.schema';

const codeSchema = new Schema(
  { html: { type: String, default: '' }, css: { type: String, default: '' }, js: { type: String, default: '' } },
  { _id: false },
);

export const ChallengeSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    kind: { type: String, enum: ['lesson', 'project', 'practice'], default: 'lesson', index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', index: true },
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', index: true },
    title: { type: Tri, required: true },
    mode: { type: String, enum: ['web', 'js', 'react'], default: 'web' },
    instructions: { type: Tri, required: true },
    starter: { type: codeSchema, default: () => ({}) },
    solution: { type: codeSchema, default: () => ({}), select: false },
    // Testlar — ishonchli ifodalar (faqat admin yozadi), brauzer sandbox'ida bajariladi
    tests: [{ _id: false, d: Tri, e: String }],
    // Serverdagi statik qoidalar
    rules: { type: [{ _id: false, p: String, f: String, t: String, not: Boolean, d: Tri }], select: false },
    hints: [Tri],
    explanation: { type: Tri, default: () => ({}) },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  },
  { timestamps: true },
);
