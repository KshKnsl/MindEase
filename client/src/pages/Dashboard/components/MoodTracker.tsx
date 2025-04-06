import React, { useEffect, useState } from "react";
import axios from "axios";
import ShakeTimer from "./Shakeit";
import Journel from "./Journel";
import AffirmationWriter from "./Affirmation";
import BreathingBubble from "./BreathingAnimation";
import GroundingExercise from "./Exercise";

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
    switch (actionType) {
      case "positiveAffirmation":

        return <AffirmationWriter />;
      case "drawCanvas":
          return (
            <Journel />
          );
      case "playBreathingAnimation":
        return (
          <BreathingBubble />
        );
        
        return (
          <textarea
            placeholder="Write something positive..."
            className="w-full p-2 border rounded"
          />
        );
      case "shakeCountdown":
        return <p><ShakeTimer /></p>;
      case "playMusic":
        return (
          <audio controls autoPlay>
            <source src="/relaxing-music.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        );
      case "showQuote":
      default:
        return <GroundingExercise />
    }
  };

  if (loading) return <p>Loading mood-based action...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg w-full max-w-lg mx-auto text-center">
      <h2 className="text-xl font-bold mb-2">
        Your Current Mood: {moodInfo?.mood}
      </h2>
      <p className="mb-4 text-gray-600">{moodInfo?.suggestion}</p>
      <div className="mt-4">
        {moodInfo?.actionType && renderAction(moodInfo.actionType)}
      </div>
    </div>
  );
};

export default MoodAction;
