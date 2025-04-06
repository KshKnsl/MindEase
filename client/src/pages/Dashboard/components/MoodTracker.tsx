import React, { useEffect, useState } from "react";
import axios from "axios";
import ShakeTimer from "./Shakeit";
import Journel from "./Journel";
import AffirmationWriter from "./Affirmation";
import BreathingBubble from "./BreathingAnimation";
import GroundingExercise from "./Exercise";
import { motion } from "framer-motion";

type MoodInfo = {
  mood: "happy" | "sad" | "anxious" | "angry" | "depressed" | "neutral";
  suggestion: string;
  actionType:
    | "positiveAffirmation"
    | "drawCanvas"
    | "playBreathingAnimation"
    | "shakeCountdown"
    | "playMusic"
    | "showQuote";
};

// Mood color mapping for visual consistency
const moodColors: Record<string, {bg: string, text: string, border: string}> = {
  happy: {bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300"},
  sad: {bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300"},
  anxious: {bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300"},
  angry: {bg: "bg-red-100", text: "text-red-800", border: "border-red-300"},
  depressed: {bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300"},
  neutral: {bg: "bg-green-100", text: "text-green-800", border: "border-green-300"}
};

const MoodAction: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [moodInfo, setMoodInfo] = useState<MoodInfo | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMoodAction = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post<MoodInfo>(
          `${import.meta.env.VITE_BACKEND_URL}/api/mood/mood-action`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMoodInfo(res.data);
      } catch (err) {
        console.error(err);
        setError("Couldn't fetch mood-based action.");
      } finally {
        setLoading(false);
      }
    };

    fetchMoodAction();
  }, []);

  const renderAction = (actionType: MoodInfo["actionType"]) => {
    // Pass mood colors to child components for consistency
    const moodColor = moodInfo?.mood ? moodColors[moodInfo.mood] : moodColors.neutral;
    
    switch (actionType) {
      case "positiveAffirmation":
        return <AffirmationWriter moodColor={moodColor} />;
      case "drawCanvas":
        return <Journel moodColor={moodColor} />;
      case "playBreathingAnimation":
        return <BreathingBubble moodColor={moodColor} />;
      case "shakeCountdown":
        return <GroundingExercise moodColor={moodColor} /> ;
      case "playMusic":
        return (
          <div className={`p-8 rounded-lg ${moodColor.bg} border ${moodColor.border} w-full max-w-2xl mx-auto`}>
            <h3 className={`text-xl font-semibold ${moodColor.text} mb-4`}>Relaxation Music</h3>
            <audio controls autoPlay className="w-full">
              <source src="/relaxing-music.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case "showQuote":
      default:
        return <ShakeTimer moodColor={moodColor} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} 
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
          <p className="text-lg font-semibold text-gray-600 mt-4">Loading your mood profile...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} 
          className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg"
        >
          <p className="text-lg font-semibold text-red-500">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  const currentMoodColor = moodInfo?.mood ? moodColors[moodInfo.mood] : moodColors.neutral;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full flex flex-col"
    >
      <div className={`p-6 shadow-sm border-b ${currentMoodColor.border} mb-4`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">Mood Tracker</span>
            <span className={`text-lg font-medium ${currentMoodColor.bg} ${currentMoodColor.text} px-3 py-1 rounded-full capitalize`}>
              {moodInfo?.mood || "neutral"}
            </span>
          </h2>
          <button 
            onClick={() => window.location.reload()} 
            className="text-gray-500 hover:text-gray-700"
          >
            Refresh
          </button>
        </div>
        <p className={`mt-2 text-lg ${currentMoodColor.text}`}>{moodInfo?.suggestion}</p>
      </div>
      
      <div className="flex-1 w-full overflow-hidden">
        {moodInfo?.actionType && renderAction(moodInfo.actionType)}
      </div>
    </motion.div>
  );
};

export default MoodAction;
