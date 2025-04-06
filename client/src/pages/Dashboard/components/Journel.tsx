import React, { useState } from "react";

const GratitudePrompt: React.FC = () => {
  const [answers, setAnswers] = useState({
    smile: "",
    gratefulPerson: "",
    lookingForward: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      answers.smile.trim() ||
      answers.gratefulPerson.trim() ||
      answers.lookingForward.trim()
    ) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-left bg-green-50 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2 text-green-700">💚 Great job!</h2>
        <p className="text-green-600">Reflecting on positive moments helps shift your mindset. Keep it up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Gratitude Reflection</h2>

      <label className="block">
        <span className="text-gray-600">🧡 One thing that made you smile recently</span>
        <textarea
          name="smile"
          value={answers.smile}
          onChange={handleChange}
          placeholder="E.g., a sunny walk, a funny meme..."
          className="mt-1 w-full p-2 border rounded resize-none"
          rows={2}
        />
      </label>

      <label className="block">
        <span className="text-gray-600">🙏 Someone you're grateful for</span>
        <textarea
          name="gratefulPerson"
          value={answers.gratefulPerson}
          onChange={handleChange}
          placeholder="E.g., my best friend, mentor..."
          className="mt-1 w-full p-2 border rounded resize-none"
          rows={2}
        />
      </label>

      <label className="block">
        <span className="text-gray-600">🌅 Something you're looking forward to</span>
        <textarea
          name="lookingForward"
          value={answers.lookingForward}
          onChange={handleChange}
          placeholder="E.g., weekend plans, finishing my project..."
          className="mt-1 w-full p-2 border rounded resize-none"
          rows={2}
        />
      </label>

      <button
        onClick={handleSubmit}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Submit Reflection
      </button>
    </div>
  );
};

export default GratitudePrompt;
