import React, { useState } from "react";
import { motion } from "framer-motion";

interface AffirmationWriterProps {
  moodColor?: {bg: string, text: string, border: string};
}

const affirmationTemplates = [
  "I am capable of...",
  "Today, I choose to focus on...",
  "I am grateful for...",
  "I deserve...",
  "I am proud of myself for...",
  "I release the need to...",
  "I am at my best when...",
];

const AffirmationWriter: React.FC<AffirmationWriterProps> = ({ 
  moodColor = {bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300"} 
}) => {
  const [affirmation, setAffirmation] = useState("");
  const [savedAffirmations, setSavedAffirmations] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    setAffirmation(template);
  };

  const handleAffirmationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAffirmation(e.target.value);
  };

  const saveAffirmation = () => {
    if (affirmation.trim() !== "") {
      setSavedAffirmations([...savedAffirmations, affirmation]);
      setAffirmation("");
      setSelectedTemplate("");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-2xl mx-auto ${moodColor.bg} rounded-lg p-8 border ${moodColor.border} shadow-lg`}
      >
        <h2 className={`text-2xl font-bold mb-6 ${moodColor.text}`}>Positive Affirmations</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Choose a template or write your own:</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {affirmationTemplates.map((template) => (
              <button
                key={template}
                onClick={() => handleTemplateChange(template)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedTemplate === template
                    ? `bg-white ${moodColor.text} border ${moodColor.border}`
                    : 'bg-white bg-opacity-50 text-gray-700 hover:bg-white'
                }`}
              >
                {template.substring(0, 15)}...
              </button>
            ))}
          </div>
          <textarea
            value={affirmation}
            onChange={handleAffirmationChange}
            placeholder="Write your affirmation here..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[120px] bg-white bg-opacity-70"
            rows={4}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={saveAffirmation}
            disabled={!affirmation.trim()}
            className={`px-6 py-2 rounded-lg ${
              affirmation.trim() 
                ? `${moodColor.text} border-2 ${moodColor.border} hover:bg-white` 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save Affirmation
          </button>
        </div>
        
        {savedAffirmations.length > 0 && (
          <div className="mt-8">
            <h3 className={`text-xl font-semibold mb-4 ${moodColor.text}`}>Your Affirmations:</h3>
            <div className="bg-white bg-opacity-70 rounded-lg p-4 space-y-3">
              {savedAffirmations.map((saved, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-white rounded border border-gray-200 shadow-sm"
                >
                  {saved}
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-white bg-opacity-50 p-6 rounded-lg">
          <h3 className={`font-semibold ${moodColor.text} mb-2`}>Benefits of Positive Affirmations:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Reduce negative thoughts</li>
            <li>Increase self-confidence</li>
            <li>Improve problem-solving under stress</li>
            <li>Support overall well-being</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default AffirmationWriter;
