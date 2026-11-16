import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DatabaseModule } from './database/database.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ExamsModule } from './modules/exams/exams.module';
import { HealthModule } from './modules/health/health.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { MailModule } from './modules/mail/mail.module';
import { PlayModule } from './modules/play/play.module';
import { ReportsModule } from './modules/reports/reports.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // infratuzilma
    DatabaseModule,
    MailModule,
    AuthModule,
    RewardsModule,
    // funksional modullar
    HealthModule,
    CoursesModule,
    LessonsModule,
    ExamsModule,
    ChallengesModule,
    PlayModule,
    UsersModule,
    LeaderboardModule,
    AchievementsModule,
    CertificatesModule,
    AiModule,
    ReportsModule,
    AdminModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}
