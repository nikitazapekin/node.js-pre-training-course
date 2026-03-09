 
const { EventEmitter } = require('events');

class TodoService extends EventEmitter {
  constructor() {
    super();
    this.todos = [];
    this.nextId = 1;
  }

  getAll() {
    this.emit('todosListed', { count: this.todos.length, timestamp: new Date().toISOString() });
    return this.todos;
  }

  getById(id) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) {
      this.emit('todoNotFound', { todoId: id, timestamp: new Date().toISOString(), operation: 'getById' });
      return null;
    }
    this.emit('todoViewed', { todo, timestamp: new Date().toISOString() });
    return todo;
  }

  create(title, completed = false) {
    const todo = {
      id: this.nextId++,
      title: title.trim(),
      completed,
      createdAt: new Date().toISOString()
    };
    this.todos.push(todo);
    this.emit('todoCreated', { todo, timestamp: new Date().toISOString() });
    return todo;
  }

  update(id, updates) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) {
      this.emit('todoNotFound', { todoId: id, timestamp: new Date().toISOString(), operation: 'update' });
      return null;
    }
    
    const changes = [];
    if (updates.title !== undefined) {
      todo.title = updates.title.trim();
      changes.push('title');
    }
    if (updates.completed !== undefined) {
      todo.completed = updates.completed;
      changes.push('completed');
    }
    todo.updatedAt = new Date().toISOString();
    
    this.emit('todoUpdated', { 
      newTodo: todo, 
      changes, 
      timestamp: new Date().toISOString() 
    });
    return todo;
  }

  delete(id) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      this.emit('todoNotFound', { todoId: id, timestamp: new Date().toISOString(), operation: 'delete' });
      return null;
    }
    
    const deleted = this.todos.splice(index, 1)[0];
    this.emit('todoDeleted', { todo: deleted, timestamp: new Date().toISOString() });
    return deleted;
  }
}

module.exports = TodoService;
