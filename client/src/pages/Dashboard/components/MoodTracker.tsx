import React, { useState, useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Define types for the component data and props
export type MoodType = 'anxious' | 'sad' | 'happy' | 'angry' | 'focused' | 'neutral' | string;
export type ActionType = 'playMedia' | 'openExercise' | 'breakTasks' | 'logGratitude';

export interface MoodData {
  mood: MoodType;
  suggestion: string;
  actionType: ActionType;
  mediaLink?: string;
  exerciseId?: string;
}

export interface TaskDecomposerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MoodActionHandlerProps {
  userId?: string; // Optional user ID to fetch specific user data
  endpoint?: string; // Optional custom endpoint
  onActionComplete?: (actionType: ActionType) => void;
  TaskDecomposerModal?: FC<TaskDecomposerModalProps>;
}

/**
 * MoodActionHandler - A component that fetches and displays user mood information and relevant actions
 * 
 * @param props Component props
 * @returns React component
 */
const MoodActionHandler: FC<MoodActionHandlerProps> = ({ 
  userId,
  endpoint = '/api/mood-suggestions',
  onActionComplete, 
  TaskDecomposerModal 
}) => {
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  // Fetch mood data from the backend
  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        setLoading(true);
        const url = userId ? `${endpoint}?userId=${userId}` : endpoint;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error fetching mood data: ${response.statusText}`);
        }
        
        const data: MoodData = await response.json();
        setMoodData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Failed to fetch mood data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [endpoint, userId]);

  // Trigger the fade-in animation when data is loaded
  useEffect(() => {
    if (moodData && !loading) {
      setIsVisible(true);
    }
  }, [moodData, loading]);

  // Background color based on mood
  const getMoodColor = (mood: MoodType): string => {
    const moodColors: Record<string, string> = {
      anxious: 'bg-purple-50 border-purple-200',
      sad: 'bg-blue-50 border-blue-200',
      happy: 'bg-yellow-50 border-yellow-200',
      angry: 'bg-red-50 border-red-200',
      focused: 'bg-green-50 border-green-200',
      neutral: 'bg-gray-50 border-gray-200'
    };
    
    return moodColors[mood.toLowerCase()] || 'bg-gray-50 border-gray-200';
  };

  // Icon based on action type
  const getActionIcon = (actionType: ActionType): string => {
    switch (actionType) {
      case 'playMedia':
        return '▶️';
      case 'openExercise':
        return '🧘';
      case 'breakTasks':
        return '📋';
      case 'logGratitude':
        return '✨';
      default:
        return '➡️';
    }
  };

  // Button text based on action type
  const getButtonText = (actionType: ActionType): string => {
    switch (actionType) {
      case 'playMedia':
        return 'Play Now';
      case 'openExercise':
        return 'Start Exercise';
      case 'breakTasks':
        return 'Break Down Tasks';
      case 'logGratitude':
        return 'Log Gratitude';
      default:
        return 'Take Action';
    }
  };

  // Handle the action when button is clicked
  const handleAction = (): void => {
    if (!moodData) return;

    switch (moodData.actionType) {
      case 'playMedia':
        if (moodData.mediaLink) {
          window.open(moodData.mediaLink, '_blank', 'noopener,noreferrer');
        }
        break;
      case 'openExercise':
        if (moodData.exerciseId) {
          navigate(`/exercises/${moodData.exerciseId}`);
        }
        break;
      case 'breakTasks':
        setShowModal(true);
        break;
      case 'logGratitude':
        navigate('/gratitude-log');
        break;
      default:
        console.warn('Unknown action type:', moodData.actionType);
    }

    if (onActionComplete) {
      onActionComplete(moodData.actionType);
    }
  };

  // Close the modal
  const closeModal = (): void => {
    setShowModal(false);
  };

  // Function to get mood emoji
  const getMoodEmoji = (mood: MoodType): string => {
    const moodEmojis: Record<string, string> = {
      happy: '😊',
      sad: '😔',
      anxious: '😰',
      angry: '😠',
      focused: '🧐',
      neutral: '😐'
    };
    
    return moodEmojis[mood.toLowerCase()] || '😐';
  };

  // Loading state
  if (loading) {
    return (
      <div className="rounded-lg shadow-md p-6 max-w-md mx-auto border bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !moodData) {
    return (
      <div className="rounded-lg shadow-md p-6 max-w-md mx-auto border bg-red-50 text-red-600">
        <h3 className="font-medium text-lg mb-2">Unable to load mood data</h3>
        <p className="text-sm">{error || 'No data available'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg shadow-md p-6 max-w-md mx-auto border ${getMoodColor(moodData.mood)}`}
    >
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-3">
          {getMoodEmoji(moodData.mood)}
        </div>
        <h3 className="font-medium text-lg capitalize">{moodData.mood}</h3>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-gray-700 mb-6"
      >
        {moodData.suggestion}
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleAction}
        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium flex items-center justify-center"
      >
        <span className="mr-2">{getActionIcon(moodData.actionType)}</span>
        {getButtonText(moodData.actionType)}
      </motion.button>

      {/* Render the task decomposer modal when needed */}
      {TaskDecomposerModal && showModal && (
        <TaskDecomposerModal isOpen={showModal} onClose={closeModal} />
      )}
    </motion.div>
  );
};

export default MoodActionHandler;