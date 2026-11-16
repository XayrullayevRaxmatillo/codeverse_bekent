import { Schema } from 'mongoose';

// Har bir mukofot alohida yozuv: (user, key) noyob — bitta ish uchun XP ikki marta berilmaydi.
export const XpEventSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    key: { type: String, required: true },
    reason: { type: String, required: true },
    amount: { type: Number, required: true },
    coins: { type: Number, default: 0 },
    day: { type: String, required: true },
  },
  { timestamps: true },
);
XpEventSchema.index({ user: 1, key: 1 }, { unique: true });
XpEventSchema.index({ createdAt: -1 });
XpEventSchema.index({ user: 1, day: 1, reason: 1 });
