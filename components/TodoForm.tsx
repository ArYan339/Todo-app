import React, { useState } from 'react';
import { Category, Todo, Priority } from '../types';

interface TodoFormProps {
  onAddTodo: (todo: Todo) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>(Category.PERSONAL);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dateTime, setDateTime] = useState('');
  const [timerMinutes, setTimerMinutes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !dateTime) {
      alert("Please fill in the task and select a date/time.");
      return;
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      category,
      priority,
      dateTime,
      timerDuration: Number(timerMinutes) * 60,
    };

    onAddTodo(newTodo);
    setText('');
    setDateTime('');
    setTimerMinutes('');
    setCategory(Category.PERSONAL);
    setPriority(Priority.MEDIUM);
  };

  const inputStyles = "w-full px-4 py-3 bg-[#fefce8] text-yellow-900 placeholder-yellow-700/60 rounded-lg border-2 border-yellow-800/20 focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500 transition";

  return (
    <form 
        onSubmit={handleSubmit} 
        className="p-6 bg-yellow-50 backdrop-blur-lg rounded-t-[40px] rounded-b-[20px] border-4 border-yellow-200 border-t-yellow-300 shadow-lg space-y-4"
        style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 85% 95%, 15% 95%, 0 100%)'}}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's your next task?"
        className={inputStyles}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className={inputStyles}
        >
          {Object.values(Category).map((cat) => (
            <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className={inputStyles}
        >
          {Object.values(Priority).map((p) => (
            <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className={inputStyles}
        />
        <input
          type="number"
          value={timerMinutes}
          onChange={(e) => setTimerMinutes(e.target.value)}
          placeholder="Focus Time (min)"
          min="1"
          className={inputStyles}
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-yellow-400 text-yellow-900 font-bold rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-0"
      >
        Add Nana Task
      </button>
    </form>
  );
};

export default TodoForm;