import React, { useState, useEffect, useRef, FC } from 'react';
import { motion } from 'framer-motion';

interface ShakeTimerProps {
  defaultSeconds?: number; // Default countdown time in seconds
  onComplete?: () => void; // Optional callback when countdown reaches zero
  className?: string; // Optional additional CSS classes
  backgroundImage?: string; // Optional custom background image URL
}

/**
 * ShakeTimer - A full-screen countdown timer that encourages users to "shake it out"
 * with adjustable duration, sound effects, and background imagery
 */
const ShakeTimer: FC<ShakeTimerProps> = ({ 
  defaultSeconds = 10, 
  onComplete,
  className = '',
  backgroundImage = '/api/placeholder/1200/800' // Default placeholder, replace with your actual image
}) => {
  const [seconds, setSeconds] = useState<number>(defaultSeconds);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [inputTime, setInputTime] = useState<number>(defaultSeconds);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Refs for audio elements
  const tickSoundRef = useRef<HTMLAudioElement | null>(null);
  const completeSoundRef = useRef<HTMLAudioElement | null>(null);
  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const shakeSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements on component mount
  useEffect(() => {
    // We're using base64 data for the sounds since we can't link to external assets
    // In a real app, you'd use actual audio files in your public folder
    
    // Simple tick sound (this would be a placeholder - replace with real audio file)
    tickSoundRef.current = new Audio("data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL6QWixOJAkAA");
    completeSoundRef.current = new Audio("data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL6QWixOJAkAA");
    startSoundRef.current = new Audio("data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL6QWixOJAkAA");
    shakeSoundRef.current = new Audio("data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL6QWixOJAkAA");
    
    // Cleanup on unmount
    return () => {
      if (tickSoundRef.current) tickSoundRef.current.pause();
      if (completeSoundRef.current) completeSoundRef.current.pause();
      if (startSoundRef.current) startSoundRef.current.pause();
      if (shakeSoundRef.current) shakeSoundRef.current.pause();
    };
  }, []);
  
  // Play sound based on current state
  useEffect(() => {
    if (isMuted) return;
    
    // Play tick sound on each second change if timer is active
    if (isActive && seconds > 0 && tickSoundRef.current) {
      tickSoundRef.current.currentTime = 0;
      tickSoundRef.current.play().catch(e => console.log("Audio play error:", e));
      
      // Play an additional "shake" sound every 2 seconds
      if (seconds % 2 === 0 && shakeSoundRef.current) {
        shakeSoundRef.current.currentTime = 0;
        shakeSoundRef.current.play().catch(e => console.log("Audio play error:", e));
      }
    }
    
    // Play completion sound when timer finishes
    if (seconds === 0 && isComplete && completeSoundRef.current) {
      completeSoundRef.current.currentTime = 0;
      completeSoundRef.current.play().catch(e => console.log("Audio play error:", e));
    }
  }, [seconds, isActive, isComplete, isMuted]);
  
  // Effect to handle the countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (isActive && seconds === 0) {
      if (interval) clearInterval(interval);
      setIsActive(false);
      setIsComplete(true);
      if (onComplete) onComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, onComplete]);
  
  // Start the timer
  const startTimer = () => {
    setIsActive(true);
    setIsComplete(false);
    
    // Play start sound
    if (!isMuted && startSoundRef.current) {
      startSoundRef.current.currentTime = 0;
      startSoundRef.current.play().catch(e => console.log("Audio play error:", e));
    }
  };
  
  // Reset the timer
  const resetTimer = () => {
    setSeconds(inputTime);
    setIsActive(false);
    setIsComplete(false);
  };
  
  // Increment time by 5 seconds
  const incrementTime = () => {
    if (!isActive) {
      const newTime = inputTime + 5;
      setInputTime(newTime);
      setSeconds(newTime);
    }
  };
  
  // Decrement time by 5 seconds (minimum 5 seconds)
  const decrementTime = () => {
    if (!isActive && inputTime > 5) {
      const newTime = inputTime - 5;
      setInputTime(newTime);
      setSeconds(newTime);
    }
  };
  
  // Toggle mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Animation variants for the shake text
  const textVariants = {
    shake: {
      x: [0, -15, 15, -15, 15, 0],
      transition: { duration: 0.6, repeat: isActive ? Infinity : 0, repeatDelay: 0.3 }
    },
    still: { x: 0 }
  };
  
  // Circle animation for the countdown
  const circleVariants = {
    active: (duration: number) => ({
      strokeDashoffset: [0, 283], // 283 is approximately the circumference of a circle with r=45
      transition: { duration, ease: "linear" }
    }),
    inactive: {
      strokeDashoffset: 0
    }
  };
  
  return (
    <div 
      className={`w-full h-full min-h-screen flex flex-col items-center justify-center ${className}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Main content */}
      <div className="z-10 w-full max-w-2xl px-4 py-12">
        {/* Sound toggle button */}
        <button 
          onClick={toggleMute}
          className="absolute top-4 right-4 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full"
        >
          {isMuted ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
        
        {/* Circle Timer */}
        <div className="flex justify-center mb-8">
          <div className="relative w-64 h-64">
            {/* Background circle */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              
              {/* Countdown circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="283"
                variants={circleVariants}
                initial="inactive"
                animate={isActive ? ["active"] : "inactive"}
                custom={inputTime}
              />
            </svg>
            
            {/* Timer number */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ 
                scale: isActive ? [1, 1.1, 1] : 1 
              }}
              transition={{ 
                duration: 1, 
                repeat: isActive ? Infinity : 0,
                repeatDelay: 0.2 
              }}
            >
              <span className="text-7xl font-bold text-white">{seconds}</span>
            </motion.div>
          </div>
        </div>
        
        {/* Shake it out text */}
        <motion.h2 
          className="text-4xl font-bold mb-12 text-white text-center"
          variants={textVariants}
          animate={isActive ? "shake" : "still"}
        >
          {isActive ? "SHAKE IT OUT!" : "Ready to Shake?"}
        </motion.h2>
        
        {/* Instructions */}
        {!isActive && !isComplete && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8 text-white text-opacity-90"
          >
            Take a moment to release tension by shaking out your body.
            Set your timer and get ready to move!
          </motion.p>
        )}
        
        {/* Animated shake figures during active state */}
        {isActive && (
          <div className="flex justify-around mb-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="text-5xl"
                animate={{
                  y: [0, -15, 0, -10, 0],
                  rotate: [0, -10, 10, -5, 0],
                  scale: [1, 1.1, 0.9, 1.05, 1]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 0.1 * i,
                  ease: "easeInOut"
                }}
              >
                🕺
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Timer controls */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <button
            onClick={decrementTime}
            disabled={isActive}
            className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-full disabled:opacity-50 hover:bg-opacity-30 transition-all text-xl font-bold"
          >
            -5s
          </button>
          
          {!isActive ? (
            <button
              onClick={startTimer}
              className="px-8 py-4 bg-white text-indigo-900 rounded-full shadow-lg hover:bg-opacity-90 transition-colors text-xl font-bold"
            >
              Start
            </button>
          ) : (
            <button
              onClick={resetTimer}
              className="px-8 py-4 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors text-xl font-bold"
            >
              Stop
            </button>
          )}
          
          <button
            onClick={incrementTime}
            disabled={isActive}
            className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-full disabled:opacity-50 hover:bg-opacity-30 transition-all text-xl font-bold"
          >
            +5s
          </button>
        </div>
        
        {/* Completion message */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Great job! Feeling better?
            </h3>
            <button 
              onClick={resetTimer}
              className="px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors text-lg font-medium"
            >
              Shake Again
            </button>
          </motion.div>
        )}
      </div>
      
      {/* Hidden audio elements */}
      <audio ref={tickSoundRef} src="data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL6QWixOJAkAA" />
      <audio ref={completeSoundRef} src="data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL6QWixOJAkAA" />
      <audio ref={startSoundRef} src="data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL6QWixOJAkAA" />
      <audio ref={shakeSoundRef} src="data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL6QWixOJAkAA" />
    </div>
  );
};

export default ShakeTimer;