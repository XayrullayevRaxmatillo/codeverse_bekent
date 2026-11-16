import { Schema } from 'mongoose';
import { Tri } from './common.schema';

export const CertificateSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    name: { type: String, required: true },
    courseTitle: { type: Tri, required: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
CertificateSchema.index({ user: 1, course: 1 }, { unique: true });
