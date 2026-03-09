import { Controller, Get, Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ParseIntPipe } from '../pipes/parse-int.pipe';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { LoggerService } from '../logger/logger.service';

@Controller('lifecycle')
@UseInterceptors(LoggingInterceptor)
export class LifecycleController {
  constructor(private readonly logger: LoggerService) {}

  @Get('demo')
  demo(@Query('name') name: string) {
    this.logger.log('[HANDLER] LifecycleController.demo');
    return { message: `Hello ${name || 'World'}!`, timestamp: new Date().toISOString() };
  }

  @Get('protected')
  @UseGuards(AuthGuard)
  protectedRoute() {
    this.logger.log('[HANDLER] LifecycleController.protectedRoute');
    return { message: 'Protected route accessed!', timestamp: new Date().toISOString() };
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  getUser(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`[HANDLER] LifecycleController.getUser: ${id}`);
    return { userId: id, name: `User ${id}`, timestamp: new Date().toISOString() };
  }
}
