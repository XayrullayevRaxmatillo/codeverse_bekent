import { Module } from '@nestjs/common';
import { CoursesModule } from '../courses/courses.module';
import { RewardsModule } from '../rewards/rewards.module';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';

@Module({ imports: [CoursesModule, RewardsModule], controllers: [ChallengesController], providers: [ChallengesService] })
export class ChallengesModule {}
