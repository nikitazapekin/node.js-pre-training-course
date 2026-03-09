import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly logger: LoggerService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    this.logger.log('[GUARD] AuthGuard.canActivate executed');
    this.logger.log(`[GUARD] Authorization: ${authHeader ? 'present' : 'missing'}`);

    if (authHeader === 'Bearer valid-token') {
      this.logger.log('[GUARD] Access granted');
      return true;
    }

    this.logger.warn('[GUARD] Access denied');
    throw new ForbiddenException('Invalid or missing token');
  }
}
