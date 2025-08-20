import { Body, Controller, Get, Post, Res, UseGuards, Req, HttpCode, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import type { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtCookieGuard } from '../common/guards/jwt-cookie.guard';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@ApiCookieAuth('access_token')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.usersService.createUser({ email: dto.email, password: dto.password, name: dto.name });
    const token = await this.sign(user.id, user.email);
    this.setAuthCookie(res, token);
    return { user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.usersService.validateUser(dto.email, dto.password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = await this.sign(user.id, user.email);
    this.setAuthCookie(res, token);
    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', this.cookieOptions());
    return { ok: true };
  }

  @UseGuards(JwtCookieGuard)
  @Get('me')
  me(@Req() req: Request) {
    // @ts-expect-error injected by guard
    const payload = req.user as any;
    return { userId: payload?.sub, email: payload?.email };
  }

  private async sign(userId: string, email: string) {
    const payload = { sub: userId, email };
    const secret = process.env.JWT_SECRET ?? 'dev-secret';
    return this.jwtService.signAsync(payload, { secret, expiresIn: '1h' });
  }

  private setAuthCookie(res: Response, token: string) {
    res.cookie('access_token', token, this.cookieOptions());
  }

  private cookieOptions() {
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
      path: '/',
    };
  }
}


