import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh } from 'lucide-react';

const moods = [
  { icon: <Smile className="h-8 w-8" />, label: 'Happy', value: 'happy' },
  { icon: <Meh className="h-8 w-8" />, label: 'Neutral', value: 'neutral' },
  { icon: <Frown className="h-8 w-8" />, label: 'Sad', value: 'sad' }
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, intensity, note })
      });
      if (response.ok) {
        setSelectedMood('');
        setIntensity(5);
        setNote('');
      }
    } catch (error) {
      console.error('Error logging mood:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">How are you feeling today?</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {moods.map((mood) => (
            <motion.button
              key={mood.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood.value)}
              className={`p-4 rounded-lg border-2 ${
                selectedMood === mood.value
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              type="button"
            >
              <div className="flex flex-col items-center space-y-2">
                {mood.icon}
                <span className="text-sm font-medium">{mood.label}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intensity (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add a note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
        >
          Log Mood
        </button>
      </form>
    </div>
  );
};

export default MoodTracker