import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto, TodoResponseDto } from './todo.dto';

export interface ToDo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable()
export class TodoService {
  private todos: ToDo[] = [
    { id: 1, title: 'Buy milk', completed: false },
    { id: 2, title: 'Walk the dog', completed: false },
  ];
  private nextId = 3;

  getTodos(): TodoResponseDto[] {
    return this.todos.map(t => new TodoResponseDto(t.id, t.title, t.completed));
  }

  addTodo(dto: CreateTodoDto): TodoResponseDto {
    const newTodo: ToDo = {
      id: this.nextId++,
      title: dto.title,
      completed: dto.completed ?? false,
    };
    this.todos.push(newTodo);
    return new TodoResponseDto(newTodo.id, newTodo.title, newTodo.completed);
  }

  getById(id: number): TodoResponseDto {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    return new TodoResponseDto(todo.id, todo.title, todo.completed);
  }

  update(id: number, dto: UpdateTodoDto): TodoResponseDto {
    const idx = this.todos.findIndex(t => t.id === id);
    if (idx === -1) throw new NotFoundException(`Todo ${id} not found`);

    const todo = this.todos[idx];
    if (dto.title !== undefined) todo.title = dto.title;
    if (dto.completed !== undefined) todo.completed = dto.completed;

    return new TodoResponseDto(todo.id, todo.title, todo.completed);
  }

  delete(id: number): boolean {
    const idx = this.todos.findIndex(t => t.id === id);
    if (idx === -1) throw new NotFoundException(`Todo ${id} not found`);
    this.todos.splice(idx, 1);
    return true;
  }

  markCompleted(id: number): TodoResponseDto {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    todo.completed = true;
    return new TodoResponseDto(todo.id, todo.title, todo.completed);
  }

  search(query: { completed?: boolean; title?: string }): TodoResponseDto[] {
    return this.todos
      .filter(t => {
        if (query.completed !== undefined && t.completed !== query.completed) return false;
        if (query.title && !t.title.toLowerCase().includes(query.title.toLowerCase())) return false;
        return true;
      })
      .map(t => new TodoResponseDto(t.id, t.title, t.completed));
  }
}
