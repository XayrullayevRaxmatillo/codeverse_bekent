import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OptionalAuthGuard } from '../../common/guards/auth.guard';
import { AnyModel, Doc, M } from '../../database/schemas';

@Controller('achievements')
export class AchievementsController {
  constructor(@InjectModel(M.Achievement) private readonly achievements: AnyModel) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async list(@CurrentUser() user?: Doc) {
    const all = await this.achievements.find().sort({ createdAt: 1 }).lean<any[]>();
    const mine = new Map<string, Date>((user?.achievements ?? []).map((a: any) => [a.key, a.unlockedAt]));
    return {
      achievements: all.map((a) => ({
        key: a.key,
        title: a.title,
        description: a.description,
        icon: a.icon,
        rarity: a.rarity,
        rewardCoins: a.rewardCoins,
        condition: a.condition,
        unlocked: mine.has(a.key),
        unlockedAt: mine.get(a.key) ?? null,
      })),
    };
  }
}
