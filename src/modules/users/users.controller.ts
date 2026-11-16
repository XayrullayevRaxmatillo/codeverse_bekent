import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ZodPipe } from '../../common/pipes/zod-validation.pipe';
import type { Doc } from '../../database/schemas';
import { UsersService } from './users.service';

const updateMe = z.object({
  displayName: z.string().trim().min(2).max(50).optional(),
  bio: z.string().trim().max(280).optional(),
  settings: z.object({ lang: z.enum(['uz', 'ru', 'en']).optional(), theme: z.enum(['dark', 'light', 'system']).optional() }).optional(),
});
const itemBody = z.object({ item: z.string().max(40) });
const friendBody = z.object({ username: z.string().trim().toLowerCase().min(3).max(24) });

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Patch('me')
  @UseGuards(AuthGuard)
  updateMe(@CurrentUser() user: Doc, @Body(new ZodPipe(updateMe)) body) {
    return this.users.updateMe(user, body);
  }

  @Get('me/stats')
  @UseGuards(AuthGuard)
  stats(@CurrentUser() user: Doc) {
    return this.users.stats(user);
  }

  @Post('me/equip')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  equip(@CurrentUser() user: Doc, @Body(new ZodPipe(itemBody)) body) {
    return this.users.equip(user, body.item);
  }

  // ---- Do'kon ----
  @Get('shop/items')
  shopItems() {
    return this.users.shopItems();
  }

  @Post('shop/buy')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  buy(@CurrentUser() user: Doc, @Body(new ZodPipe(itemBody)) body) {
    return this.users.buy(user, body.item);
  }

  // ---- Do'stlar ----
  @Get('me/friends')
  @UseGuards(AuthGuard)
  friends(@CurrentUser() user: Doc) {
    return this.users.friends(user);
  }

  @Post('me/friends')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  addFriend(@CurrentUser() user: Doc, @Body(new ZodPipe(friendBody)) body) {
    return this.users.addFriend(user, body.username);
  }

  @Delete('me/friends/:id')
  @UseGuards(AuthGuard)
  removeFriend(@CurrentUser() user: Doc, @Param('id') id: string) {
    return this.users.removeFriend(user, id);
  }

  // ---- Ommaviy profil (oxirida — ':username' boshqa yo'llarni "yutmasligi" uchun) ----
  @Get(':username')
  profile(@Param('username') username: string) {
    return this.users.profile(username);
  }
}
