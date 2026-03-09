import { TodoService } from './todo-service';
import { TodoApi } from './todo-api';
import { InMemoryRepository } from './repository';
import { Todo } from './types';

export class ToDoManager {
  private repository: InMemoryRepository<Todo>;
  private api: TodoApi;
  private service: TodoService;

  constructor() {
    this.repository = new InMemoryRepository<Todo>();
    this.api = new TodoApi(this.repository);
    this.service = new TodoService(this.api);
  }

  async init(): Promise<void> {
    await this.service.create('Demo Task 1', 'This is a demo task description');
    await this.service.create('Demo Task 2', 'Another demo task');
    await this.service.create('Demo Task 3');
  }

  async add(title: string, description = ''): Promise<void> {
    await this.service.create(title, description);
  }

  async complete(id: number): Promise<void> {
    await this.service.toggleStatus(id);
  }

  async list(): Promise<Todo[]> {
    return this.api.getAll();
  }
}
