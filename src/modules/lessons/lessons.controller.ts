import { Body, Controller, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthGuard, OptionalAuthGuard } from '../../common/guards/auth.guard';
import { ZodPipe } from '../../common/pipes/zod-validation.pipe';
import type { Doc } from '../../database/schemas';
import { answersShape, codeShape, importGuestSchema } from './lessons.schemas';
import { LessonsService } from './lessons.service';

/** /api/lessons — ro'yxatdan o'tgan foydalanuvchi darslari */
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessons: LessonsService) {}

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  open(@Param('id') id: string, @CurrentUser() user?: Doc) {
    return this.lessons.open(id, user);
  }

  @Post(':id/quiz')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  quiz(@Param('id') id: string, @CurrentUser() user: Doc, @Body(new ZodPipe(answersShape)) body) {
    return this.lessons.submitQuiz(id, user, body.answers);
  }

  @Post(':id/complete')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  complete(@Param('id') id: string, @CurrentUser() user: Doc) {
    return this.lessons.complete(id, user);
  }

  @Put(':id/code')
  @UseGuards(AuthGuard)
  saveCode(@Param('id') id: string, @CurrentUser() user: Doc, @Body(new ZodPipe(codeShape)) body) {
    return this.lessons.saveCode(id, user, body);
  }
}

/** /api/public — mehmon (ro'yxatdan o'tmagan) uchun ochiq darslar */
@Controller('public')
export class PublicLessonsController {
  constructor(private readonly lessons: LessonsService) {}

  @Get('guest-lessons')
  guestLessons() {
    return this.lessons.guestLessons();
  }

  @Get('lessons/:id')
  guestLesson(@Param('id') id: string) {
    return this.lessons.guestLesson(id);
  }

  @Post('lessons/:id/quiz')
  @HttpCode(200)
  guestQuiz(@Param('id') id: string, @Body(new ZodPipe(answersShape)) body) {
    return this.lessons.guestQuiz(id, body.answers);
  }
}

/** /api/progress — mehmon progressini import qilish va kod ishga tushirish hisobi */
@Controller('progress')
@UseGuards(AuthGuard)
export class ProgressController {
  constructor(private readonly lessons: LessonsService) {}

  @Post('import-guest')
  @HttpCode(200)
  importGuest(@CurrentUser() user: Doc, @Body(new ZodPipe(importGuestSchema)) body) {
    return this.lessons.importGuest(user, body.lessonIds);
  }

  @Post('run')
  @HttpCode(200)
  run(@CurrentUser() user: Doc) {
    return this.lessons.codeRun(user);
  }
}
