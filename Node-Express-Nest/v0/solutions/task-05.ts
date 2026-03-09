 
import { Controller, Get, Inject } from '@nestjs/common';
import { TodosService } from './task-06';

@Controller('todos')
export class TodosController {
  constructor(
    @Inject('TodosService') private readonly todosService: TodosService,
  ) {}

  @Get()
  getTodos() {
    return this.todosService.getTodos();
  }
}
