import React, { useState } from "react";

const AffirmationWriter: React.FC = () => {
  const [affirmation, setAffirmation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (affirmation.trim()) {
      // Here you could send it to backend or store locally
      console.log("User Affirmation:", affirmation);
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-emerald-50 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-emerald-700 text-center mb-4">
        ✨ Write Your Own Affirmation
      </h2>

      {submitted ? (
        <div className="text-center text-emerald-800">
          <p className="text-lg italic mb-2">“{affirmation}”</p>
          <p className="font-medium">Saved! Keep this energy alive 🌞</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={affirmation}
            onChange={(e) => setAffirmation(e.target.value)}
            placeholder="Write something uplifting like 'I am proud of how far I've come...'"
            className="w-full h-32 p-4 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none text-emerald-800"
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition duration-200"
          >
            Save Affirmation
          </button>
        </form>
      )}
    </div>
  );
};

export default AffirmationWriter;
