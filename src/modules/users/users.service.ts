import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { badRequest, notFound } from '../../common/errors';
import { publicProfile, sid, userSummary } from '../../common/utils/serialize';
import { AnyModel, Doc, M } from '../../database/schemas';
import { levelForXp } from '../../lib/gamification';
import { SHOP_ITEMS, shopItem } from '../../lib/shop';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(M.User) private readonly users: AnyModel,
    @InjectModel(M.XpEvent) private readonly xpEvents: AnyModel,
    @InjectModel(M.UserProgress) private readonly progress: AnyModel,
    @InjectModel(M.Certificate) private readonly certificates: AnyModel,
    @InjectModel(M.Achievement) private readonly achievements: AnyModel,
    @InjectModel(M.Course) private readonly courses: AnyModel,
  ) {}

  private async summary(userId: unknown) {
    return { user: userSummary(await this.users.findById(userId)) };
  }

  async updateMe(user: Doc, { displayName, bio, settings }: { displayName?: string; bio?: string; settings?: { lang?: string; theme?: string } }) {
    const $set: Record<string, unknown> = {};
    if (displayName !== undefined) $set.displayName = displayName;
    if (bio !== undefined) $set.bio = bio;
    if (settings?.lang) $set['settings.lang'] = settings.lang;
    if (settings?.theme) $set['settings.theme'] = settings.theme;
    await this.users.updateOne({ _id: user._id }, { $set });
    return this.summary(user._id);
  }

  /** Statistika: kunlik XP (30 kun), sabablar bo'yicha, kurslar bo'yicha progress */
  async stats(user: Doc) {
    const uid = new Types.ObjectId(String(user._id));
    const since = new Date(Date.now() - 30 * 86_400_000);
    const daily = await this.xpEvents.aggregate([
      { $match: { user: uid, createdAt: { $gte: since } } },
      { $group: { _id: '$day', xp: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]);
    const byReason = await this.xpEvents.aggregate([{ $match: { user: uid } }, { $group: { _id: '$reason', xp: { $sum: '$amount' }, n: { $sum: 1 } } }]);
    const progress = await this.progress.find({ user: user._id }).populate('course', 'slug title color').lean<any[]>();
    return {
      daily: daily.map((d) => ({ day: d._id, xp: d.xp })),
      byReason: byReason.map((b) => ({ reason: b._id, xp: b.xp, count: b.n })),
      courses: progress
        .filter((p) => p.course)
        .map((p) => ({
          slug: p.course.slug,
          title: p.course.title,
          color: p.course.color,
          completedLessons: p.lessons.filter((l: any) => l.completed).length,
          examsPassed: p.exams.filter((e: any) => e.passed).length,
          completed: !!p.completedAt,
        })),
    };
  }

  async equip(user: Doc, key: string) {
    const item = shopItem(key);
    if (!item) throw notFound('Buyum');
    if (!user.inventory.includes(item.key)) throw badRequest('NOT_OWNED', 'Bu buyum sizda yo\'q');
    await this.users.updateOne({ _id: user._id }, { $set: { [`equipped.${item.type}`]: item.key } });
    return this.summary(user._id);
  }

  // ---------- Do'kon ----------
  shopItems() {
    return { items: SHOP_ITEMS };
  }

  async buy(user: Doc, key: string) {
    const item = shopItem(key);
    if (!item) throw notFound('Buyum');
    if (user.inventory.includes(item.key)) throw badRequest('OWNED', 'Bu buyum allaqachon sizda');
    if (levelForXp(user.xp).level < item.minLevel) throw badRequest('LEVEL', `Bu buyum ${item.minLevel}-darajadan ochiladi`);
    // Atomik: tanga yetarli bo'lsagina yechiladi
    const upd = await this.users.updateOne(
      { _id: user._id, coins: { $gte: item.price }, inventory: { $ne: item.key } },
      { $inc: { coins: -item.price }, $push: { inventory: item.key } },
    );
    if (!upd.modifiedCount) throw badRequest('NO_COINS', 'Tanga yetarli emas');
    return this.summary(user._id);
  }

  // ---------- Do'stlar ----------
  async friends(user: Doc) {
    const friends = await this.users.find({ _id: { $in: user.friends } }).select('username displayName xp equipped streak').lean<any[]>();
    return { friends: friends.map((f) => ({ id: sid(f), username: f.username, displayName: f.displayName, xp: f.xp, level: levelForXp(f.xp), equipped: f.equipped })) };
  }

  async addFriend(user: Doc, username: string) {
    const friend = await this.users.findOne({ username, isBanned: false }).select('_id');
    if (!friend) throw notFound('Foydalanuvchi');
    if (sid(friend) === sid(user)) throw badRequest('SELF', 'O\'zingizni qo\'sha olmaysiz');
    await this.users.updateOne({ _id: user._id }, { $addToSet: { friends: friend._id } });
    return this.summary(user._id);
  }

  async removeFriend(user: Doc, friendId: string) {
    await this.users.updateOne({ _id: user._id }, { $pull: { friends: friendId } });
    return this.summary(user._id);
  }

  // ---------- Ommaviy profil ----------
  async profile(username: string) {
    const u = await this.users.findOne({ username: String(username).toLowerCase(), isBanned: false }).lean<any>();
    if (!u) throw notFound('Foydalanuvchi');
    const [certs, achievements, courses] = await Promise.all([
      this.certificates.find({ user: u._id }).populate('course', 'slug color').lean<any[]>(),
      this.achievements.find({ key: { $in: u.achievements.map((a: any) => a.key) } }).lean<any[]>(),
      this.courses.find({ isPublished: true }).select('slug title color').lean<any[]>(),
    ]);
    const prog = await this.progress.find({ user: u._id }).select('course lessons completedAt').lean<any[]>();
    return {
      profile: publicProfile(u),
      certificates: certs.map((c) => ({ code: c.code, courseTitle: c.courseTitle, course: c.course?.slug, color: c.course?.color, issuedAt: c.issuedAt })),
      achievements: achievements.map((a) => ({
        key: a.key,
        title: a.title,
        description: a.description,
        icon: a.icon,
        rarity: a.rarity,
        unlockedAt: u.achievements.find((x: any) => x.key === a.key)?.unlockedAt,
      })),
      courses: courses.map((c) => {
        const p = prog.find((x) => sid(x.course) === sid(c));
        return { slug: c.slug, title: c.title, color: c.color, completedLessons: p ? p.lessons.filter((l: any) => l.completed).length : 0, completed: !!p?.completedAt };
      }),
    };
  }
}
