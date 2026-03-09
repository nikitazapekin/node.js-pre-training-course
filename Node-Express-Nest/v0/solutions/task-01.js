 
const express = require('express');
const app = express();
 
let todos = [
  { id: 1, title: 'Buy milk', completed: false }
];

 
app.get('/todos', (req, res) => {
  res.json(todos);
});

module.exports = app;
