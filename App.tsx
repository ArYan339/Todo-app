import React, { useState, useEffect, useMemo } from 'react';
import { Todo, Category, Priority } from './types';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import TimerModal from './components/TimerModal';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsed = JSON.parse(savedTodos);
      // Add a default priority to older todos that might not have one
      return parsed.map((todo: any) => ({
        ...todo,
        priority: todo.priority || Priority.MEDIUM,
      }));
    }
    return [];
  });
  
  const [categoryFilter, setCategoryFilter] = useState<Category | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
  const [activeTimerTodo, setActiveTimerTodo] = useState<Todo | null>(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  
  const completionAudio = useMemo(() => {
    const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-1.mp3');
    audio.loop = true;
    return audio;
  }, []);


  const addTodo = (todo: Todo) => {
    setTodos([todo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const stopAudio = () => {
    completionAudio.pause();
    completionAudio.currentTime = 0;
  };
  
  const handleSetTimer = (todo: Todo) => {
    setActiveTimerTodo(todo);
  };
  
  const handleTimerComplete = () => {
    if (activeTimerTodo) {
      completionAudio.play().catch(e => console.error("Error playing audio:", e));
    }
  };
  
  const handleCloseTimer = () => {
    stopAudio();
    setActiveTimerTodo(null);
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const categoryMatch = categoryFilter === 'ALL' || todo.category === categoryFilter;
      const priorityMatch = priorityFilter === 'ALL' || todo.priority === priorityFilter;
      return categoryMatch && priorityMatch;
    });
  }, [todos, categoryFilter, priorityFilter]);

  const categoryFilterButtons: { label: string, value: Category | 'ALL'}[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Personal', value: Category.PERSONAL },
    { label: 'Work', value: Category.WORK },
    { label: 'Shopping', value: Category.SHOPPING },
  ];
  
  const priorityFilterButtons: { label: string, value: Priority | 'ALL'}[] = [
    { label: 'All Priorities', value: 'ALL' },
    { label: 'High', value: Priority.HIGH },
    { label: 'Medium', value: Priority.MEDIUM },
    { label: 'Low', value: Priority.LOW },
  ];

  return (
    <div className="min-h-screen w-full bg-[#fefce8] text-yellow-900 selection:bg-yellow-500 selection:text-black banana-bg-pattern">
      <div className="relative min-h-screen flex flex-col items-center p-4 sm:p-8">
        <header className="text-center my-8">
          <h1 className="text-6xl md:text-7xl font-banana text-yellow-900/80">
            Nana Banana Todo
          </h1>
          <p className="text-yellow-800/70 mt-2">Let's get things done!</p>
        </header>

        <main className="w-full max-w-3xl mx-auto space-y-8">
          <TodoForm onAddTodo={addTodo} />

          <div className="p-4 bg-yellow-100/50 backdrop-blur-lg rounded-2xl border-2 border-yellow-200/60 space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categoryFilterButtons.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setCategoryFilter(value)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                    categoryFilter === value
                      ? 'bg-yellow-400 text-yellow-900 shadow'
                      : 'bg-yellow-200/50 hover:bg-yellow-200/80 text-yellow-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 border-t-2 border-yellow-200/50 pt-4">
               {priorityFilterButtons.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setPriorityFilter(value)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full transition ${
                    priorityFilter === value
                      ? 'bg-yellow-500 text-white shadow'
                      : 'bg-yellow-200/50 hover:bg-yellow-200/80 text-yellow-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            
            {filteredTodos.length > 0 ? (
                <ul className="space-y-3 pt-4">
                    {filteredTodos.map((todo) => (
                        <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onSetTimer={handleSetTimer}
                        />
                    ))}
                </ul>
            ) : (
                <div className="text-center py-10">
                    <p className="text-yellow-800/60">No tasks here. Go bananas and add one!</p>
                </div>
            )}
          </div>
        </main>

        {activeTimerTodo && (
            <TimerModal
                todo={activeTimerTodo}
                onComplete={handleTimerComplete}
                onClose={handleCloseTimer}
                onStopAudio={stopAudio}
            />
        )}
      </div>
    </div>
  );
};

export default App;