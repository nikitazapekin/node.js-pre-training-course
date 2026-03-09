import {
  Controller, Get, Post, Body, Param, Query, Put, Delete,
  HttpCode, HttpStatus, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { TodoOrmService } from './todo-orm.service';
import { CreateTodoDto, UpdateTodoDto } from './todo.dto';

@Controller('todos-orm')
export class TodoOrmController {
  constructor(private readonly service: TodoOrmService) {}

  @Get()
  getAll() { return this.service.getAll(); }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() dto: CreateTodoDto) { return this.service.create(dto); }

  @Get(':id')
  getById(@Param('id') id: string) { return this.service.getById(Number(id)); }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) { return this.service.delete(Number(id)); }

  @Post(':id/complete')
  markCompleted(@Param('id') id: string) { return this.service.markCompleted(Number(id)); }

  @Get('search')
  search(@Query() query: { completed?: string; title?: string }) {
    const filters: { completed?: boolean; title?: string } = {};
    if (query.completed !== undefined) filters.completed = query.completed === 'true';
    if (query.title) filters.title = query.title;
    return this.service.search(filters);
  }
}
