 
import { Todo, TodoStatus } from './types';

export function toggleAll(state: Todo[], completed: boolean): Todo[] {
 
  if (!state) {
    throw new TypeError('state cannot be null or undefined');
  }
   
  return state.map(todo => ({
    ...todo,
    
    status: completed ? TodoStatus.COMPLETED : TodoStatus.PENDING
  }));
}

export function clearCompleted(state: Todo[]): Todo[] {
 
  if (!state) {
    throw new TypeError('state cannot be null or undefined');
  }
   
  return state.filter(todo => todo.status !== TodoStatus.COMPLETED);
}

export function countByStatus(state: Todo[], status: TodoStatus): number {
 
  if (!state) {
    throw new TypeError('state cannot be null or undefined');
  }
 
  return state.reduce((count, todo) => {
    return todo.status === status ? count + 1 : count;
  }, 0);
 
}