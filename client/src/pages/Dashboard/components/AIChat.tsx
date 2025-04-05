import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Brain, User, Bot, Send} from "lucide-react";
import { Button } from "../../../components/ui/button";
import VoiceWaveAnimation from "./voice-wave-animation";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export default function AIChat() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "How are you feeling today?", sender: "ai" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [userInput, setUserInput] = useState("");
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
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
          setCurrentText(transcript);
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

  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: text,
      sender: "user" as const,
    };

    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");

    setTimeout(() => {
      setIsTyping(true);

      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          text: "Thank you for sharing. How else can I assist you today?",
          sender: "ai" as const,
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, aiResponse]);
      }, 2000);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendUserMessage(userInput);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-purple-100 h-[400px] max-w-screen-2xl w-full">
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
                  {message.text}
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex space-x-2 max-w-[80%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-gray-200">
                  <Bot className="h-5 w-5 text-gray-600" />
                </div>
                <div className="rounded-lg p-3 bg-gray-100 text-gray-800">
                  {currentText}
                  <span className="inline-block animate-pulse">▋</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
          disabled={isListening}
        />
        {userInput && (
          <Button
            type="submit"
            size="icon"
            variant="default"
            className="rounded-full bg-purple-600"
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
