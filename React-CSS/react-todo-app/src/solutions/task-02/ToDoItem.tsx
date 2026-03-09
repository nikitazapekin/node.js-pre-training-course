import React from 'react';
import { TodoItemProps } from '../../types';

export const ToDoItem: React.FC<TodoItemProps> = ({ todo }) => {
  return (
    <div>
      <span>{todo.title}</span>
      <span>{todo.completed ? 'completed' : 'not completed'}</span>
    </div>
  );
};
