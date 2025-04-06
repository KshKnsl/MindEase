import React, { useEffect, useState } from "react";
import axios from "axios";

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
        return (
          <textarea
            placeholder="Write something positive..."
            className="w-full p-2 border rounded"
          />
        );
      case "drawCanvas":
        return (
          <canvas
            id="drawingCanvas"
            className="border rounded w-full h-64"
            style={{ backgroundColor: "#f0f0f0" }}
          ></canvas>
        );
      case "playBreathingAnimation":
        return (
          <div className="flex flex-col items-center">
            <p className="mb-2 text-gray-600">
              Follow the breathing animation below:
            </p>
            <div className="w-32 h-32 border-4 border-blue-500 rounded-full animate-pulse"></div>
            <p className="mt-4 text-gray-600">
              This will last for 2 minutes. Relax and breathe.
            </p>
            <p className="mt-2 text-gray-600">
              Time remaining: <span id="timer">2:00</span>
            </p>
          </div>
        );

        useEffect(() => {
          let timeLeft = 120; // 2 minutes in seconds
          const timerElement = document.getElementById("timer");

          const interval = setInterval(() => {
            if (timeLeft <= 0) {
              clearInterval(interval);
              return;
            }
            timeLeft -= 1;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            if (timerElement) {
              timerElement.textContent = `${minutes}:${seconds
                .toString()
                .padStart(2, "0")}`;
            }
          }, 1000);

          return () => clearInterval(interval); // Cleanup on component unmount
        }, []);
      case "shakeCountdown":
        return <p>Shake it out! Countdown starts... [10s timer]</p>;
      case "playMusic":
        return (
          <audio controls autoPlay>
            <source src="/relaxing-music.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        );
      case "showQuote":
      default:
        return (
          <blockquote className="italic text-gray-600">
            "Peace begins with a smile." – Mother Teresa
          </blockquote>
        );
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
