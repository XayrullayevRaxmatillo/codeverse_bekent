import type { Request } from 'express';
import type { Doc } from '../database/schemas';

/** Auth guard'dan keyin req.user — Mongoose hujjati (to'liq User) */
export type AuthedRequest = Request & { user?: Doc };
