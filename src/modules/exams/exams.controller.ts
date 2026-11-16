import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ZodPipe } from '../../common/pipes/zod-validation.pipe';
import type { Doc } from '../../database/schemas';
import { ExamsService } from './exams.service';

const answersSchema = z.object({ answers: z.record(z.string(), z.unknown()).default({}) });

/** /api/modules/:id/exam */
@Controller('modules')
@UseGuards(AuthGuard)
export class ExamsController {
  constructor(private readonly exams: ExamsService) {}

  @Get(':id/exam')
  get(@Param('id') id: string, @CurrentUser() user: Doc) {
    return this.exams.get(id, user);
  }

  @Post(':id/exam')
  @HttpCode(200)
  submit(@Param('id') id: string, @CurrentUser() user: Doc, @Body(new ZodPipe(answersSchema)) body) {
    return this.exams.submit(id, user, body.answers);
  }
}
