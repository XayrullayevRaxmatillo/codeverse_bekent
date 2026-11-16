import { Module } from '@nestjs/common';
import { CoursesModule } from '../courses/courses.module';
import { RewardsModule } from '../rewards/rewards.module';
import { PlayController } from './play.controller';
import { PlayService } from './play.service';

@Module({ imports: [CoursesModule, RewardsModule], controllers: [PlayController], providers: [PlayService] })
export class PlayModule {}
