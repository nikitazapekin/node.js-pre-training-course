import { Controller, Get, Post, Body, Param, Query, NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { ToDoDto } from './todo.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAll(): ToDoDto[] {
    return this.todoService.getTodos();
  }

  @Post()
  create(@Body() body: { title: string; completed?: boolean }): ToDoDto {
    return this.todoService.addTodo({
      title: body.title,
      completed: body.completed || false,
    });
  }

  @Get(':id')
  getById(@Param('id') id: string): ToDoDto {
    const todo = this.todoService.getById(+id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  @Get('search')
  search(@Query() query: { completed?: string; title?: string }): ToDoDto[] {
    const filters: { completed?: boolean; title?: string } = {};
    if (query.completed !== undefined) {
      filters.completed = query.completed === 'true';
    }
    if (query.title) {
      filters.title = query.title;
    }
    return this.todoService.searchByQuery(filters);
  }
}
