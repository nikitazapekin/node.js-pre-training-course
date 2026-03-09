 
const express = require('express');
const TodoService = require('./todoService');
const { createRoutes } = require('./routes');
const {
  loggerMiddleware,
  timerMiddleware,
  customHeaderInjectorMiddleware,
  requestLoggingMiddleware,
  metricsTrackingMiddleware,
  sequenceLoggerMiddleware
} = require('./middlewares');
const { errorHandler, notFoundHandler } = require('./errorHandler');
 
const PORT = process.env.PORT || 3000;
 
const app = express();
 
const todoService = new TodoService();
 
app.use(express.json());
 
console.log(' Registering Task 1 Middlewares (Logger, Timer, Custom Headers)');

app.use(loggerMiddleware);          
app.use(timerMiddleware);          
app.use(customHeaderInjectorMiddleware);  
app.use(sequenceLoggerMiddleware);   
 
console.log(' Registering Task 5 Middlewares (Request Logging, Metrics) ');

app.use(requestLoggingMiddleware);    
app.use(metricsTrackingMiddleware);  
 
console.log('  Registering Routes (Task 2: Users, Task 4: Todos) ');

app.use(createRoutes(todoService));
 
console.log('  Registering Error Handlers (Task 3)...\n');
 
app.use(notFoundHandler);
 
app.use(errorHandler);
 
app.listen(PORT, () => {
 
  console.log(' Express Todo App is running!');
 
  console.log(`  Server: http://localhost:${PORT}\n`);
  
  console.log(' Available Endpoints:\n');
  
  console.log('  Task 1 - Middleware Playground:');
  console.log('    Any request will show logger, timer, and header injection\n');
  
  console.log('  Task 2 - Params and Queries:');
  console.log('    GET /users/:id?active=true|false');
  console.log('    Example: GET /users/42?active=true\n');
  
  console.log('  Task 3 - Error Handling:');
  console.log('    Any invalid route triggers 404 handler');
  console.log('    Validation errors return { status, message, timestamp }\n');
  
  console.log('  Task 4 - ToDo REST API:');
  console.log('    GET    /todos          - Get all todos');
  console.log('    GET    /todos/:id      - Get todo by ID');
  console.log('    POST   /todos          - Create new todo');
  console.log('    PUT    /todos/:id      - Update todo');
  console.log('    DELETE /todos/:id      - Delete todo\n');
  
  console.log('  Task 5 - Metrics:');
  console.log('    GET /metrics - View request stats\n');
   
  console.log('Press Ctrl+C to stop the server\n');
});

module.exports = app;
