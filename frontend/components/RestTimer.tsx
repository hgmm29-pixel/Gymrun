import React, { useState, useEffect } from 'react';
import { Timer, Square, BellRing } from 'lucide-react';

const RestTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setIsFinished(true);
      // Auto-hide finished state after 8 seconds
      const timeout = setTimeout(() => setIsFinished(false), 8000);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setIsActive(true);
    setIsFinished(false);
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
    setIsFinished(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!isActive && !isFinished && timeLeft === 0) {
    return (
      <div className="flex gap-2 mb-3">
        <button 
          onClick={() => startTimer(60)} 
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Timer size={14} className="text-emerald-500" /> 60s Descanso
        </button>
        <button 
          onClick={() => startTimer(90)} 
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Timer size={14} className="text-emerald-500" /> 90s Descanso
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full border transition-all mb-3 w-fit shadow-sm ${
      isFinished 
        ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400 animate-pulse' 
        : 'bg-slate-800 border-emerald-500/50 text-slate-200'
    }`}>
      {isFinished ? <BellRing size={16} /> : <Timer size={16} className="animate-pulse text-emerald-400" />}
      <span className="font-mono font-bold text-sm tracking-wider">
        {isFinished ? '¡TIEMPO DE VOLVER!' : formatTime(timeLeft)}
      </span>
      {!isFinished && (
        <button onClick={stopTimer} className="text-slate-400 hover:text-red-400 ml-1 transition-colors" title="Detener descanso">
          <Square size={14} fill="currentColor" />
        </button>
      )}
      {isFinished && (
        <button onClick={() => setIsFinished(false)} className="text-emerald-400 hover:text-emerald-300 ml-2 text-xs transition-colors font-medium">
          ✕
        </button>
      )}
    </div>
  );
};

export default RestTimer;