import React from 'react';
import { TodoItemProps } from '../../types';

export const StyledToDoItem: React.FC<TodoItemProps> = ({ todo }) => {
  return (
    <div style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
      <span>{todo.title}</span>
      <span>{todo.completed ? 'completed' : 'not completed'}</span>
    </div>
  );
};
