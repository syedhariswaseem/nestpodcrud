import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtCookieGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();    
    const token: string | undefined = req.cookies?.['access_token'];

    console.log('tokenee', token)
    if (!token) {
      throw new UnauthorizedException('Missing auth cookie');
    }
    try {
      const secret = process.env.JWT_SECRET ?? 'dev-secret';
      const payload = await this.jwtService.verifyAsync(token, { secret });
      console.log('payload', payload)
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid auth cookie');
    }
  }
}


