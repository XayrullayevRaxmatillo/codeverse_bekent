import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { objectId, ZodPipe } from '../../common/pipes/zod-validation.pipe';
import type { Doc } from '../../database/schemas';
import { PlayService, QUESTION_TYPES } from './play.service';

const gameStart = z.object({
  course: z.string().max(40).optional(),
  type: z.enum(['mixed', ...QUESTION_TYPES]).default('mixed'),
  count: z.number().int().min(3).max(15).default(8),
});
const gameAnswer = z.object({ questionId: objectId, answer: z.unknown() });
const battleStart = z.object({ difficulty: z.enum(['easy', 'medium', 'hard']).default('easy'), course: z.string().max(40).optional() });
const finishBody = z.object({ answers: z.record(z.string(), z.unknown()).default({}) });

@Controller('play')
@UseGuards(AuthGuard)
export class PlayController {
  constructor(private readonly play: PlayService) {}

  // ----- O'yin -----
  @Post('game/start')
  @HttpCode(200)
  startGame(@CurrentUser() user: Doc, @Body(new ZodPipe(gameStart)) body) {
    return this.play.startGame(user, body);
  }

  @Post('game/:id/answer')
  @HttpCode(200)
  answer(@Param('id') id: string, @CurrentUser() user: Doc, @Body(new ZodPipe(gameAnswer)) body) {
    return this.play.answerGame(id, user, body.questionId, body.answer);
  }

  @Post('hearts/refill')
  @HttpCode(200)
  refill(@CurrentUser() user: Doc) {
    return this.play.refillHearts(user);
  }

  // ----- Jang -----
  @Post('battle/start')
  @HttpCode(200)
  startBattle(@CurrentUser() user: Doc, @Body(new ZodPipe(battleStart)) body) {
    return this.play.startBattle(user, body);
  }

  @Post('battle/:id/finish')
  @HttpCode(200)
  finishBattle(@Param('id') id: string, @CurrentUser() user: Doc, @Body(new ZodPipe(finishBody)) body) {
    return this.play.finish(id, user, body.answers, 'battle');
  }

  // ----- Kunlik challenge -----
  @Get('daily')
  daily(@CurrentUser() user: Doc) {
    return this.play.daily(user);
  }

  @Post('daily/start')
  @HttpCode(200)
  startDaily(@CurrentUser() user: Doc) {
    return this.play.startDaily(user);
  }

  @Post('daily/:id/finish')
  @HttpCode(200)
  finishDaily(@Param('id') id: string, @CurrentUser() user: Doc, @Body(new ZodPipe(finishBody)) body) {
    return this.play.finish(id, user, body.answers, 'daily');
  }
}
