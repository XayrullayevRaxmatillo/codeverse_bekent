import { Body, Controller, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ZodPipe } from '../../common/pipes/zod-validation.pipe';
import type { Doc } from '../../database/schemas';
import { codeShape } from '../lessons/lessons.schemas';
import { ChallengesService } from './challenges.service';

const listQuery = z.object({ kind: z.enum(['project', 'practice']).default('project') });
const submitBody = z.object({ code: codeShape, passed: z.literal(true) });

@Controller('challenges')
@UseGuards(AuthGuard)
export class ChallengesController {
  constructor(private readonly challenges: ChallengesService) {}

  @Get()
  list(@Query(new ZodPipe(listQuery)) query, @CurrentUser() user: Doc) {
    return this.challenges.list(query.kind, user);
  }

  @Get(':id')
  get(@Param('id') id: string, @CurrentUser() user: Doc) {
    return this.challenges.get(id, user);
  }

  @Post(':id/submit')
  @HttpCode(200)
  submit(@Param('id') id: string, @CurrentUser() user: Doc, @Body(new ZodPipe(submitBody)) body) {
    return this.challenges.submit(id, user, body.code);
  }

  @Put(':id/code')
  saveCode(@Param('id') id: string, @CurrentUser() user: Doc, @Body(new ZodPipe(codeShape)) body) {
    return this.challenges.saveProjectCode(id, user, body);
  }
}
