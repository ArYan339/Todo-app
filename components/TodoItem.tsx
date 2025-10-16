import React from 'react';
import { Todo, Category, Priority } from '../types';
import { PersonalIcon, WorkIcon, ShoppingIcon, ClockIcon, TrashIcon, FlagIcon } from './Icons';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetTimer: (todo: Todo) => void;
}

const categoryStyles: { [key in Category]: { bg: string; text: string; icon: React.ReactElement } } = {
  [Category.PERSONAL]: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <PersonalIcon /> },
  [Category.WORK]: { bg: 'bg-purple-100', text: 'text-purple-800', icon: <WorkIcon /> },
  [Category.SHOPPING]: { bg: 'bg-green-100', text: 'text-green-800', icon: <ShoppingIcon /> },
};

const priorityStyles: { [key in Priority]: { color: string; label: string; bg: string } } = {
  [Priority.HIGH]: { color: 'text-red-700', label: 'High', bg: 'bg-red-100' },
  [Priority.MEDIUM]: { color: 'text-yellow-700', label: 'Medium', bg: 'bg-yellow-100' },
  [Priority.LOW]: { color: 'text-green-700', label: 'Low', bg: 'bg-green-100' },
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onSetTimer }) => {
  const catStyle = categoryStyles[todo.category];
  const prioStyle = priorityStyles[todo.priority];

  return (
    <li className="flex items-center p-4 bg-yellow-50/80 backdrop-blur-md rounded-xl border-2 border-yellow-200/50 shadow-sm transition-all duration-300 hover:bg-yellow-100/70 hover:shadow-md">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-6 w-6 rounded-md border-yellow-400 text-yellow-500 focus:ring-yellow-500 transition cursor-pointer flex-shrink-0"
      />
      <div className={`ml-4 flex-grow ${todo.completed ? 'line-through text-gray-400' : 'text-yellow-900'}`}>
        <p className="font-semibold">{todo.text}</p>
        <p className="text-xs text-yellow-800/70">{new Date(todo.dateTime).toLocaleString()}</p>
      </div>
      <div className="flex items-center flex-shrink-0 flex-wrap justify-end gap-2 ml-4">
         <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${prioStyle.bg} ${prioStyle.color}`}>
            <FlagIcon />
            {prioStyle.label}
        </span>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 ${catStyle.bg} ${catStyle.text}`}>
            {catStyle.icon}
            {todo.category.charAt(0) + todo.category.slice(1).toLowerCase()}
        </span>
        {todo.timerDuration > 0 && !todo.completed && (
            <button onClick={() => onSetTimer(todo)} className="p-2 rounded-full hover:bg-yellow-400/20 text-yellow-600 hover:text-yellow-800 transition">
                <ClockIcon />
            </button>
        )}
        <button onClick={() => onDelete(todo.id)} className="p-2 rounded-full hover:bg-red-500/20 text-red-500 hover:text-red-700 transition">
            <TrashIcon />
        </button>
      </div>
    </li>
  );
};

export default TodoItem;