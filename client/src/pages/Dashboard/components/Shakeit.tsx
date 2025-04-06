import React, { useState, useEffect, useRef, FC } from 'react';
import { motion } from 'framer-motion';

interface ShakeTimerProps {
  defaultSeconds?: number;
  onComplete?: () => void;
  className?: string;
  backgroundImage?: string;
  moodColor?: {bg: string, text: string, border: string};
}

const ShakeTimer: FC<ShakeTimerProps> = ({
  defaultSeconds = 10,
  onComplete,
  className = '',
  backgroundImage = '/api/placeholder/1200/800',
  moodColor = {bg: "bg-red-100", text: "text-red-800", border: "border-red-300"}
}) => {
  const [seconds, setSeconds] = useState<number>(defaultSeconds);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [inputTime, setInputTime] = useState<number>(defaultSeconds);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const tickSoundRef = useRef<HTMLAudioElement | null>(null);
  const completeSoundRef = useRef<HTMLAudioElement | null>(null);
  const startSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    tickSoundRef.current = new Audio("/audio/tick.mp3");
    completeSoundRef.current = new Audio("/audio/complete.mp3");
    startSoundRef.current = new Audio("/audio/start.mp3");

    return () => {
      [tickSoundRef, completeSoundRef, startSoundRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.src = "";
        }
      });
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            if (!isMuted && completeSoundRef.current) {
              completeSoundRef.current.currentTime = 0;
              completeSoundRef.current.play().catch(() => {});
            }
            return 0;
          }
          
          if (!isMuted && tickSoundRef.current && prev <= 3) {
            tickSoundRef.current.currentTime = 0;
            tickSoundRef.current.play().catch(() => {});
          }
          
          return prev - 1;
        });
      }, 1000);
    } else if (isActive && seconds === 0) {
      setIsActive(false);
      setIsComplete(true);
      onComplete?.();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, seconds, onComplete, isMuted]);

  const startTimer = () => {
    setIsActive(true);
    setIsComplete(false);
    if (!isMuted && startSoundRef.current) {
      startSoundRef.current.currentTime = 0;
      startSoundRef.current.play().catch(() => {});
    }
  };

  const resetTimer = () => {
    setSeconds(inputTime);
    setIsActive(false);
    setIsComplete(false);
  };

  const incrementTime = () => {
    if (!isActive) {
      const newTime = inputTime + 5;
      setInputTime(newTime);
      setSeconds(newTime);
    }
  };

  const decrementTime = () => {
    if (!isActive && inputTime > 5) {
      const newTime = inputTime - 5;
      setInputTime(newTime);
      setSeconds(newTime);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const backgroundColor = moodColor.bg.replace('bg-', '');

  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`relative w-full h-full max-w-2xl mx-auto overflow-hidden rounded-lg ${moodColor.bg} border ${moodColor.border}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center justify-center p-8 h-full">
          <h2 className={`text-2xl font-bold mb-8 ${moodColor.text}`}>Shake It Out!</h2>
          
          <TimerDisplay seconds={seconds} isActive={isActive} textColor={moodColor.text} />
          
          <Controls
            isActive={isActive}
            isComplete={isComplete}
            onStart={startTimer}
            onReset={resetTimer}
            onIncrement={incrementTime}
            onDecrement={decrementTime}
            moodColor={moodColor}
          />
          
          {isComplete && <CompletionMessage onReset={resetTimer} moodColor={moodColor} />}
          
          <MuteButton isMuted={isMuted} onToggle={toggleMute} moodColor={moodColor} />
          
          <div className="mt-8 bg-white bg-opacity-50 p-5 rounded-lg max-w-md w-full">
            <h3 className={`font-semibold ${moodColor.text} mb-2`}>Benefits of "Shake It Out":</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Quickly releases physical tension</li>
              <li>Interrupts anxious thought patterns</li>
              <li>Activates your body's relaxation response</li>
              <li>Increases blood flow and energy</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const TimerDisplay: FC<{ seconds: number; isActive: boolean; textColor: string }> = ({ seconds, isActive, textColor }) => (
  <div className="mb-8">
    <motion.div
      className={`text-7xl font-bold ${textColor}`}
      animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
      transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
    >
      {seconds}
    </motion.div>
    <motion.h2
      className={`text-4xl font-bold mt-4 ${textColor}`}
      animate={{ x: isActive ? [0, -10, 10, -10, 0] : 0 }}
      transition={{ duration: 0.6, repeat: isActive ? Infinity : 0 }}
    >
      {isActive ? 'SHAKE IT OUT!' : 'Ready to Shake?'}
    </motion.h2>
  </div>
);

const Controls: FC<{
  isActive: boolean;
  isComplete: boolean;
  onStart: () => void;
  onReset: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  moodColor: {bg: string, text: string, border: string};
}> = ({ isActive, isComplete, onStart, onReset, onIncrement, onDecrement, moodColor }) => (
  <div className="flex justify-center gap-4">
    <button
      onClick={onDecrement}
      disabled={isActive}
      className={`px-4 py-2 rounded-full text-white disabled:opacity-50 ${isActive ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'}`}
    >
      -5s
    </button>
    {!isActive ? (
      <button
        onClick={onStart}
        className={`px-6 py-3 border-2 ${moodColor.border} ${moodColor.text} bg-white bg-opacity-20 rounded-full hover:bg-white hover:bg-opacity-50 transition-colors`}
      >
        {isComplete ? 'Restart' : 'Start'}
      </button>
    ) : (
      <button
        onClick={onReset}
        className={`px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600`}
      >
        Stop
      </button>
    )}
    <button
      onClick={onIncrement}
      disabled={isActive}
      className={`px-4 py-2 rounded-full text-white disabled:opacity-50 ${isActive ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'}`}
    >
      +5s
    </button>
  </div>
);

const CompletionMessage: FC<{ 
  onReset: () => void;
  moodColor: {bg: string, text: string, border: string};
}> = ({ onReset, moodColor }) => (
  <div className="mt-8">
    <motion.h3 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-2xl font-bold mb-2 ${moodColor.text}`}
    >
      Great job! Feeling better?
    </motion.h3>
    <p className="text-gray-700 mb-4">Taking a moment to physically release tension can quickly improve your mood.</p>
    <button
      onClick={onReset}
      className={`px-6 py-3 border-2 ${moodColor.border} ${moodColor.text} rounded-full hover:bg-white transition-colors`}
    >
      Shake Again
    </button>
  </div>
);

const MuteButton: FC<{ 
  isMuted: boolean; 
  onToggle: () => void;
  moodColor: {bg: string, text: string, border: string};
}> = ({
  isMuted,
  onToggle,
  moodColor
}) => (
  <button
    onClick={onToggle}
    className={`absolute top-4 right-4 p-3 border ${moodColor.border} rounded-full ${moodColor.text} bg-white bg-opacity-30 hover:bg-opacity-50`}
  >
    {isMuted ? '🔇' : '🔊'}
  </button>
);

export default ShakeTimer;
