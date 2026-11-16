import { Schema } from 'mongoose';

export const ReportSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['lesson', 'question', 'challenge', 'user', 'other'], required: true },
    targetId: { type: String, default: '' },
    reason: { type: String, enum: ['error', 'unclear', 'offensive', 'bug', 'other'], default: 'error' },
    message: { type: String, maxlength: 1000, default: '' },
    status: { type: String, enum: ['open', 'resolved', 'dismissed'], default: 'open', index: true },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true },
);
