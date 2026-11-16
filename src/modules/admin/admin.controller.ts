import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminGuard, AuthGuard } from '../../common/guards/auth.guard';
import { ObjectIdPipe, ZodPipe } from '../../common/pipes/zod-validation.pipe';
import { sid } from '../../common/utils/serialize';
import type { Doc } from '../../database/schemas';
import * as S from './admin.schemas';
import { AdminService } from './admin.service';

/** /api/admin — faqat admin. Kontent CRUD, foydalanuvchilar, statistika, shikoyatlar */
@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('stats')
  stats() {
    return this.admin.stats();
  }

  // ---- Foydalanuvchilar ----
  @Get('users')
  users(@Query(new ZodPipe(S.usersQuery)) q) {
    return this.admin.listUsers(q.q, q.page);
  }

  @Patch('users/:id')
  updateUser(@Param('id', ObjectIdPipe) id: string, @Body(new ZodPipe(S.userPatch)) body, @CurrentUser() me: Doc) {
    return this.admin.updateUser(id, sid(me), body);
  }

  // ---- Kurslar ----
  @Get('courses')
  courses() {
    return this.admin.listCourses();
  }

  @Post('courses')
  createCourse(@Body(new ZodPipe(S.courseBody)) body) {
    return this.admin.createCourse(body);
  }

  @Patch('courses/:id')
  updateCourse(@Param('id', ObjectIdPipe) id: string, @Body(new ZodPipe(S.coursePatch)) body) {
    return this.admin.updateCourse(id, body);
  }

  @Delete('courses/:id')
  deleteCourse(@Param('id', ObjectIdPipe) id: string) {
    return this.admin.deleteCourse(id);
  }

  // ---- Modullar ----
  @Get('modules')
  modules(@Query(new ZodPipe(S.modulesQuery)) q) {
    return this.admin.listModules(q.course);
  }

  @Post('modules')
  createModule(@Body(new ZodPipe(S.moduleBody)) body) {
    return this.admin.createModule(body);
  }

  @Patch('modules/:id')
  updateModule(@Param('id', ObjectIdPipe) id: string, @Body(new ZodPipe(S.modulePatch)) body) {
    return this.admin.updateModule(id, body);
  }

  @Delete('modules/:id')
  deleteModule(@Param('id', ObjectIdPipe) id: string) {
    return this.admin.deleteModule(id);
  }

  // ---- Darslar ----
  @Get('lessons/:id')
  lesson(@Param('id', ObjectIdPipe) id: string) {
    return this.admin.getLesson(id);
  }

  @Post('lessons')
  createLesson(@Body(new ZodPipe(S.lessonBody)) body) {
    return this.admin.createLesson(body);
  }

  @Patch('lessons/:id')
  updateLesson(@Param('id', ObjectIdPipe) id: string, @Body(new ZodPipe(S.lessonPatch)) body) {
    return this.admin.updateLesson(id, body);
  }

  @Delete('lessons/:id')
  deleteLesson(@Param('id', ObjectIdPipe) id: string) {
    return this.admin.deleteLesson(id);
  }

  // ---- Topshiriqlar ----
  @Get('challenges')
  challenges(@Query(new ZodPipe(S.challengesQuery)) q) {
    return this.admin.listChallenges(q.kind);
  }

  @Post('challenges')
  createChallenge(@Body(new ZodPipe(S.challengeBody)) body) {
    return this.admin.createChallenge(body);
  }

  @Patch('challenges/:id')
  updateChallenge(@Param('id', ObjectIdPipe) id: string, @Body(new ZodPipe(S.challengePatch)) body) {
    return this.admin.updateChallenge(id, body);
  }

  @Delete('challenges/:id')
  deleteChallenge(@Param('id', ObjectIdPipe) id: string) {
    return this.admin.deleteChallenge(id);
  }

  // ---- Savollar ----
  @Get('questions')
  questions(@Query(new ZodPipe(S.questionsQuery)) q) {
    return this.admin.listQuestions(q.lesson, q.module);
  }

  @Post('questions')
  createQuestion(@Body(new ZodPipe(S.questionBody)) body) {
    return this.admin.createQuestion(body);
  }

  @Patch('questions/:id')
  updateQuestion(@Param('id', ObjectIdPipe) id: string, @Body(new ZodPipe(S.questionBody)) body) {
    return this.admin.updateQuestion(id, body);
  }

  @Delete('questions/:id')
  deleteQuestion(@Param('id', ObjectIdPipe) id: string) {
    return this.admin.deleteQuestion(id);
  }

  // ---- Yutuqlar ----
  @Get('achievements')
  achievements() {
    return this.admin.listAchievements();
  }

  @Post('achievements')
  createAchievement(@Body(new ZodPipe(S.achievementBody)) body) {
    return this.admin.createAchievement(body);
  }

  @Patch('achievements/:id')
  updateAchievement(@Param('id', ObjectIdPipe) id: string, @Body(new ZodPipe(S.achievementPatch)) body) {
    return this.admin.updateAchievement(id, body);
  }

  @Delete('achievements/:id')
  deleteAchievement(@Param('id', ObjectIdPipe) id: string) {
    return this.admin.deleteAchievement(id);
  }

  // ---- Shikoyatlar ----
  @Get('reports')
  reports(@Query(new ZodPipe(S.reportsQuery)) q) {
    return this.admin.listReports(q.status);
  }

  @Patch('reports/:id')
  updateReport(@Param('id', ObjectIdPipe) id: string, @Body(new ZodPipe(S.reportPatch)) body) {
    return this.admin.updateReport(id, body);
  }
}
