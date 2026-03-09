 
const express = require('express');
const { getMetrics } = require('./middlewares');
const { createValidationError, createNotFoundError } = require('./errorHandler');

function createRoutes(todoService) {
  const router = express.Router();
 
  router.get('/users/:id', (req, res, next) => {
    const { id } = req.params;
    const { active } = req.query;
 
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      return next(createValidationError(`User id must be a number, got: ${id}`));
    }
 
    if (active !== undefined && active !== 'true' && active !== 'false') {
      return next(createValidationError(`active query must be "true" or "false", got: ${active}`));
    }
 
    const isActive = active === 'true';
    const statusMessage = isActive ? 'active' : 'inactive';
     
    if (active === undefined) {
      return res.json({
        success: true,
        message: `User ${parsedId} status not specified`,
        userId: parsedId,
        queryActive: active
      });
    }

    res.json({
      success: true,
      message: `User ${parsedId} is ${statusMessage}`,
      userId: parsedId,
      isActive: isActive
    });
  });
 
  router.get('/todos', (req, res) => {
    const todos = todoService.getAll();
    res.json({ success: true, data: todos });
  });
 
  router.get('/todos/:id', (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return next(createValidationError('Todo id must be a number'));
    }

    const todo = todoService.getById(id);
    
    if (!todo) {
      return next(createNotFoundError(`Todo with id ${id} not found`));
    }

    res.json({ success: true, data: todo });
  });
 
  router.post('/todos', (req, res, next) => {
    const { title, completed } = req.body;
 
    if (!title) {
      return next(createValidationError('Title is required'));
    }

    if (typeof title !== 'string') {
      return next(createValidationError('Title must be a string'));
    }

    if (title.trim().length === 0) {
      return next(createValidationError('Title cannot be empty'));
    }

    const todo = todoService.create(title, completed || false);
    res.status(201).json({ success: true, data: todo });
  });
 
  router.put('/todos/:id', (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return next(createValidationError('Todo id must be a number'));
    }

    const { title, completed } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== 'string') {
        return next(createValidationError('Title must be a string'));
      }
      if (title.trim().length === 0) {
        return next(createValidationError('Title cannot be empty'));
      }
      updates.title = title;
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return next(createValidationError('Completed must be a boolean'));
      }
      updates.completed = completed;
    }

    const todo = todoService.update(id, updates);
    
    if (!todo) {
      return next(createNotFoundError(`Todo with id ${id} not found`));
    }

    res.json({ success: true, data: todo });
  });
 
  router.delete('/todos/:id', (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return next(createValidationError('Todo id must be a number'));
    }

    const todo = todoService.delete(id);
    
    if (!todo) {
      return next(createNotFoundError(`Todo with id ${id} not found`));
    }

    res.json({ success: true, message: 'Todo deleted successfully', data: todo });
  });
 
  router.get('/metrics', (req, res) => {
    const metrics = getMetrics();
    res.json({ success: true, data: metrics });
  });

  return router;
}

module.exports = { createRoutes };
