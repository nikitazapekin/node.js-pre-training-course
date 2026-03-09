const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

let todos = [
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Read book', completed: true }
];

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { title, completed } = req.body;
  const newTodo = {
    id: todos.length + 1,
    title: title || 'Untitled',
    completed: completed || false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Search route MUST be before /todos/:id to avoid conflict
app.get('/todos/search', (req, res) => {
  const { completed } = req.query;

  let result = todos;

  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    result = todos.filter(todo => todo.completed === isCompleted);
  }

  res.json(result);
});

app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

const publicPath = path.join(__dirname, 'public');
app.use('/static', express.static(publicPath));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.get('/', (req, res) => {
  res.send('Express ToDo App');
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`);
  });
}

module.exports = app;
