import { ElevenLabsClient } from "elevenlabs";
import { useEffect, useState, useRef } from "react";

interface TextToSpeechProps {
    text: string;
}

const TextToSpeech = ({ text }: TextToSpeechProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    useEffect(() => {
        const convertTextToSpeech = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const client = new ElevenLabsClient({ 
                    apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY 
                });
                
                const result = await client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
                    output_format: "mp3_44100_128",
                    text: text,
                    model_id: "eleven_multilingual_v2"
                });
                
                console.log("Text to speech conversion successful", result);
                
                // Convert the stream response to a blob and create a URL
                const chunks: Uint8Array[] = [];
                for await (const chunk of result) {
                    chunks.push(chunk);
                }
                
                // Combine chunks without using Buffer
                const totalLength = chunks.reduce((acc, val) => acc + val.length, 0);
                const combinedArray = new Uint8Array(totalLength);
                let offset = 0;
                for (const chunk of chunks) {
                    combinedArray.set(chunk, offset);
                    offset += chunk.length;
                }
                
                const blob = new Blob([combinedArray], { type: "audio/mpeg" });
                const url = URL.createObjectURL(blob);
                
                // Set the audio source and play it
                if (audioRef.current) {
                    audioRef.current.src = url;
                    audioRef.current.play();
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error converting text to speech:", err);
                setError("Failed to convert text to speech. Check your API key.");
                setLoading(false);
            }
        };
        
        if (text) {
            convertTextToSpeech();
        } else {
            setLoading(false);
        }
    }, [text]);

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <audio ref={audioRef} controls />
        </div>
    );
};

export default TextToSpeech;
