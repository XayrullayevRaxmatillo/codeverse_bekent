import { Module } from '@nestjs/common';
import { CoursesModule } from '../courses/courses.module';
import { RewardsModule } from '../rewards/rewards.module';
import { LessonsController, ProgressController, PublicLessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  imports: [CoursesModule, RewardsModule],
  controllers: [LessonsController, PublicLessonsController, ProgressController],
  providers: [LessonsService],
})
export class LessonsModule {}
