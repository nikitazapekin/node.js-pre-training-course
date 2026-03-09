import {
  Controller, Get, Post, Body, Param, Query, Put, Delete,
  HttpCode, HttpStatus, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto } from './todo.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAll() {
    return this.todoService.getTodos();
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() dto: CreateTodoDto) {
    return this.todoService.addTodo(dto);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.todoService.getById(Number(id));
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.todoService.update(Number(id), dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    this.todoService.delete(Number(id));
  }

  @Post(':id/complete')
  markCompleted(@Param('id') id: string) {
    return this.todoService.markCompleted(Number(id));
  }

  @Get('search')
  search(@Query() query: { completed?: string; title?: string }) {
    const filters: { completed?: boolean; title?: string } = {};
    if (query.completed !== undefined) filters.completed = query.completed === 'true';
    if (query.title) filters.title = query.title;
    return this.todoService.search(filters);
  }
}
