import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BreathingBubbleProps {
  moodColor?: {bg: string, text: string, border: string};
}

const BreathingBubble: React.FC<BreathingBubbleProps> = ({ 
  moodColor = {bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300"}
}) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(120); // 2 minutes in seconds

  // Phase durations
  const inhaleDuration = 4;
  const holdDuration = 4;
  const exhaleDuration = 6;
  const cycleDuration = inhaleDuration + holdDuration + exhaleDuration;

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive]);

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }
  }, [timeLeft, isActive]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        const currentCycleTime = (totalTime - timeLeft) % cycleDuration;
        
        if (currentCycleTime < inhaleDuration) {
          setPhase("inhale");
        } else if (currentCycleTime < inhaleDuration + holdDuration) {
          setPhase("hold");
        } else {
          setPhase("exhale");
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isActive, timeLeft, totalTime]);

  const toggleTimer = () => {
    if (!isActive && timeLeft === 0) {
      // Reset timer if it's completed
      setTimeLeft(totalTime);
    }
    setIsActive(prev => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalTime);
    setPhase("inhale");
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getInstructionText = (): string => {
    switch (phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
    }
  };

  const getBubbleStyle = (): string => {
    const baseClasses = "rounded-full flex items-center justify-center transition-all duration-1000";
    
    switch (phase) {
      case "inhale":
        return `${baseClasses} scale-100 ${moodColor.bg} ${moodColor.border} border-4`;
      case "hold":
        return `${baseClasses} scale-100 ${moodColor.bg} ${moodColor.border} border-4`;
      case "exhale":
        return `${baseClasses} scale-75 ${moodColor.bg} ${moodColor.border} border-4`;
      default:
        return `${baseClasses} scale-75 ${moodColor.bg} ${moodColor.border} border-4`;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-8 max-w-2xl w-full"
      >
        <h2 className={`text-2xl font-bold mb-6 ${moodColor.text}`}>Breathing Exercise</h2>
        
        {/* Breathing Bubble Section */}
        <div className="relative mb-10 flex justify-center">
          <div className={getBubbleStyle()} style={{ width: '260px', height: '260px' }}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${moodColor.text}`}>{formatTime(timeLeft)}</div>
              <div className={`text-xl ${moodColor.text} mt-2`}>{isActive ? getInstructionText() : 'Press Start'}</div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex space-x-4">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3 border-2 ${moodColor.border} ${moodColor.text} rounded-full hover:bg-white transition-colors`}
          >
            {isActive ? 'Pause' : timeLeft === 0 ? 'Restart' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-8 py-3 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="mt-8 bg-white bg-opacity-50 p-6 rounded-lg max-w-md w-full text-gray-700">
          <h3 className={`font-semibold ${moodColor.text} mb-2`}>Benefits:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Reduces anxiety and stress</li>
            <li>Lowers blood pressure</li>
            <li>Improves focus and concentration</li>
            <li>Promotes better sleep</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default BreathingBubble;
