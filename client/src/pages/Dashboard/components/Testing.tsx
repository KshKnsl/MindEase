import { ElevenLabsClient } from "elevenlabs";
import { Repeat } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "../../../components/ui/button";

interface TextToSpeechProps {
    text: string;
    autoPlay?: boolean; // New prop to trigger auto-play
    onPlayed?: () => void; // Callback for when auto-play completes
}

const TextToSpeech = ({ text, autoPlay = false, onPlayed }: TextToSpeechProps) => {
    const [loading, setLoading] = useState(false); 
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hasAutoPlayedRef = useRef<boolean>(false);
    
    // Generate speech
    const generateSpeech = async () => {
        if (loading) return;
        
        setLoading(true);
        
        try {
            const client = new ElevenLabsClient({ 
                apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY 
            });
            console.log("Client initialized:", import.meta.env.VITE_ELEVENLABS_API_KEY);
            console.log("Client initialized:", client);
            
            const result = await client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
                output_format: "mp3_44100_128",
                text: text,
                model_id: "eleven_multilingual_v2"
            });
            console.log("Audio stream:", result);
            
            const chunks: Uint8Array[] = [];
            for await (const chunk of result) {
                chunks.push(chunk);
            }
            console.log("Audio chunks:", chunks);

            const totalLength = chunks.reduce((acc, val) => acc + val.length, 0);
            const combinedArray = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
                combinedArray.set(chunk, offset);
                offset += chunk.length;
            }
            
            console.log("Combined audio array:", combinedArray);
            const blob = new Blob([combinedArray], { type: "audio/mpeg" });
            const url = URL.createObjectURL(blob);
            
            console.log("Audio URL:", url);
            setAudioUrl(url);
            
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
                
                if (!hasAutoPlayedRef.current && autoPlay) {
                    hasAutoPlayedRef.current = true;
                    onPlayed?.();
                }
            }
            
        } catch (err) {
            console.error("Error converting text to speech:", err);
        } finally {
            setLoading(false);
        }
    };
    
    // Play existing audio
    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };
    
    const handleGenerateSpeech = () => {
        if (audioUrl) {
            playAudio();
        } else {
            generateSpeech();
        }
    };
    
    useEffect(() => {
        if (autoPlay && !hasAutoPlayedRef.current) {
            generateSpeech();
        }
    }, [autoPlay]);
    
    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);
    
    useEffect(() => {
        const audioElement = audioRef.current;
        
        if (audioElement) {
            const handleEnded = () => {
                if (!hasAutoPlayedRef.current && autoPlay) {
                    hasAutoPlayedRef.current = true;
                    onPlayed?.();
                }
            };
            
            audioElement.addEventListener('ended', handleEnded);
            
            return () => {
                audioElement.removeEventListener('ended', handleEnded);
            };
        }
    }, [autoPlay, onPlayed]);

    return (
        <div>
            <Button
                onClick={handleGenerateSpeech}
                variant="ghost"
                size="sm"
                className="p-1 h-7 text-xs flex items-center text-purple-600 hover:bg-purple-50"
                disabled={loading}
            >
                <Repeat className="h-3 w-3 mr-1" />
                {loading ? "Loading..." : "Listen"}
            </Button>
            <audio ref={audioRef} style={{ display: "none" }} />
        </div>
    );
};

export default TextToSpeech;