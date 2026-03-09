import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { UserService } from '../user/user.service';

export interface AuditLog {
  id: number;
  action: string;
  userId: number;
  timestamp: Date;
}

@Injectable()
export class AuditService {
  private logs: AuditLog[] = [];

  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
  ) {
    this.logger.log('AuditService initialized (depends on UserService)');
  }

  logAction(action: string, userId: number): AuditLog {
    this.logger.log(`AuditService.logAction: ${action} for user ${userId}`);
    
    const user = this.userService.findById(userId);
    if (!user) {
      this.logger.error(`AuditService: User ${userId} not found`);
      throw new Error(`User ${userId} not found`);
    }
    this.logger.log(`AuditService: Verified user ${user.name}`);

    const log: AuditLog = {
      id: this.logs.length + 1,
      action,
      userId,
      timestamp: new Date(),
    };
    this.logs.push(log);
    return log;
  }

  getLogs(): AuditLog[] {
    this.logger.log('AuditService.getLogs called');
    return this.logs;
  }

  getLogsByUser(userId: number): AuditLog[] {
    this.logger.log(`AuditService.getLogsByUser: ${userId}`);
    return this.logs.filter(l => l.userId === userId);
  }
}
