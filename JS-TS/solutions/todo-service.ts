import { TodoApi } from './todo-api';
import { Todo, TodoStatus } from './types';

export class TodoService {
  constructor(private readonly api: TodoApi) {}

  async create(title: string, description = ''): Promise<Todo> {
   
    if (!title || title.trim().length === 0) {
      throw new Error('Title is required and cannot be empty');
    }
    
    if (title.length > 200) {
      throw new Error('Title cannot exceed 200 characters');
    }
    
    if (description && description.length > 1000) {
      throw new Error('Description cannot exceed 1000 characters');
    }

    try {
      
      const todo = await this.api.add({
        title: title.trim(),
        description: description.trim() || undefined,
        status: TodoStatus.PENDING
      });
      
      return todo;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create todo: ${error.message}`);
      }
      throw new Error('Failed to create todo: Unknown error');
    }
  }

  async toggleStatus(id: number): Promise<Todo> {
    
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid todo ID: must be a positive integer');
    }

    try {
      
      const todos = await this.api.getAll();
      const todo = todos.find(t => t.id === id);

      if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
      }
 
      const newStatus = todo.status === TodoStatus.COMPLETED
        ? TodoStatus.PENDING
        : TodoStatus.COMPLETED;
 
      const updatedTodo = await this.api.update(id, { status: newStatus });
      return updatedTodo;
    } catch (error) {
      if (error instanceof Error) {
        
        if (error.message.includes('not found')) {
          throw error;
        }
        throw new Error(`Failed to toggle todo status: ${error.message}`);
      }
      throw new Error('Failed to toggle todo status: Unknown error');
    }
  }

  async search(keyword: string): Promise<Todo[]> {
  
    if (!keyword || keyword.trim().length === 0) {
      return [];
    }

    try {
    
      const todos = await this.api.getAll();
      const searchTerm = keyword.toLowerCase().trim();
 
      return todos.filter(todo => {
        const titleMatch = todo.title.toLowerCase().includes(searchTerm);
        const descriptionMatch = todo.description?.toLowerCase().includes(searchTerm) ?? false;
        return titleMatch || descriptionMatch;
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search todos: ${error.message}`);
      }
      throw new Error('Failed to search todos: Unknown error');
    }
  }
 
  private async findTodoById(id: number): Promise<Todo | undefined> {
    try {
      const todos = await this.api.getAll();
      return todos.find(todo => todo.id === id);
    } catch {
      return undefined;
    }
  }
}
