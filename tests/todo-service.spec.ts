import { TodoService } from '../JS-TS/solutions/todo-service';
import { TodoApi } from '../JS-TS/solutions/todo-api';
import { Todo, TodoStatus, NewTodo } from '../JS-TS/solutions/types';
 
jest.mock('../JS-TS/solutions/todo-api');

describe('TodoService', () => {
  let todoService: TodoService;
  let mockApi: jest.Mocked<TodoApi>;

  const mockTodos: Todo[] = [
    {
      id: 1,
      title: 'First Todo',
      description: 'First description',
      status: TodoStatus.PENDING,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      title: 'Second Todo',
      description: 'Second description',
      status: TodoStatus.COMPLETED,
      createdAt: new Date('2024-01-02')
    },
    {
      id: 3,
      title: 'In Progress Task',
      description: 'Working on it',
      status: TodoStatus.IN_PROGRESS,
      createdAt: new Date('2024-01-03')
    }
  ];

  beforeEach(() => {
    
    mockApi = new TodoApi() as jest.Mocked<TodoApi>;
    todoService = new TodoService(mockApi);
 
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a todo with title and description', async () => {
      const newTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        description: 'Test description',
        status: TodoStatus.PENDING,
        createdAt: new Date()
      };

      mockApi.add.mockResolvedValue(newTodo);

      const result = await todoService.create('Test Todo', 'Test description');

      expect(result).toEqual(newTodo);
      expect(mockApi.add).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test description',
        status: TodoStatus.PENDING
      });
    });

    it('should successfully create a todo with only title (description defaults to empty)', async () => {
      const newTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        description: undefined,
        status: TodoStatus.PENDING,
        createdAt: new Date()
      };

      mockApi.add.mockResolvedValue(newTodo);

      const result = await todoService.create('Test Todo');

      expect(result).toEqual(newTodo);
      expect(mockApi.add).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: undefined,
        status: TodoStatus.PENDING
      });
    });

    it('should trim whitespace from title and description', async () => {
      const newTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        description: 'Test description',
        status: TodoStatus.PENDING,
        createdAt: new Date()
      };

      mockApi.add.mockResolvedValue(newTodo);

      await todoService.create('  Test Todo  ', '  Test description  ');

      expect(mockApi.add).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test description',
        status: TodoStatus.PENDING
      });
    });

    it('should throw error when title is empty', async () => {
      await expect(todoService.create('')).rejects.toThrow(
        'Title is required and cannot be empty'
      );
      expect(mockApi.add).not.toHaveBeenCalled();
    });

    it('should throw error when title is only whitespace', async () => {
      await expect(todoService.create('   ')).rejects.toThrow(
        'Title is required and cannot be empty'
      );
      expect(mockApi.add).not.toHaveBeenCalled();
    });

    it('should throw error when title exceeds 200 characters', async () => {
      const longTitle = 'a'.repeat(201);
      await expect(todoService.create(longTitle)).rejects.toThrow(
        'Title cannot exceed 200 characters'
      );
      expect(mockApi.add).not.toHaveBeenCalled();
    });

    it('should throw error when description exceeds 1000 characters', async () => {
      const longDescription = 'a'.repeat(1001);
      await expect(todoService.create('Valid Title', longDescription)).rejects.toThrow(
        'Description cannot exceed 1000 characters'
      );
      expect(mockApi.add).not.toHaveBeenCalled();
    });

    it('should wrap API errors with descriptive message', async () => {
      mockApi.add.mockRejectedValue(new Error('API Error'));

      await expect(todoService.create('Test')).rejects.toThrow(
        'Failed to create todo: API Error'
      );
    });

    it('should handle unknown error types', async () => {
      mockApi.add.mockRejectedValue('Unknown error');

      await expect(todoService.create('Test')).rejects.toThrow(
        'Failed to create todo: Unknown error'
      );
    });
  });

  describe('toggleStatus', () => {
    it('should toggle status from PENDING to COMPLETED', async () => {
      const pendingTodo: Todo = {
        id: 1,
        title: 'Test',
        status: TodoStatus.PENDING,
        createdAt: new Date()
      };

      const updatedTodo: Todo = {
        ...pendingTodo,
        status: TodoStatus.COMPLETED
      };

      mockApi.getAll.mockResolvedValue([pendingTodo]);
      mockApi.update.mockResolvedValue(updatedTodo);

      const result = await todoService.toggleStatus(1);

      expect(result.status).toBe(TodoStatus.COMPLETED);
      expect(mockApi.update).toHaveBeenCalledWith(1, { status: TodoStatus.COMPLETED });
    });

    it('should toggle status from COMPLETED to PENDING', async () => {
      const completedTodo: Todo = {
        id: 1,
        title: 'Test',
        status: TodoStatus.COMPLETED,
        createdAt: new Date()
      };

      const updatedTodo: Todo = {
        ...completedTodo,
        status: TodoStatus.PENDING
      };

      mockApi.getAll.mockResolvedValue([completedTodo]);
      mockApi.update.mockResolvedValue(updatedTodo);

      const result = await todoService.toggleStatus(1);

      expect(result.status).toBe(TodoStatus.PENDING);
      expect(mockApi.update).toHaveBeenCalledWith(1, { status: TodoStatus.PENDING });
    });

    it('should toggle status from IN_PROGRESS to COMPLETED', async () => {
      const inProgressTodo: Todo = {
        id: 1,
        title: 'Test',
        status: TodoStatus.IN_PROGRESS,
        createdAt: new Date()
      };

      const updatedTodo: Todo = {
        ...inProgressTodo,
        status: TodoStatus.COMPLETED
      };

      mockApi.getAll.mockResolvedValue([inProgressTodo]);
      mockApi.update.mockResolvedValue(updatedTodo);

      const result = await todoService.toggleStatus(1);

      expect(result.status).toBe(TodoStatus.COMPLETED);
    });

    it('should throw error when todo with id does not exist', async () => {
      mockApi.getAll.mockResolvedValue(mockTodos);

      await expect(todoService.toggleStatus(999)).rejects.toThrow(
        'Todo with id 999 not found'
      );
      expect(mockApi.update).not.toHaveBeenCalled();
    });

    it('should throw error when id is invalid (negative)', async () => {
      await expect(todoService.toggleStatus(-1)).rejects.toThrow(
        'Invalid todo ID: must be a positive integer'
      );
      expect(mockApi.getAll).not.toHaveBeenCalled();
    });

    it('should throw error when id is invalid (zero)', async () => {
      await expect(todoService.toggleStatus(0)).rejects.toThrow(
        'Invalid todo ID: must be a positive integer'
      );
      expect(mockApi.getAll).not.toHaveBeenCalled();
    });

    it('should throw error when id is invalid (non-integer)', async () => {
      await expect(todoService.toggleStatus(1.5)).rejects.toThrow(
        'Invalid todo ID: must be a positive integer'
      );
      expect(mockApi.getAll).not.toHaveBeenCalled();
    });

    it('should wrap API errors from getAll', async () => {
      mockApi.getAll.mockRejectedValue(new Error('API Error'));

      await expect(todoService.toggleStatus(1)).rejects.toThrow(
        'Failed to toggle todo status: API Error'
      );
    });

    it('should propagate not found errors from update', async () => {
      const todo: Todo = mockTodos[0];
      mockApi.getAll.mockResolvedValue([todo]);
      mockApi.update.mockRejectedValue(new Error('Todo with id 1 not found'));

      await expect(todoService.toggleStatus(1)).rejects.toThrow(
        'Todo with id 1 not found'
      );
    });

    it('should wrap generic API errors from update', async () => {
      const todo: Todo = mockTodos[0];
      mockApi.getAll.mockResolvedValue([todo]);
      mockApi.update.mockRejectedValue(new Error('Database connection failed'));

      await expect(todoService.toggleStatus(1)).rejects.toThrow(
        'Failed to toggle todo status: Database connection failed'
      );
    });

    it('should handle unknown error types from update', async () => {
      const todo: Todo = mockTodos[0];
      mockApi.getAll.mockResolvedValue([todo]);
      mockApi.update.mockRejectedValue('Unknown error');

      await expect(todoService.toggleStatus(1)).rejects.toThrow(
        'Failed to toggle todo status: Unknown error'
      );
    });
  });

  describe('search', () => {
    it('should return todos matching by title (case-insensitive)', async () => {
      mockApi.getAll.mockResolvedValue(mockTodos);

      const result = await todoService.search('first');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('First Todo');
    });

    it('should return todos matching by description (case-insensitive)', async () => {
      mockApi.getAll.mockResolvedValue(mockTodos);

      const result = await todoService.search('second');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Second Todo');
    });

    it('should return multiple matching todos', async () => {
      mockApi.getAll.mockResolvedValue(mockTodos);

      const result = await todoService.search('todo');

      expect(result).toHaveLength(2);
    });

    it('should return empty array when no matches found', async () => {
      mockApi.getAll.mockResolvedValue(mockTodos);

      const result = await todoService.search('nonexistent');

      expect(result).toHaveLength(0);
    });

    it('should return empty array when keyword is empty', async () => {
      const result = await todoService.search('');

      expect(result).toHaveLength(0);
      expect(mockApi.getAll).not.toHaveBeenCalled();
    });

    it('should return empty array when keyword is only whitespace', async () => {
      const result = await todoService.search('   ');

      expect(result).toHaveLength(0);
      expect(mockApi.getAll).not.toHaveBeenCalled();
    });

    it('should trim whitespace from search keyword', async () => {
      mockApi.getAll.mockResolvedValue(mockTodos);

      await todoService.search('  first  ');

      expect(mockApi.getAll).toHaveBeenCalled();
    });

    it('should handle case-insensitive search with mixed case', async () => {
      mockApi.getAll.mockResolvedValue(mockTodos);

      const result = await todoService.search('FiRsT');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('First Todo');
    });

    it('should wrap API errors with descriptive message', async () => {
      mockApi.getAll.mockRejectedValue(new Error('API Error'));

      await expect(todoService.search('test')).rejects.toThrow(
        'Failed to search todos: API Error'
      );
    });

    it('should handle unknown error types', async () => {
      mockApi.getAll.mockRejectedValue('Unknown error');

      await expect(todoService.search('test')).rejects.toThrow(
        'Failed to search todos: Unknown error'
      );
    });
  });

  describe('edge cases and integration', () => {
    it('should handle todos without description', async () => {
      const todoWithoutDesc: Todo = {
        id: 1,
        title: 'No Description',
        status: TodoStatus.PENDING,
        createdAt: new Date()
      };

      mockApi.getAll.mockResolvedValue([todoWithoutDesc]);

      const result = await todoService.search('No Description');

      expect(result).toHaveLength(1);
    });

    it('should handle special characters in search', async () => {
      const specialTodo: Todo = {
        id: 1,
        title: 'Test @#$%',
        description: 'Special chars: !@#$%',
        status: TodoStatus.PENDING,
        createdAt: new Date()
      };

      mockApi.getAll.mockResolvedValue([specialTodo]);

      const result = await todoService.search('@#$%');

      expect(result).toHaveLength(1);
    });

    it('should maintain todo order in search results', async () => {
      mockApi.getAll.mockResolvedValue(mockTodos);

      const result = await todoService.search('Todo');

      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
  });
});
