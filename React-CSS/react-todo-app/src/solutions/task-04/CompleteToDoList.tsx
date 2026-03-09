import React, { useState } from 'react';
import { Todo } from '../../types';

export const CompleteToDoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (!inputValue.trim()) return;
    const newTodo: Todo = {
      id: Date.now(),
      title: inputValue.trim(),
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const markCompleted = (id: number) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: true } : todo
    ));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Add todo"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title} - {todo.completed ? 'completed' : 'not completed'}
            {!todo.completed && (
              <button onClick={() => markCompleted(todo.id)}>Complete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
