import React from 'react';
import { TodoListProps } from '../../types';

export const ToDoList: React.FC<TodoListProps> = ({ todos }) => {
  if (todos.length === 0) {
    return <p>No todos</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.title} - {todo.completed ? 'completed' : 'not completed'}
        </li>
      ))}
    </ul>
  );
};