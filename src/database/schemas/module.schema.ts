import { Schema } from 'mongoose';
import { Tri } from './common.schema';

export const ModuleSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    slug: { type: String, required: true },
    order: { type: Number, default: 0 },
    title: { type: Tri, required: true },
    description: { type: Tri, default: () => ({}) },
    passScore: { type: Number, default: 70, min: 1, max: 100 },
  },
  { timestamps: true },
);
ModuleSchema.index({ course: 1, slug: 1 }, { unique: true });
