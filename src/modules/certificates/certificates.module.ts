import { Module } from '@nestjs/common';
import { CoursesModule } from '../courses/courses.module';
import { CertificatesController } from './certificates.controller';

@Module({ imports: [CoursesModule], controllers: [CertificatesController] })
export class CertificatesModule {}
