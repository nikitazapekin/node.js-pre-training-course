 
import { InMemoryRepository } from './repository';
import { Todo, NewTodo, TodoStatus } from './types';

export class TodoNotFoundError extends Error {
  constructor(id: number) {
    super(`Todo with id ${id} not found`);
    this.name = 'TodoNotFoundError';
  }
}
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const randomDelay = (): number => {
  return Math.floor(Math.random() * 300) + 300;
};

export class TodoApi {
  private repo: InMemoryRepository<Todo>;
  private nextId = 1;

  constructor(repo?: InMemoryRepository<Todo>) {
    this.repo = repo ?? new InMemoryRepository<Todo>();
  }

  async getAll(): Promise<Todo[]> {
    try {
      await delay(randomDelay());

      return this.repo.findAll();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch todos: ${error.message}`);
      }
      throw new Error('Failed to fetch todos: Unknown error');
    }
  }

  async add(newTodo: NewTodo): Promise<Todo> {
    try {
      await delay(randomDelay());

      const todo: Todo = {
        id: this.nextId++,
        title: newTodo.title,
        description: newTodo.description,
        status: newTodo.status ?? TodoStatus.PENDING,
        createdAt: new Date()
      };

      return this.repo.add(todo);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to add todo: ${error.message}`);
      }
      throw new Error('Failed to add todo: Unknown error');
    }
  }

  async update(
    id: number,
    update: Partial<Omit<Todo, 'id' | 'createdAt'>>
  ): Promise<Todo> {
    try {
      await delay(randomDelay());

      return this.repo.update(id, update);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update todo: ${error.message}`);
      }
      throw new Error('Failed to update todo: Unknown error');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await delay(randomDelay());

      this.repo.remove(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove todo: ${error.message}`);
      }
      throw new Error('Failed to remove todo: Unknown error');
    }
  }
}