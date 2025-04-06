import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Brain, User, Bot, Send } from "lucide-react";
import { Button } from "../../../components/ui/button";
import VoiceWaveAnimation from "./voice-wave-animation";
import ReactMarkdown from "react-markdown";
import Testing from "./Testing";
import PlannerPopup from "../../../components/PlannerPopup";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  isLoading?: boolean;
  hasBeenPlayed?: boolean; // New property to track if message has been auto-played
}

export default function AIChat() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "How are you feeling today?", sender: "ai" },
  ]);
  
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPlannerPopup, setShowPlannerPopup] = useState(false);
  const [_, setPlanDetails] = useState<any>(null);
  const [calendarUrl, setCalendarUrl] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) 
      {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setUserInput(transcript);
          sendUserMessage(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setIsSpeaking(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          setIsSpeaking(false);
        };

        recognitionRef.current.onaudiostart = () => {
          setIsSpeaking(true); 
        };
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

 
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error("Speech recognition error:", error);
      }
    }
  };

  const sendUserMessage = async (text: string) => {
    console.log('Sending user message:', text);
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: text,
      sender: "user" as const,
    };
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing. Please log in again.');
      return;
    }
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setLoading(true);
    
    // Add thinking message
    const thinkingMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { 
      id: thinkingMessageId, 
      text: "", 
      sender: "ai",
      isLoading: true 
    }]);

    try {
      console.log('Checking if message is a plan request');
      const planCheckRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/planner/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: text, 
          userId: token 
        }),
      });
      console.log('Plan check response status:', planCheckRes);
      if (!planCheckRes.ok) {
        console.error(`Error checking plan: ${planCheckRes.status}`);
        throw new Error('Plan check failed');
      }

      const planData = await planCheckRes.json();
      console.log('Plan check response:', planData);
      
      // If the response contains a calendarUrl, it's a planning request
      if (planData.calendarUrl) {
        // Remove thinking message
        setMessages(prev => prev.filter(m => m.id !== thinkingMessageId));
        
        // Store calendar data and show planner popup
        setCalendarUrl(planData.calendarUrl);
        setPlanDetails(planData.eventDetails || {});
        setShowPlannerPopup(true);
        
        // Add AI confirmation message
        const aiResponseId = (Date.now() + 2).toString();
        setMessages(prev => [...prev, { 
          id: aiResponseId, 
          text: "I noticed you want to schedule something. Would you like me to add this to your calendar?", 
          sender: "ai",
          hasBeenPlayed: false
        }]);
        
        setLoading(false);
        return;
      }
      
      console.log('Not a planning request, continuing with normal chat');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/response/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text, userId: token }),
      });

      const data = await res.json();
      console.log('Chat response:', data);
      
      setMessages(prev => prev.filter(m => m.id !== thinkingMessageId));
      
      const aiResponseId = (Date.now() + 2).toString();
      
      const responseText = typeof data === 'string' 
        ? data 
        : typeof data === 'object' && data !== null && 'response' in data
          ? String(data.response) 
          : "I couldn't generate a response.";
          
      setMessages(prev => [...prev, { 
        id: aiResponseId, 
        text: responseText, 
        sender: "ai",
        hasBeenPlayed: false // Mark as not played yet
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.filter(m => m.id !== thinkingMessageId));
      
      setMessages((prev) => [...prev, {
        id: (Date.now() + 3).toString(),
        text: "I'm sorry, something went wrong with my response.",
        sender: "ai"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePlannerPopup = () => {
    setShowPlannerPopup(false);
  };

  const handleAddToCalendar = () => {
    if (calendarUrl) {
      window.open(calendarUrl, '_blank');
      
      // Add confirmation message to chat
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        text: "Great! I've opened Google Calendar for you to save this event. Is there anything else you'd like to schedule?",
        sender: "ai",
        hasBeenPlayed: false
      }]);
    }
    setShowPlannerPopup(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      sendUserMessage(userInput);
    } else {
      console.error("Cannot send an empty message.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border min-h-[600px] border-purple-100 max-w-screen-2xl w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b bg-purple-50">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">AI Emotional Twin</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-8rem)]">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex space-x-2 max-w-[80%] ${
                  message.sender === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : "flex-row"
                }`}
              >
                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    message.sender === "user" ? "bg-purple-600" : "bg-gray-200"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {typeof message.text === 'string' ? (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  ) : (
                    <p>Error: Could not display message</p>
                  )}
                  {message.isLoading && (
                    <span className="ml-1 inline-block animate-pulse">Thinking...▋</span>
                  )}
                  {message.sender === "ai" && 
                   !message.isLoading && 
                   message?.text && 
                   typeof message.text === 'string' && 
                   message.text.trim() && (
                    <div className="mt-2">
                      <Testing 
                        text={message.text}
                        autoPlay={!message.hasBeenPlayed}
                        onPlayed={() => {
                          if (!message.hasBeenPlayed) {
                            setMessages(prev => 
                              prev.map(msg => 
                                msg.id === message.id 
                                  ? { ...msg, hasBeenPlayed: true } 
                                  : msg
                              )
                            );
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {showPlannerPopup && (
        <PlannerPopup
          isOpen={showPlannerPopup}
          onClose={handleClosePlannerPopup}
          onAddPlanner={handleAddToCalendar}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="p-3 border-t bg-white flex items-center space-x-2"
      >
        <input
          type="text"
          className="flex-1 rounded-lg border border-gray-300 py-2 px-3 text-sm"
          placeholder={isListening ? "Listening..." : "Type your message..."}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isListening || loading}
        />
        {userInput && (
          <Button
            type="submit"
            size="icon"
            variant="default"
            className="rounded-full bg-purple-600"
            disabled={loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
        <div className="relative flex items-center">
          <Button
            type="button"
            size="icon"
            variant={isListening ? "destructive" : "default"}
            className={`rounded-full ${
              isListening ? "bg-red-500" : "bg-purple-600"
            }`}
            onClick={toggleListening}
            disabled={loading}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>

          {isListening && (
            <div className="ml-3">
              <VoiceWaveAnimation isActive={isSpeaking} size="sm" color="#7c3aed" />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
