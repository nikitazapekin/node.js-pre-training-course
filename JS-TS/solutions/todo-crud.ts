 
import { Todo } from './types';

export function addTodo(state: Todo[], todo: Todo): Todo[] {
 
  if (!state) {
    throw new TypeError('state cannot be null or undefined');
  }
  
 
  return [...state, todo];
}

export function updateTodo(
  state: Todo[], 
  id: number, 
  update: Partial<Omit<Todo, 'id' | 'createdAt'>>
): Todo[] {
 
  if (!state) {
    throw new TypeError('state cannot be null or undefined');
  }
   
  const index = state.findIndex(todo => todo.id === id);
   
  if (index === -1) {
    throw new Error(`Todo with id ${id} not found`);
  }
 
  return state.map((todo, i) => 
    i === index 
      ? { ...todo, ...update }  
      : todo
  );
}

export function removeTodo(state: Todo[], id: number): Todo[] {
 
  if (!state) {
    throw new TypeError('state cannot be null or undefined');
  }
  
   
  const exists = state.some(todo => todo.id === id);
  
  if (!exists) {
    throw new Error(`Todo with id ${id} not found`);
  }
  
 
  return state.filter(todo => todo.id !== id);
}

export function getTodo(state: Todo[], id: number): Todo | undefined {
  
  if (!state) {
    throw new TypeError('state cannot be null or undefined');
  }
  
 
  return state.find(todo => todo.id === id);
}