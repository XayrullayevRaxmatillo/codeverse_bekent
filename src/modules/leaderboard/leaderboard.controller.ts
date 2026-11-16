import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { z } from 'zod';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OptionalAuthGuard } from '../../common/guards/auth.guard';
import { ZodPipe } from '../../common/pipes/zod-validation.pipe';
import { sid } from '../../common/utils/serialize';
import { AnyModel, Doc, M } from '../../database/schemas';
import { dayKey, levelForXp } from '../../lib/gamification';

const query = z.object({
  period: z.enum(['daily', 'weekly', 'monthly', 'all']).default('weekly'),
  scope: z.enum(['global', 'friends']).default('global'),
});

function periodStart(period: string): string | null {
  const now = new Date();
  if (period === 'daily') return dayKey(now);
  if (period === 'weekly') return dayKey(new Date(now.getTime() - 6 * 86_400_000));
  if (period === 'monthly') return dayKey(new Date(now.getTime() - 29 * 86_400_000));
  return null;
}

// Faqat ommaviy ma'lumotlar: login, ism, avatar, daraja, XP (email va boshqalar yo'q)
const pub = (u: any, xp: number) => ({ id: sid(u), username: u.username, displayName: u.displayName, equipped: u.equipped, level: levelForXp(u.xp), xp });

@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    @InjectModel(M.User) private readonly users: AnyModel,
    @InjectModel(M.XpEvent) private readonly xpEvents: AnyModel,
  ) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async list(@Query(new ZodPipe(query)) { period, scope }: z.infer<typeof query>, @CurrentUser() user?: Doc) {
    const userFilter = scope === 'friends' && user ? [user._id, ...user.friends] : null;
    let rows: ReturnType<typeof pub>[];
    if (period === 'all') {
      const users = await this.users
        .find({ isBanned: false, ...(userFilter ? { _id: { $in: userFilter } } : {}) })
        .sort({ xp: -1, createdAt: 1 })
        .limit(50)
        .select('username displayName xp equipped')
        .lean<any[]>();
      rows = users.map((u) => pub(u, u.xp));
    } else {
      const match = { day: { $gte: periodStart(period) }, ...(userFilter ? { user: { $in: userFilter } } : {}) };
      const agg = await this.xpEvents.aggregate([
        { $match: match },
        { $group: { _id: '$user', xp: { $sum: '$amount' } } },
        { $match: { xp: { $gt: 0 } } },
        { $sort: { xp: -1 } },
        { $limit: 80 },
      ]);
      const users = await this.users.find({ _id: { $in: agg.map((a) => a._id) }, isBanned: false }).select('username displayName xp equipped').lean<any[]>();
      const map = new Map(users.map((u) => [sid(u), u]));
      rows = agg
        .filter((a) => map.has(sid(a._id)))
        .slice(0, 50)
        .map((a) => pub(map.get(sid(a._id)), a.xp));
    }
    const ranked = rows.map((row, i) => ({ rank: i + 1, ...row }));
    const me = user ? (ranked.find((x) => x.id === sid(user)) ?? null) : null;
    return { period, scope, rows: ranked, me };
  }
}
