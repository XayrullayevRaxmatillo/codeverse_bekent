import { Module } from '@nestjs/common';
import { CourseProgressService } from './course-progress.service';
import { CoursesController } from './courses.controller';

@Module({
  controllers: [CoursesController],
  providers: [CourseProgressService],
  exports: [CourseProgressService],
})
export class CoursesModule {}
