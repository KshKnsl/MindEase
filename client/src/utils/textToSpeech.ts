import axios from 'axios';

export interface TextToSpeechOptions {
  text: string;
  voiceId?: string;
  onError?: (error: any) => void;
}

export const textToSpeech = async ({ 
    text, 
    voiceId = 'en-IN-isha', 
    onError 
}: TextToSpeechOptions): Promise<string> => {
    try {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:5000/api/tts/generate',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                text: text,
                voiceId: voiceId
            }
        });
        
        return response.data.audioUrl;
    } catch (error) {
        console.error('Error generating speech:', error);
        if (onError) onError(error);
        throw error;
    }
};

// Use browser's built-in Audio API as fallback
export const speakWithBrowserAPI = (text: string): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Browser does not support speech synthesis');
  }
};
