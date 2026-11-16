import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AiRateLimit } from '../../common/guards/rate-limit.guard';
import { objectId, ZodPipe } from '../../common/pipes/zod-validation.pipe';
import type { Doc } from '../../database/schemas';
import { AI_MODES } from '../../lib/ai/prompts';
import { AiService } from './ai.service';

const chatSchema = z.object({
  mode: z.enum(AI_MODES).default('chat'),
  lang: z.enum(['uz', 'ru', 'en']).default('uz'),
  message: z.string().trim().max(4000).default(''),
  code: z.string().max(12_000).optional(),
  error: z.string().max(2000).optional(),
  lessonId: objectId.optional(),
  challengeId: objectId.optional(),
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(4000) }))
    .max(10)
    .default([]),
});
export type ChatDto = z.infer<typeof chatSchema>;

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Get('status')
  status() {
    return this.ai.status();
  }

  /** Guard'lar tartibi muhim: avval AuthGuard (req.user), keyin foydalanuvchi bo'yicha limit */
  @Post('chat')
  @HttpCode(200)
  @UseGuards(AuthGuard, AiRateLimit)
  chat(@CurrentUser() user: Doc, @Body(new ZodPipe(chatSchema)) body: ChatDto) {
    return this.ai.chat(user, body);
  }
}
