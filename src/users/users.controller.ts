import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtCookieGuard } from '../common/guards/jwt-cookie.guard';

@Controller('users')
@UseGuards(JwtCookieGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Param('id') id: string) {
    // In a real app, get user ID from JWT payload
    return { message: 'User profile endpoint' };
  }
}
