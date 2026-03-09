import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    this.logger.log('[INTERCEPTOR] Before handler');
    this.logger.log(`[INTERCEPTOR] ${request.method} ${request.url}`);

    const now = Date.now();
    return next.handle().pipe(
      tap(data => {
        this.logger.log('[INTERCEPTOR] After handler');
        this.logger.log(`[INTERCEPTOR] Response time: ${Date.now() - now}ms`);
        this.logger.log(`[INTERCEPTOR] Response: ${JSON.stringify(data)}`);
      }),
    );
  }
}
