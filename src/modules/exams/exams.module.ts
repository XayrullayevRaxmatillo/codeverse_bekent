import { Module } from '@nestjs/common';
import { CoursesModule } from '../courses/courses.module';
import { RewardsModule } from '../rewards/rewards.module';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';

@Module({ imports: [CoursesModule, RewardsModule], controllers: [ExamsController], providers: [ExamsService] })
export class ExamsModule {}
