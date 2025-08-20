import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtCookieGuard } from '../common/guards/jwt-cookie.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      signOptions: { expiresIn: '1m' },
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [JwtCookieGuard],
  exports: [JwtModule, JwtCookieGuard],
})
export class AuthModule {}


