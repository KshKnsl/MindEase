import React, { useState } from "react";
import { motion } from "framer-motion";

interface JournelProps {
  moodColor?: {bg: string, text: string, border: string};
}

const GratitudePrompt: React.FC<JournelProps> = ({ 
  moodColor = {bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300"} 
}) => {
  const [answers, setAnswers] = useState({
    smile: "",
    gratefulPerson: "",
    lookingForward: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setAnswers({
      smile: "",
      gratefulPerson: "",
      lookingForward: "",
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center w-full h-full p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`max-w-2xl w-full mx-auto ${moodColor.bg} rounded-lg p-8 border ${moodColor.border} shadow-lg text-center`}
        >
          <h2 className={`text-2xl font-bold mb-6 ${moodColor.text}`}>Thank You for Your Reflection</h2>
          <p className="text-gray-700 mb-6">
            Taking time to acknowledge gratitude can significantly improve your mental wellbeing.
            Your reflections have been saved.
          </p>
          
          <div className="bg-white bg-opacity-70 rounded-lg p-6 mb-6">
            <h3 className={`text-xl font-semibold mb-4 ${moodColor.text}`}>Your Reflections</h3>
            
            {Object.entries(answers).map(([key, value]) => (
              value && (
                <div key={key} className="mb-4 text-left p-3 bg-white rounded-lg shadow-sm">
                  <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</p>
                  <p className="text-gray-700">{value}</p>
                </div>
              )
            ))}
          </div>
          
          <button
            onClick={resetForm}
            className={`px-6 py-3 border-2 ${moodColor.border} ${moodColor.text} rounded-lg hover:bg-white transition-colors`}
          >
            Write Another Reflection
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-2xl w-full mx-auto ${moodColor.bg} rounded-lg p-8 border ${moodColor.border} shadow-lg`}
      >
        <h2 className={`text-2xl font-bold mb-6 ${moodColor.text}`}>
          Gratitude Reflection
        </h2>
        <form className="space-y-6">
          <TextAreaField
            label="🧡 One thing that made you smile recently"
            name="smile"
            value={answers.smile}
            onChange={handleChange}
            placeholder="E.g., a sunny walk, a funny meme..."
            moodColor={moodColor}
          />
          <TextAreaField
            label="🙏 Someone you're grateful for"
            name="gratefulPerson"
            value={answers.gratefulPerson}
            onChange={handleChange}
            placeholder="E.g., my best friend, mentor..."
            moodColor={moodColor}
          />
          <TextAreaField
            label="🌅 Something you're looking forward to"
            name="lookingForward"
            value={answers.lookingForward}
            onChange={handleChange}
            placeholder="E.g., weekend plans, finishing my project..."
            moodColor={moodColor}
          />
          <button
            type="button"
            onClick={handleSubmit}
            className={`w-full py-3 px-6 ${moodColor.text} border-2 ${moodColor.border} rounded-lg hover:bg-white transition-colors`}
          >
            Submit Reflection
          </button>
        </form>
        
        <div className="mt-8 bg-white bg-opacity-50 p-5 rounded-lg">
          <h3 className={`font-semibold ${moodColor.text} mb-2`}>Why Practice Gratitude?</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Increases positive emotions</li>
            <li>Improves sleep quality</li>
            <li>Strengthens resilience</li>
            <li>Reduces stress and anxiety</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  moodColor: {bg: string, text: string, border: string};
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  moodColor
}) => (
  <div className="bg-white bg-opacity-70 rounded-lg p-4">
    <label className={`block font-medium mb-2 ${moodColor.text}`}>{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none bg-white"
      rows={3}
    />
  </div>
);

export default GratitudePrompt;
