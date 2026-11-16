import { Schema } from 'mongoose';
import { Tri } from './common.schema';

export const LessonSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    slug: { type: String, required: true },
    order: { type: Number, default: 0 },
    title: { type: Tri, required: true },
    content: { type: Tri, default: () => ({}) }, // markdown
    example: { type: String, default: '' },
    exampleMode: { type: String, enum: ['web', 'js', 'react'], default: 'web' },
    isGuest: { type: Boolean, default: false }, // ro'yxatdan o'tmasdan ochiq
    minutes: { type: Number, default: 8 },
  },
  { timestamps: true },
);
LessonSchema.index({ module: 1, slug: 1 }, { unique: true });
