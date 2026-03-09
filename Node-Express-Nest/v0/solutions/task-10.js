
const express = require('express');
const app = express();

let todos = [
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Read book', completed: true }
];

app.get('/todos/search', (req, res) => {
  const { completed } = req.query;
  
  let result = todos;
  
  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    result = todos.filter(todo => todo.completed === isCompleted);
  }
  
  res.json(result);
});


module.exports = app;
