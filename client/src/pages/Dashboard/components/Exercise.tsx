import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const prompts = [
    { count: 5, text: "things you can see" },
    { count: 4, text: "things you can touch" },
    { count: 3, text: "things you can hear" },
    { count: 2, text: "things you can smell" },
    { count: 1, text: "thing you can taste" },
];

const GroundingExercise: React.FC = () => {
    const [step, setStep] = useState(0);
    const [inputs, setInputs] = useState<string[][]>(
        prompts.map((p) => Array(p.count).fill(""))
    );
    const [completed, setCompleted] = useState(false);
    const navigate = useNavigate();

    const handleChange = (value: string, idx: number) => {
        const newInputs = [...inputs];
        newInputs[step][idx] = value;
        setInputs(newInputs);
    };

    const nextStep = () => {
        if (step < prompts.length - 1) {
            setStep(step + 1);
        } else {
            setCompleted(true);
            setTimeout(() => {
                navigate("/");
            }, 3000); // Redirect to "/" after 3 seconds
        }
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    return (
        <div
            className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between"
            style={{ minHeight: "450px" }} // Set a fixed minimum height
        >
            <div>
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                    5-4-3-2-1 Grounding Exercise
                </h2>

                {!completed ? (
                    <>
                        <p className="text-gray-600 text-center mb-6">
                            {`Name ${prompts[step].count} ${prompts[step].text}`}
                        </p>

                        <div className="space-y-2">
                            {inputs[step].map((item, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    placeholder={`${prompts[step].text} ${idx + 1}`}
                                    value={item}
                                    onChange={(e) => handleChange(e.target.value, idx)}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="mt-6 text-center text-lg text-gray-700">
                        Congratulations! You've completed the grounding exercise. Redirecting
                        you to the homepage...
                    </p>
                )}
            </div>

            <div className="flex justify-between mt-6">
                <button
                    disabled={step === 0}
                    onClick={prevStep}
                    className={`px-4 py-2 rounded-full ${
                        step === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    Back
                </button>
                <button
                    onClick={nextStep}
                    className={`px-4 py-2 rounded-full ${
                        step === prompts.length - 1
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    {step === prompts.length - 1 ? "Finish" : "Next"}
                </button>
            </div>
        </div>
    );
};

export default GroundingExercise;
