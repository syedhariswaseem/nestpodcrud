import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtCookieGuard } from '../common/guards/jwt-cookie.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtCookieGuard],
  exports: [UsersService],
})
export class UsersModule {}
