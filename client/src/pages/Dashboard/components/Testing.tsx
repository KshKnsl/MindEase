import { Repeat } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "../../../components/ui/button";

interface TextToSpeechProps {
    text: string;
    autoPlay?: boolean; // New prop to trigger auto-play
    onPlayed?: () => void; // Callback for when auto-play completes
}

const TextToSpeech = ({ text, autoPlay = false, onPlayed }: TextToSpeechProps) => {
    const hasAutoPlayedRef = useRef<boolean>(false);

    const speakText = () => {
        if (!text) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
            if (autoPlay && !hasAutoPlayedRef.current) {
                hasAutoPlayedRef.current = true;
                onPlayed?.();
            }
        };

        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (autoPlay && !hasAutoPlayedRef.current) {
            hasAutoPlayedRef.current = true;
            speakText();
        }
    }, [autoPlay]);

    return (
        <div>
            <Button
                onClick={speakText}
                variant="ghost"
                size="sm"
                className="p-1 h-7 text-xs flex items-center text-purple-600 hover:bg-purple-50"
            >
                <Repeat className="h-3 w-3 mr-1" />
                Listen
            </Button>
        </div>
    );
};

export default TextToSpeech;
