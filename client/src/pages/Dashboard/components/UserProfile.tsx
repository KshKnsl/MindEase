import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type UserProfileProps = {
    userData: any;
};

type UserAnswer = {
    question: string;
    answer: string;
};

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<UserAnswer[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profileCompleted, setProfileCompleted] = useState(false);
    const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
    const [allQuestionsCompleted, setAllQuestionsCompleted] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [useDummyAnswers, setUseDummyAnswers] = useState(false);
    
    const presetQuestions = [
        "How would you describe your overall mood most days?",
        "What activities bring you the most joy?",
        "What are your biggest sources of stress?",
        "How do you typically handle difficult emotions?",
        "What are your short-term goals for mental wellbeing?",
        "How would your closest friends describe your personality?",
        "What patterns or habits do you notice affecting your mental state?",
        "What personal growth areas are most important to you right now?",
        "How do you define success for yourself?",
        "What support systems do you currently have in place?"
    ];

    const dummyAnswers = [
        "Generally positive with occasional dips. I tend to be optimistic but have some anxious days, especially mid-week.",
        "Reading science fiction, hiking in nature, cooking new recipes, and spending quality time with close friends.",
        "Work deadlines, financial planning, and maintaining a healthy work-life balance are my main stressors.",
        "I usually try meditation or talking to a friend. Sometimes I isolate myself which isn't always helpful.",
        "I want to establish a consistent meditation practice and learn to set better boundaries at work.",
        "Thoughtful, reliable, somewhat reserved initially but warm once you get to know me.",
        "I notice I feel better when I exercise regularly and worse when I spend too much time on social media.",
        "Developing emotional resilience and becoming more comfortable with uncertainty.",
        "Finding balance between achievement and enjoyment, while making a positive impact on others.",
        "A small group of close friends, my therapist, and some supportive colleagues at work."
    ];

    const dummyFollowUpAnswers = [
        "I've been trying journaling lately and it's helping me track my emotional patterns.",
        "I think my perfectionism often prevents me from celebrating small wins and enjoying the process.",
        "I'd like to be more present with loved ones instead of always thinking about work.",
        "My sleep quality definitely affects my mental health - I notice I'm much more anxious when I'm sleep-deprived.",
        "I hope to develop more self-compassion and not be so critical of myself when I make mistakes."
    ];

    const [existingProfile, setExistingProfile] = useState<{responses: UserAnswer[], updatedAt: string} | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [showExistingProfile, setShowExistingProfile] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const profileData = await response.json();
                    setExistingProfile(profileData);
                    setShowExistingProfile(true);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleSubmitAnswer = async () => {
        let answerText = currentAnswer;
        
        if (useDummyAnswers) {
            if (currentQuestionIndex < presetQuestions.length) {
                answerText = dummyAnswers[currentQuestionIndex];
            } else {
                const followUpIndex = currentQuestionIndex - presetQuestions.length;
                if (followUpIndex < dummyFollowUpAnswers.length) {
                    answerText = dummyFollowUpAnswers[followUpIndex];
                }
            }
        }
        
        // Skip validation check to allow empty answers
        setIsSubmitting(true);
        
        // Use a placeholder if answer is empty
        const finalAnswer = answerText.trim() || "(No answer provided)";
        
        const newAnswers = [...answers, {
            question: currentQuestionIndex < presetQuestions.length 
                ? presetQuestions[currentQuestionIndex] 
                : followUpQuestions[currentQuestionIndex - presetQuestions.length],
            answer: finalAnswer
        }];
        
        setAnswers(newAnswers);
        setCurrentAnswer('');
        
        if (currentQuestionIndex === presetQuestions.length - 1) {
            try 
            {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/genai/ask`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        prompt: `Based on the following responses from a user, generate 5 personalized follow-up questions that would help you understand them better. Focus on their emotions, coping mechanisms, and personal growth opportunities. Make questions specific to their answers. Return ONLY the 5 questions in a numbered list format, with no other text.
                        
                        User responses:
                        ${newAnswers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n')}`
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    let questions = data.response
                        .split(/\d+\./)
                        .filter((q: string) => q.trim())
                        .map((q: string) => q.trim())
                        .slice(0, 5);
                        
                    setFollowUpQuestions(questions);
                    setProfileCompleted(true);
                }
            } catch (error) {
                console.error("Failed to generate follow-up questions:", error);
            }
        }
        
        if (currentQuestionIndex < presetQuestions.length + 4) { 
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setAllQuestionsCompleted(true);
            await saveUserProfile(newAnswers);

            
        }
        
        setIsSubmitting(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // Always allow submission regardless of content
            handleSubmitAnswer();
        }
    };

    const saveUserProfile = async (completedAnswers: UserAnswer[]) => {
        setSavingProfile(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    profileData: completedAnswers
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save profile');
            }
            
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setSavingProfile(false);
        }
    };

    const handleRetest = () => {
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setCurrentAnswer('');
        setProfileCompleted(false);
        setFollowUpQuestions([]);
        setAllQuestionsCompleted(false);
        setShowExistingProfile(false);
    };

    if (isLoadingProfile) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (showExistingProfile && existingProfile && existingProfile.responses && existingProfile.responses.length > 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-3xl mx-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-purple-800">Your Profile</h2>
                    <button
                        onClick={handleRetest}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                        Retake Assessment
                    </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <p className="text-gray-700 mb-4">
                        MindEase uses your profile information to personalize responses and provide better support.
                    </p>
                    
                    <p className="text-sm text-gray-500 mb-6">
                        Last updated: {new Date(existingProfile.updatedAt).toLocaleDateString()}
                    </p>
                    
                    <div className="space-y-6">
                        {existingProfile.responses.map((item, index) => (
                            <div key={index} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                                <h3 className="font-medium text-purple-700 mb-2">{item.question}</h3>
                                <p className="text-gray-600 whitespace-pre-line">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <div className="bg-purple-100 rounded-full p-2 mr-3">
                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Want to update your profile? You can retake the assessment at any time to help MindEase better understand your current state and needs.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (allQuestionsCompleted) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg"
            >
                <h2 className="text-2xl font-bold text-purple-800 mb-4">Thank You!</h2>
                <p className="text-gray-700 mb-6">
                    Thank you for sharing your thoughts and feelings. MindEase will now better understand your
                    needs and provide more personalized responses in your conversations.
                </p>
                <p className="text-gray-600 italic mb-6">
                    Your information helps us create a more tailored experience for you. You can always update your profile later.
                </p>
                <button
                    onClick={handleRetest}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                    Take Assessment Again
                </button>
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => {
                            const aiButton = document.querySelector('button[data-tab="ai"]') as HTMLButtonElement;
                            if (aiButton) aiButton.click();
                        }}
                        className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                        Chat with AI Twin
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-800">Let Me Know You</h2>
                
                {/* Demo mode toggle for judges */}
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        id="demoMode" 
                        checked={useDummyAnswers}
                        onChange={() => setUseDummyAnswers(!useDummyAnswers)}
                        className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 rounded"
                    />
                    <label htmlFor="demoMode" className="text-sm text-gray-600">
                        Demo Mode (For Judges)
                    </label>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6">
                    <p className="text-gray-600 mb-2">Question {currentQuestionIndex + 1} of {presetQuestions.length + (followUpQuestions.length || 5)}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${(currentQuestionIndex / (presetQuestions.length + 5)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">
                        {currentQuestionIndex < presetQuestions.length 
                            ? presetQuestions[currentQuestionIndex] 
                            : followUpQuestions[currentQuestionIndex - presetQuestions.length]}
                    </h3>
                    
                    <textarea
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        rows={4}
                        value={useDummyAnswers ? 
                            (currentQuestionIndex < presetQuestions.length ? 
                                dummyAnswers[currentQuestionIndex] : 
                                dummyFollowUpAnswers[currentQuestionIndex - presetQuestions.length] || '') : 
                            currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Your answer..."
                        disabled={isSubmitting}
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">Press Enter to submit your answer. Use Shift+Enter for line breaks.</p>
                </div>

                <div className="flex justify-end">
                    <button
                        className="px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                        onClick={handleSubmitAnswer}
                    >
                        {isSubmitting ? 'Submitting...' : currentQuestionIndex === presetQuestions.length + 4 ? 'Complete Profile' : 'Next Question'}
                    </button>
                </div>
            </div>

            {/* Progress details */}
            <div className="mt-6 text-sm text-gray-500">
                {profileCompleted && (
                    <p>
                        You've completed the initial questions. Now, let's explore some personalized follow-up questions based on your answers.
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;