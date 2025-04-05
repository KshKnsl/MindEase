import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Brain, User, Bot, Send, Volume2, VolumeX, Repeat } from "lucide-react";
import { Button } from "../../../components/ui/button";
import VoiceWaveAnimation from "./voice-wave-animation";
import ReactMarkdown from "react-markdown";
import { ElevenLabsClient } from "elevenlabs";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  isLoading?: boolean;
  hasBeenSpoken?: boolean;
}

export default function AIChat() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "How are you feeling today?", sender: "ai" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentText, setCurrentText] = useState(""); // Removed unused state variable 'currentText'
  const client = new ElevenLabsClient({ apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY });
  console.log(client);

  
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(true);
  const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState<HTMLAudioElement | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Play speech for new AI messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && 
        lastMessage.sender === 'ai' && 
        !lastMessage.isLoading && 
        textToSpeechEnabled && 
        !lastMessage.hasBeenSpoken) {
      
      // Wait for streaming to complete
      const timeoutId = setTimeout(() => {
        // Stop any currently playing audio
        if (currentlyPlayingAudio) {
          currentlyPlayingAudio.pause();
          currentlyPlayingAudio.currentTime = 0;
        }

        if (!lastMessage.text.trim()) return;
        
        // Play the message and mark it as spoken
        playAIMessage(lastMessage.text);
        
        // Mark message as spoken
        setMessages(prev => prev.map(msg => 
          msg.id === lastMessage.id ? { ...msg, hasBeenSpoken: true } : msg
        ));
      }, 500); // Wait 500ms after last update

      return () => clearTimeout(timeoutId);
    }
  }, [messages, textToSpeechEnabled]);

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

  const toggleTextToSpeech = () => {
    setTextToSpeechEnabled(!textToSpeechEnabled);
    
    // Stop current audio if disabling text-to-speech
    if (textToSpeechEnabled && currentlyPlayingAudio) {
      currentlyPlayingAudio.pause();
      currentlyPlayingAudio.currentTime = 0;
      setCurrentlyPlayingAudio(null);
      setIsSpeaking(false);
    }
  };

  // Extract common speech functionality to a single function
  const playAIMessage = (text: string) => {
    // Stop any currently playing audio
    if (currentlyPlayingAudio) {
      currentlyPlayingAudio.pause();
      currentlyPlayingAudio.currentTime = 0;
    }

    // Don't speak if the message is empty
    if (!text.trim()) return;
    
    // You need to create an audio URL or use ElevenLabs API to get audio
    const audioUrl = ""; // Replace with actual audio URL from ElevenLabs
    const audio = new Audio(audioUrl);
    setCurrentlyPlayingAudio(audio);
    audioRef.current = audio;
    
    audio.onplay = () => setIsSpeaking(true);
    audio.onended = () => {
      setIsSpeaking(false);
      setCurrentlyPlayingAudio(null);
    };
    
    audio.play().catch(err => console.error("Error playing audio:", err));
  }

  // Manually trigger speech for a specific message (for the Listen button)
  const playMessageAudio = (text: string) => {
    if (textToSpeechEnabled) {
      playAIMessage(text);
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
      console.log('Sending message:', text);
      const res = await fetch('http://localhost:5000/api/response/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text, userId: token }),
      });

      console.log('Response:', res);
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      console.log('Response data:', data);
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: data || "I'm sorry, I couldn't generate a response.",
        sender: "ai" as const,
      };
      const reader = res.body?.getReader();
      let fullResponse = '';
      
      setMessages(prev => prev.filter(m => m.id !== thinkingMessageId));
      
      const aiResponseId = (Date.now() + 2).toString();
      setMessages(prev => [...prev, { 
        id: aiResponseId, 
        text: '', 
        sender: "ai"
      }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          // Convert the chunk to text
          const chunk = new TextDecoder().decode(value);
          try {
            // Assuming each chunk is a JSON with response property
            const chunkData = JSON.parse(chunk);
            fullResponse += chunkData.response || '';
            
            // Update the AI message with the current accumulated response
            setMessages(prev => prev.map(m => 
              m.id === aiResponseId ? { ...m, text: fullResponse, hasBeenSpoken: false } : m
            ));
          } catch (e) {
            // If not valid JSON, just append as text
            fullResponse += chunk;
            setMessages(prev => prev.map(m => 
              m.id === aiResponseId ? { ...m, text: fullResponse, hasBeenSpoken: false } : m
            ));
          }
        }
      } else {
        const data = await res.json();
        setMessages(prev => prev.map(m => 
          m.id === aiResponseId ? { ...m, text: data.response || "I couldn't generate a response." } : m
        ));
      }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      sendUserMessage(userInput);
    } else {
      console.error("Cannot send an empty message.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border h-[600px] border-purple-100 max-w-screen-2xl w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b bg-purple-50">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">AI Emotional Twin</h3>
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleTextToSpeech}
          className="rounded-full"
          title={textToSpeechEnabled ? "Mute voice" : "Enable voice"}
        >
          {textToSpeechEnabled ? (
            <Volume2 className="h-5 w-5 text-purple-600" />
          ) : (
            <VolumeX className="h-5 w-5 text-gray-400" />
          )}
        </Button>
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
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                  {message.isLoading && (
                    <span className="ml-1 inline-block animate-pulse">Thinking...▋</span>
                  )}
                  {message.sender === "ai" && !message.isLoading && message.text.trim() && (
                    <div className="mt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="p-1 h-7 text-xs flex items-center text-purple-600 hover:bg-purple-50"
                        onClick={() => playMessageAudio(message.text)}
                      >
                        <Repeat className="h-3 w-3 mr-1" /> Listen
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
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
