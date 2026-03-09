import { Todo, NewTodo, TodoStatus } from './types';

let nextId = 1;

export function createTodo(input: NewTodo): Todo {
    return {
        id: nextId++,
        title: input.title,
        description: input.description,
        status: input.status ?? TodoStatus.PENDING,
        createdAt: new Date()
    };
}