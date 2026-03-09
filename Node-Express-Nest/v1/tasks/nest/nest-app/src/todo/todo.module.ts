import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoEntity } from '../entities/todo.entity';
import { TodoOrmService } from './todo-orm.service';
import { TodoOrmController } from './todo-orm.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  controllers: [TodoController, TodoOrmController],
  providers: [TodoService, TodoOrmService],
})
export class TodoModule {}
