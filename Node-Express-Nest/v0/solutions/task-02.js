 
const express = require('express');
const app = express();

app.use(express.json());
 
let todos = [
  { id: 1, title: 'Buy milk', completed: false }
];
 
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

module.exports = app;
