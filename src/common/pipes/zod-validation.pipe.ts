import { PipeTransform } from '@nestjs/common';
import { z, ZodTypeAny } from 'zod';
import { badRequest } from '../errors';

/**
 * Zod sxemasi bilan body / query / param'ni tekshiradi va tozalangan qiymatni qaytaradi.
 * Foydalanish:  @Body(new ZodPipe(schema)) body: z.infer<typeof schema>
 */
export class ZodPipe<T extends ZodTypeAny> implements PipeTransform<unknown, z.infer<T>> {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.infer<T> {
    const r = this.schema.safeParse(value ?? {});
    if (!r.success) {
      const details = r.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
      throw badRequest('VALIDATION', details[0]?.message ?? 'Noto\'g\'ri ma\'lumot', details);
    }
    return r.data;
  }
}

export const objectId = z.string().regex(/^[a-f0-9]{24}$/, 'Noto\'g\'ri ID');

/** :id parametri MongoDB ObjectId ekanini tekshiradi */
export class ObjectIdPipe implements PipeTransform<unknown, string> {
  transform(value: unknown): string {
    const r = objectId.safeParse(value);
    if (!r.success) throw badRequest('VALIDATION', 'Noto\'g\'ri ID', [{ path: 'id', message: 'Noto\'g\'ri ID' }]);
    return r.data;
  }
}
