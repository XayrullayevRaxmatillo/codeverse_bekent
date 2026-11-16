import { z } from 'zod';
import { objectId } from '../../common/pipes/zod-validation.pipe';

export const codeShape = z.object({
  html: z.string().max(30_000).default(''),
  css: z.string().max(30_000).default(''),
  js: z.string().max(30_000).default(''),
});
export const answersShape = z.object({ answers: z.record(z.string(), z.unknown()).default({}) });
export const importGuestSchema = z.object({ lessonIds: z.array(objectId).max(50) });
