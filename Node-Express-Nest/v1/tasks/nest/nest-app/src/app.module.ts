import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger/logger.module';
import { MathModule } from './math/math.module';
import { UserModule } from './user/user.module';
import { AuditModule } from './audit/audit.module';
import { LifecycleModule } from './lifecycle/lifecycle.module';
import { TodoModule } from './todo/todo.module';
import { TodoEntity } from './entities/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'todos.db',
      entities: [TodoEntity],
      synchronize: true,
    }),
    LoggerModule,
    MathModule,
    UserModule,
    AuditModule,
    LifecycleModule,
    TodoModule,
  ],
})
export class AppModule {}
