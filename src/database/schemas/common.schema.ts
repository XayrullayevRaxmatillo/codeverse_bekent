import { Schema } from 'mongoose';

/** Uch tilli matn: { uz, ru, en } */
export const Tri = new Schema(
  { uz: { type: String, default: '' }, ru: { type: String, default: '' }, en: { type: String, default: '' } },
  { _id: false },
);
