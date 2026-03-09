import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post('log')
  logAction(@Body() body: { action: string; userId: number }) {
    return this.auditService.logAction(body.action, body.userId);
  }

  @Get()
  getAllLogs() {
    return this.auditService.getLogs();
  }

  @Get('user/:userId')
  getUserLogs(@Param('userId') userId: string) {
    return this.auditService.getLogsByUser(Number(userId));
  }
}
