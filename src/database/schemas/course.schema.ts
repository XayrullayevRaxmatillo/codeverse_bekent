import { Schema } from 'mongoose';
import { Tri } from './common.schema';

export const CourseSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    world: { type: String, required: true },
    order: { type: Number, default: 0 },
    title: { type: Tri, required: true },
    description: { type: Tri, default: () => ({}) },
    color: { type: String, default: '#7C5CFC' },
    icon: { type: String, default: 'code' },
    prerequisite: { type: String, default: null }, // oldingi kurs slug'i
    comingSoon: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);
