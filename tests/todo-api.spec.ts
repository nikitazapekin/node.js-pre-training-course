import { TodoApi, TodoNotFoundError } from '../JS-TS/solutions/todo-api';
import { InMemoryRepository } from '../JS-TS/solutions/repository';
import { Todo, TodoStatus, NewTodo } from '../JS-TS/solutions/types';
 
jest.mock('../JS-TS/solutions/repository');
jest.mock('../JS-TS/solutions/todo-api', () => {
  const original = jest.requireActual('../JS-TS/solutions/todo-api');
  return {
    ...original,
    TodoNotFoundError: original.TodoNotFoundError,
  };
});

describe('TodoApi', () => {
  let api: TodoApi;
  let mockRepo: jest.Mocked<InMemoryRepository<Todo>>;

  beforeEach(() => {
    mockRepo = new InMemoryRepository<Todo>() as jest.Mocked<InMemoryRepository<Todo>>;
    (InMemoryRepository as jest.Mock).mockImplementation(() => mockRepo);
    api = new TodoApi();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all todos', async () => {
      const todos: Todo[] = [
        { id: 1, title: 'Test 1', status: TodoStatus.PENDING, createdAt: new Date() },
        { id: 2, title: 'Test 2', status: TodoStatus.COMPLETED, createdAt: new Date() }
      ];
      mockRepo.findAll.mockReturnValue(todos);

      const result = await api.getAll();

      expect(result).toEqual(todos);
      expect(mockRepo.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no todos', async () => {
      mockRepo.findAll.mockReturnValue([]);

      const result = await api.getAll();

      expect(result).toEqual([]);
    });

    it('should wrap errors with descriptive message', async () => {
      mockRepo.findAll.mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(api.getAll()).rejects.toThrow('Failed to fetch todos: Database error');
    });

    it('should handle unknown error types', async () => {
      mockRepo.findAll.mockImplementation(() => {
        throw 'Unknown error';
      });

      await expect(api.getAll()).rejects.toThrow('Failed to fetch todos: Unknown error');
    });
  });

  describe('add', () => {
    it('should create a new todo with auto-generated id', async () => {
      const newTodo: NewTodo = { title: 'Test Todo', description: 'Test description' };
      const createdTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        description: 'Test description',
        status: TodoStatus.PENDING,
        createdAt: expect.any(Date)
      };

      mockRepo.add.mockReturnValue(createdTodo);

      const result = await api.add(newTodo);

      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Todo');
      expect(result.status).toBe(TodoStatus.PENDING);
      expect(mockRepo.add).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Todo',
        description: 'Test description',
        status: TodoStatus.PENDING
      }));
    });

    it('should use default status PENDING when not provided', async () => {
      const newTodo: NewTodo = { title: 'Test' };
      const createdTodo: Todo = {
        id: 1,
        title: 'Test',
        status: TodoStatus.PENDING,
        createdAt: new Date()
      };

      mockRepo.add.mockReturnValue(createdTodo);

      await api.add(newTodo);

      expect(mockRepo.add).toHaveBeenCalledWith(expect.objectContaining({
        status: TodoStatus.PENDING
      }));
    });

    it('should use provided status', async () => {
      const newTodo: NewTodo = { title: 'Test', status: TodoStatus.IN_PROGRESS };
      const createdTodo: Todo = {
        id: 1,
        title: 'Test',
        status: TodoStatus.IN_PROGRESS,
        createdAt: new Date()
      };

      mockRepo.add.mockReturnValue(createdTodo);

      await api.add(newTodo);

      expect(mockRepo.add).toHaveBeenCalledWith(expect.objectContaining({
        status: TodoStatus.IN_PROGRESS
      }));
    });

    it('should increment id for each new todo', async () => {
      const todo1: Todo = { id: 1, title: 'Test 1', status: TodoStatus.PENDING, createdAt: new Date() };
      const todo2: Todo = { id: 2, title: 'Test 2', status: TodoStatus.PENDING, createdAt: new Date() };

      mockRepo.add.mockReturnValueOnce(todo1).mockReturnValueOnce(todo2);

      await api.add({ title: 'Test 1' });
      await api.add({ title: 'Test 2' });

      expect(mockRepo.add).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: 1 }));
      expect(mockRepo.add).toHaveBeenNthCalledWith(2, expect.objectContaining({ id: 2 }));
    });

    it('should wrap errors with descriptive message', async () => {
      mockRepo.add.mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(api.add({ title: 'Test' })).rejects.toThrow('Failed to add todo: Database error');
    });

    it('should handle unknown error types', async () => {
      mockRepo.add.mockImplementation(() => {
        throw 'Unknown error';
      });

      await expect(api.add({ title: 'Test' })).rejects.toThrow('Failed to add todo: Unknown error');
    });
  });

  describe('update', () => {
    it('should update an existing todo', async () => {
      const updatedTodo: Todo = {
        id: 1,
        title: 'Updated',
        status: TodoStatus.COMPLETED,
        createdAt: new Date()
      };

      mockRepo.update.mockReturnValue(updatedTodo);

      const result = await api.update(1, { title: 'Updated', status: TodoStatus.COMPLETED });

      expect(result).toEqual(updatedTodo);
      expect(mockRepo.update).toHaveBeenCalledWith(1, { title: 'Updated', status: TodoStatus.COMPLETED });
    });

    it('should allow partial updates', async () => {
      const updatedTodo: Todo = {
        id: 1,
        title: 'Existing',
        status: TodoStatus.COMPLETED,
        createdAt: new Date()
      };

      mockRepo.update.mockReturnValue(updatedTodo);

      await api.update(1, { status: TodoStatus.COMPLETED });

      expect(mockRepo.update).toHaveBeenCalledWith(1, { status: TodoStatus.COMPLETED });
    });

    it('should wrap errors with descriptive message', async () => {
      mockRepo.update.mockImplementation(() => {
        throw new Error('Not found');
      });

      await expect(api.update(1, { title: 'Test' })).rejects.toThrow('Failed to update todo: Not found');
    });

    it('should handle unknown error types', async () => {
      mockRepo.update.mockImplementation(() => {
        throw 'Unknown error';
      });

      await expect(api.update(1, { title: 'Test' })).rejects.toThrow('Failed to update todo: Unknown error');
    });
  });

  describe('remove', () => {
    it('should remove an existing todo', async () => {
      mockRepo.remove.mockImplementation(() => {});

      await api.remove(1);

      expect(mockRepo.remove).toHaveBeenCalledWith(1);
    });

    it('should wrap errors with descriptive message', async () => {
      mockRepo.remove.mockImplementation(() => {
        throw new Error('Not found');
      });

      await expect(api.remove(1)).rejects.toThrow('Failed to remove todo: Not found');
    });

    it('should handle unknown error types', async () => {
      mockRepo.remove.mockImplementation(() => {
        throw 'Unknown error';
      });

      await expect(api.remove(1)).rejects.toThrow('Failed to remove todo: Unknown error');
    });
  });

  describe('TodoNotFoundError', () => {
    it('should create error with correct message', () => {
      const error = new TodoNotFoundError(123);

      expect(error.message).toBe('Todo with id 123 not found');
      expect(error.name).toBe('TodoNotFoundError');
    });

    it('should be an instance of Error', () => {
      const error = new TodoNotFoundError(456);

      expect(error).toBeInstanceOf(Error);
    });
  });
});
