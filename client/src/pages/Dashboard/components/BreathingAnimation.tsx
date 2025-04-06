import React, { useState, useEffect } from 'react';

const BreathingBubble = () => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [isActive, setIsActive] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTimeLeft(120);
    setIsActive(false);
    setBreathingPhase('inhale');
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    let breathingInterval: NodeJS.Timeout | undefined = undefined;

    if (isActive) {
      breathingInterval = setInterval(() => {
        setBreathingPhase(prev => {
          if (prev === 'inhale') return 'hold';
          if (prev === 'hold') return 'exhale';
          return 'inhale';
        });
      }, 4000);
    }

    return () => {
      if (breathingInterval) clearInterval(breathingInterval);
    };
  }, [isActive]);

  const getBubbleStyle = () => {
    const baseStyle =
      "rounded-full flex items-center justify-center shadow-xl " +
      "transition-transform transition-colors ease-in-out duration-[4000ms] will-change-transform";

    if (breathingPhase === 'inhale') {
      return `${baseStyle} bg-blue-400 scale-100`;
    } else if (breathingPhase === 'hold') {
      return `${baseStyle} bg-blue-500 scale-125`;
    } else {
      return `${baseStyle} bg-blue-300 scale-75`;
    }
  };

  const getInstructionText = () => {
    if (breathingPhase === 'inhale') return 'Breathe In';
    if (breathingPhase === 'hold') return 'Hold';
    return 'Breathe Out';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">2-Minute Breathing Exercise</h1>
        <p className="text-gray-600">Take a moment to relax and breathe</p>
      </div>

      <div className="relative mb-8">
        <div className={getBubbleStyle()} style={{ width: '240px', height: '240px' }}>
          <div className="text-center z-10">
            <div className="text-2xl font-bold text-white mb-2">{formatTime(timeLeft)}</div>
            <div className="text-xl text-white">{isActive ? getInstructionText() : 'Press Start'}</div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={toggleTimer}
          className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="mt-8 text-gray-600 text-center">
        <p>Follow the bubble as it expands and contracts.</p>
        <p>Breathe in as it grows, hold when it's full, and exhale as it shrinks.</p>
      </div>
    </div>
  );
};

export default BreathingBubble;
