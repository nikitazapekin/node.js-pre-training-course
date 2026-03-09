 
const express = require('express');
const app = express();
 
let todos = [
  { id: 1, title: 'Buy milk', completed: false }
];
 
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find(t => t.id === id);
  
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  res.json(todo);
});

module.exports = app;
