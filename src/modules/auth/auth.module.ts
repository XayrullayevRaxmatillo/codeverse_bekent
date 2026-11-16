import { Global, Module } from '@nestjs/common';
import { AdminGuard, AuthGuard, OptionalAuthGuard } from '../../common/guards/auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/** @Global — AuthService va guard'lar boshqa modullarda qayta import qilinmasdan ishlatiladi */
@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, OptionalAuthGuard, AdminGuard],
  exports: [AuthService, AuthGuard, OptionalAuthGuard, AdminGuard],
})
export class AuthModule {}
