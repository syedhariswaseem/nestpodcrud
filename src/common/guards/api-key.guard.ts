import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const headerValue = request.headers['x-api-key'];
        const expected = process.env.API_KEY ?? 'local-dev-key';

        if (typeof headerValue === 'string' && headerValue === expected) {
            return true;
        }

        throw new UnauthorizedException('Missing or invalid API key');
    }
}


