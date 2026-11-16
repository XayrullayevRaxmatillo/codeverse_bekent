import { Schema } from 'mongoose';
import { Tri } from './common.schema';

export const QuestionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', index: true },
    module: { type: Schema.Types.ObjectId, ref: 'Module', index: true },
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', index: true },
    source: { type: String, enum: ['lesson', 'exam'], default: 'lesson', index: true },
    order: { type: Number, default: 0 },
    type: { type: String, enum: ['mcq', 'tf', 'fill', 'out', 'bug', 'order', 'match'], required: true },
    prompt: { type: Tri, required: true },
    code: { type: String, default: '' },
    options: [Tri],
    // To'g'ri javoblar — klientga hech qachon to'g'ridan-to'g'ri yuborilmaydi (publicQuestion orqali)
    answer: Schema.Types.Mixed,
    accept: [String],
    ci: Boolean,
    lines: [String],
    pairs: [{ _id: false, left: String, right: String }],
    explanation: { type: Tri, default: () => ({}) },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy', index: true },
  },
  { timestamps: true },
);
