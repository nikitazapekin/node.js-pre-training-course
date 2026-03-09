
import { Injectable } from '@nestjs/common';

export interface ToDo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable()
export class TodosService {
  private todos: ToDo[] = [
    { id: 1, title: 'Buy milk', completed: false }
  ];

  getTodos(): ToDo[] {
    return this.todos;
  }

  addTodo(todo: Omit<ToDo, 'id'>): ToDo {
    const newTodo: ToDo = {
      id: this.todos.length + 1,
      ...todo
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  markCompleted(id: number): ToDo | null {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) {
      return null;
    }
    todo.completed = true;
    return todo;
  }

  getById(id: number): ToDo | undefined {
    return this.todos.find(t => t.id === id);
  }

  searchByQuery(query: { completed?: boolean }): ToDo[] {
    return this.todos.filter(todo => {
      if (query.completed !== undefined) {
        return todo.completed === query.completed;
      }
      return true;
    });
  }
}
