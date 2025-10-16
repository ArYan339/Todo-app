import React, { useState, useEffect } from 'react';
import { Todo } from '../types';

interface TimerModalProps {
  todo: Todo;
  onComplete: () => void;
  onClose: () => void;
  onStopAudio: () => void;
}

const TimerModal: React.FC<TimerModalProps> = ({ todo, onComplete, onClose, onStopAudio }) => {
  const [timeLeft, setTimeLeft] = useState(todo.timerDuration);
  const [totalDuration, setTotalDuration] = useState(todo.timerDuration);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isFinished) {
        setIsFinished(true);
        onComplete();
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onComplete, isFinished]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleClose = () => {
    onStopAudio();
    onClose();
  }
  
  const addMinute = () => {
    setTimeLeft(prev => prev + 60);
    setTotalDuration(prev => prev + 60);
  };
  
  const subtractMinute = () => {
    setTimeLeft(prev => Math.max(0, prev - 60));
    setTotalDuration(prev => Math.max(0, prev - 60));
  };

  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-yellow-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md bg-yellow-50 backdrop-blur-xl rounded-3xl border-4 border-yellow-200 shadow-2xl p-8 text-center text-yellow-900">
        {!isFinished ? (
          <>
            <h2 className="text-xl font-bold mb-2 text-yellow-800">Focus Time</h2>
            <p className="text-2xl font-semibold mb-6 text-yellow-600 truncate">{todo.text}</p>
            
            <div className="relative w-48 h-48 mx-auto mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-yellow-800/10" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle
                        className="text-yellow-400"
                        strokeWidth="7"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (progress / 100) * 283}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-5xl font-mono tracking-tighter text-yellow-800">{formatTime(timeLeft)}</p>
                </div>
            </div>

            <div className="flex justify-center items-center gap-6 mb-6">
                <button
                    onClick={subtractMinute}
                    className="px-4 py-2 rounded-lg bg-yellow-100 border-2 border-yellow-200 font-semibold flex items-center justify-center transition hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={timeLeft < 60}
                >
                    - 1 min
                </button>
                <button
                    onClick={addMinute}
                    className="px-4 py-2 rounded-lg bg-yellow-100 border-2 border-yellow-200 font-semibold flex items-center justify-center transition hover:bg-yellow-200"
                >
                    + 1 min
                </button>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 border-b-4 border-red-700 active:border-b-0 active:translate-y-0"
            >
              Stop & Close
            </button>
          </>
        ) : (
           <>
            <h2 className="text-3xl font-bold mb-4 text-yellow-600 font-banana">Time's Up!</h2>
            <p className="mb-6 text-yellow-800">Great job focusing on:</p>
            <p className="text-xl font-semibold mb-8 truncate text-yellow-900">{todo.text}</p>
            
            <div className="space-y-4">
              <button
                onClick={onStopAudio}
                className="w-full py-3 bg-yellow-400 text-yellow-900 font-bold rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-0"
              >
                Stop Music
              </button>
              <button
                onClick={handleClose}
                className="w-full py-3 bg-yellow-200/50 text-yellow-900 font-bold rounded-lg hover:bg-yellow-200/80 transition-all duration-300"
              >
                Close
              </button>
            </div>
           </>
        )}
      </div>
    </div>
  );
};

export default TimerModal;