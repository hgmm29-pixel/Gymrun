import React, { useState, useEffect } from 'react';
import { Timer as TimerIcon, Play, Pause, RotateCcw } from 'lucide-react';

const WorkoutTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(60 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 shadow-inner">
      <TimerIcon size={16} className={isActive ? "text-emerald-400 animate-pulse" : "text-slate-400"} />
      <span className={`text-sm font-mono font-medium w-12 text-center ${isActive ? 'text-emerald-400' : 'text-slate-200'}`}>
        {formatTime(timeLeft)}
      </span>
      <div className="flex items-center gap-1.5 border-l border-slate-600 pl-2 ml-1">
        <button 
          onClick={toggleTimer} 
          className="text-slate-400 hover:text-emerald-400 transition-colors" 
          title={isActive ? "Pausar" : "Iniciar"}
        >
          {isActive ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button 
          onClick={resetTimer} 
          className="text-slate-400 hover:text-slate-200 transition-colors" 
          title="Reiniciar"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};

export default WorkoutTimer;