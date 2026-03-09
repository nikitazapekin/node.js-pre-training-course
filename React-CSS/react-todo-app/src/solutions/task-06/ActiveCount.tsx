import React from 'react';
import { ActiveCountProps } from '../../types';

export const ActiveCount: React.FC<ActiveCountProps> = ({ todos }) => {
  const activeCount = todos.filter((todo) => !todo.completed).length;
  return <div>{activeCount} active</div>;
};
