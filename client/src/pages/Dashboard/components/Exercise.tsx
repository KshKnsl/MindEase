import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type Quote = {
  text: string;
  author: string;
};

const quotes: Quote[] = [
  { text: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.", author: "Oprah Winfrey" },
  { text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time and be yourself.", author: "Hermann Hesse" },
  { text: "You are the sky. Everything else is just the weather.", author: "Pema Chödrön" },
  { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
  { text: "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.", author: "Wayne Dyer" },
];

const prompts = [
    { count: 5, text: "things you can see" },
    { count: 4, text: "things you can touch" },
    { count: 3, text: "things you can hear" },
    { count: 2, text: "things you can smell" },
    { count: 1, text: "thing you can taste" },
];

const ProgressBar: React.FC<{ step: number; totalSteps: number }> = ({ step, totalSteps }) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        ></div>
    </div>
);

const StepInputs: React.FC<{
    step: number;
    inputs: string[];
    prompt: string;
    onInputChange: (value: string, idx: number) => void;
}> = ({ step, inputs, prompt, onInputChange }) => (
    <div className="space-y-4">
        {inputs.map((item, idx) => (
            <input
                key={idx}
                type="text"
                placeholder={`${prompt} ${idx + 1}`}
                value={item}
                onChange={(e) => onInputChange(e.target.value, idx)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        ))}
    </div>
);

interface GroundingExerciseProps {
  moodColor?: {bg: string, text: string, border: string};
}

const GroundingExercise: React.FC<GroundingExerciseProps> = ({ moodColor = {bg: "bg-green-100", text: "text-green-800", border: "border-green-300"} }) => {
    const [step, setStep] = useState(0);
    const [inputs, setInputs] = useState<string[][]>(
        prompts.map((p) => Array(p.count).fill(""))
    );
    const [completed, setCompleted] = useState(false);
    const navigate = useNavigate();
    const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

    useEffect(() => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setCurrentQuote(randomQuote);
    }, []);

    const handleChange = (value: string, idx: number) => {
        const updatedInputs = [...inputs];
        updatedInputs[step][idx] = value;
        setInputs(updatedInputs);
    };

    const nextStep = () => {
        if (step < prompts.length - 1) {
            setStep(step + 1);
        } else {
            setCompleted(true);
            setTimeout(() => navigate("/dashboard"), 3000);
        }
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const getNewQuote = () => {
        let newQuote = quotes[Math.floor(Math.random() * quotes.length)];
        while (newQuote.text === currentQuote?.text) {
            newQuote = quotes[Math.floor(Math.random() * quotes.length)];
        }
        setCurrentQuote(newQuote);
    };

    return (
        <div className="flex items-center justify-center h-full w-full p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`max-w-2xl w-full mx-auto ${moodColor.bg} rounded-lg p-8 border ${moodColor.border} shadow-lg`}
            >
                <h2 className={`text-2xl font-bold mb-6 ${moodColor.text}`}>Grounding Exercise</h2>
                
                {currentQuote && (
                    <div className="mb-8">
                        <blockquote className="text-2xl italic font-semibold text-gray-700 mb-4">
                            "{currentQuote.text}"
                        </blockquote>
                        <cite className={`block text-right ${moodColor.text}`}>— {currentQuote.author}</cite>
                    </div>
                )}
                
                <div className="bg-white bg-opacity-50 rounded-lg p-6 mb-6">
                    <h3 className={`text-lg font-semibold mb-3 ${moodColor.text}`}>5-4-3-2-1 Grounding Technique</h3>
                    <ol className="space-y-3 text-gray-700">
                        <li><strong>5 things you can see</strong> - Look around and acknowledge 5 things around you</li>
                        <li><strong>4 things you can touch</strong> - Notice 4 things you can physically feel</li>
                        <li><strong>3 things you can hear</strong> - Listen for 3 distinct sounds</li>
                        <li><strong>2 things you can smell</strong> - Notice 2 scents around you</li>
                        <li><strong>1 thing you can taste</strong> - Acknowledge 1 thing you can taste</li>
                    </ol>
                </div>
                
                {!completed ? (
                    <>
                        <div className="mb-4">
                            <p className="text-lg text-gray-600 text-center">
                                Step {step + 1} of {prompts.length}
                            </p>
                            <ProgressBar step={step} totalSteps={prompts.length} />
                        </div>

                        <p className="text-center text-gray-700 mb-6">
                            {`Name ${prompts[step].count} ${prompts[step].text}`}
                        </p>

                        <StepInputs
                            step={step}
                            inputs={inputs[step]}
                            prompt={prompts[step].text}
                            onInputChange={handleChange}
                        />

                        <div className="flex justify-between mt-8">
                            <button
                                disabled={step === 0}
                                onClick={prevStep}
                                className={`px-6 py-2 rounded-lg ${
                                    step === 0
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                            >
                                Back
                            </button>
                            <button
                                onClick={nextStep}
                                className={`px-6 py-2 rounded-lg ${
                                    step === prompts.length - 1
                                        ? "bg-green-500 text-white hover:bg-green-600"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                            >
                                {step === prompts.length - 1 ? "Finish" : "Next"}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-lg text-gray-700 mb-4">
                            Congratulations! You've completed the grounding exercise.
                        </p>
                        <p className="text-gray-500">Redirecting you to the homepage...</p>
                    </div>
                )}

                <button
                    onClick={getNewQuote}
                    className={`w-full py-3 px-6 rounded-lg ${moodColor.text} border ${moodColor.border} hover:bg-white transition-colors mt-8`}
                >
                    Show Another Quote
                </button>
            </motion.div>
        </div>
    );
};

export default GroundingExercise;
