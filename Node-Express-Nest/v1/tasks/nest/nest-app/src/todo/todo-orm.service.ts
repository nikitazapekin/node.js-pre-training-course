import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from '../entities/todo.entity';
import { CreateTodoDto, UpdateTodoDto, TodoResponseDto } from './todo.dto';

@Injectable()
export class TodoOrmService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly repo: Repository<TodoEntity>,
  ) {}

  async getAll(): Promise<TodoResponseDto[]> {
    const todos = await this.repo.find();
    return todos.map(t => new TodoResponseDto(t.id, t.title, t.completed));
  }

  async create(dto: CreateTodoDto): Promise<TodoResponseDto> {
    const todo = this.repo.create({ title: dto.title, completed: dto.completed ?? false });
    const saved = await this.repo.save(todo);
    return new TodoResponseDto(saved.id, saved.title, saved.completed);
  }

  async getById(id: number): Promise<TodoResponseDto> {
    const todo = await this.repo.findOne({ where: { id } });
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    return new TodoResponseDto(todo.id, todo.title, todo.completed);
  }

  async update(id: number, dto: UpdateTodoDto): Promise<TodoResponseDto> {
    const todo = await this.repo.preload({ id, ...dto });
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    const saved = await this.repo.save(todo);
    return new TodoResponseDto(saved.id, saved.title, saved.completed);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Todo ${id} not found`);
  }

  async markCompleted(id: number): Promise<TodoResponseDto> {
    const todo = await this.getById(id);
    await this.repo.update(id, { completed: true });
    return new TodoResponseDto(id, todo.title, true);
  }

  async search(query: { completed?: boolean; title?: string }): Promise<TodoResponseDto[]> {
    const todos = await this.repo.find({ where: query as any });
    return todos.map(t => new TodoResponseDto(t.id, t.title, t.completed));
  }
}
